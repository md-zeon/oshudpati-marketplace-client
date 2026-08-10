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

interface NavLink {
  href: string;
  label: string;
  iconName: string;
}

interface MobileDashboardNavProps {
  sidebarLinks: NavLink[];
}

export function MobileDashboardNav({ sidebarLinks }: MobileDashboardNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-md border-t border-border-default z-40 safe-area-bottom"
      aria-label="Account navigation"
    >
      <div className="flex justify-around py-1.5">
        {sidebarLinks.map((link) => {
          const Icon = iconMap[link.iconName] || LayoutDashboard;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 text-[10px] font-medium transition-colors relative rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 ${
                isActive
                  ? "text-brand-700"
                  : "text-muted-foreground hover:text-brand-800"
              }`}
            >
              {isActive && (
                <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-brand-500 rounded-full" />
              )}
              <Icon className="w-5 h-5" aria-hidden="true" />
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
