import { expect, test } from "@playwright/test";

test("student can browse a course, enroll for free, open a lecture quiz, and return to the course", async ({ page, context }) => {
  let enrolled = false;
  let quizSubmitted = false;
  let selectedOptionId = 1;

  await context.addCookies([
    {
      name: "t_n",
      value: "course-flow-test-token",
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

  const course = () => ({
    id: 7,
    title: "Physics Fundamentals",
    description: "Learn the fundamentals of physics through clear lessons.",
    image: "",
    level: "beginner",
    price: "0.00",
    publishing_status: "published",
    hasEnrolled: enrolled,
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

  const courseContent = [
    { id: 11, title: "Unit 1", description: "Introduction to physics." },
  ];

  const lecture = {
    id: 21,
    title: "Lecture 1",
    description: "Motion and measurements.",
    duration: 600,
    videoUrl: "",
    hasVideo: true,
    quiz: {
      id: 91,
      title: "Unit Quiz",
      time_limit: 10,
      total_score: 5,
      questions_count: 1,
    },
  };

  const quiz = {
    id: 91,
    title: "Unit Quiz",
    academic_year: null,
    start_time: null,
    end_time: null,
    time_limit: 10,
    date: null,
    course_id: 7,
    lecture_id: 21,
    total_score: 5,
    subject: { id: 4, name: "Physics" },
    education_level: { id: 1, name: "Secondary" },
    teacher: { id: 3, name: "Teacher One" },
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

    if (pathname.endsWith("/check-auth") && method === "POST") {
      return respond({ auth: true, role: "student", "email-verified": true });
    }

    if (pathname.endsWith("/courses/all") && method === "GET") {
      return respond([course()]);
    }

    if (pathname === "/api/courses/7/details" && method === "GET") {
      return respond(course());
    }

    if (pathname === "/api/courses/7/contents" && method === "GET") {
      return respond(courseContent);
    }

    if (pathname === "/api/courses/7/11/lectures" && method === "GET") {
      return respond([lecture]);
    }

    if (
      pathname === "/api/student/enrolling/courses/7/enroll" &&
      method === "POST"
    ) {
      enrolled = true;
      return respond(null);
    }

    if (pathname === "/api/general/4/courses" && method === "GET") {
      return respond([]);
    }

    if (pathname === "/api/student/quizzes/91" && method === "GET") {
      return respond({
        quiz,
        questions: [
          {
            id: 31,
            title: "What is 2 + 2?",
            score: 5,
            options: [
              { id: 1, title: "4" },
              { id: 2, title: "5" },
            ],
          },
        ],
      });
    }

    if (pathname === "/api/student/quizzes/91/start" && method === "POST") {
      return respond({
        id: 500,
        quiz_id: 91,
        score: quizSubmitted ? 5 : 0,
        total_score: 5,
        percentage: quizSubmitted ? 100 : 0,
        correct_answers: quizSubmitted ? 1 : 0,
        started_at: new Date().toISOString(),
        deadline_at: null,
        submitted_at: quizSubmitted ? new Date().toISOString() : null,
        answers: quizSubmitted
          ? [
              {
                question_id: 31,
                selected_option_id: selectedOptionId,
                is_correct: selectedOptionId === 1,
                awarded_score: selectedOptionId === 1 ? 5 : 0,
              },
            ]
          : [],
      });
    }

    if (pathname === "/api/student/quizzes/91/submit" && method === "POST") {
      const payload = request.postDataJSON() as {
        answers?: Array<{ question_id: number; option_id: number }>;
      };
      selectedOptionId = payload.answers?.[0]?.option_id ?? 1;
      quizSubmitted = true;

      return respond({
        id: 500,
        quiz_id: 91,
        score: selectedOptionId === 1 ? 5 : 0,
        total_score: 5,
        percentage: selectedOptionId === 1 ? 100 : 0,
        correct_answers: selectedOptionId === 1 ? 1 : 0,
        started_at: new Date().toISOString(),
        deadline_at: null,
        submitted_at: new Date().toISOString(),
        answers: [
          {
            question_id: 31,
            selected_option_id: selectedOptionId,
            is_correct: selectedOptionId === 1,
            awarded_score: selectedOptionId === 1 ? 5 : 0,
          },
        ],
      });
    }

    if (pathname === "/api/student/quizzes/91/result" && method === "GET") {
      if (!quizSubmitted) {
        return respond(null, 422);
      }

      return respond({
        id: 500,
        quiz_id: 91,
        score: selectedOptionId === 1 ? 5 : 0,
        total_score: 5,
        percentage: selectedOptionId === 1 ? 100 : 0,
        correct_answers: selectedOptionId === 1 ? 1 : 0,
        started_at: new Date().toISOString(),
        deadline_at: null,
        submitted_at: new Date().toISOString(),
        answers: [
          {
            question_id: 31,
            selected_option_id: selectedOptionId,
            is_correct: selectedOptionId === 1,
            awarded_score: selectedOptionId === 1 ? 5 : 0,
          },
        ],
      });
    }

    // Keep unrelated layout requests isolated from any external API.
    return respond([]);
  });

  await page.goto("/courses");

  await expect(page.getByRole("heading", { name: /courses/i }).first()).toBeVisible();
  await page.getByRole("link", { name: /physics fundamentals/i }).first().click();

  await expect(page).toHaveURL(/courses\/7$/);
  await expect(page.getByRole("heading", { name: "Physics Fundamentals" })).toBeVisible();
  await page.locator('a[href="/course/7/enroll"]').click();

  await expect(page).toHaveURL(/course\/7\/enroll$/);
  await page.getByRole("button", { name: /enroll for free/i }).click();

  await expect(page).toHaveURL(/courses\/7\/view$/);
  await expect(page.getByRole("heading", { name: "Physics Fundamentals" })).toBeVisible();

  await page.getByRole("button", { name: "Unit 1" }).click();
  const takeQuizLink = page.locator('a[href="/view-quiz?quiz=91&course=7"]');
  await expect(takeQuizLink).toBeVisible();
  await takeQuizLink.click();

  await expect(page).toHaveURL(/view-quiz\?quiz=91&course=7$/);
  await expect(page.getByRole("heading", { name: "Unit Quiz" }).first()).toBeVisible();
  await expect(page.getByText("What is 2 + 2?")).toBeVisible();

  await page.getByLabel("4").check();
  await page.getByRole("button", { name: "Submit quiz" }).click();

  await expect(page.getByRole("heading", { name: "Quiz result" })).toBeVisible();
  await expect(page.getByText("5 / 5")).toBeVisible();

  await page.getByRole("link", { name: "Back to course" }).click();
  await expect(page).toHaveURL(/courses\/7\/view$/);
  await expect(page.getByRole("heading", { name: "Physics Fundamentals" })).toBeVisible();
});
