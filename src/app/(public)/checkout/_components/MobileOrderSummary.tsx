"use client";

import { useState } from "react";
import { ChevronDown, ShoppingBag } from "lucide-react";
import { CartItem } from "@/types";
import { CartSummaryItem } from "./cartSummaryItem";
import { cn } from "@/lib/utils";

interface MobileOrderSummaryProps {
  cartItems: CartItem[];
  subtotal: number;
  shippingFee: number;
  grandTotal: number;
}

export function MobileOrderSummary({
  cartItems,
  subtotal,
  shippingFee,
  grandTotal,
}: MobileOrderSummaryProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-border-default bg-card lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-order-summary-items"
        className="flex w-full cursor-pointer items-center justify-between gap-3 p-4 text-left transition-colors hover:bg-surface-card"
      >
        <span className="flex items-center gap-2 text-sm font-bold text-foreground">
          <ShoppingBag className="size-4 text-brand-600" aria-hidden="true" />
          Order Summary ({cartItems.length} item
          {cartItems.length === 1 ? "" : "s"})
        </span>
        <span className="flex items-center gap-2">
          <span className="font-black text-brand-900">
            ৳{grandTotal.toFixed(2)}
          </span>
          <ChevronDown
            className={cn(
              "size-4 text-muted-foreground transition-transform",
              open && "rotate-180",
            )}
            aria-hidden="true"
          />
        </span>
      </button>

      {open && (
        <div
          id="mobile-order-summary-items"
          className="space-y-2 border-t border-border-default p-4"
        >
          {cartItems.map((item) => (
            <CartSummaryItem key={item.id} item={item} />
          ))}
          <div className="mt-3 flex items-center justify-between border-t border-border-default pt-3 text-sm">
            <span className="font-medium text-muted-foreground">Subtotal</span>
            <span className="font-bold text-foreground">
              ৳{subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-muted-foreground">
              Estimated shipping
            </span>
            <span className="font-bold text-foreground">
              {shippingFee === 0 ? "FREE" : `৳${shippingFee.toFixed(2)}`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
