import { beforeEach, describe, expect, it, vi } from "vitest";
import axiosAPI from "@/config/axios.config";
import { parentRegister } from "@/services/auth/parents";
import type { IParentRegister } from "@/interfaces/auth/auth";

vi.mock("@/config/axios.config", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("parentRegister", () => {
  const postMock = vi.mocked(axiosAPI.post);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("posts parent signup data without creating automatic student links", async () => {
    const payload: IParentRegister = {
      name: "New Parent",
      email: "new-parent@example.test",
      password: "Parent@12345",
      phone: "201001234567",
      gender: "female",
      country_id: "1",
      education_system_id: "2",
      education_level_id: "3",
    };

    postMock.mockResolvedValueOnce({
      data: {
        status: true,
        message: "success register",
        data: { token: "parent-registration-token" },
      },
    });

    const result = await parentRegister(payload);

    expect(postMock).toHaveBeenCalledOnce();
    expect(postMock).toHaveBeenCalledWith(
      "/parent/register",
      expect.any(FormData),
    );

    const sentFormData = postMock.mock.calls[0][1] as FormData;
    expect(Object.fromEntries(sentFormData.entries())).toEqual(payload);
    expect(sentFormData.has("students")).toBe(false);
    expect([...sentFormData.keys()].some((key) => key.startsWith("students["))).toBe(false);
    expect(result.data.token).toBe("parent-registration-token");
  });

  it("propagates API validation errors", async () => {
    const error = new Error("Validation failed");
    postMock.mockRejectedValueOnce(error);

    await expect(
      parentRegister({
        name: "New Parent",
        email: "new-parent@example.test",
        password: "Parent@12345",
        phone: "201001234567",
        gender: "female",
        country_id: "1",
        education_system_id: "2",
        education_level_id: "3",
      }),
    ).rejects.toBe(error);
  });
});
