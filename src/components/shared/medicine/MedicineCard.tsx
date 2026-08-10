import { Medicine } from "@/types";
import { Pill, Star, CircleCheck, CircleX } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { WishlistButton } from "@/components/shared/wishlist/WishlistButton";
import { getPrimaryImage, getPrices, getDiscountPercentage } from "@/lib/utils";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { Badge } from "@/components/ui/badge";

interface MedicineCardProps {
  medicine: Medicine;
  isWishlisted?: boolean;
  showWishlist?: boolean;
}

export async function MedicineCard({
  medicine,
  isWishlisted = false,
  showWishlist = true,
}: MedicineCardProps) {
  const image = getPrimaryImage(medicine);
  const { regularPrice, salePrice } = getPrices(medicine);
  const discount = getDiscountPercentage(regularPrice, salePrice);
  const isInStock = medicine.stockQuantity > 0;

  return (
    <div className="relative group flex flex-col rounded-xl border border-border-default bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md">
      {showWishlist && (
        <div className="absolute top-3 right-3 z-10">
          <WishlistButton
            medicineId={medicine.id}
            isWishlisted={isWishlisted}
          />
        </div>
      )}
      <Link href={`/medicine/${medicine.slug}`} className="flex flex-1 flex-col">
        <div className="relative flex h-36 w-full items-center justify-center overflow-hidden rounded-lg border border-border-default/60 bg-surface-card p-3">
          {image ? (
            <Image
              src={image}
              alt={medicine.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-contain transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <Pill className="h-10 w-10 text-muted-foreground" />
          )}
          {discount && discount > 0 && (
            <Badge
              className="absolute top-1.5 left-1.5 bg-accent-500 px-2 py-0.5 text-[10px] font-bold text-white"
              aria-label={`${discount}% discount`}
            >
              -{discount}%
            </Badge>
          )}
          {!isInStock && (
            <span className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
              <span className="flex items-center gap-1.5 rounded-full border border-border-default bg-card px-2.5 py-1 text-[10px] font-bold text-muted-foreground shadow-xs">
                <CircleX className="h-3 w-3 text-danger" aria-hidden="true" />
                Out of stock
              </span>
            </span>
          )}
        </div>
        <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-brand-700">
          {medicine.genericName}
        </p>
        <p className="mt-0.5 text-sm font-semibold leading-tight text-brand-900 line-clamp-2">
          {medicine.name}
        </p>
        {medicine.strength && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            {medicine.strength} · {medicine.dosageForm}
          </p>
        )}
        <div
          className="mt-1.5 flex items-center gap-1"
          role="img"
          aria-label={`Rated ${medicine.averageRating} out of 5 from ${medicine.reviewCount} reviews`}
        >
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              aria-hidden="true"
              className={`h-3 w-3 ${
                i < Math.round(medicine.averageRating)
                  ? "fill-accent-500 text-accent-500"
                  : "fill-muted text-muted"
              }`}
            />
          ))}
          <span className="ml-1 text-[10px] text-muted-foreground">
            ({medicine.reviewCount})
          </span>
        </div>
        <div className="mt-auto pt-2.5">
          <div className="flex items-center justify-between gap-2">
            <PriceDisplay
              current={salePrice || regularPrice}
              original={discount ? regularPrice : null}
            />
            {isInStock ? (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-success">
                <CircleCheck className="h-3 w-3" aria-hidden="true" />
                In stock
              </span>
            ) : null}
          </div>
        </div>
      </Link>
    </div>
  );
}
