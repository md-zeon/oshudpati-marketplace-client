import { redirect } from "next/navigation";
import { userService } from "@/services/user.service";
import { Pill, ShoppingBag, Package, DollarSign, Store } from "lucide-react";
import Link from "next/link";
import { PageSection } from "@/components/shared/PageSection";

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
    const { DashboardService } = await import("@/services/dashboard.service");
    const res = await DashboardService.getSellerDashboard();
    if (res?.success) data = res.data;
  } catch {}

  const { shop, stats, recentOrders } = data;

  const statCards = [
    {
      label: "Medicines",
      value: stats.totalMedicines,
      icon: Pill,
      color: "text-blue-600",
      bg: "bg-blue-50",
      ring: "ring-blue-500/10",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      ring: "ring-emerald-500/10",
    },
    {
      label: "Pending",
      value: stats.pendingOrders,
      icon: Package,
      color: "text-amber-600",
      bg: "bg-amber-50",
      ring: "ring-amber-500/10",
    },
    {
      label: "Revenue",
      value: `৳${stats.totalRevenue.toFixed(0)}`,
      icon: DollarSign,
      color: "text-violet-600",
      bg: "bg-violet-50",
      ring: "ring-violet-500/10",
    },
  ];

  return (
    <div className="space-y-5">
      {/* Shop Status Alert */}
      {!shop ? (
        <PageSection>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 flex items-center gap-2">
            <span>🏪</span>
            <span>
              You haven{"'"}t created a shop yet.{" "}
              <Link
                href="/seller/shop"
                className="font-semibold underline hover:text-amber-900"
              >
                Create your shop
              </Link>
            </span>
          </div>
        </PageSection>
      ) : (
        <PageSection>
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3 hover:shadow-sm transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Store className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-bold text-slate-900">{shop.name}</p>
              <p className="text-xs text-slate-400">/{shop.slug}</p>
            </div>
          </div>
        </PageSection>
      )}

      {/* Stat Cards */}
      <PageSection>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 stagger-children">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className={`${card.bg} ${card.ring} ring-1 rounded-xl p-4 transition-all hover:shadow-sm`}
              >
                <Icon className={`w-5 h-5 ${card.color} mb-2`} />
                <p className={`text-2xl font-bold ${card.color}`}>
                  {card.value}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{card.label}</p>
              </div>
            );
          })}
        </div>
      </PageSection>

      {/* Recent Orders */}
      <PageSection>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900">Recent Orders</h2>
            <Link
              href="/seller/orders"
              className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
            >
              View all
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              <p className="text-sm text-slate-500 font-medium">
                No orders yet
              </p>
            </div>
          ) : (
            <div className="space-y-2 stagger-children">
              {recentOrders.slice(0, 5).map((o) => (
                <Link
                  key={o.id}
                  href="/seller/orders"
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {o.orderNumber}
                    </p>
                    <p className="text-xs text-slate-400">
                      {o.itemCount} items
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600">
                    ৳{o.vendorSubtotal.toFixed(0)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </PageSection>
    </div>
  );
};
export default SellerDashboard;
