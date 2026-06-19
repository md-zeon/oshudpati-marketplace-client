import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchParams } from "@/types";

interface PriceFilterProps {
  params: SearchParams;
  search: string;
  selectedCategory: string[];
  selectedManufacturer: string[];
  isFeatured: boolean;
  viewMode: string;
  sortBy: string;
  limit: number;
  priceValidationError: string;
}

export default function PriceFilter({
  params,
  search,
  selectedCategory,
  selectedManufacturer,
  isFeatured,
  viewMode,
  sortBy,
  limit,
  priceValidationError,
}: PriceFilterProps) {
  return (
    <div>
      <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2.5">
        Price Filter
      </h3>

      <form action="/shop" method="GET" className="space-y-3">
        {search && <input type="hidden" name="search" value={search} />}

        {selectedCategory.length > 0 && (
          <input
            type="hidden"
            name="category"
            value={selectedCategory.join(",")}
          />
        )}

        {selectedManufacturer.length > 0 && (
          <input
            type="hidden"
            name="manufacturer"
            value={selectedManufacturer.join(",")}
          />
        )}

        {isFeatured && <input type="hidden" name="isFeatured" value="true" />}

        <input type="hidden" name="viewMode" value={viewMode} />

        <input type="hidden" name="sortBy" value={sortBy} />

        <input type="hidden" name="limit" value={limit} />

        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">
              Min Price
            </label>

            <Input
              type="number"
              name="min_price"
              min={0}
              defaultValue={params.min_price || ""}
              placeholder="0"
              className={`text-xs ${
                priceValidationError ? "border-rose-400" : ""
              }`}
            />
          </div>

          <div className="mt-4 text-slate-400">-</div>

          <div className="flex-1">
            <label className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">
              Max Price
            </label>

            <Input
              type="number"
              name="max_price"
              min={params.min_price ? Number(params.min_price) : 0}
              defaultValue={params.max_price || ""}
              placeholder="2000"
              className={`text-xs ${
                priceValidationError ? "border-rose-400" : ""
              }`}
            />
          </div>
        </div>

        {priceValidationError && (
          <p className="text-[11px] font-medium text-rose-500 bg-rose-50 border border-rose-100 rounded-md p-1.5 text-center">
            {priceValidationError}
          </p>
        )}

        <Button type="submit" variant="outline" className="w-full">
          Filter
        </Button>
      </form>
    </div>
  );
}
