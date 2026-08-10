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
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

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
  const isActive =
    pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(`${href}/`));
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
