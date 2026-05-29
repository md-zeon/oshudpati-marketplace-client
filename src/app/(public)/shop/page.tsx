import { MedicineService } from "@/services/medicine.service";
import { CategoryService } from "@/services/category.service";
import { ProductCard } from "@/components/shared/shop/ProductCard";
import {
  Grid,
  List,
  SlidersHorizontal,
  X,
  Check,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Category, Medicine } from "@/types";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import PaginationControls from "@/components/shared/pagination/PaginationControls";

// ================= TYPE DEFINITIONS =================

interface SearchParams {
  page?: string;
  search?: string;
  category?: string;
  min_price?: string;
  max_price?: string;
  isFeatured?: string;
  viewMode?: string;
  manufacturer?: string;
  sortBy?: string;
  limit?: string;
}

interface ShopPageProps {
  searchParams: Promise<SearchParams>;
}

// ================= SERVER COMPONENT =================
export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedParams = await searchParams;

  // Parse and sanitize search parameters from URL
  console.log("Received search parameters:", resolvedParams);
  const page = resolvedParams.page ? parseInt(resolvedParams.page, 10) : 1;
  const limit = resolvedParams.limit ? parseInt(resolvedParams.limit, 10) : 16;
  const search = resolvedParams.search || "";
  const selectedCategory = resolvedParams.category || "";
  const selectedManufacturer = resolvedParams.manufacturer || "";
  const isFeatured = resolvedParams.isFeatured === "true";
  const viewMode = resolvedParams.viewMode === "list" ? "list" : "grid";
  const sortBy = resolvedParams.sortBy || "createdAt";

  // Price conversion with fallback boundaries
  let minPrice = resolvedParams.min_price?.length
    ? Number(resolvedParams.min_price)
    : undefined;
  let maxPrice = resolvedParams.max_price
    ? Number(resolvedParams.max_price)
    : undefined;

  // Form Validation logic parameters for UI feedback
  let priceValidationError = "";
  if (minPrice !== undefined && minPrice < 0) minPrice = 0;
  if (maxPrice !== undefined && maxPrice < 0) maxPrice = 0;
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    priceValidationError = "Min price cannot exceed Max price";
  }

  // 2. Query data sets concurrently on the server
  const [medicineResponse, categoryResponse, manufacturerResponse] =
    await Promise.all([
      MedicineService.getMedicines(
        {
          search,
          isFeatured: isFeatured ? true : undefined,
          page,
          limit,
          category: selectedCategory,
          manufacturer: selectedManufacturer,
          minPrice: priceValidationError ? undefined : minPrice,
          maxPrice: priceValidationError ? undefined : maxPrice,
          sortBy,
        },
        { revalidate: 15 },
      ),
      CategoryService.getCategories({ revalidate: 60 }),
      MedicineService.getManufacturers({ revalidate: 60 }),
    ]);

  const medicines: Medicine[] = medicineResponse?.success
    ? medicineResponse.data
    : [];
  const meta = medicineResponse?.success ? medicineResponse.meta : null;

  const categories: Category[] = categoryResponse?.success
    ? categoryResponse.data
    : [];

  const manufacturerList: { manufacturerName: string }[] =
    manufacturerResponse?.success ? manufacturerResponse.data : [];

  const hasActiveFilters = !!(
    search ||
    selectedCategory ||
    minPrice !== undefined ||
    maxPrice !== undefined ||
    isFeatured ||
    selectedManufacturer
  );

  return (
    <div className="mx-auto max-w-350 px-4 py-8 text-slate-800 antialiased bg-slate-50/30 min-h-screen">
      {/* ================= TOP SUB-BAR: CONTROLS & BADGES ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-xl p-4 mb-6 shadow-xs">
        {/* Render Active Filtering State Tags */}
        <div className="flex flex-wrap items-center gap-2">
          {hasActiveFilters && (
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border border-rose-100"
            >
              <X className="w-3.5 h-3.5" /> Clear filters
            </Link>
          )}

          {selectedCategory && (
            <Link
              href={{
                pathname: "/shop",
                query: { ...resolvedParams, category: undefined, page: 1 },
              }}
              className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              Category: {selectedCategory}{" "}
              <X className="w-3 h-3 text-slate-400 ml-0.5" />
            </Link>
          )}

          {selectedManufacturer && (
            <Link
              href={{
                pathname: "/shop",
                query: { ...resolvedParams, manufacturer: undefined, page: 1 },
              }}
              className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              Manufacturer: {selectedManufacturer}{" "}
              <X className="w-3 h-3 text-slate-400 ml-0.5" />
            </Link>
          )}

          {(minPrice !== undefined || maxPrice !== undefined) &&
            Number(minPrice || 0) <= Number(maxPrice || Infinity) && (
              <Link
                href={{
                  pathname: "/shop",
                  query: {
                    ...resolvedParams,
                    min_price: undefined,
                    max_price: undefined,
                    page: 1,
                  },
                }}
                className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              >
                Price: ৳{minPrice || 0} - ৳{maxPrice || "Max"}{" "}
                <X className="w-3 h-3 text-slate-400 ml-0.5" />
              </Link>
            )}

          {isFeatured && (
            <Link
              href={{
                pathname: "/shop",
                query: { ...resolvedParams, isFeatured: undefined, page: 1 },
              }}
              className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-amber-100"
            >
              Status: Featured <X className="w-3 h-3 text-amber-400 ml-0.5" />
            </Link>
          )}

          {search && (
            <Link
              href={{
                pathname: "/shop",
                query: { ...resolvedParams, search: undefined, page: 1 },
              }}
              className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-emerald-100"
            >
              Keyword: &quot;{search}&quot;{" "}
              <X className="w-3 h-3 text-emerald-400 ml-0.5" />
            </Link>
          )}

          {!hasActiveFilters && (
            <p className="text-xs text-slate-400 italic">
              No active filters applied
            </p>
          )}
        </div>

        {/* Dynamic Display Metrics & Dropdown Selection Sort Tools */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-4 border-t pt-3 md:border-t-0 md:pt-0 border-slate-100">
          <p className="text-xs font-medium text-slate-400">
            Showing{" "}
            <span className="text-slate-800 font-bold">{medicines.length}</span>{" "}
            results
          </p>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown Selector */}
            <div className="relative inline-block text-left group">
              <button className="h-9 px-3 border border-slate-200 rounded-lg bg-white text-xs font-medium inline-flex items-center gap-1.5 text-slate-700 hover:border-slate-300 transition-colors">
                Sort:{" "}
                <span className="text-slate-900 font-bold capitalize">
                  {sortBy.replace("-", " ")}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <div className="absolute right-0 mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg opacity-0 pointer-events-none group-focus-within:opacity-100 group-focus-within:pointer-events-auto group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-30 p-1 space-y-0.5">
                {[
                  { label: "Sort by latest", value: "latest" },
                  { label: "Price: Low to High", value: "price-asc" },
                  { label: "Price: High to Low", value: "price-desc" },
                  { label: "Popularity", value: "popular" },
                ].map((item) => (
                  <Link
                    key={item.value}
                    href={{
                      pathname: "/shop",
                      query: { ...resolvedParams, sortBy: item.value },
                    }}
                    className={`block px-3 py-2 text-xs rounded-md transition-colors ${sortBy === item.value ? "bg-emerald-50 text-emerald-700 font-bold" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Show Count Dropdown Selector */}
            <HoverCard openDelay={20} closeDelay={200}>
              <HoverCardTrigger asChild>
                <button className="h-9 px-3 border border-slate-200 rounded-lg bg-white text-xs font-medium inline-flex items-center gap-1.5 text-slate-700 hover:border-slate-300 transition-colors">
                  Show:{" "}
                  <span className="text-slate-900 font-bold">
                    {limit} Items
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="w-32 bg-background">
                {[12, 16, 24, 32].map((num) => (
                  <Link
                    key={num}
                    href={{
                      pathname: "/shop",
                      query: {
                        ...resolvedParams,
                        limit: num.toString(),
                        page: 1,
                      },
                    }}
                    className={`block px-3 py-2 text-xs rounded-md transition-colors text-center ${limit === num ? "bg-emerald-50 text-emerald-700 font-bold" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    {num} Items
                  </Link>
                ))}
              </HoverCardContent>
            </HoverCard>

            {/* View Architecture Toggle Framework */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200/60">
              <Link
                href={{
                  pathname: "/shop",
                  query: { ...resolvedParams, viewMode: "grid" },
                }}
                className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-white text-slate-900 shadow-xs" : "text-slate-400 hover:text-slate-600"}`}
              >
                <Grid className="w-4 h-4" />
              </Link>
              <Link
                href={{
                  pathname: "/shop",
                  query: { ...resolvedParams, viewMode: "list" },
                }}
                className={`p-1.5 rounded-md transition-all ${viewMode === "list" ? "bg-white text-slate-900 shadow-xs" : "text-slate-400 hover:text-slate-600"}`}
              >
                <List className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SIDEBAR & MAIN COLUMN SPLIT ================= */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* ================= SIDEBAR PANEL FILTERS ================= */}
        <aside className="w-full lg:w-68 shrink-0 space-y-5">
          <div className="border border-slate-200/60 rounded-xl bg-white p-5 shadow-xs space-y-6">
            <div className="flex items-center gap-2 font-bold text-xs text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
              Filter Matrix
            </div>

            {/* Categories Selector Deck */}
            <div>
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2.5">
                Product Categories
              </h3>
              <div className="space-y-1 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.slug;
                  return (
                    <Link
                      key={cat.id}
                      href={{
                        pathname: "/shop",
                        query: {
                          ...resolvedParams,
                          category: isSelected ? undefined : cat.slug,
                          page: 1,
                        },
                      }}
                      className={`flex items-center justify-between text-xs p-2 rounded-lg transition-colors group ${
                        isSelected
                          ? "bg-emerald-50 text-emerald-700 font-bold"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className="truncate pr-2">{cat.name}</span>
                      <div
                        className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px] transition-colors ${
                          isSelected
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : "border-slate-300 bg-white group-hover:border-slate-400"
                        }`}
                      >
                        {isSelected && (
                          <Check className="w-2.5 h-2.5 stroke-3" />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Price Thresholds Box with Integrated Validation Display */}
            <div>
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2.5">
                Widget Price Filter
              </h3>
              <form action="/shop" method="GET" className="space-y-3">
                {search && <input type="hidden" name="search" value={search} />}
                {selectedCategory && (
                  <input
                    type="hidden"
                    name="category"
                    value={selectedCategory}
                  />
                )}
                {selectedManufacturer && (
                  <input
                    type="hidden"
                    name="manufacturer"
                    value={selectedManufacturer}
                  />
                )}
                {isFeatured && (
                  <input type="hidden" name="isFeatured" value="true" />
                )}
                {viewMode && (
                  <input type="hidden" name="viewMode" value={viewMode} />
                )}
                {sortBy && <input type="hidden" name="sortBy" value={sortBy} />}
                {limit && <input type="hidden" name="limit" value={limit} />}

                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">
                      Min Price
                    </label>
                    <Input
                      type="number"
                      name="min_price"
                      min={0}
                      defaultValue={resolvedParams.min_price || ""}
                      placeholder="0"
                      className={`text-xs bg-slate-50 border rounded-lg focus:outline-none focus:bg-white transition-all ${
                        priceValidationError
                          ? "border-rose-400 focus:border-rose-500"
                          : "border-slate-200 focus:border-emerald-500"
                      }`}
                    />
                  </div>
                  <div className="text-slate-400 mt-4 text-xs font-bold">-</div>
                  <div className="flex-1">
                    <label className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">
                      Max Price
                    </label>
                    <Input
                      type="number"
                      name="max_price"
                      min={
                        resolvedParams.min_price
                          ? Number(resolvedParams.min_price)
                          : 0
                      }
                      defaultValue={resolvedParams.max_price || ""}
                      placeholder="2000"
                      className={`text-xs bg-slate-50 border rounded-lg focus:outline-none focus:bg-white transition-all ${
                        priceValidationError
                          ? "border-rose-400 focus:border-rose-500"
                          : "border-slate-200 focus:border-emerald-500"
                      }`}
                    />
                  </div>
                </div>

                {priceValidationError && (
                  <p className="text-[11px] font-medium text-rose-500 bg-rose-50 border border-rose-100 rounded-md p-1.5 text-center">
                    {priceValidationError}
                  </p>
                )}

                <Button
                  type="submit"
                  variant="outline"
                  className="w-full uppercase tracking-wider"
                  size="lg"
                >
                  Filter
                </Button>
              </form>
            </div>

            {/* Real Pharmaceutical Brands Checklist Layer */}
            <div>
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2.5">
                Filter By Manufacturer
              </h3>
              <div className="space-y-1">
                {manufacturerList.map((manufacturer) => {
                  const isSelected =
                    selectedManufacturer === manufacturer.manufacturerName;
                  return (
                    <Link
                      key={manufacturer.manufacturerName}
                      href={{
                        pathname: "/shop",
                        query: {
                          ...resolvedParams,
                          manufacturer: isSelected
                            ? undefined
                            : manufacturer.manufacturerName,
                          page: 1,
                        },
                      }}
                      className={`flex items-center justify-between text-xs p-2 rounded-lg transition-colors group ${
                        isSelected
                          ? "bg-emerald-50 text-emerald-700 font-bold"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>{manufacturer.manufacturerName}</span>
                      <div
                        className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px] transition-colors ${
                          isSelected
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : "border-slate-300 bg-white group-hover:border-slate-400"
                        }`}
                      >
                        {isSelected && (
                          <Check className="w-2.5 h-2.5 stroke-3" />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Product Structural Status Filter */}
            <div>
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2.5">
                Product Status
              </h3>
              <div className="space-y-1">
                <Link
                  href={{
                    pathname: "/shop",
                    query: {
                      ...resolvedParams,
                      isFeatured: isFeatured ? undefined : "true",
                      page: 1,
                    },
                  }}
                  className={`flex items-center justify-between text-xs p-2 rounded-lg transition-colors group ${
                    isFeatured
                      ? "bg-emerald-50 text-emerald-700 font-bold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>Featured Inventories Only</span>
                  <div
                    className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px] transition-colors ${
                      isFeatured
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "border-slate-300 bg-white group-hover:border-slate-400"
                    }`}
                  >
                    {isFeatured && <Check className="w-2.5 h-2.5 stroke-3" />}
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* ================= MAIN PRODUCTS GRID/LIST CONTAINER ================= */}
        <main className="flex-1">
          {medicines.length === 0 ? (
            <div className="text-center py-24 bg-white border border-dashed rounded-2xl border-slate-200 text-slate-400 flex flex-col items-center justify-center">
              <X className="w-8 h-8 text-slate-300 mb-3 animate-pulse" />
              <p className="text-sm font-semibold text-slate-600">
                No active medications match criteria matrix.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Try relaxing filters or broadening scope searches.
              </p>
              <Link
                href="/shop"
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg px-4 py-2 mt-4 transition-colors"
              >
                Reset Storefront Layout
              </Link>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                  : "space-y-3.5"
              }
            >
              {medicines.map((medicine) => (
                <ProductCard
                  key={medicine.id}
                  medicine={medicine}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}

          {/* ================= SERVER PAGINATION REGION ================= */}
          {meta && <PaginationControls meta={meta} />}
        </main>
      </div>
    </div>
  );
}
