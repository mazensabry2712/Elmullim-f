import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "@/utils/file";
import { z } from "zod";

export const updateStudentProfileSchema = z.object({
  name: z
    .string({ message: "Full name must be at least 2 characters." })
    .min(2, { message: "Full name must be at least 2 characters." }),
  description: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email." }),
  gender: z.string().nonempty({ message: "Please select a gender." }),
  country_id: z.string().nonempty({ message: "Please select a country" }),
  address: z.string().nonempty({ message: "Address is required" }),
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
  favourite_subjects: z
    .array(z.string().nonempty({ message: "Please select a subject." }))
    .optional(),
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
});
