import { render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { I18nProvider } from "@/i18n";
import StudentCourses from "@/components/profiles/student/StudentCourses";

const mockUseGetMyCourses = vi.fn();

vi.mock("@/lib/react-query/student/enrolling", () => ({
  useGetMyCourses: (...args: unknown[]) => mockUseGetMyCourses(...args),
}));

vi.mock("@/utils/cookieService", () => ({
  default: {
    getToken: vi.fn(() => "student-token"),
  },
}));

vi.mock("@/components/courses/CoursesList", () => ({
  default: ({ courses }: { courses: Array<{ title: string }> }) => (
    <div data-testid="my-courses-list">
      {courses.map((course) => (
        <span key={course.title}>{course.title}</span>
      ))}
    </div>
  ),
}));

vi.mock("framer-motion", () => ({
  motion: {
    section: ({ children }: { children?: React.ReactNode }) => <section>{children}</section>,
  },
}));

describe("StudentCourses", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  });

  const renderPage = () =>
    render(
      <I18nProvider>
        <StudentCourses />
      </I18nProvider>
    );

  it("uses the enrolled-courses query and renders the enrolled courses", () => {
    mockUseGetMyCourses.mockReturnValue({
      data: { data: [{ id: 1, title: "Physics Fundamentals" }] },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    renderPage();

    expect(mockUseGetMyCourses).toHaveBeenCalledWith("student-token", true);
    expect(screen.getByRole("heading", { name: "My Courses" })).toBeInTheDocument();
    expect(screen.getByTestId("my-courses-list")).toHaveTextContent("Physics Fundamentals");
  });

  it("renders a retryable error state", () => {
    const refetch = vi.fn();

    mockUseGetMyCourses.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch,
    });

    renderPage();

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
  });

  it("supports Arabic", () => {
    localStorage.setItem("elmullim-language", "ar");
    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";

    mockUseGetMyCourses.mockReturnValue({
      data: { data: [] },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    renderPage();

    expect(screen.getByRole("heading", { name: "كورساتي" })).toBeInTheDocument();
  });
});
