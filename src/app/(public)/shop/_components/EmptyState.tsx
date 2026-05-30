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

export default function EmptyState() {
  return (
    <Empty className="min-h-125 rounded-2xl border border-slate-400 bg-background">
      <EmptyHeader>
        <EmptyMedia>
          <PackageSearch size={56} />
        </EmptyMedia>

        <EmptyTitle className="text-4xl font-semibold">
          No medicines found
        </EmptyTitle>

        <EmptyDescription>
          We couldn&apos;t find any medicines matching your current filters. Try
          changing your search criteria or clearing all filters.
        </EmptyDescription>
      </EmptyHeader>

      <EmptyContent>
        <Button asChild variant="outline" className="py-4">
          <Link href="/shop">Clear Filters</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
