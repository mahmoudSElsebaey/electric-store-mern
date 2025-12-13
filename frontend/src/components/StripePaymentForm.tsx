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

interface Props {
  totalAmount: number;
  orderData: any;
  onSuccess: (paymentIntentId: string) => void;
}

const PaymentForm = ({ totalAmount, onSuccess }: Props) => {
  const stripe = useStripe();
  const elements = useElements();
  const { showToast } = useToast();
  const [processing, setProcessing] = useState(false);

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
        showToast(result.error.message || "فشل الدفع", "error");
      } else if (result.paymentIntent?.status === "succeeded") {
        showToast("تم الدفع بنجاح! ✅", "success");
        onSuccess(result.paymentIntent.id);
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || "خطأ في الدفع", "error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
        className="w-full bg-green-600 hover:bg-green-700 text-white py-6 rounded-xl text-2xl font-bold disabled:opacity-50 transition"
      >
        {processing
          ? "جاري الدفع..."
          : `ادفع ${totalAmount.toLocaleString()} ج.م`}
      </button>
    </form>
  );
};

const StripePaymentForm = ({ totalAmount,   onSuccess }: Props) => (
  <Elements stripe={stripePromise}>
    <PaymentForm totalAmount={totalAmount} onSuccess={onSuccess} orderData={undefined} />
  </Elements>
);

export default StripePaymentForm;
