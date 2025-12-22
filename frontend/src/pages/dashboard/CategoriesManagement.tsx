/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import api from "../../services/api";
import AdminLayout from "../../layouts/AdminLayout";
import { useToast } from "../../context/ToastContext";
import { useTranslation } from "react-i18next";

type Category = {
  _id: string;
  name: string;
  description: string;
  image?: string;
};

const CATEGORIES_PER_PAGE = 10;

export default function CategoriesManagement() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const isRTL = lang === "ar";

  const { showToast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = categories.filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
    setCurrentPage(1);
  }, [categories, searchTerm]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data.categories || res.data);
    } catch (err: any) {
      showToast(
        t("admin_categories.error_load", { defaultValue: "فشل جلب التصنيفات" }),
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const formData = new FormData();
    formData.append("name", name.trim());
    if (description) formData.append("description", description);
    if (imageFile) formData.append("image", imageFile);

    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, formData);
        showToast(t("admin_categories.edit_success"), "success");
      } else {
        await api.post("/categories", formData);
        showToast(t("admin_categories.add_success"), "success");
      }
      resetForm();
      fetchCategories();
    } catch (err: any) {
      showToast(
        err.response?.data?.message ||
          t("admin_categories.save_error", { defaultValue: "فشل في الحفظ" }),
        "error"
      );
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setImageFile(null);
    setPreview("");
    setEditingId(null);
  };

  const handleEdit = (category: Category) => {
    setName(category.name);
    setDescription(category.description || "");
    setPreview(category.image || "");
    setEditingId(category._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("admin_categories.confirm_delete"))) return;
    try {
      await api.delete(`/categories/${id}`);
      showToast(t("admin_categories.delete_success"), "success");
      fetchCategories();
    } catch (err: any) {
      showToast(
        err.response?.data?.message ||
          t("admin_categories.delete_error", { defaultValue: "فشل الحذف" }),
        "error"
      );
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const indexOfLast = currentPage * CATEGORIES_PER_PAGE;
  const indexOfFirst = indexOfLast - CATEGORIES_PER_PAGE;
  const currentCategories = filteredCategories.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCategories.length / CATEGORIES_PER_PAGE);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <AdminLayout title={t("admin_categories.title")}>
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Form */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
            {editingId
              ? t("admin_categories.edit_title")
              : t("admin_categories.add_title")}
          </h2>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-semibold mb-2">
                {t("admin_categories.name")}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">
                {t("admin_categories.image")}
              </label>
              {(preview ||
                (editingId &&
                  categories.find((c) => c._id === editingId)?.image)) && (
                <div className="mb-4">
                  <img
                    src={
                      preview ||
                      categories.find((c) => c._id === editingId)?.image
                    }
                    alt="preview"
                    className="w-32 h-32 object-cover rounded-xl shadow-md"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 border border-gray-300 rounded-xl"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-lg font-semibold mb-2">
                {t("admin_categories.description")}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl"
                rows={4}
              />
            </div>

            <div className="md:col-span-2 flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-8 rounded-xl font-bold transition flex-1 sm:flex-none"
              >
                {editingId
                  ? t("admin_categories.save")
                  : t("admin_categories.add")}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-600 text-white py-3 px-8 rounded-xl font-bold flex-1 sm:flex-none"
                >
                  {t("admin_categories.cancel")}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder={t("admin_categories.search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* الجدول - شاشات كبيرة */}
            <div className="hidden lg:block bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="px-6 py-4 text-right">
                      {t("admin_categories.cat_image")}
                    </th>
                    <th className="px-6 py-4 text-right">
                      {t("admin_categories.cat_name")}
                    </th>
                    <th className="px-6 py-4 text-right">
                      {t("admin_categories.cat_desc")}
                    </th>
                    <th className="px-6 py-4 text-center">
                      {t("admin_categories.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentCategories.map((category) => (
                    <tr
                      key={category._id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-center">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-20 h-20 object-cover rounded-lg mx-auto"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-200 rounded-lg mx-auto flex items-center justify-center text-gray-500 text-sm">
                            {t("admin_categories.no_image")}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        {category.name}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {category.description || t("admin_categories.no_desc")}
                      </td>
                      <td className="px-6 py-4 text-center space-x-4">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-yellow-600 hover:text-yellow-800"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(category._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* البطاقات - شاشات صغيرة */}
            <div className="lg:hidden space-y-5">
              {currentCategories.map((category) => (
                <div
                  key={category._id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 hover:shadow-md transition"
                >
                  <div className="flex items-center gap-4 mb-4">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm">
                        {t("admin_categories.no_image")}
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{category.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {category.description || t("admin_categories.no_desc")}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(category)}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2.5 rounded-lg transition"
                    >
                      {t("admin_categories.edit")}
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg transition"
                    >
                      {t("admin_categories.delete")}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center items-center mt-10 gap-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-5 py-2.5 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition"
                >
                  {t("admin_categories.previous")}
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`px-4 py-2.5 rounded-lg transition min-w-10 ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-5 py-2.5 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition"
                >
                  {t("admin_categories.next")}
                </button>
              </div>
            )}

            <p className="text-center mt-6 text-gray-600">
              {t("admin_categories.showing", {
                from: indexOfFirst + 1,
                to: Math.min(indexOfLast, filteredCategories.length),
                total: filteredCategories.length,
              })}
            </p>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
