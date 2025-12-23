/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import { FiEye } from "react-icons/fi";
import { FaRegEyeSlash } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import {
  useRegisterSchema,
  type RegisterFormData,
} from "../validation/authSchemas";
import { useState } from "react";

export default function Register() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { dispatch } = useStore();
  const { showToast } = useToast();
  const isRTL = i18n.language === "ar";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const schema = useRegisterSchema();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const res = await api.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      localStorage.setItem("token", res.data.token);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });

      showToast(t("auth.success.register"), "success");
      navigate("/");
    } catch (err: any) {
      const message =
        err.response?.data?.message || t("auth.errors.register_failed");
      showToast(message, "error");
    }
  };

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4"
    >
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
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
        <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              {t("auth.register.name")}
            </label>
            <input
              {...register("name")}
              type="text"
              className="w-full px-6 py-5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-lg"
              placeholder={t("auth.register.name_placeholder")}
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-2">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              {t("auth.register.email")}
            </label>
            <input
              {...register("email")}
              type="email"
              className="w-full px-6 py-5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-lg"
              placeholder={t("auth.register.email_placeholder")}
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
              {t("auth.register.password")}
            </label>
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
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
            {errors.password && (
              <p className="text-red-600 text-sm mt-2">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              {t("auth.register.confirm_password")}
            </label>
            <input
              {...register("confirmPassword")}
              type={showConfirm ? "text" : "password"}
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
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm mt-2">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-linear-to-r from-blue-600 to-indigo-700 text-white py-6 rounded-xl text-2xl font-bold hover:from-blue-700 hover:to-indigo-800 transition transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed shadow-2xl"
          >
            {isSubmitting
              ? t("auth.register.loading")
              : t("auth.register.submit")}
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
