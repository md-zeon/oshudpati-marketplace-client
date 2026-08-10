import { SlidersHorizontal } from "lucide-react";
import { ShopSidebarProps } from "@/types";
import { MobileFilters } from "./MobileFilters";
import CategoryFilter from "./CategoryFilter";
import PriceFilter from "./PriceFilter";
import ManufacturerFilter from "./ManufacturerFilter";
import FeaturedFilter from "./FeaturedFilter";

interface ShopSidebarWithCountProps extends ShopSidebarProps {
  activeFilterCount: number;
  resultsCount: number;
}

export default function ShopSidebar({
  categories,
  manufacturers,
  params,
  filters,
  activeFilterCount,
  resultsCount,
}: ShopSidebarWithCountProps) {
  const filterSections = (
    <>
      <CategoryFilter
        categories={categories}
        selectedCategory={filters.category}
        params={params}
      />

      <PriceFilter
        params={params}
        search={filters.search}
        selectedCategory={filters.category}
        selectedManufacturer={filters.manufacturer}
        isFeatured={filters.isFeatured}
        viewMode={filters.viewMode}
        sortBy={filters.sortBy}
        limit={filters.limit}
        priceValidationError={filters.priceValidationError}
      />

      <ManufacturerFilter
        manufacturers={manufacturers}
        selectedManufacturer={filters.manufacturer}
        params={params}
      />

      <FeaturedFilter isFeatured={filters.isFeatured} params={params} />
    </>
  );

  return (
    <>
      <MobileFilters activeCount={activeFilterCount} resultsCount={resultsCount}>
        {filterSections}
      </MobileFilters>

      <aside className="hidden w-68 shrink-0 lg:block">
        <div className="space-y-6 rounded-xl border border-border-default bg-card p-5 shadow-xs">
          <div className="flex items-center gap-2 border-b border-border-default pb-3 text-xs font-bold uppercase tracking-wider text-brand-900">
            <SlidersHorizontal className="h-3.5 w-3.5 text-brand-600" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-700 px-1.5 text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </div>

          {filterSections}
        </div>
      </aside>
    </>
  );
}
