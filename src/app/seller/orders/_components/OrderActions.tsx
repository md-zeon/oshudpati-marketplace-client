"use client";

import { useState, useTransition } from "react";
import { updateOrderStatusAction } from "@/actions/order.action";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUS_BADGE: Record<string, string> = {
  PLACED: "bg-blue-50 text-blue-700 border-blue-200",
  PROCESSING: "bg-amber-50 text-amber-700 border-amber-200",
  SHIPPED: "bg-violet-50 text-violet-700 border-violet-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

const NEXT_STATUS: Record<string, string[]> = {
  PLACED: ["PROCESSING"],
  PROCESSING: ["SHIPPED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

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
      const toastId = toast.loading(`Updating to ${newStatus}...`);
      try {
        const res = await updateOrderStatusAction(orderId, newStatus);
        if (res?.success) {
          toast.success(`Order status updated to ${newStatus}`, {
            id: toastId,
          });
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

  const badgeClass =
    STATUS_BADGE[status] || "bg-slate-50 text-slate-600 border-slate-200";

  if (allowedTransitions.length === 0) {
    return (
      <Badge
        className={`${badgeClass} border text-[10px] font-bold uppercase px-2 py-0.5`}
      >
        {status}
      </Badge>
    );
  }

  return (
    <div
      className="flex flex-col sm:flex-row lg:items-center lg:justify-center gap-2 w-full"
      onClick={(e) => e.stopPropagation()}
    >
      <Select value="" onValueChange={handleStatusChange} disabled={isPending}>
        <SelectTrigger className="h-7 w-fit text-[10px] rounded-lg border-slate-200">
          {isPending ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Badge
              className={`${badgeClass} border text-[10px] font-bold uppercase px-2 py-0.5 shrink-0 self-start sm:self-auto`}
            >
              <SelectValue placeholder={status} />
            </Badge>
          )}
        </SelectTrigger>
        <SelectContent className="w-fit">
          {allowedTransitions.map((s) => (
            <SelectItem key={s} value={s} className="text-xs">
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
