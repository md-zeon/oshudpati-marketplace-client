import { redirect } from "next/navigation";
import { userService } from "@/services/user.service";
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
import { OrderActions } from "./_components/OrderActions";

export const metadata = {
  title: "Orders",
  description: "Manage incoming orders",
};

const STATUS_BADGE: Record<string, string> = {
  PLACED: "bg-blue-50 text-blue-700 border-blue-200",
  PROCESSING: "bg-amber-50 text-amber-700 border-amber-200",
  SHIPPED: "bg-violet-50 text-violet-700 border-violet-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

interface SellerOrderItem {
  id: string;
  medicineId: string;
  medicineNameSnapshot: string;
  medicineImageSnapshot: string | null;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
}

interface SellerOrderCustomer {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
}

interface SellerOrder {
  id: string;
  orderId: string;
  orderStatus: string;
  vendorSubtotal: string;
  createdAt: string;
  order: {
    id: string;
    orderNumber: string;
    placedAt: string;
    shippingAddressSnapshot: {
      fullName: string;
      phoneNumber: string;
      division: string;
      district: string;
      area: string;
      streetAddress: string;
    };
    customer: SellerOrderCustomer;
  };
  orderItems: SellerOrderItem[];
}

const SellerOrders = async () => {
  const session = await userService.getSession();
  if (!session?.success || !session.data?.user) return redirect("/signin");
  if (session.data.user.role !== "SELLER") return redirect("/dashboard");

  let orders: SellerOrder[] = [];
  try {
    const cookieStore = await import("next/headers").then((m) => m.cookies());
    const { env } = await import("@/env");
    const res = await fetch(`${env.API_URL}/orders/seller-orders`, {
      headers: { Cookie: cookieStore.toString() },
      cache: "no-store",
    });
    const data = await res.json();
    if (data.success) orders = data.data;
  } catch {}

  // Group by order status for filter summary
  const statusCounts: Record<string, number> = {};
  orders.forEach((o) => {
    statusCounts[o.orderStatus] = (statusCounts[o.orderStatus] || 0) + 1;
  });

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-emerald-50">
          <Package className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Orders</h1>
          <p className="text-sm text-slate-500">{orders.length} total orders</p>
        </div>
      </div>

      {/* Status Summary Chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(statusCounts).map(([status, count]) => {
          const badgeClass =
            STATUS_BADGE[status] || "bg-slate-50 text-slate-600";
          return (
            <Badge
              key={status}
              className={`${badgeClass} border px-3 py-1.5 text-xs font-semibold`}
            >
              {status} ({count})
            </Badge>
          );
        })}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-sm font-medium text-slate-500">No orders yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
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
              {orders.map((o) => {
                const badgeClass =
                  STATUS_BADGE[o.orderStatus] ||
                  "bg-slate-50 text-slate-600 border-slate-200";
                return (
                  <TableRow key={o.id} className="hover:bg-slate-50/50">
                    <TableCell>
                      <span className="font-mono text-sm font-semibold text-slate-900">
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
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
export default SellerOrders;
