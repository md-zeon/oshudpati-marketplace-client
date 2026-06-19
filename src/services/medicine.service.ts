import { env } from "@/env";
import { cookies } from "next/headers";

interface GetMedicinesParams {
  search?: string;
  isFeatured?: boolean;
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  manufacturer?: string;
  sortBy?: string;
}

interface ServiceOptions {
  cache?: RequestCache;
  revalidate?: number;
}

const API_URL = env.API_URL;
export const MedicineService = {
  getMedicines: async (
    params: GetMedicinesParams,
    options?: ServiceOptions,
  ) => {
    try {
      const url = new URL(`${API_URL}/medicines`);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            url.searchParams.append(key, value.toString());
          }
        });
      }

      const config: RequestInit = {};

      if (options?.cache) {
        config.cache = options.cache;
      }

      if (options?.revalidate) {
        config.next = { revalidate: options.revalidate };
      }

      config.next = { ...config.next, tags: ["medicines"] };

      const res = await fetch(url.toString(), config);
      const data = await res.json();

      return data;
    } catch (error) {
      console.log("Error fetching medicines:", error);
      return error;
    }
  },
  getManufacturers: async (options?: ServiceOptions) => {
    try {
      const url = new URL(`${API_URL}/medicines/manufacturers`);
      const config: RequestInit = {};

      if (options?.cache) {
        config.cache = options.cache;
      }

      if (options?.revalidate) {
        config.next = { revalidate: options.revalidate };
      }

      config.next = { ...config.next, tags: ["manufacturers"] };

      const res = await fetch(url.toString(), config);
      const data = await res.json();

      return data;
    } catch (error) {
      console.log("Error fetching manufacturers:", error);
      return error;
    }
  },
  getMedicineBySlug: async (slug: string, options?: ServiceOptions) => {
    try {
      const url = new URL(`${API_URL}/medicines/slug/${slug}`);
      const config: RequestInit = {};

      if (options?.cache) {
        config.cache = options.cache;
      }

      if (options?.revalidate) {
        config.next = { revalidate: options.revalidate };
      }

      config.next = { ...config.next, tags: ["medicine"] };

      const res = await fetch(url.toString(), config);
      const data = await res.json();

      return data;
    } catch (error) {
      console.log("Error fetching medicine:", error);
      return error;
    }
  },
  getMedicineById: async (id: string, options?: ServiceOptions) => {
    try {
      const cookieStore = await cookies();
      const url = new URL(`${API_URL}/medicines/${id}`);
      const config: RequestInit = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
      };

      if (options?.cache) {
        config.cache = options.cache;
      }

      if (options?.revalidate) {
        config.next = { revalidate: options.revalidate };
      }

      config.next = { ...config.next, tags: ["medicine"] };

      const res = await fetch(url.toString(), config);
      const data = await res.json();

      return data;
    } catch (error) {
      console.log("Error fetching medicine by ID:", error);
      return error;
    }
  },
};
