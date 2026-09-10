import { render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ViewCourse from "@/pages/courses/ViewCourse";
import { I18nProvider } from "@/i18n";

const mockUseGetCourseById = vi.fn();
const mockUseGetCourseContents = vi.fn();
const mockUseGetCourseLectures = vi.fn();
const mockNavigate = vi.fn();

vi.mock("@/lib/react-query/courses/courses", () => ({
  useGetCourseById: (...args: unknown[]) => mockUseGetCourseById(...args),
  useGetCourseContents: (...args: unknown[]) => mockUseGetCourseContents(...args),
  useGetCourseLectures: (...args: unknown[]) => mockUseGetCourseLectures(...args),
}));

vi.mock("@/utils/cookieService", () => ({
  default: {
    getToken: vi.fn(() => "token"),
  },
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("@/components/courses/ViewCourseContent", () => ({
  default: () => <div data-testid="view-course-content">Course content</div>,
}));

vi.mock("@/components/courses/RelatedCourses", () => ({
  default: () => <div data-testid="related-courses">Related courses</div>,
}));

vi.mock("@/components/shared/InstructorDetails", () => ({
  default: () => <div data-testid="instructor-details">Instructor</div>,
}));

vi.mock("@/components/shared/VideoPlayer", () => ({
  default: ({ videoUrl }: { videoUrl?: string }) => <div data-testid="video-player">{videoUrl || "No video"}</div>,
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    section: ({ children }: { children?: React.ReactNode }) => <section>{children}</section>,
  },
}));

describe("ViewCourse", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
    mockUseGetCourseContents.mockReturnValue({
      data: { data: [{ id: 11, title: "Unit 1" }] },
      isLoading: false,
    });
    mockUseGetCourseLectures.mockReturnValue({
      data: { data: [{ id: 21, title: "Lesson 1", description: "Intro", videoUrl: "/lesson.mp4" }] },
      isLoading: false,
    });
  });

  const renderPage = (path = "/courses/7/view") =>
    render(
      <MemoryRouter initialEntries={[path]}>
        <I18nProvider>
          <ViewCourse />
        </I18nProvider>
      </MemoryRouter>
    );

  it("renders the enrolled course viewer and selected lecture", () => {
    mockUseGetCourseById.mockReturnValue({
      data: {
        data: {
          id: 7,
          title: "Physics Fundamentals",
          hasEnrolled: true,
          teacher: { id: 3, name: "Teacher One" },
          sub_category: { id: 4 },
        },
      },
      isLoading: false,
      isError: false,
      failureReason: undefined,
    });

    renderPage();

    expect(screen.getByRole("heading", { name: /watch now/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /physics fundamentals/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByText("Lesson 1")).toBeInTheDocument();
    expect(screen.getByTestId("view-course-content")).toBeInTheDocument();
  });

  it("renders a loading state while course data is loading", () => {
    mockUseGetCourseById.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      failureReason: undefined,
    });

    renderPage();

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("redirects back to the course details page when the course is not enrolled", () => {
    mockUseGetCourseById.mockReturnValue({
      data: {
        data: {
          id: 7,
          title: "Physics Fundamentals",
          hasEnrolled: false,
          teacher: { id: 3, name: "Teacher One" },
          sub_category: { id: 4 },
        },
      },
      isLoading: false,
      isError: false,
      failureReason: undefined,
    });

    renderPage();

    expect(mockNavigate).toHaveBeenCalledWith("/courses/7", { replace: true });
  });
});
