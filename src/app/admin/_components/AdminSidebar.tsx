"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  MessageSquare,
  Grid3X3,
  UserCircle,
  LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  orders: Package,
  users: Users,
  reviews: MessageSquare,
  categories: Grid3X3,
  user: UserCircle,
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
      aria-current={isActive ? "page" : undefined}
      className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-trust-600 focus-visible:ring-offset-1 ${
        isActive
          ? "bg-trust-50 text-trust-700 font-semibold border border-trust-200"
          : "text-admin-text/70 hover:bg-trust-50/70 hover:text-trust-700 border border-transparent"
      }`}
    >
      {isActive && (
        <span className="absolute -left-[13px] top-1/2 -translate-y-1/2 h-6 w-1 rounded-full bg-trust-500" />
      )}
      <Icon
        className={`h-4 w-4 transition-colors ${
          isActive ? "text-trust-600" : "text-admin-text/50 group-hover:text-trust-600"
        }`}
      />
      {label}
    </Link>
  );
}
