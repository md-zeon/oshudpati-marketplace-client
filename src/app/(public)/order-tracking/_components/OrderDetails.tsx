import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperDescription,
} from "@/components/ui/stepper";
import { OrderReceivedPayload } from "@/types";
import {
  Calendar,
  CreditCard,
  MapPin,
  Store,
  CheckCircle2,
  XCircle,
  ClipboardCheck,
  Package,
  Truck,
  Clock,
  CircleAlert,
  Check,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Props {
  order: OrderReceivedPayload;
}

const STATUS_STEPS = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED"] as const;

const STATUS_INFO: Record<string, { label: string; message: string }> = {
  PLACED: {
    label: "Order Placed",
    message: "We received your order.",
  },
  PROCESSING: {
    label: "Processing",
    message: "Seller is preparing your order.",
  },
  SHIPPED: {
    label: "On the Way",
    message: "Your order is out for delivery.",
  },
  DELIVERED: {
    label: "Delivered",
    message: "Order delivered successfully.",
  },
  CANCELLED: {
    label: "Cancelled",
    message: "This order was cancelled and will not be processed.",
  },
};

const STEP_META = {
  PLACED: {
    label: "Order Placed",
    message: "We received your order",
    Icon: ClipboardCheck,
    color: "bg-status-placed",
  },
  PROCESSING: {
    label: "Processing",
    message: "Seller is preparing your order",
    Icon: Package,
    color: "bg-status-processing",
  },
  SHIPPED: {
    label: "On the Way",
    message: "Your order is out for delivery",
    Icon: Truck,
    color: "bg-status-shipped",
  },
  DELIVERED: {
    label: "Delivered",
    message: "Order delivered successfully",
    Icon: CheckCircle2,
    color: "bg-status-delivered",
  },
} as const;

const normalize = (status: string) => status?.toUpperCase().trim();

const PAYMENT_META: Record<
  string,
  { label: string; className: string; Icon: typeof Clock }
> = {
  PENDING: {
    label: "Pending (COD)",
    className: "bg-accent-50 text-accent-600",
    Icon: Clock,
  },
  PAID: {
    label: "Paid",
    className: "bg-brand-50 text-brand-800",
    Icon: CreditCard,
  },
  FAILED: {
    label: "Failed",
    className: "bg-danger/10 text-danger",
    Icon: CircleAlert,
  },
};

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  });

export default function OrderDetails({ order }: Props) {
  const paymentStatusKey = order.paymentStatus?.toUpperCase();
  const paymentMeta = PAYMENT_META[paymentStatusKey] ?? PAYMENT_META.PENDING;
  const PaymentIcon = paymentMeta.Icon;

  const subtotal = Number(order.subtotalAmount || 0);
  const deliveryFee = Number(order.deliveryFee || 0);
  const discountAmount = Number(order.discountAmount || 0);
  const totalAmount = Number(order.totalAmount || 0);

  return (
    <div className="space-y-5">
      {/* ================= ORDER HEADER ================= */}
      <Card className="rounded-2xl border border-border-default bg-card">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Order Number
              </p>
              <h2 className="mt-1 font-mono text-2xl font-black text-brand-900">
                {order.orderNumber}
              </h2>

              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="size-4 text-brand-600" aria-hidden="true" />
                Placed {formatDateTime(order.placedAt)}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge className={cn("h-6 px-2.5", paymentMeta.className)}>
                <PaymentIcon className="mr-1 size-3" aria-hidden="true" />
                {paymentMeta.label}
              </Badge>
              <Badge
                variant="outline"
                className="h-6 border-border-default px-2.5 text-xs font-bold"
              >
                Total ৳{totalAmount.toFixed(2)}
              </Badge>
            </div>
          </div>

          {/* TOTALS */}
          <div className="mt-5 grid grid-cols-3 gap-3 rounded-xl bg-surface-card p-4">
            <div>
              <p className="text-xs text-muted-foreground">Subtotal</p>
              <p className="mt-0.5 font-bold text-foreground">
                ৳{subtotal.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Delivery</p>
              <p
                className={cn(
                  "mt-0.5 font-bold",
                  deliveryFee === 0 ? "text-success" : "text-foreground",
                )}
              >
                {deliveryFee === 0 ? "FREE" : `৳${deliveryFee.toFixed(2)}`}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="mt-0.5 font-black text-brand-900">
                ৳{totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
          {discountAmount > 0 && (
            <p className="mt-3 text-sm font-semibold text-accent-600">
              You saved ৳{discountAmount.toFixed(2)} on this order
            </p>
          )}
        </CardContent>
      </Card>

      {/* ================= DELIVERY ADDRESS ================= */}
      <Card className="rounded-2xl border border-border-default bg-card">
        <CardContent className="p-5 sm:p-6">
          <div className="mb-3 flex items-center gap-2">
            <MapPin className="size-5 text-brand-600" aria-hidden="true" />
            <h3 className="font-bold text-brand-900">Delivery Address</h3>
          </div>

          <p className="font-semibold text-foreground">
            {order.shippingAddressSnapshot.fullName}
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {order.shippingAddressSnapshot.phoneNumber}
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {order.shippingAddressSnapshot.streetAddress},{" "}
            {order.shippingAddressSnapshot.area},{" "}
            {order.shippingAddressSnapshot.district},{" "}
            {order.shippingAddressSnapshot.division}
          </p>
        </CardContent>
      </Card>

      {/* ================= VENDOR ORDERS ================= */}
      {order.vendorOrders.map((vendor) => {
        const statusKey = normalize(vendor.orderStatus);

        const isCancelled = statusKey === "CANCELLED";

        const currentIndex = STATUS_STEPS.indexOf(
          statusKey as (typeof STATUS_STEPS)[number],
        );

        const safeIndex = currentIndex === -1 ? 0 : currentIndex;

        const status = STATUS_INFO[statusKey] ?? {
          label: vendor.orderStatus,
          message: "",
        };

        return (
          <Card key={vendor.id} className="rounded-2xl border border-border-default bg-card">
            <CardContent className="space-y-5 p-5 sm:p-6">
              {/* SELLER */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-brand-50">
                    <Store className="size-5 text-brand-700" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">
                      {vendor.seller.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Seller · Subtotal ৳{Number(vendor.vendorSubtotal || 0).toFixed(2)}
                    </p>
                  </div>
                </div>

                <Badge
                  className={cn(
                    "h-6 px-2.5",
                    isCancelled
                      ? "bg-status-cancelled text-white"
                      : "border border-border-default bg-transparent text-foreground",
                  )}
                >
                  {isCancelled ? (
                    <XCircle className="mr-1 size-3" aria-hidden="true" />
                  ) : null}
                  {status.label}
                </Badge>
              </div>

              {/* STATUS MESSAGE */}
              <div
                className={cn(
                  "rounded-xl border p-4",
                  isCancelled
                    ? "border-status-cancelled/30 bg-danger/10"
                    : "border-border-default bg-surface-card",
                )}
              >
                <div className="flex items-center gap-2">
                  {isCancelled ? (
                    <XCircle className="size-4 text-status-cancelled" aria-hidden="true" />
                  ) : (
                    <CheckCircle2 className="size-4 text-success" aria-hidden="true" />
                  )}
                  <p className="font-semibold text-foreground">{status.label}</p>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {status.message}
                </p>
                {!isCancelled && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Clock className="size-3.5" aria-hidden="true" />
                    Last updated: {formatDateTime(vendor.updatedAt)}
                  </p>
                )}
              </div>

              {/* PROGRESS TIMELINE */}
              {isCancelled ? (
                <div className="flex items-center gap-2 rounded-xl border border-status-cancelled/30 bg-danger/10 p-4 text-sm font-semibold text-status-cancelled">
                  <XCircle className="size-4 shrink-0" aria-hidden="true" />
                  This vendor order was cancelled. No tracking available.
                </div>
              ) : (
                <Stepper
                  value={safeIndex + 1}
                  orientation="vertical"
                  aria-label={`${vendor.seller.name} order tracking timeline`}
                >
                  {STATUS_STEPS.map((step, index) => {
                    const meta = STEP_META[step];
                    const Icon = meta.Icon;
                    const isDone = index < safeIndex;
                    const isCurrent = index === safeIndex;

                    return (
                      <StepperItem
                        key={step}
                        step={index + 1}
                        className="gap-3"
                      >
                        <StepperIndicator
                          className={cn(
                            isCurrent
                              ? cn(
                                  meta.color,
                                  meta.color.replace("bg-", "border-"),
                                  "text-white ring-4",
                                  `${meta.color.replace("bg-", "ring-")}/20`,
                                )
                              : isDone
                                ? "border-brand-700 bg-brand-700 text-white"
                                : "border-border-default bg-card text-muted-foreground",
                          )}
                        >
                          {isDone ? (
                            <Check className="size-4" strokeWidth={3} aria-hidden="true" />
                          ) : (
                            <Icon className="size-4" aria-hidden="true" />
                          )}
                        </StepperIndicator>

                        <div className="min-w-0 pt-1">
                          <StepperTitle
                            className={cn(
                              "text-sm font-semibold",
                              isCurrent && "text-foreground",
                            )}
                          >
                            {meta.label}
                          </StepperTitle>
                          <StepperDescription className="text-xs">
                            {meta.message}
                          </StepperDescription>
                        </div>

                        {index < STATUS_STEPS.length - 1 && (
                          <StepperSeparator
                            className="group-data-[state=completed]/step:bg-brand-400 bg-border-default"
                          />
                        )}
                      </StepperItem>
                    );
                  })}
                </Stepper>
              )}

              {/* ITEMS */}
              <div className="space-y-3">
                {vendor.orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl border border-border-default p-3 transition-colors hover:bg-surface-card"
                  >
                    <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-card">
                      {item.medicineImageSnapshot ? (
                        <Image
                          src={item.medicineImageSnapshot}
                          alt={item.medicineNameSnapshot}
                          width={56}
                          height={56}
                          sizes="56px"
                          className="rounded-lg object-contain p-1"
                        />
                      ) : (
                        <Package className="size-6 text-muted-foreground" aria-hidden="true" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-brand-900">
                        {item.medicineNameSnapshot}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity} × ৳
                        {Number(item.unitPrice).toFixed(2)}
                      </p>
                    </div>

                    <p className="shrink-0 font-bold text-foreground">
                      ৳{Number(item.totalPrice).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
