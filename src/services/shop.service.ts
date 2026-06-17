import { env } from "@/env";
import { Shop } from "@/types/shop.type";
import { cookies } from "next/headers";

interface ServiceOptions {
  cache?: RequestCache;
  revalidate?: number;
}

const API_URL = env.API_URL;

export const ShopService = {
  getMyShop: async () => {
    try {
      const cookieStore = await cookies();
      const url = new URL(`${API_URL}/shops/my-shop`);

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        cache: "no-store", // Always fetch fresh data for the user's shop
      });

      const data = await res.json();
      console.log("Fetch my shop response:", data); // Debug log to check the response from the server
      return data;
    } catch (error) {
      console.error("Error fetching shop:", error);
      return {
        success: false,
        data: [],
        message: "Failed to fetch shop",
      };
    }
  },
  createShop: async (
    payload: Omit<
      Shop,
      "id" | "slug" | "sellerId" | "isActive" | "createdAt" | "updatedAt"
    >,
    options?: ServiceOptions,
  ) => {
    const cookieStore = await cookies();
    const url = new URL(`${API_URL}/shops`);

    const config: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify(payload),
    };

    if (options?.cache) {
      config.cache = options.cache;
    }
    if (options?.revalidate) {
      config.next = { revalidate: options.revalidate };
    }

    config.next = { ...config.next, tags: ["shop"] };

    const res = await fetch(url.toString(), config);

    const data = await res.json();
    console.log("Create shop response:", data); // Debug log to check the response from the server
    return data;
  },

  updateShop: async (
    payload: Partial<
      Omit<
        Shop,
        "id" | "slug" | "sellerId" | "isActive" | "createdAt" | "updatedAt"
      >
    >,
    options?: ServiceOptions,
  ) => {
    const cookieStore = await cookies();
    const url = new URL(`${API_URL}/shops`);

    const config: RequestInit = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify(payload),
    };
    if (options?.cache) {
      config.cache = options.cache;
    }
    if (options?.revalidate) {
      config.next = { revalidate: options.revalidate };
    }
    config.next = { ...config.next, tags: ["shop"] };

    const res = await fetch(url.toString(), config);
    const data = await res.json();
    return data;
  },
};
