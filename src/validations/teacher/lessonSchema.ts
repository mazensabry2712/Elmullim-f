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
  available_on: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: validationMessage(
        "availability date is invalid",
        "تاريخ الإتاحة غير صحيح"
      ),
    })
    .optional()
    .or(z.literal("")),
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
    booking_opens_at: z.string().optional().or(z.literal("")),
    booking_closes_at: z.string().optional().or(z.literal("")),
    ends_at: z.string().optional().or(z.literal("")),
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

    const opens = data.booking_opens_at ? new Date(data.booking_opens_at) : null;
    const closes = data.booking_closes_at ? new Date(data.booking_closes_at) : null;
    const ends = data.ends_at ? new Date(data.ends_at) : null;

    if (opens && Number.isNaN(opens.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["booking_opens_at"],
        message: validationMessage("booking opening date is invalid", "تاريخ بدء الحجز غير صحيح"),
      });
    }

    if (closes && Number.isNaN(closes.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["booking_closes_at"],
        message: validationMessage("booking closing date is invalid", "تاريخ إغلاق الحجز غير صحيح"),
      });
    }

    if (ends && Number.isNaN(ends.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["ends_at"],
        message: validationMessage("lesson end date is invalid", "تاريخ نهاية الدرس غير صحيح"),
      });
    }

    if (opens && closes && closes < opens) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["booking_closes_at"],
        message: validationMessage("booking close date must be after opening date", "يجب أن يكون إغلاق الحجز بعد بدء الحجز"),
      });
    }

    if (closes && ends && ends <= closes) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["ends_at"],
        message: validationMessage("lesson end date must be after booking close date", "يجب أن تكون نهاية الدرس بعد إغلاق الحجز"),
      });
    }

    if (!closes && opens && ends && ends <= opens) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["ends_at"],
        message: validationMessage("lesson end date must be after booking opening date", "يجب أن تكون نهاية الدرس بعد بدء الحجز"),
      });
    }

    data.availability.forEach((slot, index) => {
      const availableDate = new Date(slot.available_on + "T00:00:00Z");

      if (Number.isNaN(availableDate.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["availability", index, "available_on"],
          message: validationMessage(
            "availability date is invalid",
            "تاريخ الإتاحة غير صحيح"
          ),
        });
      } else {
        const today = new Date();
        const todayStart = Date.UTC(
          today.getUTCFullYear(),
          today.getUTCMonth(),
          today.getUTCDate()
        );

        if (availableDate.getTime() < todayStart) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["availability", index, "available_on"],
            message: validationMessage(
              "availability date must be today or later",
              "تاريخ الإتاحة يجب أن يكون اليوم أو بعده"
            ),
          });
        }

        const derivedDay = ((availableDate.getUTCDay() + 6) % 7) + 1;
        if (derivedDay !== Number(slot.day_of_week)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["availability", index, "day_of_week"],
            message: validationMessage(
              "availability day does not match the selected date",
              "يوم الإتاحة لا يطابق التاريخ المحدد"
            ),
          });
        }
      }

      if (slot.start_time >= slot.end_time) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["availability", index, "end_time"],
          message: validationMessage("end time must be later than start time", "يجب أن يكون وقت النهاية بعد وقت البداية"),
        });
      } else {
        const [startHour, startMinute] = slot.start_time.split(":").map(Number);
        const [endHour, endMinute] = slot.end_time.split(":").map(Number);
        const slotMinutes =
          (endHour * 60 + endMinute) - (startHour * 60 + startMinute);

        if (slotMinutes < data.duration_minutes) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["availability", index, "end_time"],
            message: validationMessage(
              "this availability slot must be at least as long as the lesson duration",
              "يجب أن تكون مدة الموعد مساوية لمدة الحصة أو أطول منها"
            ),
          });
        }
      }

      data.availability.forEach((other, otherIndex) => {
        if (index >= otherIndex) return;
        if (slot.available_on !== other.available_on || slot.timezone !== other.timezone) return;
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

