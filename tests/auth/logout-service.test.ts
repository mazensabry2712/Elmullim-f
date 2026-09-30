import { beforeEach, describe, expect, it, vi } from "vitest";

const postMock = vi.hoisted(() => vi.fn());

vi.mock("@/config/axios.config", () => ({
  default: {
    post: postMock,
  },
}));

import { userLogout } from "@/services/auth";

describe("userLogout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    postMock.mockResolvedValue({
      data: {
        status: true,
        message: "success logout",
      },
    });
  });

  it.each([
    ["student", "/student/logout"],
    ["parent", "/parent/logout"],
    ["teacher", "/teacher/logout"],
  ] as const)("uses the correct logout endpoint for %s", async (role, endpoint) => {
    await userLogout({
      token: "test-token",
      role,
    });

    expect(postMock).toHaveBeenCalledTimes(1);
    expect(postMock).toHaveBeenCalledWith(
      endpoint,
      {},
      {
        headers: {
          Authorization: "Bearer test-token",
        },
      }
    );
  });

  it("returns the API response unchanged", async () => {
    const response = {
      status: true,
      message: "success logout",
    };

    postMock.mockResolvedValueOnce({ data: response });

    await expect(
      userLogout({
        token: "test-token",
        role: "student",
      })
    ).resolves.toEqual(response);
  });
});
