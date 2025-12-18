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

type Review = {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
};

type ProductWithReviews = Product & {
  reviews: Review[];
  rating: number | null; // ← مهم: ممكن يكون null
  numReviews: number;
};

export default function ProductDetail() {
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
    if (!id) {
      setError("معرف المنتج غير موجود");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/products/${id}`);
      console.log("بيانات المنتج:", res.data);
      setProduct(res.data);
    } catch (err: any) {
      console.error("خطأ جلب المنتج:", err);
      const message = err.response?.data?.message || "فشل تحميل المنتج";
      showToast(message, "error");
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const addToCart = () => {
    if (!product) return;

    if (!state.isAuthenticated) {
      showToast("يجب تسجيل الدخول أولاً", "error");
      navigate("/login");
      return;
    }

    if (product.countInStock <= 0) {
      showToast("نفد المخزون", "error");
      return;
    }

    dispatch({ type: "ADD_TO_CART", payload: product });
    showToast("تم إضافة المنتج إلى السلة 🛒", "success");
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (reviewForm.rating === 0) {
      showToast("اختر عدد النجوم أولاً", "error");
      return;
    }

    if (!id) return;

    setSubmittingReview(true);
    try {
      await api.post(`/products/${id}/reviews`, {
        rating: reviewForm.rating,
        comment: reviewForm.comment.trim(),
      });

      showToast("تم إضافة تقييمك بنجاح 🎉", "success");
      setReviewForm({ rating: 0, comment: "" });
      await fetchProduct();
    } catch (err: any) {
      console.error("خطأ إضافة تقييم:", err);
      const message = err.response?.data?.message || "فشل إضافة التقييم";
      showToast(message, "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  const isOutOfStock = product?.countInStock === 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-3xl text-blue-600 animate-pulse">
          جاري تحميل المنتج...
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-3xl text-red-600 mb-6">حدث خطأ 😔</p>
          <p className="text-xl text-gray-600 mb-8">
            {error || "المنتج غير موجود"}
          </p>
          <Link
            to="/store"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-bold"
          >
            العودة إلى المتجر
          </Link>
        </div>
      </div>
    );
  }

  // الحل هنا: لو rating null → حط 0
  const displayRating = product.rating ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12" dir="rtl">
      <div className="max-w-7xl mx-auto px-6">
        <Link
          to="/store"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 text-lg font-medium mb-10"
        >
          ← العودة إلى المتجر
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* الصورة */}
          <div className="relative group">
            <div className="aspect-square overflow-hidden bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <WishlistButton productId={product._id} size="lg" />

            </div>
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <div className="bg-red-600 text-white px-12 py-6 rounded-3xl text-4xl font-extrabold">
                  نفد المخزون
                </div>
              </div>
            )}
          </div>

          {/* التفاصيل */}
          <div className="p-10 lg:p-16 space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900">
                {product.name}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-lg text-gray-600">
                <span>
                  الماركة:
                  <strong className="text-blue-600">
                    {product.brand.name}
                  </strong>
                </span>
                <span>
                  التصنيف:
                  <strong className="text-green-600">
                    {product.category.name}
                  </strong>
                </span>
              </div>

              {/* التقييم العام - مع الحماية من null */}
              <div className="flex items-center gap-4">
                <StarRating rating={displayRating} size="xl" />
                <div>
                  <p className="text-3xl font-bold text-gray-900">
                    {displayRating.toFixed(1)}
                  </p>
                  <p className="text-gray-600">({product.numReviews} تقييم)</p>
                </div>
              </div>

              <div className="border-t border-b border-gray-200 py-6">
                <div className="flex items-end gap-3">
                  <span className="text-5xl lg:text-6xl font-extrabold text-blue-600">
                    {product.price.toLocaleString()}
                  </span>
                  <span className="text-3xl font-bold text-gray-700 mb-2">
                    ج.م
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xl">
                <span className="text-gray-600">المتاح:</span>
                <span
                  className={isOutOfStock ? "text-red-600" : "text-green-600"}
                >
                  {product.countInStock} وحدة
                </span>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  وصف المنتج
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {product.description || "لا يوجد وصف"}
                </p>
              </div>
            </div>

            <button
              onClick={addToCart}
              disabled={isOutOfStock}
              className={`w-full py-6 text-3xl font-extrabold rounded-2xl transition-all ${
                isOutOfStock
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-linear-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-2xl"
              }`}
            >
              {isOutOfStock ? "نفد المخزون" : "أضف إلى السلة 🛒"}
            </button>
          </div>
        </div>

        {/* قسم التقييمات */}
        <div className="mt-16 max-w-5xl mx-auto">
          <h2 className="text-4xl font-extrabold text-center mb-12">
            تقييمات العملاء
          </h2>

          {state.isAuthenticated ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
              <h3 className="text-2xl font-bold mb-6">شارك رأيك</h3>
              <form onSubmit={handleAddReview} className="space-y-8">
                <div>
                  <label className="block text-lg font-semibold mb-4">
                    تقييمك
                  </label>
                  <StarRating
                    rating={reviewForm.rating}
                    size="xl"
                    interactive
                    onRatingChange={(r) =>
                      setReviewForm({ ...reviewForm, rating: r })
                    }
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold mb-4">
                    تعليقك
                  </label>
                  <textarea
                    rows={5}
                    value={reviewForm.comment}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, comment: e.target.value })
                    }
                    className="w-full p-4 border rounded-xl focus:ring-4 focus:ring-blue-300"
                    placeholder="اكتب تجربتك..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingReview || reviewForm.rating === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-xl font-bold text-xl disabled:opacity-60"
                >
                  {submittingReview ? "جاري الإرسال..." : "إرسال التقييم"}
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl shadow-xl mb-12">
              <p className="text-xl">
                <Link
                  to="/login"
                  className="text-blue-600 font-bold hover:underline"
                >
                  سجل الدخول
                </Link>
                عشان تقيّم
              </p>
            </div>
          )}

          <div className="space-y-8">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review) => (
                <ReviewCard
                  key={review._id}
                  review={review}
                  productId={id!}
                  onDelete={fetchProduct}
                />
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl shadow-xl">
                <p className="text-2xl text-gray-500">
                  لا توجد تقييمات بعد... كن الأول! ⭐
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
