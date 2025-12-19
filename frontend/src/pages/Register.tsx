/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import { FiEye } from "react-icons/fi";
import { FaRegEyeSlash } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function Register() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { dispatch } = useStore();
  const { showToast } = useToast();

  const isRTL = i18n.language === "ar";

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
      showToast(t("auth.errors.password_mismatch"), "error");
      return;
    }

    if (formData.password.length < 6) {
      showToast(t("auth.errors.password_short"), "error");
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

      showToast(t("auth.success.register"), "success");
      navigate("/");
    } catch (err: any) {
      const message =
        err.response?.data?.message || t("auth.errors.register_failed");
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4"
    >
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-indigo-700 p-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            {t("auth.register.title")}
          </h1>
          <p className="text-blue-100 text-xl font-medium">
            {t("auth.register.subtitle")}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          {/* Name */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              {t("auth.register.name")}
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-6 py-5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-lg"
              placeholder={t("auth.register.name_placeholder")}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              {t("auth.register.email")}
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-6 py-5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-lg"
              placeholder={t("auth.register.email_placeholder")}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              {t("auth.register.password")}
            </label>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className={`w-full px-6 py-5 ${
                isRTL ? "pr-14" : "pl-14"
              } rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-lg`}
              placeholder={t("auth.register.password_placeholder")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute top-[58px] ${
                isRTL ? "left-6" : "right-6"
              } text-2xl text-gray-600 hover:text-blue-600 transition`}
            >
              {showPassword ? <FaRegEyeSlash /> : <FiEye />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              {t("auth.register.confirm_password")}
            </label>
            <input
              type={showConfirm ? "text" : "password"}
              required
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className={`w-full px-6 py-5 ${
                isRTL ? "pr-14" : "pl-14"
              } rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-lg`}
              placeholder={t("auth.register.confirm_placeholder")}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className={`absolute top-[58px] ${
                isRTL ? "left-6" : "right-6"
              } text-2xl text-gray-600 hover:text-blue-600 transition`}
            >
              {showConfirm ? <FaRegEyeSlash /> : <FiEye />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-blue-600 to-indigo-700 text-white py-6 rounded-xl text-2xl font-bold hover:from-blue-700 hover:to-indigo-800 transition transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed shadow-2xl"
          >
            {loading ? t("auth.register.loading") : t("auth.register.submit")}
          </button>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 p-8 text-center">
          <p className="text-gray-700 text-lg">
            {t("auth.register.has_account")}{" "}
            <Link
              to="/login"
              className="text-blue-600 font-bold hover:underline transition"
            >
              {t("auth.register.login_link")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
