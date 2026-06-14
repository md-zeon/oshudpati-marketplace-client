import { Medicine } from "@/types";
import { Pill, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { WishlistButton } from "@/components/shared/wishlist/WishlistButton";
import { getPrimaryImage, getPrices, getDiscountPercentage } from "@/lib/utils";
import { PriceDisplay } from "@/components/shared/PriceDisplay";

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

  return (
    <div className="relative group bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
      {showWishlist && (
        <div className="absolute top-3 right-3 z-10">
          <WishlistButton
            medicineId={medicine.id}
            isWishlisted={isWishlisted}
          />
        </div>
      )}
      <Link href={`/medicine/${medicine.slug}`}>
        <div className="relative w-full h-36 bg-slate-50 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
          {image ? (
            <Image
              src={image}
              alt={medicine.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <Pill className="w-10 h-10 text-slate-300" />
          )}
          {discount && discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
        </div>
        <p className="text-[11px] text-emerald-600 font-semibold uppercase mb-0.5">
          {medicine.genericName}
        </p>
        <p className="text-sm font-semibold text-slate-900 line-clamp-2 leading-tight">
          {medicine.name}
        </p>
        <div className="flex items-center gap-1 mt-1.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${
                i < Math.round(medicine.averageRating)
                  ? "text-amber-400 fill-amber-400"
                  : "text-slate-200"
              }`}
            />
          ))}
          <span className="text-[10px] text-slate-400 ml-1">
            ({medicine.reviewCount})
          </span>
        </div>
        <div className="mt-2">
          <PriceDisplay
            current={salePrice || regularPrice}
            original={discount ? regularPrice : null}
          />
        </div>
      </Link>
    </div>
  );
}
