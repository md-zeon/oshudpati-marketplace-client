import { MedicineCardGridSkeleton } from "@/components/shared/medicine/MedicineCardSkeleton";

export default function ShopLoading() {
  return (
    <div className="mx-auto max-w-350 px-4 py-8">
      <div className="h-10 bg-slate-100 rounded-lg animate-pulse mb-8" />
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="hidden lg:block w-64 shrink-0 space-y-4">
          <div className="h-64 bg-slate-100 rounded-xl animate-pulse" />
        </div>
        <main className="flex-1">
          <MedicineCardGridSkeleton count={9} />
        </main>
      </div>
    </div>
  );
}
