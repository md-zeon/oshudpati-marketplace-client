import { Skeleton } from "@/components/ui/skeleton";

export function MedicineCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl border border-border-default bg-card p-4">
      <Skeleton className="mb-3 h-36 w-full rounded-lg" />
      <Skeleton className="mb-2 h-3 w-16" />
      <Skeleton className="mb-1 h-4 w-full" />
      <Skeleton className="mb-1 h-4 w-3/4" />
      <Skeleton className="mb-2.5 h-3 w-24" />
      <div className="mb-2.5 flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-3 w-3 rounded-sm" />
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );
}

export function MedicineCardGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 xl:grid-cols-3">
      {[...Array(count)].map((_, i) => (
        <MedicineCardSkeleton key={i} />
      ))}
    </div>
  );
}
