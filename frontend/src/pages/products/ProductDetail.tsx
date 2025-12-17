import { useParams, Link, useNavigate } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import { useEffect, useState } from "react";
import api from "../../services/api";
import type { Product } from "../../context/StoreContext";
import { useToast } from "../../context/ToastContext";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useStore();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  const addToCart = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();

    if (!product) return;

    if (!state.isAuthenticated) {
      showToast("يجب تسجيل الدخول أولاً لإضافة المنتج إلى السلة!", "error");
      navigate("/login");
      return;
    }

    if (product.countInStock <= 0) {
      showToast("نفد المخزون من هذا المنتج", "error");
      return;
    }

    const existingItem = state.cart.find((item) => item._id === product._id);
    const currentQty = existingItem ? existingItem.quantity || 1 : 0;

    if (currentQty + 1 > product.countInStock) {
      showToast(`الكمية المتاحة فقط ${product.countInStock} وحدة`, "error");
      return;
    }

    dispatch({ type: "ADD_TO_CART", payload: product });
    showToast("تم إضافة المنتج إلى السلة 🛒", "success");
  };

  const isOutOfStock = product?.countInStock === 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-3xl text-blue-600">جاري تحميل المنتج...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-3xl text-red-600">المنتج غير موجود 😔</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12" dir="rtl">
      <div className="max-w-7xl mx-auto px-6">
        {/* العودة للمتجر */}
        <Link
          to="/store"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 text-lg font-medium mb-10 transition"
        >
          <svg
            className="w-5 h-5 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          العودة إلى المتجر
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* الصورة الكبيرة */}
          <div className="relative group">
            <div className="aspect-square overflow-hidden bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700"
              />
            </div>

            {/* Overlay نفد المخزون */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <div className="bg-red-600 text-white px-12 py-6 rounded-3xl text-4xl font-extrabold shadow-2xl">
                  نفد المخزون
                </div>
              </div>
            )}
          </div>

          {/* التفاصيل */}
          <div className="p-10 lg:p-16 flex flex-col justify-between space-y-4 -mt-4">
            <div className="space-y-3">
              {/* اسم المنتج */}
              <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                {product.name}
              </h1>

              {/* الماركة والتصنيف */}
              <div className="flex flex-wrap items-center gap-6 text-lg text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">الماركة:</span>
                  <span className="font-bold text-blue-600">
                    {product.brand.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">التصنيف:</span>
                  <span className="font-bold text-green-600">
                    {product.category.name}
                  </span>
                </div>
              </div>

              {/* السعر */}
              <div className="border-t border-b border-gray-200 py-3">
                <div className="flex items-end gap-3">
                  <span className="text-4xl lg:text-6xl font-extrabold text-blue-600">
                    {product.price.toLocaleString()}
                  </span>
                  <span className="text-3xl font-bold text-gray-700 mb-2">
                    ج.م
                  </span>
                </div>
              </div>

              {/* الكمية المتاحة */}
              <div className="flex items-center gap-3 text-xl">
                <span className="text-gray-600">المتاح في المخزون:</span>
                <span
                  className={`font-bold ${
                    isOutOfStock ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {product.countInStock} وحدة
                </span>
              </div>

              {/* الوصف */}
              <div className="border-t border-gray-200  pt-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  وصف المنتج
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {product.description || "لا يوجد وصف متاح لهذا المنتج"}
                </p>
              </div>
            </div>

            {/* زر أضف للسلة */}
            <button
              onClick={addToCart}
              disabled={isOutOfStock}
              className={`w-full py-6 text-2xl lg:text-3xl font-extrabold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl ${
                isOutOfStock
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
              }`}
            >
              {isOutOfStock ? "نفد المخزون" : "أضف إلى السلة 🛒"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
