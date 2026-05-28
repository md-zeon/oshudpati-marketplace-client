import React from "react";
import { Store, Search, Heart, User, LayoutGrid } from "lucide-react";

const MobileNavbarFooter = () => {
  const navItems = [
    { label: "Store", icon: Store, href: "/", isActive: true },
    {
      label: "Categories",
      icon: LayoutGrid,
      href: "/categories",
      isActive: false,
    },
    { label: "Search", icon: Search, href: "/search", isActive: false },
    {
      label: "Wishlist",
      icon: Heart,
      href: "/wishlist",
      isActive: false,
      badge: 0,
    },
    { label: "Account", icon: User, href: "/account", isActive: false },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 h-16 border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 pb-safe">
      <div className="grid h-full grid-cols-5 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 text-center transition-colors relative cursor-pointer
                ${
                  item.isActive
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {/* Optional Badge for Wishlist */}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground animate-in fade-in zoom-in-95">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-wide select-none">
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavbarFooter;
