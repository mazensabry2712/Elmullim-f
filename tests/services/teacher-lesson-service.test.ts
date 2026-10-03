import { beforeEach, describe, expect, it, vi } from "vitest";
import axiosAPI from "@/config/axios.config";
import { updateTeacherLesson } from "@/services/teacher/lessons";

vi.mock("@/config/axios.config", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("teacher lesson update API client", () => {
  const postMock = vi.mocked(axiosAPI.post);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("can update non-schedule lesson fields without sending unchanged availability", async () => {
    postMock.mockResolvedValueOnce({
      data: {
        status: true,
        message: "updated",
      },
    });

    await updateTeacherLesson({
      token: "teacher-token",
      lesson: {
        id: 17,
        education_level_id: 2,
        subject_id: 5,
        grade: "Grade 10",
        delivery_mode: "online",
        booking_type: "private",
        title: "Updated lesson",
        description: "Updated description",
        duration_minutes: 60,
        price: 100,
        sessions_count: 1,
      },
    });

    const [, formData, config] = postMock.mock.calls[0];
    expect(formData).toBeInstanceOf(FormData);
    expect(formData.get("title")).toBe("Updated lesson");
    expect(formData.get("meeting_url")).toBeNull();
    expect(formData.get("availability[0][meeting_url]")).toBeNull();
    expect(formData.get("availability[0][day_of_week]")).toBeNull();
    expect(formData.get("service_area_ids[]")).toBeNull();
    expect(formData.get("_method")).toBe("put");
    expect(config).toEqual({
      headers: { Authorization: "Bearer teacher-token" },
    });
  });

  it("sends a meeting URL inside an availability slot when schedule changes", async () => {
    postMock.mockResolvedValueOnce({
      data: { status: true, message: "updated" },
    });

    await updateTeacherLesson({
      token: "teacher-token",
      lesson: {
        id: 18,
        education_level_id: 2,
        subject_id: 5,
        grade: "Grade 10",
        delivery_mode: "online",
        booking_type: "private",
        title: "Slot links lesson",
        description: "Updated schedule",
        duration_minutes: 60,
        price: 100,
        sessions_count: 1,
        availability: [
          {
            day_of_week: 6,
            start_time: "18:00",
            end_time: "19:00",
            timezone: "Africa/Cairo",
            meeting_url: "https://meet.example.test/saturday",
          },
        ],
      },
    });

    const [, formData] = postMock.mock.calls[0];
    expect(formData.get("meeting_url")).toBeNull();
    expect(formData.get("availability[0][day_of_week]")).toBe("6");
    expect(formData.get("availability[0][meeting_url]")).toBe("https://meet.example.test/saturday");
  });
});
