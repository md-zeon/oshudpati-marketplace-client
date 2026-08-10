"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { DashboardRecentOrder } from "@/types";
import { ShoppingBag, ChevronRight } from "lucide-react";
import { PageSection } from "@/components/shared/PageSection";

interface RecentOrdersListProps {
  orders: DashboardRecentOrder[];
}

const STATUS_BADGES: Record<string, string> = {
  PLACED: "bg-blue-50 text-blue-700 border-blue-200",
  PROCESSING: "bg-amber-50 text-amber-700 border-amber-200",
  SHIPPED: "bg-violet-50 text-violet-700 border-violet-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-status-cancelled/10 text-status-cancelled border-status-cancelled/20",
};

export function RecentOrdersList({ orders }: RecentOrdersListProps) {
  if (orders.length === 0) {
    return (
      <PageSection>
        <div className="bg-card rounded-xl border border-border-default p-5">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <h2 className="font-bold text-foreground">Recent Orders</h2>
          </div>

          <div className="text-center py-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <ShoppingBag className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            </motion.div>
            <p className="text-sm text-muted-foreground font-medium">
              No orders yet
            </p>
            <Link
              href="/shop"
              className="inline-block mt-3 text-sm font-semibold text-brand-700 hover:text-brand-600"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </PageSection>
    );
  }

  return (
    <PageSection>
      <div className="bg-card rounded-xl border border-border-default p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <h2 className="font-bold text-foreground">Recent Orders</h2>
          </div>
          <Link
            href="/dashboard/orders"
            className="text-xs font-medium text-brand-700 hover:text-brand-600 flex items-center gap-0.5"
          >
            View all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-2">
          {orders.slice(0, 5).map((order, index) => {
            const activeStatuses = order.vendorOrders
              .map((v) => v.orderStatus)
              .filter((s) => s !== "CANCELLED");

            const overallStatus =
              activeStatuses.length > 0
                ? activeStatuses.reduce((best, curr) => {
                    const orderRank = (s: string) =>
                      ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED"].indexOf(
                        s,
                      );
                    return orderRank(curr) > orderRank(best) ? curr : best;
                  }, "PLACED")
                : "CANCELLED";

            const badgeStyle =
              STATUS_BADGES[overallStatus] ||
              "bg-muted text-muted-foreground border-border-default";
            const itemCount = order.vendorOrders.reduce(
              (sum, v) => sum + v.orderItems.length,
              0,
            );

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  href={`/order-tracking?orderNumber=${order.orderNumber}`}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-border-default/60 hover:border-border-default hover:bg-muted/30 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {order.orderNumber}
                      </p>
                      <p className="text-[11px] text-muted-foreground/70 mt-0.5">
                        {itemCount} {itemCount === 1 ? "item" : "items"}{" "}
                        &middot;{" "}
                        {new Date(order.placedAt).toLocaleDateString("en-BD", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-bold text-foreground">
                      ৳{order.totalAmount.toFixed(0)}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${badgeStyle}`}
                    >
                      {overallStatus}
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
