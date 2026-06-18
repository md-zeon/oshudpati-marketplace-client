"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  MessageSquare,
  Grid3X3,
  LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  orders: Package,
  users: Users,
  reviews: MessageSquare,
  categories: Grid3X3,
};

interface AdminSidebarProps {
  href: string;
  label: string;
  iconName: string;
}

export function AdminSidebar({ href, label, iconName }: AdminSidebarProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const Icon = iconMap[iconName] || LayoutDashboard;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
        isActive
          ? "bg-blue-50 text-blue-700 font-semibold shadow-sm border border-blue-100"
          : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
      }`}
    >
      <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : ""}`} />
      {label}
    </Link>
  );
}
