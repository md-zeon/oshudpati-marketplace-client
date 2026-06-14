"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { DashboardRecentOrder } from "@/types";
import { Package, ChevronRight, ShoppingBag } from "lucide-react";
import { PageSection } from "@/components/shared/PageSection";

interface ActiveOrdersProps {
  orders: DashboardRecentOrder[];
}

const STATUS_STEPS = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED"];

function getOrderProgress(orderStatus: string): number {
  const idx = STATUS_STEPS.indexOf(orderStatus);
  return idx === -1 ? 0 : (idx / (STATUS_STEPS.length - 1)) * 100;
}

const STATUS_COLORS: Record<string, string> = {
  PLACED: "bg-blue-500",
  PROCESSING: "bg-amber-500",
  SHIPPED: "bg-violet-500",
  DELIVERED: "bg-emerald-500",
  CANCELLED: "bg-red-500",
};

export function ActiveOrders({ orders }: ActiveOrdersProps) {
  const activeOrders = orders
    .filter((o) =>
      o.vendorOrders.some(
        (v) => v.orderStatus !== "DELIVERED" && v.orderStatus !== "CANCELLED",
      ),
    )
    .slice(0, 4);

  if (activeOrders.length === 0) return null;

  return (
    <PageSection>
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-600" />
            <h2 className="font-bold text-slate-900">Active Orders</h2>
          </div>
          <Link
            href="/dashboard/orders"
            className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5"
          >
            View all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activeOrders.map((order, index) => {
            const earliestStatus = order.vendorOrders.reduce((lowest, vo) => {
              const idx = STATUS_STEPS.indexOf(vo.orderStatus);
              const lowestIdx = STATUS_STEPS.indexOf(lowest);
              return idx < lowestIdx ? vo.orderStatus : lowest;
            }, "DELIVERED");

            const progress = getOrderProgress(earliestStatus);
            const statusColor = STATUS_COLORS[earliestStatus] || "bg-slate-400";

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
              >
                <Link
                  href={`/order-tracking?orderNumber=${order.orderNumber}`}
                  className="block p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-semibold text-slate-500">
                      #{order.orderNumber.slice(-10)}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      ৳{order.totalAmount.toFixed(0)}
                    </span>
                  </div>

                  <div className="relative h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                    <motion.div
                      className={`h-full rounded-full ${statusColor}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                    <span>{earliestStatus}</span>
                    <span>
                      {new Date(order.placedAt).toLocaleDateString("en-BD", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageSection>
  );
}
