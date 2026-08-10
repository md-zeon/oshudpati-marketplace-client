import { MedicineService } from "@/services/medicine.service";
import { getPrices, getDiscountPercentage } from "@/lib/utils";
import { Medicine } from "@/types";
import { BadgeCheck, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { MedicineActions } from "./_components/MedicineActions";
import { WishlistButton } from "@/components/shared/wishlist/WishlistButton";
import AdditionalInfoTabs from "./_components/AdditionalInfoTabs";
import { MedicineGallery } from "./_components/MedicineGallery";
import { StarRating } from "@/components/shared/StarRating";
import { Badge } from "@/components/ui/badge";

interface Props {
  params: Promise<{ slug: string }>;
}

const MedicineDetails = async ({ params }: Props) => {
  const { slug } = await params;

  const res = await MedicineService.getMedicineBySlug(slug, {
    revalidate: 60,
  });

  const medicine: Medicine | null = res?.success ? res?.data : null;

  if (!medicine) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
        <p className="text-xl font-semibold text-brand-900">
          Medicine not found
        </p>
        <Link
          href="/shop"
          className="mt-4 text-sm font-medium text-brand-700 hover:text-brand-800 hover:underline"
        >
          Go back to shop
        </Link>
      </div>
    );
  }

  const { regularPrice, salePrice } = getPrices(medicine);
  const discount = getDiscountPercentage(regularPrice, salePrice);
  const isInStock = medicine.stockQuantity > 0;

  const savings = salePrice ? regularPrice - salePrice : 0;

  return (
    <div className="py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
        {/* IMAGE SECTION */}
        <div className="relative rounded-2xl border border-border-default bg-card p-5">
          {discount && discount > 0 && (
            <Badge
              className="absolute top-4 left-4 z-10 bg-accent-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm"
              aria-label={`${discount}% discount`}
            >
              {discount}% OFF
            </Badge>
          )}

          <div className="absolute top-4 right-4 z-10">
            <WishlistButton medicineId={medicine.id} size="md" />
          </div>

          <MedicineGallery images={medicine.images} name={medicine.name} />
        </div>

        {/* DETAILS SECTION */}
        <div className="flex flex-col gap-4">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-brand-700">
              {medicine.genericName}
            </p>
            <h1 className="text-2xl font-extrabold leading-tight text-brand-900 sm:text-3xl">
              {medicine.name}{" "}
              {medicine.strength && (
                <span className="text-lg font-medium text-muted-foreground sm:text-xl">
                  {medicine.strength}
                </span>
              )}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-md border border-border-default bg-surface-card px-2.5 py-1.5">
              <StarRating
                rating={Math.round(medicine.averageRating || 0)}
                size="md"
                showCount={false}
              />
              <span className="text-xs font-semibold text-foreground">
                {medicine.averageRating.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">
                ({medicine.reviewCount} reviews)
              </span>
            </span>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">
            {medicine.shortDescription}
          </p>

          <div className="h-px bg-border-default" />

          {/* Price Layout */}
          <div className="rounded-xl border border-accent-200 bg-accent-50 p-4">
            <div className="flex flex-wrap items-baseline gap-3">
              <p className="text-3xl font-black text-brand-900">
                ৳{(salePrice || regularPrice).toFixed(2)}
              </p>
              {salePrice && salePrice < regularPrice && (
                <p className="text-base font-medium text-muted-foreground line-through">
                  ৳{regularPrice.toFixed(2)}
                </p>
              )}
              {savings > 0 && (
                <span className="text-sm font-bold text-accent-600">
                  You save ৳{savings.toFixed(2)}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs font-medium text-muted-foreground">
              Price per pack ({medicine.unitPresentation})
            </p>
          </div>

          {/* Core Metadata Grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl border border-border-default bg-surface-card p-4 text-xs text-muted-foreground">
            <div>
              <span className="mb-0.5 block font-semibold uppercase tracking-wide text-text-muted">
                Manufacturer
              </span>
              <span className="font-medium text-foreground">
                {medicine.manufacturerName}
              </span>
            </div>
            <div>
              <span className="mb-0.5 block font-semibold uppercase tracking-wide text-text-muted">
                Dosage form
              </span>
              <span className="font-medium capitalize text-foreground">
                {medicine.dosageForm.toLowerCase()}
              </span>
            </div>
            <div className="col-span-2">
              <span className="mb-0.5 block font-semibold uppercase tracking-wide text-text-muted">
                Availability
              </span>
              {isInStock ? (
                <span className="flex items-center gap-1.5 font-semibold text-success">
                  <BadgeCheck
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                  In stock — {medicine.stockQuantity}{" "}
                  {medicine.stockQuantity === 1 ? "pack" : "packs"} available
                </span>
              ) : (
                <span className="flex items-center gap-1.5 font-semibold text-danger">
                  <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                  Out of stock
                </span>
              )}
            </div>
          </div>

          {/* Trust signals */}
          <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground sm:grid-cols-3">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-brand-700" aria-hidden="true" />
              Genuine & approved
            </span>
            <span className="flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-brand-700" aria-hidden="true" />
              Fast delivery in BD
            </span>
            <span className="flex items-center gap-1.5">
              <BadgeCheck className="h-4 w-4 text-brand-700" aria-hidden="true" />
              Cash on delivery
            </span>
          </div>

          {/* Dynamic Client Actions */}
          <MedicineActions medicine={medicine} />
        </div>
      </div>

      {/* ADDITIONAL MEDICAL INFORMATION SECTIONS */}
      <AdditionalInfoTabs medicine={medicine} />
    </div>
  );
};

export default MedicineDetails;
