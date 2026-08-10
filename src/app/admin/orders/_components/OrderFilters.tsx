"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ORDER_STATUSES } from "./orderStatus";

interface OrderFiltersProps {
  initialSearch?: string;
  initialStatus?: string;
}

export function OrderFilters({
  initialSearch = "",
  initialStatus = "",
}: OrderFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState(initialSearch);

  const navigate = (nextSearch: string, nextStatus: string) => {
    const params = new URLSearchParams();
    if (nextSearch.trim()) params.set("search", nextSearch.trim());
    if (nextStatus) params.set("status", nextStatus);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(search, initialStatus);
  };

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Filter orders by status">
        {ORDER_STATUSES.map((s) => {
          const isActive = initialStatus === s.value;
          return (
            <Button
              key={s.value}
              role="tab"
              aria-selected={isActive}
              size="sm"
              variant={isActive ? "default" : "outline"}
              onClick={() => navigate(search, isActive ? "" : s.value)}
              className={`cursor-pointer rounded-full px-3 ${
                isActive
                  ? "bg-trust-700 text-white hover:bg-trust-600"
                  : "text-admin-text/70"
              }`}
            >
              {s.label}
            </Button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="relative w-full lg:w-72" role="search">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search order #, customer, email…"
          aria-label="Search orders"
          className="h-9 rounded-lg pl-9 pr-8"
        />
        {search && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setSearch("");
              navigate("", initialStatus);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-trust-600"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
          </button>
        )}
      </form>
    </div>
  );
}
