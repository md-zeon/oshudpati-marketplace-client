import { ProductCard } from "@/components/shared/shop/ProductCard";
import EmptyState from "./EmptyState";
import { ProductGridProps } from "@/types";

export default function ProductGrid({ medicines, viewMode }: ProductGridProps) {
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
        />
      ))}
    </div>
  );
}
