import { Skeleton } from "@/components/ui/skeleton";
import { MedicineCardGridSkeleton } from "@/components/shared/medicine/MedicineCardSkeleton";

export default function ShopLoading() {
  return (
    <div className="mx-auto max-w-350 px-4 py-8">
      <Skeleton className="mb-6 h-20 w-full rounded-xl" />

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        <div className="hidden w-68 shrink-0 lg:block">
          <Skeleton className="h-105 w-full rounded-xl" />
        </div>

        <main className="min-w-0 flex-1">
          <MedicineCardGridSkeleton count={9} />
        </main>
      </div>
    </div>
  );
}
