/* eslint-disable @typescript-eslint/no-unused-vars */

import { useStore } from "../../context/StoreContext";
import { useToast } from "../../context/ToastContext";
import api from "../../services/api";
import { FaHeart, FaRegHeart } from "react-icons/fa";

type WishlistButtonProps = {
  productId: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "w-5 h-5",
  md: "w-7 h-7",
  lg: "w-9 h-9",
};

export default function WishlistButton({
  productId,
  size = "md",
}: WishlistButtonProps) {
  const { state, dispatch } = useStore();
  const { showToast } = useToast();

  const isInWishlist = state.wishlist.some((p) => p._id === productId);
  const isAuthenticated = state.isAuthenticated;

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      showToast("سجل الدخول عشان تضيف للمفضلة ❤️", "error");
      return;
    }

    try {
      if (isInWishlist) {
        await api.delete(`/wishlist/${productId}`);
        dispatch({ type: "WISHLIST_REMOVE", payload: productId });
        showToast("تم حذف المنتج من المفضلة", "success");
      } else {
        await api.post("/wishlist", { productId });
        const product = state.products.find((p) => p._id === productId);
        if (product) {
          dispatch({ type: "WISHLIST_ADD", payload: product });
        }
        showToast("تم إضافة المنتج للمفضلة ❤️", "success");
      }
    } catch (err) {
      showToast("فشل في تحديث المفضلة", "error");
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      className="absolute top-3 left-3 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:scale-110 transition-all cursor-pointer"
    >
      {isInWishlist ? (
        <FaHeart className={`${sizeClasses[size]} text-red-500`} />
      ) : (
        <FaRegHeart className={`${sizeClasses[size]} text-gray-700`} />
      )}
    </button>
  );
}
