import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";

export default function Cart() {
  const { state, dispatch } = useStore();
  const { cart } = state;
  const { showToast } = useToast();
  const navigate = useNavigate();

  // حالة loading مؤقتة أثناء التحقق من تسجيل الدخول
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // تحقق من وجود token في localStorage أو session
    const token = localStorage.getItem("token"); // افترض أنك تحفظ توكن المستخدم هنا
    if (!token) {
      showToast("يجب تسجيل الدخول لعرض السلة!", "error");
      navigate("/login");
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false); // المستخدم مسجل دخول
    }
  }, [navigate, showToast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="text-2xl text-gray-600">جارٍ تحميل السلة...</span>
      </div>
    );
  }

  const removeFromCart = (id: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
  };

  const increaseQuantity = (id: string) => {
    dispatch({ type: "INCREASE_QTY", payload: id });
  };

  const decreaseQuantity = (id: string) => {
    dispatch({ type: "DECREASE_QTY", payload: id });
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-8">
          السلة فارغة 🛒
        </h1>
        <Link
          to="/store"
          className="text-2xl bg-blue-600 text-white px-10 py-5 rounded-xl hover:bg-blue-700 transition"
        >
          تصفح المنتجات
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-12 text-gray-800">
          سلة التسوق 🛒
        </h1>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-6 py-6 border-b last:border-0"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-32 h-32 object-cover rounded-xl"
              />
              <div className="flex-1">
                <h3 className="text-2xl font-bold">{item.name}</h3>
                <p className="text-gray-600">
                  {typeof item.brand === "string"
                    ? item.brand
                    : item.brand?.name}
                </p>
                <p className="text-gray-600">
                  {typeof item.category === "string"
                    ? item.category
                    : item.category?.name}
                </p>
              </div>

              {/* خيارات الكمية */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-xl">
                  <button
                    onClick={() => decreaseQuantity(item._id)}
                    className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold">
                    {item.quantity || 1}
                  </span>
                  <button
                    onClick={() => increaseQuantity(item._id)}
                    className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
                <div className="text-3xl font-bold text-blue-600 mt-2">
                  {((item.price || 0) * (item.quantity || 1)).toLocaleString()}{" "}
                  ج.م
                </div>
              </div>

              <button
                onClick={() => removeFromCart(item._id)}
                className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition text-xl"
              >
                حذف
              </button>
            </div>
          ))}

          <div className="mt-12 text-right">
            <div className="text-4xl font-bold text-gray-800 mb-8">
              الإجمالي:{" "}
              <span className="text-blue-600">
                {totalPrice.toLocaleString()} ج.م
              </span>
            </div>
            <button
              onClick={() => {
                showToast("جاري توجيهك لإتمام الشراء...", "success");
                // navigate("/checkout") لو عندك صفحة checkout
              }}
              className="bg-green-600 text-white text-3xl px-16 py-6 rounded-2xl hover:bg-green-700 transition font-bold"
            >
              إتمام الشراء 💳
            </button>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link to="/store" className="text-2xl text-blue-600 hover:underline">
            ← استمر في التسوق
          </Link>
        </div>
      </div>
    </div>
  );
}
