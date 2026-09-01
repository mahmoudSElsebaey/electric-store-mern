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
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const DEMO = [
  { role: "Owner", email: "owner@gmail.com", password: "owner123" },
];

export default function Login() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { dispatch } = useStore();
  const { showToast } = useToast();
  const isRTL = i18n.language === "ar";

  const [showPassword, setShowPassword] = useState(false);

  const schema = useLoginSchema();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "owner@gmail.com",
      password: "owner123",
    },
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

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const res = await api.post("/auth/google", {
        credential: credentialResponse.credential,
      });

      localStorage.setItem("token", res.data.token);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });

      showToast(t("auth.success.google_login"), "success");
      navigate("/");
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        t("auth.errors.google_login_failed") ||
        "فشل تسجيل الدخول بحساب جوجل";
      showToast(message, "error");
    }
  };

  const handleGoogleError = () => {
    showToast(t("auth.errors.google_error") || "حدث خطأ مع جوجل", "error");
  };

  const fillDemo = (acc: (typeof DEMO)[0]) => {
    setValue("email", acc.email, { shouldValidate: true });
    setValue("password", acc.password, { shouldValidate: true });
  };

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-gradient-to-br from-teal-50 to-slate-100 flex items-center justify-center py-12 px-4"
    >
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-teal-600 to-teal-800 p-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            {t("auth.login.title")}
          </h1>
          <p className="text-teal-100 text-xl font-medium">
            {t("auth.login.subtitle")}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-8">
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              {t("auth.login.email")}
            </label>
            <input
              {...register("email")}
              type="email"
              className="w-full px-6 py-5 rounded-xl border border-gray-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition text-lg"
              placeholder={t("auth.login.email_placeholder")}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-2">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="relative">
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              {t("auth.login.password")}
            </label>
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              className={`w-full px-6 py-5 ${
                isRTL ? "pr-14" : "pl-14"
              } rounded-xl border border-gray-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition text-lg`}
              placeholder={t("auth.login.password_placeholder")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute top-[58px] ${
                isRTL ? "left-6" : "right-6"
              } text-2xl text-gray-600 hover:text-teal-700 transition`}
            >
              {showPassword ? <FaRegEyeSlash /> : <FiEye />}
            </button>
            {errors.password && (
              <p className="text-red-600 text-sm mt-2">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-teal-600 to-teal-800 text-white py-6 rounded-xl text-2xl font-bold hover:from-teal-700 hover:to-teal-900 transition transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed shadow-2xl"
          >
            {isSubmitting ? t("auth.login.loading") : t("auth.login.submit")}
          </button>

          {/* Demo / test accounts */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Test accounts
            </p>
            {DEMO.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => fillDemo(acc)}
                className="w-full text-start rounded-xl border border-teal-200 bg-teal-50/80 px-4 py-3 text-sm hover:border-teal-400 hover:bg-teal-50 transition"
              >
                <span className="font-semibold text-teal-700">{acc.role}</span>
                <p className="mt-0.5 font-mono text-xs text-gray-600">{acc.email}</p>
                <p className="font-mono text-xs text-gray-500">{acc.password}</p>
              </button>
            ))}
          </div>

          <div className="mt-2">
            <GoogleOAuthProvider
              clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
            >
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                text="continue_with"
                shape="rectangular"
                size="large"
                width="100%"
                theme="outline"
              />
            </GoogleOAuthProvider>
          </div>
        </form>

        <div className="bg-gray-50 p-8 text-center">
          <p className="text-gray-700 text-lg">
            {t("auth.login.no_account")}{" "}
            <Link
              to="/register"
              className="text-teal-700 font-bold hover:underline transition"
            >
              {t("auth.login.create_account")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
