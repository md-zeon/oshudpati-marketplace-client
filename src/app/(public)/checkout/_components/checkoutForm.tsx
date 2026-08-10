"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { submitOrderAction } from "@/actions/order.action";
import { CartItem, CreateOrderPayload, ShippingAddressSnapshot } from "@/types";
import { getAddressById } from "@/actions/address.action";
import CheckoutContext from "../_contexts/CheckoutContext";

type FieldErrors = Record<string, string>;

const PHONE_REGEX = /^(01[3-9]\d{8}|\+8801[3-9]\d{8})$/;

const validateCustomAddress = (
  customAddress: ShippingAddressSnapshot,
): FieldErrors => {
  const errors: FieldErrors = {};

  if (!customAddress.fullName.trim()) {
    errors.fullName = "Please enter the receiver's full name.";
  }

  const phone = customAddress.phoneNumber.trim().replace(/[\s-]/g, "");
  if (!phone) {
    errors.phoneNumber = "Please enter a phone number for delivery.";
  } else if (!PHONE_REGEX.test(phone)) {
    errors.phoneNumber =
      "Enter a valid Bangladeshi number, e.g. 01712345678.";
  }

  if (!customAddress.division.trim()) {
    errors.division = "Please enter your division (e.g. Dhaka).";
  }

  if (!customAddress.district.trim()) {
    errors.district = "Please enter your district (e.g. Gazipur).";
  }

  if (!customAddress.area.trim()) {
    errors.area = "Please enter your area / thana (e.g. Tongi).";
  }

  if (!customAddress.streetAddress.trim()) {
    errors.streetAddress =
      "Please enter house, road and apartment details for delivery.";
  }

  return errors;
};

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
  const [errors, setErrors] = useState<FieldErrors>({});

  const focusAndScrollToError = (errs: FieldErrors) => {
    const firstKey = Object.keys(errs)[0];
    if (!firstKey) return;
    const field = document.querySelector(
      `[data-checkout-field="${firstKey}"]`,
    );
    if (field) {
      field.scrollIntoView({ behavior: "smooth", block: "center" });
      const control = field.querySelector<HTMLElement>(
        "input, textarea, button",
      );
      control?.focus({ preventScroll: true });
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error("Your shopping cart is currently empty.");
      return;
    }

    let shippingAddressSnapshot;
    let validationErrors: FieldErrors = {};

    if (isCustomAddress) {
      validationErrors = validateCustomAddress(customAddress);
    } else {
      if (!selectedAddressId) {
        validationErrors.address =
          "Please select a saved delivery address, or choose “Ship to a different location”.";
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      focusAndScrollToError(validationErrors);
      toast.error("Please review the highlighted fields to continue.", {
        description: "Fix the marked fields below and try again.",
      });
      return;
    }

    if (isCustomAddress) {
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
        errors,
        setErrors,
      }}
    >
      <form
        onSubmit={handlePlaceOrder}
        noValidate
        className="flex w-full flex-col items-start gap-8 lg:flex-row"
      >
        {children}
      </form>
    </CheckoutContext.Provider>
  );
}
