/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import stripePromise from "../utils/stripe";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import { useTranslation } from "react-i18next";
import { formatPrice } from "../utils/formatPrice"; // ← جديد

interface Props {
  totalAmount: number;
  orderData?: any; // اختياري لو مش مستخدم
  onSuccess: (paymentIntentId: string) => void;
}

const PaymentForm = ({ totalAmount, onSuccess }: Props) => {
  const { t, i18n } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const { showToast } = useToast();

  const [processing, setProcessing] = useState(false);
  const lang = i18n.language;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    try {
      const { data } = await api.post("/payments/create-payment-intent", {
        amount: Math.round(totalAmount * 100),
      });

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: cardElement },
      });

      if (result.error) {
        showToast(result.error.message || t("checkout.payment_failed", { defaultValue: "فشل الدفع" }), "error");
      } else if (result.paymentIntent?.status === "succeeded") {
        showToast(t("checkout.payment_success", { defaultValue: "تم الدفع بنجاح! ✅" }), "success");
        onSuccess(result.paymentIntent.id);
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || t("checkout.payment_error", { defaultValue: "خطأ في الدفع" }), "error");
    } finally {
      setProcessing(false);
    }
  };

  const buttonText = processing
    ? t("checkout.processing", { defaultValue: "جاري الدفع..." })
    : lang === "ar"
    ? `ادفع ${formatPrice(totalAmount, lang)}`
    : `Pay ${formatPrice(totalAmount, lang)}`;

  return (
    <form onSubmit={handleSubmit} dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="p-6 mb-6 bg-gray-50 border-2 border-gray-300 rounded-xl">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "18px",
                color: "#424770",
                "::placeholder": { color: "#aab7c4" },
              },
            },
          }}
        />
      </div>

      <button
        type="submit"
        disabled={processing || !stripe}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-6 rounded-xl text-2xl font-bold disabled:opacity-50 transition shadow-2xl"
      >
        {buttonText}
      </button>
    </form>
  );
};

const StripePaymentForm = ({ totalAmount, onSuccess }: Props) => (
  <Elements stripe={stripePromise}>
    <PaymentForm totalAmount={totalAmount} onSuccess={onSuccess} />
  </Elements>
);

export default StripePaymentForm;