/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useStore } from "../../context/StoreContext";
import api from "../../services/api";
import AdminSidebar from "../../components/AdminSidebar";
import { useToast } from "../../context/ToastContext";
import { useTranslation } from "react-i18next";
import { formatNumber  } from "../../utils/formatNumber"; // ← جديد
import { formatPrice } from "../../utils/formatPrice";

type Stats = {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
};

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const lang = i18n.language; // للاستخدام في formatNumber

  const { state } = useStore();
  const { user, isAuthenticated } = state;
  const { showToast } = useToast();

  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
  });

  const [loading, setLoading] = useState(true);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [addAdminLoading, setAddAdminLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const productsRes = await api.get("/products");
        const totalProducts = Array.isArray(productsRes.data)
          ? productsRes.data.length
          : productsRes.data.total || 0;

        const orderStatsRes = await api.get("/orders/dashboard/stats");
        const data = orderStatsRes.data;

        setStats({
          totalProducts,
          totalOrders: data.totalOrders || 0,
          totalRevenue: data.totalRevenue || 0,
          pendingOrders: data.ordersByStatus?.Pending || 0,
          processingOrders: data.ordersByStatus?.Processing || 0,
          shippedOrders: data.ordersByStatus?.Shipped || 0,
          deliveredOrders: data.ordersByStatus?.Delivered || 0,
          cancelledOrders: data.ordersByStatus?.Cancelled || 0,
        });
      } catch (err: any) {
        console.error("Failed to fetch stats:", err);
        showToast(
          t("dashboard.stats_error", { defaultValue: "فشل جلب الإحصائيات" }),
          "error"
        );
        setStats((prev) => ({
          ...prev,
          totalOrders: 342,
          totalRevenue: 1248500,
        }));
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && ["admin", "owner"].includes(user?.role || "")) {
      fetchStats();
    }
  }, [isAuthenticated, user]);

  const handleMakeAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.trim())
      return showToast(t("dashboard.email_required"), "error");

    setAddAdminLoading(true);
    try {
      await api.put("/auth/make-admin", { email: adminEmail });
      showToast(t("dashboard.add_admin_success"), "success");
      setAdminEmail("");
      setShowAdminForm(false);
    } catch (err: any) {
      showToast(
        err.response?.data?.message || t("dashboard.add_admin_error"),
        "error"
      );
    } finally {
      setAddAdminLoading(false);
    }
  };

  if (!isAuthenticated || !["admin", "owner"].includes(user?.role || "")) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white text-4xl font-bold">
        {t("dashboard.access_denied")}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-3xl">
          {t("dashboard.loading_stats")}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 mx-2" dir={isRTL ? "rtl" : "ltr"}>
      <AdminSidebar />

      <div className={`flex-1 ${isRTL ? "pr-68" : "pl-68"} p-8`}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              {t("dashboard.welcome", {
                name: user?.name || t("dashboard.admin"),
              })}
            </h1>
            <p className="text-2xl text-gray-600">
              {user?.role === "owner"
                ? t("dashboard.owner")
                : t("dashboard.admin")}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
              <p className="text-2xl text-gray-600 mb-4">
                {t("dashboard.new_orders")}
              </p>
              <div className="text-6xl font-bold text-orange-600">
                {formatNumber(stats.pendingOrders, lang)}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
              <p className="text-2xl text-gray-600 mb-4">
                {t("dashboard.processing_shipping")}
              </p>
              <div className="text-6xl font-bold text-blue-600">
                {formatNumber(
                  stats.processingOrders + stats.shippedOrders,
                  lang
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
              <p className="text-2xl text-gray-600 mb-4">
                {t("dashboard.delivered")}
              </p>
              <div className="text-6xl font-bold text-green-600">
                {formatNumber(stats.deliveredOrders, lang)}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
              <p className="text-2xl text-gray-600 mb-4">
                {t("dashboard.cancelled")}
              </p>
              <div className="text-6xl font-bold text-red-600">
                {formatNumber(stats.cancelledOrders, lang)}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-10 text-center col-span-1 sm:col-span-2 lg:col-span-1">
              <p className="text-2xl text-gray-600 mb-4">
                {t("dashboard.total_orders")}
              </p>
              <div className="text-6xl font-bold text-purple-600">
                {formatNumber(stats.totalOrders, lang)}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-10 text-center col-span-1 sm:col-span-2 lg:col-span-2">
              <p className="text-2xl text-gray-600 mb-4">
                {t("dashboard.total_sales")}
              </p>
              <div className="text-5xl font-bold text-yellow-600">
                {formatPrice(stats.totalRevenue, lang)}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
              <p className="text-2xl text-gray-600 mb-4">
                {t("dashboard.products_in_stock")}
              </p>
              <div className="text-6xl font-bold text-teal-600">
                {formatNumber(stats.totalProducts, lang)}
              </div>
            </div>
          </div>

          {/* Add Admin (Owner only) */}
          {user?.role === "owner" && (
            <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
              <button
                onClick={() => setShowAdminForm(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white py-6 px-12 rounded-2xl text-2xl font-bold transition transform hover:scale-105 shadow-lg"
              >
                {t("dashboard.add_admin")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Add Admin */}
      {showAdminForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-10 w-full max-w-md shadow-2xl">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              {t("dashboard.add_admin_title")}
            </h2>
            <form onSubmit={handleMakeAdmin}>
              <input
                type="email"
                placeholder={t("dashboard.admin_email")}
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full p-4 border-2 border-gray-300 rounded-xl text-lg mb-6 focus:ring-4 focus:ring-purple-300"
                required
              />
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={addAdminLoading}
                  className="flex-1 bg-purple-600 text-white py-4 rounded-xl text-xl font-bold hover:bg-purple-700 disabled:opacity-70"
                >
                  {addAdminLoading ? "جاري..." : t("dashboard.convert")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminForm(false);
                    setAdminEmail("");
                  }}
                  className="flex-1 bg-gray-600 text-white py-4 rounded-xl text-xl font-bold hover:bg-gray-700"
                >
                  {t("dashboard.cancel")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
