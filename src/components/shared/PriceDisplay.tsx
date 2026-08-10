interface PriceDisplayProps {
  current: number;
  original: number | null;
  size?: "sm" | "md" | "lg";
}

const currentSizeMap = {
  sm: "text-sm font-bold text-foreground",
  md: "text-base font-bold text-foreground",
  lg: "text-3xl font-black text-brand-900",
};

const originalSizeMap = {
  sm: "text-xs text-muted-foreground/70 line-through",
  md: "text-sm text-muted-foreground/70 line-through",
  lg: "text-base text-muted-foreground/70 line-through",
};

export function PriceDisplay({
  current,
  original,
  size = "sm",
}: PriceDisplayProps) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className={currentSizeMap[size]}>৳{current.toFixed(0)}</span>
      {original && (
        <span className={originalSizeMap[size]}>৳{original.toFixed(0)}</span>
      )}
    </div>
  );
}
