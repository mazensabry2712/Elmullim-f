import { z } from "zod";

const validationMessage = (english: string, arabic: string) => {
  return typeof document !== "undefined" && document.documentElement.lang === "ar"
    ? arabic
    : english;
};

export const signInSchema = z.object({
  password: z.string().nonempty({
    message: validationMessage("Password is required.", "كلمة المرور مطلوبة."),
  }),
  email: z.string().email({
    message: validationMessage("Please enter a valid email.", "يرجى إدخال بريد إلكتروني صحيح."),
  }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({
    message: validationMessage("Please enter a valid email.", "يرجى إدخال بريد إلكتروني صحيح."),
  }),
});

export const resetPasswordSchema = z
  .object({
    code: z.string({
      message: validationMessage("Invalid verification code", "رمز التحقق غير صحيح"),
    }).length(6, {
      message: validationMessage(
        "Enter the 6-digit verification code",
        "أدخل رمز التحقق المكون من 6 أرقام"
      ),
    }),
    password: z.string({
      message: validationMessage("Enter the new password", "أدخل كلمة المرور الجديدة"),
    }).min(8, {
      message: validationMessage(
        "Password must be at least 6 characters long",
        "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل"
      ),
    }),
    password_confirmation: z.string({
      message: validationMessage(
        "Password and confirmation password do not match",
        "كلمة المرور وتأكيد كلمة المرور غير متطابقين"
      ),
    }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: validationMessage(
      "Password and confirmation password do not match",
      "كلمة المرور وتأكيد كلمة المرور غير متطابقين"
    ),
    path: ["password_confirmation"],
  });

export const studentSignUpSchema = z.object({
  name: z.string().min(2, {
    message: validationMessage(
      "Full name must be at least 2 characters.",
      "يجب أن يتكون الاسم الكامل من حرفين على الأقل."
    ),
  }),
  email: z.string().email({
    message: validationMessage("Please enter a valid email.", "يرجى إدخال بريد إلكتروني صحيح."),
  }),
  password: z.string().min(6, {
    message: validationMessage(
      "Password must be at least 6 characters long",
      "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل"
    ),
  }),
  gender: z.string().nonempty({
    message: validationMessage("Please select a gender.", "يرجى اختيار النوع."),
  }),
  address: z.string().nonempty({
    message: validationMessage("Address is required", "العنوان مطلوب"),
  }),
  country_id: z.string().nonempty({
    message: validationMessage("Please select a country", "يرجى اختيار الدولة"),
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
  education_system_id: z.string().nonempty({
    message: validationMessage(
      "Please select an education system.",
      "يرجى اختيار نظام التعليم."
    ),
  }),
  education_level_id: z.string().nonempty({
    message: validationMessage(
      "Please select an education level.",
      "يرجى اختيار المرحلة التعليمية."
    ),
  }),
});

export const parentSignUpSchema = z.object({
  name: z.string().min(2, {
    message: validationMessage(
      "Full name must be at least 2 characters.",
      "يجب أن يتكون الاسم الكامل من حرفين على الأقل."
    ),
  }),
  email: z.string().email({
    message: validationMessage("Please enter a valid email.", "يرجى إدخال بريد إلكتروني صحيح."),
  }),
  students: z
    .array(
      z
        .string()
        .min(10, {
          message: validationMessage(
            "Each student number must be at least 10 digits long",
            "يجب أن يتكون رقم كل طالب من 10 أرقام على الأقل"
          ),
        })
        .regex(/^\d+$/, {
          message: validationMessage(
            "Each student number must contain only digits",
            "يجب أن يحتوي رقم كل طالب على أرقام فقط"
          ),
        })
    )
    .min(1, {
      message: validationMessage(
        "Please add at least one student phone number",
        "يرجى إضافة رقم هاتف طالب واحد على الأقل"
      ),
    }),
  password: z.string().min(6, {
    message: validationMessage(
      "Password must be at least 6 characters.",
      "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل."
    ),
  }),
  gender: z.string().nonempty({
    message: validationMessage("Please select a gender.", "يرجى اختيار النوع."),
  }),
  country_id: z.string().nonempty({
    message: validationMessage("Please select a country", "يرجى اختيار الدولة"),
  }),
  education_system_id: z.string().nonempty({
    message: validationMessage(
      "Please select an education system.",
      "يرجى اختيار نظام التعليم."
    ),
  }),
  education_level_id: z.string().nonempty({
    message: validationMessage(
      "Please select an education level.",
      "يرجى اختيار المرحلة التعليمية."
    ),
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
});

export const teacherSignUpSchema = z.object({
  name: z.string().min(2, {
    message: validationMessage(
      "Full name must be at least 2 characters.",
      "يجب أن يتكون الاسم الكامل من حرفين على الأقل."
    ),
  }),
  email: z.string().email({
    message: validationMessage("Please enter a valid email.", "يرجى إدخال بريد إلكتروني صحيح."),
  }),
  password: z.string().min(6, {
    message: validationMessage(
      "Password must be at least 6 characters.",
      "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل."
    ),
  }),
  gender: z.string().nonempty({
    message: validationMessage("Please select a gender.", "يرجى اختيار النوع."),
  }),
  country_id: z.string().nonempty({
    message: validationMessage("Please select a country", "يرجى اختيار الدولة"),
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
  education_system_id: z.string().nonempty({
    message: validationMessage(
      "Please select an education system.",
      "يرجى اختيار نظام التعليم."
    ),
  }),
  education_level_id: z.string().nonempty({
    message: validationMessage(
      "Please select an education level.",
      "يرجى اختيار المرحلة التعليمية."
    ),
  }),
  subjects: z
    .array(
      z.string().nonempty({
        message: validationMessage("Please select a subject.", "يرجى اختيار مادة."),
      })
    )
    .min(1, {
      message: validationMessage(
        "Please select at least one subject.",
        "يرجى اختيار مادة واحدة على الأقل."
      ),
    }),
  course_type: z
    .array(
      z.string().nonempty({
        message: validationMessage("Please select a course type.", "يرجى اختيار نوع الكورس."),
      })
    )
    .min(1, {
      message: validationMessage(
        "Please select at least one course type.",
        "يرجى اختيار نوع كورس واحد على الأقل."
      ),
    }),
});

export const verifyAccountSchema = z.object({
  code: z.string().length(6, {
    message: validationMessage(
      "verification code must be 6 digits",
      "يجب أن يتكون رمز التحقق من 6 أرقام"
    ),
  }),
});

export const changePasswordSchema = z
  .object({
    password: z.string({
      message: validationMessage("Enter the new password", "أدخل كلمة المرور الجديدة"),
    }).min(8, {
      message: validationMessage(
        "Password must be at least 6 characters long",
        "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل"
      ),
    }),
    password_confirmation: z.string({
      message: validationMessage(
        "Password and confirmation password do not match",
        "كلمة المرور وتأكيد كلمة المرور غير متطابقين"
      ),
    }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: validationMessage(
      "Confirm password and password do not match",
      "تأكيد كلمة المرور وكلمة المرور غير متطابقين"
    ),
    path: ["password_confirmation"],
  });
