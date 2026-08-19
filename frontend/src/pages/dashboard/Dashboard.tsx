/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useStore } from "../../context/StoreContext";
import api from "../../services/api";
import { useToast } from "../../context/ToastContext";
import { useTranslation } from "react-i18next";
import AdminLayout from "../../layouts/AdminLayout";
import { formatNumber } from "../../utils/formatNumber";
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

const Dashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const lang = i18n.language;
  const { state } = useStore();
  const { user, isAuthenticated } = state;
  const { showToast } = useToast();

  const [stats, setStats] = useState<Stats>({
    totalProducts: 0, totalOrders: 0, totalRevenue: 0,
    pendingOrders: 0, processingOrders: 0, shippedOrders: 0,
    deliveredOrders: 0, cancelledOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [addAdminLoading, setAddAdminLoading] = useState(false);

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
        showToast(err.response?.data?.message || t("dashboard.stats_error") || "فشل جلب الإحصائيات", "error");
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated && ["admin", "owner"].includes(user?.role || "")) fetchStats();
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
      showToast(t("dashboard.add_admin_success") || "تم تحويل المستخدم إلى أدمن بنجاح", "success");
      setAdminEmail("");
      setShowAdminForm(false);
    } catch (err: any) {
      showToast(err.response?.data?.message || t("dashboard.add_admin_error") || "فشل إضافة الأدمن", "error");
    } finally {
      setAddAdminLoading(false);
    }
  };

  if (!isAuthenticated || !["admin", "owner"].includes(user?.role || "")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-dark text-white text-3xl font-bold">
        {t("dashboard.access_denied") || "غير مصرح لك بالدخول"}
      </div>
    );
  }

  const card = "rounded-2xl shadow-lg p-5 sm:p-8 text-center border border-primary/10 bg-white";

  return (
    <AdminLayout title={t("dashboard.dashboard_title") || "لوحة التحكم الرئيسية"}>
      <div dir={isRTL ? "rtl" : "ltr"} className="p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 text-center lg:text-start">
            <h1 className="text-2xl sm:text-4xl font-bold text-ink mb-2">
              {t("dashboard.welcome", { name: user?.name || "الأدمن" })}
            </h1>
            <p className="text-base sm:text-xl text-muted">
              {user?.role === "owner" ? t("dashboard.owner") || "صاحب المتجر" : t("dashboard.admin") || "مدير المتجر"}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[40vh]">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              <div className={card}>
                <p className="text-sm sm:text-base text-muted mb-2">{t("dashboard.new_orders") || "الطلبات الجديدة"}</p>
                <div className="text-3xl sm:text-5xl font-bold text-accent-dark">{formatNumber(stats.pendingOrders, lang)}</div>
              </div>
              <div className={card}>
                <p className="text-sm sm:text-base text-muted mb-2">{t("dashboard.processing_shipping") || "قيد المعالجة / تم الشحن"}</p>
                <div className="text-3xl sm:text-5xl font-bold text-primary">{formatNumber(stats.processingOrders + stats.shippedOrders, lang)}</div>
              </div>
              <div className={card}>
                <p className="text-sm sm:text-base text-muted mb-2">{t("dashboard.delivered") || "تم التسليم"}</p>
                <div className="text-3xl sm:text-5xl font-bold text-green-600">{formatNumber(stats.deliveredOrders, lang)}</div>
              </div>
              <div className={card}>
                <p className="text-sm sm:text-base text-muted mb-2">{t("dashboard.cancelled") || "ملغاة"}</p>
                <div className="text-3xl sm:text-5xl font-bold text-red-600">{formatNumber(stats.cancelledOrders, lang)}</div>
              </div>
              <div className={`${card} col-span-1 sm:col-span-2 lg:col-span-1`}>
                <p className="text-sm sm:text-base text-muted mb-2">{t("dashboard.total_orders") || "إجمالي الطلبات"}</p>
                <div className="text-3xl sm:text-5xl font-bold text-primary-dark">{formatNumber(stats.totalOrders, lang)}</div>
              </div>
              <div className={`${card} col-span-1 sm:col-span-2 lg:col-span-2`}>
                <p className="text-sm sm:text-base text-muted mb-2">{t("dashboard.total_sales") || "إجمالي المبيعات"}</p>
                <div className="text-2xl sm:text-4xl font-bold text-primary">{formatPrice(stats.totalRevenue, lang)}</div>
              </div>
              <div className={card}>
                <p className="text-sm sm:text-base text-muted mb-2">{t("dashboard.products_in_stock") || "المنتجات في المخزون"}</p>
                <div className="text-3xl sm:text-5xl font-bold text-primary">{formatNumber(stats.totalProducts, lang)}</div>
              </div>
            </div>
          )}

          {user?.role === "owner" && (
            <div className={`${card} mt-4`}>
              <button onClick={() => setShowAdminForm(true)} className="bg-primary hover:bg-primary-dark text-white py-3 sm:py-4 px-8 rounded-xl text-base sm:text-lg font-bold transition shadow-md">
                {t("dashboard.add_admin") || "إضافة مدير جديد"}
              </button>
            </div>
          )}
        </div>
      </div>

      {showAdminForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 text-ink">
              {t("dashboard.add_admin_title") || "إضافة مدير جديد"}
            </h2>
            <form onSubmit={handleMakeAdmin}>
              <input type="email" placeholder={t("dashboard.admin_email") || "البريد الإلكتروني للمدير"} value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} className="w-full p-3 border-2 border-gray-300 rounded-xl mb-4 focus:ring-4 focus:ring-primary-light" required />
              <div className="flex gap-3">
                <button type="submit" disabled={addAdminLoading} className="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-dark disabled:opacity-70">
                  {addAdminLoading ? "جاري..." : t("dashboard.convert") || "تحويل إلى أدمن"}
                </button>
                <button type="button" onClick={() => { setShowAdminForm(false); setAdminEmail(""); }} className="flex-1 bg-gray-600 text-white py-3 rounded-xl font-bold hover:bg-gray-700">
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
