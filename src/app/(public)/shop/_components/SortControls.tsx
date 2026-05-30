import Link from "next/link";
import { ChevronDown, Grid, List } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { SearchParams } from "@/types";

interface SortControlsProps {
  params: SearchParams;
  sortBy: string;
  limit: number;
  viewMode: "grid" | "list";
}

export default function SortControls({
  params,
  sortBy,
  limit,
  viewMode,
}: SortControlsProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative inline-block text-left group">
        <button className="h-9 px-3 border rounded-lg bg-white text-xs font-medium inline-flex items-center gap-1.5">
          Sort:
          <span className="font-bold capitalize">
            {sortBy.replace("-", " ")}
          </span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>

        <div className="absolute right-0 mt-1 w-40 bg-white border rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-30 p-1">
          {[
            {
              label: "Sort by latest",
              value: "latest",
            },
            {
              label: "Price: Low to High",
              value: "price-asc",
            },
            {
              label: "Price: High to Low",
              value: "price-desc",
            },
            {
              label: "Popularity",
              value: "popular",
            },
          ].map((item) => (
            <Link
              key={item.value}
              href={{
                pathname: "/shop",
                query: {
                  ...params,
                  sortBy: item.value,
                  page: 1,
                },
              }}
              className={`block px-3 py-2 text-xs rounded-md ${
                sortBy === item.value
                  ? "bg-emerald-50 text-emerald-700 font-bold"
                  : "hover:bg-slate-50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <HoverCard>
        <HoverCardTrigger asChild>
          <button className="h-9 px-3 border rounded-lg bg-white text-xs font-medium inline-flex items-center gap-1.5">
            Show:
            <span className="font-bold">{limit} Items</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </HoverCardTrigger>

        <HoverCardContent className="w-32">
          {[12, 16, 24, 32].map((num) => (
            <Link
              key={num}
              href={{
                pathname: "/shop",
                query: {
                  ...params,
                  limit: num,
                  page: 1,
                },
              }}
              className={`block px-3 py-2 text-xs text-center rounded-md ${
                limit === num
                  ? "bg-emerald-50 text-emerald-700 font-bold"
                  : "hover:bg-slate-50"
              }`}
            >
              {num} Items
            </Link>
          ))}
        </HoverCardContent>
      </HoverCard>

      <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border">
        <Link
          href={{
            pathname: "/shop",
            query: {
              ...params,
              viewMode: "grid",
            },
          }}
          className={`p-1.5 rounded-md ${
            viewMode === "grid" ? "bg-white shadow-xs" : ""
          }`}
        >
          <Grid className="w-4 h-4" />
        </Link>

        <Link
          href={{
            pathname: "/shop",
            query: {
              ...params,
              viewMode: "list",
            },
          }}
          className={`p-1.5 rounded-md ${
            viewMode === "list" ? "bg-white shadow-xs" : ""
          }`}
        >
          <List className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
