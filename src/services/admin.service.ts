import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const AdminService = {
  getAllUsers: async (params?: {
    role?: string;
    accountStatus?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    try {
      const cookieStore = await cookies();
      const url = new URL(`${API_URL}/users`);

      if (params?.role) url.searchParams.set("role", params.role);
      if (params?.accountStatus)
        url.searchParams.set("accountStatus", params.accountStatus);
      if (params?.search) url.searchParams.set("search", params.search);
      if (params?.page) url.searchParams.set("page", String(params.page));
      if (params?.limit) url.searchParams.set("limit", String(params.limit));

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.log("Error fetching users:", error);
      return error;
    }
  },
  getAllOrders: async () => {
    try {
      const cookieStore = await cookies();
      const url = new URL(`${API_URL}/orders/all-orders`);

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.log("Error fetching orders:", error);
      return error;
    }
  },
  getAllReviews: async () => {
    try {
      const cookieStore = await cookies();
      const url = new URL(`${API_URL}/reviews/all`);

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.log("Error fetching reviews:", error);
      return error;
    }
  },
  getCategories: async () => {
    try {
      const cookieStore = await cookies();
      const url = new URL(`${API_URL}/categories`);
      const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.log("Error fetching categories:", error);
      return error;
    }
  },
};
