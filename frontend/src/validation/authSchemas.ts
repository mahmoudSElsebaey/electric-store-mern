// frontend/src/validation/authSchemas.ts
import { z } from "zod";
import { useTranslation } from "react-i18next";

// ✅ Custom Hook للـ Register Schema
export const useRegisterSchema = () => {
  const { t } = useTranslation(); // مفيش parameter، بنستخدم useTranslation داخل الهوك مباشرة

  return z
    .object({
      name: z
        .string()
        .trim()
        .min(1, t("validation.common.required"))
        .min(3, t("validation.name.min"))
        .max(50, t("validation.name.max")),

      email: z
        .string()
        .trim()
        .min(1, t("validation.common.required"))
        .email(t("validation.email.invalid"))
        .max(100, t("validation.email.max")),

      password: z
        .string()
        .trim()
        .min(1, t("validation.common.required"))
        .min(6, t("validation.password.min"))
        .max(128, t("validation.password.max"))
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          t("validation.password.regex")
        ),

      confirmPassword: z.string().min(1, t("validation.common.required")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.password.mismatch"),
      path: ["confirmPassword"],
    });
};

// ✅ Custom Hook للـ Login Schema
export const useLoginSchema = () => {
  const { t } = useTranslation();

  return z.object({
    email: z
      .string()
      .trim()
      .min(1, t("validation.common.required"))
      .email(t("validation.email.invalid"))
      .max(100, t("validation.email.max")),

    password: z
      .string()
      .min(1, t("validation.password.required"))
      .max(128, t("validation.password.max")),
  });
};

// Types صحيحة 100%
export type RegisterFormData = z.infer<ReturnType<typeof useRegisterSchema>>;
export type LoginFormData = z.infer<ReturnType<typeof useLoginSchema>>;
