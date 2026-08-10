"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getLocalCart, saveLocalCart } from "@/lib/local-cart";
import { Address, CartItem } from "@/types";
import { addToCart, removeFromCart } from "@/actions/cart.action";
import {
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  Truck,
  ShieldCheck,
  Banknote,
  ChevronRight,
} from "lucide-react";
import { env } from "@/env";
import EmptyCart from "./EmptyCart";
import { getMyAddresses } from "@/actions/address.action";
import { cn } from "@/lib/utils";

const FREE_SHIPPING_THRESHOLD = env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD;
const FLAT_SHIPPING_CHARGE = env.NEXT_PUBLIC_FLAT_SHIPPING_CHARGE;

const emptySubscribe = () => () => {};

// True only after client hydration, so client-only values can be rendered
// without causing an SSR/client mismatch.
function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

interface FullCartProps {
  initialCart: CartItem[];
  isLoggedIn?: boolean;
}

export default function FullCart({
  initialCart = [],
  isLoggedIn = false,
}: FullCartProps) {
  const [cart, setCart] = useState<CartItem[]>(initialCart ?? []);
  const [address, setAddress] = useState<Address | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Fetch default address for shipping cost estimation and display in totals summary
  useEffect(() => {
    async function fetchDefaultAddress() {
      const res = await getMyAddresses();
      const defaultAddr = res.find((addr) => addr.isDefault) || null;
      setAddress(defaultAddr);
    }
    if (isLoggedIn) {
      fetchDefaultAddress();
    }
  }, [isLoggedIn]);

  // Sync cart state with local storage for guest users and server state for logged-in users
  useEffect(() => {
    const onLocalCart = () =>
      setCart(isLoggedIn ? initialCart : getLocalCart());
    onLocalCart();
    window.addEventListener("local-cart-updated", onLocalCart);

    return () => window.removeEventListener("local-cart-updated", onLocalCart);
  }, [initialCart, isLoggedIn]);

  // Core Pricing Formula Calculations
  const subtotal = cart.reduce((acc, item) => {
    const price = parseFloat(
      item.medicine.discountPrice || item.medicine.price || "0",
    );

    return acc + price * item.quantity;
  }, 0);

  const isShippingFree = subtotal >= FREE_SHIPPING_THRESHOLD;

  const shippingCost =
    cart.length === 0 || isShippingFree ? 0 : FLAT_SHIPPING_CHARGE;

  const grandTotal = subtotal + shippingCost;

  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - subtotal,
  );

  const progressPercentage = Math.min(
    100,
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100,
  );

  // Estimated delivery window (static estimate — 2-3 working days across BD).
  // Computed once on the client (after hydration) to keep the render pure and
  // avoid SSR/client date mismatches.
  const hydrated = useHydrated();
  const [estimatedDelivery] = useState(() =>
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(
      "en-BD",
      {
        weekday: "short",
        day: "numeric",
        month: "short",
      },
    ),
  );

  const changeQuantity = async (item: CartItem, newQty: number) => {
    if (newQty < 1 || newQty > (item.medicine.stockQuantity || 999)) return;

    if (isLoggedIn) {
      setUpdatingId(item.id);
      try {
        const res = await addToCart(item.medicineId, newQty - item.quantity);

        if (res?.success) {
          setCart((prev) =>
            prev.map((it) =>
              it.id === item.id ? { ...it, quantity: newQty } : it,
            ),
          );

          toast.success("Quantity updated");
        } else {
          toast.error(res?.message || "Failed to update quantity");
        }
      } catch (e) {
        toast.error(
          e instanceof Error ? e.message : "Server error updating quantity",
        );
      } finally {
        setUpdatingId(null);
      }
    } else {
      const updated = cart.map((it) =>
        it.medicineId === item.medicineId ? { ...it, quantity: newQty } : it,
      );
      saveLocalCart(updated);
      setCart(updated);

      toast.success("Quantity updated");
    }
  };

  const handleRemove = async (item: CartItem) => {
    if (isLoggedIn) {
      setUpdatingId(item.id);
      try {
        const res = await removeFromCart(item.id);

        if (res?.success) {
          setCart((prev) => prev.filter((it) => it.id !== item.id));
          toast.success("Item removed from cart");
        } else {
          toast.error(res?.message || "Failed to remove item");
        }
      } catch {
        toast.error("Failed to remove item");
      } finally {
        setUpdatingId(null);
      }
    } else {
      const updated = cart.filter((it) => it.medicineId !== item.medicineId);

      saveLocalCart(updated);
      setCart(updated);
      toast.success("Item removed from cart");
    }
  };

  if (!cart || cart.length === 0) return <EmptyCart />;

  return (
    <div className="pb-32 text-foreground lg:pb-0">
      {/* ============ MOBILE STICKY CHECKOUT BAR (thumb zone) ============ */}
      <div className="fixed inset-x-0 bottom-16 z-40 lg:hidden">
        <div className="mx-3 mb-3 flex items-center justify-between gap-3 rounded-2xl border border-border-default bg-card/95 p-3 shadow-lg backdrop-blur">
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground">
              Order Total
            </p>
            <p className="text-lg font-black leading-tight text-brand-900">
              ৳{grandTotal.toFixed(2)}
            </p>
            {!isShippingFree && (
              <p className="text-[11px] font-medium text-accent-600">
                + ৳{FLAT_SHIPPING_CHARGE.toFixed(2)} shipping
              </p>
            )}
          </div>
          <Button
            asChild
            className="h-12 shrink-0 rounded-xl bg-brand-700 px-6 text-sm font-bold text-white hover:bg-brand-600 active:bg-brand-800"
          >
            <Link href="/checkout">
              Checkout
              <ChevronRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-start gap-8 lg:flex-row">
        {/* ================= LEFT: ITEMS + SHIPPING PROGRESS ================= */}
        <div className="w-full flex-1">
          {/* Realtime Actionable Shipping Progress Banner */}
          <div
            className={cn(
              "mb-6 rounded-2xl border p-5 transition-all duration-300",
              isShippingFree
                ? "border-brand-200 bg-brand-50"
                : "border-border-default bg-surface-card",
            )}
          >
            <div className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
              <ShoppingBag
                className={cn(
                  "size-5 shrink-0",
                  isShippingFree ? "text-brand-600" : "text-muted-foreground",
                )}
                aria-hidden="true"
              />
              <span className="text-base">
                {isShippingFree ? (
                  <span className="font-bold text-brand-800">
                    Your order qualifies for free shipping!
                  </span>
                ) : (
                  <>
                    Add{" "}
                    <span className="font-black text-brand-700">
                      ৳{remainingForFreeShipping?.toFixed(2)}
                    </span>{" "}
                    more to unlock free delivery
                  </>
                )}
              </span>
            </div>
            <div
              className="mt-3 h-2 w-full overflow-hidden rounded-full bg-brand-100"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progressPercentage)}
              aria-label="Free shipping progress"
            >
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  isShippingFree ? "bg-brand-600" : "bg-brand-400",
                )}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            {isShippingFree && hydrated && (
              <p className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Truck className="size-3.5 text-brand-600" aria-hidden="true" />
                Estimated delivery: <span className="font-bold text-foreground">{estimatedDelivery}</span>
              </p>
            )}
          </div>

          {/* Desktop Matrix Columns Header Labels */}
          <div className="hidden border-b border-border-default pb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground md:grid md:grid-cols-12 md:gap-4 md:px-2">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Subtotal</div>
          </div>

          {/* Cart Mapping Data Sequence Container */}
          <div className="divide-y divide-border-default">
            {cart.map((item) => {
              const primaryImage =
                item.medicine.images?.find((i) => i.isPrimary)?.imageUrl ||
                item.medicine.images?.[0]?.imageUrl;
              const price = parseFloat(
                item.medicine.discountPrice || item.medicine.price || "0",
              );
              const isUpdating = updatingId === item.id;

              return (
                <div
                  key={item.id}
                  className="grid grid-cols-2 gap-x-4 gap-y-3 py-5 md:grid-cols-12 md:items-center md:gap-4 md:px-2"
                >
                  {/* Product */}
                  <div className="col-span-2 flex items-center gap-3 md:col-span-6">
                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border-default bg-surface-card p-1.5">
                      {primaryImage ? (
                        <Image
                          src={primaryImage}
                          alt={item.medicine.name}
                          width={60}
                          height={60}
                          className="max-h-full max-w-full object-contain mix-blend-multiply"
                        />
                      ) : (
                        <div className="text-[10px] text-muted-foreground">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/medicine/${item.medicine.slug}`}
                        className="block text-sm font-bold leading-snug text-brand-900 transition-colors hover:text-brand-700 md:text-base"
                      >
                        {item.medicine.name}
                      </Link>
                      <span className="mt-0.5 block truncate text-xs font-medium text-muted-foreground">
                        {item.medicine.genericName || "Not Provided"}
                      </span>
                      {/* Mobile-only price under product name */}
                      <span className="mt-1 block text-sm font-bold text-foreground md:hidden">
                        ৳{price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Price (desktop) */}
                  <div className="hidden text-sm font-medium text-muted-foreground md:col-span-2 md:block md:text-center">
                    ৳{price.toFixed(2)}
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center md:col-span-2 md:justify-center">
                    <div className="flex items-center overflow-hidden rounded-xl border border-border-default bg-card shadow-xs">
                      <button
                        type="button"
                        onClick={() => changeQuantity(item, item.quantity - 1)}
                        disabled={item.quantity <= 1 || isUpdating}
                        aria-label={`Decrease quantity of ${item.medicine.name}`}
                        className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:bg-brand-50 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
                      >
                        <Minus className="size-4" aria-hidden="true" />
                      </button>
                      <span
                        className="min-w-8 select-none text-center text-sm font-bold text-foreground"
                        aria-live="polite"
                      >
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => changeQuantity(item, item.quantity + 1)}
                        disabled={
                          item.quantity >= (item.medicine.stockQuantity || 999) ||
                          isUpdating
                        }
                        aria-label={`Increase quantity of ${item.medicine.name}`}
                        className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:bg-brand-50 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
                      >
                        <Plus className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal + Remove */}
                  <div className="flex items-center justify-end gap-2 md:col-span-2">
                    <div className="text-right">
                      <span className="block text-sm font-black text-foreground md:text-base">
                        ৳{(price * item.quantity).toFixed(2)}
                      </span>
                      {item.medicine.stockQuantity > 0 && (
                        <span className="text-[10px] font-medium text-muted-foreground md:hidden">
                          Subtotal
                        </span>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(item)}
                      disabled={isUpdating}
                      aria-label={`Remove ${item.medicine.name} from cart`}
                      className="size-10 shrink-0 rounded-xl text-muted-foreground hover:bg-danger/10 hover:text-danger"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <Link
            href="/shop"
            className="mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-lg text-sm font-semibold text-brand-700 transition-colors hover:text-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            <ChevronRight className="size-4 rotate-180" aria-hidden="true" />
            Continue shopping
          </Link>
        </div>

        {/* ============ RIGHT COLUMN: STICKY ORDER SUMMARY (desktop) ============ */}
        <div className="w-full shrink-0 lg:w-96">
          <div className="rounded-2xl border border-border-default bg-card p-5 shadow-sm lg:sticky lg:top-40">
            <h2 className="flex items-center gap-2 border-b border-border-default pb-4 text-xs font-black uppercase tracking-wider text-foreground">
              <ShoppingBag className="size-4 text-brand-600" aria-hidden="true" />
              Order Summary
            </h2>

            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="font-medium text-muted-foreground">Subtotal</dt>
                <dd className="font-bold text-foreground">
                  ৳{subtotal.toFixed(2)}
                </dd>
              </div>

              <div className="flex items-start justify-between gap-3">
                <dt className="flex items-center gap-1.5 pt-0.5 font-medium text-muted-foreground">
                  <Truck className="size-4 text-brand-600" aria-hidden="true" />
                  Delivery
                </dt>
                <dd className="text-right">
                  {isShippingFree ? (
                    <span className="font-bold text-success">Free</span>
                  ) : (
                    <span className="font-bold text-foreground">
                      ৳{FLAT_SHIPPING_CHARGE.toFixed(2)}
                    </span>
                  )}
                  {address && (
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      to {address.area}, {address.district}
                    </span>
                  )}
                </dd>
              </div>

              <div className="flex items-center justify-between">
                <dt className="font-medium text-muted-foreground">
                  Est. delivery
                </dt>
                <dd className="font-bold text-foreground">
                  {hydrated ? `by ${estimatedDelivery}` : "—"}
                </dd>
              </div>

              {!isShippingFree && (
                <p className="rounded-lg bg-accent-50 px-3 py-2 text-xs font-medium text-accent-600">
                  Add ৳{remainingForFreeShipping.toFixed(2)} more for free
                  delivery
                </p>
              )}
            </dl>

            <hr className="my-4 border-border-default" />

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Total
              </span>
              <span className="text-2xl font-black tracking-tight text-brand-900">
                ৳{grandTotal.toFixed(2)}
              </span>
            </div>

            <Button
              asChild
              className="mt-5 h-12 w-full rounded-xl bg-brand-700 text-sm font-bold text-white hover:bg-brand-600 active:bg-brand-800"
            >
              <Link href="/checkout">Proceed to checkout</Link>
            </Button>

            {!isLoggedIn && (
              <p className="mt-2.5 text-center text-xs font-medium text-muted-foreground">
                You&apos;ll be asked to sign in to complete your order.
              </p>
            )}

            {/* Trust signals */}
            <ul className="mt-4 flex flex-col gap-2 border-t border-border-default pt-4 text-xs font-medium text-muted-foreground">
              <li className="flex items-center gap-2">
                <ShieldCheck className="size-4 shrink-0 text-brand-600" aria-hidden="true" />
                Secure &amp; encrypted checkout
              </li>
              <li className="flex items-center gap-2">
                <Banknote className="size-4 shrink-0 text-brand-600" aria-hidden="true" />
                Cash on delivery available across Bangladesh
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
