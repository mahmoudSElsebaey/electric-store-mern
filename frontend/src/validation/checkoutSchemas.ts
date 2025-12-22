// frontend/src/validation/checkoutSchemas.ts
import { z } from "zod";
import { useTranslation } from "react-i18next";

export const useCheckoutSchema = () => {
  const { t } = useTranslation();

  return z.object({
    fullName: z
      .string()
      .trim()
      .min(1, t("validation.common.required"))
      .min(3, t("validation.checkout.name.min"))
      .max(100, t("validation.checkout.name.max")),

    phone: z
      .string()
      .trim()
      .min(1, t("validation.common.required"))
      .regex(/^\+?\d{8,15}$/, t("validation.checkout.phone.invalid")),

    address: z
      .string()
      .trim()
      .min(1, t("validation.common.required"))
      .min(5, t("validation.checkout.address.min"))
      .max(200, t("validation.checkout.address.max")),

    city: z
      .string()
      .trim()
      .min(1, t("validation.common.required"))
      .min(2, t("validation.checkout.city.min"))
      .max(50, t("validation.checkout.city.max")),
  });
};

export type CheckoutFormData = z.infer<ReturnType<typeof useCheckoutSchema>>;