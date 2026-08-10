import Link from "next/link";
import { Check } from "lucide-react";
import { SearchParams } from "@/types";

interface ManufacturerFilterProps {
  manufacturers: {
    manufacturerName: string;
  }[];

  selectedManufacturer: string[];
  params: SearchParams;
}

export default function ManufacturerFilter({
  manufacturers,
  selectedManufacturer,
  params,
}: ManufacturerFilterProps) {
  function buildHref(manufacturerName: string) {
    const isSelected = selectedManufacturer.includes(manufacturerName);
    let nextManufacturers: string[];

    if (isSelected) {
      nextManufacturers = selectedManufacturer.filter((m) => m !== manufacturerName);
    } else {
      nextManufacturers = [...selectedManufacturer, manufacturerName];
    }

    return {
      pathname: "/shop",
      query: {
        ...params,
        manufacturer:
          nextManufacturers.length > 0 ? nextManufacturers.join(",") : undefined,
        page: 1,
      },
    };
  }

  return (
    <div>
      <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-brand-900">
        Manufacturer
      </h3>

      <div
        className="max-h-56 space-y-1 overflow-y-auto pr-1"
        role="group"
        aria-label="Filter by manufacturer"
      >
        {manufacturers.map((manufacturer) => {
          const isSelected = selectedManufacturer.includes(
            manufacturer.manufacturerName,
          );

          return (
            <Link
              key={manufacturer.manufacturerName}
              href={buildHref(manufacturer.manufacturerName)}
              aria-pressed={isSelected}
              className={`flex min-h-9 items-center justify-between gap-2 rounded-lg px-2.5 text-xs transition-colors focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none ${
                isSelected
                  ? "bg-brand-50 font-bold text-brand-800"
                  : "text-muted-foreground hover:bg-brand-50/60 hover:text-brand-800"
              }`}
            >
              <span className="min-w-0 truncate">
                {manufacturer.manufacturerName}
              </span>

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
