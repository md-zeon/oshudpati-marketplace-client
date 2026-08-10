import { redirect } from "next/navigation";
import { userService } from "@/services/user.service";
import { getAdminDashboardAction } from "@/actions/admin.action";
import {
  Users,
  Pill,
  ShoppingBag,
  DollarSign,
  Package,
  Store,
  Clock,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Empty, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
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

const PAYMENT_BADGE: Record<
  string,
  { label: string; className: string; Icon: typeof Clock }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-accent-50 text-amber-700 border-amber-200",
    Icon: Clock,
  },
  PAID: {
    label: "Paid",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Icon: CheckCircle2,
  },
  REFUNDED: {
    label: "Refunded",
    className: "bg-red-50 text-red-700 border-red-200",
    Icon: RotateCcw,
  },
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
      hint: "Registered accounts",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      chip: "bg-trust-50 text-trust-600",
      valueClass: "text-trust-900",
    },
    {
      label: "Sellers",
      hint: "Active pharmacy vendors",
      value: stats.totalSellers.toLocaleString(),
      icon: Store,
      chip: "bg-emerald-50 text-emerald-600",
      valueClass: "text-emerald-700",
    },
    {
      label: "Medicines",
      hint: "Listed products",
      value: stats.totalMedicines.toLocaleString(),
      icon: Pill,
      chip: "bg-violet-50 text-violet-600",
      valueClass: "text-violet-700",
    },
    {
      label: "Orders",
      hint: "All time orders",
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingBag,
      chip: "bg-accent-50 text-amber-600",
      valueClass: "text-amber-700",
    },
    {
      label: "Revenue",
      hint: "Platform total",
      value: `৳${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      chip: "bg-brand-50 text-brand-700",
      valueClass: "text-brand-800",
      featured: true,
    },
  ];

  return (
    <div className="space-y-6">
      <PageSection>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-trust-50 p-2.5">
            <Package className="h-5 w-5 text-trust-600" aria-hidden />
          </div>
          <div>
            <h1 className="text-xl font-bold text-trust-900">
              Admin Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Platform overview and analytics
            </p>
          </div>
        </div>
      </PageSection>

      <PageSection delay={0.05}>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5 stagger-children">
          {cards.map((c) => (
            <Card
              key={c.label}
              className={`border-admin-border transition-all hover:shadow-sm ${
                c.featured ? "ring-1 ring-brand-200 bg-brand-50/40" : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${c.chip}`}
                  >
                    <c.icon className="h-4.5 w-4.5" aria-hidden />
                  </span>
                </div>
                <p className={`text-2xl font-bold tracking-tight ${c.valueClass}`}>
                  {c.value}
                </p>
                <p className="mt-0.5 text-xs font-semibold text-foreground">
                  {c.label}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{c.hint}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection delay={0.1}>
        <Card className="border-admin-border">
          <CardHeader className="flex-row items-center justify-between border-b border-admin-border">
            <CardTitle className="text-base font-bold text-trust-900">
              Recent Orders
            </CardTitle>
            <Link
              href="/admin/orders"
              className="text-sm font-medium text-trust-600 underline-offset-4 outline-none transition-colors hover:text-trust-700 hover:underline focus-visible:ring-2 focus-visible:ring-trust-600"
            >
              View all
            </Link>
          </CardHeader>
          {recentOrders.length === 0 ? (
            <Empty className="py-12">
              <EmptyTitle className="text-muted-foreground">
                No orders yet
              </EmptyTitle>
              <EmptyDescription>
                Orders placed by customers will appear here.
              </EmptyDescription>
            </Empty>
          ) : (
            <>
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-trust-50/60">
                      <TableHead className="font-semibold text-admin-text">
                        Order
                      </TableHead>
                      <TableHead className="font-semibold text-admin-text">
                        Customer
                      </TableHead>
                      <TableHead className="text-right font-semibold text-admin-text">
                        Amount
                      </TableHead>
                      <TableHead className="text-center font-semibold text-admin-text">
                        Payment
                      </TableHead>
                      <TableHead className="text-right font-semibold text-admin-text">
                        Date
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((o) => {
                      const config =
                        PAYMENT_BADGE[o.paymentStatus] || {
                          label: o.paymentStatus,
                          className:
                            "bg-slate-50 text-slate-600 border-slate-200",
                          Icon: Clock,
                        };
                      const BadgeIcon = config.Icon;
                      return (
                        <TableRow
                          key={o.id}
                          className="transition-colors hover:bg-trust-50/40"
                        >
                          <TableCell className="font-mono text-sm font-semibold text-trust-900">
                            {o.orderNumber}
                          </TableCell>
                          <TableCell>
                            <p className="text-sm font-medium text-foreground">
                              {o.customerName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {o.customerEmail}
                            </p>
                          </TableCell>
                          <TableCell className="text-right font-semibold text-foreground">
                            ৳{o.totalAmount.toFixed(0)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              className={`${config.className} border px-2 py-0.5 text-[10px] font-bold uppercase`}
                            >
                              <BadgeIcon className="h-3 w-3" aria-hidden />
                              {config.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-xs text-muted-foreground">
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

              <div className="divide-y divide-slate-100 md:hidden">
                {recentOrders.map((o) => {
                  const config =
                    PAYMENT_BADGE[o.paymentStatus] || {
                      label: o.paymentStatus,
                      className: "bg-slate-50 text-slate-600 border-slate-200",
                      Icon: Clock,
                    };
                  const BadgeIcon = config.Icon;
                  return (
                    <div key={o.id} className="space-y-2 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-sm font-bold text-trust-900">
                          {o.orderNumber}
                        </span>
                        <Badge
                          className={`${config.className} border px-2 py-0.5 text-[10px] font-bold uppercase`}
                        >
                          <BadgeIcon className="h-3 w-3" aria-hidden />
                          {config.label}
                        </Badge>
                      </div>
                      <div>
                        <p className="truncate text-sm font-medium text-foreground">
                          {o.customerName}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {o.customerEmail}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <p className="text-muted-foreground">
                          Amount:{" "}
                          <span className="font-bold text-foreground">
                            ৳{o.totalAmount.toFixed(0)}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">
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
        </Card>
      </PageSection>
    </div>
  );
};
export default AdminDashboard;
