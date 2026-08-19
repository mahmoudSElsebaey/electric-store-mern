/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStore } from "../../context/StoreContext";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useToast } from "../../context/ToastContext";
import StripePaymentForm from "../../components/StripePaymentForm";
import { useTranslation } from "react-i18next";
import { formatPrice } from "../../utils/formatPrice";
import {
  useCheckoutSchema,
  type CheckoutFormData,
} from "../../validation/checkoutSchemas";
import { useState } from "react";
import {
  FaMapMarkerAlt,
  FaCreditCard,
  FaShoppingBag,
  FaLock,
  FaTruck,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

const DELIVERY_FEE = 50;

export default function Checkout() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const lang = i18n.language;

  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const schema = useCheckoutSchema();
  const {
    register,
    formState: { errors },
    watch,
    trigger,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: "", phone: "", address: "", city: "" },
    mode: "onChange",
  });

  const subtotal = state.cart.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );
  const totalPrice = subtotal + DELIVERY_FEE;
  const itemCount = state.cart.reduce((n, i) => n + (i.quantity || 1), 0);

  const goToPayment = async () => {
    const ok = await trigger();
    if (!ok) {
      showToast(t("checkout.fill_all_fields_correctly"), "error");
      return;
    }
    setStep(2);
  };

  const handleStripeSuccess = async (paymentIntentId: string) => {
    const isValid = await trigger();
    if (!isValid) {
      showToast(t("checkout.fill_all_fields_correctly"), "error");
      setStep(1);
      return;
    }

    try {
      setLoading(true);
      const data = watch();
      const orderItems = state.cart.map((item) => ({
        name: item.name,
        qty: item.quantity || 1,
        image: item.image,
        price: item.price,
        product: item._id,
      }));

      const res = await api.post("/orders", {
        orderItems,
        shippingAddress: data,
        paymentMethod: "stripe",
        paymentIntentId,
      });

      dispatch({ type: "LOAD_CART", payload: [] });
      localStorage.removeItem("cart");
      showToast(t("checkout.payment_success"), "success");
      navigate(`/payment-success?orderId=${res.data.order._id}`);
    } catch (err: any) {
      const message = err.response?.data?.message || t("checkout.order_failed");
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (state.cart.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center bg-surface px-4">
        <FaShoppingBag className="text-4xl text-muted mb-4" />
        <p className="text-xl font-bold text-ink mb-4">{t("cart.empty")}</p>
        <Link
          to="/store"
          className="rounded-xl bg-primary px-6 py-3 font-bold text-white hover:bg-primary-dark transition"
        >
          {t("cart.continue_shopping")}
        </Link>
      </div>
    );
  }

  const fieldCls =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition";
  const errCls = "text-red-500 text-xs mt-1";

  return (
    <div className="min-h-screen bg-surface relative" dir={isRTL ? "rtl" : "ltr"}>
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="rounded-2xl bg-white px-8 py-6 text-center shadow-xl">
            <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="font-bold text-ink">{t("checkout.processing")}</p>
          </div>
        </div>
      )}

      <section className="bg-gradient-to-br from-primary-dark via-primary to-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-6">{t("checkout.title")}</h1>
          <div className="flex items-center gap-3 sm:gap-6">
            <button
              type="button"
              onClick={() => setStep(1)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
                step === 1 ? "bg-white text-primary" : "bg-white/10 text-white/80 hover:bg-white/15"
              }`}
            >
              <FaMapMarkerAlt />
              <span>1. {t("checkout.delivery_info")}</span>
            </button>
            <div className="h-px flex-1 max-w-12 bg-white/20" />
            <div
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${
                step === 2 ? "bg-white text-primary" : "bg-white/10 text-white/80"
              }`}
            >
              <FaCreditCard />
              <span>2. {t("checkout.payment", { defaultValue: "الدفع" })}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-7 space-y-6">
            {step === 1 && (
              <div className="rounded-3xl bg-white border border-primary/10 shadow-sm p-5 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <FaMapMarkerAlt />
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-ink">{t("checkout.delivery_info")}</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block mb-1.5 text-sm font-semibold text-ink">{t("checkout.full_name")}</label>
                    <input {...register("fullName")} className={fieldCls} />
                    {errors.fullName && <p className={errCls}>{errors.fullName.message}</p>}
                  </div>
                  <div>
                    <label className="block mb-1.5 text-sm font-semibold text-ink">{t("checkout.phone")}</label>
                    <input {...register("phone")} className={fieldCls} />
                    {errors.phone && <p className={errCls}>{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className="block mb-1.5 text-sm font-semibold text-ink">{t("checkout.city")}</label>
                    <input {...register("city")} className={fieldCls} />
                    {errors.city && <p className={errCls}>{errors.city.message}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block mb-1.5 text-sm font-semibold text-ink">{t("checkout.address")}</label>
                    <textarea {...register("address")} rows={3} className={fieldCls + " resize-none"} />
                    {errors.address && <p className={errCls}>{errors.address.message}</p>}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={goToPayment}
                  className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold px-8 py-3.5 transition shadow-md"
                >
                  {t("checkout.continue_payment", { defaultValue: "متابعة للدفع" })}
                  {isRTL ? <FaArrowLeft className="text-sm" /> : <FaArrowRight className="text-sm" />}
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="rounded-3xl bg-white border border-primary/10 shadow-sm p-5 sm:p-8">
                <div className="flex items-center justify-between gap-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                      <FaCreditCard />
                    </div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-ink">
                      {t("checkout.payment", { defaultValue: "الدفع" })}
                    </h2>
                  </div>
                  <button type="button" onClick={() => setStep(1)} className="text-sm font-semibold text-primary hover:underline">
                    {t("checkout.edit_address", { defaultValue: "تعديل العنوان" })}
                  </button>
                </div>

                <div className="mb-5 rounded-2xl bg-surface border border-primary/10 px-4 py-3 text-sm text-muted">
                  <p className="font-semibold text-ink mb-1">{watch("fullName")}</p>
                  <p>{watch("phone")} · {watch("city")}</p>
                  <p className="line-clamp-2">{watch("address")}</p>
                </div>

                <div className="rounded-2xl border border-primary/10 p-4">
                  <StripePaymentForm totalAmount={totalPrice} onSuccess={handleStripeSuccess} />
                </div>

                <p className="mt-4 flex items-center gap-2 text-xs text-muted">
                  <FaLock className="text-primary" />
                  {t("checkout.secure_note", { defaultValue: "معاملاتك محمية بتشفير آمن عبر Stripe" })}
                </p>
              </div>
            )}
          </div>

          <aside className="lg:col-span-5">
            <div className="sticky top-24 overflow-hidden rounded-3xl bg-white border border-primary/10 shadow-lg">
              <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />
              <div className="p-5 sm:p-6 space-y-4">
                <h3 className="text-lg font-extrabold text-ink flex items-center gap-2">
                  <FaShoppingBag className="text-primary" />
                  {t("checkout.order_summary")}
                </h3>

                <div className="max-h-56 overflow-y-auto space-y-3 pe-1">
                  {state.cart.map((item) => (
                    <div key={item._id} className="flex items-center gap-3">
                      <img src={item.image} alt="" className="h-14 w-14 rounded-xl object-contain bg-primary-soft/40 border border-primary/10" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-ink line-clamp-1">{item.name}</p>
                        <p className="text-xs text-muted">× {item.quantity || 1}</p>
                      </div>
                      <p className="text-sm font-bold text-primary tabular-nums shrink-0">
                        {formatPrice(item.price * (item.quantity || 1), lang)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-primary/10 pt-3 space-y-2 text-sm">
                  <div className="flex justify-between text-muted">
                    <span>{t("cart.subtotal", { defaultValue: "المجموع الفرعي" })} ({itemCount})</span>
                    <span className="font-semibold text-ink tabular-nums">{formatPrice(subtotal, lang)}</span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <FaTruck className="text-primary text-xs" />
                      {t("checkout.delivery_fee")}
                    </span>
                    <span className="font-semibold text-ink tabular-nums">{formatPrice(DELIVERY_FEE, lang)}</span>
                  </div>
                  <div className="rounded-2xl bg-primary-soft/40 border border-primary/10 px-4 py-3 flex justify-between items-center">
                    <span className="font-bold text-ink">{t("checkout.total")}</span>
                    <span className="text-xl font-extrabold text-primary tabular-nums">{formatPrice(totalPrice, lang)}</span>
                  </div>
                </div>

                <Link to="/cart" className="flex items-center justify-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark">
                  {isRTL ? <FaArrowRight className="text-xs" /> : <FaArrowLeft className="text-xs" />}
                  {t("checkout.back_cart", { defaultValue: "العودة للسلة" })}
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
