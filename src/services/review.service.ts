import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const ReviewService = {
  getMedicineReviews: async (medicineId: string) => {
    try {
      const url = new URL(`${API_URL}/reviews/medicine/${medicineId}`);

      const res = await fetch(url.toString(), {
        cache: "no-store",
      });

      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return {
        success: false,
        data: [],
        message: "Failed to fetch reviews",
      };
    }
  },

  createReview: async (
    medicineId: string,
    rating: number,
    comment?: string,
  ) => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify({ medicineId, rating, comment }),
      });

      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error creating review:", error);
      return {
        success: false,
        data: null,
        message: "Failed to create review",
      };
    }
  },

  updateReview: async (
    reviewId: string,
    payload: { rating?: number; comment?: string },
  ) => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/reviews/${reviewId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error updating review:", error);
      return {
        success: false,
        data: null,
        message: "Failed to update review",
      };
    }
  },

  deleteReview: async (reviewId: string) => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
      });

      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error deleting review:", error);
      return {
        success: false,
        data: null,
        message: "Failed to delete review",
      };
    }
  },
};
