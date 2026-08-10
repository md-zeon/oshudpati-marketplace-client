import Link from "next/link";
import type { ComponentProps } from "react";
import { X } from "lucide-react";
import { SearchParams } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ActiveFiltersProps {
  params: SearchParams;
  search: string;
  category: string[];
  manufacturer: string[];
  minPrice?: number;
  maxPrice?: number;
  isFeatured: boolean;
}

function removeFromCommaList(
  currentValue: string | undefined,
  itemToRemove: string,
): string | undefined {
  if (!currentValue) return undefined;
  const items = currentValue.split(",").filter(Boolean);
  const nextItems = items.filter((i) => i !== itemToRemove);
  return nextItems.length > 0 ? nextItems.join(",") : undefined;
}

function FilterChip({
  href,
  label,
  tone = "brand",
}: {
  href: ComponentProps<typeof Link>["href"];
  label: string;
  tone?: "brand" | "accent" | "trust";
}) {
  const toneClasses = {
    brand: "border-brand-200 bg-brand-50 text-brand-800 hover:bg-brand-100",
    accent:
      "border-accent-200 bg-accent-50 text-accent-600 hover:bg-accent-100",
    trust: "border-trust-200 bg-trust-50 text-trust-700 hover:bg-trust-100",
  }[tone];

  return (
    <Badge
      variant="outline"
      asChild
      className={`h-8 gap-1.5 border px-2.5 text-xs font-semibold transition-colors ${toneClasses}`}
    >
      <Link href={href}>
        {label}
        <X
          className="h-3.5 w-3.5 opacity-60 transition-opacity hover:opacity-100"
          aria-hidden="true"
        />
      </Link>
    </Badge>
  );
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
    category.length > 0 ||
    manufacturer.length > 0 ||
    minPrice !== undefined ||
    maxPrice !== undefined ||
    isFeatured
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      {hasActiveFilters && (
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-8 cursor-pointer gap-1.5 border border-danger/20 bg-danger/5 px-2.5 text-xs font-semibold text-danger hover:bg-danger/10 hover:text-danger"
        >
          <Link href="/shop">
            <X className="h-3.5 w-3.5" />
            Clear all
          </Link>
        </Button>
      )}

      {category.map((cat) => (
        <FilterChip
          key={cat}
          href={{
            pathname: "/shop",
            query: {
              ...params,
              category: removeFromCommaList(params.category, cat),
              page: 1,
            },
          }}
          label={`Category: ${cat}`}
          tone="brand"
        />
      ))}

      {manufacturer.map((mfr) => (
        <FilterChip
          key={mfr}
          href={{
            pathname: "/shop",
            query: {
              ...params,
              manufacturer: removeFromCommaList(params.manufacturer, mfr),
              page: 1,
            },
          }}
          label={mfr}
          tone="brand"
        />
      ))}

      {(minPrice !== undefined || maxPrice !== undefined) && (
        <FilterChip
          href={{
            pathname: "/shop",
            query: {
              ...params,
              min_price: undefined,
              max_price: undefined,
              page: 1,
            },
          }}
          label={`Price: ৳${minPrice || 0} - ৳${maxPrice || "Max"}`}
          tone="trust"
        />
      )}

      {isFeatured && (
        <FilterChip
          href={{
            pathname: "/shop",
            query: {
              ...params,
              isFeatured: undefined,
              page: 1,
            },
          }}
          label="Featured"
          tone="accent"
        />
      )}

      {search && (
        <FilterChip
          href={{
            pathname: "/shop",
            query: {
              ...params,
              search: undefined,
              page: 1,
            },
          }}
          label={`"${search}"`}
          tone="trust"
        />
      )}

      {!hasActiveFilters && (
        <p className="text-xs italic text-muted-foreground">
          No active filters applied
        </p>
      )}
    </div>
  );
}
