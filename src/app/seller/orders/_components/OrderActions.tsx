"use client";

import { useState, useTransition } from "react";
import { updateOrderStatusAction } from "@/actions/order.action";
import { toast } from "sonner";
import { Loader2, ChevronsUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderStatusBadge } from "../../_components/OrderStatusBadge";

const NEXT_STATUS: Record<string, string[]> = {
  PLACED: ["PROCESSING"],
  PROCESSING: ["SHIPPED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

const statusLabel = (status: string) =>
  status.charAt(0) + status.slice(1).toLowerCase();

interface OrderActionsProps {
  orderId: string;
  currentStatus: string;
}

export function OrderActions({ orderId, currentStatus }: OrderActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(currentStatus);

  const allowedTransitions = NEXT_STATUS[currentStatus] || [];

  const handleStatusChange = (newStatus: string) => {
    startTransition(async () => {
      const toastId = toast.loading(`Updating to ${statusLabel(newStatus)}...`);
      try {
        const res = await updateOrderStatusAction(orderId, newStatus);
        if (res?.success) {
          toast.success(
            `Order status updated to ${statusLabel(newStatus)}`,
            { id: toastId },
          );
          setStatus(newStatus);
        } else {
          toast.error(res?.message || "Failed to update status", {
            id: toastId,
          });
        }
      } catch {
        toast.error("Unexpected error", { id: toastId });
      }
    });
  };

  return (
    <div
      className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-center"
      onClick={(e) => e.stopPropagation()}
    >
      <OrderStatusBadge status={status} />
      {allowedTransitions.length > 0 && (
        <Select value="" onValueChange={handleStatusChange} disabled={isPending}>
          <SelectTrigger
            className="h-7 w-auto gap-1 rounded-lg border-border-default px-2 text-xs font-medium text-muted-foreground"
            aria-label={`Advance order status from ${statusLabel(status)}`}
          >
            {isPending ? (
              <Loader2 className="size-3.5 animate-spin" aria-hidden />
            ) : (
              <ChevronsUpDown className="size-3.5" aria-hidden />
            )}
            <SelectValue placeholder="Update" />
          </SelectTrigger>
          <SelectContent className="min-w-40">
            {allowedTransitions.map((s) => (
              <SelectItem key={s} value={s} className="text-xs">
                Move to {statusLabel(s)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
