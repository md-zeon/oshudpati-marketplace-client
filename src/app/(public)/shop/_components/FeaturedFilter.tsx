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
      <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2.5">
        Product Status
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
        className={`flex items-center justify-between text-xs p-2 rounded-lg transition-colors group ${
          isFeatured
            ? "bg-emerald-50 text-emerald-700 font-bold"
            : "text-slate-600 hover:bg-slate-50"
        }`}
      >
        <span>Featured Only</span>

        <div
          className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
            isFeatured
              ? "bg-emerald-600 border-emerald-600 text-white"
              : "border-slate-300"
          }`}
        >
          {isFeatured && <Check className="w-2.5 h-2.5 stroke-3" />}
        </div>
      </Link>
    </div>
  );
}
