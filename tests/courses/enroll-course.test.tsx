import { render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import EnrollCourse from "@/pages/courses/EnrollCourse";
import { I18nProvider } from "@/i18n";

const mockUseGetCourseById = vi.fn();

vi.mock("@/lib/react-query/courses/courses", () => ({
  useGetCourseById: (...args: unknown[]) => mockUseGetCourseById(...args),
}));

vi.mock("@/utils/cookieService", () => ({
  default: {
    getToken: vi.fn(() => "token"),
    getRole: vi.fn(() => "student"),
  },
}));

vi.mock("react-redux", () => ({
  useSelector: () => ({ isAuthenticated: true }),
}));

vi.mock("@/components/courses/EnrollFreeCourse", () => ({
  default: ({ courseId }: { courseId: number }) => (
    <button type="button">Enroll free course {courseId}</button>
  ),
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    section: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => {
      const { initial, whileInView, viewport, transition, ...rest } = props;
      void initial;
      void whileInView;
      void viewport;
      void transition;
      return <section {...rest}>{children}</section>;
    },
  },
}));

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={["/course/7/enroll"]}>
      <I18nProvider>
        <Routes>
          <Route path="/course/:courseId/enroll" element={<EnrollCourse />} />
        </Routes>
      </I18nProvider>
    </MemoryRouter>
  );

describe("Course enrollment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  });

  it("shows a real free-course enrollment action", () => {
    mockUseGetCourseById.mockReturnValue({
      data: {
        data: {
          id: 7,
          title: "Physics Fundamentals",
          description: "Learn the fundamentals of physics.",
          price: 0,
          level: "Beginner",
          created_at: "2026-01-10T00:00:00.000Z",
          hasEnrolled: false,
          teacher: { name: "Teacher One" },
          image: "/course.jpg",
        },
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    renderPage();

    expect(screen.getByRole("heading", { name: /course enrollment/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByText("Physics Fundamentals")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /enroll free course 7/i })).toBeInTheDocument();
  });

  it("does not present a fake payment form for paid courses", () => {
    mockUseGetCourseById.mockReturnValue({
      data: {
        data: {
          id: 8,
          title: "Advanced Mathematics",
          description: "Advanced mathematics course.",
          price: 500,
          level: "Advanced",
          created_at: "2026-01-10T00:00:00.000Z",
          hasEnrolled: false,
          teacher: { name: "Teacher Two" },
          image: "/course.jpg",
        },
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    renderPage();

    expect(screen.getByText(/online payment is not available yet/i)).toBeInTheDocument();
    expect(screen.getByText(/connected payment gateway/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^pay$/i })).not.toBeInTheDocument();
  });

  it("renders a retryable error state when the course cannot be loaded", () => {
    const refetch = vi.fn();
    mockUseGetCourseById.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch,
    });

    renderPage();

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });
});
