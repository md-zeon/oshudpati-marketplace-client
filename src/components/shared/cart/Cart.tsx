"use client";

import { ShoppingCart, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { removeFromCart } from "@/actions/cart.action";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { getLocalCart, saveLocalCart } from "@/lib/local-cart";
import { CartItem } from "@/types";
import { env } from "@/env";

interface CartProps {
  cart: CartItem[];
  isLoggedIn?: boolean;
}

const FREE_SHIPPING_THRESHOLD = env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD;

const Cart = ({ cart = [], isLoggedIn = false }: CartProps) => {
  const [runtimeCart, setRuntimeCart] = useState<CartItem[]>(cart);
  // mark mounted based on whether window is available to avoid setting state in effect
  const [mounted] = useState<boolean>(typeof window !== "undefined");

  useEffect(() => {
    // Sync local state based on auth status
    const syncCart = () => setRuntimeCart(isLoggedIn ? cart : getLocalCart());

    syncCart();
    window.addEventListener("local-cart-updated", syncCart);
    return () => window.removeEventListener("local-cart-updated", syncCart);
  }, [cart, isLoggedIn]);

  const isCartEmpty = runtimeCart.length === 0;

  // Calculate total price based on item quantity and individual pricing structure
  const subtotal = runtimeCart.reduce((acc, item) => {
    const activePrice = parseFloat(
      item.medicine.discountPrice || item.medicine.price || "0",
    );
    return acc + activePrice * item.quantity;
  }, 0);

  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - subtotal,
  );
  const progressPercentage = Math.min(
    100,
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100,
  );

  const handleRemoveItemFromCart = async (
    itemId: string,
    medicineId: string,
  ) => {
    if (isLoggedIn) {
      const res = await removeFromCart(itemId);
      if (res?.success) {
        toast.success("Item removed from cart.");
      } else {
        toast.error("Failed to remove item from cart. Please try again.");
      }
    } else {
      // For guest users, remove item from local cart
      const updatedCart = runtimeCart.filter(
        (item) => item.medicineId !== medicineId,
      );
      saveLocalCart(updatedCart);
      setRuntimeCart(updatedCart);

      toast.success("Item removed from guest cart.");
    }
  };

  // Prevent server-side rendering mismatches for guest carts
  if (!mounted) {
    return (
      <div className="flex items-center gap-1 opacity-50 select-none py-1">
        <div className="rounded-full border-2 p-1 border-border-default">
          <ShoppingCart className="text-muted-foreground" size={24} />
        </div>
        <div className="font-medium leading-tight">
          <p className="text-sm font-medium text-muted-foreground">Cart Total</p>
          <span className="text-base font-bold text-foreground">৳ 0.00</span>
        </div>
      </div>
    );
  }
  return (
    <HoverCard openDelay={100} closeDelay={200}>
      {/* HOVER TRIGGER: Main Header Cart Target */}
      <HoverCardTrigger asChild>
        <div aria-label="Cart" className="cursor-pointer">
          <Link href="/cart" suppressHydrationWarning>
            <div className="flex items-center gap-1 cursor-pointer group select-none py-1">
              <div className="rounded-full border-2 p-1 border-border-default group-hover:border-brand-600 transition-colors">
                <ShoppingCart
                  className="text-muted-foreground group-hover:text-brand-600 transition-colors"
                  size={24}
                />
              </div>
              <div className="font-medium leading-tight">
                <p className="text-sm leading-tight font-medium text-muted-foreground group-hover:text-brand-600 transition-colors">
                  Cart Total
                </p>
                <span className="text-base leading-tight font-bold text-foreground">
                  ৳ {subtotal.toFixed(2)}
                </span>
              </div>
            </div>
          </Link>
        </div>
      </HoverCardTrigger>

      {/* FLYOUT CONTENT PANEL */}
      <HoverCardContent
        align="end"
        sideOffset={12}
        className="w-95 p-5 bg-card rounded-2xl shadow-xl border border-border-default flex flex-col gap-4 animate-in fade-in-50 slide-in-from-top-2 duration-200"
      >
        {isCartEmpty ? (
          /* ================= EMPTY CART VIEW ================= */
          <div className="flex flex-col items-center justify-center text-center py-6">
            <div className="relative w-20 h-20 mb-4 flex items-center justify-center bg-accent-50 rounded-full border border-accent-200">
              <span className="text-3xl text-accent-500 font-serif font-bold">
                ?
              </span>
            </div>
            <h3 className="text-base font-bold text-foreground mb-5">
              No products in the cart.
            </h3>

            {/* Dynamic Free Shipping Counter */}
            <div className="w-full bg-muted border border-border-default rounded-xl p-3.5">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Add{" "}
                <span className="font-bold text-foreground">
                  ৳{FREE_SHIPPING_THRESHOLD.toFixed(2)}
                </span>{" "}
                to cart and get free shipping!
              </p>
              <div className="w-full bg-border-default/70 h-2 rounded-full overflow-hidden">
                <div className="bg-muted-foreground h-full w-0 transition-all duration-500" />
              </div>
            </div>
          </div>
        ) : (
          /* ================= ACTIVE CART VIEW ================= */
          <>
            {/* Scrollable Medicine Items List */}
            <div className="flex flex-col gap-3.5 max-h-70 overflow-y-auto pr-1 scrollbar-thin">
              {runtimeCart.map((item) => {
                const primaryImage =
                  item.medicine.images?.find((img) => img.isPrimary)
                    ?.imageUrl || item.medicine.images?.[0]?.imageUrl;

                const itemPrice = parseFloat(
                  item.medicine.discountPrice || item.medicine.price || "0",
                );

                return (
                  <div
                    key={item.id}
                    className="flex gap-3 items-start pb-3.5 border-b border-border-default last:border-0 last:pb-0 group"
                  >
                    {/* Delete Item Interaction */}
                    <Button
                      onClick={() =>
                        handleRemoveItemFromCart(item.id, item.medicineId)
                      }
                      className="mt-1 w-fit h-fit p-0.5 rounded-full bg-danger/10 text-danger hover:text-danger transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </Button>

                    {/* Product Miniature Image Thumbnail */}
                    <div className="relative w-12 h-12 rounded-lg bg-muted border border-border-default p-1 shrink-0 flex items-center justify-center overflow-hidden">
                      <Image
                        src={primaryImage}
                        alt={item.medicine.name}
                        width={44}
                        height={44}
                        className="object-contain max-h-full max-w-full mix-blend-multiply"
                      />
                    </div>

                    {/* Metadata Text blocks */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/medicine/${item.medicine.slug}`}
                        className="text-xs font-semibold text-foreground leading-tight line-clamp-2 group-hover:text-brand-600 transition-colors block"
                      >
                        {item.medicine.name}
                      </Link>
                      <p className="text-xs font-bold mt-1 text-muted-foreground">
                        <span className="text-accent-600 font-extrabold">
                          {item.quantity}
                        </span>
                        <span className="text-muted-foreground font-normal px-1">
                          x
                        </span>
                        ৳{itemPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total Block Panel */}
            <div className="flex items-center justify-between border-t border-border-default pt-3.5">
              <span className="text-sm font-bold text-foreground">
                Subtotal:
              </span>
              <span className="text-base font-black text-foreground">
                ৳{subtotal.toFixed(2)}
              </span>
            </div>

            {/* Navigational CTA Split Grid */}
            <div className="grid grid-cols-2 gap-3.5">
              <Button
                variant="outline"
                className="w-full border-border-default hover:bg-muted hover:text-foreground font-bold text-xs h-10 rounded-xl"
                asChild
              >
                <Link href="/cart">View cart</Link>
              </Button>
              <Button
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs h-10 rounded-xl shadow-md shadow-brand-100 transition-all"
                asChild
              >
                <Link href="/checkout">Checkout</Link>
              </Button>
            </div>

            {/* Dynamic Shipping Threshold Tracker */}
            <div className="bg-muted border border-border-default rounded-xl p-3.5">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                {remainingForFreeShipping > 0 ? (
                  <>
                    Add{" "}
                    <span className="font-bold text-foreground">
                      ৳{remainingForFreeShipping.toFixed(2)}
                    </span>{" "}
                    to cart and get free shipping!
                  </>
                ) : (
                  <span className="text-brand-600 font-bold">
                    🎉 Your order qualifies for Free Shipping!
                  </span>
                )}
              </p>
              <div className="w-full bg-border-default/70 h-2 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-500 rounded-full",
                    remainingForFreeShipping > 0
                      ? "bg-muted-foreground"
                      : "bg-brand-500",
                  )}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};

export default Cart;
