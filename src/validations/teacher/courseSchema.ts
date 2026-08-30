import { z } from "zod";

export const courseSchema = z.object({
  title: z
    .string({ message: "title is required" })
    .nonempty({ message: "title is required" }),
  description: z
    .string({ message: "title is required" })
    .nonempty({ message: "title is required" }),
  price: z.coerce
    .number({ message: "enter a valid price" })
    .min(0, { message: "enter a valid price" }),
  level: z
    .string({ message: "level is required" })
    .nonempty({ message: "level is required" }),
  sub_category_id: z
    .string({ message: "sub category is required" })
    .nonempty({ message: "sub category is required" }),
  category_id: z
    .string({ message: "sub category is required" })
    .nonempty({ message: "sub category is required" }),
});

export const courseContentSchema = z.object({
  title: z
    .string({ message: "title is required" })
    .nonempty({ message: "title is required" }),
  description: z
    .string({ message: "title is required" })
    .nonempty({ message: "title is required" }),
  courseId: z
    .string({ message: "course is required" })
    .nonempty({ message: "course is required" }),
});

export const courseLectureSchema = z.object({
  title: z
    .string({ message: "title is required" })
    .nonempty({ message: "title is required" }),
  description: z
    .string({ message: "title is required" })
    .nonempty({ message: "title is required" }),
  courseId: z
    .string({ message: "course is required" })
    .nonempty({ message: "course is required" }),
  contentId: z
    .string({ message: "content is required" })
    .nonempty({ message: "content is required" }),
});

export const courseVideoSchema = z.object({
  courseId: z
    .string({ message: "course is required" })
    .nonempty({ message: "course is required" }),
  contentId: z
    .string({ message: "content is required" })
    .nonempty({ message: "content is required" }),
  lectureId: z
    .string({ message: "lecture is required" })
    .nonempty({ message: "lecture is required" }),
});
