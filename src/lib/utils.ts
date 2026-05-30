import { ParsedShopFilters, SearchParams } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseShopFilters(params: SearchParams): ParsedShopFilters {
  const page = params.page ? parseInt(params.page, 10) : 1;

  const limit = params.limit ? parseInt(params.limit, 10) : 16;

  let minPrice = params.min_price?.length
    ? Number(params.min_price)
    : undefined;

  let maxPrice = params.max_price?.length
    ? Number(params.max_price)
    : undefined;

  if (minPrice !== undefined && minPrice < 0) {
    minPrice = 0;
  }

  if (maxPrice !== undefined && maxPrice < 0) {
    maxPrice = 0;
  }

  let priceValidationError = "";

  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    priceValidationError = "Min price cannot exceed Max price";
  }

  return {
    page,
    limit,
    search: params.search || "",
    category: params.category || "",
    manufacturer: params.manufacturer || "",
    isFeatured: params.isFeatured === "true",
    viewMode: params.viewMode === "list" ? "list" : "grid",
    sortBy: params.sortBy || "createdAt",
    minPrice,
    maxPrice,
    priceValidationError,
  };
}
