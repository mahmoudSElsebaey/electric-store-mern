/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, Link, useNavigate } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import { useEffect, useState } from "react";
import api from "../../services/api";
import type { Product } from "../../context/StoreContext";
import { useToast } from "../../context/ToastContext";
import StarRating from "../../components/Reviews/StarRating";
import ReviewCard from "../../components/Reviews/ReviewCard";
import WishlistButton from "../../components/wishlist/WishlistButton";
import { useTranslation } from "react-i18next";
import { formatPrice } from "../../utils/formatPrice";

type Review = { _id: string; name: string; rating: number; comment: string; createdAt: string };
type ProductWithReviews = Product & { reviews: Review[]; rating: number | null; numReviews: number };

export default function ProductDetail() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const lang = i18n.language;
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useStore();
  const { showToast } = useToast();

  const [product, setProduct] = useState<ProductWithReviews | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchProduct = async () => {
    if (!id) { setError(t("product_detail.not_found")); setLoading(false); return; }
    try {
      setLoading(true); setError(null);
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
    } catch (err: any) {
      const message = err.response?.data?.message || t("product_detail.error");
      showToast(message, "error"); setError(message);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchProduct(); }, [id]);

  const addToCart = () => {
    if (!product) return;
    if (!state.isAuthenticated) { showToast(t("product_detail.must_login"), "error"); navigate("/login"); return; }
    if (product.countInStock <= 0) { showToast(t("product_detail.out_of_stock"), "error"); return; }
    dispatch({ type: "ADD_TO_CART", payload: product });
    showToast(t("store.add_to_cart"), "success");
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewForm.rating === 0) { showToast("اختر عدد النجوم أولاً", "error"); return; }
    if (!id) return;
    setSubmittingReview(true);
    try {
      await api.post(`/products/${id}/reviews`, { rating: reviewForm.rating, comment: reviewForm.comment.trim() });
      showToast("تم إضافة تقييمك بنجاح 🎉", "success");
      setReviewForm({ rating: 0, comment: "" });
      await fetchProduct();
    } catch (err: any) {
      showToast(err.response?.data?.message || "فشل إضافة التقييم", "error");
    } finally { setSubmittingReview(false); }
  };

  const isOutOfStock = product?.countInStock === 0;
  const displayRating = product?.rating ?? 0;

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-surface">
        <div className="text-xl text-primary animate-pulse">{t("product_detail.loading")}</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-surface px-4">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">{t("product_detail.error")}</p>
          <p className="text-muted mb-6">{error || t("product_detail.not_found")}</p>
          <Link to="/store" className="inline-block bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold">{t("product_detail.back_to_store")}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-6 sm:py-10" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Link to="/store" className="inline-flex items-center text-primary hover:text-primary-dark font-medium mb-6 sm:mb-8 text-sm sm:text-base">
          {t("product_detail.back_to_store")}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border border-primary/10">
          <div className="relative group">
            <div className="aspect-square overflow-hidden bg-primary-soft/30">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <WishlistButton productId={product._id} size="lg" />
            </div>
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <div className="bg-red-600 text-white px-6 py-3 rounded-2xl text-lg sm:text-2xl font-extrabold">{t("product_detail.out_of_stock")}</div>
              </div>
            )}
          </div>

          <div className="p-5 sm:p-8 lg:p-12 space-y-5 sm:space-y-6">
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink leading-tight">{product.name}</h1>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm sm:text-base text-muted">
                <span>{t("store.brand")}: <strong className="text-primary">{product.brand.name}</strong></span>
                <span>{t("store.category")}: <strong className="text-primary-dark">{product.category.name}</strong></span>
              </div>

              <div className="flex items-center gap-3">
                <StarRating rating={displayRating} size="lg" />
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-ink">{displayRating.toFixed(1)}</p>
                  <p className="text-xs sm:text-sm text-muted">{t("store.reviews_count", { count: product.numReviews })}</p>
                </div>
              </div>

              <div className="border-t border-b border-primary/10 py-4">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tabular-nums">{formatPrice(product.price, lang)}</span>
              </div>

              <div className="flex items-center gap-2 text-sm sm:text-base">
                <span className="text-muted">{t("product_detail.stock")}:</span>
                <span className={isOutOfStock ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}>
                  {product.countInStock} وحدة
                </span>
              </div>

              <div className="border-t border-primary/10 pt-4">
                <h3 className="text-lg font-bold text-ink mb-2">{t("product_detail.description_title")}</h3>
                <p className="text-sm sm:text-base text-muted leading-relaxed">
                  {product.description || t("product_detail.no_description")}
                </p>
              </div>
            </div>

            <button
              onClick={addToCart}
              disabled={isOutOfStock}
              className={`w-full py-3.5 sm:py-4 text-base sm:text-xl font-extrabold rounded-xl transition-all ${
                isOutOfStock
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-primary to-primary-dark text-white hover:opacity-95 shadow-lg"
              }`}
            >
              {isOutOfStock ? t("product_detail.out_of_stock") : t("store.add_to_cart")}
            </button>
          </div>
        </div>

        <div className="mt-10 sm:mt-14 max-w-5xl mx-auto">
          <h2 className="text-xl sm:text-3xl font-extrabold text-center mb-8 text-ink">{t("product_detail.reviews_title")}</h2>

          {state.isAuthenticated ? (
            <div className="bg-white rounded-2xl shadow-lg border border-primary/10 p-5 sm:p-8 mb-8">
              <h3 className="text-lg font-bold mb-4">{t("product_detail.add_review")}</h3>
              <form onSubmit={handleAddReview} className="space-y-5">
                <div>
                  <label className="block font-semibold mb-2 text-sm">{t("product_detail.your_rating")}</label>
                  <StarRating rating={reviewForm.rating} size="lg" interactive onRatingChange={(r) => setReviewForm({ ...reviewForm, rating: r })} />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-sm">{t("product_detail.your_comment")}</label>
                  <textarea rows={4} value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} className="w-full p-3 border rounded-xl focus:ring-4 focus:ring-primary-light text-sm" placeholder={t("product_detail.comment_placeholder")} />
                </div>
                <button type="submit" disabled={submittingReview || reviewForm.rating === 0} className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-bold disabled:opacity-60">
                  {submittingReview ? "جاري الإرسال..." : t("product_detail.submit_review")}
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-2xl shadow-lg border border-primary/10 mb-8">
              <Link to="/login" className="text-primary font-bold hover:underline">{t("product_detail.login_to_review")}</Link>
            </div>
          )}

          <div className="space-y-4">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review) => (
                <ReviewCard key={review._id} review={review} productId={id!} onDelete={fetchProduct} />
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-primary/10">
                <p className="text-muted">{t("product_detail.no_reviews_yet")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
