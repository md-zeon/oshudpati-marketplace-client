"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ChevronUp, ShoppingBag, XCircle } from "lucide-react";
import { DashboardRecentOrder } from "@/types";
import { cancelVendorOrderAction } from "@/actions/order.action";
import { toast } from "sonner";

interface OrderCardProps {
  order: DashboardRecentOrder;
}

const STATUS_STEPS = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED"];

const STATUS_COLORS: Record<string, string> = {
  PLACED: "bg-status-placed",
  PROCESSING: "bg-status-processing",
  SHIPPED: "bg-status-shipped",
  DELIVERED: "bg-status-delivered",
  CANCELLED: "bg-status-cancelled",
};

const STATUS_BADGES: Record<string, string> = {
  PLACED: "bg-status-placed/10 text-status-placed border-status-placed/20",
  PROCESSING:
    "bg-status-processing/10 text-status-processing border-status-processing/20",
  SHIPPED: "bg-status-shipped/10 text-status-shipped border-status-shipped/20",
  DELIVERED:
    "bg-status-delivered/10 text-status-delivered border-status-delivered/20",
  CANCELLED:
    "bg-status-cancelled/10 text-status-cancelled border-status-cancelled/20",
};

function getProgress(status: string): number {
  const idx = STATUS_STEPS.indexOf(status);
  return idx === -1 ? 0 : (idx / (STATUS_STEPS.length - 1)) * 100;
}

export function OrderCard({ order }: OrderCardProps) {
  const [expanded, setExpanded] = useState(false);

  const totalItems = order.vendorOrders.reduce(
    (sum, v) => sum + v.orderItems.length,
    0,
  );

  const handleCancelVendor = async (
    e: React.MouseEvent,
    vendorOrderId: string,
  ) => {
    e.stopPropagation();
    if (
      !confirm(
        "Are you sure you want to cancel this vendor's portion of the order?",
      )
    )
      return;

    const res = await cancelVendorOrderAction(vendorOrderId);
    if (res?.success) {
      toast.success("Vendor order cancelled successfully");
    } else {
      toast.error(res?.message || "Failed to cancel vendor order");
    }
  };

  return (
    <motion.div
      className="bg-card rounded-xl border border-border-default overflow-hidden transition-all hover:border-border-default"
      layout
    >
      {/* Header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-muted/30 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-brand-subtle flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5 text-brand-700" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground truncate">
              {order.orderNumber}
            </p>
            <p className="text-xs text-muted-foreground">
              {totalItems} {totalItems === 1 ? "item" : "items"}
              {" · "}
              {new Date(order.placedAt).toLocaleDateString("en-BD", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-sm font-bold text-foreground">
            ৳{order.totalAmount.toFixed(0)}
          </span>

          {/* Per-vendor status badges */}
          <div className="hidden md:flex flex-col gap-1">
            {order.vendorOrders.slice(0, 2).map((vo) => {
              const badgeClass =
                STATUS_BADGES[vo.orderStatus] ||
                "bg-muted text-muted-foreground border-border-default";
              return (
                <span
                  key={vo.id}
                  className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full border ${badgeClass}`}
                >
                  {vo.orderStatus.slice(0, 4)}
                </span>
              );
            })}
            {order.vendorOrders.length > 2 && (
              <span className="text-[9px] text-muted-foreground">
                +{order.vendorOrders.length - 2} more
              </span>
            )}
          </div>

          {expanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded details */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="border-t border-border-default overflow-hidden"
          >
            {/* Vendor orders */}
            <div className="divide-y divide-border-default/50">
              {order.vendorOrders.map((vendor) => {
                const progress = getProgress(vendor.orderStatus);
                const statusColor =
                  STATUS_COLORS[vendor.orderStatus] || "bg-muted";
                const badgeClass =
                  STATUS_BADGES[vendor.orderStatus] ||
                  "bg-muted text-muted-foreground border-border-default";

                return (
                  <div key={vendor.id} className="p-4 md:p-5">
                    {/* Vendor Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${badgeClass}`}
                        >
                          {vendor.orderStatus}
                        </span>
                        {vendor.orderStatus === "PLACED" && (
                          <button
                            onClick={(e) => handleCancelVendor(e, vendor.id)}
                            className="text-[10px] font-semibold text-danger hover:text-danger transition-colors flex items-center gap-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger rounded-sm"
                          >
                            <XCircle className="w-3 h-3" />
                            Cancel
                          </button>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground">
                        ৳{vendor.vendorSubtotal.toFixed(0)}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="relative h-1 bg-muted rounded-full overflow-hidden mb-4">
                      <div
                        className={`h-full rounded-full transition-all ${statusColor}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    {/* Items */}
                    <div className="space-y-2">
                      {vendor.orderItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden flex items-center justify-center shrink-0">
                            {item.medicineImageSnapshot ? (
                              <Image
                                src={item.medicineImageSnapshot}
                                alt={item.medicineNameSnapshot}
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            ) : (
                              <ShoppingBag className="w-4 h-4 text-muted-foreground/50" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {item.medicineNameSnapshot}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Qty: {item.quantity} × ৳
                              {item.unitPrice.toFixed(0)}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-foreground">
                            ৳{item.totalPrice.toFixed(0)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 md:p-5 bg-muted/30 border-t border-border-default">
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>
                  Subtotal: <strong className="text-foreground">৳{order.subtotalAmount.toFixed(0)}</strong>
                </span>
                <span>
                  Delivery: <strong className="text-foreground">৳{order.deliveryFee.toFixed(0)}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/order-tracking?orderNumber=${order.orderNumber}`}
                  className="text-xs font-semibold text-brand-700 hover:text-brand-600 transition-colors"
                >
                  Track Order →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
