import { beforeEach, describe, expect, it, vi } from "vitest";
import axiosAPI from "@/config/axios.config";
import { getStudentProfile } from "@/services/student/studentProfile";
import { teacherLogin } from "@/services/auth/teachers";
import { parentLogin } from "@/services/auth/parents";

vi.mock("@/config/axios.config", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("profile/auth service requests", () => {
  const getMock = vi.mocked(axiosAPI.get);
  const postMock = vi.mocked(axiosAPI.post);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("requests the student profile with the bearer token", async () => {
    getMock.mockResolvedValueOnce({
      data: {
        status: true,
        data: {
          name: "Demo Student",
          email: "student@elmullim.test",
        },
      },
    });

    await expect(getStudentProfile("student-token")).resolves.toEqual({
      status: true,
      data: {
        name: "Demo Student",
        email: "student@elmullim.test",
      },
    });

    expect(getMock).toHaveBeenCalledWith("/student/me", {
      headers: { Authorization: "Bearer student-token" },
    });
  });

  it("posts teacher credentials to the teacher login endpoint", async () => {
    postMock.mockResolvedValueOnce({
      data: { status: true, message: "success login", data: { token: "teacher-token" } },
    });

    await teacherLogin({
      email: "teacher@elmullim.test",
      password: "Teacher@12345",
    });

    expect(postMock).toHaveBeenCalledWith("/teacher/login", {
      email: "teacher@elmullim.test",
      password: "Teacher@12345",
    });
  });

  it("posts parent credentials to the parent login endpoint", async () => {
    postMock.mockResolvedValueOnce({
      data: { status: true, message: "success login", data: { token: "parent-token" } },
    });

    await parentLogin({
      email: "parent@elmullim.test",
      password: "Parent@12345",
    });

    expect(postMock).toHaveBeenCalledWith("/parent/login", {
      email: "parent@elmullim.test",
      password: "Parent@12345",
    });
  });
});
