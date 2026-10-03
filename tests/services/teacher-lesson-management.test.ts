import { beforeEach, describe, expect, it, vi } from "vitest";
import axiosAPI from "@/config/axios.config";
import {
  resubmitTeacherLesson,
  unpublishTeacherLesson,
} from "@/services/teacher/lessons";

vi.mock("@/config/axios.config", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("teacher lesson status management API", () => {
  const postMock = vi.mocked(axiosAPI.post);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("resubmits a teacher lesson for review", async () => {
    postMock.mockResolvedValueOnce({
      data: {
        status: true,
        message: "Lesson submitted for review.",
        data: { publishing_status: "pending_approval" },
      },
    });

    await resubmitTeacherLesson({ token: "teacher-token", id: 17 });

    expect(postMock).toHaveBeenCalledWith(
      "/teacher/lessons/17/resubmit",
      {},
      { headers: { Authorization: "Bearer teacher-token" } },
    );
  });

  it("unpublishes a teacher lesson", async () => {
    postMock.mockResolvedValueOnce({
      data: {
        status: true,
        message: "Lesson unpublished successfully.",
        data: { publishing_status: "unpublished" },
      },
    });

    await unpublishTeacherLesson({ token: "teacher-token", id: 18 });

    expect(postMock).toHaveBeenCalledWith(
      "/teacher/lessons/18/unpublish",
      {},
      { headers: { Authorization: "Bearer teacher-token" } },
    );
  });
});
