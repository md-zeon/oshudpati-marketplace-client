import { env } from "@/env";

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
};
