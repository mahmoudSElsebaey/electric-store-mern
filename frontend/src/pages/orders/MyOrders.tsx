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

  const statusStyles: Record<string, string> = {
    Pending: "bg-amber-100 text-amber-800",
    Processing: "bg-sky-100 text-sky-800",
    Shipped: "bg-indigo-100 text-indigo-800",
    Delivered: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  const statusLabel = (status: string) => {
    const map: Record<string, string> = {
      Pending: t("my_orders.status_pending"),
      Processing: t("my_orders.status_processing"),
      Shipped: t("my_orders.status_shipped"),
      Delivered: t("my_orders.status_delivered"),
      Cancelled: t("my_orders.status_cancelled"),
    };
    return map[status] || status;
  };

  return (
    <>
      <div className="min-h-[60vh] bg-surface" dir={isRTL ? "rtl" : "ltr"}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink mb-6 sm:mb-8 text-center">
            {t("my_orders.title")}
          </h2>

          {ordersLoading && (
            <div className="flex justify-center my-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary" />
            </div>
          )}

          {ordersError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-center text-sm sm:text-base">
              {ordersError}
            </div>
          )}

          {!ordersLoading && !ordersError && orders.length === 0 && (
            <div className="rounded-2xl border border-primary/15 bg-primary-soft/30 px-6 py-12 text-center">
              <p className="text-lg text-primary-dark font-semibold mb-4">
                {t("my_orders.no_orders", { defaultValue: "لا توجد طلبات بعد" })}
              </p>
              <Link to="/store" className="inline-flex rounded-xl bg-primary px-6 py-3 font-bold text-white hover:bg-primary-dark transition">
                {t("my_orders.shop_now", { defaultValue: "تسوق الآن" })}
              </Link>
            </div>
          )}

          {!ordersLoading && !ordersError && orders.length > 0 && (
            <>
              <div className="hidden md:block overflow-x-auto rounded-2xl border border-primary/10 bg-white shadow-sm">
                <table className="w-full min-w-[700px]">
                  <thead className="bg-primary-dark text-white">
                    <tr>
                      <th className="px-4 py-3 text-sm font-semibold text-start">{t("my_orders.order_id")}</th>
                      <th className="px-4 py-3 text-sm font-semibold text-start">{t("my_orders.date")}</th>
                      <th className="px-4 py-3 text-sm font-semibold text-start">{t("my_orders.total")}</th>
                      <th className="px-4 py-3 text-sm font-semibold text-start">{t("my_orders.payment")}</th>
                      <th className="px-4 py-3 text-sm font-semibold text-start">{t("my_orders.status")}</th>
                      <th className="px-4 py-3 text-sm font-semibold text-center">{t("my_orders.actions")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-primary-soft/30 transition">
                        <td className="px-4 py-3 text-sm font-medium">#{order._id.slice(-8)}</td>
                        <td className="px-4 py-3 text-sm text-muted">
                          {new Date(order.createdAt).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US")}
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-primary tabular-nums">
                          {formatPrice(order.totalPrice, lang)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${order.isPaid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            {order.isPaid ? t("my_orders.paid") : t("my_orders.unpaid")}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusStyles[order.status] || "bg-gray-100 text-gray-800"}`}>
                            {statusLabel(order.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Link to={`/order/${order._id}`} className="inline-block px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition">
                            {t("my_orders.view", { defaultValue: t("my_orders.view_details") })}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="rounded-2xl border border-primary/10 bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="font-bold text-ink">#{order._id.slice(-8)}</p>
                        <p className="text-xs text-muted mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US")}
                        </p>
                      </div>
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full shrink-0 ${statusStyles[order.status] || "bg-gray-100 text-gray-800"}`}>
                        {statusLabel(order.status)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-4">
                      <span className="text-muted">{t("my_orders.total")}</span>
                      <span className="font-extrabold text-primary tabular-nums">{formatPrice(order.totalPrice, lang)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${order.isPaid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {order.isPaid ? t("my_orders.paid") : t("my_orders.unpaid")}
                      </span>
                      <Link to={`/order/${order._id}`} className="px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-primary-dark rounded-lg transition">
                        {t("my_orders.view", { defaultValue: t("my_orders.view_details") })}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;
