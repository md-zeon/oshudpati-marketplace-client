import { redirect } from "next/navigation";
import { userService } from "@/services/user.service";
import { getAdminDashboardAction } from "@/actions/admin.action";
import { Users, Pill, ShoppingBag, DollarSign, Package } from "lucide-react";
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
  title: "Admin Dashboard",
  description: "Platform overview",
};

interface AdminStats {
  totalUsers: number;
  totalSellers: number;
  totalMedicines: number;
  totalOrders: number;
  totalRevenue: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  totalAmount: number;
  paymentStatus: string;
  placedAt: string;
  customerName: string;
  customerEmail: string;
}

const PAYMENT_BADGE: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
  REFUNDED: "bg-red-50 text-red-700 border-red-200",
};

const AdminDashboard = async () => {
  const session = await userService.getSession();
  if (!session?.success || !session.data?.user) return redirect("/signin");
  if (session.data.user.role !== "ADMIN") return redirect("/dashboard");

  const res = await getAdminDashboardAction();
  const stats: AdminStats = res?.success
    ? res.data.stats
    : {
        totalUsers: 0,
        totalSellers: 0,
        totalMedicines: 0,
        totalOrders: 0,
        totalRevenue: 0,
      };
  const recentOrders: RecentOrder[] = res?.success
    ? res.data.recentOrders || []
    : [];

  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      ring: "ring-blue-500/10",
    },
    {
      label: "Sellers",
      value: stats.totalSellers,
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      ring: "ring-emerald-500/10",
    },
    {
      label: "Medicines",
      value: stats.totalMedicines,
      icon: Pill,
      color: "text-violet-600",
      bg: "bg-violet-50",
      ring: "ring-violet-500/10",
    },
    {
      label: "Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "text-amber-600",
      bg: "bg-amber-50",
      ring: "ring-amber-500/10",
    },
    {
      label: "Revenue",
      value: `৳${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-rose-600",
      bg: "bg-rose-50",
      ring: "ring-rose-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      <PageSection>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-50">
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Admin Dashboard
            </h1>
            <p className="text-sm text-slate-500">
              Platform overview and analytics
            </p>
          </div>
        </div>
      </PageSection>

      <PageSection>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 stagger-children">
          {cards.map((c) => (
            <div
              key={c.label}
              className={`${c.bg} ${c.ring} ring-1 rounded-xl p-4 transition-all hover:scale-[1.02] hover:shadow-sm`}
            >
              <c.icon className={`w-5 h-5 ${c.color} mb-2`} />
              <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                {c.label}
              </p>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h2 className="font-bold text-slate-900">Recent Orders</h2>
          </div>
          {recentOrders.length === 0 ? (
            <div className="text-center py-10">
              <ShoppingBag className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No orders yet</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="font-semibold text-slate-600">
                        Order
                      </TableHead>
                      <TableHead className="font-semibold text-slate-600">
                        Customer
                      </TableHead>
                      <TableHead className="text-right font-semibold text-slate-600">
                        Amount
                      </TableHead>
                      <TableHead className="text-center font-semibold text-slate-600">
                        Payment
                      </TableHead>
                      <TableHead className="text-right font-semibold text-slate-600">
                        Date
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((o) => {
                      const badgeClass =
                        PAYMENT_BADGE[o.paymentStatus] ||
                        "bg-slate-50 text-slate-600";
                      return (
                        <TableRow
                          key={o.id}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <TableCell className="font-mono text-sm font-semibold text-slate-900">
                            {o.orderNumber}
                          </TableCell>
                          <TableCell>
                            <p className="font-medium text-slate-800 text-sm">
                              {o.customerName}
                            </p>
                            <p className="text-xs text-slate-400">
                              {o.customerEmail}
                            </p>
                          </TableCell>
                          <TableCell className="text-right font-semibold text-slate-800">
                            ৳{o.totalAmount.toFixed(0)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              className={`${badgeClass} border text-[10px] font-bold uppercase px-2 py-0.5`}
                            >
                              {o.paymentStatus}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-xs text-slate-400">
                            {new Date(o.placedAt).toLocaleDateString("en-BD", {
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

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-slate-100">
                {recentOrders.map((o) => {
                  const badgeClass =
                    PAYMENT_BADGE[o.paymentStatus] ||
                    "bg-slate-50 text-slate-600";
                  return (
                    <div key={o.id} className="p-4 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-sm font-bold text-slate-900">
                          {o.orderNumber}
                        </span>
                        <Badge
                          className={`${badgeClass} border text-[10px] font-bold uppercase px-2 py-0.5 shrink-0`}
                        >
                          {o.paymentStatus}
                        </Badge>
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 text-sm truncate">
                          {o.customerName}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          {o.customerEmail}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <p className="text-slate-500">
                          Amount:{" "}
                          <span className="font-bold text-slate-900">
                            ৳{o.totalAmount.toFixed(0)}
                          </span>
                        </p>
                        <p className="text-xs text-slate-400">
                          {new Date(o.placedAt).toLocaleDateString("en-BD", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </PageSection>
    </div>
  );
};
export default AdminDashboard;
