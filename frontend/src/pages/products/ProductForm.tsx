/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useToast } from "../../context/ToastContext";
import api from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
  useProductSchema,
  type ProductFormData,
} from "../../validation/productSchemas";

type Brand = { _id: string; name: string };
type Category = { _id: string; name: string };

export default function ProductForm() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;

  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const schema = useProductSchema();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },

    watch,
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      countInStock: 0,
      brand: "",
      category: "",
      image: undefined,
    },
  });

  const watchedImage = watch("image");

  // جلب Brands و Categories + بيانات المنتج لو edit
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsRes, catsRes] = await Promise.all([
          api.get("/brands"),
          api.get("/categories"),
        ]);
        setBrands(brandsRes.data);
        setCategories(catsRes.data);

        if (isEdit) {
          const res = await api.get(`/products/${id}`);
          const product = res.data;
          reset({
            name: product.name,
            description: product.description || "",
            price: product.price,
            countInStock: product.countInStock,
            brand:
              typeof product.brand === "string"
                ? product.brand
                : product.brand._id,
            category:
              typeof product.category === "string"
                ? product.category
                : product.category._id,
          });
          setPreview(product.image);
        }
      } catch (err) {
        showToast(t("admin_products.error_load"), "error");
      }
    };
    fetchData();
  }, [id, isEdit, reset, t]);

  // معاينة الصورة
  useEffect(() => {
    if (watchedImage && watchedImage.length > 0) {
      const file = watchedImage[0];
      setPreview(URL.createObjectURL(file));
    }
  }, [watchedImage]);

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description || "");
      formData.append("price", data.price.toString());
      formData.append("countInStock", data.countInStock.toString());
      formData.append("brand", data.brand);
      formData.append("category", data.category);
      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }

      if (isEdit) {
        await api.put(`/products/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast(t("admin_products.edit_success"), "success");
      } else {
        await api.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast(t("admin_products.add_success"), "success");
      }
      navigate("/admin/products");
    } catch (err: any) {
      const message =
        err.response?.data?.message || t("admin_products.save_error");
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout
      title={
        isEdit ? t("admin_products.edit_title") : t("admin_products.add_title")
      }
    >
      <div className="max-w-4xl mx-auto">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl shadow-xl p-8"
          dir={t("dir") === "rtl" ? "rtl" : "ltr"}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block mb-2 font-semibold">
                {t("admin_products.product_name")}
              </label>
              <input
                {...register("name")}
                type="text"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block mb-2 font-semibold">
                {t("admin_products.price_label")}
              </label>
              <input
                {...register("price", { valueAsNumber: true })}
                type="number"
                step="0.01"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {errors.price && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Stock */}
            <div>
              <label className="block mb-2 font-semibold">
                {t("admin_products.stock_label")}
              </label>
              <input
                {...register("countInStock", { valueAsNumber: true })}
                type="number"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {errors.countInStock && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.countInStock.message}
                </p>
              )}
            </div>

            {/* Brand */}
            <div>
              <label className="block mb-2 font-semibold">
                {t("admin_products.brand_label")}
              </label>
              <select
                {...register("brand")}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t("admin_products.select_brand")}</option>
                {brands.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
              {errors.brand && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.brand.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block mb-2 font-semibold">
                {t("admin_products.category_label")}
              </label>
              <select
                {...register("category")}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t("admin_products.select_category")}</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="block mb-2 font-semibold">
                {t("admin_products.image_label")}{" "}
                {isEdit ? `(${t("admin_products.image_optional")})` : ""}
              </label>
              <input
                {...register("image")}
                type="file"
                accept="image/*"
                className="w-full p-3 border rounded-lg"
              />
              {errors.image && (
                <p className="text-red-600 text-sm mt-1">
                  {(errors.image as any)?.message}
                </p>
              )}

              {preview && (
                <div className="mt-6">
                  <p className="text-lg font-medium mb-3">
                    {t("admin_products.preview")}:
                  </p>
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-w-md rounded-xl shadow-lg"
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block mb-2 font-semibold">
                {t("admin_products.description_label")}
              </label>
              <textarea
                {...register("description")}
                rows={6}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="flex-1 bg-purple-600 hover:bg-purple-700 cursor-pointer text-white py-3 rounded-lg font-bold transition disabled:opacity-60"
            >
              {loading || isSubmitting
                ? t("admin_products.saving")
                : isEdit
                ? t("admin_products.save_changes")
                : t("admin_products.add_product")}
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-bold transition"
            >
              {t("admin_products.cancel")}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
