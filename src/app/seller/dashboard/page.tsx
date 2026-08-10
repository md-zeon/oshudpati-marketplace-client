import { redirect } from "next/navigation";
import { userService } from "@/services/user.service";
import {
  Pill,
  ShoppingBag,
  Package,
  DollarSign,
  Store,
  LayoutDashboard,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { PageSection } from "@/components/shared/PageSection";
import { DashboardService } from "@/services/dashboard.service";
import { SellerPageHeader } from "../_components/SellerPageHeader";
import { OrderStatusBadge } from "../_components/OrderStatusBadge";

export const metadata = {
  title: "Seller Dashboard",
  description: "Manage your seller account",
};

interface SellerData {
  shop: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    description: string | null;
  } | null;
  stats: {
    totalMedicines: number;
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
  };
  recentOrders: {
    id: string;
    orderNumber: string;
    orderStatus: string;
    vendorSubtotal: number;
    itemCount: number;
    createdAt: string;
  }[];
}

const SellerDashboard = async () => {
  const session = await userService.getSession();
  if (!session?.success || !session.data?.user) return redirect("/signin");
  if (session.data.user.role !== "SELLER") return redirect("/dashboard");

  let data: SellerData = {
    shop: null,
    stats: {
      totalMedicines: 0,
      totalOrders: 0,
      pendingOrders: 0,
      totalRevenue: 0,
    },
    recentOrders: [],
  };
  try {
    const res = await DashboardService.getSellerDashboard();
    if (res?.success) data = res.data;
  } catch {}

  const { shop, stats, recentOrders } = data;

  const statCards = [
    {
      label: "Medicines",
      value: stats.totalMedicines,
      icon: Pill,
      tint: "bg-brand-50 text-brand-700",
      href: "/seller/medicines",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      tint: "bg-trust-50 text-trust-600",
      href: "/seller/orders",
    },
    {
      label: "Pending",
      value: stats.pendingOrders,
      icon: Package,
      tint: "bg-accent-50 text-accent-600",
      href: "/seller/orders",
    },
    {
      label: "Revenue",
      value: `৳${stats.totalRevenue.toFixed(0)}`,
      icon: DollarSign,
      tint: "bg-violet-50 text-violet-600",
      href: null,
    },
  ];

  return (
    <div className="space-y-6">
      <SellerPageHeader
        title="Seller Dashboard"
        subtitle="An overview of your shop, orders and medicines at a glance"
        icon={<LayoutDashboard className="size-5" aria-hidden />}
        action={
          <Button asChild className="bg-brand-700 text-white hover:bg-brand-600 active:bg-brand-800">
            <Link href="/seller/medicines/new">
              <Plus className="size-4" aria-hidden />
              Add Medicine
            </Link>
          </Button>
        }
      />

      {/* Shop Status Alert */}
      {!shop ? (
        <PageSection>
          <div className="flex flex-col gap-3 rounded-xl border border-accent-200 bg-accent-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Store className="mt-0.5 size-5 shrink-0 text-accent-600" aria-hidden />
              <p className="text-sm text-accent-600">
                You haven&apos;t created a shop yet. Create your shop to start
                listing medicines and receiving orders.
              </p>
            </div>
            <Button
              asChild
              className="shrink-0 bg-brand-700 text-white hover:bg-brand-600 active:bg-brand-800"
            >
              <Link href="/seller/shop">Create your shop</Link>
            </Button>
          </div>
        </PageSection>
      ) : (
        <PageSection>
          <Card className="flex-row items-center gap-4 bg-surface-card py-0">
            <CardContent className="flex flex-1 flex-row items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <Store className="size-5" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="truncate font-bold text-brand-900">{shop.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  /{shop.slug}
                </p>
              </div>
            </CardContent>
          </Card>
        </PageSection>
      )}

      {/* Stat Cards */}
      <PageSection>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            const inner = (
              <>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.tint}`}
                >
                  <Icon className="size-5" aria-hidden />
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold leading-none text-brand-900">
                    {card.value}
                  </p>
                  <p className="mt-1.5 text-xs font-medium text-muted-foreground">
                    {card.label}
                  </p>
                </div>
              </>
            );

            return (
              <Card
                key={card.label}
                className={`h-full py-4 transition-all ${card.href ? "group hover:shadow-sm hover:ring-2 hover:ring-brand-200" : ""}`}
              >
                <CardContent className="px-4">
                  {card.href ? (
                    <Link
                      href={card.href}
                      className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                    >
                      {inner}
                    </Link>
                  ) : (
                    inner
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </PageSection>

      {/* Recent Orders */}
      <PageSection>
        <Card>
          <CardHeader className="border-b border-border-default">
            <CardTitle className="text-base font-bold text-brand-900">
              Recent Orders
            </CardTitle>
            <CardAction>
              <Link
                href="/seller/orders"
                className="text-xs font-semibold text-trust-600 transition-colors hover:text-trust-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                View all
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent className="p-4">
            {recentOrders.length === 0 ? (
              <Empty className="py-10">
                <EmptyHeader>
                  <EmptyTitle className="text-sm font-semibold text-foreground">
                    No orders yet
                  </EmptyTitle>
                  <EmptyDescription>
                    When customers place orders from your shop, they&apos;ll
                    show up here for you to fulfil.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <ul className="space-y-2 stagger-children">
                {recentOrders.slice(0, 5).map((o) => (
                  <li key={o.id}>
                    <Link
                      href="/seller/orders"
                      className="flex items-center justify-between gap-3 rounded-lg border border-border-default p-3 transition-colors hover:border-brand-200 hover:bg-brand-50/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                    >
                      <div className="min-w-0">
                        <p className="font-mono text-sm font-semibold text-foreground">
                          {o.orderNumber}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {o.itemCount} {o.itemCount === 1 ? "item" : "items"} ·{" "}
                          {new Date(o.createdAt).toLocaleDateString("en-BD", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <OrderStatusBadge status={o.orderStatus} />
                        <span className="text-sm font-semibold text-brand-900">
                          ৳{o.vendorSubtotal.toFixed(0)}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </PageSection>
    </div>
  );
};
export default SellerDashboard;
