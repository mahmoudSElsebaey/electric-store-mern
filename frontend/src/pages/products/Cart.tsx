import { useStore } from "../../context/StoreContext";
import { useToast } from "../../context/ToastContext";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaCreditCard, FaShieldAlt } from "react-icons/fa";
import { GoZap } from "react-icons/go";
import { FaTruckFast } from "react-icons/fa6";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";
import { formatPrice } from "../../utils/formatPrice";

export default function Cart() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const lang = i18n.language;

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
      showToast(
        t("cart.out_of_stock_qty", { stock: item.countInStock }),
        "error"
      );
      return;
    }
    dispatch({ type: "INCREASE_QTY", payload: id });
  };

  const decreaseQuantity = (id: string) =>
    dispatch({ type: "DECREASE_QTY", payload: id });

  const goToCheckout = () => {
    if (cart.length === 0) {
      showToast(t("cart.empty"), "error");
      return;
    }
    navigate("/checkout");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="text-2xl text-gray-600">
          {t("cart.login_required", {
            defaultValue: "يجب تسجيل الدخول لعرض السلة",
          })}
        </span>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative bg-linear-to-br from-blue-900 via-indigo-900 to-purple-900 text-white py-32 overflow-hidden"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight flex items-center justify-center gap-6">
            <FaShoppingCart className="text-6xl md:text-8xl" />
            {t("cart.hero_title")}
          </h1>
          <p className="text-xl md:text-3xl font-light max-w-4xl mx-auto leading-relaxed">
            {t("cart.hero_subtitle")}
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-8 md:gap-12 text-lg">
            <div className="flex items-center gap-3">
              <GoZap className="w-10 h-10 text-yellow-400" />
              <span>{t("cart.secure_payment")}</span>
            </div>
            <div className="flex items-center gap-3">
              <FaTruckFast className="w-10 h-10 text-yellow-400" />
              <span>{t("cart.fast_delivery")}</span>
            </div>
            <div className="flex items-center gap-3">
              <FaShieldAlt className="w-10 h-10 text-yellow-400" />
              <span>{t("cart.genuine_warranty")}</span>
            </div>
            <div className="flex items-center gap-3">
              <FaCreditCard className="w-10 h-10 text-yellow-400" />
              <span>{t("cart.installments")}</span>
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

      {/* Cart Content */}
      <div
        className="min-h-screen bg-gray-50 py-12"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-5xl mx-auto px-6">
          {cart.length === 0 ? (
            <div className="text-center py-32">
              <h1 className="text-5xl font-bold text-gray-800 mb-8">
                {t("cart.empty")}
              </h1>
              <Link
                to="/store"
                className="text-2xl text-blue-600 hover:underline"
              >
                {t("cart.go_shopping")}
              </Link>
            </div>
          ) : (
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
                  {/* <div className="flex-1">
                    <h3 className="text-2xl font-bold">{item.name}</h3>
                    <p className="text-gray-600">
                      {item.brand?.name || item.brand}
                    </p>
                    <p className="text-gray-600">
                      {item.category?.name || item.category}
                    </p>
                  </div> */}
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
                    {/* <div className="text-3xl font-bold text-blue-600">
                      {(
                        (item.price || 0) * (item.quantity || 1)
                      ).toLocaleString()}
                      ج.م
                    </div> */}
                    <div className="text-3xl font-bold text-blue-600">
                      {formatPrice(
                        (item.price || 0) * (item.quantity || 1),
                        lang
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition text-xl"
                  >
                    {t("cart.remove")}
                  </button>
                </div>
              ))}

              <div className="mt-12 text-right">
                {/* <div className="text-4xl font-bold text-gray-800 mb-8">
                  {t("cart.total_with_delivery")}:
                  <span className="text-blue-600">
                    {totalPrice.toLocaleString()} ج.م
                  </span>
                </div> */}
                <div className="text-4xl font-bold text-gray-800 mb-8 flex justify-between items-center gap-4">
                  {t("cart.total_with_delivery")}
                  <span className="text-blue-600">
                    {formatPrice(totalPrice, lang)}
                  </span>
                </div>
                <button
                  onClick={goToCheckout}
                  className="bg-green-600 text-white text-3xl px-16 py-6 rounded-2xl hover:bg-green-700 transition font-bold shadow-2xl"
                >
                  {t("cart.checkout")}
                </button>
              </div>

              <div className="text-center mt-12">
                <Link
                  to="/store"
                  className="text-2xl text-blue-600 hover:underline"
                >
                  {t("cart.continue_shopping")}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
