"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, X, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { getCartItems, removeFromCart } from "@/actions/cart.action";
import { toast } from "sonner";
import { getLocalCart, saveLocalCart } from "@/lib/local-cart";
import { CartItem } from "@/types";
import { env } from "@/env";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

const FREE_SHIPPING_THRESHOLD = env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD;

export function MobileCartDrawer() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [runtimeCart, setRuntimeCart] = useState<CartItem[]>([]);
  const [mounted] = useState<boolean>(typeof window !== "undefined");
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Listen for local cart updates (for guest users)
  useEffect(() => {
    const checkAuth = async () => {
      const user = await authClient.getSession();
      setIsLoggedIn(user.data?.user ? true : false);
    };
    checkAuth();
  }, []);

  // Fetch cart items on mount
  useEffect(() => {
    const fetchCart = async () => {
      const cartData = await getCartItems({ cache: "no-store" });
      setRuntimeCart(
        isLoggedIn ? (cartData.success ? cartData.data : []) : getLocalCart(),
      );
      setCart(cartData.success ? cartData.data : []);
    };
    fetchCart();
  }, [isLoggedIn]);

  // Sync runtime cart with local cart for guest users
  useEffect(() => {
    const syncCart = () => setRuntimeCart(isLoggedIn ? cart : getLocalCart());

    syncCart();
    window.addEventListener("local-cart-updated", syncCart);
    return () => window.removeEventListener("local-cart-updated", syncCart);
  }, [cart, isLoggedIn]);

  const isCartEmpty = runtimeCart.length === 0;

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

  const handleRemoveItem = async (itemId: string, medicineId: string) => {
    if (isLoggedIn) {
      const res = await removeFromCart(itemId);
      if (res?.success) {
        toast.success("Item removed from cart.");
      } else {
        toast.error("Failed to remove item from cart.");
      }
    } else {
      const updatedCart = runtimeCart.filter(
        (item) => item.medicineId !== medicineId,
      );
      saveLocalCart(updatedCart);
      setRuntimeCart(updatedCart);
      toast.success("Item removed from guest cart.");
    }
  };

  const itemCount = runtimeCart.length;

  if (!mounted) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <Button variant="ghost" size="icon" className="relative cursor-pointer">
          <ShoppingCart className="h-6 w-6" />
        </Button>
      </Drawer>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="relative cursor-pointer">
          <ShoppingCart className="h-6 w-6" />
          {itemCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
              {itemCount > 9 ? "9+" : itemCount}
            </span>
          )}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="max-h-[85vh] rounded-t-2xl">
        <DrawerHeader className="border-b border-slate-100 px-4 py-3">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-base font-bold text-slate-900">
              Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
            </DrawerTitle>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        {isCartEmpty ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-4 border border-amber-100">
              <ShoppingBag className="w-7 h-7 text-amber-500" />
            </div>
            <p className="text-sm font-semibold text-slate-800 mb-1">
              Your cart is empty
            </p>
            <p className="text-xs text-slate-400 mb-6 text-center">
              Browse medicines and add items to your cart
            </p>
            <DrawerClose asChild>
              <Button
                asChild
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl"
              >
                <Link href="/shop">Start Shopping</Link>
              </Button>
            </DrawerClose>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 max-h-[40vh]">
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
                    className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-100"
                  >
                    <div className="relative w-14 h-14 rounded-lg bg-white border border-slate-100 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                      {primaryImage ? (
                        <Image
                          src={primaryImage}
                          alt={item.medicine.name}
                          width={48}
                          height={48}
                          className="object-contain max-h-full max-w-full"
                        />
                      ) : (
                        <ShoppingBag className="w-5 h-5 text-slate-300" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/medicine/${item.medicine.slug}`}
                        onClick={() => setOpen(false)}
                        className="text-xs font-semibold text-slate-800 leading-tight line-clamp-2 block"
                      >
                        {item.medicine.name}
                      </Link>
                      <p className="text-xs text-slate-500 mt-1">
                        <span className="font-bold text-slate-700">
                          {item.quantity}
                        </span>
                        <span className="text-slate-300 mx-1">×</span>৳
                        {itemPrice.toFixed(2)}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id, item.medicineId)}
                      className="shrink-0 p-1.5 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-slate-100 px-4 py-4 space-y-3 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">
                  Subtotal
                </span>
                <span className="text-base font-black text-slate-900">
                  ৳{subtotal.toFixed(2)}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                <p className="text-xs font-medium text-slate-700 mb-2">
                  {remainingForFreeShipping > 0 ? (
                    <>
                      Add{" "}
                      <span className="font-bold text-slate-900">
                        ৳{remainingForFreeShipping.toFixed(2)}
                      </span>{" "}
                      more for free shipping!
                    </>
                  ) : (
                    <span className="text-emerald-600 font-bold">
                      🎉 You qualify for Free Shipping!
                    </span>
                  )}
                </p>
                <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-500 rounded-full",
                      remainingForFreeShipping > 0
                        ? "bg-slate-900"
                        : "bg-emerald-500",
                    )}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <DrawerClose asChild>
                  <Button
                    variant="outline"
                    className="w-full border-slate-200 hover:bg-slate-50 font-semibold text-xs h-11 rounded-xl"
                    asChild
                  >
                    <Link href="/cart">View Cart</Link>
                  </Button>
                </DrawerClose>
                <DrawerClose asChild>
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-11 rounded-xl shadow-sm"
                    asChild
                  >
                    <Link href="/checkout">Checkout</Link>
                  </Button>
                </DrawerClose>
              </div>
            </div>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
