"use server";

import { updateTag } from "next/cache";
import { env } from "@/env";
import { cookies } from "next/headers";
import { AdminService } from "@/services/admin.service";

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
    const data = await AdminService.getAllUsers(params);
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

export const getAllOrdersAction = async () => {
  try {
    const data = await AdminService.getAllOrders();
    return data;
  } catch {
    return { success: false, data: [] };
  }
};

export const getCategoriesAction = async () => {
  try {
    const data = await AdminService.getCategories();
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

export const getAllReviewsAction = async () => {
  try {
    const data = await AdminService.getAllReviews();
    return data;
  } catch {
    return { success: false, data: [] };
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

// Recover Category
export async function recoverCategoryAction(id: string) {
  try {
    const res = await fetch(
      `${process.env.BACKEND_URL}/api/categories/${id}/recover`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: true }),
      },
    );
    return await res.json();
  } catch (error) {
    return { success: false, message: "Failed to recover category" };
  }
}

export const toggleReviewStatusAction = async (
  reviewId: string,
  isActive: boolean,
) => {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/reviews/${reviewId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify({ isActive }),
    });
    const data = await res.json();
    if (data.success) updateTag("reviews");
    return data;
  } catch {
    return { success: false, message: "Failed to update review status" };
  }
};

export const addReviewReplyAction = async (reviewId: string, reply: string) => {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/reviews/${reviewId}/reply`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify({ reply }),
    });
    const data = await res.json();
    if (data.success) updateTag("reviews");
    return data;
  } catch {
    return { success: false, message: "Failed to add reply" };
  }
};
