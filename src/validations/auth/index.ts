import { z } from "zod";

export const signInSchema = z.object({
  password: z.string().nonempty({ message: "Password is required." }),
  email: z.string().email({ message: "Please enter a valid email." }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
});

export const resetPasswordSchema = z
  .object({
    code: z
      .string({ message: "Invalid verification code" })
      .length(6, { message: "Enter the 6-digit verification code" }),
    password: z
      .string({ message: "Enter the new password" })
      .min(8, { message: "Password must be at least 6 characters long" }),
    password_confirmation: z.string({
      message: "Password and confirmation password do not match",
    }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Password and confirmation password do not match",
    path: ["password_confirmation"],
  });

export const studentSignUpSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  gender: z.string().nonempty({ message: "Please select a gender." }),
  address: z.string().nonempty({ message: "Address is required" }),
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
});

export const parentSignUpSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
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
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
  gender: z.string().nonempty({ message: "Please select a gender." }),
  country_id: z.string().nonempty({ message: "Please select a country" }),
  education_system_id: z
    .string()
    .nonempty({ message: "Please select an education system." }),
  education_level_id: z
    .string()
    .nonempty({ message: "Please select an education level." }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits." })
    .regex(/^\d+$/, { message: "Phone number must contain only digits." }),
});

export const teacherSignUpSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
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
});

export const verifyAccountSchema = z.object({
  code: z.string().length(6, { message: "verification code must be 6 digits" }),
});

export const changePasswordSchema = z
  .object({
    password: z
      .string({ message: "Enter the new password" })
      .min(8, { message: "Password must be at least 6 characters long" }),
    password_confirmation: z.string({
      message: "Password and confirmation password do not match",
    }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Confirm password and password do not match",
    path: ["password_confirmation"],
  });
