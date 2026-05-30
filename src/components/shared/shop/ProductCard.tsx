import { Medicine } from "@/types";
import { Star, ShoppingBag, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

import {
  getPrimaryImage,
  getPrices,
  getDiscountPercentage,
  getRating,
} from "@/lib/utils";
import ProductCardAddToCart from "./ProductCardAddToCart";

interface ProductCardProps {
  medicine: Medicine;
  viewMode: "grid" | "list";
}

export function ProductCard({ medicine, viewMode }: ProductCardProps) {
  const isList = viewMode === "list";

  const primaryImage = getPrimaryImage(medicine);

  const { regularPrice, salePrice } = getPrices(medicine);

  const discountPercentage = getDiscountPercentage(regularPrice, salePrice);

  const rating = getRating(medicine);

  return (
    <div
      className={`bg-white border border-slate-200/60 rounded-xl transition-all duration-200 hover:shadow-md relative flex group overflow-hidden ${
        isList
          ? "w-full flex-row p-5 gap-6 items-center"
          : "flex-col p-4 justify-between h-full"
      }`}
    >
      {/* Discount Badge */}
      {discountPercentage && discountPercentage > 0 && (
        <span className="absolute top-3 left-3 z-10 bg-emerald-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded shadow-xs tracking-wider">
          {discountPercentage}% OFF
        </span>
      )}

      {/* Wishlist (UI only for now) */}
      <Button
        aria-label="Wishlist"
        variant="ghost"
        size="icon"
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 text-slate-400 hover:text-rose-500 border border-slate-100 shadow-xs"
      >
        <Heart className="w-4 h-4" />
      </Button>

      {/* Image */}
      <div
        className={`bg-slate-50/60 rounded-xl flex items-center justify-center shrink-0 border border-slate-100/80 relative overflow-hidden ${
          isList ? "w-44 h-44" : "w-full h-48 mb-4"
        }`}
      >
        <Image
          src={primaryImage}
          alt={medicine.name}
          width={300}
          height={300}
          className="w-4/5 h-4/5 object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between h-full w-full">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 mb-1.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-200"
                }`}
              />
            ))}
            <span className="text-[11px] text-slate-400 font-bold ml-1">
              {medicine.averageRating}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-sm font-bold text-slate-900 tracking-tight leading-tight">
            <Link href={`/medicine/${medicine.slug}`}>
              {medicine.name}{" "}
              {medicine.strength && (
                <span className="text-xs font-normal text-slate-400 font-mono">
                  ({medicine.strength})
                </span>
              )}
            </Link>
          </h2>

          {/* Generic name */}
          <p className="text-[11px] font-bold text-emerald-600 tracking-wide mt-1 mb-2 uppercase">
            {medicine.genericName}
          </p>

          {/* Description */}
          <p
            className={`text-xs text-slate-500 leading-relaxed line-clamp-2 ${
              isList ? "max-w-2xl mb-0" : "mb-4"
            }`}
          >
            {medicine.shortDescription ||
              "No description available for this product."}
          </p>
        </div>

        {/* Footer */}
        <div
          className={`flex items-center justify-between border-t border-slate-100/80 pt-3 mt-auto ${
            isList
              ? "w-full max-w-xs ml-auto border-t-0 pt-0 mt-0 flex-col gap-3 items-end"
              : ""
          }`}
        >
          {/* Price */}
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-slate-900">
                ৳{(salePrice || regularPrice).toFixed(2)}
              </span>

              {salePrice && (
                <span className="text-xs text-slate-400 line-through">
                  ৳{regularPrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
              {medicine.dosageForm || "Tablet"} •{" "}
              {medicine.unitPresentation || "10 Strips"}
            </p>
          </div>

          {/* Add to cart */}
          <ProductCardAddToCart medicine={medicine} isList={isList} />
        </div>
      </div>
    </div>
  );
}
