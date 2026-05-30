"use server";

import { CartService } from "@/services/cart.service";
import { updateTag } from "next/cache";

export const addToCart = async (itemId: string, quantity: number) => {
  const res = await CartService.addItemToCart(itemId, quantity);
  if (res.success) {
    updateTag("cart");
  }

  return res;
};

export const removeFromCart = async (itemId: string) => {
  const res = await CartService.removeItemFromCart(itemId);
  if (res.success) {
    updateTag("cart");
  }

  return res;
};
