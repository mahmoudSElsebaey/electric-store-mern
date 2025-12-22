/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useStore } from "../../context/StoreContext";
import api from "../../services/api";
import { useToast } from "../../context/ToastContext";
import { useTranslation } from "react-i18next";
import AdminLayout from "../../layouts/AdminLayout";
import { formatNumber } from "../../utils/formatNumber"; // افترض وجودها
import { formatPrice } from "../../utils/formatPrice";   // افترض وجودها

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

const Dashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const lang = i18n.language;

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

  // جلب الإحصائيات
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const [productsRes, orderStatsRes] = await Promise.all([
          api.get("/products"),
          api.get("/orders/dashboard/stats"),
        ]);

        const totalProducts = Array.isArray(productsRes.data)
          ? productsRes.data.length
          : productsRes.data.total || 0;

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
        console.error("Failed to fetch dashboard stats:", err);
        showToast(
          err.response?.data?.message || t("dashboard.stats_error") || "فشل جلب الإحصائيات",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && ["admin", "owner"].includes(user?.role || "")) {
      fetchStats();
    }
  }, [isAuthenticated, user, t, showToast]);

  const handleMakeAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.trim()) {
      showToast(t("dashboard.email_required") || "البريد الإلكتروني مطلوب", "error");
      return;
    }

    setAddAdminLoading(true);
    try {
      await api.put("/auth/make-admin", { email: adminEmail.trim() });
      showToast(
        t("dashboard.add_admin_success") || "تم تحويل المستخدم إلى أدمن بنجاح",
        "success"
      );
      setAdminEmail("");
      setShowAdminForm(false);
    } catch (err: any) {
      showToast(
        err.response?.data?.message || t("dashboard.add_admin_error") || "فشل إضافة الأدمن",
        "error"
      );
    } finally {
      setAddAdminLoading(false);
    }
  };

  if (!isAuthenticated || !["admin", "owner"].includes(user?.role || "")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white text-3xl font-bold">
        {t("dashboard.access_denied") || "غير مصرح لك بالدخول"}
      </div>
    );
  }

  return (
    <AdminLayout title={t("dashboard.dashboard_title") || "لوحة التحكم الرئيسية"}>
      <div dir={isRTL ? "rtl" : "ltr"} className="p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* الترحيب */}
          <div className="mb-12 text-center lg:text-right">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
              {t("dashboard.welcome", { name: user?.name || "الأدمن" })}
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600">
              {user?.role === "owner"
                ? t("dashboard.owner") || "صاحب المتجر"
                : t("dashboard.admin") || "مدير المتجر"}
            </p>
          </div>

          {/* Stats Grid - التصميم القديم */}
          {loading ? (
            <div className="flex justify-center items-center min-h-[60vh]">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
              {/* الطلبات الجديدة */}
              <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
                <p className="text-2xl text-gray-600 mb-4">
                  {t("dashboard.new_orders") || "الطلبات الجديدة"}
                </p>
                <div className="text-6xl font-bold text-orange-600">
                  {formatNumber(stats.pendingOrders, lang)}
                </div>
              </div>

              {/* قيد المعالجة + تم الشحن */}
              <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
                <p className="text-2xl text-gray-600 mb-4">
                  {t("dashboard.processing_shipping") || "قيد المعالجة / تم الشحن"}
                </p>
                <div className="text-6xl font-bold text-blue-600">
                  {formatNumber(stats.processingOrders + stats.shippedOrders, lang)}
                </div>
              </div>

              {/* تم التسليم */}
              <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
                <p className="text-2xl text-gray-600 mb-4">
                  {t("dashboard.delivered") || "تم التسليم"}
                </p>
                <div className="text-6xl font-bold text-green-600">
                  {formatNumber(stats.deliveredOrders, lang)}
                </div>
              </div>

              {/* ملغاة */}
              <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
                <p className="text-2xl text-gray-600 mb-4">
                  {t("dashboard.cancelled") || "ملغاة"}
                </p>
                <div className="text-6xl font-bold text-red-600">
                  {formatNumber(stats.cancelledOrders, lang)}
                </div>
              </div>

              {/* إجمالي الطلبات */}
              <div className="bg-white rounded-3xl shadow-xl p-10 text-center col-span-1 sm:col-span-2 lg:col-span-1">
                <p className="text-2xl text-gray-600 mb-4">
                  {t("dashboard.total_orders") || "إجمالي الطلبات"}
                </p>
                <div className="text-6xl font-bold text-purple-600">
                  {formatNumber(stats.totalOrders, lang)}
                </div>
              </div>

              {/* إجمالي المبيعات - يأخذ مساحة أكبر */}
              <div className="bg-white rounded-3xl shadow-xl p-10 text-center col-span-1 sm:col-span-2 lg:col-span-2">
                <p className="text-2xl text-gray-600 mb-4">
                  {t("dashboard.total_sales") || "إجمالي المبيعات"}
                </p>
                <div className="text-5xl font-bold text-yellow-600">
                  {formatPrice(stats.totalRevenue, lang)}
                </div>
              </div>

              {/* عدد المنتجات */}
              <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
                <p className="text-2xl text-gray-600 mb-4">
                  {t("dashboard.products_in_stock") || "المنتجات في المخزون"}
                </p>
                <div className="text-6xl font-bold text-teal-600">
                  {formatNumber(stats.totalProducts, lang)}
                </div>
              </div>
            </div>
          )}

          {/* زر إضافة أدمن (للـ owner فقط) */}
          {user?.role === "owner" && (
            <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
              <button
                onClick={() => setShowAdminForm(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white py-6 px-12 rounded-2xl text-2xl font-bold transition transform hover:scale-105 shadow-lg"
              >
                {t("dashboard.add_admin") || "إضافة مدير جديد"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal إضافة أدمن */}
      {showAdminForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-10 w-full max-w-md shadow-2xl">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              {t("dashboard.add_admin_title") || "إضافة مدير جديد"}
            </h2>
            <form onSubmit={handleMakeAdmin}>
              <input
                type="email"
                placeholder={t("dashboard.admin_email") || "البريد الإلكتروني للمدير"}
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
                  {addAdminLoading ? "جاري..." : t("dashboard.convert") || "تحويل إلى أدمن"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminForm(false);
                    setAdminEmail("");
                  }}
                  className="flex-1 bg-gray-600 text-white py-4 rounded-xl text-xl font-bold hover:bg-gray-700"
                >
                  {t("common.cancel") || "إلغاء"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Dashboard;