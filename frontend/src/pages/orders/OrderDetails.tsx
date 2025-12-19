import React from "react";
import { Link } from "react-router-dom";
import {
  useOrderDetails,
  type OrderDetailsType,
} from "../../hooks/useOrderDetails";
import { useStore } from "../../context/StoreContext";
import AdminLayout from "../../layouts/AdminLayout";
import { useTranslation } from "react-i18next";
import { formatPrice } from "../../utils/formatPrice";

const OrderDetailsContent: React.FC<{ order: OrderDetailsType }> = ({
  order,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      Pending: { label: t("admin_orders.pending"), color: "yellow" },
      Processing: { label: t("admin_orders.processing"), color: "blue" },
      Shipped: { label: t("admin_orders.shipped"), color: "indigo" },
      Delivered: { label: t("admin_orders.delivered"), color: "green" },
      Cancelled: { label: t("admin_orders.cancelled"), color: "red" },
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

  const getPaymentBadge = (isPaid: boolean, paidAt?: string) => {
    return isPaid ? (
      <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-200 rounded-full">
        {t("admin_orders.paid_on", {
          date: paidAt
            ? new Date(paidAt).toLocaleDateString(
                lang === "ar" ? "ar-EG" : "en-US"
              )
            : t("unknown"),
        })}
      </span>
    ) : (
      <span className="px-3 py-1 text-sm font-medium text-red-800 bg-red-200 rounded-full">
        {t("admin_orders.unpaid")}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="flex justify-between items-center mb-8">
        <Link
          to="/my-orders"
          className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={lang === "ar" ? "M9 19l7-7-7-7" : "M15 19l-7-7 7-7"}
            />
          </svg>
          {t("order_details.back_to_orders")}
        </Link>
        <h2 className="text-2xl font-bold text-gray-800">
          {t("order_details.title", {
            id: order._id.substring(order._id.length - 8),
          })}
        </h2>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              {t("order_details.shipping_info")}
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                <span className="font-medium">{t("order_details.name")}:</span>{" "}
                {order.shippingAddress.fullName}
              </p>
              <p>
                <span className="font-medium">{t("order_details.phone")}:</span>{" "}
                {order.shippingAddress.phone}
              </p>
              <p>
                <span className="font-medium">
                  {t("order_details.address")}:
                </span>{" "}
                {order.shippingAddress.address}, {order.shippingAddress.city}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t("order_details.status_title")}
            </h3>
            <div className="flex flex-wrap gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  {t("order_details.current_status")}
                </p>
                {getStatusBadge(order.status)}
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  {t("order_details.order_date")}
                </p>
                <p className="text-sm font-medium">
                  {new Date(order.createdAt).toLocaleDateString(
                    lang === "ar" ? "ar-EG" : "en-US"
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              {t("order_details.products_title")}
            </h3>
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 border-b border-gray-100 pb-4 last:border-b-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {t("order_details.quantity")}: {item.qty}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {formatPrice(item.qty * item.price, lang)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t("order_details.price_per_item", {
                        price: formatPrice(item.price, lang).replace(
                          /[^\d.,]/g,
                          ""
                        ),
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t("order_details.payment_status")}
            </h3>
            <div className="text-center py-4">
              {getPaymentBadge(order.isPaid, order.paidAt)}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-2">
                {t("order_details.payment_method")}
              </p>
              <span className="inline-block px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full">
                {order.paymentMethod.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t("order_details.summary_title")}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {t("order_details.items_price")}
                </span>
                <span>{formatPrice(order.itemsPrice, lang)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {t("order_details.shipping_price")}
                </span>
                <span>{formatPrice(order.shippingPrice, lang)}</span>
              </div>
              <div className="h-px bg-gray-200 my-3"></div>
              <div className="flex justify-between text-lg font-semibold text-gray-900">
                <span>{t("order_details.total_price")}</span>
                <span>{formatPrice(order.totalPrice, lang)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <Link
              to="/my-orders"
              className="block w-full text-center px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition font-medium"
            >
              {t("order_details.return_to_orders")}
            </Link>
            {order.status === "Pending" && (
              <button className="block w-full mt-3 px-6 py-3 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition font-medium">
                {t("order_details.cancel_order")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderDetails: React.FC = () => {
  const { t } = useTranslation();
  const { order, loading, error } = useOrderDetails();
  const { state } = useStore();
  const isAdminOrOwner = ["admin", "owner"].includes(state.user?.role || "");

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">{t("order_details.loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg">
          {t("order_details.not_found")}
        </div>
      </div>
    );
  }

  if (isAdminOrOwner) {
    return (
      <AdminLayout
        title={t("order_details.title", {
          id: order._id.substring(order._id.length - 8),
        })}
      >
        <OrderDetailsContent order={order} />
      </AdminLayout>
    );
  }

  return <OrderDetailsContent order={order} />;
};

export default OrderDetails;
