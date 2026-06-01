import { env } from "@/env";
import { cookies } from "next/headers";

interface ServiceOptions {
  cache?: RequestCache;
  revalidate?: number;
}

const API_URL = env.API_URL;

export const CartService = {
  addItemToCart: async (itemId: string, quantity: number) => {
    try {
      const cookieStore = await cookies();

      const cartData = {
        medicineId: itemId,
        quantity,
      };

      const res = await fetch(`${API_URL}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(cartData),
      });

      const data = await res.json();

      return data;
    } catch (error) {
      console.log("Error adding item to cart:", error);
      return {
        success: false,
        data: null,
        message: "Failed to add item to cart",
      };
    }
  },
  getCartItems: async (options?: ServiceOptions) => {
    try {
      const url = new URL(`${API_URL}/cart`);
      const cookieStore = await cookies();

      const config: RequestInit = {};
      if (options?.cache) {
        config.cache = options.cache;
      }
      if (options?.revalidate) {
        config.next = { revalidate: options.revalidate };
      }

      config.next = { ...config.next, tags: ["cart"] };

      const res = await fetch(url.toString(), {
        ...config,
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
      });

      const data = await res.json();

      return data;
    } catch (error) {
      console.log("Error fetching cart items:", error);
      return {
        success: false,
        data: null,
        message: "Failed to fetch cart items",
      };
    }
  },
  removeItemFromCart: async (itemId: string) => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/cart/${itemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.log("Error removing item from cart:", error);
      return {
        success: false,
        data: null,
        message: "Failed to remove item from cart",
      };
    }
  },
  mergeGuestCart: async (items: { medicineId: string; quantity: number }[]) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/cart/merge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();

      return data;
    } catch (error) {
      console.log("Error merging guest cart:", error);
      return {
        success: false,
        data: null,
        message: "Failed to merge guest cart",
      };
    }
  },
  updateCartItem: async (itemId: string, quantity: number) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/cart/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify({ quantity }),
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.log("Error updating cart item:", error);
      return {
        success: false,
        data: null,
        message: "Failed to update cart item",
      };
    }
  },
};
