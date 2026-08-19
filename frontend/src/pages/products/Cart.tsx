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
  FaLock,
  FaTags,
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
  const itemCount = cart.reduce((n, i) => n + (i.quantity || 1), 0);

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
      <div className="min-h-[60vh] flex items-center justify-center bg-surface px-4">
        <div className="text-center max-w-md rounded-3xl bg-white border border-primary/10 shadow-lg p-10">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-md">
            <FaShoppingCart className="text-2xl" />
          </div>
          <h2 className="text-2xl font-extrabold text-ink mb-2">
            {t("cart.login_required")}
          </h2>
          <p className="text-sm text-muted mb-6">
            {t("cart.login_hint", {
              defaultValue: "سجّل الدخول لحفظ سلتك ومتابعة الشراء بأمان.",
            })}
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3 font-bold text-white hover:bg-primary-dark transition shadow-md"
          >
            {t("cart.login_now")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <section
        className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-slate-900 text-white"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="pointer-events-none absolute -top-16 end-0 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 start-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
                <FaShoppingCart className="text-2xl text-accent" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-accent/90 mb-1">
                  {t("cart.badge", { defaultValue: "Shopping bag" })}
                </p>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {t("cart.title", { defaultValue: "سلة التسوق" })}
                </h1>
                <p className="text-white/70 text-sm mt-1">
                  {cart.length === 0
                    ? t("cart.empty")
                    : t("cart.items_count", {
                        count: itemCount,
                        defaultValue: `${itemCount} منتجات في السلة`,
                      })}
                </p>
              </div>
            </div>

            {cart.length > 0 && (
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm ring-1 ring-white/15">
                <FaTags className="text-accent" />
                <span className="text-white/80">
                  {t("cart.secure_short", {
                    defaultValue: "دفع آمن · توصيل سريع",
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      <div
        className="bg-surface min-h-[50vh] py-8 sm:py-12"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {cart.length === 0 ? (
            <div className="rounded-3xl bg-white border border-primary/10 shadow-sm p-12 sm:p-16 text-center">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary-soft text-primary">
                <FaShoppingCart className="text-3xl opacity-80" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-ink mb-2">
                {t("cart.empty")}
              </h2>
              <p className="text-muted text-sm mb-6 max-w-sm mx-auto">
                {t("cart.empty_hint", {
                  defaultValue: "اكتشف أحدث الأجهزة والعروض في المتجر.",
                })}
              </p>
              <Link
                to="/store"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 font-bold text-white hover:bg-primary-dark transition shadow-md"
              >
                {t("cart.continue_shopping")}
                {isRTL ? (
                  <FaArrowLeft className="text-sm" />
                ) : (
                  <FaArrowRight className="text-sm" />
                )}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              <div className="lg:col-span-7 xl:col-span-8 space-y-4">
                {cart.map((item) => {
                  const lineTotal = (item.price || 0) * (item.quantity || 1);
                  return (
                    <article
                      key={item._id}
                      className="group relative flex flex-col sm:flex-row gap-4 sm:gap-5 rounded-2xl bg-white border border-primary/10 p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-primary/25 transition-all duration-300"
                    >
                      <Link
                        to={`/product/${item._id}`}
                        className="relative shrink-0 mx-auto sm:mx-0"
                      >
                        <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-xl bg-gradient-to-br from-primary-soft/50 to-white border border-primary/10 overflow-hidden flex items-center justify-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      </Link>

                      <div className="flex-1 min-w-0 flex flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <Link to={`/product/${item._id}`}>
                              <h3 className="font-bold text-ink text-base sm:text-lg line-clamp-2 group-hover:text-primary transition-colors">
                                {item.name}
                              </h3>
                            </Link>
                            <p className="mt-1 text-sm font-semibold text-primary tabular-nums">
                              {formatPrice(item.price || 0, lang)}
                              <span className="text-muted font-normal text-xs ms-1">
                                / {t("cart.unit", { defaultValue: "قطعة" })}
                              </span>
                            </p>
                          </div>

                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="shrink-0 flex h-9 w-9 items-center justify-center rounded-xl text-muted hover:text-red-600 hover:bg-red-50 transition"
                            aria-label={t("cart.remove")}
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        </div>

                        <div className="mt-auto pt-4 flex flex-wrap items-center justify-between gap-3">
                          <div className="inline-flex items-center rounded-full border border-primary/15 bg-surface overflow-hidden">
                            <button
                              onClick={() => decreaseQuantity(item._id)}
                              className="h-9 w-9 flex items-center justify-center text-ink hover:bg-primary-soft transition"
                              aria-label="decrease"
                            >
                              <FaMinus className="text-[10px]" />
                            </button>
                            <span className="w-9 text-center text-sm font-extrabold tabular-nums">
                              {item.quantity || 1}
                            </span>
                            <button
                              onClick={() => increaseQuantity(item._id)}
                              disabled={
                                (item.quantity || 1) >= item.countInStock
                              }
                              className="h-9 w-9 flex items-center justify-center text-ink hover:bg-primary-soft transition disabled:opacity-40"
                              aria-label="increase"
                            >
                              <FaPlus className="text-[10px]" />
                            </button>
                          </div>

                          <div className="text-end">
                            <p className="text-[11px] uppercase tracking-wide text-muted font-medium">
                              {t("cart.line_total", {
                                defaultValue: "الإجمالي",
                              })}
                            </p>
                            <p className="text-lg sm:text-xl font-extrabold text-primary tabular-nums leading-tight">
                              {formatPrice(lineTotal, lang)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <aside className="lg:col-span-5 xl:col-span-4">
                <div className="sticky top-24 overflow-hidden rounded-3xl bg-white border border-primary/10 shadow-lg">
                  <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />

                  <div className="p-5 sm:p-6 space-y-5">
                    <h3 className="text-lg font-extrabold text-ink">
                      {t("cart.summary", { defaultValue: "ملخص الطلب" })}
                    </h3>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between text-muted">
                        <span>
                          {t("cart.subtotal", {
                            defaultValue: "المجموع الفرعي",
                          })}
                          <span className="text-xs ms-1 opacity-70">
                            ({itemCount})
                          </span>
                        </span>
                        <span className="font-semibold text-ink tabular-nums">
                          {formatPrice(subtotal, lang)}
                        </span>
                      </div>
                      <div className="flex justify-between text-muted">
                        <span className="inline-flex items-center gap-1.5">
                          <FaTruck className="text-primary text-xs" />
                          {t("cart.delivery", { defaultValue: "التوصيل" })}
                        </span>
                        <span className="font-semibold text-ink tabular-nums">
                          {formatPrice(DELIVERY_FEE, lang)}
                        </span>
                      </div>

                      <div className="rounded-2xl bg-primary-soft/40 border border-primary/10 px-4 py-3.5 flex justify-between items-center">
                        <span className="font-bold text-ink">
                          {t("cart.total", { defaultValue: "الإجمالي" })}
                        </span>
                        <span className="text-2xl font-extrabold text-primary tabular-nums">
                          {formatPrice(totalPrice, lang)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={goToCheckout}
                      className="group relative w-full overflow-hidden rounded-xl bg-primary hover:bg-primary-dark text-white font-bold py-3.5 transition shadow-md"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {t("cart.checkout")}
                        {isRTL ? (
                          <FaArrowLeft className="text-sm transition-transform group-hover:-translate-x-0.5" />
                        ) : (
                          <FaArrowRight className="text-sm transition-transform group-hover:translate-x-0.5" />
                        )}
                      </span>
                    </button>

                    <Link
                      to="/store"
                      className="flex items-center justify-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition"
                    >
                      {isRTL ? (
                        <FaArrowRight className="text-xs" />
                      ) : (
                        <FaArrowLeft className="text-xs" />
                      )}
                      {t("cart.continue_shopping")}
                    </Link>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="flex items-center gap-2 rounded-xl bg-surface px-3 py-2.5 text-[11px] text-muted">
                        <FaLock className="text-primary shrink-0" />
                        <span>
                          {t("cart.secure_pay", { defaultValue: "دفع آمن" })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 rounded-xl bg-surface px-3 py-2.5 text-[11px] text-muted">
                        <FaShieldAlt className="text-primary shrink-0" />
                        <span>
                          {t("cart.guarantee", {
                            defaultValue: "ضمان التوصيل",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
