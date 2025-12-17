/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import { FiEye } from "react-icons/fi";
import { FaRegEyeSlash } from "react-icons/fa";

export default function Register() {
  const navigate = useNavigate();
  const { dispatch } = useStore();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showToast("كلمتا المرور غير متطابقتين!", "error");
      return;
    }

    if (formData.password.length < 6) {
      showToast("كلمة المرور يجب أن تكون 6 أحرف على الأقل", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("token", res.data.token);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });

      showToast("تم إنشاء الحساب بنجاح! 🎉", "success");
      navigate("/");
    } catch (err: any) {
      const message = err.response?.data?.message || "حدث خطأ أثناء التسجيل";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* الهيدر */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            إنشاء حساب جديد
          </h1>
          <p className="text-blue-100 text-xl font-medium">
            انضم إلينا واستمتع بتجربة تسوق مميزة ⚡
          </p>
        </div>

        {/* الفورم */}
        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          {/* الاسم */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              الاسم الكامل
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-6 py-5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-lg"
              placeholder="محمد أحمد"
            />
          </div>

          {/* البريد */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-6 py-5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-lg"
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
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-6 py-5 pr-14 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-lg"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-[58px] left-6 text-2xl text-gray-600 hover:text-blue-600 transition"
            >
              {showPassword ? <FaRegEyeSlash /> : <FiEye />}
            </button>
          </div>

          {/* تأكيد كلمة المرور */}
          <div className="relative">
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              تأكيد كلمة المرور
            </label>
            <input
              type={showConfirm ? "text" : "password"}
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-6 py-5 pr-14 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-lg"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute top-[58px] left-6 text-2xl text-gray-600 hover:text-blue-600 transition"
            >
              {showConfirm ? <FaRegEyeSlash /> : <FiEye />}
            </button>
          </div>

          {/* زر التسجيل */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-6 rounded-xl text-2xl font-bold hover:from-blue-700 hover:to-indigo-800 transition transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed shadow-2xl"
          >
            {loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
          </button>
        </form>

        {/* الفوتر */}
        <div className="bg-gray-50 p-8 text-center">
          <p className="text-gray-700 text-lg">
            لديك حساب بالفعل؟
            <Link to="/login" className="text-blue-600 font-bold hover:underline transition">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}