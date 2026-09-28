import { expect, request as playwrightRequest, test } from "@playwright/test";

const apiBaseURL = process.env.E2E_API_BASE_URL || "http://127.0.0.1:8000";
const browserBaseURL = process.env.E2E_BASE_URL || "http://127.0.0.1:5173";
const studentEmail = process.env.E2E_STUDENT_EMAIL || "student@elmullim.test";
const studentPassword = process.env.E2E_STUDENT_PASSWORD || "Student@12345";

const browserUrl = new URL(browserBaseURL);

if (browserUrl.protocol !== "http:" && browserUrl.protocol !== "https:") {
  throw new Error("Unsupported E2E_BASE_URL protocol: " + browserUrl.protocol);
}

const dateInputValue = (offset: number) => {
  const date = new Date();
  date.setUTCHours(12, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
};

const isoWeekday = (dateString: string) => {
  const date = new Date(dateString + "T12:00:00Z");
  const day = date.getUTCDay();
  return day === 0 ? 7 : day;
};

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
    const bookableLessons = lessons.filter(
      (item: { id: number; booking_type?: string; publishing_status?: string }) =>
        (item.booking_type === "private" || item.booking_type === "group") &&
        item.publishing_status === "published"
    );

    expect(bookableLessons.length).toBeGreaterThan(0);

    let candidate: {
      lesson: { id: number; booking_type: "private" | "group" };
      date: string;
      option: {
        requested_start_at: string;
        local_time: string;
        timezone: string;
        is_available: boolean;
      };
    } | null = null;

    for (const lesson of bookableLessons) {
      const availabilityResponse = await api.get(
        "/api/lessons/" + lesson.id + "/availability"
      );
      if (!availabilityResponse.ok()) {
        continue;
      }

      const availabilityBody = await availabilityResponse.json();
      const slots = Array.isArray(availabilityBody.data) ? availabilityBody.data : [];
      const weekdays = new Set<number>(
        slots
          .filter((slot: { is_active?: boolean }) => slot.is_active !== false)
          .map((slot: { day_of_week: number }) => Number(slot.day_of_week))
      );

      for (let offset = 2; offset <= 30 && !candidate; offset += 1) {
        const date = dateInputValue(offset);
        if (!weekdays.has(isoWeekday(date))) {
          continue;
        }

        const optionsResponse = await api.get(
          "/api/lessons/" + lesson.id + "/availability?date=" + date
        );
        if (!optionsResponse.ok()) {
          continue;
        }

        const optionsBody = await optionsResponse.json();
        const option = (Array.isArray(optionsBody.data) ? optionsBody.data : []).find(
          (item: {
            requested_start_at: string;
            local_time: string;
            timezone: string;
            is_available: boolean;
          }) => item.is_available
        );

        if (option) {
          candidate = {
            lesson: {
              id: lesson.id,
              booking_type: lesson.booking_type as "private" | "group",
            },
            date,
            option,
          };
        }
      }

      if (candidate) {
        break;
      }
    }

    expect(candidate).not.toBeNull();

    const bookingsResponse = await api.get("/api/bookings", {
      headers: { Authorization: "Bearer " + token },
      params: { per_page: 100 },
    });
    expect(bookingsResponse.ok()).toBeTruthy();

    const bookingsBody = await bookingsResponse.json();
    const existingExactBooking = (Array.isArray(bookingsBody.data) ? bookingsBody.data : []).find(
      (booking: { lesson_id: number; requested_start_at?: string }) =>
        booking.lesson_id === candidate!.lesson.id &&
        booking.requested_start_at === candidate!.option.requested_start_at
    );

    expect(existingExactBooking).toBeFalsy();

    await page.context().addCookies([
      {
        name: "t_n",
        value: token,
        domain: browserUrl.hostname,
        path: "/",
        sameSite: "Strict",
        secure: browserUrl.protocol === "https:",
      },
      {
        name: "r_l",
        value: "student",
        domain: browserUrl.hostname,
        path: "/",
        sameSite: "Strict",
        secure: browserUrl.protocol === "https:",
      },
    ]);

    await page.goto(
      new URL("/lessons/" + candidate!.lesson.id, browserBaseURL).toString()
    );

    const bookButton = page.getByRole("button", { name: /Book now/i });
    await expect(bookButton).toBeVisible();
    await bookButton.click();

    await page.locator('input[type="date"]').fill(candidate!.date);

    const timeValue =
      candidate!.lesson.booking_type === "group"
        ? candidate!.option.requested_start_at
        : candidate!.option.local_time + "|" + candidate!.option.timezone;

    await page
      .locator('select[aria-label="Choose available time"]')
      .selectOption(timeValue);

    const bookingResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("/api/lessons/" + candidate!.lesson.id + "/bookings") &&
        response.request().method() === "POST"
    );

    await page.getByRole("button", { name: /Submit booking/i }).click();

    const bookingResponse = await bookingResponsePromise;
    expect(bookingResponse.ok()).toBeTruthy();

    const bookingBody = await bookingResponse.json();
    expect(bookingBody.status).toBe(true);
    expect(bookingBody.data.lesson_id).toBe(candidate!.lesson.id);
    expect(bookingBody.data.status).toBe(
      candidate!.lesson.booking_type === "private"
        ? "pending_teacher_approval"
        : "booking_requested"
    );

    const cleanupResponse = await api.post(
      "/api/bookings/" + bookingBody.data.id + "/cancel",
      {},
      {
        headers: { Authorization: "Bearer " + token },
      }
    );
    expect(cleanupResponse.ok()).toBeTruthy();
  } finally {
    await api.dispose();
  }
});
