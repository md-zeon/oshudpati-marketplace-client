import Link from "next/link";
import { Check } from "lucide-react";
import { Category } from "@/types";
import { SearchParams } from "@/types";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string[];
  params: SearchParams;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  params,
}: CategoryFilterProps) {
  function buildHref(slug: string) {
    const isSelected = selectedCategory.includes(slug);
    let nextCategories: string[];

    if (isSelected) {
      nextCategories = selectedCategory.filter((s) => s !== slug);
    } else {
      nextCategories = [...selectedCategory, slug];
    }

    return {
      pathname: "/shop",
      query: {
        ...params,
        category: nextCategories.length > 0 ? nextCategories.join(",") : undefined,
        page: 1,
      },
    };
  }

  return (
    <div>
      <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-brand-900">
        Product Categories
      </h3>

      <div className="max-h-56 space-y-1 overflow-y-auto pr-1" role="group" aria-label="Filter by category">
        {categories.map((cat) => {
          const isSelected = selectedCategory.includes(cat.slug);

          return (
            <Link
              key={cat.id}
              href={buildHref(cat.slug)}
              aria-pressed={isSelected}
              className={`flex min-h-9 items-center justify-between gap-2 rounded-lg px-2.5 text-xs transition-colors focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none ${
                isSelected
                  ? "bg-brand-50 font-bold text-brand-800"
                  : "text-muted-foreground hover:bg-brand-50/60 hover:text-brand-800"
              }`}
            >
              <span className="min-w-0 truncate">{cat.name}</span>

              <span
                aria-hidden="true"
                className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border ${
                  isSelected
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-border-default bg-background"
                }`}
              >
                {isSelected && <Check className="h-3 w-3 stroke-3" />}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
