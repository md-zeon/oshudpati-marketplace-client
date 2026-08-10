import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Medicine, Review } from "@/types";
import { ReviewList } from "./ReviewList";
import { ReviewFormWrapper } from "./ReviewFormWrapper";
import { ReviewService } from "@/services/review.service";
import { Stethoscope, Syringe, Info } from "lucide-react";

interface AdditionalInfoTabsProps {
  medicine: Medicine;
}

const AdditionalInfoTabs = async ({ medicine }: AdditionalInfoTabsProps) => {
  if (!medicine) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center p-4 text-center">
        <p className="text-lg font-semibold text-brand-900">
          No additional information available
        </p>
      </div>
    );
  }

  let reviews: Review[] = [];
  try {
    const res = await ReviewService.getMedicineReviews(medicine.id);
    if (res?.success) {
      reviews = (res.data as Review[]) || [];
    }
  } catch (error) {
    console.error("Error fetching reviews:", error);
  }

  return (
    <div className="mt-10">
      <Tabs defaultValue="Details" className="w-full">
        <TabsList className="w-full justify-start gap-1 overflow-x-auto rounded-xl border border-border-default bg-surface-card p-1 sm:w-fit">
          <TabsTrigger
            value="Details"
            className="h-9 gap-1.5 rounded-lg px-4 text-sm font-semibold text-muted-foreground data-[state=active]:bg-brand-700 data-[state=active]:text-white"
          >
            <Info className="h-3.5 w-3.5" aria-hidden="true" />
            Details
          </TabsTrigger>
          <TabsTrigger
            value="Additional Information"
            className="h-9 gap-1.5 rounded-lg px-4 text-sm font-semibold text-muted-foreground data-[state=active]:bg-brand-700 data-[state=active]:text-white"
          >
            <Stethoscope className="h-3.5 w-3.5" aria-hidden="true" />
            Additional Information
          </TabsTrigger>
          <TabsTrigger
            value="Reviews"
            className="h-9 gap-1.5 rounded-lg px-4 text-sm font-semibold text-muted-foreground data-[state=active]:bg-brand-700 data-[state=active]:text-white"
          >
            <Syringe className="h-3.5 w-3.5" aria-hidden="true" />
            Reviews ({medicine.reviewCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="Details" className="mt-6 outline-none">
          <div className="mx-auto max-w-none">
            <h3 className="mb-4 text-lg font-bold text-brand-900">
              Product Overview
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {medicine.description}
            </p>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-brand-100 bg-brand-50 p-4">
                <h4 className="mb-2 font-bold text-brand-900">Indications</h4>
                <p className="text-sm leading-relaxed text-brand-800">
                  {medicine.indications}
                </p>
              </div>
              <div className="rounded-lg border border-trust-200 bg-trust-50 p-4">
                <h4 className="mb-2 font-bold text-trust-700">
                  Dosage Instructions
                </h4>
                <p className="text-sm leading-relaxed text-trust-600">
                  {medicine.dosageInstructions}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="Additional Information" className="mt-6 outline-none">
          <div className="rounded-xl border border-border-default bg-card">
            <div className="flex border-b border-border-default px-5 py-4">
              <span className="w-40 shrink-0 text-sm font-semibold text-muted-foreground">
                Manufacturer
              </span>
              <span className="text-sm text-foreground">
                {medicine.manufacturerName}
              </span>
            </div>
            <div className="flex border-b border-border-default px-5 py-4">
              <span className="w-40 shrink-0 text-sm font-semibold text-muted-foreground">
                Generic Name
              </span>
              <span className="text-sm italic text-foreground">
                {medicine.genericName}
              </span>
            </div>
            <div className="flex border-b border-border-default px-5 py-4">
              <span className="w-40 shrink-0 text-sm font-semibold text-muted-foreground">
                Dosage Form
              </span>
              <span className="text-sm capitalize text-foreground">
                {medicine.dosageForm.toLowerCase()}
              </span>
            </div>
            <div className="flex border-b border-border-default px-5 py-4">
              <span className="w-40 shrink-0 text-sm font-semibold text-muted-foreground">
                Side Effects
              </span>
              <span className="flex-1 text-sm text-danger">
                {medicine.sideEffects}
              </span>
            </div>
            <div className="flex px-5 py-4">
              <span className="w-40 shrink-0 text-sm font-semibold text-muted-foreground">
                SKU
              </span>
              <span className="text-sm text-foreground">{medicine.sku}</span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="Reviews" className="mt-6 outline-none">
          <div className="space-y-8">
            <ReviewList reviews={reviews} />

            <ReviewFormWrapper
              medicineId={medicine.id}
              medicineName={medicine.name}
              totalReviews={reviews.length}
              reviews={reviews}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdditionalInfoTabs;
