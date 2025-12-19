/* eslint-disable @typescript-eslint/no-unused-vars */
import { useStore } from "../../context/StoreContext";
import { useToast } from "../../context/ToastContext";
import api from "../../services/api";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useTranslation } from "react-i18next"; // ← جديد

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
  const { t } = useTranslation(); // ← جديد
  const { state, dispatch } = useStore();
  const { showToast } = useToast();

  const isInWishlist = state.wishlist.some((p) => p._id === productId);
  const isAuthenticated = state.isAuthenticated;

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      showToast(t("wishlist.login_required"), "error");
      return;
    }

    try {
      if (isInWishlist) {
        await api.delete(`/wishlist/${productId}`);
        dispatch({ type: "WISHLIST_REMOVE", payload: productId });
        showToast(t("wishlist.remove_success"), "success");
      } else {
        await api.post("/wishlist", { productId });
        const product = state.products.find((p) => p._id === productId);
        if (product) {
          dispatch({ type: "WISHLIST_ADD", payload: product });
        }
        showToast(t("wishlist.add_success"), "success");
      }
    } catch (err) {
      showToast(t("wishlist.error"), "error");
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      className="absolute top-3 left-3 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:scale-110 transition-all cursor-pointer"
      aria-label={
        isInWishlist ? t("wishlist.remove_success") : t("wishlist.add_success")
      }
    >
      {isInWishlist ? (
        <FaHeart className={`${sizeClasses[size]} text-red-500`} />
      ) : (
        <FaRegHeart className={`${sizeClasses[size]} text-gray-700`} />
      )}
    </button>
  );
}
