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

export const lessonSchema = z.object({
  title: requiredText("title is required", "العنوان مطلوب"),
  description: requiredText("title is required", "الوصف مطلوب"),
  price: z.coerce
    .number({ message: validationMessage("enter a valid price", "أدخل سعرًا صحيحًا") })
    .min(0, { message: validationMessage("enter a valid price", "أدخل سعرًا صحيحًا") }),
});

export const lessonContentSchema = z.object({
  title: requiredText("title is required", "العنوان مطلوب"),
  description: requiredText("title is required", "الوصف مطلوب"),
  lessonId: requiredText("lesson is required", "الدرس مطلوب"),
});

export const lessonLectureSchema = z.object({
  title: requiredText("title is required", "العنوان مطلوب"),
  description: requiredText("title is required", "الوصف مطلوب"),
  lessonId: requiredText("lesson is required", "الدرس مطلوب"),
  contentId: requiredText("content is required", "المحتوى مطلوب"),
});

export const lessonVideoSchema = z.object({
  lessonId: requiredText("course is required", "الكورس مطلوب"),
  contentId: requiredText("content is required", "المحتوى مطلوب"),
  lectureId: requiredText("lecture is required", "المحاضرة مطلوبة"),
});
