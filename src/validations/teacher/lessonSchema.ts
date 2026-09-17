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
    meeting_url: z.string().trim().url({
      message: validationMessage("enter a valid meeting URL", "أدخل رابط اجتماع صحيح"),
    }).or(z.literal("")),
    location: z.string().trim().max(2000, {
      message: validationMessage("location is too long", "المكان طويل جدًا"),
    }),
    offline_visit_type: z.string().trim().max(100, {
      message: validationMessage("visit type is too long", "نوع الزيارة طويل جدًا"),
    }),
    max_students: z.union([
      z.coerce.number().int().min(1, {
        message: validationMessage("capacity must be at least 1", "الحد الأقصى يجب أن يكون 1 على الأقل"),
      }),
      z.literal(""),
    ]),
  })
  .superRefine((data, ctx) => {
    if (data.delivery_mode === "offline") {
      if (!data.location) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["location"],
          message: validationMessage("location is required for offline lessons", "مكان الدرس مطلوب للدروس الحضورية"),
        });
      }

      if (!data.offline_visit_type) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["offline_visit_type"],
          message: validationMessage("visit type is required for offline lessons", "طريقة الزيارة مطلوبة للدروس الحضورية"),
        });
      }
    }

    if (data.booking_type === "group" && data.max_students === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["max_students"],
        message: validationMessage("maximum students is required for group lessons", "الحد الأقصى للطلاب مطلوب للدروس الجماعية"),
      });
    }
  });

export const lessonContentSchema = z.object({
  title: requiredText("title is required", "العنوان مطلوب"),
  description: requiredText("description is required", "الوصف مطلوب"),
  lessonId: requiredText("lesson is required", "الدرس مطلوب"),
});

export const lessonLectureSchema = z.object({
  title: requiredText("title is required", "العنوان مطلوب"),
  description: requiredText("description is required", "الوصف مطلوب"),
  lessonId: requiredText("lesson is required", "الدرس مطلوب"),
  contentId: requiredText("content is required", "المحتوى مطلوب"),
});

export const lessonVideoSchema = z.object({
  lessonId: requiredText("lesson is required", "الدرس مطلوب"),
  contentId: requiredText("content is required", "المحتوى مطلوب"),
  lectureId: requiredText("lecture is required", "المحاضرة مطلوبة"),
});
