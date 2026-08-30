import { z } from "zod";

export const lessonSchema = z.object({
  title: z
    .string({ message: "title is required" })
    .nonempty({ message: "title is required" }),
  description: z
    .string({ message: "title is required" })
    .nonempty({ message: "title is required" }),
  price: z.coerce
    .number({ message: "enter a valid price" })
    .min(0, { message: "enter a valid price" }),
});

export const lessonContentSchema = z.object({
  title: z
    .string({ message: "title is required" })
    .nonempty({ message: "title is required" }),
  description: z
    .string({ message: "title is required" })
    .nonempty({ message: "title is required" }),
  lessonId: z
    .string({ message: "lesson is required" })
    .nonempty({ message: "lesson is required" }),
});

export const lessonLectureSchema = z.object({
  title: z
    .string({ message: "title is required" })
    .nonempty({ message: "title is required" }),
  description: z
    .string({ message: "title is required" })
    .nonempty({ message: "title is required" }),
  lessonId: z
    .string({ message: "lesson is required" })
    .nonempty({ message: "lesson is required" }),
  contentId: z
    .string({ message: "content is required" })
    .nonempty({ message: "content is required" }),
});

export const lessonVideoSchema = z.object({
  lessonId: z
    .string({ message: "course is required" })
    .nonempty({ message: "course is required" }),
  contentId: z
    .string({ message: "content is required" })
    .nonempty({ message: "content is required" }),
  lectureId: z
    .string({ message: "lecture is required" })
    .nonempty({ message: "lecture is required" }),
});
