import ActiveFilters from "./ActiveFilters";
import SortControls from "./SortControls";
import { SearchParams } from "@/types";

interface ShopHeaderProps {
  params: SearchParams;
  medicinesCount: number;

  search: string;
  category: string;
  manufacturer: string;

  minPrice?: number;
  maxPrice?: number;

  isFeatured: boolean;
  sortBy: string;
  limit: number;
  viewMode: "grid" | "list";
}

export default function ShopHeader({
  params,
  medicinesCount,
  search,
  category,
  manufacturer,
  minPrice,
  maxPrice,
  isFeatured,
  sortBy,
  limit,
  viewMode,
}: ShopHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-4 mb-6">
      <ActiveFilters
        params={params}
        search={search}
        category={category}
        manufacturer={manufacturer}
        minPrice={minPrice}
        maxPrice={maxPrice}
        isFeatured={isFeatured}
      />

      <div className="flex flex-wrap items-center justify-between sm:justify-end gap-4 border-t pt-3 md:border-t-0 md:pt-0">
        <p className="text-xs font-medium text-slate-400">
          Showing{" "}
          <span className="font-bold text-slate-800">{medicinesCount}</span>{" "}
          results
        </p>

        <SortControls
          params={params}
          sortBy={sortBy}
          limit={limit}
          viewMode={viewMode}
        />
      </div>
    </div>
  );
}
