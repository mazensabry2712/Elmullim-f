import { beforeEach, describe, expect, it, vi } from "vitest";
import axiosAPI from "@/config/axios.config";
import { getStudentProfile } from "@/services/student/studentProfile";
import { getTeacherProfile, getTeacherRatings } from "@/services/teacher/teacherProfile";
import { getParentProfile } from "@/services/parent/parentProfile";

vi.mock("@/config/axios.config", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("profile service requests", () => {
  const getMock = vi.mocked(axiosAPI.get);

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

  it("requests the teacher profile with the bearer token", async () => {
    getMock.mockResolvedValueOnce({
      data: {
        status: true,
        data: {
          name: "Demo Teacher",
          email: "teacher@elmullim.test",
        },
      },
    });

    await expect(getTeacherProfile("teacher-token")).resolves.toEqual({
      status: true,
      data: {
        name: "Demo Teacher",
        email: "teacher@elmullim.test",
      },
    });

    expect(getMock).toHaveBeenCalledWith("/teacher/me", {
      headers: { Authorization: "Bearer teacher-token" },
    });
  });

  it("requests teacher ratings using the backend singular rating route", async () => {
    getMock.mockResolvedValueOnce({
      data: {
        status: true,
        message: null,
        data: [],
      },
    });

    await getTeacherRatings("teacher-token");

    expect(getMock).toHaveBeenCalledWith("/teacher/rating/received-all", {
      headers: { Authorization: "Bearer teacher-token" },
    });
  });

  it("requests the parent profile with the bearer token", async () => {
    getMock.mockResolvedValueOnce({
      data: {
        status: true,
        data: {
          name: "Demo Parent",
          email: "parent@elmullim.test",
        },
      },
    });

    await expect(getParentProfile("parent-token")).resolves.toEqual({
      status: true,
      data: {
        name: "Demo Parent",
        email: "parent@elmullim.test",
      },
    });

    expect(getMock).toHaveBeenCalledWith("/parent/me", {
      headers: { Authorization: "Bearer parent-token" },
    });
  });
});
