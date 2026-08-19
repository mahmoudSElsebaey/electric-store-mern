import { Link, useNavigate } from "react-router-dom";
import { useStore, type Product } from "../context/StoreContext";
import { useToast } from "../context/ToastContext";
import StarRating from "./Reviews/StarRating";
import WishlistButton from "./wishlist/WishlistButton";
import { useTranslation } from "react-i18next";
import { formatPrice } from "../utils/formatPrice";

export default function ProductCard({ product }: { product: Product }) {
  const { t, i18n } = useTranslation();
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isRTL = i18n.language === "ar";
  const lang = i18n.language;

  const addToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (!state.isAuthenticated) {
      showToast(t("product_detail.must_login"), "error");
      navigate("/login");
      return;
    }

    if (product.countInStock <= 0) {
      showToast(t("store.out_of_stock"), "error");
      return;
    }

    dispatch({ type: "ADD_TO_CART", payload: product });
    showToast(t("store.add_to_cart"), "success");
  };

  const isOutOfStock = product.countInStock === 0;
  const displayRating = product.rating ?? 0;
  const reviewCount = product.numReviews || 0;

  return (
    <div className="group relative h-full w-full" dir={isRTL ? "rtl" : "ltr"}>
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-primary/10 h-full flex flex-col">
        <Link to={`/product/${product._id}`} className="relative block">
          <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-primary-soft/30">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain p-3 sm:p-4 transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />

            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                <span className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
                  {t("store.out_of_stock")}
                </span>
              </div>
            )}

            <div className="absolute top-3 start-3 bg-primary/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-extrabold shadow-md tabular-nums ring-2 ring-white/40">
              {formatPrice(product.price, lang)}
            </div>
          </div>
        </Link>

        <div className="absolute top-3 end-3 z-10">
          <WishlistButton productId={product._id} size="md" />
        </div>

        <div className="p-4 flex-1 flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {product.brand?.name && (
              <span className="font-medium bg-primary-soft text-primary-dark px-2.5 py-0.5 rounded-full">
                {product.brand.name}
              </span>
            )}
            {product.category?.name && (
              <span className="text-muted">{product.category.name}</span>
            )}
          </div>

          <Link to={`/product/${product._id}`}>
            <h3 className="font-bold text-base sm:text-lg text-ink line-clamp-2 leading-snug group-hover:text-primary transition-colors min-h-[2.5rem]">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center gap-2">
            <StarRating rating={reviewCount > 0 ? displayRating : 0} size="sm" />
            <span className="text-xs text-muted">
              {reviewCount > 0
                ? t("store.reviews_count", { count: reviewCount })
                : t("store.no_reviews")}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-muted line-clamp-2 flex-1">
            {product.description || t("product_detail.no_description")}
          </p>

          <div className="pt-2 border-t border-primary/10 mt-auto">
            <button
              onClick={addToCart}
              disabled={isOutOfStock}
              className={`w-full py-2.5 rounded-xl text-sm font-bold transition ${
                isOutOfStock
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-primary hover:bg-primary-dark text-white shadow-sm"
              }`}
            >
              {isOutOfStock ? t("store.out_of_stock") : t("store.add_to_cart")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
