import { ProductCard } from "@/components/shared/shop/ProductCard";
import EmptyState from "./EmptyState";
import { Medicine, WishlistItem } from "@/types";

interface ProductGridProps {
  medicines: Medicine[];
  viewMode: "grid" | "list";
  wishlistItems: WishlistItem[];
}

export default function ProductGrid({
  medicines,
  viewMode,
  wishlistItems,
}: ProductGridProps) {
  if (!medicines.length) {
    return <EmptyState />;
  }

  return (
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
          isWishlisted={wishlistItems.includes(
            medicine.id as unknown as WishlistItem,
          )}
        />
      ))}
    </div>
  );
}
