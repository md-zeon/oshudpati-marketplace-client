import { Medicine, ParsedShopFilters, SearchParams } from "@/types";
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

export function getPrimaryImage(medicine: Medicine): string {
  return (
    medicine.images?.find((img) => img.isPrimary)?.imageUrl ||
    medicine.images?.[0]?.imageUrl ||
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=500"
  );
}

export function getPrices(medicine: Medicine) {
  const regularPrice = Number(medicine.price ?? 0);
  const salePrice = medicine.discountPrice
    ? Number(medicine.discountPrice)
    : null;

  return { regularPrice, salePrice };
}

export function getDiscountPercentage(
  regularPrice: number,
  salePrice: number | null,
) {
  if (!salePrice || regularPrice <= 0) return null;

  return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
}

export function getRating(medicine: Medicine) {
  return Math.round(medicine.averageRating || 0);
}
