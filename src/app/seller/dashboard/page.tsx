import { redirect } from "next/navigation";
import { userService } from "@/services/user.service";
import { Pill, ShoppingBag, Package, DollarSign } from "lucide-react";
import Link from "next/link";

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
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Pending",
      value: stats.pendingOrders,
      icon: Package,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Revenue",
      value: `৳${stats.totalRevenue.toFixed(0)}`,
      icon: DollarSign,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
  ];

  return (
    <div className="space-y-5">
      {!shop ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          You haven't created a shop yet.{" "}
          <Link href="/seller/shop" className="font-semibold underline">
            Create your shop
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Pill className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="font-bold text-slate-900">{shop.name}</p>
            <p className="text-xs text-slate-400">/{shop.slug}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((card) => (
          <div key={card.label} className={`${card.bg} rounded-xl p-4`}>
            <card.icon className={`w-5 h-5 ${card.color} mb-2`} />
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="font-bold text-slate-900 mb-4">Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-6">
            No orders yet
          </p>
        ) : (
          <div className="space-y-2">
            {recentOrders.map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-100"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {o.orderNumber}
                  </p>
                  <p className="text-xs text-slate-400">{o.itemCount} items</p>
                </div>
                <span className="text-xs font-semibold text-emerald-600">
                  ৳{o.vendorSubtotal.toFixed(0)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default SellerDashboard;
