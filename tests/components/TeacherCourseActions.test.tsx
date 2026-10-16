import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import TeacherCourseActions from "@/components/profiles/teacher/courses/TeacherCourseActions";

vi.mock("@/i18n", () => ({
  useI18n: () => ({ language: "ar" }),
}));

vi.mock("@/components/profiles/teacher/courses/DeleteTeacherCourseAction", () => ({
  default: ({
    disabled,
    disabledReason,
    fullWidth,
  }: {
    disabled: boolean;
    disabledReason?: string;
    fullWidth: boolean;
  }) => (
    <button
      type="button"
      disabled={disabled}
      title={disabled ? disabledReason : undefined}
      data-full-width={String(fullWidth)}
    >
      حذف الكورس
    </button>
  ),
}));

const renderActions = (status: "draft" | "rejected" | "pending_approval" | "published") =>
  render(
    <MemoryRouter>
      <TeacherCourseActions
        courseId="13"
        courseTitle="Test course"
        status={status}
        layout="card"
      />
    </MemoryRouter>
  );

describe("TeacherCourseActions", () => {
  it.each(["draft", "rejected", "published"] as const)(
    "keeps edit and delete available for %s courses",
    (status) => {
      renderActions(status);

      expect(screen.getByRole("link", { name: "تعديل الكورس" })).toHaveAttribute(
        "href",
        "/profile/my-courses/13/update"
      );
      expect(screen.getByRole("button", { name: "حذف الكورس" })).toBeEnabled();
      if (status === "published") {
        expect(screen.getByRole("note")).toHaveTextContent("سيظل الكورس ومحتواه متاحين له ولن يُحذف");
      } else {
        expect(screen.queryByRole("note")).not.toBeInTheDocument();
      }
    }
  );

  it("keeps actions locked while a course is pending admin review", () => {
    renderActions("pending_approval");
    const reason = "الكورس قيد مراجعة الإدارة؛ انتظر انتهاء المراجعة قبل التعديل أو الحذف.";

    expect(screen.getByRole("button", { name: "تعديل الكورس غير متاح" })).toBeDisabled();
    const deleteButton = screen.getByRole("button", { name: "حذف الكورس" });
    expect(deleteButton).toBeDisabled();
    expect(deleteButton).toHaveAttribute("title", reason);
    expect(screen.getByRole("note")).toHaveTextContent(reason);
    expect(screen.queryByRole("link", { name: "تعديل الكورس" })).not.toBeInTheDocument();
  });
});
