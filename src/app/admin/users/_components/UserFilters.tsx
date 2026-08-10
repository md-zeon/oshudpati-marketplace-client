"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, X, FilterX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserFiltersProps {
  initialSearch?: string;
  initialRole?: string;
  initialStatus?: string;
}

export function UserFilters({
  initialSearch = "",
  initialRole = "",
  initialStatus = "",
}: UserFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState(initialSearch);

  const navigate = (nextSearch: string, role: string, status: string) => {
    const params = new URLSearchParams();
    if (nextSearch.trim()) params.set("search", nextSearch.trim());
    if (role) params.set("role", role);
    if (status) params.set("status", status);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(search, initialRole, initialStatus);
  };

  const hasFilters = Boolean(initialSearch || initialRole || initialStatus);

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <form onSubmit={handleSubmit} className="relative flex-1" role="search">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email or phone…"
          aria-label="Search users"
          className="h-9 rounded-lg pl-9 pr-8"
        />
        {search && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setSearch("");
              navigate("", initialRole, initialStatus);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-trust-600"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
          </button>
        )}
      </form>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={initialRole || "all"}
          onValueChange={(v) =>
            navigate(search, v === "all" ? "" : v, initialStatus)
          }
        >
          <SelectTrigger
            aria-label="Filter by role"
            className="h-9 w-36 rounded-lg"
          >
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="CUSTOMER">Customer</SelectItem>
            <SelectItem value="SELLER">Seller</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={initialStatus || "all"}
          onValueChange={(v) =>
            navigate(search, initialRole, v === "all" ? "" : v)
          }
        >
          <SelectTrigger
            aria-label="Filter by status"
            className="h-9 w-36 rounded-lg"
          >
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="BANNED">Banned</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearch("");
              navigate("", "", "");
            }}
            className="h-9 rounded-lg px-2.5"
          >
            <FilterX className="h-4 w-4" aria-hidden />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
