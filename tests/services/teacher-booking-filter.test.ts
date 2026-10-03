import { beforeEach, describe, expect, it, vi } from "vitest";
import axiosAPI from "@/config/axios.config";
import { getTeacherBookings } from "@/services/booking";

vi.mock("@/config/axios.config", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("teacher bookings lesson filter", () => {
  const getMock = vi.mocked(axiosAPI.get);

  beforeEach(() => {
    vi.clearAllMocks();
    getMock.mockResolvedValueOnce({
      data: {
        status: true,
        message: null,
        data: [],
        meta: {
          current_page: 1,
          last_page: 1,
          per_page: 25,
          total: 0,
          from: null,
          to: null,
          has_more_pages: false,
        },
      },
    });
  });

  it("passes lesson_id to the teacher bookings endpoint", async () => {
    await getTeacherBookings({
      token: "teacher-token",
      page: 2,
      lessonId: 42,
    });

    expect(getMock).toHaveBeenCalledWith(
      "/teacher/bookings",
      {
        headers: { Authorization: "Bearer teacher-token" },
        params: { page: "2", lesson_id: "42" },
      },
    );
  });
});
