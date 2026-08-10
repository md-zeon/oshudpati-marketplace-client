"use client";

import { ShippingAddressSnapshot } from "@/types";
import React, { createContext } from "react";

interface CheckoutContextType {
  selectedAddressId: string;
  setSelectedAddressId: (id: string) => void;
  isCustomAddress: boolean;
  setIsCustomAddress: (val: boolean) => void;
  customerNote: string;
  setCustomerNote: (note: string) => void;
  customAddress: ShippingAddressSnapshot;
  setCustomAddress: React.Dispatch<
    React.SetStateAction<ShippingAddressSnapshot>
  >;
  submitting: boolean;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined,
);

export default CheckoutContext;
