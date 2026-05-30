import Link from "next/link";
import { Check } from "lucide-react";
import { SearchParams } from "@/types";

interface ManufacturerFilterProps {
  manufacturers: {
    manufacturerName: string;
  }[];

  selectedManufacturer: string;
  params: SearchParams;
}

export default function ManufacturerFilter({
  manufacturers,
  selectedManufacturer,
  params,
}: ManufacturerFilterProps) {
  return (
    <div>
      <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2.5">
        Filter By Manufacturer
      </h3>

      <div className="space-y-1">
        {manufacturers.map((manufacturer) => {
          const isSelected =
            selectedManufacturer === manufacturer.manufacturerName;

          return (
            <Link
              key={manufacturer.manufacturerName}
              href={{
                pathname: "/shop",
                query: {
                  ...params,
                  manufacturer: isSelected
                    ? undefined
                    : manufacturer.manufacturerName,
                  page: 1,
                },
              }}
              className={`flex items-center justify-between text-xs p-2 rounded-lg transition-colors group ${
                isSelected
                  ? "bg-emerald-50 text-emerald-700 font-bold"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span>{manufacturer.manufacturerName}</span>

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
