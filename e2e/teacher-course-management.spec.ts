import { expect, test } from "@playwright/test";

test("teacher can manage a draft course and must confirm before deleting it", async ({ page, context }) => {
  let deleteRequested = false;

  await context.addCookies([
    {
      name: "t_n",
      value: "teacher-course-test-token",
      domain: "127.0.0.1",
      path: "/",
      sameSite: "Lax",
    },
    {
      name: "r_l",
      value: "teacher",
      domain: "127.0.0.1",
      path: "/",
      sameSite: "Lax",
    },
  ]);

  await page.addInitScript(() => {
    localStorage.setItem("elmullim-language", "en");
  });

  const course = {
    id: 10,
    title: "Physics Fundamentals",
    description: "A clear course description with enough meaningful words.",
    image: "",
    level: "beginner",
    price: "150.00",
    publishing_status: "draft",
    publishing_note: null,
    hasEnrolled: null,
    created_at: "2026-01-01T00:00:00.000000Z",
    updated_at: "2026-01-01T00:00:00.000000Z",
    teacher: { id: 3, name: "Teacher One" },
    sub_category: {
      id: 5,
      name: "Physics",
      category: { id: 2, name: "Science" },
    },
  };

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

    if (pathname === "/api/teacher/courses/10" && method === "GET") {
      return respond(course);
    }

    if (pathname === "/api/teacher/courses/10/contents" && method === "GET") {
      return respond([{ id: 26, title: "Unit one", description: "Course unit" }]);
    }

    if (
      pathname === "/api/teacher/courses/10/contents/26/lectures" &&
      method === "GET"
    ) {
      return respond([]);
    }

    if (pathname === "/api/teacher/courses/10" && method === "DELETE") {
      deleteRequested = true;
      return respond(null);
    }

    // Keep unrelated requests local to the test; no external API is used.
    return respond([]);
  });

  await page.goto("/profile/my-courses/10/view");

  await expect(
    page.getByRole("heading", { name: "Course management", level: 1 })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Physics Fundamentals", level: 2 })
  ).toBeVisible();

  const editLink = page.getByRole("link", { name: "Edit course" });
  await expect(editLink).toHaveAttribute("href", "/profile/my-courses/10/update");
  await expect(
    page.getByRole("button", { name: "Delete course" })
  ).toBeVisible();

  await page.getByRole("button", { name: "Delete course" }).click();
  await expect(page.getByRole("alertdialog")).toContainText("Physics Fundamentals");
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(page.getByRole("alertdialog")).not.toBeVisible();
  expect(deleteRequested).toBe(false);

  await page.getByRole("button", { name: "Delete course" }).click();
  await page.getByRole("button", { name: "Delete", exact: true }).click();

  await expect.poll(() => deleteRequested).toBe(true);
  await expect(page).toHaveURL(/\/profile$/);
});
