/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/Login.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const { dispatch } = useStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", formData);

      // حفظ التوكن واليوزر في الـ localStorage والـ Context
      localStorage.setItem("token", res.data.token);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });

      alert("تم تسجيل الدخول بنجاح! 🎉");
      navigate("/");
    } catch (err: any) {
      const message = err.response?.data?.message || "بيانات الدخول غير صحيحة";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 to-purple-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* الهيدر */}
        <div className="bg-linear-to-r from-indigo-600 to-purple-700 p-10 text-center">
          <h1 className="text-4xl font-bold text-white mb-3">مرحباً بعودتك!</h1>
          <p className="text-indigo-100 text-lg">
            سجل دخولك واستمتع بتجربة تسوق مميزة ⚡
          </p>
        </div>

        {/* الفورم */}
        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition text-lg"
              placeholder="example@domain.com"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              كلمة المرور
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition text-lg"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-indigo-600 to-purple-700 text-white py-5 rounded-xl text-xl font-bold hover:from-indigo-700 hover:to-purple-800 transition transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </form>

        {/* الفوتر */}
        <div className="bg-gray-50 p-8 text-center">
          <p className="text-gray-600">
            ليس لديك حساب؟{" "}
            <Link
              to="/register"
              className="text-indigo-600 font-bold hover:underline"
            >
              إنشاء حساب جديد
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
