"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  MapPin,
  User,
  LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  overview: LayoutDashboard,
  orders: ShoppingBag,
  addresses: MapPin,
  profile: User,
};

interface DashboardSidebarProps {
  href: string;
  label: string;
  iconName: string;
}

export function DashboardSidebar({
  href,
  label,
  iconName,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const Icon = iconMap[iconName] || LayoutDashboard;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
        isActive
          ? "bg-emerald-50 text-emerald-700 font-semibold shadow-sm border border-emerald-100"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
      }`}
    >
      <Icon className={`w-4 h-4 ${isActive ? "text-emerald-600" : ""}`} />
      {label}
    </Link>
  );
}
