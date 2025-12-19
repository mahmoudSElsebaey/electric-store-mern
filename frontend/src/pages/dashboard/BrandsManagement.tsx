/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import api from "../../services/api";
import AdminLayout from "../../layouts/AdminLayout";
import { useToast } from "../../context/ToastContext";
import { useTranslation } from "react-i18next";
import { formatNumber } from "../../utils/formatNumber"; // لو عايز تحول أرقام الـ pagination

type Brand = {
  _id: string;
  name: string;
  description: string;
  logo?: string;
};

const BRANDS_PER_PAGE = 10;

export default function BrandsManagement() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const isRTL = lang === "ar";

  const { showToast } = useToast();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    const filtered = brands.filter((b) =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBrands(filtered);
    setCurrentPage(1);
  }, [brands, searchTerm]);

  const fetchBrands = async () => {
    try {
      const res = await api.get("/brands");
      setBrands(res.data.brands || res.data);
    } catch (err: any) {
      showToast(
        t("admin_brands.error_load", { defaultValue: "فشل جلب الماركات" }),
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
    if (logoFile) formData.append("logo", logoFile);

    try {
      if (editingId) {
        await api.put(`/brands/${editingId}`, formData);
        showToast(t("admin_brands.edit_success"), "success");
      } else {
        await api.post("/brands", formData);
        showToast(t("admin_brands.add_success"), "success");
      }
      resetForm();
      fetchBrands();
    } catch (err: any) {
      showToast(
        err.response?.data?.message ||
          t("admin_brands.save_error", { defaultValue: "فشل في الحفظ" }),
        "error"
      );
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setLogoFile(null);
    setPreview("");
    setEditingId(null);
  };

  const handleEdit = (brand: Brand) => {
    setName(brand.name);
    setDescription(brand.description || "");
    setPreview(brand.logo || "");
    setEditingId(brand._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("admin_brands.confirm_delete"))) return;
    try {
      await api.delete(`/brands/${id}`);
      showToast(t("admin_brands.delete_success"), "success");
      fetchBrands();
    } catch (err: any) {
      showToast(
        err.response?.data?.message ||
          t("admin_brands.delete_error", { defaultValue: "فشل الحذف" }),
        "error"
      );
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const indexOfLast = currentPage * BRANDS_PER_PAGE;
  const indexOfFirst = indexOfLast - BRANDS_PER_PAGE;
  const currentBrands = filteredBrands.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredBrands.length / BRANDS_PER_PAGE);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <AdminLayout title={t("admin_brands.title")}>
      <div className="max-w-7xl mx-auto p-6" dir={isRTL ? "rtl" : "ltr"}>
        <div className="bg-white p-8 rounded-2xl shadow-xl mb-10">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">
            {editingId
              ? t("admin_brands.edit_title")
              : t("admin_brands.add_title")}
          </h2>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block text-lg font-semibold mb-3">
                {t("admin_brands.name")}
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
                {t("admin_brands.logo")}
              </label>
              {(preview ||
                (editingId &&
                  brands.find((b) => b._id === editingId)?.logo)) && (
                <div className="mb-4">
                  <img
                    src={
                      preview || brands.find((b) => b._id === editingId)?.logo
                    }
                    alt="preview"
                    className="w-40 h-32 object-contain rounded-xl shadow-lg bg-gray-50 p-4"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="w-full p-3 border border-gray-300 rounded-xl"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-lg font-semibold mb-3">
                {t("admin_brands.description")}
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
                {editingId ? t("admin_brands.save") : t("admin_brands.add")}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-600 text-white py-3 px-10 rounded-xl font-bold"
                >
                  {t("admin_brands.cancel")}
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="mb-6 flex justify-end">
          <input
            type="text"
            placeholder={t("admin_brands.search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-5 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300"
          />
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
            <p className="mt-6 text-xl text-gray-600">
              {t("admin_brands.loading", {
                defaultValue: "جاري تحميل الماركات...",
              })}
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-6 py-4 text-right">
                      {t("admin_brands.image")}
                    </th>
                    <th className="px-6 py-4 text-right">
                      {t("admin_brands.brand_name")}
                    </th>
                    <th className="px-6 py-4 text-right">
                      {t("admin_brands.brand_desc")}
                    </th>
                    <th className="px-16 py-4 text-center">
                      {t("admin_brands.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentBrands.map((brand) => (
                    <tr key={brand._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-center">
                        {brand.logo ? (
                          <img
                            src={brand.logo}
                            alt={brand.name}
                            className="w-20 h-20 object-contain rounded-lg mx-auto bg-gray-100"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-200 rounded-lg mx-auto flex items-center justify-center text-gray-500 text-sm">
                            {t("admin_brands.no_logo")}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold">
                        {brand.name}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-600">
                        {brand.description || t("admin_brands.no_desc")}
                      </td>
                      <td className="px-6 py-4 text-center space-x-4">
                        <button
                          onClick={() => handleEdit(brand)}
                          className="text-yellow-600 hover:text-yellow-800 transition"
                          title={t("admin_brands.edit")}
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
                          onClick={() => handleDelete(brand._id)}
                          className="text-red-600 hover:text-red-800 transition"
                          title={t("admin_brands.delete")}
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
                  {currentBrands.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-16 text-gray-500 text-xl"
                      >
                        {t("admin_brands.no_brands")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-10 gap-3">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-5 py-3 bg-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition"
                >
                  {t("admin_brands.previous")}
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
                    {formatNumber(i + 1, lang)}
                  </button>
                ))}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-5 py-3 bg-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition"
                >
                  {t("admin_brands.next")}
                </button>
              </div>
            )}

            <p className="text-center mt-6 text-gray-600">
              {t("admin_brands.showing", {
                from: indexOfFirst + 1,
                to: Math.min(indexOfLast, filteredBrands.length),
                total: filteredBrands.length,
              })}
            </p>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
