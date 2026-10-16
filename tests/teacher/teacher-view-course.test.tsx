import React from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { I18nProvider } from "@/i18n";
import TeacherViewCourse from "@/pages/profile/teacher/TeacherViewCourse";

const mocks = vi.hoisted(() => ({
  useGetTeacherCourseById: vi.fn(),
  useGetTeacherCourseContents: vi.fn(),
  useGetTeacherCourseLectures: vi.fn(),
  submitForReview: vi.fn(),
}));

vi.mock("@/lib/react-query/teacher/courses", () => ({
  useGetTeacherCourseById: (...args: unknown[]) => mocks.useGetTeacherCourseById(...args),
  useGetTeacherCourseContents: (...args: unknown[]) => mocks.useGetTeacherCourseContents(...args),
  useGetTeacherCourseLectures: (...args: unknown[]) => mocks.useGetTeacherCourseLectures(...args),
  useSubmitTeacherCourseForReview: () => ({
    mutateAsync: mocks.submitForReview,
    isPending: false,
  }),
}));

vi.mock("@/utils/cookieService", () => ({
  default: { getToken: () => "teacher-test-token" },
}));

vi.mock("@/components/profiles/teacher/courses/CreateCourseContent", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/profiles/teacher/courses/CreateCourseLecture", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/profiles/teacher/courses/DeleteTeacherCourseAction", () => ({
  default: ({
    disabled,
    disabledReason,
  }: {
    disabled?: boolean;
    disabledReason?: string;
  }) => (
    <button
      type="button"
      aria-label="Delete course"
      disabled={disabled}
      title={disabled ? disabledReason : undefined}
    >
      Delete course
    </button>
  ),
}));

vi.mock("@/components/profiles/teacher/courses/TeacherViewCourseContent", () => ({
  default: () => <div data-testid="course-content-list">Course content list</div>,
}));

vi.mock("@/components/shared/VideoPlayer", () => ({
  default: ({ videoUrl }: { videoUrl: string }) => <div data-testid="video-player">{videoUrl}</div>,
}));

vi.mock("framer-motion", () => {
  const Header = ({ children }: { children?: React.ReactNode }) => <header>{children}</header>;
  return { motion: { header: Header } };
});

const validCourse = {
  id: 10,
  title: "Sura Al Zalzalah",
  description: "A clear course description with enough meaningful words.",
  image: "/course-image.jpg",
  level: "beginner",
  price: "150",
  sub_category: {
    id: 5,
    name: "Quran studies",
    category: { id: 2, name: "Islamic studies" },
  },
  teacher: { id: 1, name: "Teacher One" },
  publishing_status: "draft",
  publishing_note: null,
  created_at: "2026-01-01",
  updated_at: "2026-01-01",
  hasEnrolled: null,
};

const renderPage = (routeState?: {
  lecture?: {
    id: number;
    title: string;
    description: string;
    videoUrl?: string;
    hasVideo?: boolean;
  };
  contentId?: number;
}) =>
  render(
    <MemoryRouter
      initialEntries={[
        { pathname: "/profile/my-courses/10/view", state: routeState },
      ]}
    >
      <I18nProvider>
        <Routes>
          <Route path="/profile/my-courses/:courseId/view" element={<TeacherViewCourse />} />
        </Routes>
      </I18nProvider>
    </MemoryRouter>
  );

describe("TeacherViewCourse", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
    mocks.useGetTeacherCourseById.mockReturnValue({
      data: { status: true, message: null, data: validCourse },
      isLoading: false,
      failureReason: undefined,
    });
    mocks.useGetTeacherCourseContents.mockReturnValue({
      data: { status: true, message: null, data: [{ id: 26, title: "Unit one" }] },
      isLoading: false,
    });
    mocks.useGetTeacherCourseLectures.mockReturnValue({
      data: { status: true, message: null, data: [{ id: 94, title: "Lesson one", description: "A clear lecture description with enough words.", videoUrl: "", hasVideo: false }] },
      isLoading: false,
    });
  });

  it("shows a structured course overview and keeps creation/review actions", () => {
    renderPage();

    expect(screen.getByRole("heading", { name: "Course management", level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sura Al Zalzalah", level: 2 })).toBeInTheDocument();
    expect(screen.getByText("Islamic studies")).toBeInTheDocument();
    expect(screen.getByText("150 EGP")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add content/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add lecture/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit for review/i })).toBeInTheDocument();
    expect(screen.getByTestId("course-content-list")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /edit course/i })).toHaveAttribute("href", "/profile/my-courses/10/update");
    expect(screen.getByRole("button", { name: /delete course/i })).toBeInTheDocument();
  });

  it("loads the selected content unit and uses the refreshed lecture returned by the API", () => {
    const routeLecture = {
      id: 95,
      title: "Old lecture title",
      description: "The cached lecture title before the edit.",
      videoUrl: "/old-video",
      hasVideo: true,
    };
    mocks.useGetTeacherCourseLectures.mockReturnValue({
      data: {
        status: true,
        message: null,
        data: [
          {
            ...routeLecture,
            title: "Updated lecture title",
            description: "Fresh API details for the updated lecture.",
            videoUrl: "/updated-video",
          },
        ],
      },
      isLoading: false,
    });

    renderPage({ lecture: routeLecture, contentId: 27 });

    expect(mocks.useGetTeacherCourseLectures).toHaveBeenCalledWith({
      token: "teacher-test-token",
      courseId: "10",
      contentId: "27",
    });
    expect(
      screen.getByRole("heading", { name: "Updated lecture title", level: 3 })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Old lecture title", level: 3 })
    ).not.toBeInTheDocument();
  });

  it("renders an uploaded lecture video returned by the teacher API", () => {
    const videoUrl = "https://vimeo.com/123456/private-hash";
    const selectedLecture = {
      id: 94,
      title: "Uploaded lecture",
      description: "A clear lecture description with enough words.",
      videoUrl: "",
      hasVideo: true,
    };

    mocks.useGetTeacherCourseLectures.mockReturnValue({
      data: {
        status: true,
        message: null,
        data: [{ ...selectedLecture, videoUrl }],
      },
      isLoading: false,
    });

    renderPage({ lecture: selectedLecture, contentId: 26 });

    expect(screen.getByTestId("video-player")).toHaveTextContent(videoUrl);
    expect(screen.getByText("Video uploaded")).toBeInTheDocument();
  });

  it("keeps edit/delete controls available once published and explains learner protection", () => {
    mocks.useGetTeacherCourseById.mockReturnValue({
      data: { status: true, message: null, data: { ...validCourse, publishing_status: "published" } },
      isLoading: false,
      failureReason: undefined,
    });

    renderPage();

    expect(screen.getByRole("link", { name: /edit course/i })).toHaveAttribute(
      "href",
      "/profile/my-courses/10/update"
    );

    const deleteButton = screen.getByRole("button", { name: /delete course/i });
    expect(deleteButton).toBeEnabled();
    expect(
      screen.getByText(/deletion is blocked when learner activity exists/i)
    ).toBeInTheDocument();
  });

  it("shows a short course description as entered and explains what needs review", () => {
    mocks.useGetTeacherCourseById.mockReturnValue({
      data: {
        status: true,
        message: null,
        data: { ...validCourse, description: "Sura Al Zalzalah" },
      },
      isLoading: false,
      failureReason: undefined,
    });

    renderPage();

    expect(screen.getByText("Sura Al Zalzalah", { selector: "p" })).toBeInTheDocument();
    expect(screen.getByText(/at least 20 characters and 3 words/i)).toBeInTheDocument();
  });
});
