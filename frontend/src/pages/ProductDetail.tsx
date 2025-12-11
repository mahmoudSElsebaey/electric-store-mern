// src/pages/ProductDetail.tsx
import { useParams, Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useEffect, useState } from "react";
import api from "../services/api";

import type { Product } from "../context/StoreContext"; // ← أضف الـ type من StoreContext
import { useToast } from "../context/ToastContext";

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

  const addToCart = () => {
    if (!state.isAuthenticated) {
      showToast("يجب تسجيل الدخول أولاً لإضافة المنتج إلى السلة!", "error");
      navigate("/login");
      return;
    }

    dispatch({ type: "ADD_TO_CART", payload: product! });
    showToast("تم إضافة المنتج إلى السلة 🛒", "success");
  };

  if (loading) {
    return (
      <div className="text-center py-40 text-3xl text-blue-600">
        جاري تحميل المنتج...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-40 text-3xl text-red-600">
        المنتج غير موجود 😔
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-6">
        <Link
          to="/"
          className="inline-block mb-8 text-blue-600 hover:underline text-lg font-medium"
        >
          ← العودة للرئيسية
        </Link>

        <div className="grid md:grid-cols-2 gap-12 bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* الصورة */}
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.countInStock === 0 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white text-4xl font-bold bg-red-600 px-8 py-4 rounded-xl">
                  نفد المخزون
                </span>
              </div>
            )}
          </div>

          {/* التفاصيل */}
          <div className="p-10 flex flex-col justify-between">
            <div>
              <h1 className="text-5xl font-bold text-gray-800 mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-6 mb-6 text-xl">
                <span className="text-gray-600">
                  الماركة:{" "}
                  <span className="font-bold text-blue-600">
                    {product.brand.name}
                  </span>
                </span>
                <span className="text-gray-600">
                  التصنيف:{" "}
                  <span className="font-bold text-green-600">
                    {product.category.name}
                  </span>
                </span>
              </div>

              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {product.description || "لا يوجد وصف متاح لهذا المنتج"}
              </p>

              <div className="text-6xl font-bold text-blue-600 mb-8">
                {product.price.toLocaleString()} ج.م
              </div>

              <div className="text-xl text-gray-600 mb-8">
                المتاح في المخزون:{" "}
                <span className="font-bold text-green-600">
                  {product.countInStock}
                </span>
              </div>
            </div>

            <button
              onClick={addToCart}
              disabled={product.countInStock === 0}
              className={`w-full py-6 text-2xl font-bold rounded-xl transition transform hover:scale-105 ${
                product.countInStock > 0
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
            >
              {product.countInStock > 0 ? "أضف إلى السلة 🛒" : "نفد المخزون"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
