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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-20">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
            {t("cart.login_required")}
          </h2>
          <Link
            to="/login"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-xl text-lg sm:text-xl font-bold transition"
          >
            {t("cart.login_now")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white py-16 sm:py-24 md:py-32 lg:py-40 overflow-hidden"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight flex items-center justify-center gap-4 sm:gap-6">
            <FaShoppingCart className="text-5xl sm:text-6xl md:text-8xl" />
            {t("cart.hero_title")}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-12">
            {t("cart.hero_subtitle")}
          </p>

          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 text-base sm:text-lg md:text-xl">
            <div className="flex items-center gap-2 sm:gap-3">
              <GoZap className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" />
              <span>{t("cart.secure_payment")}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <FaTruckFast className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" />
              <span>{t("cart.fast_delivery")}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <FaShieldAlt className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" />
              <span>{t("cart.genuine_warranty")}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <FaCreditCard className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" />
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
        className="min-h-screen bg-gray-50 py-12 sm:py-16 md:py-20"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {cart.length === 0 ? (
            <div className="text-center py-20 sm:py-32">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6">
                {t("cart.empty")}
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-8">
                {t("cart.empty_desc")}
              </p>
              <Link
                to="/store"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-xl text-lg sm:text-xl font-bold transition transform hover:scale-105"
              >
                {t("cart.go_shopping")}
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 lg:p-10">
              <div className="space-y-6 sm:space-y-8">
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 py-6 border-b last:border-0"
                  >
                    {/* صورة المنتج */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-xl"
                    />

                    {/* معلومات المنتج */}
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 mt-1">
                        {typeof item.brand === "string"
                          ? item.brand
                          : item.brand?.name}
                      </p>
                      <p className="text-sm sm:text-base text-gray-600">
                        {typeof item.category === "string"
                          ? item.category
                          : item.category?.name}
                      </p>
                    </div>

                    {/* الكمية + السعر */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 mt-4 sm:mt-0">
                      <div className="flex items-center gap-3 text-lg">
                        <button
                          onClick={() => decreaseQuantity(item._id)}
                          className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                        >
                          -
                        </button>
                        <span className="text-xl sm:text-2xl font-bold w-10 sm:w-12 text-center">
                          {item.quantity || 1}
                        </span>
                        <button
                          onClick={() => increaseQuantity(item._id)}
                          disabled={(item.quantity || 1) >= item.countInStock}
                          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition ${
                            (item.quantity || 1) >= item.countInStock
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-gray-200 hover:bg-gray-300"
                          }`}
                        >
                          +
                        </button>
                      </div>

                      <div className="text-xl sm:text-2xl font-bold text-blue-600 whitespace-nowrap">
                        {formatPrice(
                          (item.price || 0) * (item.quantity || 1),
                          lang
                        )}
                      </div>
                    </div>

                    {/* زر الحذف */}
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="bg-red-600 px-4 sm:px-4 py-2 cursor-pointer rounded-lg hover:bg-red-700 text-white text-lg sm:text-xl font-medium mt-4 sm:mt-0"
                    >
                      {t("cart.remove")}
                    </button>
                  </div>
                ))}
              </div>

              {/* الإجمالي + الدفع */}
              <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-center sm:items-start gap-6 sm:gap-0">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
                    {t("cart.total_with_delivery")}:
                    <span className="text-blue-600 mr-3">
                      {formatPrice(totalPrice, lang)}
                    </span>
                  </div>

                  <button
                    onClick={goToCheckout}
                    className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white text-xl 
                    sm:text-2xl px-10 sm:px-12 py-4 sm:py-5 my-5 md:my-0 cursor-pointer rounded-2xl font-bold transition transform hover:scale-105 shadow-xl"
                  >
                    {t("cart.checkout")}
                  </button>
                </div>

                <div className="text-center mt-8">
                  <Link
                    to="/store"
                    className="text-lg sm:text-xl text-blue-600 hover:underline"
                  >
                    {t("cart.continue_shopping")}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
