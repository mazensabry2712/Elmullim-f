import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ViewQuiz from "@/components/profiles/student/quizes/ViewQuiz";
import { I18nProvider, useI18n } from "@/i18n";

const mockUseGetStudentQuiz = vi.fn();
const mockUseStartStudentQuiz = vi.fn();
const mockUseSubmitStudentQuiz = vi.fn();
const mockUseGetStudentQuizResult = vi.fn();

vi.mock("@/lib/react-query/student/quizzes", () => ({
  useGetStudentQuiz: (...args: unknown[]) => mockUseGetStudentQuiz(...args),
  useStartStudentQuiz: (...args: unknown[]) => mockUseStartStudentQuiz(...args),
  useSubmitStudentQuiz: (...args: unknown[]) => mockUseSubmitStudentQuiz(...args),
  useGetStudentQuizResult: (...args: unknown[]) => mockUseGetStudentQuizResult(...args),
}));

vi.mock("@/utils/cookieService", () => ({
  default: {
    getToken: vi.fn(() => "token"),
  },
}));

const LanguageToggle = () => {
  const { toggleLanguage } = useI18n();
  return <button type="button" onClick={toggleLanguage}>toggle</button>;
};

describe("ViewQuiz", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";

    mockUseStartStudentQuiz.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({
        status: true,
        message: "Quiz started successfully",
        data: {
          id: 11,
          quiz_id: 7,
          score: 0,
          total_score: 0,
          percentage: 0,
          correct_answers: 0,
          started_at: new Date().toISOString(),
          deadline_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
          submitted_at: null,
          answers: [],
        },
      }),
      isPending: false,
    });

    mockUseSubmitStudentQuiz.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    });

    mockUseGetStudentQuizResult.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    });
  });

  const renderPage = (children: React.ReactNode, path = "/view-quiz?quiz=7") => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[path]}>
          <I18nProvider>{children}</I18nProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  const quizData = {
    data: {
      quiz: {
        id: 7,
        title: "Math Quiz",
        subject: { id: 1, name: "Mathematics" },
        teacher: { id: 2, name: "Teacher" },
        date: "2026-09-10",
        start_time: "10:00",
        end_time: "10:30",
        time_limit: 30,
        total_score: 5,
      },
      questions: [
        {
          id: 101,
          title: "2 + 2 = ?",
          score: 2,
          options: [
            { id: 201, title: "4" },
            { id: 202, title: "5" },
          ],
        },
        {
          id: 102,
          title: "3 + 3 = ?",
          score: 3,
          options: [
            { id: 203, title: "6" },
            { id: 204, title: "7" },
          ],
        },
      ],
    },
  };

  it("does not show fake quiz data or answer inputs when the backend quiz cannot be loaded", () => {
    mockUseGetStudentQuiz.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch: vi.fn(),
    });

    renderPage(<ViewQuiz />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to quiz schedule/i })).toHaveAttribute("href", "/profile");
    expect(screen.queryByRole("radio")).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/enter your name/i)).not.toBeInTheDocument();
  });

  it("requires an answer for every question before submission", async () => {
    mockUseGetStudentQuiz.mockReturnValue({
      data: quizData,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    const mutateAsync = vi.fn();
    mockUseSubmitStudentQuiz.mockReturnValue({ mutateAsync, isPending: false });

    renderPage(<ViewQuiz />);

    await waitFor(() => expect(screen.getByLabelText("4")).toBeInTheDocument());
    fireEvent.click(screen.getByLabelText("4"));
    fireEvent.click(screen.getByRole("button", { name: /submit quiz/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/answer all questions/i);
    });
    expect(mutateAsync).not.toHaveBeenCalled();
  });

  it("submits all selected answers and renders the saved result", async () => {
    mockUseGetStudentQuiz.mockReturnValue({
      data: quizData,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    const mutateAsync = vi.fn().mockResolvedValue({
      status: true,
      message: "Quiz submitted successfully",
      data: {
        id: 11,
        quiz_id: 7,
        score: 5,
        total_score: 5,
        percentage: 100,
        correct_answers: 2,
        started_at: new Date().toISOString(),
        deadline_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        submitted_at: "2026-09-10T10:31:00Z",
        answers: [
          { question_id: 101, selected_option_id: 201, is_correct: true, awarded_score: 2 },
          { question_id: 102, selected_option_id: 203, is_correct: true, awarded_score: 3 },
        ],
      },
    });
    mockUseSubmitStudentQuiz.mockReturnValue({ mutateAsync, isPending: false });
    mockUseGetStudentQuizResult.mockImplementation(({ enabled }: { enabled: boolean }) =>
      enabled
        ? {
            data: {
              status: true,
              message: null,
              data: {
                id: 11,
                quiz_id: 7,
                score: 5,
                total_score: 5,
                percentage: 100,
                correct_answers: 2,
                started_at: new Date().toISOString(),
                deadline_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
                submitted_at: "2026-09-10T10:31:00Z",
                answers: [
                  { question_id: 101, selected_option_id: 201, is_correct: true, awarded_score: 2 },
                  { question_id: 102, selected_option_id: 203, is_correct: true, awarded_score: 3 },
                ],
              },
            },
            isLoading: false,
            isError: false,
          }
        : { data: undefined, isLoading: false, isError: false }
    );

    renderPage(<ViewQuiz />);

    await waitFor(() => expect(screen.getByLabelText("4")).toBeInTheDocument());
    fireEvent.click(screen.getByLabelText("4"));
    fireEvent.click(screen.getByLabelText("6"));
    fireEvent.click(screen.getByRole("button", { name: /submit quiz/i }));

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /quiz result/i, level: 1 })).toBeInTheDocument();
    });

    expect(mutateAsync).toHaveBeenCalledWith({
      token: "token",
      quizId: 7,
      answers: [
        { question_id: 101, option_id: 201 },
        { question_id: 102, option_id: 203 },
      ],
    });
    expect(screen.getByText("5 / 5")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("restores the saved result when the student revisits an already submitted quiz", async () => {
    mockUseGetStudentQuiz.mockReturnValue({
      data: quizData,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    mockUseStartStudentQuiz.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({
        status: true,
        message: "Quiz attempt already exists",
        data: {
          id: 11,
          quiz_id: 7,
          score: 5,
          total_score: 5,
          percentage: 100,
          correct_answers: 2,
          started_at: "2026-09-10T10:00:00Z",
          deadline_at: "2026-09-10T10:30:00Z",
          submitted_at: "2026-09-10T10:31:00Z",
          answers: [],
        },
      }),
      isPending: false,
    });

    mockUseGetStudentQuizResult.mockReturnValue({
      data: {
        status: true,
        message: null,
        data: {
          id: 11,
          quiz_id: 7,
          score: 5,
          total_score: 5,
          percentage: 100,
          correct_answers: 2,
          started_at: "2026-09-10T10:00:00Z",
          deadline_at: "2026-09-10T10:30:00Z",
          submitted_at: "2026-09-10T10:31:00Z",
          answers: [],
        },
      },
      isLoading: false,
      isError: false,
    });

    renderPage(<ViewQuiz />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /quiz result/i, level: 1 })).toBeInTheDocument();
    });

    expect(screen.queryByRole("radio")).not.toBeInTheDocument();
    expect(screen.getByText("5 / 5")).toBeInTheDocument();
  });

  it("shows an inline error when quiz submission fails", async () => {
    mockUseGetStudentQuiz.mockReturnValue({
      data: quizData,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    const mutateAsync = vi.fn().mockRejectedValue(new Error("request failed"));
    mockUseSubmitStudentQuiz.mockReturnValue({ mutateAsync, isPending: false });

    renderPage(<ViewQuiz />);

    await waitFor(() => expect(screen.getByLabelText("4")).toBeInTheDocument());
    fireEvent.click(screen.getByLabelText("4"));
    fireEvent.click(screen.getByLabelText("6"));
    fireEvent.click(screen.getByRole("button", { name: /submit quiz/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/unable to submit the quiz/i);
    });
  });

  it("supports Arabic and RTL with backend quiz data", async () => {
    mockUseGetStudentQuiz.mockReturnValue({
      data: {
        data: {
          quiz: {
            title: "اختبار الرياضيات",
            subject: { name: "الرياضيات" },
            teacher: { name: "المعلم" },
            date: "2026-09-10",
            start_time: "10:00",
            end_time: "10:30",
            time_limit: 30,
            total_score: 10,
          },
          questions: [],
        },
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    renderPage(
      <>
        <ViewQuiz />
        <LanguageToggle />
      </>
    );

    fireEvent.click(screen.getByRole("button", { name: "toggle" }));

    expect(screen.getByRole("heading", { name: "اختبار الرياضيات", level: 1 })).toBeInTheDocument();
    await waitFor(() => {
      expect(document.documentElement.lang).toBe("ar");
      expect(document.documentElement.dir).toBe("rtl");
    });
  });
});
