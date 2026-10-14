import { expect, test, type BrowserContext, type Page } from "@playwright/test";

type ProviderStatus = "success" | "failed" | "pending";

const course = (hasEnrolled = true) => ({
  id: 7,
  title: "Physics Fundamentals",
  description: "Learn the fundamentals of physics through clear lessons.",
  image: "",
  level: "beginner",
  price: "250.00",
  publishing_status: "published",
  hasEnrolled,
  created_at: "2026-01-01T00:00:00.000000Z",
  updated_at: "2026-01-01T00:00:00.000000Z",
  teacher: {
    id: 3,
    name: "Teacher One",
    profile_image: null,
  },
  sub_category: {
    id: 4,
    name: "Physics",
    category: { id: 2, name: "Science" },
  },
});

async function mockCoursePayment(
  page: Page,
  context: BrowserContext,
  providerStatus: ProviderStatus,
) {
  await context.addCookies([
    {
      name: "t_n",
      value: "course-payment-test-token",
      domain: "127.0.0.1",
      path: "/",
      sameSite: "Lax",
    },
    {
      name: "r_l",
      value: "student",
      domain: "127.0.0.1",
      path: "/",
      sameSite: "Lax",
    },
  ]);

  await page.addInitScript(() => {
    localStorage.setItem("elmullim-language", "en");
  });

  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const method = request.method();
    const pathname = new URL(request.url()).pathname.replace(/\/+$/, "");

    const respond = (data: unknown, status = 200) =>
      route.fulfill({
        status,
        contentType: "application/json",
        body: JSON.stringify({ status: status < 400, message: null, data }),
      });

    if (pathname.endsWith("/check-auth") && method === "POST") {
      return respond({ auth: true, role: "student", "email-verified": true });
    }

    if (pathname === "/api/student/payment/status" && method === "GET") {
      return respond({
        status: providerStatus,
        payment_method: "card",
        orderable_type: "courses",
        orderable_id: 7,
        course_id: 7,
        booking_id: null,
        transaction_id: providerStatus === "success" ? 555001 : null,
      });
    }

    if (pathname === "/api/courses/7/details" && method === "GET") {
      return respond(course(true));
    }

    if (pathname === "/api/courses/7/contents" && method === "GET") {
      return respond([
        { id: 11, title: "Unit 1", description: "Introduction to physics." },
      ]);
    }

    if (pathname === "/api/courses/7/11/lectures" && method === "GET") {
      return respond([
        {
          id: 21,
          title: "Lecture 1",
          description: "Motion and measurements.",
          duration: 600,
          videoUrl: "",
          hasVideo: true,
          quiz: null,
        },
      ]);
    }

    if (pathname === "/api/general/4/courses" && method === "GET") {
      return respond([]);
    }

    // All requests remain local and use deterministic fixtures; no payment is sent.
    return respond([]);
  });
}

test("opens paid course content only after the API confirms payment success", async ({
  page,
  context,
}) => {
  await mockCoursePayment(page, context, "success");

  await page.goto("/payment/result?order=5001&sig=test-signature");

  await expect(
    page.getByText(
      "Payment completed successfully and your purchase is now available.",
    ),
  ).toBeVisible();

  const openCourse = page.getByRole("link", { name: "Open course" });
  await expect(openCourse).toHaveAttribute("href", "/courses/7/view");
  await openCourse.click();

  await expect(page).toHaveURL(/\/courses\/7\/view$/);
  await expect(
    page.getByRole("heading", { name: "Watch now", level: 1 }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Physics Fundamentals", level: 2 }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Lecture 1", level: 3 }),
  ).toBeVisible();
});

test("does not offer course access when the payment provider reports failure", async ({
  page,
  context,
}) => {
  await mockCoursePayment(page, context, "failed");

  await page.goto("/payment/result?order=5002&sig=test-signature");

  await expect(
    page.getByText(
      "The payment was not completed. You can try again from the course page.",
    ),
  ).toBeVisible();

  const backToCourse = page.getByRole("link", { name: "Back to course" });
  await expect(backToCourse).toHaveAttribute("href", "/courses/7");
  await expect(
    page.getByRole("link", { name: "Open course" }),
  ).not.toBeVisible();
});
