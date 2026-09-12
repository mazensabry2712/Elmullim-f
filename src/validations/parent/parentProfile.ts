import { ACCEPTED_IMAGE_TYPES } from "@/utils/file";
import { z } from "zod";

const validationMessage = (english: string, arabic: string) => {
  return typeof document !== "undefined" && document.documentElement.lang === "ar"
    ? arabic
    : english;
};

export const updateParentProfileSchema = z.object({
  name: z
    .string({
      message: validationMessage(
        "Full name must be at least 2 characters.",
        "يجب أن يتكون الاسم الكامل من حرفين على الأقل."
      ),
    })
    .min(2, {
      message: validationMessage(
        "Full name must be at least 2 characters.",
        "يجب أن يتكون الاسم الكامل من حرفين على الأقل."
      ),
    }),
  description: z.string().optional(),
  email: z.string().email({
    message: validationMessage("Please enter a valid email.", "يرجى إدخال بريد إلكتروني صحيح."),
  }),
  gender: z.string().nonempty({
    message: validationMessage("Please select a gender.", "يرجى اختيار النوع."),
  }),
  country_id: z.string().nonempty({
    message: validationMessage("Please select a country", "يرجى اختيار الدولة"),
  }),
  phone: z
    .string()
    .min(10, {
      message: validationMessage(
        "Phone number must be at least 10 digits.",
        "يجب أن يتكون رقم الهاتف من 10 أرقام على الأقل."
      ),
    })
    .regex(/^\d+$/, {
      message: validationMessage(
        "Phone number must contain only digits.",
        "يجب أن يحتوي رقم الهاتف على أرقام فقط."
      ),
    }),
  education_system_id: z.string().nonempty({
    message: validationMessage(
      "Please select an education system.",
      "يرجى اختيار نظام التعليم."
    ),
  }),
  education_level_id: z.string().nonempty({
    message: validationMessage(
      "Please select an education level.",
      "يرجى اختيار المرحلة التعليمية."
    ),
  }),
  students: z
    .array(
      z
        .string()
        .min(10, {
          message: validationMessage(
            "Each student number must be at least 10 digits long",
            "يجب أن يتكون رقم كل طالب من 10 أرقام على الأقل"
          ),
        })
        .regex(/^\d+$/, {
          message: validationMessage(
            "Each student number must contain only digits",
            "يجب أن يحتوي رقم كل طالب على أرقام فقط"
          ),
        })
    )
    .min(1, {
      message: validationMessage(
        "Please add at least one student phone number",
        "يرجى إضافة رقم هاتف طالب واحد على الأقل"
      ),
    }),
  profile_image: z.union([
    z.undefined(),
    z
      .instanceof(File, {
        message: validationMessage(
          "The type must be a image type",
          "يجب أن يكون الملف من نوع صورة"
        ),
      })
      .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
        message: validationMessage(
          "The allowed type for image is .jpg, .jpeg, .png or .webp",
          "أنواع الصور المسموح بها هي .jpg و.jpeg و.png و.webp"
        ),
      }),
  ]),
});
