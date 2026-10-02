import { z } from "zod";

const validationMessage = (english: string, arabic: string) => {
  return typeof document !== "undefined" && document.documentElement.lang === "ar"
    ? arabic
    : english;
};

const requiredText = (english: string, arabic: string) =>
  z.string({ message: validationMessage(english, arabic) }).trim().min(1, {
    message: validationMessage(english, arabic),
  });

const positiveInteger = (english: string, arabic: string) =>
  z.coerce
    .number({ message: validationMessage(english, arabic) })
    .int({ message: validationMessage(english, arabic) })
    .min(1, { message: validationMessage(english, arabic) });

const timeOnly = (english: string, arabic: string) =>
  z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, {
    message: validationMessage(english, arabic),
  });

const availabilitySlotSchema = z.object({
  day_of_week: z.coerce.number().int().min(1).max(7),
  start_time: timeOnly("start time is invalid", "وقت البداية غير صحيح"),
  end_time: timeOnly("end time is invalid", "وقت النهاية غير صحيح"),
  timezone: requiredText("timezone is required", "المنطقة الزمنية مطلوبة"),
  meeting_url: z
    .string()
    .trim()
    .url({ message: validationMessage("enter a valid meeting URL", "أدخل رابط اجتماع صحيح") })
    .or(z.literal("")),
});

export const lessonSchema = z
  .object({
    education_level_id: z.coerce.number().int().min(1, {
      message: validationMessage("stage is required", "المرحلة مطلوبة"),
    }),
    subject_id: z.coerce.number().int().min(1, {
      message: validationMessage("subject is required", "المادة مطلوبة"),
    }),
    grade: requiredText("grade is required", "الصف مطلوب").max(100, {
      message: validationMessage("grade is too long", "الصف طويل جدًا"),
    }),
    delivery_mode: z.enum(["online", "offline"], {
      message: validationMessage("delivery mode is required", "نوع الدرس مطلوب"),
    }),
    booking_type: z.enum(["private", "group"], {
      message: validationMessage("booking type is required", "نوع الحجز مطلوب"),
    }),
    title: requiredText("title is required", "العنوان مطلوب").max(100, {
      message: validationMessage("title is too long", "العنوان طويل جدًا"),
    }),
    description: requiredText("description is required", "الوصف مطلوب").max(250, {
      message: validationMessage("description is too long", "الوصف طويل جدًا"),
    }),
    duration_minutes: positiveInteger("duration is required", "مدة الحصة مطلوبة"),
    price: z.coerce
      .number({ message: validationMessage("enter a valid price", "أدخل سعرًا صحيحًا") })
      .min(0, { message: validationMessage("enter a valid price", "أدخل سعرًا صحيحًا") }),
    sessions_count: positiveInteger("sessions count is required", "عدد الحصص مطلوب"),
    offline_visit_type: z.enum(["teacher_to_student", "student_to_teacher", ""], {
      message: validationMessage("select a valid visit type", "اختر طريقة زيارة صحيحة"),
    }),
    service_area_ids: z.array(z.coerce.number().int().positive()),
    max_students: z.union([
      z.coerce.number().int().min(1, {
        message: validationMessage("capacity must be at least 1", "الحد الأقصى يجب أن يكون 1 على الأقل"),
      }),
      z.literal(""),
    ]),
    availability: z.array(availabilitySlotSchema).min(1, {
      message: validationMessage("add at least one availability slot", "أضف موعدًا متاحًا واحدًا على الأقل"),
    }),
  })
  .superRefine((data, ctx) => {
    if (data.delivery_mode === "online") {
      data.availability.forEach((slot, index) => {
        if (!slot.meeting_url?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["availability", index, "meeting_url"],
            message: validationMessage(
              "meeting URL is required for every online availability slot",
              "رابط الاجتماع مطلوب لكل موعد أونلاين"
            ),
          });
        }
      });
    }

    if (data.delivery_mode === "offline") {
      if (!data.offline_visit_type) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["offline_visit_type"],
          message: validationMessage("visit type is required for offline lessons", "طريقة الزيارة مطلوبة للدروس الحضورية"),
        });
      }

      if (data.offline_visit_type === "teacher_to_student" && data.service_area_ids.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["service_area_ids"],
          message: validationMessage(
            "select at least one active service area when the teacher visits the student",
            "اختر منطقة خدمة نشطة واحدة على الأقل عندما يذهب المعلم إلى الطالب"
          ),
        });
      }
    }

    if (data.delivery_mode !== "offline" && data.service_area_ids.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["service_area_ids"],
        message: validationMessage("service areas are only for offline lessons", "مناطق الخدمة مخصصة للدروس الحضورية فقط"),
      });
    }

    if (data.booking_type === "group" && data.max_students === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["max_students"],
        message: validationMessage("maximum students is required for group lessons", "الحد الأقصى للطلاب مطلوب للدروس الجماعية"),
      });
    }

    data.availability.forEach((slot, index) => {
      if (slot.start_time >= slot.end_time) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["availability", index, "end_time"],
          message: validationMessage("end time must be later than start time", "يجب أن يكون وقت النهاية بعد وقت البداية"),
        });
      }

      data.availability.forEach((other, otherIndex) => {
        if (index >= otherIndex) return;
        if (slot.day_of_week !== other.day_of_week || slot.timezone !== other.timezone) return;
        if (slot.start_time < other.end_time && slot.end_time > other.start_time) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["availability", index, "end_time"],
            message: validationMessage("availability slots cannot overlap", "لا يمكن أن تتداخل مواعيد التوفر"),
          });
        }
      });
    });
  });

