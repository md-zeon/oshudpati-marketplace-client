"use client";

import { Heart, MapPin } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
    <nav className="max-w-360 mx-auto hidden font-medium lg:flex items-center justify-between gap-6 px-4 py-2 sticky top-16 z-40 bg-background/95 backdrop-blur">
      <div className="flex items-center gap-6">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:text-brand transition-colors ${
                isActive ? "text-brand font-semibold" : "text-slate-600"
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-6">
        <Link
          href="/wishlist"
          className={`flex items-center text-xs font-semibold gap-1 ${pathname === "/wishlist" ? "text-brand" : ""}`}
        >
          <Heart className="inline-block text-red-600" size={14} />
          <span>Wishlist</span>
        </Link>

        <Link
          href="/faq"
          className={`flex items-center text-xs font-semibold gap-1 ${pathname === "/faq" ? "text-brand" : ""}`}
        >
          <MapPin className="inline-block text-emerald-600" size={14} />
          <span>FAQ</span>
        </Link>
      </div>
    </nav>
  );
};

export default NavbarFooter;
