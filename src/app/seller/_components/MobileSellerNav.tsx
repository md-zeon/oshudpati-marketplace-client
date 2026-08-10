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

interface NavLink {
  href: string;
  label: string;
  iconName: string;
}

interface MobileSellerNavProps {
  sidebarLinks: NavLink[];
}

export function MobileSellerNav({ sidebarLinks }: MobileSellerNavProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Seller navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-md border-t border-border-default pb-safe"
    >
      <div className="flex justify-around px-2 py-1">
        {sidebarLinks.map((link) => {
          const Icon = iconMap[link.iconName] || LayoutDashboard;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative flex min-h-11 flex-col items-center justify-center gap-1 rounded-lg px-3 text-[11px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600",
                isActive
                  ? "text-brand-700"
                  : "text-muted-foreground hover:text-brand-900",
              )}
            >
              {isActive && (
                <span
                  className="absolute -top-1 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-brand-500"
                  aria-hidden
                />
              )}
              <Icon className="size-5" aria-hidden />
              <span className="leading-none">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
