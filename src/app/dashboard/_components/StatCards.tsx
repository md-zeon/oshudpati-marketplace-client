"use client";

import { motion } from "motion/react";
import { ShoppingBag, Package, TrendingDown, MapPin } from "lucide-react";
import { DashboardStats } from "@/types";
import { PageSection } from "@/components/shared/PageSection";

interface StatCardsProps {
  stats: DashboardStats;
}

const cards = [
  {
    key: "totalOrders" as const,
    label: "Total Orders",
    icon: ShoppingBag,
    color: "text-blue-600",
    bg: "bg-blue-50",
    ring: "ring-blue-500/10",
    format: (v: number) => v.toString(),
  },
  {
    key: "activeOrders" as const,
    label: "Active Orders",
    icon: Package,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    ring: "ring-emerald-500/10",
    format: (v: number) => v.toString(),
  },
  {
    key: "totalSavings" as const,
    label: "Total Saved",
    icon: TrendingDown,
    color: "text-violet-600",
    bg: "bg-violet-50",
    ring: "ring-violet-500/10",
    format: (v: number) => `৳${v.toFixed(0)}`,
  },
  {
    key: "savedAddresses" as const,
    label: "Addresses Saved",
    icon: MapPin,
    color: "text-amber-600",
    bg: "bg-amber-50",
    ring: "ring-amber-500/10",
    format: (v: number) => v.toString(),
  },
];

export function StatCards({ stats }: StatCardsProps) {
  return (
    <PageSection>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((card, index) => {
          const value = stats[card.key];
          const Icon = card.icon;

          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ scale: 1.02 }}
              className={`${card.bg} ${card.ring} ring-1 rounded-xl p-4 transition-all hover:shadow-sm cursor-default`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <p className={`text-2xl font-bold ${card.color}`}>
                {card.format(value)}
              </p>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                {card.label}
              </p>
            </motion.div>
          );
        })}
      </div>
    </PageSection>
  );
}
