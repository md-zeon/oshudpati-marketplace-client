import { Skeleton } from "@/components/ui/skeleton";

const WishlistSkeleton = () => {
  return (
    <div
      className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4"
      aria-hidden="true"
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-border-default bg-card p-3 sm:p-4"
        >
          <Skeleton className="aspect-[4/3] w-full rounded-xl bg-muted" />
          <Skeleton className="mt-3 h-3 w-16 rounded-full bg-muted" />
          <Skeleton className="mt-2.5 h-4 w-full rounded-md bg-muted" />
          <Skeleton className="mt-1.5 h-4 w-2/3 rounded-md bg-muted" />
          <Skeleton className="mt-3 h-10 w-full rounded-xl bg-muted" />
        </div>
      ))}
    </div>
  );
};

export default WishlistSkeleton;
