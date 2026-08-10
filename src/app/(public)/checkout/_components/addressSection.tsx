"use client";

import React, { useEffect } from "react";
import {
  MapPin,
  NotepadText,
  CreditCard,
  AlertCircle,
  ShieldCheck,
  Banknote,
  Phone,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Address } from "@/types";
import useCheckout from "../_hooks/useCheckout";
import { cn } from "@/lib/utils";

function AddressField({
  name,
  label,
  required = true,
  error,
  className,
  ...inputProps
}: {
  name: string;
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  inputMode?: "text" | "tel" | "numeric";
  autoComplete?: string;
}) {
  const id = `custom-${name}`;

  return (
    <div className={cn("space-y-1.5", className)} data-checkout-field={name}>
      <label
        htmlFor={id}
        className="text-xs font-bold text-foreground"
      >
        {label}{" "}
        {required ? (
          <span className="text-danger" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="font-medium normal-case text-muted-foreground">
            (optional)
          </span>
        )}
      </label>
      <Input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "h-11 bg-white text-sm",
          error && "border-danger/60 focus-visible:border-danger focus-visible:ring-danger/30",
          className,
        )}
        {...inputProps}
      />
      {error && (
        <p
          id={`${id}-error`}
          className="flex items-start gap-1 text-xs font-medium text-danger"
        >
          <AlertCircle className="mt-px size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

export function AddressSection({
  savedAddresses,
}: {
  savedAddresses: Address[];
}) {
  const {
    selectedAddressId,
    setSelectedAddressId,
    isCustomAddress,
    setIsCustomAddress,
    customerNote,
    setCustomerNote,
    customAddress,
    setCustomAddress,
    errors,
    setErrors,
  } = useCheckout();

  useEffect(() => {
    if (savedAddresses.length > 0 && !selectedAddressId) {
      const defaultAddr = savedAddresses.find((addr) => addr.isDefault);
      setSelectedAddressId(defaultAddr ? defaultAddr.id : savedAddresses[0].id);
    } else if (savedAddresses.length === 0) {
      setIsCustomAddress(true);
    }
  }, [
    savedAddresses,
    selectedAddressId,
    setSelectedAddressId,
    setIsCustomAddress,
  ]);

  const updateCustomField = (
    field: keyof typeof customAddress,
    value: string,
  ) => {
    setCustomAddress((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="w-full space-y-5">
      {/* ============ 1. DELIVERY ADDRESS ============ */}
      <Card className="rounded-2xl border border-border-default bg-card p-5 sm:p-6">
        <div className="mb-5 flex items-center gap-3 border-b border-border-default pb-3">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-700 text-xs font-black text-white">
            1
          </span>
          <MapPin className="size-4 text-brand-600" aria-hidden="true" />
          <h3 className="text-base font-bold text-brand-900">
            Delivery Address
          </h3>
        </div>

        {savedAddresses.length > 0 ? (
          <RadioGroup
            value={selectedAddressId}
            onValueChange={(id) => {
              setIsCustomAddress(false);
              setSelectedAddressId(id);
              if (errors.address) {
                setErrors((prev) => ({ ...prev, address: "" }));
              }
            }}
            className="grid grid-cols-1 gap-3 md:grid-cols-2"
            aria-label="Choose a saved delivery address"
          >
            {savedAddresses.map((addr) => {
              const selected = !isCustomAddress && selectedAddressId === addr.id;
              return (
                <div
                  key={addr.id}
                  data-checkout-field="address"
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all focus-within:ring-2 focus-within:ring-brand-600",
                    selected
                      ? "border-brand-600 bg-brand-50 ring-1 ring-brand-600"
                      : "border-border-default hover:border-brand-300 hover:bg-surface-card",
                  )}
                >
                  <RadioGroupItem
                    value={addr.id}
                    id={`address-${addr.id}`}
                    className="mt-0.5"
                    aria-label={`Deliver to ${addr.fullName}, ${addr.streetAddress}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-foreground">
                      {addr.fullName}
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                      {addr.phoneNumber}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {addr.streetAddress}, {addr.area}, {addr.district}
                    </p>
                  </div>
                  {addr.isDefault && (
                    <span className="shrink-0 rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-800">
                      Default
                    </span>
                  )}
                </div>
              );
            })}
          </RadioGroup>
        ) : (
          <div className="flex items-start gap-2 rounded-xl border border-accent-200 bg-accent-50 p-4 text-sm font-medium text-accent-600">
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            No saved addresses found. Please enter a delivery address below.
          </div>
        )}

        {errors.address && (
          <p className="mt-3 flex items-start gap-1 text-xs font-medium text-danger" role="alert">
            <AlertCircle className="mt-px size-3.5 shrink-0" aria-hidden="true" />
            {errors.address}
          </p>
        )}

        {/* Ship to a different location */}
        <label
          htmlFor="use-custom-address"
          className={cn(
            "mt-4 flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all focus-within:ring-2 focus-within:ring-brand-600",
            isCustomAddress
              ? "border-brand-600 bg-brand-50 ring-1 ring-brand-600"
              : "border-border-default hover:bg-surface-card",
          )}
        >
          <Checkbox
            id="use-custom-address"
            checked={isCustomAddress}
            onCheckedChange={(checked) => {
              setIsCustomAddress(Boolean(checked));
              if (checked && errors.address) {
                setErrors((prev) => ({ ...prev, address: "" }));
              }
            }}
            className="size-5 data-checked:bg-brand-700 data-checked:border-brand-700"
          />
          <span className="text-sm">
            <span className="font-bold text-foreground">
              Ship to a different location
            </span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              Enter a temporary delivery address for this order only
            </span>
          </span>
        </label>

        {isCustomAddress && (
          <div className="mt-4 grid grid-cols-1 gap-3 rounded-xl border border-border-default bg-surface-card/60 p-4 sm:grid-cols-2">
            <AddressField
              name="fullName"
              label="Full Name"
              value={customAddress.fullName}
              onChange={(e) => updateCustomField("fullName", e.target.value)}
              placeholder="Receiver's name"
              autoComplete="name"
              error={errors.fullName}
            />
            <AddressField
              name="phoneNumber"
              label="Phone Number"
              value={customAddress.phoneNumber}
              onChange={(e) =>
                updateCustomField("phoneNumber", e.target.value)
              }
              placeholder="e.g. 01712345678"
              inputMode="tel"
              autoComplete="tel"
              error={errors.phoneNumber}
            />
            <p className="-mt-1 flex items-center gap-1 text-[11px] font-medium text-muted-foreground sm:col-span-2">
              <Phone className="size-3" aria-hidden="true" />
              We&apos;ll call this number to confirm your delivery.
            </p>
            <AddressField
              name="division"
              label="Division"
              value={customAddress.division}
              onChange={(e) => updateCustomField("division", e.target.value)}
              placeholder="e.g. Dhaka"
              autoComplete="address-level1"
              error={errors.division}
            />
            <AddressField
              name="district"
              label="District"
              value={customAddress.district}
              onChange={(e) => updateCustomField("district", e.target.value)}
              placeholder="e.g. Gazipur"
              autoComplete="address-level2"
              error={errors.district}
            />
            <AddressField
              name="area"
              label="Area / Thana"
              value={customAddress.area}
              onChange={(e) => updateCustomField("area", e.target.value)}
              placeholder="e.g. Tongi"
              autoComplete="address-level3"
              error={errors.area}
            />
            <AddressField
              name="postalCode"
              label="Postal Code"
              required={false}
              value={customAddress.postalCode ?? ""}
              onChange={(e) => updateCustomField("postalCode", e.target.value)}
              placeholder="e.g. 1710"
              inputMode="numeric"
              autoComplete="postal-code"
            />
            <AddressField
              name="streetAddress"
              label="Street Address Details"
              value={customAddress.streetAddress}
              onChange={(e) =>
                updateCustomField("streetAddress", e.target.value)
              }
              placeholder="House, road, apartment info"
              autoComplete="street-address"
              error={errors.streetAddress}
              className="sm:col-span-2"
            />
          </div>
        )}
      </Card>

      {/* ============ 2. DELIVERY NOTES ============ */}
      <Card className="rounded-2xl border border-border-default bg-card p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-3 border-b border-border-default pb-3">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-700 text-xs font-black text-white">
            2
          </span>
          <NotepadText className="size-4 text-brand-600" aria-hidden="true" />
          <h3 className="text-base font-bold text-brand-900">
            Delivery Notes
          </h3>
          <span className="ml-auto rounded-full bg-surface-card px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
            Optional
          </span>
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="customer-note"
            className="text-xs font-bold text-foreground"
          >
            Instructions for the delivery personnel
          </label>
          <Textarea
            id="customer-note"
            placeholder="e.g. Call before arrival, drop with the guard, leave at door..."
            value={customerNote}
            onChange={(e) => setCustomerNote(e.target.value)}
            className="min-h-20 bg-white text-sm"
            rows={3}
          />
          <p className="text-[11px] font-medium text-muted-foreground">
            Anything we should know before we deliver? (optional)
          </p>
        </div>
      </Card>

      {/* ============ 3. PAYMENT METHOD ============ */}
      <Card className="rounded-2xl border border-border-default bg-card p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-3 border-b border-border-default pb-3">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-700 text-xs font-black text-white">
            3
          </span>
          <CreditCard className="size-4 text-brand-600" aria-hidden="true" />
          <h3 className="text-base font-bold text-brand-900">
            Payment Method
          </h3>
        </div>

        <RadioGroup value="cod" className="gap-2" aria-label="Payment method">
          <div
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-xl border border-brand-200 bg-brand-50 p-4 transition-all",
            )}
          >
            <RadioGroupItem value="cod" id="payment-cod" className="mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-bold text-foreground">
                Cash on Delivery (COD)
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Verify the package contents first, then pay the courier in
                cash. No advance payment required.
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-brand-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-brand-800">
              Recommended
            </span>
          </div>
        </RadioGroup>

        <ul className="mt-4 flex flex-col gap-2 text-xs font-medium text-muted-foreground">
          <li className="flex items-center gap-2">
            <ShieldCheck className="size-4 shrink-0 text-brand-600" aria-hidden="true" />
            Secure checkout — your payment details are never stored
          </li>
          <li className="flex items-center gap-2">
            <Banknote className="size-4 shrink-0 text-brand-600" aria-hidden="true" />
            Keep exact change ready for the delivery agent
          </li>
        </ul>
      </Card>
    </div>
  );
}
