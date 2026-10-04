import { describe, expect, it } from "vitest";
import { lessonSchema } from "@/validations/teacher/lessonSchema";

const baseLesson = {
  education_level_id: 1,
  subject_id: 2,
  grade: "Grade 10",
  delivery_mode: "online" as const,
  booking_type: "private" as const,
  title: "Algebra",
  description: "Live algebra lesson",
  duration_minutes: 60,
  price: 100,
  sessions_count: 1,
  offline_visit_type: "" as const,
  service_area_ids: [],
  max_students: "",
};

describe("lesson slot meeting links", () => {
  it("requires a meeting URL for every online availability slot", () => {
    const result = lessonSchema.safeParse({
      ...baseLesson,
      availability: [
        {
          available_on: "2099-01-10",
          day_of_week: 6,
          start_time: "18:00",
          end_time: "19:00",
          timezone: "Africa/Cairo",
          meeting_url: "https://meet.example.test/one",
        },
        {
          available_on: "2099-01-11",
          day_of_week: 2,
          start_time: "18:00",
          end_time: "19:00",
          timezone: "Africa/Cairo",
          meeting_url: "",
        },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("accepts different meeting URLs for different online slots", () => {
    const result = lessonSchema.safeParse({
      ...baseLesson,
      availability: [
        {
          available_on: "2099-01-10",
          day_of_week: 6,
          start_time: "18:00",
          end_time: "19:00",
          timezone: "Africa/Cairo",
          meeting_url: "https://meet.example.test/saturday",
        },
        {
          day_of_week: 2,
          start_time: "20:00",
          end_time: "21:00",
          timezone: "Africa/Cairo",
          meeting_url: "https://meet.example.test/tuesday",
        },
      ],
    });

    expect(result.success).toBe(true);
  });

  it("rejects availability slots shorter than the lesson duration", () => {
    const result = lessonSchema.safeParse({
      ...baseLesson,
      duration_minutes: 90,
      availability: [
        {
          available_on: "2099-01-10",
          day_of_week: 6,
          start_time: "18:00",
          end_time: "19:00",
          timezone: "Africa/Cairo",
          meeting_url: "https://meet.example.test/one",
        },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("does not require meeting URLs for offline slots", () => {
    const result = lessonSchema.safeParse({
      ...baseLesson,
      delivery_mode: "offline",
      offline_visit_type: "student_to_teacher",
      availability: [
        {
          available_on: "2099-01-10",
          day_of_week: 6,
          start_time: "18:00",
          end_time: "19:00",
          timezone: "Africa/Cairo",
          meeting_url: "",
        },
      ],
    });

    expect(result.success).toBe(true);
  });
});
