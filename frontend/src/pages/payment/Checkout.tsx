/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useStore } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useToast } from "../../context/ToastContext";
import StripePaymentForm from "../../components/StripePaymentForm";
import { useTranslation } from "react-i18next";
import { formatPrice } from "../../utils/formatPrice";

export default function Checkout() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const lang = i18n.language;

  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
  });

  const totalPrice =
    state.cart.reduce(
      (acc, item) => acc + item.price * (item.quantity || 1),
      0
    ) + 50;

  const isFormValid =
    formData.fullName.trim() &&
    formData.phone.trim() &&
    formData.address.trim() &&
    formData.city.trim();

  const handleStripeSuccess = async (paymentIntentId: string) => {
    if (!isFormValid) {
      showToast(
        t("checkout.fill_info", {
          defaultValue: "برجاء إكمال بيانات التوصيل أولاً",
        }),
        "error"
      );
      return;
    }

    try {
      setLoading(true);

      const orderItems = state.cart.map((item) => ({
        name: item.name,
        qty: item.quantity || 1,
        image: item.image,
        price: item.price,
        product: item._id,
      }));

      const res = await api.post("/orders", {
        orderItems,
        shippingAddress: formData,
        paymentMethod: "stripe",
        paymentIntentId,
      });

      dispatch({ type: "LOAD_CART", payload: [] });
      localStorage.removeItem("cart");

      navigate(`/payment-success?orderId=${res.data.order._id}`);
    } catch (err: any) {
      showToast(
        err.response?.data?.message ||
          t("checkout.order_failed", {
            defaultValue: "فشل إنشاء الطلب بعد الدفع",
          }),
        "error"
      );
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
                {/* <span className="font-bold">
                  {(item.price * (item.quantity || 1)).toLocaleString()} ج.م
                </span> */}
                <span className="font-bold">
                  {formatPrice(item.price * (item.quantity || 1), lang)}
                </span>
              </div>
            ))}
            <div className="flex justify-between text-md font-bold mt-6 pt-6">
              <span>{t("checkout.delivery_fee")}</span>
              {/* <span>50 ج.م</span> */}
              {formatPrice(50, lang)}
            </div>
            <div className="flex justify-between text-3xl font-bold mt-10 text-blue-600">
              <span>{t("checkout.total")}</span>
              {/* <span>{totalPrice.toLocaleString()} ج.م</span> */}
              <span>{formatPrice(totalPrice, lang)}</span>
            </div>
          </div>

          {/* Delivery Form + Payment */}
          <div className="bg-white p-8 rounded-3xl shadow-xl">
            <h2 className="text-3xl font-bold mb-6">
              {t("checkout.delivery_info")}
            </h2>

            <input
              type="text"
              placeholder={t("checkout.full_name")}
              required
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="w-full p-4 border rounded-xl mb-4 focus:border-blue-500 outline-none"
            />

            <input
              type="tel"
              placeholder={t("checkout.phone")}
              required
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full p-4 border rounded-xl mb-4 focus:border-blue-500 outline-none"
            />

            <input
              type="text"
              placeholder={t("checkout.address")}
              required
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full p-4 border rounded-xl mb-4 focus:border-blue-500 outline-none"
            />

            <input
              type="text"
              placeholder={t("checkout.city")}
              required
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              className="w-full p-4 border rounded-xl mb-6 focus:border-blue-500 outline-none"
            />

            <div className="mt-4">
              <h3 className="text-2xl font-bold mb-4 text-center">
                {t("checkout.card_payment")}
              </h3>
              <p className="text-gray-600 text-center mb-6">
                <ul className="flex justify-center gap-5  ">
                  <li className=" text-blue-500">
                    <img
                      src="data:image/png;base64,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"
                      alt="Visa"
                      className="w-12 h-8  "
                    />
                  </li>
                  <li>
                    <img
                      src="data:image/png;base64,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"
                      alt="image"
                      className="w-12 h-8  "
                    />
                  </li>
                  <li>
                    <img
                      src="data:image/png;base64,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"
                      alt="fff"
                      className="w-12 h-8  "
                    />
                  </li>
                </ul>
              </p>

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
                  shippingAddress: formData,
                }}
                onSuccess={handleStripeSuccess}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
