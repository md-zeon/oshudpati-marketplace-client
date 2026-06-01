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
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined,
);

export default CheckoutContext;
