import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

const fetchDashboard = async (endpoint: string) => {
  try {
    const cookieStore = await cookies();
    const url = new URL(`${API_URL}/dashboard/${endpoint}`);

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: { Cookie: cookieStore.toString() },
      cache: "no-store",
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint} dashboard:`, error);
    return {
      success: false,
      data: null,
      message: `Failed to fetch ${endpoint} dashboard`,
    };
  }
};

export const DashboardService = {
  getCustomerDashboard: () => fetchDashboard("customer"),
  getSellerDashboard: () => fetchDashboard("seller"),
  getAdminDashboard: () => fetchDashboard("admin"),
};
