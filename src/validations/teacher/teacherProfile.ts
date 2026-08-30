import {
  ACCEPTED_CV_TYPES,
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_SIZE,
} from "@/utils/file";
import { z } from "zod";

export const updateTeacherProfileSchema = z.object({
  name: z
    .string({ message: "Full name must be at least 2 characters." })
    .min(2, { message: "Full name must be at least 2 characters." }),
  description: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email." }),
  gender: z.string().nonempty({ message: "Please select a gender." }),
  experince: z.coerce.number({ message: "Experience is required" }),
  qualification: z.string().nonempty({ message: "Qualification is required" }),
  country_id: z.string().nonempty({ message: "Please select a country" }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits." })
    .regex(/^\d+$/, { message: "Phone number must contain only digits." }),
  education_system_id: z
    .string()
    .nonempty({ message: "Please select an education system." }),
  education_level_id: z
    .string()
    .nonempty({ message: "Please select an education level." }),
  subjects: z
    .array(z.string().nonempty({ message: "Please select a subject." }))
    .min(1, {
      message: "Please select at least one subject.",
    }),
  course_type: z
    .array(z.string().nonempty({ message: "Please select a course type." }))
    .min(1, {
      message: "Please select at least one course type.",
    }),
  profile_image: z.union([
    z.undefined(),
    z
      .instanceof(File, { message: "The type must be a image type" })
      .refine((file) => file.size <= MAX_IMAGE_SIZE, {
        message: "The max file size is 5M",
      })
      .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
        message: "The allowed type for image is .jpg, .jpeg, .png or .webp",
      }),
  ]),
  cv: z.union([
    z.undefined(),
    z
      .instanceof(File, { message: "The type must be a file pdf or docx type" })
      .refine((file) => ACCEPTED_CV_TYPES.includes(file.type), {
        message: "The allowed type for cv is .pdf, .txt, .doc or .docx",
      }),
  ]),
});
