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

vi.mock("@/components/profiles/teacher/courses/DeleteCourse", () => ({
  default: () => <button type="button" aria-label="Delete course">Delete course</button>,
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

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={["/profile/my-courses/10/view"]}>
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

  it("hides course edit/delete actions once the course is published", () => {
    mocks.useGetTeacherCourseById.mockReturnValue({
      data: { status: true, message: null, data: { ...validCourse, publishing_status: "published" } },
      isLoading: false,
      failureReason: undefined,
    });

    renderPage();

    expect(screen.queryByRole("link", { name: /edit course/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /delete course/i })).not.toBeInTheDocument();
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
