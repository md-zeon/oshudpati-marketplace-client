import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const WishlistService = {
  getMyWishlist: async () => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/wishlist`, {
        headers: { Cookie: cookieStore.toString() },
        cache: "no-store",
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      return { success: false, data: [] };
    }
  },
  toggleWishlist: async (medicineId: string) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify({ medicineId }),
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      return { success: false, data: null };
    }
  },
  removeFromWishlist: async (wishlistId: string) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/wishlist/${wishlistId}`, {
        method: "DELETE",
        headers: { Cookie: cookieStore.toString() },
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      return { success: false, message: "Failed to remove" };
    }
  },
};
