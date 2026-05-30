import { MedicineService } from "@/services/medicine.service";
import { getPrimaryImage, getPrices, getDiscountPercentage } from "@/lib/utils";
import { Medicine } from "@/types";
import { Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { MedicineActions } from "./_components/MedicineActions";
import AdditionalInfoTabs from "./_components/AdditionalInfoTabs";

interface Props {
  params: Promise<{ slug: string }>;
}

const MedicineDetails = async ({ params }: Props) => {
  const { slug } = await params;

  const res = await MedicineService.getMedicineBySlug(slug, {
    revalidate: 60,
  });

  const medicine: Medicine | null = res?.success ? res.data : null;

  if (!medicine) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <p className="text-xl font-semibold text-slate-700">
          Medicine not found
        </p>
        <Link
          href="/shop"
          className="mt-4 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline transition-all"
        >
          Go back to shop
        </Link>
      </div>
    );
  }

  const primaryImage = getPrimaryImage(medicine);
  const { regularPrice, salePrice } = getPrices(medicine);
  const discount = getDiscountPercentage(regularPrice, salePrice);

  return (
    <div className="py-10 tracking-tight">
      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white p-6 shadow-sm">
        {/* IMAGE SECTION */}
        <div className="bg-slate-50 rounded-xl flex items-center justify-center p-8 relative min-h-87.5 ">
          {discount && discount > 0 && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-sm">
              {discount}% OFF
            </span>
          )}

          <div className="relative w-full h-64">
            <Image
              src={primaryImage || "/placeholder-medicine.png"}
              alt={medicine.name}
              fill
              sizes="(max-w-768px) 100vw, 400px"
              className="object-contain mix-blend-multiply"
              priority
            />
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">
              {medicine.genericName}
            </p>
            <h1 className="text-3xl font-extrabold text-slate-900">
              {medicine.name}{" "}
              <span className="text-xl font-medium text-slate-500">
                {medicine.strength}
              </span>
            </h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 bg-slate-50 max-w-fit px-2.5 py-1 rounded-md border border-slate-100">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${medicine.averageRating >= i + 1 ? "text-amber-400 fill-amber-400" : "text-slate-200"}`}
              />
            ))}
            <span className="text-xs font-semibold text-slate-600 ml-1.5">
              {medicine.averageRating.toFixed(1)} ({medicine.reviewCount}{" "}
              reviews)
            </span>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            {medicine.shortDescription}
          </p>

          <div className="h-px bg-slate-100 my-1" />

          {/* Price Layout */}
          <div>
            <div className="flex items-baseline gap-3">
              <p className="text-3xl font-black text-slate-900">
                ৳{(salePrice || regularPrice).toFixed(2)}
              </p>
              {salePrice && salePrice < regularPrice && (
                <p className="text-base text-slate-400 line-through font-medium">
                  ৳{regularPrice.toFixed(2)}
                </p>
              )}
            </div>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Price per pack ({medicine.unitPresentation})
            </p>
          </div>

          {/* Core Metadata Grid */}
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 bg-slate-50/70 p-4 rounded-xl text-xs text-slate-600 border border-slate-100">
            <p>
              <span className="font-semibold text-slate-500 block mb-0.5">
                MANUFACTURER
              </span>{" "}
              <span className="text-slate-900 font-medium">
                {medicine.manufacturerName}
              </span>
            </p>
            <p>
              <span className="font-semibold text-slate-500 block mb-0.5">
                SKU
              </span>{" "}
              <span className="text-slate-900 font-medium">{medicine.sku}</span>
            </p>
            <p>
              <span className="font-semibold text-slate-500 block mb-0.5">
                DOSAGE FORM
              </span>{" "}
              <span className="text-slate-900 font-medium capitalize">
                {medicine.dosageForm.toLowerCase()}
              </span>
            </p>
            <p>
              <span className="font-semibold text-slate-500 block mb-0.5">
                AVAILABILITY
              </span>
              <span
                className={`font-bold ${medicine.stockQuantity > 0 ? "text-emerald-600" : "text-rose-600"}`}
              >
                {medicine.stockQuantity > 0
                  ? `${medicine.stockQuantity} Packs Left`
                  : "Out of Stock"}
              </span>
            </p>
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
