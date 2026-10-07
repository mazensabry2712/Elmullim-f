import { beforeEach, describe, expect, it, vi } from "vitest";
import axiosAPI from "@/config/axios.config";
import { getAllCountries } from "@/services/main";

vi.mock("@/config/axios.config", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("getAllCountries", () => {
  const getMock = vi.mocked(axiosAPI.get);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("reads countries from the public endpoint used by registration forms", async () => {
    getMock.mockResolvedValueOnce({
      data: {
        status: true,
        data: [
          { id: 1, name: "Egypt", code: "+20" },
          { id: 2, name: "Saudi Arabia", code: "+966" },
        ],
      },
    });

    const result = await getAllCountries();

    expect(getMock).toHaveBeenCalledOnce();
    expect(getMock).toHaveBeenCalledWith("/main/countries");
    expect(result).toEqual({
      status: true,
      data: [
        { id: 1, name: "Egypt", code: "+20" },
        { id: 2, name: "Saudi Arabia", code: "+966" },
      ],
    });
  });

  it("propagates country API failures", async () => {
    const error = new Error("Countries request failed");
    getMock.mockRejectedValueOnce(error);

    await expect(getAllCountries()).rejects.toBe(error);
  });
});
