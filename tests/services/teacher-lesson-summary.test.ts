import { beforeEach, describe, expect, it, vi } from "vitest";
import axiosAPI from "@/config/axios.config";
import { getTeacherLessonSummary } from "@/services/teacher/lessons";

vi.mock("@/config/axios.config", () => ({
  default: { get: vi.fn() },
}));

describe("teacher lesson summary service", () => {
  const getMock = vi.mocked(axiosAPI.get);

  beforeEach(() => {
    vi.clearAllMocks();
    getMock.mockResolvedValueOnce({
      data: {
        status: true,
        message: null,
        data: {
          total_lessons: 4,
          published_lessons: 2,
          pending_lessons: 1,
          active_bookings: 3,
          unique_students: 3,
          upcoming_sessions: 2,
          rating: 4.5,
          total_earnings: 1200,
          available_balance: 900,
        },
      },
    });
  });

  it("loads the teacher performance summary", async () => {
    const response = await getTeacherLessonSummary("teacher-token");

    expect(response.data.rating).toBe(4.5);
    expect(getMock).toHaveBeenCalledWith("/teacher/lessons/summary", {
      headers: { Authorization: "Bearer teacher-token" },
    });
  });
});
