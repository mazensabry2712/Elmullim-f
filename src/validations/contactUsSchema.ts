import { z } from "zod";

const contactUsSchema = z.object({
  name: z.string().nonempty({ message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits." })
    .regex(/^\d+$/, { message: "Phone number must contain only digits." }),
  subject: z.string().nonempty({ message: "Subject is required" }),
  message: z.string().nonempty({ message: "Message is required" }),
});

export default contactUsSchema;
