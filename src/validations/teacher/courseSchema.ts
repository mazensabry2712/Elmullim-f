import { z } from "zod";
import { hasMinimumWords, hasRepeatedTextPattern } from "@/utils/textQuality";

const validationMessage = (english: string, arabic: string) => {
  return typeof document !== "undefined" && document.documentElement.lang === "ar"
    ? arabic
    : english;
};

const requiredText = (english: string, arabic: string) =>
  z.string({ message: validationMessage(english, arabic) }).trim().nonempty({
    message: validationMessage(english, arabic),
  });

const titleText = (maximum: number) =>
  requiredText("Title is required", "العنوان مطلوب")
    .min(3, { message: validationMessage("Enter a longer, meaningful title.", "اكتب عنوانًا واضحًا لا يقل عن 3 أحرف.") })
    .max(maximum, { message: validationMessage(`Title must be ${maximum} characters or fewer.`, `يجب ألا يزيد العنوان عن ${maximum} حرفًا.`) })
    .refine((value) => !hasRepeatedTextPattern(value), {
      message: validationMessage("Avoid repeated or placeholder text.", "تجنب النصوص المكررة أو التجريبية."),
    });

const descriptionText = (maximum: number) =>
  requiredText("Description is required", "الوصف مطلوب")
    .min(20, { message: validationMessage("Description must be at least 20 characters.", "يجب ألا يقل الوصف عن 20 حرفًا.") })
    .max(maximum, { message: validationMessage(`Description must be ${maximum} characters or fewer.`, `يجب ألا يزيد الوصف عن ${maximum} حرفًا.`) })
    .refine((value) => hasMinimumWords(value, 3), {
      message: validationMessage("Write a complete description with at least 3 words.", "اكتب وصفًا واضحًا من 3 كلمات على الأقل."),
    })
    .refine((value) => !hasRepeatedTextPattern(value), {
      message: validationMessage("Avoid repeated or placeholder text.", "تجنب النصوص المكررة أو التجريبية."),
    });

export const courseSchema = z.object({
  title: titleText(100),
  description: descriptionText(250),
  price: z.coerce
    .number({ message: validationMessage("enter a valid price", "أدخل سعرًا صحيحًا") })
    .min(0, { message: validationMessage("enter a valid price", "أدخل سعرًا صحيحًا") }),
  level: requiredText("level is required", "المستوى مطلوب"),
  sub_category_id: requiredText("sub category is required", "التصنيف الفرعي مطلوب"),
  category_id: requiredText("sub category is required", "التصنيف الفرعي مطلوب"),
});

export const courseContentSchema = z.object({
  title: titleText(255),
  description: descriptionText(5000),
  courseId: requiredText("course is required", "الكورس مطلوب"),
});

export const courseLectureSchema = z.object({
  title: titleText(255),
  description: descriptionText(5000),
  courseId: requiredText("course is required", "الكورس مطلوب"),
  contentId: requiredText("content is required", "المحتوى مطلوب"),
});

export const courseVideoSchema = z.object({
  courseId: requiredText("course is required", "الكورس مطلوب"),
  contentId: requiredText("content is required", "المحتوى مطلوب"),
  lectureId: requiredText("lecture is required", "المحاضرة مطلوبة"),
});
