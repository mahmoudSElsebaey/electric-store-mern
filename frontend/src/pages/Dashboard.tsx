/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/AdminProfile.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import api from "../services/api";

type Stats = {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { state } = useStore();
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // جلب عدد المنتجات
        const productsRes = await api.get("/products");
        const totalProducts = productsRes.data.length;

        // لو عندك موديل Orders، هتجيب عدد الطلبات والإيرادات
        // مثال (لو عملت موديل Orders في المستقبل)
        // const ordersRes = await api.get("/orders");
        // const totalOrders = ordersRes.data.length;
        // const totalRevenue = ordersRes.data.reduce((sum, order) => sum + order.totalPrice, 0);

        // دلوقتي هنستخدم قيم مؤقتة للطلبات والإيرادات
        const totalOrders = 342; // غيّرها لما تعمل موديل Orders
        const totalRevenue = 1248500; // غيّرها لما تعمل موديل Orders

        setStats({ totalProducts, totalOrders, totalRevenue });
        setLoading(false);
      } catch (err) {
        console.error("فشل جلب الإحصائيات");
        setLoading(false);
      }
    };

    if (state.user?.isAdmin) {
      fetchStats();
    }
  }, [state.user]);

  if (!state.isAuthenticated || !state.user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white text-4xl">
        ممنوع - مطلوب صلاحيات Admin
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-3xl">جاري تحميل الإحصائيات...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-5xl font-bold text-center mb-16 text-white">
          لوحة تحكم المدير
        </h1>

        <div className="bg-gray-800 rounded-3xl shadow-2xl p-12">
          {/* الهيدر */}
          <div className="text-center mb-12">
            <div className="w-40 h-40 bg-linear-to-br from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center text-8xl font-bold text-white mb-6">
              {state.user?.name.charAt(0).toUpperCase() || "A"}
            </div>
            <h2 className="text-4xl font-bold text-white">
              {state.user?.name || "المدير"} - مدير النظام
            </h2>
            <p className="text-xl text-gray-400 mt-2">
              آخر دخول: اليوم {new Date().toLocaleTimeString("ar-EG")}
            </p>
          </div>

          {/* الإحصائيات */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-linear-to-br from-blue-600 to-blue-800 p-10 rounded-3xl text-center text-white shadow-lg">
              <div className="text-6xl font-bold">{stats.totalProducts}</div>
              <p className="text-2xl mt-3 ">منتج في المخزون</p>
            </div>
            <div className="bg-linear-to-br from-green-600 to-green-800 p-10 rounded-3xl text-center text-white shadow-lg">
              <div className="text-6xl font-bold">{stats.totalOrders}</div>
              <p className="text-2xl mt-3">طلب مكتمل</p>
            </div>
            <div className="bg-linear-to-br from-yellow-500 to-orange-600 p-10 rounded-3xl text-center text-white shadow-lg">
              <div className="text-5xl font-bold">
                {stats.totalRevenue.toLocaleString()} ج.م
              </div>
              <p className="text-2xl mt-3">إجمالي المبيعات</p>
            </div>
          </div>

          {/* أزرار الإدارة */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <button
              onClick={() => navigate("/products-management")}
              className="bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-2xl text-xl font-bold transition transform hover:scale-105 shadow-lg"
            >
              إدارة المنتجات
            </button>
            <button
              onClick={() => alert("سيتم إضافتها قريبًا")}
              className="bg-green-600 hover:bg-green-700 text-white py-6 rounded-2xl text-xl font-bold transition transform hover:scale-105 shadow-lg"
            >
              إدارة الطلبات
            </button>
            <button
              onClick={() => alert("سيتم إضافتها قريبًا")}
              className="bg-purple-600 hover:bg-purple-700 text-white py-6 rounded-2xl text-xl font-bold transition transform hover:scale-105 shadow-lg"
            >
              إدارة العملاء
            </button>
            <button
              onClick={() => alert("سيتم إضافتها قريبًا")}
              className="bg-red-600 hover:bg-red-700 text-white py-6 rounded-2xl text-xl font-bold transition transform hover:scale-105 shadow-lg"
            >
              التقارير والإحصائيات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
