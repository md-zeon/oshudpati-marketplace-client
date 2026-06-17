"use server";

import { ShopService } from "@/services/shop.service";
import { Shop } from "@/types/shop.type";

export const createShop = async (
  data: Omit<
    Shop,
    "id" | "slug" | "sellerId" | "isActive" | "createdAt" | "updatedAt"
  >,
) => {
  const res = await ShopService.createShop(data);
  return res;
};

export const updateShop = async (
  payload: Partial<
    Omit<
      Shop,
      "id" | "slug" | "sellerId" | "isActive" | "createdAt" | "updatedAt"
    >
  >,
) => {
  const res = await ShopService.updateShop(payload);
  return res;
};
