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

interface NavLink {
  href: string;
  label: string;
  iconName: string;
}

interface MobileAdminNavProps {
  sidebarLinks: NavLink[];
}

export function MobileAdminNav({ sidebarLinks }: MobileAdminNavProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Admin navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-admin-border bg-white/90 backdrop-blur-md pb-safe"
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
              className={`relative flex min-w-14 flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-trust-600 ${
                isActive
                  ? "text-trust-700"
                  : "text-admin-text/60 hover:text-trust-700"
              }`}
            >
              {isActive && (
                <span className="absolute -top-1.5 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-trust-500" />
              )}
              <Icon className="h-5 w-5" aria-hidden />
              <span className="leading-none">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
