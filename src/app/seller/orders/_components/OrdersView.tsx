"use client";

import { useState } from "react";
import { Package } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Empty, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderActions } from "./OrderActions";
import { OrderStatusBadge } from "../../_components/OrderStatusBadge";
import { motion } from "motion/react";
import PaginationControls from "@/components/shared/pagination/PaginationControls";
import type { SellerOrder, PaginationMeta } from "../page";

interface OrdersViewProps {
  orders: SellerOrder[];
  meta: PaginationMeta | null;
}

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
      {/* Filter Tabs */}
      <div className="mb-5 overflow-x-auto pb-1">
        <Tabs
          value={activeFilter}
          onValueChange={(v) => setActiveFilter(v as FilterTab)}
        >
          <TabsList className="h-auto w-full min-w-max p-1">
            {FILTERS.map((f) => {
              const count =
                f.key === "all" ? orders.length : statusCounts[f.key] || 0;
              return (
                <TabsTrigger
                  key={f.key}
                  value={f.key}
                  className="h-8 gap-1.5 px-3 text-xs"
                >
                  {f.label}
                  <Badge
                    className="h-4 min-w-4 px-1 text-[10px] font-bold bg-background text-muted-foreground border border-border-default"
                    aria-label={`${count} ${f.label.toLowerCase()} orders`}
                  >
                    {count}
                  </Badge>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Empty className="bg-card py-16">
            <EmptyHeader>
              <Package
                className="size-8 text-brand-600"
                aria-hidden
              />
              <EmptyTitle className="text-sm font-semibold text-foreground">
                {activeFilter === "all"
                  ? "No orders yet"
                  : `No ${activeFilter.toLowerCase()} orders`}
              </EmptyTitle>
            </EmptyHeader>
          </Empty>
        </motion.div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-hidden rounded-xl border border-border-default bg-card md:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-surface-card">
                  <TableHead className="font-semibold text-muted-foreground">
                    Order
                  </TableHead>
                  <TableHead className="font-semibold text-muted-foreground">
                    Customer
                  </TableHead>
                  <TableHead className="font-semibold text-muted-foreground">
                    Items
                  </TableHead>
                  <TableHead className="text-right font-semibold text-muted-foreground">
                    Total
                  </TableHead>
                  <TableHead className="text-center font-semibold text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="text-right font-semibold text-muted-foreground">
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((o) => (
                  <TableRow
                    key={o.id}
                    className="transition-colors hover:bg-brand-50/30"
                  >
                    <TableCell>
                      <span className="font-mono text-sm font-semibold text-foreground">
                        {o.order.orderNumber}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {o.order.customer.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {o.order.customer.phoneNumber ||
                            o.order.customer.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {o.orderItems.length}{" "}
                        {o.orderItems.length === 1 ? "item" : "items"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold text-brand-900">
                        ৳{Number(o.vendorSubtotal).toFixed(0)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <OrderActions
                          orderId={o.orderId}
                          currentStatus={o.orderStatus}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {new Date(o.createdAt).toLocaleDateString("en-BD", {
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-3 md:hidden">
            {filteredOrders.map((o) => (
              <div
                key={o.id}
                className="space-y-3 rounded-xl border border-border-default bg-card p-4"
              >
                {/* Order Number + Status */}
                <div className="flex items-center justify-between gap-2">
                  <span className="min-w-0 truncate font-mono text-sm font-bold text-foreground">
                    {o.order.orderNumber}
                  </span>
                  <OrderStatusBadge status={o.orderStatus} />
                </div>

                {/* Customer + Amount */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Customer
                    </p>
                    <p className="truncate font-medium text-foreground">
                      {o.order.customer.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {o.order.customer.phoneNumber || o.order.customer.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Amount
                    </p>
                    <p className="font-bold text-brand-900">
                      ৳{Number(o.vendorSubtotal).toFixed(0)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {o.orderItems.length}{" "}
                      {o.orderItems.length === 1 ? "item" : "items"}
                    </p>
                  </div>
                </div>

                {/* Date */}
                <div className="text-xs text-muted-foreground">
                  {new Date(o.createdAt).toLocaleDateString("en-BD", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>

                {/* Status Actions */}
                <div className="border-t border-border-default pt-3">
                  <OrderActions
                    orderId={o.orderId}
                    currentStatus={o.orderStatus}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {meta && <PaginationControls meta={meta} />}
        </>
      )}
    </div>
  );
}
