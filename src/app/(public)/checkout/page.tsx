import { redirect } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { AddressService } from "@/services/address.service";
import { CartService } from "@/services/cart.service";
import { userService } from "@/services/user.service";

import { CheckoutForm } from "./_components/checkoutForm";
import { AddressSection } from "./_components/addressSection";
import { CartSummaryItem } from "./_components/cartSummaryItem";
import { CartItem } from "@/types";
import { env } from "@/env";
import { SubmitButton } from "./_components/SubmitButton";

const FREE_SHIPPING_THRESHOLD = env.FREE_SHIPPING_THRESHOLD || 300;
const FLAT_SHIPPING_CHARGE = env.FLAT_SHIPPING_CHARGE || 60;

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
    <div className="py-8 text-slate-900">
      <h2 className="font-bold tracking-tight mb-6 text-slate-900">
        Checkout Details
      </h2>

      {/* Pass structural calculations directly into our composite form handler */}
      <CheckoutForm cartItems={cartItems}>
        {/* Left Side: Address Selection Form Section */}
        <div className="flex-1 w-full space-y-6">
          <AddressSection savedAddresses={savedAddresses} />
        </div>

        {/* Right Side: Sticky Checkout Pricing Block */}
        <div className="w-full lg:w-96 lg:sticky lg:top-8">
          <Card className="shadow-sm border border-slate-200 rounded-xl bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/60 border-b border-slate-100 p-4">
              <CardTitle className="text-xs font-black tracking-wider text-slate-700 uppercase flex items-center gap-2">
                <ShoppingBag className="w-3.5 h-3.5 text-blue-600" /> Cart
                Summary ({cartItems.length})
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 divide-y divide-slate-100 max-h-65 overflow-y-auto custom-scrollbar">
              {cartItems.map((item) => (
                <CartSummaryItem key={item.id} item={item} />
              ))}
            </CardContent>

            <div className="bg-slate-50/50 border-t border-slate-100 p-4 space-y-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-800">
                  ৳{itemsSubtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 items-center">
                <span>Estimated Shipping</span>
                <span
                  className={`font-bold ${shippingFee === 0 ? "text-emerald-600" : "text-slate-800"}`}
                >
                  {shippingFee === 0 ? "FREE" : `৳${shippingFee.toFixed(2)}`}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between items-end pt-1">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                    Total Payable
                  </span>
                  <span className="text-xl font-black text-slate-900 tracking-tight">
                    ৳{grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <SubmitButton disabled={cartItems.length === 0} />
            </div>
          </Card>
        </div>
      </CheckoutForm>
    </div>
  );
}
