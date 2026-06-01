"use client";

import React, { useState, useMemo } from "react";
import {
  Store,
  Search,
  Heart,
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

interface MobileNavbarFooterProps {
  medicines: Medicine[];
}

const MobileNavbarFooter = ({ medicines = [] }: MobileNavbarFooterProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");

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
          `${med.name} ${med.genericName} ${med.manufacturerName}`.toLowerCase();
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
    { label: "Store", icon: Store, href: "/" },
    { label: "Categories", icon: LayoutGrid, href: "/categories" },
    { label: "Search", icon: Search, isSearchTrigger: true },
    { label: "Wishlist", icon: Heart, href: "/wishlist", badge: 0 },
    { label: "Account", icon: User, href: "/account" },
  ];

  return (
    <Command>
      {/* ================= BOTTOM NAVIGATION TABS ================= */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 h-16 border-t bg-background/95 backdrop-blur pb-safe">
        <div className="grid h-full grid-cols-5 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            if (item.isSearchTrigger) {
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  className="flex flex-col items-center justify-center gap-1 text-center text-muted-foreground hover:text-foreground relative bg-transparent border-none outline-none w-full h-full cursor-pointer"
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
                className={`flex flex-col items-center justify-center gap-1 text-center transition-colors relative
                  ${isActive ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] tracking-wide select-none">
                  {item.label}
                </span>
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
        <CommandList className="max-h-[80vh] overflow-y-auto p-3 space-y-4">
          <CommandEmpty>
            No medical entries matched your parameters.
          </CommandEmpty>

          {/* STATE A: SHOW DISCOVERY DASHBOARD WHEN COMPONENT INPUT IS EMPTY */}
          {!query.trim() && (
            <div className="space-y-5 animate-in fade-in-50 duration-200">
              {/* 1. POPULAR MEDICINES */}
              {dashboardData.popular.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Flame className="h-3.5 w-3.5 text-orange-500 fill-orange-500" />
                    Popular Medicines
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {dashboardData.popular.map((med) => (
                      <Badge
                        key={med.id}
                        variant="secondary"
                        className="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
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
                  <div className="divide-y border rounded-xl overflow-hidden bg-card">
                    {dashboardData.generics.map((gen) => (
                      <button
                        key={gen.name}
                        onClick={() =>
                          handleActionRoute(
                            `/shop?search=${encodeURIComponent(gen.name)}`,
                          )
                        }
                        className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Pill className="h-4 w-4 text-primary opacity-70" />
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
                        className="p-3 border rounded-xl text-left bg-card hover:border-primary hover:bg-primary/5 transition-all cursor-pointer flex flex-col justify-between h-16 group"
                      >
                        <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                          {cat.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                          Explore Products{" "}
                          <ChevronRight className="h-2.5 w-2.5" />
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
                  className="cursor-pointer flex items-center justify-between p-3 rounded-xl data-[selected=true]:bg-slate-50 border border-transparent data-[selected=true]:border-slate-100 my-0.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                      <Pill className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800">
                        {medicine.name}
                      </span>
                      <span className="text-xs text-muted-foreground font-normal italic">
                        {medicine.genericName} • {medicine.strength}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] uppercase font-bold tracking-wider opacity-80 shrink-0"
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
              className="mt-4 text-center text-xs text-primary justify-center font-bold bg-primary/5 hover:bg-primary/10 rounded-xl py-2.5 cursor-pointer border border-primary/10"
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
