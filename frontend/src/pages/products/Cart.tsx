import { useStore } from "../../context/StoreContext";
import { useToast } from "../../context/ToastContext";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
   
  FaCreditCard,
  FaShieldAlt,
} from "react-icons/fa";
import { GoZap } from "react-icons/go";
import { FaTruckFast } from "react-icons/fa6";
import Footer from "../../components/Footer";

export default function Cart() {
  const { state, dispatch } = useStore();
  const { cart, isAuthenticated } = state;
  const { showToast } = useToast();
  const navigate = useNavigate();

  const totalPrice =
    cart.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    ) + 50;

  const removeFromCart = (id: string) =>
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
  const increaseQuantity = (id: string) => {
    const item = cart.find((i) => i._id === id);
    if (item && (item.quantity || 1) >= item.countInStock) {
      showToast(`الكمية المتاحة فقط ${item.countInStock} وحدة`, "error");
      return;
    }
    dispatch({ type: "INCREASE_QTY", payload: id });
  };
  const decreaseQuantity = (id: string) =>
    dispatch({ type: "DECREASE_QTY", payload: id });

  const goToCheckout = () => {
    if (cart.length === 0) {
      showToast("السلة فارغة!", "error");
      return;
    }
    navigate("/checkout");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="text-2xl text-gray-600">
          يجب تسجيل الدخول لعرض السلة
        </span>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section للسلة */}
      <section className="relative bg-linear-to-br from-blue-900 via-indigo-900 to-purple-900 text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight flex items-center justify-center gap-6">
            <FaShoppingCart className="text-6xl md:text-8xl" />
            سلة التسوق
          </h1>
          <p className="text-xl md:text-3xl font-light max-w-4xl mx-auto leading-relaxed">
            راجع مشترياتك وأكمل عملية الدفع بأمان وسرعة
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-8 md:gap-12 text-lg">
            <div className="flex items-center gap-3">
              <GoZap className="w-10 h-10 text-yellow-400" />
              <span>دفع آمن</span>
            </div>
            <div className="flex items-center gap-3">
              <FaTruckFast className="w-10 h-10 text-yellow-400" />
              <span>توصيل سريع</span>
            </div>
            <div className="flex items-center gap-3">
              <FaShieldAlt className="w-10 h-10 text-yellow-400" />
              <span>ضمان أصلي</span>
            </div>
            <div className="flex items-center gap-3">
              <FaCreditCard className="w-10 h-10 text-yellow-400" />
              <span>تقسيط مريح</span>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full">
            <path
              fill="#f9fafb"
              d="M0,0 C300,100 600,0 1440,80 L1440,120 L0,120 Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* محتوى السلة */}
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-6">
          {cart.length === 0 ? (
            <div className="text-center py-32">
              <h1 className="text-5xl font-bold text-gray-800 mb-8">
                السلة فارغة 🛒
              </h1>
              <Link
                to="/store"
                className="text-2xl text-blue-600 hover:underline"
              >
                ← اذهب للتسوق الآن
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-6 py-6 border-b last:border-0"
                  dir="rtl"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-32 h-32 object-cover rounded-xl"
                  />
                  <div className="flex-1 text-right">
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

                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-3 text-xl">
                      <button
                        onClick={() => decreaseQuantity(item._id)}
                        className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="text-2xl font-bold w-12 text-center">
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() => increaseQuantity(item._id)}
                        disabled={(item.quantity || 1) >= item.countInStock}
                        className={`px-4 py-2 rounded-xl transition ${
                          (item.quantity || 1) >= item.countInStock
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        +
                      </button>
                    </div>
                    <div className="text-3xl font-bold text-blue-600">
                      {(
                        (item.price || 0) * (item.quantity || 1)
                      ).toLocaleString()}{" "}
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
                  الإجمالي (شامل التوصيل):
                  <span className="text-blue-600">
                    {" "}
                    {totalPrice.toLocaleString()} ج.م
                  </span>
                </div>
                <button
                  onClick={goToCheckout}
                  className="bg-green-600 text-white text-3xl px-16 py-6 rounded-2xl hover:bg-green-700 transition font-bold shadow-2xl"
                >
                  إتمام الشراء 💳
                </button>
              </div>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/store"
              className="text-2xl text-blue-600 hover:underline"
            >
              ← استمر في التسوق
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
