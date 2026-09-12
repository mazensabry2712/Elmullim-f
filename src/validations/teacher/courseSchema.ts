import { z } from "zod";

const validationMessage = (english: string, arabic: string) => {
  return typeof document !== "undefined" && document.documentElement.lang === "ar"
    ? arabic
    : english;
};

const requiredText = (english: string, arabic: string) =>
  z.string({ message: validationMessage(english, arabic) }).nonempty({
    message: validationMessage(english, arabic),
  });

export const courseSchema = z.object({
  title: requiredText("title is required", "العنوان مطلوب"),
  description: requiredText("title is required", "الوصف مطلوب"),
  price: z.coerce
    .number({ message: validationMessage("enter a valid price", "أدخل سعرًا صحيحًا") })
    .min(0, { message: validationMessage("enter a valid price", "أدخل سعرًا صحيحًا") }),
  level: requiredText("level is required", "المستوى مطلوب"),
  sub_category_id: requiredText("sub category is required", "التصنيف الفرعي مطلوب"),
  category_id: requiredText("sub category is required", "التصنيف الفرعي مطلوب"),
});

export const courseContentSchema = z.object({
  title: requiredText("title is required", "العنوان مطلوب"),
  description: requiredText("title is required", "الوصف مطلوب"),
  courseId: requiredText("course is required", "الكورس مطلوب"),
});

export const courseLectureSchema = z.object({
  title: requiredText("title is required", "العنوان مطلوب"),
  description: requiredText("title is required", "الوصف مطلوب"),
  courseId: requiredText("course is required", "الكورس مطلوب"),
  contentId: requiredText("content is required", "المحتوى مطلوب"),
});

export const courseVideoSchema = z.object({
  courseId: requiredText("course is required", "الكورس مطلوب"),
  contentId: requiredText("content is required", "المحتوى مطلوب"),
  lectureId: requiredText("lecture is required", "المحاضرة مطلوبة"),
});
