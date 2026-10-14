import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { I18nProvider } from "@/i18n";
import type { ICourse, CoursePublishingStatus } from "@/interfaces/courses/courses";
import TeacherCourseCard from "@/components/profiles/teacher/courses/TeacherCourseCard";

vi.mock("@/components/profiles/teacher/courses/DeleteTeacherCourseAction", () => ({
  default: () => null,
}));

const makeCourse = (publishing_status: CoursePublishingStatus): ICourse =>
  ({
    id: 13,
    title: "Backend Development Course",
    description: "Learn backend development through practical guided examples.",
    image: "",
    level: "expert",
    price: "0.00",
    sub_category: {
      id: 2,
      name: "Backend Development",
      category: { id: 1, name: "Web Development" },
    },
    created_at: "2026-10-14T00:00:00.000Z",
    updated_at: "2026-10-14T00:00:00.000Z",
    hasEnrolled: null,
    teacher: {},
    publishing_status,
    publishing_note: null,
  }) as unknown as ICourse;

const renderCard = (status: CoursePublishingStatus) =>
  render(
    <I18nProvider>
      <MemoryRouter>
        <TeacherCourseCard course={makeCourse(status)} />
      </MemoryRouter>
    </I18nProvider>
  );

describe("TeacherCourseCard published-course actions", () => {
  beforeEach(() => {
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  });

  it("lets the teacher edit safe details of a published course and explains why deletion is unavailable", () => {
    renderCard("published");

    expect(screen.getByRole("link", { name: "Edit course details" })).toHaveAttribute(
      "href",
      "/profile/my-courses/13/update"
    );

    const deleteButton = screen.getByRole("button", { name: "Delete unavailable" });
    expect(deleteButton).toBeDisabled();
    expect(deleteButton.getAttribute("title")).toContain("contact support");

    expect(screen.getByRole("link", { name: "Manage course" })).toHaveAttribute(
      "href",
      "/profile/my-courses/13/view"
    );
  });

  it("keeps course editing locked while the course is pending review", () => {
    renderCard("pending_approval");

    expect(screen.queryByRole("link", { name: "Edit course details" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete unavailable" })).toBeDisabled();
    expect(screen.getByText("Awaiting review")).toBeInTheDocument();
  });
});
