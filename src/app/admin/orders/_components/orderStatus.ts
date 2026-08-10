import {
  ClipboardList,
  Loader,
  Truck,
  PackageCheck,
  XCircle,
  Clock,
  CheckCircle2,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";

export const ORDER_STATUSES = [
  { value: "PLACED", label: "Placed" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
] as const;

export const ORDER_STATUS_BADGE: Record<
  string,
  { label: string; className: string; Icon: LucideIcon }
> = {
  PLACED: {
    label: "Placed",
    className: "bg-trust-50 text-trust-700 border-trust-200",
    Icon: ClipboardList,
  },
  PROCESSING: {
    label: "Processing",
    className: "bg-accent-50 text-amber-700 border-amber-200",
    Icon: Loader,
  },
  SHIPPED: {
    label: "Shipped",
    className: "bg-violet-50 text-violet-700 border-violet-200",
    Icon: Truck,
  },
  DELIVERED: {
    label: "Delivered",
    className: "bg-status-delivered/10 text-status-delivered border-status-delivered/20",
    Icon: PackageCheck,
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-50 text-red-700 border-red-200",
    Icon: XCircle,
  },
};

export const PAYMENT_BADGE: Record<
  string,
  { label: string; className: string; Icon: LucideIcon }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-accent-50 text-amber-700 border-amber-200",
    Icon: Clock,
  },
  PAID: {
    label: "Paid",
    className: "bg-status-delivered/10 text-status-delivered border-status-delivered/20",
    Icon: CheckCircle2,
  },
  REFUNDED: {
    label: "Refunded",
    className: "bg-red-50 text-red-700 border-red-200",
    Icon: RotateCcw,
  },
};
