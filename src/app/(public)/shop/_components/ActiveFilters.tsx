import Link from "next/link";
import { X } from "lucide-react";
import { SearchParams } from "@/types";

interface ActiveFiltersProps {
  params: SearchParams;
  search: string;
  category: string;
  manufacturer: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured: boolean;
}

export default function ActiveFilters({
  params,
  search,
  category,
  manufacturer,
  minPrice,
  maxPrice,
  isFeatured,
}: ActiveFiltersProps) {
  const hasActiveFilters = !!(
    search ||
    category ||
    manufacturer ||
    minPrice !== undefined ||
    maxPrice !== undefined ||
    isFeatured
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      {hasActiveFilters && (
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border border-rose-100"
        >
          <X className="w-3.5 h-3.5" />
          Clear filters
        </Link>
      )}

      {category && (
        <Link
          href={{
            pathname: "/shop",
            query: {
              ...params,
              category: undefined,
              page: 1,
            },
          }}
          className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
        >
          Category: {category}
          <X className="w-3 h-3 text-slate-400" />
        </Link>
      )}

      {manufacturer && (
        <Link
          href={{
            pathname: "/shop",
            query: {
              ...params,
              manufacturer: undefined,
              page: 1,
            },
          }}
          className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
        >
          Manufacturer: {manufacturer}
          <X className="w-3 h-3 text-slate-400" />
        </Link>
      )}

      {(minPrice !== undefined || maxPrice !== undefined) && (
        <Link
          href={{
            pathname: "/shop",
            query: {
              ...params,
              min_price: undefined,
              max_price: undefined,
              page: 1,
            },
          }}
          className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
        >
          Price: ৳{minPrice || 0} - ৳{maxPrice || "Max"}
          <X className="w-3 h-3 text-slate-400" />
        </Link>
      )}

      {isFeatured && (
        <Link
          href={{
            pathname: "/shop",
            query: {
              ...params,
              isFeatured: undefined,
              page: 1,
            },
          }}
          className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 px-3 py-1.5 rounded-lg text-xs font-medium border border-amber-100"
        >
          Featured
          <X className="w-3 h-3 text-amber-400" />
        </Link>
      )}

      {search && (
        <Link
          href={{
            pathname: "/shop",
            query: {
              ...params,
              search: undefined,
              page: 1,
            },
          }}
          className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-lg text-xs font-medium border border-emerald-100"
        >
          &quot;{search}&quot;
          <X className="w-3 h-3 text-emerald-400" />
        </Link>
      )}

      {!hasActiveFilters && (
        <p className="text-xs text-slate-400 italic">
          No active filters applied
        </p>
      )}
    </div>
  );
}
