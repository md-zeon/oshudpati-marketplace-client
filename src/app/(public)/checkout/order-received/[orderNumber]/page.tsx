import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CheckCircle2,
  ShoppingBag,
  Calendar,
  MapPin,
  ArrowRight,
  User,
  PhoneCall,
  Package,
  Truck,
  Clock,
  CreditCard,
  CircleAlert,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
} from "@/components/ui/stepper";

import { OrderService } from "@/services/order.service";
import { userService } from "@/services/user.service";
import Image from "next/image";
import { CopyOrderNumber } from "./_components/CopyOrderNumber";
import {
  OrderItemSnapshot,
  OrderReceivedPayload,
  ShippingAddressSnapshot,
  VendorOrder,
} from "@/types";

interface PageProps {
  params: Promise<{ orderNumber: string }>;
}

const STATUS_META: Record<
  string,
  { label: string; className: string; Icon: typeof Clock }
> = {
  PENDING: {
    label: "Payment pending (COD)",
    className: "bg-accent-50 text-accent-600",
    Icon: Clock,
  },
  PAID: {
    label: "Payment confirmed",
    className: "bg-brand-50 text-brand-800",
    Icon: CreditCard,
  },
  FAILED: {
    label: "Payment failed",
    className: "bg-danger/10 text-danger",
    Icon: CircleAlert,
  },
};

const expectedDelivery = () =>
  new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-BD", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

export default async function OrderReceivedPage({ params }: PageProps) {
  // Authenticate user session
  const sessionRes = await userService.getSession();
  if (!sessionRes?.success || !sessionRes?.data?.user) {
    redirect("/signin?redirect=/checkout");
  }

  const { orderNumber } = await params;

  // Fetch order details using the order number from the URL
  const orderRes = await OrderService.getOrderByOrderNumber(orderNumber);

  if (!orderRes?.success) {
    return (
      <div className="flex flex-col items-center px-4 py-16 text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-danger/10">
          <CircleAlert className="size-8 text-danger" aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-brand-900">
          Order Not Found
        </h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          We couldn&apos;t find the order you&apos;re looking for. It may have
          been removed or the link is incorrect.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            className="h-11 rounded-xl bg-brand-700 px-6 text-sm font-bold text-white hover:bg-brand-600"
          >
            <Link href="/dashboard/orders">View My Orders</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-11 rounded-xl border-border-default px-6 text-sm font-semibold"
          >
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  const order: OrderReceivedPayload = orderRes?.data;
  const address: ShippingAddressSnapshot = order?.shippingAddressSnapshot;

  // Flatten the items across all vendors to display them cleanly
  const allItems = order?.vendorOrders.flatMap((vo: VendorOrder) =>
    vo.orderItems.map((item: OrderItemSnapshot) => ({
      ...item,
      sellerName: vo.seller?.name || "Independent Pharmacy",
    })),
  );

  // Type-cast values safely from API strings
  const subtotal = Number(order?.subtotalAmount || 0);
  const deliveryFee = Number(order?.deliveryFee || 0);
  const discountAmount = Number(order?.discountAmount || 0);
  const totalAmount = Number(order?.totalAmount || 0);

  const paymentStatusKey = order?.paymentStatus?.toUpperCase();
  const statusMeta = STATUS_META[paymentStatusKey] ?? STATUS_META.PENDING;
  const StatusIcon = statusMeta.Icon;

  return (
    <div className="mx-auto max-w-3xl px-1 py-8 text-foreground sm:py-12">
      {/* ================= SUCCESS HERO ================= */}
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-brand-50">
          <CheckCircle2 className="size-9 text-brand-600" aria-hidden="true" />
        </div>
        <p className="mb-1 text-xs font-black uppercase tracking-widest text-brand-700">
          {paymentStatusKey === "PENDING"
            ? "Order Placed Successfully"
            : "Payment Confirmed"}
        </p>
        <h1 className="text-2xl font-black tracking-tight text-brand-900 sm:text-3xl">
          Thank you for your order!
        </h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground sm:text-base">
          Your order has been recorded. Our partner pharmacy will call you to
          confirm before dispatch.
        </p>
      </div>

      {/* ================= COMPLETED PROGRESS ================= */}
      <Stepper
        value={4}
        className="mb-8 w-full"
        orientation="horizontal"
        aria-label="Checkout progress — complete"
      >
        <StepperItem step={1} className="gap-1.5 sm:gap-2">
          <StepperIndicator className="size-6 border-brand-700 bg-brand-700 text-white sm:size-8" />
          <StepperTitle className="text-[10px] sm:text-sm">Cart</StepperTitle>
        </StepperItem>
        <StepperSeparator />
        <StepperItem step={2} className="gap-1.5 sm:gap-2">
          <StepperIndicator className="size-6 border-brand-700 bg-brand-700 text-white sm:size-8" />
          <StepperTitle className="text-[10px] sm:text-sm">
            Delivery
          </StepperTitle>
        </StepperItem>
        <StepperSeparator />
        <StepperItem step={3} className="gap-1.5 sm:gap-2">
          <StepperIndicator className="size-6 border-brand-700 bg-brand-700 text-white sm:size-8" />
          <StepperTitle className="text-[10px] sm:text-sm">Payment</StepperTitle>
        </StepperItem>
        <StepperSeparator />
        <StepperItem step={4} className="gap-1.5 sm:gap-2">
          <StepperIndicator className="size-6 border-brand-700 bg-brand-50 text-brand-900 sm:size-8" />
          <StepperTitle className="text-[10px] font-semibold sm:text-sm">
            Confirmed
          </StepperTitle>
        </StepperItem>
      </Stepper>

      {/* ================= ORDER META RIBBON ================= */}
      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border-default bg-card p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Order Reference
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <p
              className="truncate font-mono text-sm font-bold text-foreground"
              title={order.orderNumber}
            >
              {order.orderNumber}
            </p>
            <CopyOrderNumber orderNumber={order.orderNumber} />
          </div>
        </div>
        <div className="rounded-xl border border-border-default bg-card p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Order Date
          </p>
          <div className="mt-1.5 flex items-center gap-1.5 text-sm font-bold text-foreground">
            <Calendar className="size-4 text-brand-600" aria-hidden="true" />
            <span>
              {new Date(order.placedAt).toLocaleDateString("en-US", {
                dateStyle: "medium",
              })}
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-border-default bg-card p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Payment Status
          </p>
          <div className="mt-1.5">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${statusMeta.className}`}
            >
              <StatusIcon className="size-3.5" aria-hidden="true" />
              {statusMeta.label}
            </span>
          </div>
        </div>
      </div>

      {/* ================= WHAT HAPPENS NEXT ================= */}
      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex items-start gap-3 rounded-xl border border-border-default bg-surface-card p-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-100">
            <PhoneCall className="size-4 text-brand-700" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-bold text-foreground">Confirmation</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              We&apos;ll call you shortly to confirm your order.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-xl border border-border-default bg-surface-card p-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-100">
            <Package className="size-4 text-brand-700" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-bold text-foreground">Dispatch</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Your items are packed &amp; dispatched within 24 hours.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-xl border border-border-default bg-surface-card p-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-100">
            <Truck className="size-4 text-brand-700" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-bold text-foreground">Delivery</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Estimated by{" "}
              <span className="font-bold text-foreground">
                {expectedDelivery()}
              </span>
              . Pay in cash on arrival.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {/* ================= ORDERED ITEMS ================= */}
        <Card className="overflow-hidden rounded-2xl border border-border-default bg-card">
          <CardHeader className="border-b border-border-default bg-surface-card p-4">
            <CardTitle className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-foreground">
              <ShoppingBag className="size-4 text-brand-600" aria-hidden="true" />
              Items Summary ({allItems?.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border-default p-4">
            {allItems?.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 py-4 text-sm first:pt-0 last:pb-0"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {item.medicineImageSnapshot && (
                    <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border-default bg-surface-card">
                      <Image
                        src={item.medicineImageSnapshot}
                        alt={item.medicineNameSnapshot}
                        className="object-contain p-1"
                        fill
                        sizes="48px"
                      />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-bold text-brand-900">
                      {item.medicineNameSnapshot}
                    </p>
                    <p className="text-xs font-medium text-muted-foreground">
                      Qty: {item.quantity} × ৳
                      {Number(item.unitPrice).toFixed(2)}
                    </p>
                    <p className="mt-1 inline-block rounded bg-brand-50 px-1.5 py-0.5 text-[11px] font-semibold text-brand-700">
                      Seller: {item.sellerName}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 font-bold text-foreground">
                  ৳{Number(item.totalPrice).toFixed(2)}
                </span>
              </div>
            ))}

            <div className="mt-2 space-y-2 border-t border-border-default pt-4 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Items Subtotal</span>
                <span className="font-bold text-foreground">
                  ৳{subtotal.toFixed(2)}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-accent-600">
                  <span>Discount</span>
                  <span className="font-bold">- ৳{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Delivery Fee</span>
                <span
                  className={`font-bold ${deliveryFee === 0 ? "text-success" : "text-foreground"}`}
                >
                  {deliveryFee === 0 ? "FREE" : `৳${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <Separator />
              <div className="flex items-end justify-between pt-1">
                <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Total Amount
                </span>
                <span className="text-2xl font-black tracking-tight text-brand-900">
                  ৳{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ================= DELIVERY ADDRESS ================= */}
        <Card className="rounded-2xl border border-border-default bg-card p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2 border-b border-border-default pb-3">
            <MapPin className="size-4 text-brand-600" aria-hidden="true" />
            <h3 className="text-base font-bold text-brand-900">
              Delivery Address
            </h3>
          </div>
          {address ? (
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <User className="size-4 text-brand-600" aria-hidden="true" />
                <span>{address.fullName}</span>
                {address.addressLabel && (
                  <span className="rounded bg-surface-card px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-muted-foreground">
                    {address.addressLabel}
                  </span>
                )}
              </div>
              <p className="font-medium text-muted-foreground">
                Phone: {address.phoneNumber}
              </p>
              <p className="text-muted-foreground">
                {address.streetAddress}, {address.area}
              </p>
              <p className="text-muted-foreground">
                {address.district}, {address.division} - {address.postalCode}
              </p>
            </div>
          ) : (
            <p className="text-sm italic text-muted-foreground">
              No delivery snapshot stored.
            </p>
          )}

          {order.customerNote && (
            <div className="mt-4 rounded-lg border border-border-default bg-surface-card p-3">
              <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                Delivery Instructions
              </p>
              <p className="mt-0.5 text-sm font-medium text-foreground">
                &quot;{order.customerNote}&quot;
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
        <Button
          asChild
          className="h-12 w-full rounded-xl bg-brand-700 px-6 text-sm font-bold text-white hover:bg-brand-600 active:bg-brand-800 sm:w-auto"
        >
          <Link href={`/order-tracking?orderNumber=${order.orderNumber}`}>
            Track My Order
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-12 w-full rounded-xl border-border-default px-6 text-sm font-semibold sm:w-auto"
        >
          <Link href="/dashboard/orders">View My Orders</Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          className="h-12 w-full rounded-xl px-6 text-sm font-semibold text-brand-700 hover:bg-brand-50 sm:w-auto"
        >
          <Link href="/" className="flex items-center gap-2">
            Continue Shopping <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
