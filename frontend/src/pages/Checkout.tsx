/* eslint-disable @typescript-eslint/no-explicit-any */
 
import { useState } from "react";
import { useStore } from "../context/StoreContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import StripePaymentForm from "../components/StripePaymentForm";

export default function Checkout() {
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

  // التحقق من اكتمال البيانات
  const isFormValid =
    formData.fullName.trim() &&
    formData.phone.trim() &&
    formData.address.trim() &&
    formData.city.trim();

  // دالة تنفيذ الطلب بعد نجاح الدفع بـ Stripe
  const handleStripeSuccess = async (paymentIntentId: string) => {
    if (!isFormValid) {
      showToast("برجاء إكمال بيانات التوصيل أولاً", "error");
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
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
        },
        paymentMethod: "stripe",
        paymentIntentId,
      });

      // تفريغ السلة
      dispatch({ type: "LOAD_CART", payload: [] });
      localStorage.removeItem("cart");

      showToast("تم الدفع وإنشاء الطلب بنجاح! ✅", "success");
      navigate(`/payment-success?orderId=${res.data.order._id}`);
    } catch (err: any) {
      showToast(
        err.response?.data?.message || "فشل إنشاء الطلب بعد الدفع",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (state.cart.length === 0) {
    return <div className="text-center py-20 text-3xl">السلة فارغة</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 relative">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="text-white text-3xl">جاري المعالجة...</div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-5xl font-bold text-center mb-12">إتمام الشراء</h1>

        <div className="grid md:grid-cols-2 gap-10">
          {/* ملخص الطلب */}
          <div className="bg-white p-8 rounded-3xl shadow-xl">
            <h2 className="text-3xl font-bold mb-6">ملخص الطلب</h2>
            {state.cart.map((item) => (
              <div
                key={item._id}
                className="flex justify-between py-3 border-b"
              >
                <span>
                  {item.name} × {item.quantity || 1}
                </span>
                <span className="font-bold">
                  {(item.price * (item.quantity || 1)).toLocaleString()} ج.م
                </span>
              </div>
            ))}
            <div className="flex justify-between text-xl font-bold mt-6 pt-6 border-t">
              <span>التوصيل</span>
              <span>50 ج.م</span>
            </div>
            <div className="flex justify-between text-3xl font-bold mt-4 text-blue-600">
              <span>الإجمالي</span>
              <span>{totalPrice.toLocaleString()} ج.م</span>
            </div>
          </div>

          {/* نموذج التوصيل + الدفع بـ Stripe */}
          <div className="bg-white p-8 rounded-3xl shadow-xl">
            <h2 className="text-3xl font-bold mb-6">بيانات التوصيل</h2>

            <input
              type="text"
              placeholder="الاسم الكامل"
              required
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="w-full p-4 border rounded-xl mb-4 focus:border-blue-500 outline-none"
            />

            <input
              type="tel"
              placeholder="رقم الهاتف"
              required
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full p-4 border rounded-xl mb-4 focus:border-blue-500 outline-none"
            />

            <input
              type="text"
              placeholder="العنوان بالتفصيل"
              required
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full p-4 border rounded-xl mb-4 focus:border-blue-500 outline-none"
            />

            <input
              type="text"
              placeholder="المدينة"
              required
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              className="w-full p-4 border rounded-xl mb-6 focus:border-blue-500 outline-none"
            />

            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-4 text-center">
                الدفع ببطاقة بنكية (آمن 100%)
              </h3>
              <p className="text-gray-600 text-center mb-6">
                ندعم Visa و MasterCard و Meeza
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
