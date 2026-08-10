"use client";

import { useState } from "react";
import {
  Badge,
} from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Eye, Package } from "lucide-react";
import { ORDER_STATUS_BADGE, PAYMENT_BADGE } from "./orderStatus";

export interface OrderItem {
  id: string;
  medicineNameSnapshot: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
}

export interface VendorOrder {
  id: string;
  sellerId: string;
  orderStatus: string;
  vendorSubtotal: string;
  orderItems: OrderItem[];
  seller: { id: string; name: string; email: string };
}

export interface CustomerInfo {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  paymentStatus: string;
  totalAmount: string;
  placedAt: string;
  createdAt: string;
  customer: CustomerInfo;
  vendorOrders: VendorOrder[];
}

interface OrdersTableProps {
  orders: Order[];
}

function resolveStatus(order: Order): string {
  const statuses = order.vendorOrders.map((vo) => vo.orderStatus);
  if (statuses.length === 0) return "PLACED";
  if (statuses.every((s) => s === "DELIVERED")) return "DELIVERED";
  if (
    statuses.some((s) => s === "CANCELLED") &&
    statuses.every((s) => s === "DELIVERED" || s === "CANCELLED")
  )
    return "DELIVERED";
  if (statuses.some((s) => s === "CANCELLED")) return "CANCELLED";
  if (statuses.some((s) => s === "SHIPPED")) return "SHIPPED";
  if (statuses.some((s) => s === "PROCESSING")) return "PROCESSING";
  return "PLACED";
}

function totalItems(order: Order): number {
  return order.vendorOrders.reduce(
    (sum, vo) => sum + vo.orderItems.reduce((s, i) => s + i.quantity, 0),
    0,
  );
}

function StatusBadge({ status }: { status: string }) {
  const config = ORDER_STATUS_BADGE[status] || {
    label: status,
    className: "bg-slate-50 text-slate-600 border-slate-200",
    Icon: Package,
  };
  const Icon = config.Icon;
  return (
    <Badge className={`${config.className} border px-2 py-0.5 text-[10px] font-bold uppercase`}>
      <Icon className="h-3 w-3" aria-hidden />
      {config.label}
    </Badge>
  );
}

function PaymentBadge({ status }: { status: string }) {
  const config = PAYMENT_BADGE[status] || {
    label: status,
    className: "bg-slate-50 text-slate-600 border-slate-200",
    Icon: Package,
  };
  const Icon = config.Icon;
  return (
    <Badge className={`${config.className} border px-2 py-0.5 text-[10px] font-bold uppercase`}>
      <Icon className="h-3 w-3" aria-hidden />
      {config.label}
    </Badge>
  );
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const [selected, setSelected] = useState<Order | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const openOrder = (order: Order) => {
    setSelected(order);
    setSheetOpen(true);
  };

  return (
    <>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-trust-50/60">
              <TableHead className="font-semibold text-admin-text">
                Order #
              </TableHead>
              <TableHead className="font-semibold text-admin-text">
                Customer
              </TableHead>
              <TableHead className="font-semibold text-admin-text">
                Items
              </TableHead>
              <TableHead className="text-center font-semibold text-admin-text">
                Status
              </TableHead>
              <TableHead className="text-right font-semibold text-admin-text">
                Total
              </TableHead>
              <TableHead className="text-right font-semibold text-admin-text">
                Date
              </TableHead>
              <TableHead className="text-right font-semibold text-admin-text">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order.id}
                className="transition-colors hover:bg-trust-50/40"
              >
                <TableCell>
                  <Button
                    variant="link"
                    onClick={() => openOrder(order)}
                    className="h-auto p-0 font-mono text-sm font-bold text-trust-700 outline-none focus-visible:ring-2 focus-visible:ring-trust-600"
                  >
                    #{order.orderNumber}
                  </Button>
                </TableCell>
                <TableCell>
                  <p className="text-sm font-medium text-foreground">
                    {order.customer.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.customer.email}
                  </p>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {totalItems(order)} item{totalItems(order) !== 1 ? "s" : ""}
                </TableCell>
                <TableCell className="text-center">
                  <StatusBadge status={resolveStatus(order)} />
                </TableCell>
                <TableCell className="text-right text-sm font-bold text-foreground">
                  ৳{Number(order.totalAmount).toFixed(2)}
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">
                  {new Date(
                    order.placedAt || order.createdAt,
                  ).toLocaleDateString("en-BD", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => openOrder(order)}
                    aria-label={`View order ${order.orderNumber}`}
                    className="h-8 w-8 text-admin-text/60 hover:text-trust-700"
                  >
                    <Eye className="h-4 w-4" aria-hidden />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="divide-y divide-slate-100 md:hidden">
        {orders.map((order) => (
          <button
            key={order.id}
            onClick={() => openOrder(order)}
            className="w-full p-4 text-left outline-none transition-colors hover:bg-trust-50/40 focus-visible:ring-2 focus-visible:ring-trust-600"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="truncate font-mono text-sm font-bold text-trust-900">
                #{order.orderNumber}
              </span>
              <StatusBadge status={resolveStatus(order)} />
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase text-muted-foreground">
                  Customer
                </p>
                <p className="truncate font-medium text-foreground">
                  {order.customer.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {order.customer.email}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-semibold uppercase text-muted-foreground">
                  Amount
                </p>
                <p className="font-bold text-foreground">
                  ৳{Number(order.totalAmount).toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {totalItems(order)} items
                </p>
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {new Date(order.placedAt || order.createdAt).toLocaleDateString(
                "en-BD",
                { month: "short", day: "numeric", year: "numeric" },
              )}
            </div>
          </button>
        ))}
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="right"
          className="w-full overflow-y-auto sm:max-w-lg"
        >
          {selected && (
            <>
              <SheetHeader className="border-b border-admin-border pb-4">
                <SheetTitle className="font-mono text-lg text-trust-900">
                  #{selected.orderNumber}
                </SheetTitle>
                <SheetDescription className="text-sm text-muted-foreground">
                  Placed{" "}
                  {new Date(selected.placedAt || selected.createdAt).toLocaleString(
                    "en-BD",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    },
                  )}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 py-4">
                <section aria-label="Customer">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-admin-text">
                    Customer
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {selected.customer.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selected.customer.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selected.customer.phoneNumber || "No phone on record"}
                  </p>
                </section>

                <section aria-label="Payment">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-admin-text">
                    Payment
                  </h3>
                  <div className="mt-1.5">
                    <PaymentBadge status={selected.paymentStatus} />
                  </div>
                </section>

                <section aria-label="Items">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-admin-text">
                    Items
                  </h3>
                  <div className="mt-2 space-y-4">
                    {selected.vendorOrders.map((vo) => (
                      <div
                        key={vo.id}
                        className="rounded-lg border border-admin-border bg-trust-50/40 p-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-trust-900">
                            {vo.seller.name}
                          </p>
                          <StatusBadge status={vo.orderStatus} />
                        </div>
                        <div className="mt-2 space-y-1.5">
                          {vo.orderItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-start justify-between gap-2 text-sm"
                            >
                              <p className="min-w-0 flex-1 text-muted-foreground">
                                {item.medicineNameSnapshot}
                                <span className="ml-1 text-xs text-muted-foreground">
                                  × {item.quantity}
                                </span>
                              </p>
                              <p className="shrink-0 font-medium text-foreground">
                                ৳{Number(item.totalPrice).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                        <p className="mt-2 border-t border-admin-border pt-2 text-right text-sm font-semibold text-foreground">
                          Subtotal: ৳{Number(vo.vendorSubtotal).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-admin-border pt-3">
                    <p className="text-sm font-semibold text-foreground">
                      Order total
                    </p>
                    <p className="text-base font-bold text-brand-800">
                      ৳{Number(selected.totalAmount).toFixed(2)}
                    </p>
                  </div>
                </section>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
