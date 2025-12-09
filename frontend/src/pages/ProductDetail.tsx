/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { dispatch } = useStore();

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const addToCart = () => {
    dispatch({ type: "ADD_TO_CART", payload: product });
    alert("تم إضافة المنتج للسلة ✅");
  };

  if (loading)
    return <div className="text-center py-20 text-3xl">جاري التحميل...</div>;
  if (!product)
    return (
      <div className="text-center py-20 text-3xl text-red-600">
        المنتج غير موجود
      </div>
    );

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-6xl mx-auto">
          <Link
            to="/"
            className="inline-block mb-8 text-blue-600 hover:underline text-lg"
          >
            ← العودة للرئيسية
          </Link>

          <div className="grid md:grid-cols-2 gap-12 bg-white rounded-3xl shadow-2xl p-10">
            <img
              src={product.image}
              alt={product.name}
              className="w-full rounded-2xl shadow-lg"
            />

            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-5xl font-bold text-gray-800 mb-4">
                  {product.name}
                </h1>
                <p className="text-2xl text-gray-600 mb-6">{product.brand}</p>
                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                  {product.description}
                </p>

                <div className="text-6xl font-bold text-blue-600 mb-8">
                  {product.price} ج.م
                </div>

                <button
                  onClick={addToCart}
                  disabled={product.countInStock === 0}
                  className={`w-full py-6 text-2xl font-bold rounded-xl transition ${
                    product.countInStock > 0
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-400 text-gray-700 cursor-not-allowed"
                  }`}
                >
                  {product.countInStock > 0
                    ? "أضف إلى السلة 🛒"
                    : "نفد المخزون"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
