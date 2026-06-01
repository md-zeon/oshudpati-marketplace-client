import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { OrderReceivedPayload } from "@/types";
import {
  Calendar,
  CreditCard,
  MapPin,
  Store,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Image from "next/image";

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

const normalize = (status: string) => status?.toUpperCase().trim();

export default function OrderDetails({ order }: Props) {
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
            <div>
              <p className="text-sm text-gray-500">Order Number</p>
              <h2 className="text-2xl font-bold">{order.orderNumber}</h2>

              <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                {new Date(order.placedAt).toLocaleString()}
              </div>
            </div>

            <div className="flex gap-2">
              <Badge className="bg-green-600 text-white">
                <CreditCard className="mr-1 h-3 w-3" />
                {order.paymentStatus}
              </Badge>

              <Badge variant="outline">Total ৳{order.totalAmount}</Badge>
            </div>
          </div>

          {/* TOTALS */}
          <div className="mt-6 grid grid-cols-3 gap-4 rounded-lg bg-gray-50 p-4">
            <div>
              <p className="text-xs text-gray-500">Subtotal</p>
              <p className="font-semibold">৳{order.subtotalAmount}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Delivery</p>
              <p className="font-semibold">৳{order.deliveryFee}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Total</p>
              <p className="font-bold">৳{order.totalAmount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ADDRESS */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold">Delivery Address</h3>
          </div>

          <p className="font-medium">
            {order.shippingAddressSnapshot.fullName}
          </p>

          <p className="text-gray-500 text-sm">
            {order.shippingAddressSnapshot.phoneNumber}
          </p>

          <p className="text-gray-500 text-sm">
            {order.shippingAddressSnapshot.streetAddress},{" "}
            {order.shippingAddressSnapshot.area},{" "}
            {order.shippingAddressSnapshot.district},{" "}
            {order.shippingAddressSnapshot.division}
          </p>
        </CardContent>
      </Card>

      {/* VENDOR ORDERS */}
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
          <Card key={vendor.id}>
            <CardContent className="p-6 space-y-6">
              {/* SELLER */}
              <div className="flex justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-100 p-2">
                    <Store className="h-5 w-5 text-green-600" />
                  </div>

                  <div>
                    <h3 className="font-semibold">{vendor.seller.name}</h3>
                    <p className="text-sm text-gray-500">Seller</p>
                  </div>
                </div>

                <Badge
                  className={
                    isCancelled
                      ? "bg-red-500 text-white"
                      : "border border-gray-300"
                  }
                >
                  {status.label}
                </Badge>
              </div>

              {/* STATUS MESSAGE */}
              <div
                className={`rounded-lg border p-4 ${
                  isCancelled ? "bg-red-50 border-red-200" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  {isCancelled ? (
                    <XCircle className="h-4 w-4 text-red-500" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  )}

                  <p className="font-medium">{status.label}</p>
                </div>

                <p className="text-sm text-gray-500">{status.message}</p>
              </div>

              {/* PROGRESS (ONLY IF NOT CANCELLED) */}
              {!isCancelled && (
                <div className="relative flex justify-between">
                  <div className="absolute top-4 left-0 h-1 w-full bg-gray-200" />

                  <div
                    className="absolute top-4 left-0 h-1 bg-green-500 transition-all duration-500"
                    style={{
                      width: `${
                        (safeIndex / (STATUS_STEPS.length - 1)) * 100
                      }%`,
                    }}
                  />

                  {STATUS_STEPS.map((step, index) => {
                    const done = index <= safeIndex;

                    return (
                      <div
                        key={step}
                        className="relative flex flex-col items-center"
                      >
                        <div
                          className={`z-10 flex h-8 w-8 items-center justify-center rounded-full border bg-white ${
                            done
                              ? "border-green-500 text-green-600"
                              : "text-gray-400"
                          }`}
                        >
                          {done ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <div className="h-2 w-2 rounded-full bg-gray-300" />
                          )}
                        </div>

                        <p className="mt-2 text-xs text-gray-500">{step}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* CANCELLED STATE UI */}
              {isCancelled && (
                <div className="text-sm text-red-500 font-medium">
                  This vendor order was cancelled. No tracking available.
                </div>
              )}

              {/* ITEMS */}
              <div className="space-y-4">
                {vendor.orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-lg border p-4 hover:bg-gray-50"
                  >
                    <Image
                      src={item.medicineImageSnapshot}
                      alt={item.medicineNameSnapshot}
                      width={70}
                      height={70}
                      className="rounded-lg object-cover"
                    />

                    <div className="flex flex-1 justify-between">
                      <div>
                        <p className="font-medium">
                          {item.medicineNameSnapshot}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <p className="font-semibold">৳{item.totalPrice}</p>
                    </div>
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
