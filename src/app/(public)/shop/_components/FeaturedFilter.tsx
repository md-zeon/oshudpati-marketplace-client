import Link from "next/link";
import { Check } from "lucide-react";
import { SearchParams } from "@/types";

interface FeaturedFilterProps {
  isFeatured: boolean;
  params: SearchParams;
}

export default function FeaturedFilter({
  isFeatured,
  params,
}: FeaturedFilterProps) {
  return (
    <div>
      <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-brand-900">
        Availability
      </h3>

      <Link
        href={{
          pathname: "/shop",
          query: {
            ...params,
            isFeatured: isFeatured ? undefined : "true",
            page: 1,
          },
        }}
        aria-pressed={isFeatured}
        className={`flex min-h-9 items-center justify-between gap-2 rounded-lg px-2.5 text-xs transition-colors focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none ${
          isFeatured
            ? "bg-brand-50 font-bold text-brand-800"
            : "text-muted-foreground hover:bg-brand-50/60 hover:text-brand-800"
        }`}
      >
        <span>Featured products only</span>

        <span
          aria-hidden="true"
          className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border ${
            isFeatured
              ? "border-brand-600 bg-brand-600 text-white"
              : "border-border-default bg-background"
          }`}
        >
          {isFeatured && <Check className="h-3 w-3 stroke-3" />}
        </span>
      </Link>
    </div>
  );
}
