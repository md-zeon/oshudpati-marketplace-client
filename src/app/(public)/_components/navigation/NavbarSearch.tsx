"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Search, Pill, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Medicine } from "@/types";
import { Input } from "@/components/ui/input";

interface NavbarSearchProps {
  medicines: Medicine[];
}

export const NavbarSearch = ({ medicines = [] }: NavbarSearchProps) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Instant desktop client-side filter
  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];
    return medicines
      .filter((med) => {
        const target =
          `${med.name} ${med.genericName} ${med.manufacturerName}`.toLowerCase();
        return target.includes(query.toLowerCase());
      })
      .slice(0, 6); // Keep it compact for desktop dropdown layout
  }, [query, medicines]);

  // Click outside listener to dismiss search dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleSelect = (slug: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(`/medicine/${slug}`);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div ref={containerRef} className="w-full max-w-xl relative mx-auto">
      <form onSubmit={handleFormSubmit} className="relative flex items-center">
        <Input
          type="text"
          placeholder="Search medicines, generics, manufacturers..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full h-11 pl-11 pr-10 rounded-full border border-slate-200 bg-slate-50 focus-visible:bg-white text-sm focus-visible:ring-1 focus-visible:ring-primary"
        />
        <Search className="absolute left-4 h-4 w-4 text-slate-400 pointer-events-none" />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* AUTOCOMPLETE SUGGESTIONS POPUP */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-2xl shadow-xl z-50 max-h-95 overflow-y-auto p-2 animate-in fade-in-50 slide-in-from-top-1 duration-150">
          {filteredResults.length === 0 ? (
            <div className="text-center py-6 text-sm text-muted-foreground">
              No matching medicines found.
            </div>
          ) : (
            <>
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Suggested Products
              </div>
              <div className="space-y-0.5">
                {filteredResults.map((medicine) => (
                  <button
                    key={medicine.id}
                    onClick={() => handleSelect(medicine.slug)}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm flex items-center justify-between hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                        <Pill className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 group-hover:text-primary transition-colors">
                          {medicine.name}
                        </span>
                        <span className="text-xs text-muted-foreground font-normal italic">
                          {medicine.genericName} • {medicine.strength}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-100 px-2 py-1 rounded-md group-hover:bg-white group-hover:border transition-all">
                      {medicine.manufacturerName}
                    </span>
                  </button>
                ))}
              </div>

              {/* See All Redirect Link */}
              <div className="border-t mt-2 pt-2 px-1">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    router.push(`/shop?search=${encodeURIComponent(query)}`);
                  }}
                  className="w-full text-center text-xs text-primary font-bold bg-primary/5 hover:bg-primary/10 rounded-xl py-2 transition-colors"
                >
                  See all results for &quot;{query}&quot;
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
