import { env } from "@/env";
import { cookies } from "next/headers";

interface ServiceOptions {
  cache?: RequestCache;
  revalidate?: number;
}

const API_URL = env.API_URL;
export const CategoryService = {
  getCategories: async (options?: ServiceOptions) => {
    try {
      const url = new URL(`${API_URL}/categories`);

      const config: RequestInit = {};

      if (options?.cache) {
        config.cache = options.cache;
      }

      if (options?.revalidate) {
        config.next = { revalidate: options.revalidate };
      }

      config.next = { ...config.next, tags: ["categories"] };

      const res = await fetch(url.toString(), config);
      const data = await res.json();
      return data;
    } catch (error) {
      console.log("Error fetching categories:", error);
      return error;
    }
  },
  getInactiveCategories: async (options?: ServiceOptions) => {
    try {
      const url = new URL(`${API_URL}/categories/inactive`);
      const cookieStore = await cookies();

      const config: RequestInit = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      };

      if (options?.cache) {
        config.cache = options.cache;
      }
      if (options?.revalidate) {
        config.next = { revalidate: options.revalidate };
      }
      config.next = { ...config.next, tags: ["categories"] };

      const res = await fetch(url.toString(), config);
      const data = await res.json();
      return data;
    } catch (error) {
      console.log("Error fetching inactive categories:", error);
      return error;
    }
  },
  recoverCategory: async (id: string) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/categories/${id}/recover`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.log("Error recovering category:", error);
      return error;
    }
  },
};
