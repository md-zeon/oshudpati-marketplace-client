import { env } from "@/env";
import { CreateOrderPayload } from "@/types";
import { cookies } from "next/headers";

interface ServiceOptions {
  cache?: RequestCache;
  revalidate?: number;
}

const API_URL = env.API_URL;

export const OrderService = {
  getMyOrders: async () => {
    try {
      const cookieStore = await cookies();
      const url = new URL(`${API_URL}/orders/my-orders`);

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store", // Always fetch fresh data for the user's orders
      });

      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      return {
        success: false,
        data: [],
        message: "Failed to fetch orders",
      };
    }
  },
  getSellerOrders: async (params: { page: number; limit: number }) => {
    try {
      const cookieStore = await cookies();
      const url = new URL(`${API_URL}/orders/seller-orders`);
      url.searchParams.append("page", params.page.toString());
      url.searchParams.append("limit", params.limit.toString());

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store", // Always fetch fresh data for the seller's orders
      });

      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error fetching seller orders:", error);
      return {
        success: false,
        data: [],
        message: "Failed to fetch seller orders",
      };
    }
  },
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

      const res = await fetch(url.toString(), config);
      const data = await res.json();

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

      const res = await fetch(url.toString(), config);
      const data = await res.json();

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

      const res = await fetch(url.toString(), config);
      const data = await res.json();

      return data;
    } catch (error) {
      console.error("Error fetching order by order number:", error);
      return error;
    }
  },
  cancelVendorOrder: async (vendorOrderId: string) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(
        `${API_URL}/orders/vendor-order/${vendorOrderId}/cancel`,
        {
          method: "PATCH",
          headers: {
            Cookie: cookieStore.toString(),
          },
        },
      );
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error cancelling vendor order:", error);
      return { success: false, message: "Failed to cancel vendor order" };
    }
  },
  updateOrderStatus: async (orderId: string, status: string) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error updating order status:", error);
      return { success: false, message: "Failed to update order status" };
    }
  },
};
