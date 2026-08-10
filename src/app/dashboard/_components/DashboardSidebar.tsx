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
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

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
  const isActive =
    pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`));
  const Icon = iconMap[iconName] || LayoutDashboard;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} size="lg">
        <Link href={href} aria-current={isActive ? "page" : undefined}>
          <Icon aria-hidden="true" />
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
