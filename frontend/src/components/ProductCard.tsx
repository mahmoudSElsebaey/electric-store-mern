import { Link, useNavigate } from "react-router-dom";
import { useStore, type Product } from "../context/StoreContext";
import { useToast } from "../context/ToastContext";

export default function ProductCard({ product }: { product: Product }) {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const addToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (!state.isAuthenticated) {
      showToast("يجب تسجيل الدخول أولاً لإضافة المنتج إلى السلة!", "error");
      navigate("/login");
      return;
    }

    if (product.countInStock <= 0) {
      showToast("نفد المخزون من هذا المنتج", "error");
      return;
    }

    dispatch({ type: "ADD_TO_CART", payload: product });
    showToast("تم إضافة المنتج إلى السلة 🛒", "success");
  };

  const isOutOfStock = product.countInStock === 0;

  return (
    <div className="group relative h-full" dir="rtl">
      <Link to={`/product/${product._id}`} className="block h-full">
        <div className="relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-3 border border-gray-100 h-full flex flex-col">
          {/* الصورة */}
          <div className="aspect-square relative overflow-hidden bg-linear-to-br from-gray-50 to-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />

            {/* Overlay نفد المخزون */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="bg-red-600 text-white px-8 py-4 rounded-2xl text-2xl font-bold tracking-wider shadow-2xl">
                  نفد المخزون
                </div>
              </div>
            )}

            {/* السعر في الأعلى يمين */}
            <div className="absolute top-1 right-1 bg-white border-2 border-yellow-500 text-yellow-500 px-3 py-1 rounded-2xl text-md font-bold shadow-xl">
              <span className="text-2xl">{product.price.toLocaleString()}</span>
              <span className="text-lg font-bold pr-1">ج.م</span>
            </div>
          </div>

          {/* المحتوى (يتمدد ويملأ المساحة المتبقية) */}
          <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              {/* الماركة والتصنيف */}
              <div
                className="flex items-center justify-between  gap-3 text-[12px] text-gray-500"
                dir="ltr"
              >
                <span
                  className="font-medium text-gray-700 bg-amber-200 py-1 px-15 rounded-2 -rotate-45 -mt-140
                0 -ml-15"
                >
                  {product.brand?.name}
                </span>
                {/* <span>•</span> */}
                <span>{product.category?.name}</span>
              </div>

              {/* اسم المنتج (سطرين فقط + ...) */}
              <h3 className="font-bold text-md text-gray-900 line-clamp-1 leading-relaxed group-hover:text-blue-600 transition-colors">
                {product.name}
              </h3>

              {/* الوصف (سطرين فقط + ...) */}
              <p className="text-[12px] text-gray-600 line-clamp-2  ">
                {product.description || "لا يوجد وصف"}
              </p>
            </div>
          </div>
          
          {/* زر أضف للسلة (يطلع من تحت عند الهوفر) */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
            <button
              onClick={addToCart}
              disabled={isOutOfStock}
              className={`w-full py-4 font-bold text-lg rounded-b-3xl transition-all duration-300 cursor-pointer ${
                isOutOfStock
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-linear-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-2xl"
              }`}
            >
              {isOutOfStock ? "نفد المخزون" : "أضف إلى السلة 🛒"}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
