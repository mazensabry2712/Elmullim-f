import { beforeEach, describe, expect, it, vi } from "vitest";
import axiosAPI from "@/config/axios.config";
import { studentLogin } from "@/services/auth/students";

vi.mock("@/config/axios.config", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("studentLogin", () => {
  const postMock = vi.mocked(axiosAPI.post);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("posts student credentials to the student login endpoint", async () => {
    postMock.mockResolvedValueOnce({
      data: {
        status: true,
        message: "success login",
        data: {
          token: "student-test-token",
        },
      },
    });

    const result = await studentLogin({
      email: "student@elmullim.test",
      password: "Student@12345",
    });

    expect(postMock).toHaveBeenCalledOnce();
    expect(postMock).toHaveBeenCalledWith("/student/login", {
      email: "student@elmullim.test",
      password: "Student@12345",
    });
    expect(result).toEqual({
      status: true,
      message: "success login",
      data: {
        token: "student-test-token",
      },
    });
  });

  it("propagates API errors to the caller", async () => {
    const error = new Error("Request failed");
    postMock.mockRejectedValueOnce(error);

    await expect(
      studentLogin({
        email: "student@elmullim.test",
        password: "WrongPassword@123",
      })
    ).rejects.toBe(error);
  });
});
