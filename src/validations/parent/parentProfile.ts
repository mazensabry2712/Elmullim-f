import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "@/utils/file";
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
    })
    .max(255, {
      message: validationMessage(
        "Full name must be 255 characters or fewer.",
        "يجب ألا يزيد الاسم الكامل عن 255 حرفًا."
      ),
    }),
  description: z
    .string()
    .max(250, {
      message: validationMessage(
        "Description must be 250 characters or fewer.",
        "يجب ألا يزيد الوصف عن 250 حرفًا."
      ),
    })
    .optional(),
  email: z.string().email({
    message: validationMessage(
      "Please enter a valid email.",
      "يرجى إدخال بريد إلكتروني صحيح."
    ),
  }),
  gender: z.string().nonempty({
    message: validationMessage("Please select a gender.", "يرجى اختيار النوع."),
  }),
  country_id: z
    .string()
    .nonempty({
      message: validationMessage("Please select a country", "يرجى اختيار الدولة"),
    })
    .regex(/^\d+$/, {
      message: validationMessage(
        "Please select a valid country.",
        "يرجى اختيار دولة صحيحة."
      ),
    }),
  phone: z.string().regex(/^\d{10,20}$/, {
    message: validationMessage(
      "Phone number must contain 10 to 20 digits.",
      "يجب أن يحتوي رقم الهاتف على 10 إلى 20 رقمًا."
    ),
  }),
  education_system_id: z
    .string()
    .nonempty({
      message: validationMessage(
        "Please select an education system.",
        "يرجى اختيار نظام التعليم."
      ),
    })
    .regex(/^\d+$/, {
      message: validationMessage(
        "Please select a valid education system.",
        "يرجى اختيار نظام تعليم صحيح."
      ),
    }),
  education_level_id: z
    .string()
    .nonempty({
      message: validationMessage(
        "Please select an education level.",
        "يرجى اختيار المرحلة التعليمية."
      ),
    })
    .regex(/^\d+$/, {
      message: validationMessage(
        "Please select a valid education level.",
        "يرجى اختيار مرحلة تعليمية صحيحة."
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
      .refine((file) => file.size <= MAX_IMAGE_SIZE, {
        message: validationMessage(
          "The max file size is 5MB",
          "الحد الأقصى لحجم الصورة هو 5 ميجابايت"
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
