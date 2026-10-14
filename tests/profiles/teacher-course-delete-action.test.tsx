import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { I18nProvider } from "@/i18n";
import DeleteTeacherCourseAction from "@/components/profiles/teacher/courses/DeleteTeacherCourseAction";

const mockDeleteCourse = vi.fn();
const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();

vi.mock("@/lib/react-query/teacher/courses", () => ({
  useDeleteTeacherCourse: () => ({
    mutateAsync: mockDeleteCourse,
    isPending: false,
  }),
}));

vi.mock("@/utils/cookieService", () => ({
  default: {
    getToken: vi.fn(() => "teacher-token"),
  },
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: mockToastSuccess,
    error: mockToastError,
  },
}));

vi.mock("@/utils/handleResponseError", () => ({
  default: vi.fn(),
}));

const renderAction = () =>
  render(
    <I18nProvider>
      <DeleteTeacherCourseAction id="42" courseTitle="Physics Fundamentals" />
    </I18nProvider>
  );

describe("DeleteTeacherCourseAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
    mockDeleteCourse.mockResolvedValue({
      status: true,
      message: "Physics course deleted",
    });
  });

  it("requires confirmation and refreshes through the delete mutation", async () => {
    const user = userEvent.setup();
    renderAction();

    await user.click(screen.getByRole("button", { name: "Delete course" }));

    expect(screen.getByRole("alertdialog")).toHaveTextContent(
      "Physics Fundamentals"
    );

    await user.click(screen.getByRole("button", { name: "Delete", exact: true }));

    await waitFor(() => {
      expect(mockDeleteCourse).toHaveBeenCalledWith({
        id: "42",
        token: "teacher-token",
      });
    });
    expect(mockToastSuccess).toHaveBeenCalledWith("Physics course deleted");
    await waitFor(() => {
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    });
  });

  it("keeps confirmation open when the API rejects the deletion", async () => {
    const user = userEvent.setup();
    mockDeleteCourse.mockResolvedValue({
      status: false,
      message: "Course cannot be deleted",
    });
    renderAction();

    await user.click(screen.getByRole("button", { name: "Delete course" }));
    await user.click(screen.getByRole("button", { name: "Delete", exact: true }));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("Course cannot be deleted");
    });
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
  });

  it("closes safely when the teacher cancels", async () => {
    const user = userEvent.setup();
    renderAction();

    await user.click(screen.getByRole("button", { name: "Delete course" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(mockDeleteCourse).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    });
  });
});

