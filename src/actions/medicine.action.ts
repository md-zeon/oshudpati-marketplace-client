"use server";

import { updateTag } from "next/cache";
import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const getSellerMedicines = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  try {
    const cookieStore = await cookies();
    const url = new URL(`${API_URL}/medicines/my-medicines`);
    if (params?.page) url.searchParams.set("page", String(params.page));
    if (params?.limit) url.searchParams.set("limit", String(params.limit));
    if (params?.search) url.searchParams.set("search", params.search);

    const res = await fetch(url.toString(), {
      headers: { Cookie: cookieStore.toString() },
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching seller medicines:", error);
    return {
      success: false,
      data: [],
      meta: null,
      message: "Failed to fetch medicines",
    };
  }
};

export const createMedicineAction = async (payload: any) => {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/medicines`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) {
      updateTag("medicines");
    }
    return data;
  } catch (error) {
    console.error("Error creating medicine:", error);
    return { success: false, data: null, message: "Failed to create medicine" };
  }
};

export const updateMedicineAction = async (id: string, payload: any) => {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/medicines/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) {
      updateTag("medicines");
    }
    return data;
  } catch (error) {
    console.error("Error updating medicine:", error);
    return { success: false, data: null, message: "Failed to update medicine" };
  }
};

export const deleteMedicineAction = async (id: string) => {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/medicines/${id}`, {
      method: "DELETE",
      headers: { Cookie: cookieStore.toString() },
    });
    const data = await res.json();
    if (data.success) {
      updateTag("medicines");
    }
    return data;
  } catch (error) {
    console.error("Error deleting medicine:", error);
    return { success: false, data: null, message: "Failed to delete medicine" };
  }
};
