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
    <div
      className="group relative h-full w-full"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Link
        to={`/product/${product._id}`}
        className="block h-full w-full transition-transform duration-300 hover:scale-[1.02]"
      >
        <div className="relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 h-full flex flex-col">
          {/* صورة المنتج */}
          <div className="relative aspect-square overflow-hidden bg-linear-to-br from-gray-50 to-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />

            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="bg-red-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl text-base sm:text-xl font-bold tracking-wide shadow-xl">
                  {t("store.out_of_stock")}
                </div>
              </div>
            )}

            {/* السعر */}
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/95 backdrop-blur-sm border border-yellow-400 text-yellow-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm sm:text-base font-bold shadow-md">
              {formatPrice(product.price, lang)}
            </div>
          </div>

          {/* المحتوى */}
          <div className="p-4 sm:p-5 flex-1 flex flex-col">
            {/* Wishlist */}
            <div className="self-end -mt-10 -mr-2 sm:-mt-12 sm:-mr-3 z-10">
              <WishlistButton productId={product._id} size="md" />
            </div>

            {/* معلومات المنتج */}
            <div className="space-y-2.5 sm:space-y-3 flex-1">
              {/* Brand & Category */}
              <div
                className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500"
                dir="ltr"
              >
                <span className="font-medium bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
                  {product.brand?.name}
                </span>
                <span className="text-gray-600">
                  {product.category?.name}
                </span>
              </div>

              {/* الاسم */}
              <h3 className="font-bold text-base sm:text-lg text-gray-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                {product.name}
              </h3>

              {/* التقييم */}
              <div className="flex items-center gap-2">
                <StarRating
                  rating={reviewCount > 0 ? displayRating : 0}
                  size="sm"
                />
                <span className="text-xs sm:text-sm text-gray-600 font-medium">
                  {reviewCount > 0
                    ? t("store.reviews_count", { count: reviewCount })
                    : t("store.no_reviews")}
                </span>
              </div>

              {/* الوصف */}
              <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                {product.description || t("product_detail.no_description")}
              </p>
            </div>
          </div>

          {/* زر أضف للسلة */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out">
            <button
              onClick={addToCart}
              disabled={isOutOfStock}
              className={`w-full py-3 sm:py-4 font-semibold text-sm sm:text-base transition-all duration-300 cursor-pointer shadow-xl ${
                isOutOfStock
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-linear-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
              }`}
            >
              {isOutOfStock ? t("store.out_of_stock") : t("store.add_to_cart")}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}