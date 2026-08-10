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
    <div
      className="flex items-center gap-1"
      role="img"
      aria-label={`Rated ${rating} out of 5${reviewCount !== undefined ? ` from ${reviewCount} reviews` : ""}`}
    >
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={`${sizeMap[size]} ${
            i < Math.round(rating)
              ? "fill-accent-500 text-accent-500"
              : "text-muted"
          }`}
        />
      ))}
      {showCount && reviewCount !== undefined && (
        <span className="ml-1 text-[10px] text-muted-foreground">
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
