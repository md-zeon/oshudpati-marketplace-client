"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OrderTrackingForm() {
  const router = useRouter();

  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const value = orderNumber.trim();

    if (!value) {
      setError("Please enter your order number to track it.");
      return;
    }

    setError(null);
    router.push(`/order-tracking?orderNumber=${encodeURIComponent(value)}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto w-full max-w-xl"
    >
      <label
        htmlFor="order-tracking-input"
        className="mb-2 block text-sm font-bold text-brand-900"
      >
        Order Number
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="order-tracking-input"
            value={orderNumber}
            onChange={(e) => {
              setOrderNumber(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. ORD-XXXXXXXX"
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? "order-tracking-error" : "order-tracking-hint"
            }
            className="h-12 rounded-xl border-border-default pl-10 text-sm sm:text-base focus-visible:border-brand-600 focus-visible:ring-brand-600/30"
          />
        </div>
        <Button
          type="submit"
          className="h-12 rounded-xl bg-brand-700 px-6 text-sm font-bold text-white hover:bg-brand-600 active:bg-brand-800"
        >
          Track Order
        </Button>
      </div>

      {error ? (
        <p
          id="order-tracking-error"
          role="alert"
          className="mt-2 flex items-start gap-1 text-xs font-medium text-danger"
        >
          <AlertCircle className="mt-px size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : (
        <p id="order-tracking-hint" className="mt-2 text-xs text-muted-foreground">
          Find your order number in your confirmation email or receipt.
        </p>
      )}
    </form>
  );
}
