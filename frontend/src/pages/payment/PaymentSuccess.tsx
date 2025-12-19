import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { useTranslation } from "react-i18next";

export default function PaymentSuccess() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const params = new URLSearchParams(location.search);
  const orderId = params.get("orderId");

  useEffect(() => {
    if (!orderId) {
      showToast(t("payment_success.error", { defaultValue: "حدث خطأ في عرض رقم الطلب" }), "error");
      navigate("/cart");
    }
  }, [orderId, navigate, showToast, t]);

  if (!orderId) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gray-50" dir={isRTL ? "rtl" : "ltr"}>
      <div className="bg-white p-12 rounded-3xl shadow-2xl max-w-lg">
        <h1 className="text-5xl font-bold text-green-600 mb-8">{t("payment_success.title")}</h1>
        <p className="text-2xl text-gray-700 mb-4">
          {t("payment_success.thanks")} <span className="font-bold text-blue-600">{t("footer.store_name")}</span>
        </p>
        <p className="text-3xl font-bold text-gray-800 mb-10">
          {t("payment_success.order_number")}: <span className="text-blue-600">{orderId}</span>
        </p>
        <p className="text-lg text-gray-600 mb-10">{t("payment_success.contact_soon")}</p>

        <div className="flex flex-col sm:flex-row gap-6 justify-between mt-10">
          <Link to="/store" className="text-xl text-blue-600 hover:underline cursor-pointer">
            {t("payment_success.back_store")}
          </Link>
          <Link to="/" className="text-xl text-blue-600 hover:underline cursor-pointer">
            {t("payment_success.home")}
          </Link>
        </div>
      </div>
    </div>
  );
}