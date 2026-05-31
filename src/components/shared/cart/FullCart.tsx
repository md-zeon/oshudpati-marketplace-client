"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getLocalCart, saveLocalCart, clearLocalCart } from "@/lib/local-cart";
import { CartItem } from "@/types";
import { addToCart, removeFromCart } from "@/actions/cart.action";
import {
  ChevronRight,
  ShoppingBag,
  Minus,
  Plus,
  X,
  ShoppingCart,
} from "lucide-react";

const FREE_SHIPPING_THRESHOLD = 300;
const FLAT_SHIPPING_CHARGE = 50;

interface FullCartProps {
  initialCart: CartItem[];
  isLoggedIn?: boolean;
}

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12">
      <div className="relative w-40 h-40 mb-6 flex items-center justify-center select-none">
        <ShoppingCart className="w-20 h-20 text-slate-300" />
        <span className="absolute top-3 right-3 text-5xl text-amber-400 font-black font-serif bottom-16 animate-pulse">
          ?
        </span>
      </div>

      <div className="w-full max-w-4xl border border-gray-200 bg-white py-4 px-6 rounded text-center mb-8">
        <p className="text-sm text-gray-700 font-medium tracking-wide">
          Your cart is currently empty.
        </p>
      </div>

      <Button
        asChild
        className="bg-[#121824] hover:bg-[#1f293d] text-white text-xs font-bold px-7 py-5 tracking-wide rounded-lg transition-colors duration-150"
      >
        <Link href="/shop">Return to shop</Link>
      </Button>
    </div>
  );
}

export default function FullCart({
  initialCart = [],
  isLoggedIn = false,
}: FullCartProps) {
  const [cart, setCart] = useState<CartItem[]>(initialCart || []);

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

  // Absolute Dynamic Flag Adjustments
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

  const changeQuantity = async (item: CartItem, newQty: number) => {
    if (newQty < 1 || newQty > (item.medicine.stockQuantity || 999)) return;

    if (isLoggedIn) {
      try {
        const res = await addToCart(item.medicineId, newQty - item.quantity);
        if (res.success) {
          setCart((prev) =>
            prev.map((it) =>
              it.id === item.id ? { ...it, quantity: newQty } : it,
            ),
          );
          toast.success("Quantity updated");
        } else {
          toast.error(res.message || "Failed to update quantity");
        }
      } catch (e) {
        toast.error("Server error updating quantity");
      }
    } else {
      const updated = cart.map((it) =>
        it.medicineId === item.medicineId ? { ...it, quantity: newQty } : it,
      );
      saveLocalCart(updated);
      setCart(updated);
      toast.success("Quantity updated (guest)");
    }
  };

  const handleRemove = async (item: CartItem) => {
    if (isLoggedIn) {
      const res = await removeFromCart(item.id);
      if (res.success) {
        setCart((prev) => prev.filter((it) => it.id !== item.id));
        toast.success("Item removed");
      } else {
        toast.error(res.message || "Failed to remove item");
      }
    } else {
      const updated = cart.filter((it) => it.medicineId !== item.medicineId);
      saveLocalCart(updated);
      setCart(updated);
      toast.success("Item removed from guest cart");
    }
  };

  if (!cart || cart.length === 0) return <EmptyCart />;

  return (
    <div className="text-slate-900 selection:bg-blue-100">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1 w-full">
          {/* Realtime Actionable Shipping Progress Banner */}
          <div
            className={`border rounded-xl p-5 mb-6 transition-all duration-300 ${
              isShippingFree
                ? "bg-[#f4fbf7] border-[#e2f3e9]"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-3">
              <ShoppingBag
                className={`w-5 h-5 ${isShippingFree ? "text-[#10b981]" : "text-slate-500"}`}
              />
              <span>
                {isShippingFree ? (
                  <span className="text-[#0f172a] font-bold">
                    Your order qualifies for free shipping!
                  </span>
                ) : (
                  <>
                    Add{" "}
                    <span className="font-bold text-black">
                      ৳{remainingForFreeShipping.toFixed(2)}
                    </span>{" "}
                    more to qualify for free shipping!
                  </>
                )}
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${isShippingFree ? "bg-[#10b981]" : "bg-slate-900"}`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Desktop Matrix Columns Header Labels */}
          <div className="hidden md:grid grid-cols-12 gap-4 border-b border-slate-200 pb-3 text-xs font-bold uppercase tracking-wider text-slate-400 px-2">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Subtotal</div>
          </div>

          {/* Cart Mapping Data Sequence Container */}
          <div className="divide-y divide-slate-100">
            {cart.map((item) => {
              const primaryImage =
                item.medicine.images?.find((i) => i.isPrimary)?.imageUrl ||
                item.medicine.images?.[0]?.imageUrl;
              const price = parseFloat(
                item.medicine.discountPrice || item.medicine.price || "0",
              );

              return (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-4 items-center py-5 px-2 group"
                >
                  {/* Left Block Product Title and Thumbnail Image */}
                  <div className="col-span-12 md:col-span-6 flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-xl bg-slate-50 border border-slate-200 p-1.5 flex items-center justify-center overflow-hidden shrink-0">
                      {primaryImage ? (
                        <Image
                          src={primaryImage}
                          alt={item.medicine.name}
                          width={60}
                          height={60}
                          className="object-contain max-h-full max-w-full mix-blend-multiply"
                        />
                      ) : (
                        <div className="text-[10px] text-slate-400">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/medicine/${item.medicine.slug}`}
                        className="font-bold text-sm md:text-base text-slate-900 leading-snug hover:text-blue-600 transition-colors block"
                      >
                        {item.medicine.name}
                      </Link>
                      <span className="text-xs text-slate-400 font-medium block mt-0.5 truncate">
                        {item.medicine.genericName || "Pharmaceutical Option"}
                      </span>
                    </div>
                  </div>

                  {/* Individual Price Metric Block */}
                  <div className="col-span-4 md:col-span-2 text-left md:text-center text-sm font-medium text-slate-600">
                    <span className="md:hidden font-bold block text-[10px] text-slate-400 mb-0.5">
                      PRICE
                    </span>
                    ৳{price.toFixed(2)}
                  </div>

                  {/* Operational Multiplier Action Step Elements */}
                  <div className="col-span-4 md:col-span-2 flex justify-start md:justify-center">
                    <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-sm">
                      <button
                        onClick={() => changeQuantity(item, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 font-bold text-sm text-slate-800 min-w-[28px] text-center select-none">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => changeQuantity(item, item.quantity + 1)}
                        disabled={
                          item.quantity >= (item.medicine.stockQuantity || 999)
                        }
                        className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Individual Accumulative Multiplied Pricing Summary Row */}
                  <div className="col-span-4 md:col-span-2 flex items-center justify-end gap-3 text-right">
                    <div>
                      <span className="md:hidden font-bold block text-[10px] text-slate-400 mb-0.5">
                        SUBTOTAL
                      </span>
                      <span className="font-bold text-sm md:text-base text-slate-900">
                        ৳{(price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemove(item)}
                      className="text-slate-400 hover:text-rose-500 border border-slate-200 hover:border-rose-100 rounded-lg p-1.5 transition bg-white hover:bg-rose-50/40 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Accumulative Metrics Sidebar */}
        <div className="w-full lg:w-90 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-fit shrink-0">
          <h2 className="text-xs font-black tracking-wider text-slate-900 uppercase border-b border-slate-100 pb-4 mb-4">
            Cart Totals
          </h2>

          <div className="flex justify-between items-center text-sm mb-4">
            <span className="text-slate-500 font-medium">Subtotal</span>
            <span className="font-bold text-slate-900">
              ৳{subtotal.toFixed(2)}
            </span>
          </div>

          <hr className="border-slate-100 my-4" />

          {/* Fully Automated Shipping Text Indicator Container */}
          <div className="flex justify-between items-start text-sm mb-6">
            <span className="text-slate-500 font-medium pt-0.5">Shipment</span>
            <div className="text-right">
              {isShippingFree ? (
                <span className="text-sm font-bold text-[#10b981] block">
                  Free shipping
                </span>
              ) : (
                <span className="text-sm font-bold text-slate-900 block">
                  ৳{FLAT_SHIPPING_CHARGE.toFixed(2)}
                </span>
              )}
              {/* Shipping Location will be dynamically updated in the future from address model */}
              <div className="text-xs text-slate-400 mt-1">
                Shipping to{" "}
                <span className="font-bold text-slate-700">Dhaka, BD.</span>
              </div>
            </div>
          </div>

          <hr className="border-slate-100 my-4" />

          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-slate-500 font-medium">Total</span>
            <span className="text-xl font-black text-slate-900">
              ৳{grandTotal.toFixed(2)}
            </span>
          </div>

          {/* Bottom Processing Control Button Trigger Elements */}
          <Button
            className="w-full bg-[#008ecc] hover:bg-[#007cbd] text-white font-bold py-6 rounded-xl transition-all text-sm tracking-wide shadow-sm"
            asChild
          >
            <Link href="/checkout">Proceed to checkout</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
