import { Skeleton } from "@/components/ui/skeleton";

export default function MedicineLoading() {
  return (
    <div className="py-10">
      <div className="grid grid-cols-1 gap-10 p-6 lg:grid-cols-2">
        <Skeleton className="min-h-[400px] rounded-xl" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-9 w-3/4 rounded" />
          <Skeleton className="h-5 w-32 rounded" />
          <Skeleton className="h-16 w-full rounded" />
          <div className="h-px bg-border-default" />
          <Skeleton className="h-10 w-40 rounded" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
