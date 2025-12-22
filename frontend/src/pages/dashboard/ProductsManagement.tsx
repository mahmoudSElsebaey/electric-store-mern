/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import api from "../../services/api";
import { useStore } from "../../context/StoreContext";
import { useToast } from "../../context/ToastContext";
import AdminLayout from "../../layouts/AdminLayout";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatPrice } from "../../utils/formatPrice";

type Product = {
  _id: string;
  name: string;
  price: number;
  brand: { name: string; _id?: string } | string;
  category: { name: string; _id?: string } | string;
  countInStock: number;
  description: string;
  image: string;
};

export default function ProductsManagement() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const lang = i18n.language;

  const { state } = useStore();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      showToast(t("admin_products.error_load"), "error");
    } finally {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    const term = searchTerm.toLowerCase();
    const brandName =
      typeof p.brand === "string"
        ? p.brand.toLowerCase()
        : p.brand?.name?.toLowerCase() || "";
    const categoryName =
      typeof p.category === "string"
        ? p.category.toLowerCase()
        : p.category?.name?.toLowerCase() || "";
    return (
      p.name.toLowerCase().includes(term) ||
      brandName.includes(term) ||
      categoryName.includes(term)
    );
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleDelete = async (id: string) => {
    if (!confirm(t("admin_products.confirm_delete"))) return;
    try {
      await api.delete(`/products/${id}`);
      showToast(t("admin_products.delete_success"), "success");
      await fetchProducts();
      if (currentProducts.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err: any) {
      showToast(
        err.response?.data?.message || t("admin_products.delete_error"),
        "error"
      );
    }
  };

  if (
    !state.isAuthenticated ||
    !["admin", "owner"].includes(state.user?.role || "")
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-bold text-3xl bg-gray-100">
        {t("admin_products.access_denied")}
      </div>
    );
  }

  return (
    <AdminLayout title={t("admin_products.title")}>
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* زر إضافة + البحث */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <button
            onClick={() => navigate("/admin/products/add")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2 shadow-md"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            {t("admin_products.add_new")}
          </button>

          <input
            type="text"
            placeholder={t("admin_products.search_placeholder")}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-80 px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loadingPage ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* الجدول - شاشات كبيرة فقط */}
            <div className="hidden lg:block bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <table className="w-full min-w-[900px]">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="px-6 py-4 text-right">
                      {t("admin_products.image")}
                    </th>
                    <th className="px-6 py-4 text-right">
                      {t("admin_products.name")}
                    </th>
                    <th className="px-6 py-4 text-right">
                      {t("admin_products.brand")}
                    </th>
                    <th className="px-6 py-4 text-right">
                      {t("admin_products.category")}
                    </th>
                    <th className="px-6 py-4 text-right">
                      {t("admin_products.price")}
                    </th>
                    <th className="px-6 py-4 text-center">
                      {t("admin_products.stock")}
                    </th>
                    <th className="px-6 py-4 text-center">
                      {t("admin_products.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentProducts.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-16 h-16 object-cover rounded-lg mx-auto"
                        />
                      </td>
                      <td className="px-6 py-4 font-medium">{p.name}</td>
                      <td className="px-6 py-4">
                        {typeof p.brand === "string" ? p.brand : p.brand?.name}
                      </td>
                      <td className="px-6 py-4">
                        {typeof p.category === "string"
                          ? p.category
                          : p.category?.name}
                      </td>
                      <td className="px-6 py-4 font-semibold text-blue-600">
                        {formatPrice(p.price, lang)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            p.countInStock > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {p.countInStock}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center space-x-4">
                        <button
                          onClick={() =>
                            navigate(`/admin/products/edit/${p._id}`)
                          }
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
                          onClick={() => handleDelete(p._id)}
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
              {currentProducts.map((p) => (
                <div
                  key={p._id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 hover:shadow-md transition"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{p.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {typeof p.brand === "string" ? p.brand : p.brand?.name} •{" "}
                        {typeof p.category === "string"
                          ? p.category
                          : p.category?.name}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-500">{t("admin_products.price")}</p>
                      <p className="font-bold text-blue-600">
                        {formatPrice(p.price, lang)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">
                        {t("admin_products.stock")}
                      </p>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          p.countInStock > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {p.countInStock}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate(`/admin/products/edit/${p._id}`)}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2.5 rounded-lg transition"
                    >
                      {t("admin_products.edit")}
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg transition"
                    >
                      {t("admin_products.delete")}
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
                  {t("admin_products.previous")}
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
                  {t("admin_products.next")}
                </button>
              </div>
            )}

            <p className="text-center mt-6 text-gray-600">
              {t("admin_products.showing", {
                from: indexOfFirstProduct + 1,
                to: Math.min(indexOfLastProduct, filteredProducts.length),
                total: filteredProducts.length,
              })}
            </p>
          </>
        )}
      </div>
    </AdminLayout>
  );
}