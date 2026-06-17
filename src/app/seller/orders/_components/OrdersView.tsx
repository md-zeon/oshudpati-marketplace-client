"use client";

import { useState } from "react";
import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderActions } from "./OrderActions";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import PaginationControls from "@/components/shared/pagination/PaginationControls";
import type { SellerOrder, PaginationMeta } from "../page";

interface OrdersViewProps {
  orders: SellerOrder[];
  meta: PaginationMeta | null;
}

const STATUS_BADGE: Record<string, string> = {
  PLACED: "bg-blue-50 text-blue-700 border-blue-200",
  PROCESSING: "bg-amber-50 text-amber-700 border-amber-200",
  SHIPPED: "bg-violet-50 text-violet-700 border-violet-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

type FilterTab =
  | "all"
  | "PLACED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

const FILTERS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "PLACED", label: "Placed" },
  { key: "PROCESSING", label: "Processing" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "DELIVERED", label: "Delivered" },
  { key: "CANCELLED", label: "Cancelled" },
];

export function OrdersView({ orders, meta }: OrdersViewProps) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");

  const filteredOrders =
    activeFilter === "all"
      ? orders
      : orders.filter((o) => o.orderStatus === activeFilter);

  const statusCounts: Record<string, number> = {};
  orders.forEach((o) => {
    statusCounts[o.orderStatus] = (statusCounts[o.orderStatus] || 0) + 1;
  });

  return (
    <div>
      {/* Filter Tabs — scrollable on mobile */}
      <div className="mb-5 -mx-4 px-4 overflow-x-auto scrollbar-none">
        <div className="flex items-center flex-wrap gap-1 bg-slate-100 p-1 rounded-xl w-fit">
          {FILTERS.map((f) => {
            const isActive = activeFilter === f.key;
            const count =
              f.key === "all" ? orders.length : statusCounts[f.key] || 0;

            return (
              <motion.button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
                layout
              >
                {f.label}
                <span className="text-[10px] text-slate-400">({count})</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 ? (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-sm font-medium text-slate-500">
            {activeFilter === "all"
              ? "No orders yet"
              : `No ${activeFilter.toLowerCase()} orders`}
          </p>
        </motion.div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-xl border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-semibold text-slate-600">
                    Order
                  </TableHead>
                  <TableHead className="font-semibold text-slate-600">
                    Customer
                  </TableHead>
                  <TableHead className="font-semibold text-slate-600">
                    Items
                  </TableHead>
                  <TableHead className="text-right font-semibold text-slate-600">
                    Total
                  </TableHead>
                  <TableHead className="text-center font-semibold text-slate-600">
                    Status
                  </TableHead>
                  <TableHead className="text-right font-semibold text-slate-600">
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="wait">
                  {filteredOrders.map((o) => (
                    <motion.tr
                      key={o.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <TableCell>
                        <span
                          className={cn(
                            "font-mono text-sm font-semibold text-slate-900 px-2 py-1 rounded-lg",
                            STATUS_BADGE[o.orderStatus] ||
                              "bg-slate-50 text-slate-600 border-slate-200",
                          )}
                        >
                          {o.order.orderNumber}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-slate-800 text-sm">
                            {o.order.customer.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {o.order.customer.phoneNumber ||
                              o.order.customer.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-slate-600">
                          {o.orderItems.length} items
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-semibold text-slate-800">
                          ৳{Number(o.vendorSubtotal).toFixed(0)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <OrderActions
                          orderId={o.orderId}
                          currentStatus={o.orderStatus}
                        />
                      </TableCell>
                      <TableCell className="text-right text-xs text-slate-400">
                        {new Date(o.createdAt).toLocaleDateString("en-BD", {
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filteredOrders.map((o) => {
              const badgeClass =
                STATUS_BADGE[o.orderStatus] ||
                "bg-slate-50 text-slate-600 border-slate-200";
              return (
                <div
                  key={o.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 space-y-3"
                >
                  {/* Order Number + Status Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-sm font-bold text-slate-900 truncate min-w-0">
                      {o.order.orderNumber}
                    </span>
                    <Badge
                      className={`${badgeClass} border text-[10px] font-bold uppercase px-2 py-0.5 shrink-0`}
                    >
                      {o.orderStatus}
                    </Badge>
                  </div>

                  {/* Customer + Items + Total */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
                        Customer
                      </p>
                      <p className="font-medium text-slate-800 truncate">
                        {o.order.customer.name}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {o.order.customer.phoneNumber || o.order.customer.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
                        Amount
                      </p>
                      <p className="font-bold text-slate-900">
                        ৳{Number(o.vendorSubtotal).toFixed(0)}
                      </p>
                      <p className="text-xs text-slate-400">
                        {o.orderItems.length} items
                      </p>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="text-xs text-slate-400">
                    {new Date(o.createdAt).toLocaleDateString("en-BD", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>

                  {/* Status Actions */}
                  <div className="pt-2 border-t border-slate-100">
                    <OrderActions
                      orderId={o.orderId}
                      currentStatus={o.orderStatus}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {meta && <PaginationControls meta={meta} />}
        </>
      )}
    </div>
  );
}
