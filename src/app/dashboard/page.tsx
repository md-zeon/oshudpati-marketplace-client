import { DashboardService } from "@/services/dashboard.service";
import { userService } from "@/services/user.service";
import { redirect } from "next/navigation";
import { CustomerDashboard } from "@/types";

import { WelcomeHero } from "./_components/WelcomeHero";
import { StatCards } from "./_components/StatCards";
import { QuickReorder } from "./_components/QuickReorder";
import { ActiveOrders } from "./_components/ActiveOrders";
import { RecentOrdersList } from "./_components/RecentOrdersList";

export const metadata = {
  title: "Dashboard",
  description: "Your Oshudpati account overview",
};

const DashboardPage = async () => {
  const session = await userService.getSession();

  if (!session?.success || !session.data?.user) {
    return redirect("/signin");
  }

  const user = session.data.user;

  // Fetch dashboard data
  const dashboardRes = await DashboardService.getCustomerDashboard();
  const dashboard: CustomerDashboard | null = dashboardRes?.success
    ? dashboardRes.data
    : null;

  const stats = dashboard?.stats || {
    totalOrders: 0,
    activeOrders: 0,
    totalSpent: 0,
    totalSavings: 0,
    savedAddresses: 0,
    cartItemCount: 0,
  };

  const recentOrders = dashboard?.recentOrders || [];
  const quickReorderItems = dashboard?.quickReorder || [];
  const defaultAddress = dashboard?.defaultAddress || null;

  return (
    <div className="space-y-5">
      {/* Welcome Hero */}
      <WelcomeHero
        userName={user.name}
        stats={stats}
        defaultAddress={defaultAddress}
      />

      {/* Quick Stats */}
      <StatCards stats={stats} />

      {/* Quick Reorder */}
      {quickReorderItems.length > 0 && (
        <QuickReorder items={quickReorderItems} />
      )}

      {/* Active Orders */}
      <ActiveOrders orders={recentOrders} />

      {/* Recent Orders */}
      <RecentOrdersList orders={recentOrders} />
    </div>
  );
};

export default DashboardPage;
