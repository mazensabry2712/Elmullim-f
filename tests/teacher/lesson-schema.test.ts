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
          available_on: "2026-10-15",
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



  it("returns field-specific required errors instead of NaN for empty numeric selects", () => {
    const result = lessonSchema.safeParse({
      ...baseLesson,
      education_level_id: "",
      subject_id: "",
      availability: [
        {
          available_on: "",
          day_of_week: 6,
          start_time: "18:00",
          end_time: "19:00",
          timezone: "Africa/Cairo",
          meeting_url: "https://meet.example.test/lesson",
        },
      ],
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const messages = result.error.issues.map((issue) => issue.message);
      expect(messages).toContain("stage is required");
      expect(messages).toContain("subject is required");
      expect(messages.some((message) => /nan/i.test(message))).toBe(false);
    }
  });

  it("rejects an empty price instead of treating it as a free lesson", () => {
    const result = lessonSchema.safeParse({
      ...baseLesson,
      price: "",
      availability: [
        {
          available_on: "",
          day_of_week: 6,
          start_time: "18:00",
          end_time: "19:00",
          timezone: "Africa/Cairo",
          meeting_url: "https://meet.example.test/lesson",
        },
      ],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.message)).toContain("enter a valid price");
    }
  });

  it("allows blank capacity for private lessons but requires it for group lessons", () => {
    const availability = [
      {
        available_on: "",
        day_of_week: 6,
        start_time: "18:00",
        end_time: "19:00",
        timezone: "Africa/Cairo",
        meeting_url: "https://meet.example.test/lesson",
      },
    ];

    const privateResult = lessonSchema.safeParse({
      ...baseLesson,
      booking_type: "private",
      max_students: "",
      availability,
    });

    expect(privateResult.success).toBe(true);

    const groupResult = lessonSchema.safeParse({
      ...baseLesson,
      booking_type: "group",
      max_students: "",
      availability,
    });

    expect(groupResult.success).toBe(false);
    if (!groupResult.success) {
      expect(groupResult.error.issues.map((issue) => issue.message)).toContain(
        "maximum students is required for group lessons"
      );
    }
  });


  it("handles browser NaN values as missing numeric inputs", () => {
    const result = lessonSchema.safeParse({
      ...baseLesson,
      education_level_id: Number.NaN,
      subject_id: Number.NaN,
      duration_minutes: Number.NaN,
      price: Number.NaN,
      sessions_count: Number.NaN,
      max_students: Number.NaN,
      booking_type: "group",
      availability: [
        {
          available_on: "",
          day_of_week: 6,
          start_time: "18:00",
          end_time: "19:00",
          timezone: "Africa/Cairo",
          meeting_url: "https://meet.example.test/lesson",
        },
      ],
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const messages = result.error.issues.map((issue) => issue.message);

      expect(messages).toContain("stage is required");
      expect(messages).toContain("subject is required");
      expect(messages).toContain("duration is required");
      expect(messages).toContain("enter a valid price");
      expect(messages).toContain("sessions count is required");
      expect(messages.some((message) => /nan/i.test(message))).toBe(false);
    }

    const groupCapacityResult = lessonSchema.safeParse({
      ...baseLesson,
      booking_type: "group",
      max_students: Number.NaN,
      availability: [
        {
          available_on: "",
          day_of_week: 6,
          start_time: "18:00",
          end_time: "19:00",
          timezone: "Africa/Cairo",
          meeting_url: "https://meet.example.test/lesson",
        },
      ],
    });

    expect(groupCapacityResult.success).toBe(false);

    if (!groupCapacityResult.success) {
      const messages = groupCapacityResult.error.issues.map((issue) => issue.message);

      expect(messages).toContain(
        "maximum students is required for group lessons"
      );
      expect(messages.some((message) => /nan/i.test(message))).toBe(false);
    }
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
