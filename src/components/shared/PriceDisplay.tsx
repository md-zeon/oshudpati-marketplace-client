interface PriceDisplayProps {
  current: number;
  original: number | null;
  size?: "sm" | "md" | "lg";
}

const currentSizeMap = {
  sm: "text-sm font-bold text-slate-800",
  md: "text-base font-bold text-slate-800",
  lg: "text-3xl font-black text-slate-900",
};

const originalSizeMap = {
  sm: "text-xs text-slate-400 line-through",
  md: "text-sm text-slate-400 line-through",
  lg: "text-base text-slate-400 line-through",
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
