"use server";

import { updateTag } from "next/cache";
import { AddressService } from "@/services/address.service";
import { Address } from "@/types";

export const getMyAddresses = async (): Promise<Address[]> => {
  const res = await AddressService.getAddresses();
  return res?.data || [];
};

export const getAddressById = async (id: string): Promise<Address | null> => {
  const res = await AddressService.getAddressById(id);
  return res?.data || null;
};

export const createAddress = async (
  payload: Omit<
    Address,
    "id" | "userId" | "createdAt" | "updatedAt" | "isDefault"
  >,
) => {
  const res = await AddressService.createAddress(payload);
  if (res?.success) {
    updateTag("addresses");
  }
  return res;
};

export const updateAddress = async (id: string, payload: Partial<Address>) => {
  const res = await AddressService.updateAddress(id, payload);
  if (res?.success) {
    updateTag("addresses");
  }
  return res;
};

export const deleteAddress = async (id: string) => {
  const res = await AddressService.deleteAddress(id);
  if (res?.success) {
    updateTag("addresses");
  }
  return res;
};

export const setDefaultAddress = async (id: string) => {
  const res = await AddressService.setDefaultAddress(id);
  if (res?.success) {
    updateTag("addresses");
  }
  return res;
};
