import { ACCEPTED_IMAGE_TYPES } from "@/utils/file";
import { z } from "zod";

export const updateParentProfileSchema = z.object({
  name: z
    .string({ message: "Full name must be at least 2 characters." })
    .min(2, { message: "Full name must be at least 2 characters." }),
  description: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email." }),
  gender: z.string().nonempty({ message: "Please select a gender." }),
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
  students: z
    .array(
      z
        .string()
        .min(10, {
          message: "Each student number must be at least 10 digits long",
        })
        .regex(/^\d+$/, {
          message: "Each student number must contain only digits",
        })
    )
    .min(1, {
      message: "Please add at least one student phone number",
    }),
  profile_image: z.union([
    z.undefined(),
    z
      .instanceof(File, { message: "The type must be a image type" })
      .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
        message: "The allowed type for image is .jpg, .jpeg, .png or .webp",
      }),
  ]),
});
