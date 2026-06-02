import Link from "next/link";
import Image from "next/image";
import { QuickReorderItem } from "@/types";
import { ShoppingBag, Package } from "lucide-react";

interface QuickReorderProps {
  items: QuickReorderItem[];
}

export function QuickReorder({ items }: QuickReorderProps) {
  if (items.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-emerald-600" />
          <h2 className="font-bold text-slate-900">Quick Reorder</h2>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">
          Previously ordered
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {items.slice(0, 6).map((item) => {
          const price = item.discountPrice ?? item.price;
          return (
            <Link
              key={item.id}
              href={`/medicine/${item.slug}`}
              className="group flex flex-col items-center text-center p-3 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all"
            >
              <div className="relative w-12 h-12 mb-2 bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="48px"
                    className="object-contain p-1"
                  />
                ) : (
                  <ShoppingBag className="w-5 h-5 text-slate-300" />
                )}
              </div>
              <p className="text-[11px] font-medium text-slate-700 line-clamp-2 leading-tight">
                {item.name}
              </p>
              <p className="text-xs font-bold text-emerald-600 mt-1">
                ৳{price.toFixed(0)}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
