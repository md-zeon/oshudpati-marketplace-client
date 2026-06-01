import { env } from "@/env";
import { CreateOrderPayload } from "@/types";
import { cookies } from "next/headers";

interface ServiceOptions {
  cache?: RequestCache;
  revalidate?: number;
}

const API_URL = env.API_URL;

export const OrderService = {
  submitCheckoutOrder: async (
    payload: CreateOrderPayload,
    options?: ServiceOptions,
  ) => {
    try {
      const cookieStore = await cookies();
      const url = new URL(`${API_URL}/orders`);

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

      config.next = { ...config.next, tags: ["orders"] };

      console.log("Submitting checkout order to URL:", url.toString());

      const res = await fetch(url.toString(), config);
      const data = await res.json();

      console.log("Order submission response:", data);
      return data;
    } catch (error) {
      console.error("Error submitting checkout instance mapping:", error);
      return error;
    }
  },
  getOrderById: async (orderId: string, options?: ServiceOptions) => {
    try {
      const cookieStore = await cookies();
      const url = new URL(`${API_URL}/orders/${orderId}`);

      const config: RequestInit = {
        method: "GET",
        headers: {
          Cookie: cookieStore.toString(),
        },
      };

      if (options?.cache) {
        config.cache = options.cache;
      }

      if (options?.revalidate) {
        config.next = { revalidate: options.revalidate };
      }

      config.next = { ...config.next, tags: ["orders"] };

      console.log("Fetching order by ID from URL:", url.toString());

      const res = await fetch(url.toString(), config);
      const data = await res.json();

      console.log("Order fetch response:", data);
      return data;
    } catch (error) {
      console.error("Error fetching order by ID:", error);
      return error;
    }
  },
  getOrderByOrderNumber: async (
    orderNumber: string,
    options?: ServiceOptions,
  ) => {
    try {
      const cookieStore = await cookies();
      const url = new URL(`${API_URL}/orders/order-number/${orderNumber}`);

      const config: RequestInit = {
        method: "GET",
        headers: {
          Cookie: cookieStore.toString(),
        },
      };

      if (options?.cache) {
        config.cache = options.cache;
      }

      if (options?.revalidate) {
        config.next = { revalidate: options.revalidate };
      }

      config.next = { ...config.next, tags: ["orders"] };

      console.log("Fetching order by order number from URL:", url.toString());

      const res = await fetch(url.toString(), config);
      const data = await res.json();

      console.log("Order fetch response:", data);
      return data;
    } catch (error) {
      console.error("Error fetching order by order number:", error);
      return error;
    }
  },
};
