import { beforeEach, describe, expect, it, vi } from "vitest";
import axiosAPI from "@/config/axios.config";
import { studentRegister } from "@/services/auth/students";
import type { IStudentRegister } from "@/interfaces/auth/auth";

vi.mock("@/config/axios.config", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("studentRegister", () => {
  const postMock = vi.mocked(axiosAPI.post);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("posts every student signup field to the registration endpoint", async () => {
    const payload: IStudentRegister = {
      name: "New Student",
      email: "new-student@example.test",
      password: "Student@12345",
      gender: "male",
      address: "Cairo, Egypt",
      phone: "201001234567",
      country_id: "1",
      education_system_id: "2",
      education_level_id: "3",
    };

    postMock.mockResolvedValueOnce({
      data: {
        status: true,
        message: "success register done",
        data: {
          token: "student-registration-token",
        },
      },
    });

    const result = await studentRegister(payload);

    expect(postMock).toHaveBeenCalledOnce();
    expect(postMock).toHaveBeenCalledWith("/student/register", payload);
    expect(result).toEqual({
      status: true,
      message: "success register done",
      data: {
        token: "student-registration-token",
      },
    });
  });

  it("propagates API validation errors", async () => {
    const error = new Error("Validation failed");
    postMock.mockRejectedValueOnce(error);

    await expect(
      studentRegister({
        name: "New Student",
        email: "new-student@example.test",
        password: "Student@12345",
        gender: "male",
        address: "Cairo, Egypt",
        phone: "201001234567",
        country_id: "1",
        education_system_id: "2",
        education_level_id: "3",
      })
    ).rejects.toBe(error);
  });
});
