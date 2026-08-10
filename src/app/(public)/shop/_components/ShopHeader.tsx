import ActiveFilters from "./ActiveFilters";
import SortControls from "./SortControls";
import { SearchParams } from "@/types";

interface ShopHeaderProps {
  params: SearchParams;
  medicinesCount: number;
  totalCount: number;

  search: string;
  category: string[];
  manufacturer: string[];

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
  totalCount,
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
    <div className="mb-6 flex flex-col gap-4 rounded-xl border border-border-default bg-card p-4 md:flex-row md:items-center md:justify-between">
      <ActiveFilters
        params={params}
        search={search}
        category={category}
        manufacturer={manufacturer}
        minPrice={minPrice}
        maxPrice={maxPrice}
        isFeatured={isFeatured}
      />

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border-default pt-3 sm:justify-end md:border-t-0 md:pt-0">
        <p className="text-xs font-medium text-muted-foreground sm:text-sm">
          Showing{" "}
          <span className="font-bold text-foreground">{medicinesCount}</span>{" "}
          {medicinesCount === 1 ? "result" : "results"}
          {totalCount > 0 && totalCount !== medicinesCount && (
            <>
              {" "}
              of{" "}
              <span className="font-bold text-brand-700">{totalCount}</span>
            </>
          )}
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
