import { beforeEach, describe, expect, it, vi } from "vitest";
import axiosAPI from "@/config/axios.config";
import { userLogout } from "@/services/auth";

vi.mock("@/config/axios.config", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("student logout service", () => {
  const postMock = vi.mocked(axiosAPI.post);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls the student logout endpoint with the bearer token", async () => {
    postMock.mockResolvedValueOnce({
      data: {
        status: true,
        message: "success logout",
      },
    });

    const result = await userLogout({
      role: "student",
      token: "student-test-token",
    });

    expect(postMock).toHaveBeenCalledOnce();
    expect(postMock).toHaveBeenCalledWith(
      "/student/logout",
      {},
      {
        headers: {
          Authorization: "Bearer student-test-token",
        },
      }
    );
    expect(result).toEqual({
      status: true,
      message: "success logout",
    });
  });

  it("propagates logout API errors", async () => {
    const error = new Error("Logout failed");
    postMock.mockRejectedValueOnce(error);

    await expect(
      userLogout({
        role: "student",
        token: "student-test-token",
      })
    ).rejects.toBe(error);
  });
});
