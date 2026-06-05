import { redirect } from "next/navigation";
import { userService } from "@/services/user.service";
import { Users, Pill, ShoppingBag, DollarSign } from "lucide-react";

export const metadata = {
  title: "Admin Dashboard",
  description: "Platform overview",
};

const AdminDashboard = async () => {
  const session = await userService.getSession();
  if (!session?.success || !session.data?.user) return redirect("/signin");
  if (session.data.user.role !== "ADMIN") return redirect("/dashboard");

  let stats = {
    totalUsers: 0,
    totalSellers: 0,
    totalMedicines: 0,
    totalOrders: 0,
    totalRevenue: 0,
  };
  let recentOrders: any[] = [];
  try {
    const { DashboardService } = await import("@/services/dashboard.service");
    const res = await DashboardService.getAdminDashboard();
    if (res?.success) {
      stats = res.data.stats;
      recentOrders = res.data.recentOrders || [];
    }
  } catch {}

  const cards = [
    {
      label: "Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Sellers",
      value: stats.totalSellers,
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Medicines",
      value: stats.totalMedicines,
      icon: Pill,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      label: "Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Revenue",
      value: `৳${stats.totalRevenue.toFixed(0)}`,
      icon: DollarSign,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
  ];

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-slate-900">Admin Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {cards.map((c) => (
          <div key={c.label} className={`${c.bg} rounded-xl p-4`}>
            <c.icon className={`w-5 h-5 ${c.color} mb-2`} />
            <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{c.label}</p>
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
            {recentOrders.map((o: any) => (
              <div
                key={o.id}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-100"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {o.orderNumber}
                  </p>
                  <p className="text-xs text-slate-400">{o.customerName}</p>
                </div>
                <span className="text-xs font-semibold text-emerald-600">
                  ৳{Number(o.totalAmount).toFixed(0)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminDashboard;
