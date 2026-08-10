import { Medicine } from "@/types";
import { CircleCheck, CircleX } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { WishlistButton } from "@/components/shared/wishlist/WishlistButton";
import { StarRating } from "@/components/shared/StarRating";
import { Badge } from "@/components/ui/badge";

import {
  getPrimaryImage,
  getPrices,
  getDiscountPercentage,
} from "@/lib/utils";
import ProductCardAddToCart from "./ProductCardAddToCart";

interface ProductCardProps {
  medicine: Medicine;
  viewMode: "grid" | "list";
  isWishlisted: boolean;
}

export function ProductCard({
  medicine,
  viewMode,
  isWishlisted,
}: ProductCardProps) {
  const isList = viewMode === "list";
  const isInStock = medicine.stockQuantity > 0;

  const primaryImage = getPrimaryImage(medicine);

  const { regularPrice, salePrice } = getPrices(medicine);

  const discountPercentage = getDiscountPercentage(regularPrice, salePrice);

  const rating = Math.round(medicine.averageRating || 0);

  return (
    <div
      className={`group relative flex overflow-hidden rounded-xl border border-border-default bg-card transition-all duration-200 hover:border-brand-200 hover:shadow-md ${
        isList
          ? "w-full flex-row items-center gap-6 p-5"
          : "flex-col justify-between p-4 h-full"
      }`}
    >
      {discountPercentage && discountPercentage > 0 && (
        <Badge
          className="absolute top-3 left-3 z-10 bg-accent-500 px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-white shadow-xs"
          aria-label={`${discountPercentage}% discount`}
        >
          {discountPercentage}% OFF
        </Badge>
      )}

      <div className="absolute top-3 right-3 z-10">
        <WishlistButton medicineId={medicine.id} isWishlisted={isWishlisted} />
      </div>

      <Link
        href={`/medicine/${medicine.slug}`}
        className={isList ? "shrink-0" : "block"}
      >
        <div
          className={`relative flex items-center justify-center overflow-hidden rounded-xl border border-border-default/60 bg-surface-card ${
            isList ? "h-44 w-44" : "mb-4 aspect-square w-full"
          }`}
        >
          <Image
            src={primaryImage}
            alt={medicine.name}
            width={300}
            height={300}
            sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 300px"
            className="h-4/5 w-4/5 object-contain transition-transform duration-300 group-hover:scale-105"
          />
          {!isInStock && (
            <span className="absolute inset-0 flex items-center justify-center bg-background/55 backdrop-blur-[1px]">
              <span className="flex items-center gap-1.5 rounded-full border border-border-default bg-card px-2.5 py-1 text-[10px] font-bold text-muted-foreground shadow-xs">
                <CircleX className="h-3 w-3 text-danger" aria-hidden="true" />
                Out of stock
              </span>
            </span>
          )}
        </div>
      </Link>

      <div className="flex h-full w-full flex-1 flex-col justify-between">
        <div>
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <StarRating
              rating={rating}
              reviewCount={medicine.reviewCount}
              size="sm"
            />
            {isInStock ? (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-success">
                <CircleCheck className="h-3 w-3" aria-hidden="true" />
                In stock
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-danger">
                <CircleX className="h-3 w-3" aria-hidden="true" />
                Out
              </span>
            )}
          </div>

          <h2 className="text-sm font-bold leading-tight tracking-tight text-brand-900">
            <Link
              href={`/medicine/${medicine.slug}`}
              className="hover:text-brand-700"
            >
              {medicine.name}
            </Link>
          </h2>

          <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-brand-700">
            {medicine.genericName}
          </p>

          {medicine.strength && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {medicine.strength} · {medicine.dosageForm}
            </p>
          )}

          <p
            className={`mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-2 ${
              isList ? "max-w-2xl" : ""
            }`}
          >
            {medicine.shortDescription ||
              "No description available for this product."}
          </p>
        </div>

        <div
          className={`mt-auto flex items-center justify-between border-t border-border-default/80 pt-3 ${
            isList
              ? "ml-auto w-full max-w-xs flex-col items-end gap-3 border-t-0 pt-0"
              : "mt-3"
          }`}
        >
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-foreground">
                ৳{(salePrice || regularPrice).toFixed(2)}
              </span>
              {salePrice && (
                <span className="text-xs text-muted-foreground line-through">
                  ৳{regularPrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {medicine.dosageForm || "Tablet"} •{" "}
              {medicine.unitPresentation || "10 Strips"}
            </p>
          </div>

          <ProductCardAddToCart medicine={medicine} isList={isList} />
        </div>
      </div>
    </div>
  );
}
