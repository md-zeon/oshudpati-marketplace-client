"use server";

import { updateTag } from "next/cache";
import { WishlistService } from "@/services/wishlist.service";

export const getMyWishlistAction = async () => {
  const res = await WishlistService.getMyWishlist();
  return res;
};

export const toggleWishlistAction = async (medicineId: string) => {
  const res = await WishlistService.toggleWishlist(medicineId);
  if (res?.success) {
    updateTag("wishlist");
  }
  return res;
};

export const removeFromWishlistAction = async (wishlistId: string) => {
  const res = await WishlistService.removeFromWishlist(wishlistId);
  if (res?.success) {
    updateTag("wishlist");
  }
  return res;
};
