import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { I18nProvider } from "@/i18n";
import ManageCourseQuiz from "@/components/profiles/teacher/courses/ManageCourseQuiz";

const mocks = vi.hoisted(() => ({
  useGetTeacherCourseQuiz: vi.fn(),
  useCreateTeacherCourseQuiz: vi.fn(),
  useUpdateTeacherCourseQuiz: vi.fn(),
  useDeleteTeacherCourseQuiz: vi.fn(),
}));

vi.mock("@/utils/cookieService", () => ({
  default: { getToken: () => "teacher-test-token" },
}));

vi.mock("@/lib/react-query/teacher/courses", () => ({
  useGetTeacherCourseQuiz: (...args: unknown[]) => mocks.useGetTeacherCourseQuiz(...args),
  useCreateTeacherCourseQuiz: () => mocks.useCreateTeacherCourseQuiz(),
  useUpdateTeacherCourseQuiz: () => mocks.useUpdateTeacherCourseQuiz(),
  useDeleteTeacherCourseQuiz: () => mocks.useDeleteTeacherCourseQuiz(),
}));

const lecture = {
  id: 94,
  title: "Lecture one",
  description: "A clear lecture description for the test.",
  duration: null,
  videoUrl: "https://vimeo.com/123456789",
  hasVideo: true,
  quiz: {
    id: 8,
    title: "Introduction quiz",
    time_limit: 0,
    total_score: 5,
    questions_count: 1,
  },
};

const fullQuiz = {
  status: true,
  message: null,
  data: {
    id: 8,
    title: "Introduction quiz",
    time_limit: 0,
    course_id: 10,
    lecture_id: 94,
    questions: [
      {
        id: 101,
        title: "What is React?",
        score: 5,
        options: [
          { id: 201, title: "A JavaScript library", is_correct: true },
          { id: 202, title: "A database", is_correct: false },
        ],
      },
    ],
  },
};

describe("ManageCourseQuiz read-only details", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";

    mocks.useGetTeacherCourseQuiz.mockReturnValue({
      data: fullQuiz,
      isLoading: false,
      isError: false,
    });
    mocks.useCreateTeacherCourseQuiz.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    });
    mocks.useUpdateTeacherCourseQuiz.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    });
    mocks.useDeleteTeacherCourseQuiz.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    });
  });

  it("lets a teacher view quiz questions while a course is pending review", () => {
    render(
      <I18nProvider>
        <ManageCourseQuiz
          courseId={10}
          contentId={26}
          lecture={lecture}
          courseStatus="pending_approval"
        />
      </I18nProvider>
    );

    expect(screen.getByText("Introduction quiz")).toBeInTheDocument();
    expect(screen.queryByText("What is React?")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "View questions" }));

    expect(screen.getByText(/What is React\?/i)).toBeInTheDocument();
    expect(screen.getByText("A JavaScript library")).toBeInTheDocument();
    expect(screen.getByText("A database")).toBeInTheDocument();
    expect(screen.getByText("Correct answer")).toBeInTheDocument();
    expect(mocks.useGetTeacherCourseQuiz).toHaveBeenCalledWith({
      token: "teacher-test-token",
      courseId: "10",
      contentId: "26",
      lectureId: "94",
      enabled: true,
    });
  });
});
