"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { submitOrderAction } from "@/actions/order.action";
import { CartItem, CreateOrderPayload, ShippingAddressSnapshot } from "@/types";
import { getAddressById } from "@/actions/address.action";
import CheckoutContext from "../_contexts/CheckoutContext";

export function CheckoutForm({
  children,
  cartItems,
}: {
  children: React.ReactNode;
  cartItems: CartItem[];
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [isCustomAddress, setIsCustomAddress] = useState(false);
  const [customerNote, setCustomerNote] = useState("");
  const [customAddress, setCustomAddress] = useState<ShippingAddressSnapshot>({
    fullName: "",
    phoneNumber: "",
    division: "",
    district: "",
    area: "",
    streetAddress: "",
    postalCode: "",
  });

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error("Your shopping cart is currently empty.");
      return;
    }

    let shippingAddressSnapshot;

    if (isCustomAddress) {
      if (
        !customAddress.fullName ||
        !customAddress.phoneNumber ||
        !customAddress.division ||
        !customAddress.district ||
        !customAddress.area ||
        !customAddress.streetAddress
      ) {
        toast.error("Please fill in all mandatory custom address inputs.");
        return;
      }
      shippingAddressSnapshot = { ...customAddress };
    } else {
      // Find selected address inside target child down-tree or context fallback
      if (!selectedAddressId) {
        toast.error(
          "Please specify a target delivery endpoint address profile.",
        );
        return;
      }

      // Fetch address details by ID to create a snapshot for order processing
      const selectedAddress = await getAddressById(selectedAddressId);
      if (!selectedAddress) {
        toast.error("Selected address not found.");
        return;
      }
      shippingAddressSnapshot = selectedAddress;
    }

    try {
      setSubmitting(true);
      const orderPayload: CreateOrderPayload = {
        shippingAddressSnapshot,
        customerNote: customerNote.trim() || undefined,
        items: cartItems.map((item) => ({
          medicineId: item.medicineId,
          quantity: item.quantity,
        })),
      };

      const result = await submitOrderAction(orderPayload);
      console.log("Order submission result:", result);

      if (result?.success) {
        toast.success("Order processed successfully!");
        router.push(`/checkout/order-received/${result.data?.orderNumber}`);
      } else {
        toast.error(
          result?.message || "Order tracking engine rejected parameters.",
        );
      }
    } catch {
      toast.error("An execution processing error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CheckoutContext.Provider
      value={{
        selectedAddressId,
        setSelectedAddressId,
        isCustomAddress,
        setIsCustomAddress,
        customerNote,
        setCustomerNote,
        customAddress,
        setCustomAddress,
        submitting,
      }}
    >
      <form
        onSubmit={handlePlaceOrder}
        className="flex flex-col lg:flex-row gap-8 items-start w-full"
      >
        {children}
      </form>
    </CheckoutContext.Provider>
  );
}
