import { z } from "zod";

const validationMessage = (english: string, arabic: string) => {
  return typeof document !== "undefined" && document.documentElement.lang === "ar"
    ? arabic
    : english;
};

const contactUsSchema = z.object({
  name: z.string().nonempty({
    message: validationMessage("Name is required", "الاسم مطلوب"),
  }),
  email: z.string().email({
    message: validationMessage("Invalid email address", "عنوان البريد الإلكتروني غير صحيح"),
  }),
  phone: z
    .string()
    .min(10, {
      message: validationMessage(
        "Phone number must be at least 10 digits.",
        "يجب أن يتكون رقم الهاتف من 10 أرقام على الأقل."
      ),
    })
    .regex(/^\d+$/, {
      message: validationMessage(
        "Phone number must contain only digits.",
        "يجب أن يحتوي رقم الهاتف على أرقام فقط."
      ),
    }),
  subject: z.string().nonempty({
    message: validationMessage("Subject is required", "الموضوع مطلوب"),
  }),
  message: z.string().nonempty({
    message: validationMessage("Message is required", "الرسالة مطلوبة"),
  }),
});

export default contactUsSchema;
