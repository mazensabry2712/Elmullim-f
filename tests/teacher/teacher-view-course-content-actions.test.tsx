import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { I18nProvider } from "@/i18n";
import TeacherViewCourseContent from "@/components/profiles/teacher/courses/TeacherViewCourseContent";

const mocks = vi.hoisted(() => ({
  useGetTeacherCourseContents: vi.fn(),
  useGetTeacherCourseLectures: vi.fn(),
  accordionOnValueChange: undefined as undefined | ((value: string) => void),
}));

vi.mock("@/utils/cookieService", () => ({
  default: { getToken: () => "teacher-test-token" },
}));

vi.mock("@/lib/react-query/teacher/courses", () => ({
  useGetTeacherCourseContents: (...args: unknown[]) => mocks.useGetTeacherCourseContents(...args),
  useGetTeacherCourseLectures: (...args: unknown[]) => mocks.useGetTeacherCourseLectures(...args),
}));

vi.mock("@/components/ui/accordion", () => ({
  Accordion: ({
    children,
    onValueChange,
  }: {
    children: React.ReactNode;
    onValueChange: (value: string) => void;
  }) => {
    mocks.accordionOnValueChange = onValueChange;
    return <div>{children}</div>;
  },
  AccordionItem: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <section data-value={value}>{children}</section>
  ),
  AccordionTrigger: ({ children }: { children: React.ReactNode }) => (
    <button
      type="button"
      onClick={(event) => {
        const value = event.currentTarget.closest("section[data-value]")?.getAttribute("data-value") || "";
        mocks.accordionOnValueChange?.(value);
      }}
    >
      {children}
    </button>
  ),
  AccordionContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/profiles/teacher/courses/UpdateCourseContent", () => ({
  default: ({ courseContent }: { courseContent: { id: number } }) => (
    <button type="button" aria-label={"Edit content " + courseContent.id}>Edit content</button>
  ),
}));

vi.mock("@/components/profiles/teacher/courses/DeleteCourseContent", () => ({
  default: ({ id }: { id: string }) => (
    <button type="button" aria-label={"Delete content " + id}>Delete content</button>
  ),
}));

vi.mock("@/components/profiles/teacher/courses/UpdateCourseLecture", () => ({
  default: ({ lecture }: { lecture: { id: number } }) => (
    <button type="button" aria-label={"Edit lecture " + lecture.id}>Edit lecture</button>
  ),
}));

vi.mock("@/components/profiles/teacher/courses/DeleteCourseLecture", () => ({
  default: ({ id }: { id: string }) => (
    <button type="button" aria-label={"Delete lecture " + id}>Delete lecture</button>
  ),
}));

vi.mock("@/components/profiles/teacher/courses/UploadCourseVideo", () => ({ default: () => null }));
vi.mock("@/components/profiles/teacher/courses/ManageCourseQuiz", () => ({ default: () => null }));
vi.mock("framer-motion", () => ({
  motion: { div: ({ children }: { children?: React.ReactNode }) => <div>{children}</div> },
}));

const content = {
  id: 26,
  title: "Unit one",
  description: "This is an understandable content description.",
};
const lecture = {
  id: 94,
  title: "Lesson one",
  description: "This is an understandable lecture description.",
  duration: null,
  videoUrl: "",
  hasVideo: false,
};

const renderList = (courseStatus: "draft" | "pending_approval" | "published" | "rejected") =>
  render(
    <MemoryRouter initialEntries={["/profile/my-courses/10/view"]}>
      <I18nProvider>
        <TeacherViewCourseContent courseId={10} courseStatus={courseStatus} />
      </I18nProvider>
    </MemoryRouter>
  );

describe("TeacherViewCourseContent actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
    mocks.useGetTeacherCourseContents.mockReturnValue({
      data: { status: true, message: null, data: [content] },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });
    mocks.useGetTeacherCourseLectures.mockReturnValue({
      data: { status: true, message: null, data: [lecture] },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });
  });

  it("shows content and lecture edit/delete controls for a draft course", () => {
    renderList("draft");

    expect(screen.getByRole("button", { name: "Edit content 26" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete content 26" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Unit one/ }));

    expect(screen.getByRole("button", { name: "Edit lecture 94" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete lecture 94" })).toBeInTheDocument();
  });

  it("hides edit/delete controls after a course is published", () => {
    renderList("published");

    expect(screen.queryByRole("button", { name: "Edit content 26" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Delete content 26" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Unit one/ }));

    expect(screen.queryByRole("button", { name: "Edit lecture 94" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Delete lecture 94" })).not.toBeInTheDocument();
  });
});
