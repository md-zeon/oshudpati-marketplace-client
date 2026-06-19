"use client";

import { ShoppingBag, Package, TrendingDown, MapPin } from "lucide-react";
import { DashboardStats, DashboardDefaultAddress } from "@/types";
import { motion } from "motion/react";

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

export function WelcomeHero({
  userName,
  stats,
  defaultAddress,
}: WelcomeHeroProps) {
  const greeting = getGreeting();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-emerald-600 via-emerald-500 to-teal-500 p-6 md:p-8 text-white">
      {/* Decorative circles */}
      <motion.div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5"
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5"
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
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
          <motion.div
            className="flex gap-3 flex-wrap"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
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
          </motion.div>
        </div>

        {/* Default Address Chip */}
        {defaultAddress && (
          <motion.div
            className="mt-4 inline-flex items-center gap-2 backdrop-blur-sm bg-white/10 rounded-full px-4 py-1.5 border border-white/20 text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
          >
            <MapPin className="w-3.5 h-3.5 text-white/70" />
            <span className="text-white/90 text-xs">
              {defaultAddress.area}, {defaultAddress.district}
              {defaultAddress.addressLabel && (
                <span className="ml-1.5 text-white/60">
                  &middot; {defaultAddress.addressLabel}
                </span>
              )}
            </span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
