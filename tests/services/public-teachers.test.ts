import axiosAPI from "@/config/axios.config";
import { getPublicTeachers } from "@/services/main";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/axios.config", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("getPublicTeachers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("requests the public teachers endpoint with the requested list size", async () => {
    vi.mocked(axiosAPI.get).mockResolvedValue({
      data: {
        status: true,
        message: null,
        data: [],
      },
    } as never);

    const response = await getPublicTeachers(8);

    expect(axiosAPI.get).toHaveBeenCalledWith("/main/teachers", {
      params: { limit: 8 },
    });
    expect(response.data).toEqual([]);
  });

  it("uses eight teachers by default", async () => {
    vi.mocked(axiosAPI.get).mockResolvedValue({
      data: {
        status: true,
        message: null,
        data: [],
      },
    } as never);

    await getPublicTeachers();

    expect(axiosAPI.get).toHaveBeenCalledWith("/main/teachers", {
      params: { limit: 8 },
    });
  });
});
