export function MedicineCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse">
      <div className="w-full h-36 bg-slate-100 rounded-lg mb-3" />
      <div className="h-3 w-16 bg-slate-100 rounded mb-2" />
      <div className="h-4 w-full bg-slate-100 rounded mb-1" />
      <div className="h-4 w-3/4 bg-slate-100 rounded mb-3" />
      <div className="flex gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-3 h-3 bg-slate-100 rounded" />
        ))}
      </div>
      <div className="h-4 w-20 bg-slate-100 rounded" />
    </div>
  );
}

export function MedicineCardGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(count)].map((_, i) => (
        <MedicineCardSkeleton key={i} />
      ))}
    </div>
  );
}
