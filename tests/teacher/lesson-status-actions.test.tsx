import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import LessonStatusActions from "@/components/profiles/teacher/lessons/LessonStatusActions";

const publishMutateAsync = vi.fn();
const resubmitMutateAsync = vi.fn();
const unpublishMutateAsync = vi.fn();

vi.mock("@/lib/react-query/teacher/lessons", () => ({
  usePublishTeacherLesson: () => ({
    mutateAsync: publishMutateAsync,
    isPending: false,
  }),
  useResubmitTeacherLesson: () => ({
    mutateAsync: resubmitMutateAsync,
    isPending: false,
  }),
  useUnpublishTeacherLesson: () => ({
    mutateAsync: unpublishMutateAsync,
    isPending: false,
  }),
}));

vi.mock("@/utils/cookieService", () => ({
  default: { getToken: vi.fn(() => "teacher-token") },
}));

vi.mock("@/utils/handleResponseError", () => ({
  default: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(),
  },
}));

vi.mock("@/i18n", () => ({
  useI18n: () => ({ language: "en" }),
}));

const renderActions = (overrides: Record<string, unknown> = {}) =>
  render(
    <MemoryRouter>
      <LessonStatusActions
        lesson={{
          id: 17,
          publishing_status: "draft",
          ...overrides,
        }}
      />
    </MemoryRouter>,
  );

describe("LessonStatusActions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    publishMutateAsync.mockResolvedValue({
      status: true,
      message: "Lesson published successfully.",
    });
    resubmitMutateAsync.mockResolvedValue({
      status: true,
      message: "Lesson submitted for review.",
    });
    unpublishMutateAsync.mockResolvedValue({
      status: true,
      message: "Lesson unpublished successfully.",
    });
  });

  it("publishes draft lessons instead of sending them for review", async () => {
    const user = userEvent.setup();
    renderActions({ publishing_status: "draft" });

    await user.click(screen.getByRole("button", { name: "Publish lesson" }));

    expect(publishMutateAsync).toHaveBeenCalledWith({
      token: "teacher-token",
      id: 17,
    });
    expect(resubmitMutateAsync).not.toHaveBeenCalled();
  });

  it("publishes unpublished lessons directly", async () => {
    const user = userEvent.setup();
    renderActions({ publishing_status: "unpublished" });

    await user.click(screen.getByRole("button", { name: "Publish lesson" }));

    expect(publishMutateAsync).toHaveBeenCalledWith({
      token: "teacher-token",
      id: 17,
    });
  });

  it("keeps rejected lessons on the review workflow", async () => {
    const user = userEvent.setup();
    renderActions({ publishing_status: "rejected" });

    await user.click(screen.getByRole("button", { name: "Resubmit for review" }));

    expect(resubmitMutateAsync).toHaveBeenCalledWith({
      token: "teacher-token",
      id: 17,
    });
    expect(publishMutateAsync).not.toHaveBeenCalled();
  });

  it("shows a clear pending state while a lesson is under review", () => {
    renderActions({ publishing_status: "pending_approval" });

    expect(screen.getByText("Pending review")).toBeInTheDocument();
    expect(screen.getByText(/under review/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Publish lesson" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Resubmit for review" })).not.toBeInTheDocument();
  });
});
