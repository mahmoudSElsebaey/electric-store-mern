import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(3, "الاسم يجب أن يكون 3 أحرف على الأقل")
    .max(50, "الاسم لا يمكن أن يتجاوز 50 حرفًا")
    .trim(),
  email: z
    .string()
    .email("البريد الإلكتروني غير صحيح")
    .max(100, "البريد الإلكتروني طويل جدًا"),
  password: z
    .string()
    .trim()
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
    .max(128, "كلمة المرور طويلة جدًا")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "كلمة المرور يجب أن تحتوي على حرف صغير، حرف كبير، ورقم على الأقل"
    ),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("البريد الإلكتروني غير صحيح")
    .max(100, "البريد الإلكتروني طويل جدًا"),
  password: z
    .string()
    .min(1, "كلمة المرور مطلوبة")
    .max(128, "كلمة المرور طويلة جدًا"),
});
