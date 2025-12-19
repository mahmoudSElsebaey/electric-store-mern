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
    <div className="group relative h-full" dir={isRTL ? "rtl" : "ltr"}>
      <Link to={`/product/${product._id}`} className="block h-full">
        <div className="relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-3 border border-gray-100 h-full flex flex-col">
          <div className="aspect-square relative overflow-hidden bg-linear-to-br from-gray-50 to-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />

            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="bg-red-600 text-white px-8 py-4 rounded-2xl text-2xl font-bold tracking-wider shadow-2xl">
                  {t("store.out_of_stock")}
                </div>
              </div>
            )}

            {/* <div className="absolute top-1 right-1 bg-white border-2 border-yellow-500 text-yellow-500 px-3 py-1 rounded-2xl text-md font-bold shadow-xl">
              <span className="text-2xl">{product.price.toLocaleString()}</span>
              <span className="text-lg font-bold pr-1">ج.م</span>
            </div> */}
            <div className="absolute top-1 right-1 bg-white border-2 border-yellow-500 text-yellow-500 px-3 py-1 rounded-2xl text-md font-bold shadow-xl">
              <span className="text-2xl">
                {formatPrice(product.price, lang)}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
            <WishlistButton productId={product._id} size="md" />
            <div className="space-y-3">
              <div
                className="flex items-center justify-between gap-3 text-[12px] text-gray-500"
                dir="ltr"
              >
                <span className="font-medium text-gray-700 bg-amber-200 py-1 px-4 rounded-full">
                  {product.brand?.name}
                </span>
                <span>{product.category?.name}</span>
              </div>

              <h3 className="font-bold text-lg h-7 text-gray-900 line-clamp-2 leading-relaxed group-hover:text-blue-600 transition-colors">
                {product.name}
              </h3>

              <div className="flex items-center gap-2">
                <StarRating
                  rating={reviewCount > 0 ? displayRating : 0}
                  size="sm"
                />
                {/* <span className="text-sm text-gray-600 font-medium">
                  {reviewCount > 0
                    ? t("store.reviews_count", { count: reviewCount })
                    : t("store.no_reviews")}
                </span> */}
                <span className="text-sm text-gray-600 font-medium">
                  {reviewCount > 0
                    ? t("store.reviews_count", { count: reviewCount })
                    : t("store.no_reviews")}
                </span>
              </div>

              <p className="text-[13px] text-gray-600 line-clamp-2">
                {product.description || t("product_detail.no_description")}
              </p>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
            <button
              onClick={addToCart}
              disabled={isOutOfStock}
              className={`w-full py-4 font-bold text-lg rounded-b-xl transition-all duration-300 cursor-pointer ${
                isOutOfStock
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-linear-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-2xl"
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
