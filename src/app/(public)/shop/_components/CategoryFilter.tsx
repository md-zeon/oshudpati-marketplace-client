import Link from "next/link";
import { Check } from "lucide-react";
import { Category } from "@/types";
import { SearchParams } from "@/types";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  params: SearchParams;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  params,
}: CategoryFilterProps) {
  return (
    <div>
      <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2.5">
        Product Categories
      </h3>

      <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;

          return (
            <Link
              key={cat.id}
              href={{
                pathname: "/shop",
                query: {
                  ...params,
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
              <span>{cat.name}</span>

              <div
                className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                  isSelected
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : "border-slate-300"
                }`}
              >
                {isSelected && <Check className="w-2.5 h-2.5 stroke-3" />}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
