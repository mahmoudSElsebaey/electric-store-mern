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
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4 px-5">
        <button
          onClick={() => navigate("/admin/products/add")}
          className="bg-purple-600 hover:bg-purple-700 cursor-pointer text-white px-5 py-2.5 rounded-lg font-semibold transition flex items-center gap-2"
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
          className="w-full max-w-sm px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
        />
      </div>

      {loadingPage ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t("admin_products.loading")}</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mx-5">
            <table className="w-full text-sm">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-4 py-3 text-right">
                    {t("admin_products.image")}
                  </th>
                  <th className="px-4 py-3 text-right">
                    {t("admin_products.name")}
                  </th>
                  <th className="px-4 py-3 text-right">
                    {t("admin_products.brand")}
                  </th>
                  <th className="px-4 py-3 text-right">
                    {t("admin_products.category")}
                  </th>
                  <th className="px-4 py-3 text-right">
                    {t("admin_products.price")}
                  </th>
                  <th className="px-4 py-3 text-right">
                    {t("admin_products.stock")}
                  </th>
                  <th className="px-4 py-3 text-center">
                    {t("admin_products.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-center">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-14 h-14 object-cover rounded-lg mx-auto"
                      />
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {p.name}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {typeof p.brand === "string" ? p.brand : p.brand?.name}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {typeof p.category === "string"
                        ? p.category
                        : p.category?.name}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-blue-600">
                      {formatPrice(p.price, lang)}
                    </td>
                    <td className="px-4 py-3 text-center">
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
                    <td className="px-4 py-3 text-center space-x-3 space-x-reverse">
                      <button
                        onClick={() =>
                          navigate(`/admin/products/edit/${p._id}`)
                        }
                        className="text-yellow-600 hover:text-yellow-800 transition"
                        title={t("admin_products.edit")}
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="text-red-600 hover:text-red-800 transition"
                        title={t("admin_products.delete")}
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
                {currentProducts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-500">
                      {t("admin_products.no_products")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {t("admin_products.previous")}
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`px-4 py-2 rounded-lg transition ${
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
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {t("admin_products.next")}
              </button>
            </div>
          )}

          <p className="text-center mt-4 text-gray-600">
            {t("admin_products.showing", {
              from: indexOfFirstProduct + 1,
              to: Math.min(indexOfLastProduct, filteredProducts.length),
              total: filteredProducts.length,
            })}
          </p>
        </>
      )}
    </AdminLayout>
  );
}
