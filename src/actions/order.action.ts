"use server";

import { updateTag } from "next/cache";
import { OrderService } from "@/services/order.service";
import { CreateOrderPayload } from "@/types";

export const submitOrderAction = async (payload: CreateOrderPayload) => {
  const res = await OrderService.submitCheckoutOrder(payload);

  if (res?.success) {
    updateTag("orders");
    updateTag("cart");
    updateTag("medicines");
  }

  return res;
};
