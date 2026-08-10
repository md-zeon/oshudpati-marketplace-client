"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Pill,
  Package,
  Store,
  User,
  LucideIcon,
} from "lucide-react";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const iconMap: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  medicines: Pill,
  orders: Package,
  shop: Store,
  profile: User,
};

interface SellerSidebarProps {
  href: string;
  label: string;
  iconName: string;
}

export function SellerSidebar({ href, label, iconName }: SellerSidebarProps) {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/seller/dashboard" && pathname.startsWith(`${href}/`));
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
