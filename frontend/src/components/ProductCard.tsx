import { Link, useNavigate } from "react-router-dom";
import { useStore, type Product } from "../context/StoreContext";
import { useToast } from "../context/ToastContext";

export default function ProductCard({ product }: { product: Product }) {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const addToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // ← مهم يمنع propagation للـ Link
    e.preventDefault(); // optional: يمنع أي default behavior

    if (!state.isAuthenticated) {
      showToast("يجب تسجيل الدخول أولاً لإضافة المنتج إلى السلة!", "error");
      navigate("/login");
      return;
    }

    dispatch({ type: "ADD_TO_CART", payload: product });
    showToast("تم إضافة المنتج إلى السلة 🛒", "success");
  };

  return (
    <Link to={`/product/${product._id}`} className="block group">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
        <div className="aspect-square relative overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="p-6">
          <h3 className="font-bold text-xl text-gray-800 line-clamp-2 mb-2">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3">{product.brand?.name}</p>
          <p className="text-gray-600 text-sm mb-3">{product.category?.name}</p>
          <div className="flex justify-between items-center">
            <span className="text-3xl font-bold text-blue-600">
              {product.price} ج.م
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                product.countInStock > 0
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {product.countInStock > 0
                ? `متوفر: ${product.countInStock}`
                : "نفد"}
            </span>
          </div>
        </div>
        <button
          onClick={addToCart}
          className="bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition w-full"
        >
          أضف إلى السلة
        </button>
      </div>
    </Link>
  );
}
