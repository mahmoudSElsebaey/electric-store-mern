// src/pages/AdminProfile.tsx
import { useNavigate } from "react-router-dom";
 

export default function AdminProfile() {
  const navigate = useNavigate();

  return (
    <>
 
      <div className="min-h-screen bg-gray-900 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-5xl font-bold text-center mb-16 text-white">لوحة تحكم المدير</h1>

          <div className="bg-gray-800 rounded-3xl shadow-2xl p-12">
            {/* الهيدر */}
            <div className="text-center mb-12">
              <div className="w-40 h-40 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center text-8xl font-bold text-white mb-6">
                A
              </div>
              <h2 className="text-4xl font-bold text-white">محمد - مدير النظام</h2>
              <p className="text-xl text-gray-400 mt-2">آخر دخول: اليوم 3:45 م</p>
            </div>

            {/* الإحصائيات */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-10 rounded-3xl text-center text-white">
                <div className="text-6xl font-bold">87</div>
                <p className="text-2xl mt-3">منتج في المخزون</p>
              </div>
              <div className="bg-gradient-to-br from-green-600 to-green-800 p-10 rounded-3xl text-center text-white">
                <div className="text-6xl font-bold">342</div>
                <p className="text-2xl mt-3">طلب مكتمل</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-10 rounded-3xl text-center text-white">
                <div className="text-5xl font-bold">1.2M ج.م</div>
                <p className="text-2xl mt-3">إجمالي المبيعات</p>
              </div>
            </div>

            {/* الأزرار */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <button
                onClick={() => navigate("/admin")}
                className="bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-2xl text-xl font-bold transition"
              >
                إدارة المنتجات
              </button>
              <button
                onClick={() => alert("سيتم إضافتها قريبًا")}
                className="bg-green-600 hover:bg-green-700 text-white py-6 rounded-2xl text-xl font-bold transition"
              >
                إدارة الطلبات
              </button>
              <button
                onClick={() => alert("سيتم إضافتها قريبًا")}
                className="bg-purple-600 hover:bg-purple-700 text-white py-6 rounded-2xl text-xl font-bold transition"
              >
                إدارة العملاء
              </button>
              <button
                onClick={() => alert("سيتم إضافتها قريبًا")}
                className="bg-red-600 hover:bg-red-700 text-white py-6 rounded-2xl text-xl font-bold transition"
              >
                التقارير
              </button>
            </div>
          </div>
        </div>
      </div>
     
    </>
  );
}