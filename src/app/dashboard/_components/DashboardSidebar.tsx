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
      aria-current={isActive ? "page" : undefined}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 ${
        isActive
          ? "bg-brand-50 text-brand-900 font-semibold shadow-sm border border-brand-100"
          : "text-muted-foreground hover:bg-brand-50/60 hover:text-brand-800"
      }`}
    >
      <Icon
        className={`w-4 h-4 ${isActive ? "text-brand-700" : ""}`}
        aria-hidden="true"
      />
      {label}
    </Link>
  );
}
