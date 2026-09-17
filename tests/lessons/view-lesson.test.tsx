import { render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ViewLesson from "@/pages/lessons/ViewLesson";
import { I18nProvider } from "@/i18n";

const mockUseGetLessonById = vi.fn();
const mockUseGetLessonContents = vi.fn();
const mockUseGetLessonLectures = vi.fn();
const mockNavigate = vi.fn();

vi.mock("@/lib/react-query/lessons/lessons", () => ({
  useGetLessonById: (...args: unknown[]) => mockUseGetLessonById(...args),
  useGetLessonContents: (...args: unknown[]) => mockUseGetLessonContents(...args),
  useGetLessonLectures: (...args: unknown[]) => mockUseGetLessonLectures(...args),
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
    useParams: () => ({ lessonId: "7" }),
  };
});

vi.mock("@/components/lessons/ViewLessonContent", () => ({
  default: () => <div data-testid="view-lesson-content">Lesson content</div>,
}));

vi.mock("@/components/lessons/RelatedLessons", () => ({
  default: () => <div data-testid="related-lessons">Related lessons</div>,
}));

vi.mock("@/components/shared/InstructorDetails", () => ({
  default: () => <div data-testid="instructor-details">Instructor</div>,
}));

vi.mock("@/components/shared/VideoPlayer", () => ({
  default: ({ videoUrl }: { videoUrl: string }) => <div data-testid="video-player">{videoUrl || "No video"}</div>,
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    section: ({ children }: { children?: React.ReactNode }) => <section>{children}</section>,
  },
}));

describe("ViewLesson", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
    mockUseGetLessonContents.mockReturnValue({
      data: { data: [{ id: 11, title: "Unit 1" }] },
      isLoading: false,
    });
    mockUseGetLessonLectures.mockReturnValue({
      data: { data: [{ id: 21, title: "Lesson Lecture 1", description: "Intro", videoUrl: "/lesson.mp4" }] },
      isLoading: false,
    });
  });

  const renderPage = () =>
    render(
      <MemoryRouter initialEntries={["/lessons/7/view"]}>
        <I18nProvider>
          <Routes>
            <Route path="/lessons/:lessonId/view" element={<ViewLesson />} />
          </Routes>
        </I18nProvider>
      </MemoryRouter>
    );

  it("renders the lesson viewer without legacy course-enrollment state", () => {
    mockUseGetLessonById.mockReturnValue({
      data: {
        data: {
          id: 7,
          title: "Algebra Basics",
          teacher: { id: 3, name: "Teacher One" },
        },
      },
      isLoading: false,
      isError: false,
      failureReason: undefined,
    });

    renderPage();

    expect(screen.getByRole("heading", { name: /watch lesson/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /algebra basics/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByText("Lesson Lecture 1")).toBeInTheDocument();
    expect(screen.getByTestId("view-lesson-content")).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalledWith("/lessons/7", { replace: true });
  });

  it("renders a loading state", () => {
    mockUseGetLessonById.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      failureReason: undefined,
    });

    renderPage();

    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
