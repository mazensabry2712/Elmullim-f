import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { I18nProvider } from "@/i18n";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ViewQuiz from "@/components/profiles/student/quizes/ViewQuiz";

const mocks = vi.hoisted(() => ({
  useGetStudentQuiz: vi.fn(),
  useGetStudentQuizResult: vi.fn(),
  useStartStudentQuiz: vi.fn(),
  useSubmitStudentQuiz: vi.fn(),
  startQuiz: vi.fn(),
  submitQuiz: vi.fn(),
}));

vi.mock("@/lib/react-query/student/quizzes", () => ({
  useGetStudentQuiz: (...args: unknown[]) => mocks.useGetStudentQuiz(...args),
  useGetStudentQuizResult: (...args: unknown[]) => mocks.useGetStudentQuizResult(...args),
  useStartStudentQuiz: () => ({
    mutateAsync: mocks.startQuiz,
    isPending: false,
  }),
  useSubmitStudentQuiz: () => ({
    mutateAsync: mocks.submitQuiz,
    isPending: false,
  }),
}));

vi.mock("@/utils/cookieService", () => ({
  default: { getToken: () => "student-test-token" },
}));

describe("course-linked quiz navigation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";

    mocks.useGetStudentQuiz.mockReturnValue({
      data: {
        status: true,
        message: null,
        data: {
          quiz: {
            id: 99,
            title: "Course unit quiz",
            academic_year: null,
            start_time: null,
            end_time: null,
            time_limit: 10,
            date: null,
            course_id: 7,
            lecture_id: 20,
            total_score: 10,
            subject: null,
            education_level: null,
            teacher: { id: 3, name: "Teacher One" },
          },
          questions: [],
        },
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    mocks.useGetStudentQuizResult.mockReturnValue({
      data: {
        status: true,
        message: null,
        data: {
          id: 501,
          quiz_id: 99,
          score: 0,
          total_score: 10,
          percentage: 0,
          correct_answers: 0,
          started_at: "2026-10-14T00:00:00.000Z",
          deadline_at: null,
          submitted_at: "2026-10-14T00:10:00.000Z",
          answers: [{
            question_id: 20,
            question_title: "What is 2 + 2?",
            selected_option_id: 11,
            selected_option_title: "3",
            correct_option_title: "4",
            is_correct: false,
            awarded_score: 0,
          }],
        },
      },
      isLoading: false,
      isError: false,
    });

    mocks.startQuiz.mockResolvedValue({
      status: true,
      message: null,
      data: {
        id: 501,
        quiz_id: 99,
        started_at: "2026-10-14T00:00:00.000Z",
        deadline_at: null,
        submitted_at: "2026-10-14T00:10:00.000Z",
      },
    });
  });

  it("returns the learner to the parent course after the quiz result", async () => {
    render(
      <MemoryRouter initialEntries={["/view-quiz?quiz=99&course=7"]}>
        <I18nProvider>
          <Routes>
            <Route path="/view-quiz" element={<ViewQuiz />} />
          </Routes>
        </I18nProvider>
      </MemoryRouter>
    );

    const returnLink = await screen.findByRole("link", { name: "Back to course" });
    await waitFor(() => expect(returnLink).toHaveAttribute("href", "/courses/7/view"));
    expect(screen.getByText("What is 2 + 2?")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });
});
