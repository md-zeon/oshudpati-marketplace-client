import Link from "next/link";
import { DashboardRecentOrder } from "@/types";
import { ShoppingBag, ChevronRight } from "lucide-react";

interface RecentOrdersListProps {
  orders: DashboardRecentOrder[];
}

const STATUS_BADGES: Record<string, string> = {
  PLACED: "bg-blue-50 text-blue-700 border-blue-200",
  PROCESSING: "bg-amber-50 text-amber-700 border-amber-200",
  SHIPPED: "bg-violet-50 text-violet-700 border-violet-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

export function RecentOrdersList({ orders }: RecentOrdersListProps) {
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingBag className="w-4 h-4 text-emerald-600" />
          <h2 className="font-bold text-slate-900">Recent Orders</h2>
        </div>

        <div className="text-center py-10">
          <ShoppingBag className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-slate-500 font-medium">No orders yet</p>
          <Link
            href="/shop"
            className="inline-block mt-3 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-emerald-600" />
          <h2 className="font-bold text-slate-900">Recent Orders</h2>
        </div>
        <Link
          href="/dashboard/orders"
          className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5"
        >
          View all <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-2">
        {orders.slice(0, 5).map((order) => {
          // Get the best status: filter out CANCELLED, show the furthest along
          // If all are CANCELLED, show CANCELLED
          const activeStatuses = order.vendorOrders
            .map((v) => v.orderStatus)
            .filter((s) => s !== "CANCELLED");

          const overallStatus =
            activeStatuses.length > 0
              ? activeStatuses.reduce((best, curr) => {
                  const orderRank = (s: string) =>
                    ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED"].indexOf(s);
                  return orderRank(curr) > orderRank(best) ? curr : best;
                }, "PLACED")
              : "CANCELLED";

          const badgeStyle =
            STATUS_BADGES[overallStatus] ||
            "bg-slate-50 text-slate-600 border-slate-200";
          const itemCount = order.vendorOrders.reduce(
            (sum, v) => sum + v.orderItems.length,
            0,
          );

          return (
            <Link
              key={order.id}
              href={`/order-tracking?orderNumber=${order.orderNumber}`}
              className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-4 h-4 text-slate-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {order.orderNumber}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {itemCount} {itemCount === 1 ? "item" : "items"} &middot;{" "}
                    {new Date(order.placedAt).toLocaleDateString("en-BD", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm font-bold text-slate-800">
                  ৳{order.totalAmount.toFixed(0)}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${badgeStyle}`}
                >
                  {overallStatus}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
