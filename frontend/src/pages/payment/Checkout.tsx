/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStore } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useToast } from "../../context/ToastContext";
import StripePaymentForm from "../../components/StripePaymentForm";
import { useTranslation } from "react-i18next";
import { formatPrice } from "../../utils/formatPrice";
import { useCheckoutSchema, type CheckoutFormData } from "../../validation/checkoutSchemas";
import { useState } from "react";

export default function Checkout() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const lang = i18n.language;

  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);

  const schema = useCheckoutSchema();

  const {
    register,
    formState: { errors },
    watch,
    trigger, // ← لتفعيل التحقق يدويًا
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      phone: "",
      address: "",
      city: "",
    },
    mode: "onChange", // التحقق فوري مع كل كتابة
  });

  const totalPrice =
    state.cart.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0) + 50;

  const handleStripeSuccess = async (paymentIntentId: string) => {
    // 1. تحقق يدوي من البيانات الشخصية قبل أي دفع
    const isValid = await trigger(); // يفعل كل الـ validation

    if (!isValid) {
      showToast(t("checkout.fill_all_fields_correctly"), "error");
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

      // الرسالة "تم الدفع بنجاح" تظهر هنا فقط بعد نجاح الطلب كامل
      showToast(t("checkout.payment_success"), "success");
      navigate(`/payment-success?orderId=${res.data.order._id}`);
    } catch (err: any) {
      const message =
        err.response?.data?.message || t("checkout.order_failed");
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (state.cart.length === 0) {
    return <div className="text-center py-20 text-3xl">{t("cart.empty")}</div>;
  }

  return (
    <div
      className="min-h-screen bg-gray-50 py-10 relative"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="text-white text-3xl">{t("checkout.processing")}</div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-5xl font-bold text-center mb-12">
          {t("checkout.title")}
        </h1>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Order Summary */}
          <div className="bg-white p-8 rounded-3xl shadow-xl">
            <h2 className="text-3xl font-bold mb-6">
              {t("checkout.order_summary")}
            </h2>
            {state.cart.map((item) => (
              <div
                key={item._id}
                className="flex justify-between py-3 border-b border-gray-200"
              >
                <span>
                  {item.name} × {item.quantity || 1}
                </span>
                <span className="font-bold">
                  {formatPrice(item.price * (item.quantity || 1), lang)}
                </span>
              </div>
            ))}
            <div className="flex justify-between text-md font-bold mt-6 pt-6">
              <span>{t("checkout.delivery_fee")}</span>
              {formatPrice(50, lang)}
            </div>
            <div className="flex justify-between text-3xl font-bold mt-10 text-blue-600">
              <span>{t("checkout.total")}</span>
              <span>{formatPrice(totalPrice, lang)}</span>
            </div>
          </div>

          {/* Delivery Form + Payment */}
          <div className="bg-white p-8 rounded-3xl shadow-xl">
            <h2 className="text-3xl font-bold mb-6">
              {t("checkout.delivery_info")}
            </h2>

            <div className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block mb-2 font-semibold">
                  {t("checkout.full_name")}
                </label>
                <input
                  {...register("fullName")}
                  type="text"
                  className="w-full p-4 border rounded-xl focus:border-blue-500 outline-none"
                />
                {errors.fullName && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block mb-2 font-semibold">
                  {t("checkout.phone")}
                </label>
                <input
                  {...register("phone")}
                  type="tel"
                  className="w-full p-4 border rounded-xl focus:border-blue-500 outline-none"
                />
                {errors.phone && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block mb-2 font-semibold">
                  {t("checkout.address")}
                </label>
                <input
                  {...register("address")}
                  type="text"
                  className="w-full p-4 border rounded-xl focus:border-blue-500 outline-none"
                />
                {errors.address && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block mb-2 font-semibold">
                  {t("checkout.city")}
                </label>
                <input
                  {...register("city")}
                  type="text"
                  className="w-full p-4 border rounded-xl focus:border-blue-500 outline-none"
                />
                {errors.city && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.city.message}
                  </p>
                )}
              </div>

              {/* Stripe Payment */}
              <div className="mt-8">
                <h3 className="text-2xl font-bold mb-4 text-center">
                  {t("checkout.card_payment")}
                </h3>

                <StripePaymentForm
                  totalAmount={totalPrice}
                  orderData={{
                    orderItems: state.cart.map((item) => ({
                      name: item.name,
                      qty: item.quantity || 1,
                      image: item.image,
                      price: item.price,
                      product: item._id,
                    })),
                    shippingAddress: watch(),
                  }}
                  onSuccess={handleStripeSuccess}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}