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
import { cn } from "@/lib/utils";

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
  const isActive = pathname === href;
  const Icon = iconMap[iconName] || LayoutDashboard;

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600",
        isActive
          ? "bg-brand-50 text-brand-900 font-semibold shadow-sm ring-1 ring-brand-100"
          : "text-muted-foreground hover:bg-brand-50/60 hover:text-brand-900",
      )}
    >
      <Icon
        className={cn(
          "size-4 shrink-0",
          isActive ? "text-brand-700" : "text-muted-foreground",
        )}
        aria-hidden
      />
      {label}
    </Link>
  );
}
