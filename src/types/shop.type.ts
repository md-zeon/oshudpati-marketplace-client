import { Category } from "./category.type";

export interface SearchParams {
  page?: string;
  search?: string;
  category?: string;
  min_price?: string;
  max_price?: string;
  isFeatured?: string;
  viewMode?: string;
  manufacturer?: string;
  sortBy?: string;
  limit?: string;
}

export interface ParsedShopFilters {
  page: number;
  limit: number;
  search: string;
  category: string[];
  manufacturer: string[];
  isFeatured: boolean;
  viewMode: "grid" | "list";
  sortBy: string;
  minPrice?: number;
  maxPrice?: number;
  priceValidationError: string;
}

export interface ShopSidebarProps {
  categories: Category[];
  manufacturers: {
    manufacturerName: string;
  }[];
  params: SearchParams;
  filters: ParsedShopFilters;
}

export interface Shop {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  banner?: string;
  description?: string;
  isActive: boolean;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
}
