import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { useTranslation } from "react-i18next";
import { FaCheckCircle, FaHome, FaStore, FaReceipt } from "react-icons/fa";

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
      showToast(
        t("payment_success.error", {
          defaultValue: "حدث خطأ في عرض رقم الطلب",
        }),
        "error"
      );
      navigate("/cart");
    }
  }, [orderId, navigate, showToast, t]);

  if (!orderId) return null;

  return (
    <div
      className="min-h-[70vh] flex flex-col items-center justify-center bg-surface px-4 py-12"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-lg rounded-3xl bg-white border border-primary/10 shadow-xl overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary" />

        <div className="p-8 sm:p-10 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary-soft text-primary">
            <FaCheckCircle className="text-4xl" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink mb-2">
            {t("payment_success.title", { defaultValue: "تم الدفع بنجاح" })}
          </h1>
          <p className="text-muted text-sm sm:text-base mb-8">
            {t("payment_success.thanks", { defaultValue: "شكراً لتسوقك من" })}{" "}
            <span className="font-bold text-primary">
              {t("footer.store_name", { defaultValue: "فولت ستور" })}
            </span>
          </p>

          <div className="rounded-2xl bg-primary-soft/40 border border-primary/10 px-5 py-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-muted text-sm mb-1">
              <FaReceipt />
              <span>
                {t("payment_success.order_number", {
                  defaultValue: "رقم الطلب",
                })}
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-extrabold text-primary tabular-nums break-all">
              {orderId}
            </p>
          </div>

          <p className="text-sm text-muted mb-8 leading-relaxed">
            {t("payment_success.contact_soon", {
              defaultValue:
                "سنتواصل معك قريباً لتأكيد الشحن. يمكنك متابعة طلبك من حسابك.",
            })}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/store"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold py-3 transition shadow-md"
            >
              <FaStore />
              {t("payment_success.back_store", {
                defaultValue: "متابعة التسوق",
              })}
            </Link>
            <Link
              to="/"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-white text-primary font-bold py-3 hover:bg-primary-soft transition"
            >
              <FaHome />
              {t("payment_success.home", { defaultValue: "الرئيسية" })}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
