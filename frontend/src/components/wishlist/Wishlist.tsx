// src/pages/Wishlist.tsx
import { useStore } from "../../context/StoreContext";
import ProductCard from "../../components/ProductCard";
import { Link } from "react-router-dom";

export default function Wishlist() {
  const { state } = useStore();

  if (state.wishlistLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-3xl text-blue-600">جاري تحميل المفضلة...</div>
      </div>
    );
  }

  if (state.wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">المفضلة فارغة ❤️</h1>
        <p className="text-xl text-gray-600 mb-10">
          ابدأ بإضافة منتجات تحبها عشان ترجعلها في أي وقت
        </p>
        <Link
          to="/store"
          className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl text-xl font-bold transition"
        >
          تصفح المتجر
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12" dir="rtl">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-5xl font-extrabold text-center mb-12">المفضلة ({state.wishlist.length})</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {state.wishlist.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}