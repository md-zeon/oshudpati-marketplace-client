import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ShoppingBag,
  ShieldCheck,
  Banknote,
  ArrowLeft,
  Lock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
} from "@/components/ui/stepper";

import { AddressService } from "@/services/address.service";
import { CartService } from "@/services/cart.service";
import { userService } from "@/services/user.service";

import { CheckoutForm } from "./_components/checkoutForm";
import { AddressSection } from "./_components/addressSection";
import { CartSummaryItem } from "./_components/cartSummaryItem";
import { MobileOrderSummary } from "./_components/MobileOrderSummary";
import { CartItem } from "@/types";
import { env } from "@/env";
import { SubmitButton } from "./_components/SubmitButton";

const FREE_SHIPPING_THRESHOLD = env.FREE_SHIPPING_THRESHOLD || 300;
const FLAT_SHIPPING_CHARGE = env.FLAT_SHIPPING_CHARGE || 60;

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const sessionRes = await userService.getSession();

  if (!sessionRes.success || !sessionRes.data?.user) {
    return redirect("/signin?redirect=/checkout");
  }

  const [addressesData, cartRes] = await Promise.all([
    AddressService.getAddresses(),
    CartService.getCartItems({ cache: "no-store" }),
  ]);

  const savedAddresses = addressesData?.data || [];
  const cartItems: CartItem[] = cartRes?.success ? cartRes.data || [] : [];

  // Calculate pricing matrices
  const itemsSubtotal = cartItems.reduce((acc: number, item) => {
    const unitPrice = Number(
      item.medicine.discountPrice ?? item.medicine.price,
    );

    return acc + unitPrice * item.quantity;
  }, 0);

  const shippingFee =
    itemsSubtotal > 0
      ? itemsSubtotal > FREE_SHIPPING_THRESHOLD
        ? 0
        : FLAT_SHIPPING_CHARGE
      : 0;

  const grandTotal = itemsSubtotal + shippingFee;

  return (
    <div className="pb-32 py-6 text-foreground lg:pb-6">
      {/* Page header */}
      <div className="mb-6">
        <Link
          href="/cart"
          className="mb-3 inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to cart
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-brand-900 sm:text-3xl">
          Checkout
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Confirm your delivery address and place your order.
        </p>
      </div>

      {/* Progress indicator (Cart → Details → Confirmation) */}
      <Stepper value={2} className="mb-8 w-full" orientation="horizontal">
        <StepperItem step={1} completed className="gap-1.5 sm:gap-2">
          <StepperIndicator className="size-6 border-brand-700 bg-brand-700 text-white sm:size-8" />
          <StepperTitle className="text-[10px] text-foreground sm:text-sm">
            Cart
          </StepperTitle>
        </StepperItem>
        <StepperSeparator />
        <StepperItem step={2} className="gap-1.5 sm:gap-2">
          <StepperIndicator className="size-6 border-brand-700 bg-brand-50 text-brand-900 sm:size-8" />
          <StepperTitle className="text-[10px] font-semibold text-foreground sm:text-sm">
            Delivery &amp; Payment
          </StepperTitle>
        </StepperItem>
        <StepperSeparator />
        <StepperItem step={3} className="gap-1.5 sm:gap-2">
          <StepperIndicator className="size-6 sm:size-8" />
          <StepperTitle className="text-[10px] sm:text-sm">
            Confirmation
          </StepperTitle>
        </StepperItem>
      </Stepper>

      {/* Pass structural calculations directly into our composite form handler */}
      <CheckoutForm cartItems={cartItems}>
        {/* ================= LEFT: FORMS ================= */}
        <div className="w-full flex-1 space-y-5">
          <MobileOrderSummary
            cartItems={cartItems}
            subtotal={itemsSubtotal}
            shippingFee={shippingFee}
            grandTotal={grandTotal}
          />
          <AddressSection savedAddresses={savedAddresses} />
        </div>

        {/* ================= RIGHT: STICKY ORDER SUMMARY (desktop) ================= */}
        <div className="hidden w-full shrink-0 lg:block lg:w-96">
          <div className="lg:sticky lg:top-40">
            <Card className="overflow-hidden rounded-2xl border border-border-default bg-card shadow-sm">
              <CardHeader className="border-b border-border-default bg-surface-card p-4">
                <CardTitle className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-foreground">
                  <ShoppingBag className="size-4 text-brand-600" aria-hidden="true" />
                  Cart Summary ({cartItems.length})
                </CardTitle>
              </CardHeader>

              <CardContent className="max-h-65 divide-y divide-border-default overflow-y-auto p-4">
                {cartItems.map((item) => (
                  <CartSummaryItem key={item.id} item={item} />
                ))}
              </CardContent>

              <div className="space-y-3 border-t border-border-default bg-surface-card/60 p-4 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Items Subtotal</span>
                  <span className="font-bold text-foreground">
                    ৳{itemsSubtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Estimated Shipping</span>
                  <span
                    className={`font-bold ${shippingFee === 0 ? "text-success" : "text-foreground"}`}
                  >
                    {shippingFee === 0 ? "FREE" : `৳${shippingFee.toFixed(2)}`}
                  </span>
                </div>

                <Separator />

                <div className="flex items-end justify-between pt-1">
                  <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                    Total Payable
                  </span>
                  <span className="text-2xl font-black tracking-tight text-brand-900">
                    ৳{grandTotal.toFixed(2)}
                  </span>
                </div>

                <SubmitButton disabled={cartItems.length === 0} />

                <p className="flex items-center justify-center gap-1.5 text-center text-xs font-medium text-muted-foreground">
                  <Lock className="size-3.5" aria-hidden="true" />
                  Pay ৳{grandTotal.toFixed(2)} in cash when your order arrives.
                </p>

                <ul className="flex flex-col gap-2 border-t border-border-default pt-3 text-xs font-medium text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="size-4 shrink-0 text-brand-600" aria-hidden="true" />
                    Secure &amp; encrypted checkout
                  </li>
                  <li className="flex items-center gap-2">
                    <Banknote className="size-4 shrink-0 text-brand-600" aria-hidden="true" />
                    Check your package before paying (COD)
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>

        {/* ================= MOBILE STICKY CHECKOUT BAR ================= */}
        <div className="fixed inset-x-0 bottom-16 z-40 lg:hidden">
          <div className="mx-3 mb-3 flex items-center justify-between gap-3 rounded-2xl border border-border-default bg-card/95 p-3 shadow-lg backdrop-blur">
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">
                Total Payable
              </p>
              <p className="text-lg font-black leading-tight text-brand-900">
                ৳{grandTotal.toFixed(2)}
              </p>
              {shippingFee > 0 && (
                <p className="text-[11px] font-medium text-muted-foreground">
                  + ৳{shippingFee.toFixed(2)} shipping
                </p>
              )}
            </div>
            <SubmitButton disabled={cartItems.length === 0} />
          </div>
        </div>
      </CheckoutForm>
    </div>
  );
}
