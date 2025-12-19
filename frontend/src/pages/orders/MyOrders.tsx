import React from "react";
import { useOrders } from "../../hooks/useOrders";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";
import { formatPrice } from "../../utils/formatPrice";

const MyOrders: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const isRTL = lang === "ar";

  const { orders, ordersLoading, ordersError } = useOrders();

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      Pending: { label: t("my_orders.status_pending"), color: "yellow" },
      Processing: { label: t("my_orders.status_processing"), color: "blue" },
      Shipped: { label: t("my_orders.status_shipped"), color: "indigo" },
      Delivered: { label: t("my_orders.status_delivered"), color: "green" },
      Cancelled: { label: t("my_orders.status_cancelled"), color: "red" },
    };

    const { label, color } = statusMap[status] || {
      label: status,
      color: "gray",
    };

    return (
      <span
        className={`px-3 py-1 text-sm font-medium text-${color}-800 bg-${color}-200 rounded-full`}
      >
        {label}
      </span>
    );
  };

  const getPaymentBadge = (isPaid: boolean) => {
    return isPaid ? (
      <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-200 rounded-full">
        {t("my_orders.paid")}
      </span>
    ) : (
      <span className="px-3 py-1 text-sm font-medium text-red-800 bg-red-200 rounded-full">
        {t("my_orders.unpaid")}
      </span>
    );
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8" dir={isRTL ? "rtl" : "ltr"}>
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {t("my_orders.title")}
        </h2>

        {/* Loading Spinner */}
        {ordersLoading && (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        )}

        {/* Error Message */}
        {ordersError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-8 text-center">
            {ordersError}
          </div>
        )}

        {/* No Orders */}
        {!ordersLoading && !ordersError && orders.length === 0 && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-6 py-8 rounded-lg text-center text-xl">
            {t("my_orders.no_orders")}
          </div>
        )}

        {/* Orders Table */}
        {!ordersLoading && !ordersError && orders.length > 0 && (
          <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-200">
            <table className="w-full bg-white">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold">
                    {t("my_orders.order_id")}
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold">
                    {t("my_orders.date")}
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold">
                    {t("my_orders.total")}
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold">
                    {t("my_orders.payment")}
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold">
                    {t("my_orders.status")}
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold">
                    {t("my_orders.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      #{order._id.substring(order._id.length - 8)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString(
                        lang === "ar" ? "ar-EG" : "en-US"
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {formatPrice(order.totalPrice, lang)}
                    </td>
                    <td className="px-6 py-4">
                      {getPaymentBadge(order.isPaid)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/order/${order._id}`}
                        className="inline-block px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                      >
                        {t("my_orders.view_details")}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;
