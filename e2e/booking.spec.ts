import { expect, request as playwrightRequest, test } from "@playwright/test";

const apiBaseURL = process.env.E2E_API_BASE_URL || "http://127.0.0.1:8000";
const browserBaseURL = process.env.E2E_BASE_URL || "http://127.0.0.1:5173";
const studentEmail = process.env.E2E_STUDENT_EMAIL || "student@elmullim.test";
const studentPassword = process.env.E2E_STUDENT_PASSWORD || "Student@12345";

test("student can create and cancel a booking through the real API", async ({ page }) => {
  const api = await playwrightRequest.newContext({ baseURL: apiBaseURL });

  try {
    const loginResponse = await api.post("/api/student/login", {
      data: {
        email: studentEmail,
        password: studentPassword,
      },
    });
    expect(loginResponse.ok()).toBeTruthy();

    const loginBody = await loginResponse.json();
    expect(loginBody.status).toBe(true);
    const token = loginBody.data.token as string;
    expect(token).toBeTruthy();

    const lessonsResponse = await api.get("/api/lessons/all");
    expect(lessonsResponse.ok()).toBeTruthy();

    const lessonsBody = await lessonsResponse.json();
    const lessons = Array.isArray(lessonsBody.data) ? lessonsBody.data : [];
    const lesson = lessons.find(
      (item: { id: number; booking_type?: string; publishing_status?: string }) =>
        (item.booking_type === "private" || item.booking_type === "group") &&
        item.publishing_status === "published"
    );

    expect(lesson?.id).toBeTruthy();

    const bookingsResponse = await api.get("/api/bookings", {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(bookingsResponse.ok()).toBeTruthy();

    const bookingsBody = await bookingsResponse.json();
    const existingBooking = bookingsBody.data.find(
      (booking: { lesson_id: number; status: string }) =>
        booking.lesson_id === lesson.id &&
        [
          "booking_requested",
          "pending_teacher_approval",
          "accepted",
          "confirmed",
          "upcoming",
          "in_progress",
          "rescheduled",
        ].includes(booking.status)
    );

    if (existingBooking) {
      const cleanupResponse = await api.post(`/api/bookings/${existingBooking.id}/cancel`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(cleanupResponse.ok()).toBeTruthy();
    }

    await page.context().addCookies([
      {
        name: "t_n",
        value: token,
        url: browserBaseURL,
        path: "/",
        sameSite: "Strict",
        secure: false,
      },
      {
        name: "r_l",
        value: "student",
        url: browserBaseURL,
        path: "/",
        sameSite: "Strict",
        secure: false,
      },
    ]);

    await page.goto(new URL(`/lessons/${lesson.id}`, browserBaseURL).toString());

    const bookButton = page.getByRole("button", { name: /Book now/i });
    await expect(bookButton).toBeVisible();
    await bookButton.click();

    const requestedTime = "2099-01-10T20:00";
    await page.getByLabel(/Requested date & time/i).fill(requestedTime);

    const bookingResponsePromise = page.waitForResponse((response) =>
      response.url().includes(`/api/lessons/${lesson.id}/bookings`) &&
      response.request().method() === "POST"
    );

    await page.getByRole("button", { name: /Submit booking/i }).click();

    const bookingResponse = await bookingResponsePromise;
    expect(bookingResponse.ok()).toBeTruthy();

    const bookingBody = await bookingResponse.json();
    expect(bookingBody.status).toBe(true);
    expect(bookingBody.data.lesson_id).toBe(lesson.id);
    expect(bookingBody.data.status).toBe(
      lesson.booking_type === "private" ? "pending_teacher_approval" : "booking_requested"
    );

    const cleanupResponse = await api.post(`/api/bookings/${bookingBody.data.id}/cancel`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(cleanupResponse.ok()).toBeTruthy();
  } finally {
    await api.dispose();
  }
});
