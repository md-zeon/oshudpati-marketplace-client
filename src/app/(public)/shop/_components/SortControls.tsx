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
    <div className="flex items-center justify-between sm:justify-end gap-4 w-full text-gray-900">
      {/* Unified Minimal Capsule Bar */}
      <div className="flex items-center h-9 bg-gray-50/60 border border-gray-200/80 rounded-lg px-1 text-xs font-medium w-full sm:w-auto">
        {/* Sort Select */}
        <div className="flex-1 sm:flex-none">
          <Select
            value={activeSort}
            onValueChange={(value) => {
              router.push(createQueryString({ sortBy: value, page: 1 }));
            }}
          >
            <SelectTrigger className="h-7 px-2.5 border-none bg-transparent hover:text-emerald-600 font-semibold tracking-tight shadow-none gap-1 focus:ring-0 [&>svg]:hidden">
              <span className="text-gray-400 font-normal">Sort:</span>
              <SelectValue />
              <ChevronDown className="w-3 h-3 text-gray-400 ml-0.5 shrink-0" />
            </SelectTrigger>
            <SelectContent
              align="start"
              className="border-gray-100 rounded-xl shadow-md min-w-35"
            >
              <SelectItem value="popular" className="text-xs">
                Popularity
              </SelectItem>
              <SelectItem value="latest" className="text-xs">
                Latest arrivals
              </SelectItem>
              <SelectItem value="price-asc" className="text-xs">
                Price: Low to High
              </SelectItem>
              <SelectItem value="price-desc" className="text-xs">
                Price: High to Low
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Micro Divider Line */}
        <div className="h-4 w-px bg-gray-200 shrink-0" aria-hidden="true" />

        {/* Limit Select (Just showing the number for ultimate minimalism) */}
        <div className="flex-1 sm:flex-none">
          <Select
            value={activeLimit}
            onValueChange={(value) => {
              router.push(createQueryString({ limit: value, page: 1 }));
            }}
          >
            <SelectTrigger className="h-7 px-2.5 border-none bg-transparent hover:text-emerald-600 font-semibold tracking-tight shadow-none gap-1 focus:ring-0 [&>svg]:hidden">
              <SelectValue />
              <ChevronDown className="w-3 h-3 text-gray-400 ml-0.5 shrink-0" />
            </SelectTrigger>
            <SelectContent
              align="start"
              className="border-gray-100 rounded-xl shadow-md min-w-27.5"
            >
              {[12, 16, 24, 32].map((num) => (
                <SelectItem key={num} value={String(num)} className="text-xs">
                  {num} per page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Micro Divider Line */}
        <div className="h-4 w-px bg-gray-200 shrink-0" aria-hidden="true" />

        {/* Layout Segment Switches */}
        <div className="flex items-center gap-1 px-1.5 shrink-0">
          <button
            onClick={() => router.push(createQueryString({ viewMode: "grid" }))}
            className={`transition-all p-1 rounded-md ${
              viewMode === "grid"
                ? "bg-white border border-gray-200/50 text-emerald-600 shadow-xs"
                : "text-gray-400 hover:text-gray-600"
            }`}
            aria-label="Grid view"
          >
            <Grid className="w-3.5 h-3.5 stroke-2" />
          </button>

          <button
            onClick={() => router.push(createQueryString({ viewMode: "list" }))}
            className={`transition-all p-1 rounded-md ${
              viewMode === "list"
                ? "bg-white border border-gray-200/50 text-emerald-600 shadow-xs"
                : "text-gray-400 hover:text-gray-600"
            }`}
            aria-label="List view"
          >
            <List className="w-3.5 h-3.5 stroke-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
