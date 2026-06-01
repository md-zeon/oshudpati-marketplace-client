"use client";

import { useContext } from "react";
import CheckoutContext from "../_contexts/CheckoutContext";

const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context)
    throw new Error(
      "useCheckout must be explicitly consumed inside CheckoutForm components.",
    );
  return context;
};

export default useCheckout;
