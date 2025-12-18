import { format } from "date-fns";
import StarRating from "./StarRating";
import api from "../../services/api";
import { useToast } from "../../context/ToastContext";
import { useStore } from "../../context/StoreContext";

type Review = {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
};

type ReviewCardProps = {
  review: Review;
  productId: string;
  onDelete: () => void;
};

export default function ReviewCard({
  review,
  productId,
  onDelete,
}: ReviewCardProps) {
  const { state } = useStore();
  const { showToast } = useToast();

  const isAdmin = ["admin", "owner"].includes(state.user?.role || "");

  const handleDelete = async () => {
    if (!confirm("متأكد من حذف هذا التقييم؟")) return;

    try {
      await api.delete(`/products/${productId}/reviews/${review._id}`);
      showToast("تم حذف التقييم بنجاح", "success");
      onDelete();
      /* eslint-disable-next-line  */
    } catch (err) {
      showToast("فشل حذف التقييم", "error");
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
            {review.name[0].toUpperCase()}
          </div>
          <div>
            <h4 className="font-bold text-lg">{review.name}</h4>
            <p className="text-sm text-gray-500">
              {format(new Date(review.createdAt), "dd MMMM yyyy")}
            </p>
          </div>
        </div>

        <StarRating rating={review.rating} size="lg" />
      </div>

      {review.comment && (
        <p className="mt-4 text-gray-700 leading-relaxed">{review.comment}</p>
      )}

      {isAdmin && (
        <button
          onClick={handleDelete}
          className="mt-4 text-red-600 hover:text-red-800 font-medium text-sm"
        >
          حذف التقييم
        </button>
      )}
    </div>
  );
}
