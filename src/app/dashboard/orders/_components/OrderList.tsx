
"use client";

import { useState } from "react";
import { DashboardRecentOrder } from "@/types";
import { OrderCard } from "./OrderCard";
import { ShoppingBag, Package, CheckCircle, XCircle } from "lucide-react";

interface OrderListProps {
  orders: DashboardRecentOrder[];
}

type FilterTab = "all" | "active" | "completed" | "cancelled";

const FILTERS: { key: FilterTab; label: string; icon: typeof ShoppingBag }[] = [
  { key: "all", label: "All", icon: ShoppingBag },
  { key: "active", label: "Active", icon: Package },
  { key: "completed", label: "Completed", icon: CheckCircle },
  { key: "cancelled", label: "Cancelled", icon: XCircle },
];

function matchesFilter(
  order: DashboardRecentOrder,
  filter: FilterTab,
): boolean {
  if (filter === "all") return true;

  const statuses = order.vendorOrders.map((v) => v.orderStatus);

  if (filter === "active") {
    return statuses.some((s) => s !== "DELIVERED" && s !== "CANCELLED");
  }

  if (filter === "completed") {
    return statuses.every((s) => s === "DELIVERED");
  }

  if (filter === "cancelled") {
    return statuses.every((s) => s === "CANCELLED");
  }

  return true;
}

export function OrderList({ orders }: OrderListProps) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");

  const filteredOrders = orders.filter((o) => matchesFilter(o, activeFilter));

  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex items-center gap-1 mb-5 bg-slate-100 p-1 rounded-xl w-fit">
        {FILTERS.map((f) => {
          const Icon = f.icon;
          const isActive = activeFilter === f.key;

          return (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {f.label}
              {isActive && (
                <span className="text-[10px] text-slate-400 ml-0.5">
                  ({filteredOrders.length})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Orders */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-sm font-medium text-slate-500">
            {activeFilter === "all"
              ? "No orders yet"
              : `No ${activeFilter} orders`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
