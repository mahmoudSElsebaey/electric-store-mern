import { useStore } from "../../context/StoreContext";
import { useToast } from "../../context/ToastContext";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaTrash,
  FaMinus,
  FaPlus,
  FaArrowLeft,
  FaArrowRight,
  FaShieldAlt,
  FaTruck,
} from "react-icons/fa";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";
import { formatPrice } from "../../utils/formatPrice";

const DELIVERY_FEE = 50;

export default function Cart() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const lang = i18n.language;

  const { state, dispatch } = useStore();
  const { cart, isAuthenticated } = state;
  const { showToast } = useToast();
  const navigate = useNavigate();

  const subtotal = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );
  const totalPrice = subtotal + (cart.length > 0 ? DELIVERY_FEE : 0);

  const removeFromCart = (id: string) =>
    dispatch({ type: "REMOVE_FROM_CART", payload: id });

  const increaseQuantity = (id: string) => {
    const item = cart.find((i) => i._id === id);
    if (item && (item.quantity || 1) >= item.countInStock) {
      showToast(t("cart.out_of_stock_qty", { stock: item.countInStock }), "error");
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
      <div className="min-h-[60vh] flex items-center justify-center bg-surface px-4">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-primary">
            <FaShoppingCart className="text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-ink mb-3">{t("cart.login_required")}</h2>
          <Link to="/login" className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3 font-bold text-white hover:bg-primary-dark transition">
            {t("cart.login_now")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-r from-primary-dark via-primary to-slate-900 text-white" dir={isRTL ? "rtl" : "ltr"}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <FaShoppingCart className="text-xl" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold">
                {t("cart.title", { defaultValue: "سلة التسوق" })}
              </h1>
              <p className="text-white/70 text-sm sm:text-base mt-1">
                {cart.length === 0
                  ? t("cart.empty")
                  : t("cart.items_count", { count: cart.length, defaultValue: `${cart.length} منتجات` })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-surface min-h-[50vh] py-8 sm:py-12" dir={isRTL ? "rtl" : "ltr"}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {cart.length === 0 ? (
            <div className="rounded-2xl bg-white border border-primary/10 shadow-sm p-10 sm:p-16 text-center">
              <FaShoppingCart className="mx-auto text-4xl text-muted mb-4" />
              <h2 className="text-xl font-bold text-ink mb-2">{t("cart.empty")}</h2>
              <Link to="/store" className="inline-flex items-center gap-2 mt-4 rounded-xl bg-primary px-6 py-3 font-bold text-white hover:bg-primary-dark transition">
                {t("cart.continue_shopping")}
                {isRTL ? <FaArrowLeft /> : <FaArrowRight />}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item) => {
                  const lineTotal = (item.price || 0) * (item.quantity || 1);
                  return (
                    <div key={item._id} className="flex flex-col sm:flex-row gap-4 rounded-2xl bg-white border border-primary/10 p-4 sm:p-5 shadow-sm hover:shadow-md transition">
                      <Link to={`/product/${item._id}`} className="shrink-0">
                        <img src={item.image} alt={item.name} className="h-24 w-24 sm:h-28 sm:w-28 rounded-xl object-cover bg-primary-soft/40" />
                      </Link>
                      <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <Link to={`/product/${item._id}`} className="font-bold text-ink hover:text-primary line-clamp-2 text-base sm:text-lg">
                              {item.name}
                            </Link>
                            <p className="text-sm text-muted mt-1">
                              {formatPrice(item.price || 0, lang)}
                              <span className="mx-1">×</span>
                              {item.quantity || 1}
                            </p>
                          </div>
                          <button onClick={() => removeFromCart(item._id)} className="shrink-0 rounded-lg p-2 text-red-500 hover:bg-red-50 transition" aria-label={t("cart.remove")}>
                            <FaTrash />
                          </button>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <div className="inline-flex items-center rounded-xl border border-gray-200 bg-surface overflow-hidden">
                            <button onClick={() => decreaseQuantity(item._id)} className="h-9 w-9 flex items-center justify-center hover:bg-primary-soft text-ink transition">
                              <FaMinus className="text-xs" />
                            </button>
                            <span className="w-10 text-center font-bold text-sm">{item.quantity || 1}</span>
                            <button onClick={() => increaseQuantity(item._id)} disabled={(item.quantity || 1) >= item.countInStock} className="h-9 w-9 flex items-center justify-center hover:bg-primary-soft text-ink transition disabled:opacity-40">
                              <FaPlus className="text-xs" />
                            </button>
                          </div>
                          <div className="text-end">
                            <p className="text-xs text-muted">{t("cart.line_total", { defaultValue: "الإجمالي" })}</p>
                            <p className="text-lg sm:text-xl font-extrabold text-primary tabular-nums">{formatPrice(lineTotal, lang)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-24 rounded-2xl bg-white border border-primary/10 shadow-sm p-5 sm:p-6 space-y-5">
                  <h3 className="text-lg font-extrabold text-ink">{t("cart.summary", { defaultValue: "ملخص الطلب" })}</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-muted">
                      <span>{t("cart.subtotal", { defaultValue: "المجموع الفرعي" })}</span>
                      <span className="font-semibold text-ink tabular-nums">{formatPrice(subtotal, lang)}</span>
                    </div>
                    <div className="flex justify-between text-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <FaTruck className="text-primary" />
                        {t("cart.delivery", { defaultValue: "التوصيل" })}
                      </span>
                      <span className="font-semibold text-ink tabular-nums">{formatPrice(DELIVERY_FEE, lang)}</span>
                    </div>
                    <div className="border-t border-primary/10 pt-3 flex justify-between items-baseline">
                      <span className="font-bold text-ink">{t("cart.total", { defaultValue: "الإجمالي" })}</span>
                      <span className="text-2xl font-extrabold text-primary tabular-nums">{formatPrice(totalPrice, lang)}</span>
                    </div>
                  </div>
                  <button onClick={goToCheckout} className="w-full rounded-xl bg-primary hover:bg-primary-dark text-white font-bold py-3.5 transition shadow-md">
                    {t("cart.checkout")}
                  </button>
                  <Link to="/store" className="flex items-center justify-center gap-2 text-sm font-semibold text-primary hover:underline">
                    {isRTL ? <FaArrowRight className="text-xs" /> : <FaArrowLeft className="text-xs" />}
                    {t("cart.continue_shopping")}
                  </Link>
                  <div className="flex items-center gap-2 rounded-xl bg-primary-soft/50 px-3 py-2.5 text-xs text-primary-dark">
                    <FaShieldAlt className="shrink-0" />
                    <span>{t("cart.secure", { defaultValue: "دفع آمن وتوصيل مضمون" })}</span>
                  </div>
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
