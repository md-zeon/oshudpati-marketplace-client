"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Home,
  Search,
  ShoppingCart,
  User,
  LayoutGrid,
  Pill,
  ChevronRight,
  Flame,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Medicine } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { authClient } from "@/lib/auth-client";
import { getCartItems } from "@/actions/cart.action";
import { getLocalCart } from "@/lib/local-cart";
import { cn } from "@/lib/utils";

interface MobileNavbarFooterProps {
  medicines: Medicine[];
}

const MobileNavbarFooter = ({ medicines = [] }: MobileNavbarFooterProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);

  // Live cart count for the bottom-navigation badge
  useEffect(() => {
    const updateCount = async () => {
      try {
        const session = await authClient.getSession();
        if (session.data?.user) {
          const res = await getCartItems({ cache: "no-store" });
          setCartCount(res.success ? res.data.length : 0);
        } else {
          setCartCount(getLocalCart().length);
        }
      } catch {
        setCartCount(getLocalCart().length);
      }
    };
    updateCount();
    const sync = () => setCartCount(getLocalCart().length);
    window.addEventListener("local-cart-updated", sync);
    return () => window.removeEventListener("local-cart-updated", sync);
  }, []);

  const dashboardData = useMemo(() => {
    // Popular Medicines: Sorted by high sales volume or marked featured
    const popular = medicines
      .filter((m) => m.isFeatured || m.totalSalesCount > 0)
      .sort((a, b) => b.totalSalesCount - a.totalSalesCount)
      .slice(0, 5);

    // 2. Search By Generics: Group instances and count available brands per generic compound
    const genericMap: Record<string, number> = {};
    medicines.forEach((m) => {
      if (m.genericName) {
        genericMap[m.genericName] = (genericMap[m.genericName] || 0) + 1;
      }
    });
    const generics = Object.entries(genericMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    // 3. Categories: Extract unique nested structures cleanly
    const uniqueCategoriesMap: Record<string, { name: string; slug: string }> =
      {};
    medicines.forEach((m) => {
      if (m.category) {
        uniqueCategoriesMap[m.category.id] = {
          name: m.category.name,
          slug: m.category.slug,
        };
      }
    });
    const categories = Object.values(uniqueCategoriesMap).slice(0, 6);

    return { popular, generics, categories };
  }, [medicines]);

  // Handle active typed matching outputs
  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];
    return medicines
      .filter((med) => {
        const targetString =
          `${med.name} ${med.genericName} ${med.manufacturerName} ${med.indications}`.toLowerCase();
        return targetString.includes(query.toLowerCase());
      })
      .slice(0, 15);
  }, [query, medicines]);

  const handleActionRoute = (url: string) => {
    setMobileOpen(false);
    setQuery("");
    router.push(url);
  };

  const navItems = [
    { label: "Home", icon: Home, href: "/" },
    { label: "Categories", icon: LayoutGrid, href: "/categories" },
    { label: "Search", icon: Search, isSearchTrigger: true },
    { label: "Cart", icon: ShoppingCart, href: "/cart", badge: cartCount },
    { label: "Account", icon: User, href: "/account" },
  ];

  return (
    <Command className="lg:hidden">
      {/* ================= BOTTOM NAVIGATION TABS ================= */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 h-16 border-t border-border-default bg-background/95 pb-safe backdrop-blur">
        <div className="grid h-full grid-cols-5 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            if (item.isSearchTrigger) {
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  aria-label="Search medicines"
                  className="relative flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1 border-none bg-transparent text-center text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-brand-600"
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[10px] tracking-wide select-none">
                    {item.label}
                  </span>
                </button>
              );
            }

            const isActive = pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href || "/"}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-brand-600",
                  isActive
                    ? "font-semibold text-brand-700"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute top-0 h-1 w-10 rounded-b-full bg-brand-600"
                  />
                )}
                <Icon className="h-5 w-5" />
                <span className="text-[10px] tracking-wide select-none">
                  {item.label}
                </span>
                {item.badge && item.badge > 0 ? (
                  <span className="absolute right-1/2 top-1.5 flex h-4 min-w-4 translate-x-[18px] items-center justify-center rounded-full bg-brand-600 px-1 text-[9px] font-bold text-white">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ================= MOBILE SHADCN COMMAND DIALOG DASHBOARD ================= */}
      <CommandDialog open={mobileOpen} onOpenChange={setMobileOpen}>
        <CommandInput
          placeholder="Search medicine or generics..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList className="max-h-[80vh] space-y-4 overflow-y-auto p-3">
          <CommandEmpty>
            No medical entries matched your parameters.
          </CommandEmpty>

          {/* STATE A: SHOW DISCOVERY DASHBOARD WHEN COMPONENT INPUT IS EMPTY */}
          {!query.trim() && (
            <div className="animate-in fade-in-50 space-y-5 duration-200">
              {/* 1. POPULAR MEDICINES */}
              {dashboardData.popular.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <Flame className="h-3.5 w-3.5 fill-accent-500 text-accent-500" />
                    Popular Medicines
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {dashboardData.popular.map((med) => (
                      <Badge
                        key={med.id}
                        variant="secondary"
                        className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition-colors hover:bg-brand-700 hover:text-white"
                        onClick={() =>
                          handleActionRoute(`/medicine/${med.slug}`)
                        }
                      >
                        {med.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. SEARCH BY GENERICS */}
              {dashboardData.generics.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Search by Generics
                  </div>
                  <div className="divide-y divide-border-default overflow-hidden rounded-xl border border-border-default bg-card">
                    {dashboardData.generics.map((gen) => (
                      <button
                        key={gen.name}
                        onClick={() =>
                          handleActionRoute(
                            `/shop?search=${encodeURIComponent(gen.name)}`,
                          )
                        }
                        className="group flex w-full cursor-pointer items-center justify-between p-3 text-left transition-colors hover:bg-muted"
                      >
                        <div className="flex items-center gap-2">
                          <Pill className="h-4 w-4 text-brand-600" />
                          <span className="text-sm font-medium text-foreground">
                            {gen.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span>{gen.count} brands</span>
                          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. CATEGORIES */}
              {dashboardData.categories.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Categories
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {dashboardData.categories.map((cat) => (
                      <button
                        key={cat.slug}
                        onClick={() =>
                          handleActionRoute(`/shop?category=${cat.slug}`)
                        }
                        className="group flex h-16 cursor-pointer flex-col justify-between rounded-xl border border-border-default bg-card p-3 text-left transition-all hover:border-brand-300 hover:bg-brand-50"
                      >
                        <span className="text-sm font-semibold text-foreground transition-colors group-hover:text-brand-700">
                          {cat.name}
                        </span>
                        <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                          Explore Products <ChevronRight className="h-2.5 w-2.5" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STATE B: RENDER LIVE FILTERED BRAND MATCHES WHILE TYPING */}
          {query.trim().length > 0 && filteredResults.length > 0 && (
            <CommandGroup
              heading={`Matching Inventory Products (${filteredResults.length})`}
            >
              {filteredResults.map((medicine) => (
                <CommandItem
                  key={medicine.id}
                  value={`${medicine.name} ${medicine.genericName} ${medicine.manufacturerName}`}
                  onSelect={() =>
                    handleActionRoute(`/medicine/${medicine.slug}`)
                  }
                  className="my-0.5 flex cursor-pointer items-center justify-between rounded-xl border border-transparent p-3 data-[selected=true]:border-border-default data-[selected=true]:bg-muted"
                >
                  <div className="flex items-center gap-3">
                    <div className="shrink-0 rounded-lg bg-brand-50 p-2">
                      <Pill className="h-4 w-4 text-brand-700" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground">
                        {medicine.name}
                      </span>
                      <span className="text-xs font-normal italic text-muted-foreground">
                        {medicine.genericName} • {medicine.strength}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="shrink-0 text-[10px] font-bold uppercase tracking-wider opacity-80"
                  >
                    {medicine.manufacturerName}
                  </Badge>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* GLOBAL FULL VIEW ROUTE SUBMITTER LINK */}
          {query.trim().length > 0 && (
            <CommandItem
              onSelect={() =>
                handleActionRoute(`/shop?search=${encodeURIComponent(query)}`)
              }
              className="mt-4 cursor-pointer justify-center rounded-xl border border-brand-200 bg-brand-50 py-2.5 text-center text-xs font-bold text-brand-700 transition-colors hover:bg-brand-100"
            >
              See all medical inventory results for &quot;{query}&quot;
            </CommandItem>
          )}
        </CommandList>
      </CommandDialog>
    </Command>
  );
};

export default MobileNavbarFooter;
