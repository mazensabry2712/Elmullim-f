import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "@/utils/file";
import { z } from "zod";

const validationMessage = (english: string, arabic: string) => {
  return typeof document !== "undefined" && document.documentElement.lang === "ar"
    ? arabic
    : english;
};

export const updateStudentProfileSchema = z.object({
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
  address: z.string().nonempty({
    message: validationMessage("Address is required", "العنوان مطلوب"),
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
  favourite_subjects: z
    .array(z.string().nonempty({
      message: validationMessage("Please select a subject.", "يرجى اختيار مادة."),
    }))
    .optional(),
  profile_image: z.union([
    z.undefined(),
    z
      .instanceof(File, {
        message: validationMessage(
          "The type must be a image type",
          "يجب أن يكون الملف من نوع صورة"
        ),
      })
      .refine((file) => file.size <= MAX_IMAGE_SIZE, {
        message: validationMessage(
          "The max file size is 5M",
          "الحد الأقصى لحجم الملف هو 5 ميجابايت"
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
