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
      <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-brand-900">
        Price (৳)
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

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label
              htmlFor="min_price"
              className="mb-1 block text-xs font-semibold text-muted-foreground"
            >
              Min
            </label>

            <Input
              id="min_price"
              type="number"
              name="min_price"
              min={0}
              inputMode="numeric"
              defaultValue={params.min_price || ""}
              placeholder="0"
              className={`h-10 text-sm ${
                priceValidationError ? "border-danger focus-visible:ring-danger/40" : ""
              }`}
            />
          </div>

          <span
            className="pb-2.5 text-muted-foreground"
            aria-hidden="true"
          >
            -
          </span>

          <div className="flex-1">
            <label
              htmlFor="max_price"
              className="mb-1 block text-xs font-semibold text-muted-foreground"
            >
              Max
            </label>

            <Input
              id="max_price"
              type="number"
              name="max_price"
              min={params.min_price ? Number(params.min_price) : 0}
              inputMode="numeric"
              defaultValue={params.max_price || ""}
              placeholder="2000"
              className={`h-10 text-sm ${
                priceValidationError ? "border-danger focus-visible:ring-danger/40" : ""
              }`}
            />
          </div>
        </div>

        {priceValidationError && (
          <p
            role="alert"
            className="rounded-md border border-danger/20 bg-danger/5 p-2 text-center text-xs font-medium text-danger"
          >
            {priceValidationError}
          </p>
        )}

        <Button
          type="submit"
          className="w-full cursor-pointer bg-brand-700 hover:bg-brand-600 active:bg-brand-800"
        >
          Apply price
        </Button>
      </form>
    </div>
  );
}
