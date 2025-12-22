import { z } from "zod";
import { useTranslation } from "react-i18next";

export const useProductSchema = () => {
  const { t } = useTranslation();

  return z.object({
    name: z
      .string()
      .trim()
      .min(1, t("validation.common.required"))
      .min(3, t("validation.product.name.min"))
      .max(100, t("validation.product.name.max")),

    description: z
      .string()
      .trim()
      .optional()
      .or(z.literal("")),

    price: z
      .any()
      .refine(
        (val) => val !== "" && !isNaN(Number(val)),
        t("validation.product.price.invalid")
      )
      .transform((val) => Number(val))
      .refine(
        (val) => val > 0,
        t("validation.product.price.positive")
      )
      .refine(
        (val) => val >= 0.01,
        t("validation.product.price.min")
      ),

    countInStock: z
      .any()
      .refine(
        (val) => val !== "" && Number.isInteger(Number(val)),
        t("validation.product.stock.invalid")
      )
      .transform((val) => Number(val))
      .refine(
        (val) => val >= 0,
        t("validation.product.stock.min")
      ),

    brand: z
      .string()
      .min(1, t("validation.product.brand.required")),

    category: z
      .string()
      .min(1, t("validation.product.category.required")),

    image: z
      .instanceof(FileList)
      .optional()
      .refine(
        (files) =>
          !files ||
          files.length === 0 ||
          files[0].size <= 5 * 1024 * 1024,
        t("validation.product.image.size")
      )
      .refine(
        (files) =>
          !files ||
          files.length === 0 ||
          /^image\/(jpeg|png|webp|jpg)$/.test(files[0].type),
        t("validation.product.image.type")
      ),
  });
};

export type ProductFormData = z.infer<
  ReturnType<typeof useProductSchema>
>;
