/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import { FaRegEyeSlash } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useLoginSchema, type LoginFormData } from "../validation/authSchemas";
import { useState } from "react";

export default function Login() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { dispatch } = useStore();
  const { showToast } = useToast();
  const isRTL = i18n.language === "ar";

  const [showPassword, setShowPassword] = useState(false);

  const schema = useLoginSchema(); // الـ schema الديناميكي حسب اللغة

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await api.post("/auth/login", data);

      localStorage.setItem("token", res.data.token);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });

      showToast(t("auth.success.login"), "success");
      navigate("/");
    } catch (err: any) {
      const message =
        err.response?.data?.message || t("auth.errors.login_failed");
      showToast(message, "error");
    }
  };

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-linear-to-br from-indigo-50 to-purple-100 flex items-center justify-center py-12 px-4"
    >
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-indigo-600 to-purple-700 p-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            {t("auth.login.title")}
          </h1>
          <p className="text-indigo-100 text-xl font-medium">
            {t("auth.login.subtitle")}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-8">
          {/* Email */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              {t("auth.login.email")}
            </label>
            <input
              {...register("email")}
              type="email"
              className="w-full px-6 py-5 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition text-lg"
              placeholder={t("auth.login.email_placeholder")}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-2">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              {t("auth.login.password")}
            </label>
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              className={`w-full px-6 py-5 ${
                isRTL ? "pr-14" : "pl-14"
              } rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition text-lg`}
              placeholder={t("auth.login.password_placeholder")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute top-[58px] ${
                isRTL ? "left-6" : "right-6"
              } text-2xl text-gray-600 hover:text-indigo-600 transition`}
            >
              {showPassword ? <FaRegEyeSlash /> : <FiEye />}
            </button>
            {errors.password && (
              <p className="text-red-600 text-sm mt-2">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-linear-to-r from-indigo-600 to-purple-700 text-white py-6 rounded-xl text-2xl font-bold hover:from-indigo-700 hover:to-purple-800 transition transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed shadow-2xl"
          >
            {isSubmitting ? t("auth.login.loading") : t("auth.login.submit")}
          </button>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 p-8 text-center">
          <p className="text-gray-700 text-lg">
            {t("auth.login.no_account")}{" "}
            <Link
              to="/register"
              className="text-indigo-600 font-bold hover:underline transition"
            >
              {t("auth.login.create_account")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
