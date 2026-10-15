import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { I18nProvider } from "@/i18n";
import ManageCourseQuiz from "@/components/profiles/teacher/courses/ManageCourseQuiz";

const mocks = vi.hoisted(() => ({
  createQuiz: vi.fn(),
  updateQuiz: vi.fn(),
  deleteQuiz: vi.fn(),
  getQuiz: vi.fn(),
}));

vi.mock("@/utils/cookieService", () => ({
  default: { getToken: () => "teacher-test-token" },
}));

vi.mock("@/lib/react-query/teacher/courses", () => ({
  useCreateTeacherCourseQuiz: () => ({ mutateAsync: mocks.createQuiz, isPending: false }),
  useUpdateTeacherCourseQuiz: () => ({ mutateAsync: mocks.updateQuiz, isPending: false }),
  useDeleteTeacherCourseQuiz: () => ({ mutateAsync: mocks.deleteQuiz, isPending: false }),
  useGetTeacherCourseQuiz: (...args: unknown[]) => mocks.getQuiz(...args),
}));

vi.mock("@/components/shared/Modal", () => ({
  default: ({
    isOpen,
    title,
    children,
  }: {
    isOpen: boolean;
    title: string;
    children: React.ReactNode;
  }) =>
    isOpen ? (
      <section role="dialog" aria-label={title}>
        <h2>{title}</h2>
        {children}
      </section>
    ) : null,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    variant: _variant,
    className: _className,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: string;
    className?: string;
  }) => <button {...props}>{children}</button>,
}));

const quizDetails = {
  data: {
    id: 18,
    title: "Pending lecture quiz",
    time_limit: 12,
    questions: [
      {
        id: 40,
        title: "What is the answer?",
        score: 5,
        options: [
          { id: 71, title: "Correct option", is_correct: true },
          { id: 72, title: "Other option", is_correct: false },
        ],
      },
    ],
  },
  isLoading: false,
};

const renderQuiz = () =>
  render(
    <MemoryRouter>
      <I18nProvider>
        <ManageCourseQuiz
          courseId={9}
          contentId={10}
          courseStatus="published"
          lecture={{
            id: 11,
            title: "Lecture one",
            description: "A lecture with video.",
            duration: null,
            videoUrl: "https://video.example/lecture",
            hasVideo: true,
            approval_status: "pending_approval",
            quiz: {
              id: 18,
              title: "Pending lecture quiz",
              time_limit: 12,
              total_score: 5,
              questions_count: 1,
              approval_status: "pending_approval",
              approval_note: null,
            },
          }}
        />
      </I18nProvider>
    </MemoryRouter>
  );

describe("ManageCourseQuiz", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
    mocks.getQuiz.mockReturnValue(quizDetails);
  });

  it("opens the editor for a pending quiz on a published course", async () => {
    renderQuiz();

    fireEvent.click(screen.getByRole("button", { name: /edit quiz/i }));

    expect(await screen.findByRole("dialog", { name: "Edit lecture quiz" })).toBeInTheDocument();
    expect(await screen.findByDisplayValue("Pending lecture quiz")).toBeInTheDocument();
    expect(await screen.findByDisplayValue("What is the answer?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save changes/i })).toBeInTheDocument();
  });
});
