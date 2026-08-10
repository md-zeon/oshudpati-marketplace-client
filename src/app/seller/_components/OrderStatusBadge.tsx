import {
  Clock,
  RefreshCw,
  Truck,
  PackageCheck,
  XCircle,
  CircleDashed,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<
  string,
  { label: string; icon: LucideIcon; className: string }
> = {
  PLACED: {
    label: "Placed",
    icon: Clock,
    className: "bg-blue-50 text-status-placed border-blue-200",
  },
  PROCESSING: {
    label: "Processing",
    icon: RefreshCw,
    className: "bg-amber-50 text-status-processing border-amber-200",
  },
  SHIPPED: {
    label: "Shipped",
    icon: Truck,
    className: "bg-violet-50 text-status-shipped border-violet-200",
  },
  DELIVERED: {
    label: "Delivered",
    icon: PackageCheck,
    className: "bg-status-delivered/10 text-status-delivered border-status-delivered/20",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    className: "bg-red-50 text-status-cancelled border-red-200",
  },
};

export function OrderStatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const config =
    STATUS_CONFIG[status] || {
      label: status,
      icon: CircleDashed,
      className: "bg-slate-50 text-slate-600 border-slate-200",
    };
  const Icon = config.icon;

  return (
    <Badge
      className={cn(
        "gap-1 border px-2 py-0.5 text-[11px] font-semibold normal-case",
        config.className,
        className,
      )}
    >
      <Icon className="size-3" aria-hidden />
      {config.label}
    </Badge>
  );
}
