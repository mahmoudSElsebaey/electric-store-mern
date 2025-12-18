/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import api from "../../services/api";
import AdminLayout from "../../layouts/AdminLayout";
import { useToast } from "../../context/ToastContext";

type Category = {
  _id: string;
  name: string;
  description: string;
  image?: string;
};

const CATEGORIES_PER_PAGE = 10;

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { showToast } = useToast();

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
      showToast(err.response?.data?.message || "فشل جلب التصنيفات", "error");
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
        showToast("تم تعديل التصنيف بنجاح", "success");
      } else {
        await api.post("/categories", formData);
        showToast("تم إضافة التصنيف بنجاح", "success");
      }
      resetForm();
      fetchCategories();
    } catch (err: any) {
      showToast(err.response?.data?.message || "فشل في الحفظ", "error");
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
    if (!confirm("متأكد من الحذف؟")) return;
    try {
      await api.delete(`/categories/${id}`);
      showToast("تم حذف التصنيف بنجاح", "success");
      fetchCategories();
    } catch (err: any) {
      showToast(err.response?.data?.message || "فشل الحذف", "error");
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

  // Pagination
  const indexOfLast = currentPage * CATEGORIES_PER_PAGE;
  const indexOfFirst = indexOfLast - CATEGORIES_PER_PAGE;
  const currentCategories = filteredCategories.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCategories.length / CATEGORIES_PER_PAGE);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <AdminLayout title="إدارة التصنيفات">
      <div className="max-w-7xl mx-auto p-6">
        {/* Form */}
        <div className="bg-white p-8 rounded-2xl shadow-xl mb-10">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">
            {editingId ? "تعديل تصنيف" : "إضافة تصنيف جديد"}
          </h2>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block text-lg font-semibold mb-3">
                اسم التصنيف
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-3">
                صورة التصنيف
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
                    className="w-40 h-40 object-cover rounded-xl shadow-lg bg-gray-50"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-3 border border-gray-300 rounded-xl"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-lg font-semibold mb-3">
                وصف (اختياري)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl"
                rows={4}
              />
            </div>

            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 cursor-pointer text-white py-3 px-10 rounded-xl font-bold transition"
              >
                {editingId ? "حفظ التعديلات" : "إضافة التصنيف"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-600 text-white py-3 px-10 rounded-xl font-bold"
                >
                  إلغاء
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Search */}
        <div className="mb-6 flex justify-end">
          <input
            type="text"
            placeholder="ابحث بالاسم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-5 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300 text-right"
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
            <p className="mt-6 text-xl text-gray-600">
              جاري تحميل التصنيفات...
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-6 py-4 text-right">الصورة</th>
                    <th className="px-6 py-4 text-right">الاسم</th>
                    <th className="px-6 py-4 text-right">الوصف</th>
                    <th className="px-6 py-4 text-center">إجراءات</th>
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
                            className="w-20 h-20 object-cover rounded-lg mx-auto bg-gray-100"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-200 rounded-lg mx-auto flex items-center justify-center text-gray-500 text-sm">
                            لا توجد صورة
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold">
                        {category.name}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-600">
                        {category.description || "لا يوجد وصف"}
                      </td>
                      <td className="px-6 py-4 text-center space-x-4">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-yellow-600 hover:text-yellow-800 transition"
                          title="تعديل"
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
                          className="text-red-600 hover:text-red-800 transition"
                          title="حذف"
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
                  {currentCategories.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-16 text-gray-500 text-xl"
                      >
                        لا توجد تصنيفات مطابقة للبحث
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-10 gap-3">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-5 py-3 bg-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition"
                >
                  السابق
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`px-5 py-3 rounded-lg transition ${
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
                  className="px-5 py-3 bg-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition"
                >
                  التالي
                </button>
              </div>
            )}

            <p className="text-center mt-6 text-gray-600">
              عرض {indexOfFirst + 1} -{" "}
              {Math.min(indexOfLast, filteredCategories.length)} من{" "}
              {filteredCategories.length} تصنيف
            </p>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
