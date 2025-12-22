/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import { useToast } from "../../context/ToastContext";
import { useTranslation } from "react-i18next";
import { formatPrice } from "../../utils/formatPrice";
import { useAdminOrders, type AdminOrder } from "../../hooks/useAdminOrders";

const ORDERS_PER_PAGE = 10;

const OrdersManagement: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const isRTL = lang === "ar";

  const { showToast } = useToast();
  const { adminOrders, adminLoading, adminError, updateOrderStatus, userRole } =
    useAdminOrders();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const [filteredOrders, setFilteredOrders] = useState<AdminOrder[]>([]);

  const statusOptions = [
    { value: "Pending", label: t("admin_orders.pending") },
    { value: "Processing", label: t("admin_orders.processing") },
    { value: "Shipped", label: t("admin_orders.shipped") },
    { value: "Delivered", label: t("admin_orders.delivered") },
    { value: "Cancelled", label: t("admin_orders.cancelled") },
  ];

  useEffect(() => {
    const filtered = adminOrders.filter((order) => {
      const term = searchTerm.toLowerCase();
      return (
        order._id.toLowerCase().includes(term) ||
        order.user.name.toLowerCase().includes(term) ||
        order.user.email.toLowerCase().includes(term)
      );
    });
    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [adminOrders, searchTerm]);

  const indexOfLast = currentPage * ORDERS_PER_PAGE;
  const indexOfFirst = indexOfLast - ORDERS_PER_PAGE;
  const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);

  const paginate = (page: number) => setCurrentPage(page);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingOrder(orderId);
    const result = await updateOrderStatus(
      orderId,
      newStatus as AdminOrder["status"]
    );

    if (result.success) {
      showToast(t("admin_orders.update_success"), "success");
    } else {
      showToast(result.error || t("admin_orders.update_error"), "error");
    }
    setUpdatingOrder(null);
  };

  if (!["admin", "owner"].includes(userRole || "")) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-bold text-3xl bg-gray-100">
        {t("admin_orders.access_denied")}
      </div>
    );
  }

  return (
    <AdminLayout title={t("admin_orders.title")}>
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Header + Search */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">
              {t("admin_orders.title")}
            </h2>
            <p className="text-lg text-gray-600 mt-1">
              {t("admin_orders.total_orders", { count: filteredOrders.length })}
            </p>
          </div>

          <input
            type="text"
            placeholder={t("admin_orders.search_placeholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full lg:w-80 px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 transition"
          />
        </div>

        {/* Loading */}
        {adminLoading && (
          <div className="flex flex-col items-center my-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            <p className="mt-6 text-xl text-gray-600">
              {t("admin_orders.loading")}
            </p>
          </div>
        )}

        {/* Error */}
        {adminError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl mb-8 text-center">
            {adminError}
          </div>
        )}

        {/* Content */}
        {!adminLoading && !adminError && currentOrders.length > 0 && (
          <>
            {/* الجدول - يظهر فقط على الشاشات الكبيرة (lg فأكبر) */}
            <div className="hidden lg:block overflow-x-auto rounded-xl shadow-lg border border-gray-200 bg-white">
              <table className="w-full min-w-[900px] divide-y divide-gray-200">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">
                      {t("admin_orders.order_id")}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">
                      {t("admin_orders.customer")}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">
                      {t("admin_orders.total")}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">
                      {t("admin_orders.payment")}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">
                      {t("admin_orders.status")}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">
                      {t("admin_orders.date")}
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium uppercase tracking-wider">
                      {t("admin_orders.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order._id.slice(-8)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {order.user.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {formatPrice(order.totalPrice, lang)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.isPaid ? (
                          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {t("admin_orders.paid")}
                          </span>
                        ) : (
                          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            {t("admin_orders.unpaid")}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {updatingOrder === order._id ? (
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-600"></div>
                          </div>
                        ) : (
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                            className="w-full lg:w-auto px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          >
                            {statusOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString(
                          lang === "ar" ? "ar-EG" : "en-US"
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link
                          to={`/order/${order._id}`}
                          className="inline-block px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                        >
                          {t("admin_orders.view_details")}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* عرض البطاقات على الشاشات الصغيرة (أقل من lg) */}
            <div className="lg:hidden space-y-5">
              {currentOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 hover:shadow-md transition"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-bold text-lg text-gray-900">
                        #{order._id.slice(-8)}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {order.user.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.user.email}
                      </p>
                    </div>

                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        order.isPaid
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.isPaid
                        ? t("admin_orders.paid")
                        : t("admin_orders.unpaid")}
                    </span>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-500">{t("admin_orders.total")}</p>
                      <p className="font-bold text-gray-900">
                        {formatPrice(order.totalPrice, lang)}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">{t("admin_orders.date")}</p>
                      <p className="font-medium text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString(
                          lang === "ar" ? "ar-EG" : "en-US"
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {updatingOrder === order._id ? (
                      <div className="flex justify-center items-center flex-1">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
                      </div>
                    ) : (
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    )}

                    <Link
                      to={`/order/${order._id}`}
                      className="flex-1 sm:flex-none text-center px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                    >
                      {t("admin_orders.view_details")}
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* رسالة توضيحية للجدول على الموبايل (اختياري) */}
            <div className="hidden lg:block text-center text-sm text-gray-500 mt-4">
              ← اسحب يمينًا أو يسارًا لعرض باقي الأعمدة →
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center items-center mt-10 gap-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-5 py-2.5 text-sm bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition"
                >
                  {t("admin_orders.previous")}
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`px-4 py-2.5 text-sm rounded-lg transition min-w-10 ${
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
                  className="px-5 py-2.5 text-sm bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition"
                >
                  {t("admin_orders.next")}
                </button>
              </div>
            )}

            <p className="text-center mt-8 text-gray-600">
              {t("admin_orders.showing", {
                from: indexOfFirst + 1,
                to: Math.min(indexOfLast, filteredOrders.length),
                total: filteredOrders.length,
              })}
            </p>
          </>
        )}

        {/* No Orders */}
        {!adminLoading && !adminError && filteredOrders.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl shadow-lg mt-8">
            <p className="text-2xl text-gray-500">
              {searchTerm
                ? t("admin_orders.no_matching")
                : t("admin_orders.no_orders")}
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default OrdersManagement;
