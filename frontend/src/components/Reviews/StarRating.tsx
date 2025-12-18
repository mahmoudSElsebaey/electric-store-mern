// src/components/StarRating.tsx
import { useState } from "react";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

type StarRatingProps = {
  rating: number | null | undefined;
  size?: "sm" | "md" | "lg" | "xl";
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
};

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
};

export default function StarRating({
  rating = 0,
  size = "md",
  interactive = false,
  onRatingChange,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  // تحويل null أو undefined إلى 0
  const safeRating = Number(rating ?? 0);
  const displayRating = interactive ? (hoverRating || safeRating) : safeRating;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => {
        const starValue = i + 1;
        const filled = displayRating >= starValue;
        const half = !filled && displayRating >= starValue - 0.5;

        return (
          <div
            key={i}
            className={`${interactive ? "cursor-pointer" : ""}`}
            onClick={() => interactive && onRatingChange?.(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(0)}
          >
            {filled ? (
              <FaStar className={`${sizeClasses[size]} text-yellow-400 drop-shadow`} />
            ) : half ? (
              <FaStarHalfAlt className={`${sizeClasses[size]} text-yellow-400 drop-shadow`} />
            ) : (
              <FaRegStar className={`${sizeClasses[size]} text-gray-300`} />
            )}
          </div>
        );
      })}
    </div>
  );
}