import { Medicine } from "@/types";
import { Star, ShoppingBag, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  medicine: Medicine;
  viewMode: "grid" | "list";
}

export function ProductCard({ medicine, viewMode }: ProductCardProps) {
  // Use the primary image index from database structure or fallback securely
  const primaryImage =
    medicine.images?.find((img) => img.isPrimary)?.imageUrl ||
    medicine.images?.[0]?.imageUrl ||
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=500";

  const regularPrice = parseFloat(medicine.price || "0");
  const salePrice = medicine.discountPrice
    ? parseFloat(medicine.discountPrice)
    : null;

  // Calculate discount percentage badge
  const discountPercentage =
    salePrice && regularPrice > 0
      ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
      : null;

  const isList = viewMode === "list";

  return (
    <div
      className={`bg-white border border-slate-200/60 rounded-xl transition-all duration-200 hover:shadow-md relative flex group overflow-hidden ${
        isList
          ? "w-full flex-row p-5 gap-6 items-center"
          : "flex-col p-4 justify-between h-full"
      }`}
    >
      {/* Discount Tag Badge */}
      {discountPercentage && discountPercentage > 0 && (
        <span className="absolute top-3 left-3 z-10 bg-emerald-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded shadow-xs tracking-wider">
          {discountPercentage}% OFF
        </span>
      )}

      {/* Wishlist Action Indicator */}
      <Button
        aria-label="Wishlist"
        variant="ghost"
        size="icon"
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 text-slate-400 hover:text-rose-500 border border-slate-100 shadow-xs backdrop-blur-xs"
      >
        <Heart className="w-4 h-4" />
      </Button>

      {/* Media Containment Block */}
      <div
        className={`bg-slate-50/60 rounded-xl flex items-center justify-center shrink-0 border border-slate-100/80 relative overflow-hidden ${
          isList ? "w-44 h-44" : "w-full h-48 mb-4"
        }`}
      >
        <img
          src={primaryImage}
          alt={medicine.name}
          className="w-4/5 h-4/5 object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content Meta Wrapper Block */}
      <div className="flex-1 flex flex-col justify-between h-full w-full">
        <div>
          {/* Dynamic Mock Stars Row matched to design values */}
          <div className="flex items-center gap-1 mb-1.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-3.5 h-3.5 fill-amber-400 text-amber-400 stroke-amber-400"
              />
            ))}
            <span className="text-[11px] text-slate-400 font-bold ml-1">
              {medicine.averageRating
                ? medicine.averageRating.toFixed(2)
                : "5.00"}
            </span>
          </div>

          {/* Product Identification Headline */}
          <h2 className="text-sm font-bold text-slate-900 tracking-tight leading-tight group-hover:text-emerald-600 transition-colors">
            {medicine.name}{" "}
            {medicine.strength && (
              <span className="text-xs font-normal text-slate-400 font-mono">
                ({medicine.strength})
              </span>
            )}
          </h2>

          {/* Generic Chemical Matrix Nomenclature Name */}
          <p className="text-[11px] font-bold text-emerald-600 tracking-wide mt-1 mb-2 uppercase">
            {medicine.genericName}
          </p>

          {/* Dynamic Snippet Details Description */}
          <p
            className={`text-xs text-slate-500 leading-relaxed line-clamp-2 ${isList ? "max-w-2xl mb-0" : "mb-4"}`}
          >
            {medicine.shortDescription ||
              "No formulation metadata synopsis has been provided for this medical entry index."}
          </p>
        </div>

        {/* Pricing Actions Matrix Block */}
        <div
          className={`flex items-center justify-between border-t border-slate-100/80 pt-3 mt-auto ${
            isList
              ? "w-full max-w-xs ml-auto border-t-0 pt-0 mt-0 flex-col gap-3 items-end"
              : ""
          }`}
        >
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-slate-900 tracking-tight">
                ৳{(salePrice || regularPrice).toFixed(2)}
              </span>
              {salePrice && (
                <span className="text-xs text-slate-400 line-through font-medium">
                  ৳{regularPrice.toFixed(2)}
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
              {medicine.dosageForm || "Tablet"} •{" "}
              {medicine.unitPresentation || "10 Strips"}
            </p>
          </div>

          <Button
            className={`${isList ? "w-full" : ""}`}
            variant="secondary"
            size="lg"
            data-icon="inline-start"
          >
            <ShoppingBag className="w-4 h-4" />
            Add to cart
          </Button>
        </div>
      </div>
    </div>
  );
}
