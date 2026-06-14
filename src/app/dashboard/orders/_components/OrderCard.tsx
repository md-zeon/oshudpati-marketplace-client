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
  PLACED: "bg-blue-500",
  PROCESSING: "bg-amber-500",
  SHIPPED: "bg-violet-500",
  DELIVERED: "bg-emerald-500",
  CANCELLED: "bg-red-500",
};

const STATUS_BADGES: Record<string, string> = {
  PLACED: "bg-blue-50 text-blue-700 border-blue-200",
  PROCESSING: "bg-amber-50 text-amber-700 border-amber-200",
  SHIPPED: "bg-violet-50 text-violet-700 border-violet-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
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
      className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all hover:border-slate-300"
      layout
    >
      {/* Header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-slate-50/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">
              {order.orderNumber}
            </p>
            <p className="text-xs text-slate-400">
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
          <span className="text-sm font-bold text-slate-800">
            ৳{order.totalAmount.toFixed(0)}
          </span>

          {/* Per-vendor status badges */}
          <div className="hidden md:flex flex-col gap-1">
            {order.vendorOrders.slice(0, 2).map((vo) => {
              const badgeClass =
                STATUS_BADGES[vo.orderStatus] ||
                "bg-slate-50 text-slate-600 border-slate-200";
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
              <span className="text-[9px] text-slate-400">
                +{order.vendorOrders.length - 2} more
              </span>
            )}
          </div>

          {expanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
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
            className="border-t border-slate-100 overflow-hidden"
          >
            {/* Vendor orders */}
            <div className="divide-y divide-slate-50">
              {order.vendorOrders.map((vendor) => {
                const progress = getProgress(vendor.orderStatus);
                const statusColor =
                  STATUS_COLORS[vendor.orderStatus] || "bg-slate-400";
                const badgeClass =
                  STATUS_BADGES[vendor.orderStatus] ||
                  "bg-slate-50 text-slate-600 border-slate-200";

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
                            className="text-[10px] font-semibold text-red-500 hover:text-red-700 transition-colors flex items-center gap-0.5"
                          >
                            <XCircle className="w-3 h-3" />
                            Cancel
                          </button>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-slate-600">
                        ৳{vendor.vendorSubtotal.toFixed(0)}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="relative h-1 bg-slate-100 rounded-full overflow-hidden mb-4">
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
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                            {item.medicineImageSnapshot ? (
                              <Image
                                src={item.medicineImageSnapshot}
                                alt={item.medicineNameSnapshot}
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            ) : (
                              <ShoppingBag className="w-4 h-4 text-slate-300" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate">
                              {item.medicineNameSnapshot}
                            </p>
                            <p className="text-xs text-slate-400">
                              Qty: {item.quantity} × ৳
                              {item.unitPrice.toFixed(0)}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-slate-700">
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
            <div className="flex items-center justify-between p-4 md:p-5 bg-slate-50/50 border-t border-slate-100">
              <div className="flex gap-4 text-xs text-slate-500">
                <span>
                  Subtotal: <strong>৳{order.subtotalAmount.toFixed(0)}</strong>
                </span>
                <span>
                  Delivery: <strong>৳{order.deliveryFee.toFixed(0)}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/order-tracking?orderNumber=${order.orderNumber}`}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
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
