import { describe, expect, it } from "vitest";
import { lessonSchema } from "@/validations/teacher/lessonSchema";

const baseLesson = {
  education_level_id: 1,
  subject_id: 1,
  grade: "Grade 10",
  delivery_mode: "online" as const,
  booking_type: "private" as const,
  title: "Weekly Mathematics",
  description: "A recurring mathematics lesson.",
  duration_minutes: 60,
  price: 100,
  sessions_count: 1,
  booking_opens_at: "",
  booking_closes_at: "",
  ends_at: "",
  offline_visit_type: "" as const,
  service_area_ids: [],
  max_students: "",
};

describe("teacher lesson schedule schema", () => {
  it("accepts a recurring weekly slot without an exact date", () => {
    const result = lessonSchema.safeParse({
      ...baseLesson,
      availability: [
        {
          available_on: "",
          day_of_week: 4,
          start_time: "16:00",
          end_time: "17:00",
          timezone: "Africa/Cairo",
          meeting_url: "https://meet.example.test/thursday",
        },
      ],
    });

    expect(result.success).toBe(true);
  });

  it("keeps exact dates available for one-off slots", () => {
    const result = lessonSchema.safeParse({
      ...baseLesson,
      availability: [
        {
          available_on: "2026-10-08",
          day_of_week: 4,
          start_time: "16:00",
          end_time: "17:00",
          timezone: "Africa/Cairo",
          meeting_url: "https://meet.example.test/one-off",
        },
      ],
    });

    expect(result.success).toBe(true);
  });

  it("rejects an exact date whose weekday does not match", () => {
    const result = lessonSchema.safeParse({
      ...baseLesson,
      availability: [
        {
          available_on: "2026-10-08",
          day_of_week: 5,
          start_time: "16:00",
          end_time: "17:00",
          timezone: "Africa/Cairo",
          meeting_url: "https://meet.example.test/one-off",
        },
      ],
    });

    expect(result.success).toBe(false);
  });
});
