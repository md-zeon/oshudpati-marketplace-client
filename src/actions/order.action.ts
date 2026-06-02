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

export const getMyOrdersAction = async () => {
  const res = await OrderService.getMyOrders();

  return res;
};

export const getOrderByOrderNumber = async (orderNumber: string) => {
  const res = await OrderService.getOrderByOrderNumber(orderNumber);

  return res;
};
