import { env } from "@/env";
import { Address } from "@/types";
import { cookies } from "next/headers";

interface ServiceOptions {
  cache?: RequestCache;
  revalidate?: number;
}

const API_URL = env.API_URL;

export const AddressService = {
  createAddress: async (
    addressData: Omit<
      Address,
      "id" | "userId" | "createdAt" | "updatedAt" | "isDefault"
    >,
  ) => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/addresses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(addressData),
      });

      const data = await res.json();

      return data;
    } catch (error) {
      console.log("Error creating address:", error);
    }
  },
  getAddresses: async (options?: ServiceOptions) => {
    try {
      const url = new URL(`${API_URL}/addresses`);
      const cookieStore = await cookies();

      const config: RequestInit = {};
      if (options?.cache) {
        config.cache = options.cache;
      }
      if (options?.revalidate) {
        config.next = { revalidate: options.revalidate };
      }

      config.next = { ...config.next, tags: ["addresses"] };

      const res = await fetch(url.toString(), {
        ...config,
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
      });

      const data = await res.json();

      return data;
    } catch (error) {
      console.log("Error fetching addresses:", error);
    }
  },
  getAddressById: async (addressId: string) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/addresses/${addressId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.log("Error fetching address by ID:", error);
    }
  },
  deleteAddress: async (addressId: string) => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/addresses/${addressId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.log("Error deleting address:", error);
    }
  },
  updateAddress: async (addressId: string, addressData: Partial<Address>) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/addresses/${addressId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(addressData),
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.log("Error updating address:", error);
    }
  },
  setDefaultAddress: async (addressId: string) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/addresses/${addressId}/default`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.log("Error setting default address:", error);
    }
  },
};
