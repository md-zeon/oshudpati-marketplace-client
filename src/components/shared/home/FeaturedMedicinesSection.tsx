import Link from "next/link";
import Image from "next/image";
import { Medicine } from "@/types";
import { SectionHeader } from "@/components/shared/SectionHeader";
import MinimalistAddToCart from "./MinimalistAddToCart";

interface FeaturedMedicinesSectionProps {
  medicines: Medicine[];
}

export function FeaturedMedicinesSection({
  medicines,
}: FeaturedMedicinesSectionProps) {
  if (!medicines.length) return null;

  return (
    <section className="w-full">
      <SectionHeader
        title="Featured Medicines"
        description="Handpicked for your health needs"
        viewAllHref="/shop?isFeatured=true"
      />
      <div className="mt-8 divide-y divide-border-default border-t border-b border-border-default md:border-none md:divide-none md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 lg:gap-8">
        {medicines.slice(0, 6).map((medicine) => {
          const primaryImage =
            medicine.images?.find((img) => img.isPrimary) ||
            medicine.images?.[0];
          const originalPrice = parseFloat(medicine.price) || 0;
          const promotionalPrice = parseFloat(medicine.discountPrice) || 0;
          const hasDiscount =
            promotionalPrice > 0 && promotionalPrice < originalPrice;

          return (
            <div
              key={medicine.id}
              className="group flex items-center justify-between py-4 md:p-5 bg-card md:border md:border-border-default md:rounded-2xl md:hover:shadow-md md:hover:border-border-default transition-all duration-300 gap-4"
            >
              {/* Left Side: Product Image & Details Link */}
              <Link
                href={`/medicine/${medicine.slug}`}
                className="flex items-center gap-4 flex-1 min-w-0"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-xl shrink-0 flex items-center justify-center p-2 border border-border-default">
                  <Image
                    src={
                      primaryImage?.imageUrl ||
                      "/images/placeholder-medicine.png"
                    }
                    alt={primaryImage?.altText || medicine.name}
                    width={80}
                    height={80}
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-0.5">
                  {medicine.genericName && (
                    <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider block truncate">
                      {medicine.genericName}
                    </span>
                  )}
                  <h3 className="text-sm sm:text-base font-semibold text-foreground group-hover:text-brand-700 transition-colors line-clamp-1">
                    {medicine.name}
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium truncate">
                    {medicine.strength} • {medicine.dosageForm}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {medicine.manufacturerName}
                  </p>
                </div>
              </Link>

              {/* Right Side: Price & Action */}
              <div className="flex flex-col items-end justify-center space-y-2 shrink-0">
                <div className="text-right">
                  <div className="text-base font-bold text-foreground">
                    ৳{hasDiscount ? medicine.discountPrice : medicine.price}
                  </div>
                  {hasDiscount && (
                    <div className="text-xs text-muted-foreground line-through font-medium">
                      ৳{medicine.price}
                    </div>
                  )}
                </div>

                {/* Action Circle Option */}
                <MinimalistAddToCart medicine={medicine} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
