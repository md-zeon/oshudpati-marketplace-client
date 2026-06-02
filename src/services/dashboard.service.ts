import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const DashboardService = {
  getCustomerDashboard: async () => {
    try {
      const cookieStore = await cookies();
      const url = new URL(`${API_URL}/dashboard/customer`);

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      return {
        success: false,
        data: null,
        message: "Failed to fetch dashboard data",
      };
    }
  },
};
