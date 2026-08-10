"use client";

import { useRouter } from "next/navigation";
import { Grid, List, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchParams } from "@/types";

interface SortControlsProps {
  params: SearchParams;
  sortBy?: string;
  limit?: number;
  viewMode: "grid" | "list";
}

export default function SortControls({
  params,
  sortBy = "popular",
  limit = 12,
  viewMode,
}: SortControlsProps) {
  const router = useRouter();

  const activeSort = sortBy || "popular";
  const activeLimit = String(limit || 12);

  const createQueryString = (
    updatedParams: Record<string, string | number>,
  ) => {
    const currentQueries = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) currentQueries.set(key, String(value));
    });
    Object.entries(updatedParams).forEach(([key, value]) => {
      currentQueries.set(key, String(value));
    });
    return `/shop?${currentQueries.toString()}`;
  };

  return (
    <div className="flex w-full items-center justify-between gap-4 text-foreground sm:justify-end">
      <div className="flex h-10 w-full items-center rounded-lg border border-border-default bg-surface-card px-1 text-xs font-medium sm:w-auto">
        <div className="flex-1 sm:flex-none">
          <Select
            value={activeSort}
            onValueChange={(value) => {
              router.push(createQueryString({ sortBy: value, page: 1 }));
            }}
          >
            <SelectTrigger
              aria-label="Sort products"
              className="h-8 gap-1 border-none bg-transparent px-2.5 font-semibold tracking-tight text-brand-700 shadow-none hover:text-brand-800 focus:ring-0 [&>svg]:hidden"
            >
              <span className="font-normal text-muted-foreground">Sort:</span>
              <SelectValue />
              <ChevronDown
                className="ml-0.5 h-3 w-3 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
            </SelectTrigger>
            <SelectContent
              align="start"
              className="min-w-35 rounded-xl border-border-default shadow-md"
            >
              <SelectItem value="popular" className="text-sm">
                Best selling
              </SelectItem>
              <SelectItem value="latest" className="text-sm">
                Latest arrivals
              </SelectItem>
              <SelectItem value="price-asc" className="text-sm">
                Price: Low to High
              </SelectItem>
              <SelectItem value="price-desc" className="text-sm">
                Price: High to Low
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="h-4 w-px shrink-0 bg-border-default" aria-hidden="true" />

        <div className="flex-1 sm:flex-none">
          <Select
            value={activeLimit}
            onValueChange={(value) => {
              router.push(createQueryString({ limit: value, page: 1 }));
            }}
          >
            <SelectTrigger
              aria-label="Products per page"
              className="h-8 gap-1 border-none bg-transparent px-2.5 font-semibold tracking-tight text-brand-700 shadow-none hover:text-brand-800 focus:ring-0 [&>svg]:hidden"
            >
              <SelectValue />
              <ChevronDown
                className="ml-0.5 h-3 w-3 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
            </SelectTrigger>
            <SelectContent
              align="start"
              className="min-w-27.5 rounded-xl border-border-default shadow-md"
            >
              {[12, 16, 24, 32].map((num) => (
                <SelectItem key={num} value={String(num)} className="text-sm">
                  {num} per page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="h-4 w-px shrink-0 bg-border-default" aria-hidden="true" />

        <div className="flex shrink-0 items-center gap-1 px-1.5">
          <button
            onClick={() => router.push(createQueryString({ viewMode: "grid" }))}
            className={`rounded-md p-1.5 transition-all ${
              viewMode === "grid"
                ? "border border-border-default bg-card text-brand-700 shadow-xs"
                : "text-muted-foreground hover:text-brand-700"
            }`}
            aria-label="Grid view"
            aria-pressed={viewMode === "grid"}
          >
            <Grid className="h-4 w-4 stroke-2" />
          </button>

          <button
            onClick={() => router.push(createQueryString({ viewMode: "list" }))}
            className={`rounded-md p-1.5 transition-all ${
              viewMode === "list"
                ? "border border-border-default bg-card text-brand-700 shadow-xs"
                : "text-muted-foreground hover:text-brand-700"
            }`}
            aria-label="List view"
            aria-pressed={viewMode === "list"}
          >
            <List className="h-4 w-4 stroke-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
