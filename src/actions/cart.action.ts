"use server";

import { CartService } from "@/services/cart.service";
import { CartItem } from "@/types";
import { updateTag } from "next/cache";

export const addToCart = async (itemId: string, quantity: number) => {
  const res = await CartService.addItemToCart(itemId, quantity);
  if (res.success) {
    updateTag("cart");
    return {
      success: true,
      mode: "database",
      data: res.data,
      message: res.message,
    };
  }

  return {
    success: false,
    mode: "guest",
    data: null,
    message: res.message || "You are not logged in. Item added to local cart.",
  };
};

export const removeFromCart = async (itemId: string) => {
  const res = await CartService.removeItemFromCart(itemId);
  if (res.success) {
    updateTag("cart");
    return {
      success: true,
      mode: "database",
      data: res.data,
      message: res.message,
    };
  }

  return {
    success: false,
    mode: "guest",
    data: null,
    message:
      res.message || "You are not logged in. Item removed from local cart.",
  };
};

export const syncGuestCartWithDatabase = async (guestItems: CartItem[]) => {
  try {
    if (!guestItems || guestItems.length === 0) return { success: true };

    // Format the data to match whatever your backend API expects
    const formattedItems = guestItems.map((item) => ({
      medicineId: item.medicineId,
      quantity: item.quantity,
    }));

    // Call your backend service to handle the bulk insertion/merging
    const res = await CartService.mergeGuestCart(formattedItems);

    if (res?.success) {
      updateTag("cart");
      return { success: true, data: res.data, message: res.message };
    }

    return {
      success: false,
      data: null,
      message: "Failed to merge carts on server",
    };
  } catch (error) {
    console.error("Cart sync error:", error);
    return {
      success: false,
      data: null,
      message: "Internal server error during sync",
    };
  }
};
