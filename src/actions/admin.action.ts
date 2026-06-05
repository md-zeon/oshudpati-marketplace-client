"use server";

import { updateTag } from "next/cache";
import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const getAdminDashboardAction = async () => {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/dashboard/admin`, {
      headers: { Cookie: cookieStore.toString() },
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch {
    return { success: false, data: null };
  }
};

export const getAllUsersAction = async (params?: {
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
      headers: { Cookie: cookieStore.toString() },
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch {
    return {
      success: false,
      data: [],
      meta: { page: 1, limit: 10, total: 0, totalPage: 0 },
    };
  }
};

export const updateUserAccountStatusAction = async (
  userId: string,
  accountStatus: string,
) => {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/users/${userId}/account-status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify({ accountStatus }),
    });
    const data = await res.json();
    if (data.success) updateTag("users");
    return data;
  } catch {
    return { success: false, message: "Failed to update user status" };
  }
};

export const getCategoriesAction = async () => {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/categories`, {
      headers: { Cookie: cookieStore.toString() },
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch {
    return { success: false, data: [] };
  }
};

export const createCategoryAction = async (payload: {
  name: string;
  description?: string;
  imageUrl?: string;
}) => {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) updateTag("categories");
    return data;
  } catch {
    return { success: false, message: "Failed to create category" };
  }
};

export const updateCategoryAction = async (
  id: string,
  payload: { name?: string; description?: string; imageUrl?: string },
) => {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) updateTag("categories");
    return data;
  } catch {
    return { success: false, message: "Failed to update category" };
  }
};

export const deleteCategoryAction = async (id: string) => {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: "DELETE",
      headers: { Cookie: cookieStore.toString() },
    });
    const data = await res.json();
    if (data.success) updateTag("categories");
    return data;
  } catch {
    return { success: false, message: "Failed to delete category" };
  }
};
