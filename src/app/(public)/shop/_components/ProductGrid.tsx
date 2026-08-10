import { ProductCard } from "@/components/shared/shop/ProductCard";
import EmptyState from "./EmptyState";
import { Medicine, WishlistItem } from "@/types";

interface ProductGridProps {
  medicines: Medicine[];
  viewMode: "grid" | "list";
  wishlistItems: WishlistItem[];
  hasActiveFilters?: boolean;
}

export default function ProductGrid({
  medicines,
  viewMode,
  wishlistItems,
  hasActiveFilters = false,
}: ProductGridProps) {
  if (!medicines.length) {
    return <EmptyState hasActiveFilters={hasActiveFilters} />;
  }

  return (
    <div
      className={
        viewMode === "grid"
          ? "grid grid-cols-2 gap-4 sm:gap-5 xl:grid-cols-3"
          : "space-y-3.5"
      }
    >
      {medicines.map((medicine) => (
        <ProductCard
          key={medicine.id}
          medicine={medicine}
          viewMode={viewMode}
          isWishlisted={wishlistItems.includes(
            medicine.id as unknown as WishlistItem,
          )}
        />
      ))}
    </div>
  );
}
