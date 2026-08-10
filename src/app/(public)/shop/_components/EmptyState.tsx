import Link from "next/link";
import { PackageSearch } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

interface EmptyStateProps {
  hasActiveFilters?: boolean;
}

export default function EmptyState({ hasActiveFilters = false }: EmptyStateProps) {
  return (
    <Empty className="min-h-100 rounded-2xl border border-border-default bg-background">
      <EmptyHeader>
        <EmptyMedia>
          <PackageSearch size={56} />
        </EmptyMedia>

        <EmptyTitle className="text-2xl font-semibold text-brand-900 sm:text-3xl">
          No medicines found
        </EmptyTitle>

        <EmptyDescription className="mx-auto max-w-md">
          {hasActiveFilters
            ? "No medicines match the filters you selected. Try removing one or two filters, or clear everything and browse the full catalog."
            : "We couldn't find any medicines in the catalog right now. Please check back soon or browse our categories."}
        </EmptyDescription>
      </EmptyHeader>

      <EmptyContent className="flex flex-wrap items-center justify-center gap-3">
        {hasActiveFilters && (
          <Button asChild className="cursor-pointer bg-brand-700 hover:bg-brand-600 active:bg-brand-800">
            <Link href="/shop">Clear all filters</Link>
          </Button>
        )}
        <Button asChild variant="outline" className="cursor-pointer">
          <Link href="/categories">Browse categories</Link>
        </Button>
        {!hasActiveFilters && (
          <Button asChild className="cursor-pointer bg-brand-700 hover:bg-brand-600 active:bg-brand-800">
            <Link href="/shop">Go to shop</Link>
          </Button>
        )}
      </EmptyContent>
    </Empty>
  );
}
