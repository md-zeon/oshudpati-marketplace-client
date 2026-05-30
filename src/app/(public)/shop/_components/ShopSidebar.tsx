import { SlidersHorizontal } from "lucide-react";
import { ShopSidebarProps } from "@/types";
import CategoryFilter from "./CategoryFilter";
import PriceFilter from "./PriceFilter";
import ManufacturerFilter from "./ManufacturerFilter";
import FeaturedFilter from "./FeaturedFilter";

export default function ShopSidebar({
  categories,
  manufacturers,
  params,
  filters,
}: ShopSidebarProps) {
  return (
    <aside className="w-full lg:w-68 shrink-0">
      <div className="border border-slate-200/60 rounded-xl bg-white p-5 shadow-xs space-y-6">
        <div className="flex items-center gap-2 font-bold text-xs text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">
          <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
          Filter Matrix
        </div>

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
      </div>
    </aside>
  );
}
