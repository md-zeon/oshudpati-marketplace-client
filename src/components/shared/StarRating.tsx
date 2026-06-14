import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
}

const sizeMap = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

export function StarRating({
  rating,
  reviewCount,
  size = "sm",
  showCount = true,
}: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`${sizeMap[size]} ${
            i < Math.round(rating)
              ? "text-amber-400 fill-amber-400"
              : "text-slate-200"
          }`}
        />
      ))}
      {showCount && reviewCount !== undefined && (
        <span className="text-[10px] text-slate-400 ml-1">({reviewCount})</span>
      )}
    </div>
  );
}
