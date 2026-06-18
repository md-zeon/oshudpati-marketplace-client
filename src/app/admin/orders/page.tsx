import { redirect } from "next/navigation";
import { userService } from "@/services/user.service";
import { getAllOrdersAction } from "@/actions/admin.action";
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
import { PageSection } from "@/components/shared/PageSection";

export const metadata = {
  title: "Manage Orders",
  description: "Admin order management",
};

const STATUS_BADGE: Record<string, string> = {
  PLACED: "bg-blue-50 text-blue-700 border-blue-200",
  PROCESSING: "bg-amber-50 text-amber-700 border-amber-200",
  SHIPPED: "bg-purple-50 text-purple-700 border-purple-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

interface CustomerInfo {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
}

interface OrderItem {
  id: string;
  medicineNameSnapshot: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
}

interface VendorOrder {
  id: string;
  sellerId: string;
  orderStatus: string;
  vendorSubtotal: string;
  orderItems: OrderItem[];
  seller: { id: string; name: string; email: string };
}

interface Order {
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

interface SearchParams {
  search?: string;
}

const AdminOrders = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const session = await userService.getSession();
  if (!session?.success || !session.data?.user) return redirect("/signin");
  if (session.data.user.role !== "ADMIN") return redirect("/dashboard");

  const params = await searchParams;

  const res = await getAllOrdersAction();
  const orders: Order[] = res?.success ? res.data : [];

  const filteredOrders = params.search
    ? orders.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(params.search!.toLowerCase()) ||
          o.customer.name
            .toLowerCase()
            .includes(params.search!.toLowerCase()) ||
          o.customer.email.toLowerCase().includes(params.search!.toLowerCase()),
      )
    : orders;

  return (
    <div>
      <PageSection>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-50">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Orders</h1>
              <p className="text-sm text-slate-500">
                {filteredOrders.length} total orders
              </p>
            </div>
          </div>
        </div>
      </PageSection>

      <PageSection>
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-sm font-medium text-slate-500">
              {params.search
                ? "No orders match your search"
                : "No orders found"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold text-slate-600">
                      Order #
                    </TableHead>
                    <TableHead className="font-semibold text-slate-600">
                      Customer
                    </TableHead>
                    <TableHead className="font-semibold text-slate-600">
                      Items
                    </TableHead>
                    <TableHead className="text-center font-semibold text-slate-600">
                      Status
                    </TableHead>
                    <TableHead className="text-right font-semibold text-slate-600">
                      Total
                    </TableHead>
                    <TableHead className="text-right font-semibold text-slate-600">
                      Date
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => {
                    const totalItems = order.vendorOrders.reduce(
                      (sum, vo) =>
                        sum + vo.orderItems.reduce((s, i) => s + i.quantity, 0),
                      0,
                    );
                    const statuses = order.vendorOrders.map(
                      (vo) => vo.orderStatus,
                    );
                    const displayStatus = statuses.every(
                      (s) => s === "DELIVERED",
                    )
                      ? "DELIVERED"
                      : statuses.some((s) => s === "CANCELLED") &&
                          statuses.every(
                            (s) => s === "DELIVERED" || s === "CANCELLED",
                          )
                        ? "DELIVERED"
                        : statuses.some((s) => s === "CANCELLED")
                          ? "CANCELLED"
                          : statuses.some((s) => s === "SHIPPED")
                            ? "SHIPPED"
                            : statuses.some((s) => s === "PROCESSING")
                              ? "PROCESSING"
                              : "PLACED";
                    const statusBadge =
                      STATUS_BADGE[displayStatus] ||
                      "bg-slate-50 text-slate-600";

                    return (
                      <TableRow
                        key={order.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <TableCell>
                          <span className="font-mono font-bold text-sm text-slate-800">
                            #{order.orderNumber}
                          </span>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-slate-800 text-sm">
                            {order.customer.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {order.customer.email}
                          </p>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {totalItems} item{totalItems !== 1 ? "s" : ""}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className={`${statusBadge} border text-[10px] font-bold uppercase px-2 py-0.5`}
                          >
                            {displayStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-bold text-sm text-slate-800">
                          ৳{Number(order.totalAmount).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right text-xs text-slate-400">
                          {new Date(
                            order.placedAt || order.createdAt,
                          ).toLocaleDateString("en-BD", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredOrders.map((order) => {
                const totalItems = order.vendorOrders.reduce(
                  (sum, vo) =>
                    sum + vo.orderItems.reduce((s, i) => s + i.quantity, 0),
                  0,
                );
                const statuses = order.vendorOrders.map((vo) => vo.orderStatus);
                const displayStatus = statuses.every((s) => s === "DELIVERED")
                  ? "DELIVERED"
                  : statuses.some((s) => s === "CANCELLED")
                    ? "CANCELLED"
                    : statuses.some((s) => s === "SHIPPED")
                      ? "SHIPPED"
                      : statuses.some((s) => s === "PROCESSING")
                        ? "PROCESSING"
                        : "PLACED";
                const statusBadge =
                  STATUS_BADGE[displayStatus] || "bg-slate-50 text-slate-600";

                return (
                  <div key={order.id} className="p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono font-bold text-sm text-slate-800 truncate">
                        #{order.orderNumber}
                      </span>
                      <Badge
                        className={`${statusBadge} border text-[10px] font-bold uppercase px-2 py-0.5 shrink-0`}
                      >
                        {displayStatus}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">
                          Customer
                        </p>
                        <p className="font-medium text-slate-800 truncate">
                          {order.customer.name}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          {order.customer.email}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">
                          Amount
                        </p>
                        <p className="font-bold text-slate-900">
                          ৳{Number(order.totalAmount).toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-400">
                          {totalItems} items
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400">
                      {new Date(
                        order.placedAt || order.createdAt,
                      ).toLocaleDateString("en-BD", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PageSection>
    </div>
  );
};
export default AdminOrders;
