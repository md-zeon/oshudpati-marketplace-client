"use client";

import { Heart, MapPin } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Categories", href: "/categories" },
  { name: "Medicines", href: "/medicine" },
  { name: "Contact", href: "/contact" },
  { name: "Blog", href: "/blog" },
];

const NavbarFooter = () => {
  const pathname = usePathname();

  return (
    <nav className="sticky top-16 z-40 mx-auto hidden max-w-360 items-center justify-between gap-6 border-b border-border-default bg-background/95 px-4 py-2 font-medium backdrop-blur lg:flex">
      <div className="flex items-center gap-6">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative inline-flex min-h-10 items-center rounded-sm px-0.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600",
                isActive
                  ? "font-semibold text-brand-700"
                  : "text-muted-foreground hover:text-brand-700",
              )}
            >
              {link.name}
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-1.5 h-0.5 rounded-full bg-brand-600"
                />
              )}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-6">
        <Link
          href="/wishlist"
          aria-current={pathname === "/wishlist" ? "page" : undefined}
          className={cn(
            "flex min-h-10 items-center gap-1 rounded-sm text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600",
            pathname === "/wishlist"
              ? "text-brand-700"
              : "text-muted-foreground hover:text-brand-700",
          )}
        >
          <Heart aria-hidden="true" className="text-danger" size={14} />
          <span>Wishlist</span>
        </Link>

        <Link
          href="/faq"
          aria-current={pathname === "/faq" ? "page" : undefined}
          className={cn(
            "flex min-h-10 items-center gap-1 rounded-sm text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600",
            pathname === "/faq"
              ? "text-brand-700"
              : "text-muted-foreground hover:text-brand-700",
          )}
        >
          <MapPin aria-hidden="true" className="text-brand-600" size={14} />
          <span>FAQ</span>
        </Link>
      </div>
    </nav>
  );
};

export default NavbarFooter;
