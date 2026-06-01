import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CheckCircle2,
  ShoppingBag,
  Calendar,
  MapPin,
  ArrowRight,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import { OrderService } from "@/services/order.service";
import { userService } from "@/services/user.service";
import Image from "next/image";
import {
  OrderItemSnapshot,
  OrderReceivedPayload,
  ShippingAddressSnapshot,
  VendorOrder,
} from "@/types";

interface PageProps {
  params: Promise<{ orderNumber: string }>;
}

export default async function OrderReceivedPage({ params }: PageProps) {
  // Authenticate user session
  const sessionRes = await userService.getSession();
  if (!sessionRes.success || !sessionRes.data?.user) {
    redirect("/signin?redirect=/checkout");
  }

  const { orderNumber } = await params;

  console.log("Order Received page accessed with order number:", orderNumber);

  // Fetch order details using the order number from the URL
  const orderRes = await OrderService.getOrderByOrderNumber(orderNumber);

  console.log("Fetched order details for order number:", orderNumber, orderRes);
  if (!orderRes.success) {
    return (
      <>
        <div className="flex flex-col items-center text-center py-20">
          <div className="p-3 bg-red-50 rounded-full mb-4">
            <CheckCircle2 className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase mb-2">
            Order Not Found
          </h2>
          <p className="text-slate-500 text-xs mt-2 max-w-md">
            We couldn&apos;t find the order you&apos;re looking for. It may have
            been removed or the link is incorrect.
          </p>
          <Button
            asChild
            variant="outline"
            className="mt-6 h-11 px-6 rounded-xl text-xs font-bold tracking-wider uppercase"
          >
            <Link href="/dashboard/orders">View My Orders</Link>
          </Button>
        </div>
      </>
    );
  }

  const order: OrderReceivedPayload = orderRes.data;
  const address: ShippingAddressSnapshot = order.shippingAddressSnapshot;

  // Flatten the items across all vendors to display them cleanly
  const allItems = order.vendorOrders.flatMap((vo: VendorOrder) =>
    vo.orderItems.map((item: OrderItemSnapshot) => ({
      ...item,
      sellerName: vo.seller?.name || "Independent Pharmacy",
    })),
  );

  // Type-cast values safely from API strings
  const subtotal = Number(order.subtotalAmount || 0);
  const deliveryFee = Number(order.deliveryFee || 0);
  const totalAmount = Number(order.totalAmount || 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-slate-900">
      {/* Banner Header Status */}
      <div className="flex flex-col items-center text-center mb-10 animate-fadeIn">
        <div className="p-3 bg-emerald-50 rounded-full mb-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-600" />
        </div>
        <p className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-1">
          {order.paymentStatus === "PENDING"
            ? "Order Placed Successfully"
            : "Payment Confirmed"}
        </p>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
          Thank you for your order!
        </h2>
        <p className="text-slate-500 text-xs mt-2 max-w-md">
          Your order has been recorded. Your items will be dispatched via our
          partner pharmacies shortly.
        </p>
      </div>

      {/* Meta Specs Ribbon Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-50/80 p-4 border border-slate-100 rounded-xl text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Order Reference
          </p>
          <p
            className="text-xs font-mono font-bold text-slate-800 mt-1 truncate px-1"
            title={order.orderNumber}
          >
            {order.orderNumber}
          </p>
        </div>
        <div className="bg-slate-50/80 p-4 border border-slate-100 rounded-xl text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Order Date
          </p>
          <div className="flex items-center justify-center gap-1 text-xs font-bold text-slate-800 mt-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {new Date(order.placedAt).toLocaleDateString("en-US", {
                dateStyle: "medium",
              })}
            </span>
          </div>
        </div>
        <div className="bg-slate-50/80 p-4 border border-slate-100 rounded-xl text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Payment Status
          </p>
          <p
            className={`text-xs font-black uppercase mt-1 inline-block px-2 py-0.5 rounded ${
              order.paymentStatus === "PENDING"
                ? "bg-amber-50 text-amber-700"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {order.paymentStatus}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Ordered Prescription Manifest Card */}
        <Card className="shadow-sm border border-slate-200 rounded-xl bg-white overflow-hidden">
          <CardHeader className="bg-slate-50/60 border-b border-slate-100 p-4">
            <CardTitle className="text-xs font-black tracking-wider text-slate-700 uppercase flex items-center gap-2">
              <ShoppingBag className="w-3.5 h-3.5 text-blue-600" /> Items
              Summary Bundle ({allItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 divide-y divide-slate-100">
            {allItems.map((item) => (
              <div
                key={item.id}
                className="py-4 flex items-center justify-between gap-4 text-xs first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {item.medicineImageSnapshot && (
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-100 shrink-0 bg-slate-50 flex items-center justify-center">
                      <Image
                        src={item.medicineImageSnapshot}
                        alt={item.medicineNameSnapshot}
                        className="object-contain p-1"
                        fill
                      />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 truncate">
                      {item.medicineNameSnapshot}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Qty: {item.quantity} × ৳
                      {Number(item.unitPrice).toFixed(2)}
                    </p>
                    <p className="text-[9px] text-blue-600 font-semibold bg-blue-50 px-1.5 py-0.5 rounded inline-block mt-1">
                      Seller: {item.sellerName}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-slate-900 shrink-0">
                  ৳{Number(item.totalPrice).toFixed(2)}
                </span>
              </div>
            ))}

            <div className="pt-4 mt-2 space-y-2 text-xs border-t border-slate-100">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-800">
                  ৳{subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 items-center">
                <span>Delivery Fee</span>
                <span
                  className={`font-bold ${deliveryFee === 0 ? "text-emerald-600" : "text-slate-800"}`}
                >
                  {deliveryFee === 0 ? "FREE" : `৳${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between items-end pt-1">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Total Amount
                </span>
                <span className="text-xl font-black text-slate-900 tracking-tight">
                  ৳{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Snapshot Destination block */}
        <Card className="shadow-sm border border-slate-200 rounded-xl bg-white p-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
            <MapPin className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-800">
              Delivery Address Details
            </h3>
          </div>
          {address ? (
            <div className="text-xs space-y-1 text-slate-600">
              <div className="flex items-center gap-1.5 text-slate-900 font-bold text-sm mb-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>{address.fullName}</span>
                {address.addressLabel && (
                  <span className="text-[9px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-black ml-1">
                    {address.addressLabel}
                  </span>
                )}
              </div>
              <p className="font-medium text-slate-700">
                Phone: {address.phoneNumber}
              </p>
              <p className="mt-1">
                {address.streetAddress}, {address.area}
              </p>
              <p>
                {address.district}, {address.division} - {address.postalCode}
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              No delivery snapshot stored.
            </p>
          )}

          {order.customerNote && (
            <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Dispatch Special Instructions
              </p>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                &quot;{order.customerNote}&quot;
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Button Route Triggers */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mt-8">
        <Button
          asChild
          variant="outline"
          className="w-full sm:w-auto h-11 px-6 rounded-xl text-xs font-bold tracking-wider uppercase"
        >
          <Link href="/dashboard/orders">View My Orders</Link>
        </Button>
        <Button
          asChild
          className="w-full sm:w-auto h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold tracking-wider uppercase shadow-sm"
        >
          <Link href="/" className="flex items-center gap-2">
            Continue Shopping <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
