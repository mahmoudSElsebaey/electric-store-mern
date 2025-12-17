/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import { FaRegEyeSlash } from "react-icons/fa";
import { FiEye } from "react-icons/fi";

export default function Login() {
  const navigate = useNavigate();
  const { dispatch } = useStore();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", formData);

      localStorage.setItem("token", res.data.token);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });

      showToast("تم تسجيل الدخول بنجاح ⚡", "success");
      navigate("/");
    } catch (err: any) {
      const message = err.response?.data?.message || "بيانات الدخول غير صحيحة";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center py-12 px-4"
    >
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* الهيدر */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            مرحباً بعودتك!
          </h1>
          <p className="text-indigo-100 text-xl font-medium">
            سجل دخولك واستمتع بتجربة تسوق مميزة ⚡
          </p>
        </div>

        {/* الفورم */}
        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          {/* البريد */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-6 py-5 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition text-lg"
              placeholder="example@domain.com"
            />
          </div>

          {/* كلمة المرور */}
          <div className="relative">
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              كلمة المرور
            </label>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-6 py-5 pr-14 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition text-lg"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-[58px] left-6 text-2xl text-gray-600 hover:text-indigo-600 transition"
            >
              {showPassword ? <FaRegEyeSlash /> : <FiEye />}
            </button>
          </div>

          {/* زر تسجيل الدخول */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-6 rounded-xl text-2xl font-bold hover:from-indigo-700 hover:to-purple-800 transition transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed shadow-2xl"
          >
            {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </form>

        {/* الفوتر */}
        <div className="bg-gray-50 p-8 text-center">
          <p className="text-gray-700 text-lg">
            ليس لديك حساب؟{" "}
            <Link
              to="/register"
              className="text-indigo-600 font-bold hover:underline transition"
            >
              إنشاء حساب جديد
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
