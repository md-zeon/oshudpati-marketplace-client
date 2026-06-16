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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 z-40 pb-safe">
      <div className="flex justify-around py-2">
        {sidebarLinks.map((link) => {
          const Icon = iconMap[link.iconName] || LayoutDashboard;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium transition-colors relative ${
                isActive
                  ? "text-emerald-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {isActive && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-emerald-500 rounded-full" />
              )}
              <Icon className="w-5 h-5" />
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
