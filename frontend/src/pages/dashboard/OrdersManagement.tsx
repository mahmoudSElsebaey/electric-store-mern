/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { useAdminOrders, type AdminOrder } from "../../hooks/useAdminOrders";
import { Link } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import { useToast } from "../../context/ToastContext";
import { useTranslation } from "react-i18next";
import { formatPrice } from "../../utils/formatPrice";

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
      const orderId = order._id.toLowerCase();
      const customerName = order.user.name.toLowerCase();
      const customerEmail = order.user.email.toLowerCase();
      return (
        orderId.includes(term) ||
        customerName.includes(term) ||
        customerEmail.includes(term)
      );
    });
    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [adminOrders, searchTerm]);

  const indexOfLast = currentPage * ORDERS_PER_PAGE;
  const indexOfFirst = indexOfLast - ORDERS_PER_PAGE;
  const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingOrder(orderId);
    const result = await updateOrderStatus(
      orderId,
      newStatus as AdminOrder["status"]
    );

    if (result.success) {
      showToast(
        t("admin_orders.update_success", {
          defaultValue: "تم تحديث حالة الطلب بنجاح",
        }),
        "success"
      );
    } else {
      showToast(
        result.error ||
          t("admin_orders.update_error", {
            defaultValue: "فشل في تحديث حالة الطلب",
          }),
        "error"
      );
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
      <div className="max-w-7xl mx-auto p-6" dir={isRTL ? "rtl" : "ltr"}>
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="">
            <h2 className="text-3xl font-bold text-gray-800">
              {t("admin_orders.title")}
            </h2>
            <p className="text-xl text-gray-600 mt-2">
              {t("admin_orders.total_orders", { count: filteredOrders.length })}
            </p>
          </div>

          <input
            type="text"
            placeholder={t("admin_orders.search_placeholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-5 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300"
          />
        </div>

        {adminLoading && (
          <div className="flex flex-col items-center my-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            <p className="mt-6 text-xl text-gray-600">
              {t("admin_orders.loading")}
            </p>
          </div>
        )}

        {adminError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-8 text-center">
            {adminError}
          </div>
        )}

        {!adminLoading && !adminError && currentOrders.length > 0 && (
          <>
            <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold">
                      {t("admin_orders.order_id")}
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold">
                      {t("admin_orders.customer")}
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold">
                      {t("admin_orders.total")}
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold">
                      {t("admin_orders.payment")}
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold">
                      {t("admin_orders.status")}
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold">
                      {t("admin_orders.date")}
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold">
                      {t("admin_orders.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        #{order._id.substring(order._id.length - 8)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {order.user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {formatPrice(order.totalPrice, lang)}
                      </td>
                      <td className="px-6 py-4">
                        {order.isPaid ? (
                          <span className="px-3 py-1 text-xs font-medium text-green-800 bg-green-200 rounded-full">
                            {t("admin_orders.paid")}
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-xs font-medium text-red-800 bg-red-200 rounded-full">
                            {t("admin_orders.unpaid")}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {updatingOrder === order._id ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-600"></div>
                            <span className="text-xs text-gray-500">
                              {t("admin_orders.updating")}
                            </span>
                          </div>
                        ) : (
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                            className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          >
                            {statusOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString(
                          lang === "ar" ? "ar-EG" : "en-US"
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/order/${order._id}`}
                          className="inline-block px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                        >
                          {t("admin_orders.view_details")}
                        </Link>
                      </td>
                    </tr>
                  ))}
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
                  {t("admin_orders.previous")}
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
                  {t("admin_orders.next")}
                </button>
              </div>
            )}

            <p className="text-center mt-6 text-gray-600">
              {t("admin_orders.showing", {
                from: indexOfFirst + 1,
                to: Math.min(indexOfLast, filteredOrders.length),
                total: filteredOrders.length,
              })}
            </p>
          </>
        )}

        {!adminLoading && !adminError && filteredOrders.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl shadow">
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
