import { MedicineService } from "@/services/medicine.service";
import { CategoryService } from "@/services/category.service";
import { Category, Medicine, SearchParams, WishlistItem } from "@/types";
import PaginationControls from "@/components/shared/pagination/PaginationControls";
import ShopHeader from "./_components/ShopHeader";
import ShopSidebar from "./_components/ShopSidebar";
import ProductGrid from "./_components/ProductGrid";
import { parseShopFilters } from "@/lib/utils";
import { Suspense } from "react";
import { WishlistService } from "@/services/wishlist.service";

interface ShopPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;

  const filters = parseShopFilters(params);

  const [
    medicineResponse,
    categoryResponse,
    manufacturerResponse,
    wishlistResponse,
  ] = await Promise.all([
    MedicineService.getMedicines(
      {
        search: filters.search,
        isFeatured: filters.isFeatured || undefined,
        page: filters.page,
        limit: filters.limit,
        category: filters.category,
        manufacturer: filters.manufacturer,
        minPrice: filters.priceValidationError ? undefined : filters.minPrice,
        maxPrice: filters.priceValidationError ? undefined : filters.maxPrice,
        sortBy: filters.sortBy,
      },
      { revalidate: 15 },
    ),

    CategoryService.getCategories({
      revalidate: 60,
    }),

    MedicineService.getManufacturers({
      revalidate: 60,
    }),

    WishlistService.getMyWishlist(),
  ]);

  const medicines: Medicine[] = medicineResponse?.success
    ? medicineResponse.data
    : [];

  const meta = medicineResponse?.success ? medicineResponse.meta : null;

  const categories: Category[] = categoryResponse?.success
    ? categoryResponse.data
    : [];

  const manufacturerList: {
    manufacturerName: string;
  }[] = manufacturerResponse?.success ? manufacturerResponse.data : [];

  const wishlistItems: WishlistItem[] = wishlistResponse?.success
    ? wishlistResponse.data.map((item: WishlistItem) => item.medicineId)
    : [];

  return (
    <div className="mx-auto max-w-350 px-4 py-8">
      <ShopHeader
        params={params}
        medicinesCount={medicines.length}
        search={filters.search}
        category={filters.category}
        manufacturer={filters.manufacturer}
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        isFeatured={filters.isFeatured}
        sortBy={filters.sortBy}
        limit={filters.limit}
        viewMode={filters.viewMode}
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <ShopSidebar
          categories={categories}
          manufacturers={manufacturerList}
          params={params}
          filters={filters}
        />

        <main className="flex-1">
          <ProductGrid medicines={medicines} viewMode={filters.viewMode} wishlistItems={wishlistItems} />

          {meta && (
            <Suspense fallback={null}>
              <PaginationControls meta={meta} />
            </Suspense>
          )}
        </main>
      </div>
    </div>
  );
}
