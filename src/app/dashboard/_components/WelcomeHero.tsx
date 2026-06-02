import { ShoppingBag, Package, TrendingDown, MapPin } from "lucide-react";
import { DashboardStats, DashboardDefaultAddress } from "@/types";

interface WelcomeHeroProps {
  userName: string;
  stats: DashboardStats;
  defaultAddress: DashboardDefaultAddress | null;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Good morning", emoji: "☀️" };
  if (hour < 17) return { text: "Good afternoon", emoji: "🌤️" };
  return { text: "Good evening", emoji: "🌙" };
}

const statCards = [
  {
    key: "totalOrders",
    label: "Total Orders",
    icon: ShoppingBag,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    format: (v: number) => v.toString(),
  },
  {
    key: "activeOrders",
    label: "Active Orders",
    icon: Package,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    format: (v: number) => v.toString(),
  },
  {
    key: "totalSavings",
    label: "Total Saved",
    icon: TrendingDown,
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
    format: (v: number) => `৳${v.toFixed(0)}`,
  },
  {
    key: "savedAddresses",
    label: "Addresses",
    icon: MapPin,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    format: (v: number) => v.toString(),
  },
];

export function WelcomeHero({
  userName,
  stats,
  defaultAddress,
}: WelcomeHeroProps) {
  const greeting = getGreeting();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 p-6 md:p-8 text-white">
      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {greeting.text}, {userName.split(" ")[0]}! {greeting.emoji}
            </h1>
            <p className="mt-1.5 text-white/80 text-sm max-w-lg">
              {stats.activeOrders > 0
                ? `You have ${stats.activeOrders} active ${stats.activeOrders === 1 ? "order" : "orders"} to track.`
                : stats.totalOrders > 0
                  ? `You've placed ${stats.totalOrders} ${stats.totalOrders === 1 ? "order" : "orders"} so far.`
                  : "Ready to order? Browse our medicines and get started!"}
            </p>
          </div>

          {/* Quick Stats Row */}
          <div className="flex gap-3 flex-wrap">
            <div className="backdrop-blur-sm bg-white/10 rounded-xl px-4 py-2.5 border border-white/20 min-w-28">
              <p className="text-xs text-white/70 uppercase tracking-wider font-medium">
                Spent
              </p>
              <p className="text-xl font-bold">
                ৳{stats.totalSpent.toFixed(0)}
              </p>
            </div>
            <div className="backdrop-blur-sm bg-white/10 rounded-xl px-4 py-2.5 border border-white/20 min-w-28">
              <p className="text-xs text-white/70 uppercase tracking-wider font-medium">
                Cart
              </p>
              <p className="text-xl font-bold">
                {stats.cartItemCount}{" "}
                <span className="text-sm font-normal text-white/70">items</span>
              </p>
            </div>
          </div>
        </div>

        {/* Default Address Chip */}
        {defaultAddress && (
          <div className="mt-4 inline-flex items-center gap-2 backdrop-blur-sm bg-white/10 rounded-full px-4 py-1.5 border border-white/20 text-sm">
            <MapPin className="w-3.5 h-3.5 text-white/70" />
            <span className="text-white/90 text-xs">
              {defaultAddress.area}, {defaultAddress.district}
              {defaultAddress.addressLabel && (
                <span className="ml-1.5 text-white/60">
                  &middot; {defaultAddress.addressLabel}
                </span>
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
