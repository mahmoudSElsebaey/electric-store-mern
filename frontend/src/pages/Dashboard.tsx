/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
 
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

  // نموذج إضافة أدمن جديد بالإيميل
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [addAdminLoading, setAddAdminLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const productsRes = await api.get("/products");
        const totalProducts = productsRes.data.length;

        // قيم مؤقتة لحد ما تعمل موديل Orders
        const totalOrders = 342;
        const totalRevenue = 1248500;

        setStats({ totalProducts, totalOrders, totalRevenue });
        setLoading(false);
      } catch (err) {
        console.error("فشل جلب الإحصائيات");
        setLoading(false);
      }
    };

    if (state.user?.role === "owner") {
      fetchStats();
    }
  }, [state.user]);

  const handleMakeAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.trim()) {
      alert("الإيميل مطلوب!");
      return;
    }

    setAddAdminLoading(true);
    try {
      await api.put("/auth/make-admin", { email: adminEmail });
      alert("تم تحويل المستخدم إلى أدمن بنجاح! 🎉");
      setShowAdminForm(false);
      setAdminEmail("");
    } catch (err: any) {
      alert("خطأ: " + (err.response?.data?.message || "فشل في تحويل المستخدم"));
    } finally {
      setAddAdminLoading(false);
    }
  };

  // حماية: الـ Owner بس يقدر يشوف الصفحة
  if (!state.isAuthenticated || state.user?.role !== "owner") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white text-4xl">
        ممنوع - مطلوب صلاحيات Owner
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
          لوحة تحكم الـ Owner
        </h1>

        <div className="bg-gray-800 rounded-3xl shadow-2xl p-12">
          {/* الهيدر */}
          <div className="text-center mb-12">
            <div className="w-40 h-40 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center text-8xl font-bold text-white mb-6">
              {state.user?.name.charAt(0).toUpperCase() || "O"}
            </div>
            <h2 className="text-4xl font-bold text-white">
              {state.user?.name || "الـ Owner"} - المالك الرئيسي
            </h2>
            <p className="text-xl text-gray-400 mt-2">
              آخر دخول: اليوم {new Date().toLocaleTimeString("ar-EG")}
            </p>
          </div>

          {/* الإحصائيات */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-10 rounded-3xl text-center text-white shadow-lg">
              <div className="text-6xl font-bold">{stats.totalProducts}</div>
              <p className="text-2xl mt-3">منتج في المخزون</p>
            </div>
            <div className="bg-gradient-to-br from-green-600 to-green-800 p-10 rounded-3xl text-center text-white shadow-lg">
              <div className="text-6xl font-bold">{stats.totalOrders}</div>
              <p className="text-2xl mt-3">طلب مكتمل</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-10 rounded-3xl text-center text-white shadow-lg">
              <div className="text-5xl font-bold">
                {stats.totalRevenue.toLocaleString()} ج.م
              </div>
              <p className="text-2xl mt-3">إجمالي المبيعات</p>
            </div>
          </div>

          {/* الأزرار */}
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
              onClick={() => setShowAdminForm(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white py-6 rounded-2xl text-xl font-bold transition transform hover:scale-105 shadow-lg"
            >
              إضافة أدمن جديد
            </button>
            <button
              onClick={() => navigate("/users-management")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-6 rounded-2xl text-xl font-bold transition transform hover:scale-105 shadow-lg"
            >
              إدارة العملاء
            </button>
          </div>
        </div>

        {/* نموذج إضافة أدمن جديد بالإيميل */}
        {showAdminForm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-10 w-full max-w-md shadow-2xl">
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                إضافة أدمن جديد
              </h2>
              <form onSubmit={handleMakeAdmin}>
                <input
                  type="email"
                  placeholder="الإيميل الخاص بالمستخدم"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full p-4 border rounded-xl text-lg mb-6 focus:ring-4 focus:ring-purple-300"
                  required
                />
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={addAdminLoading}
                    className="flex-1 bg-purple-600 text-white py-4 rounded-xl text-xl font-bold hover:bg-purple-700 transition disabled:opacity-70"
                  >
                    {addAdminLoading ? "جاري التحويل..." : "تحويل إلى أدمن"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdminForm(false);
                      setAdminEmail("");
                    }}
                    className="flex-1 bg-gray-600 text-white py-4 rounded-xl text-xl font-bold hover:bg-gray-700 transition"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}