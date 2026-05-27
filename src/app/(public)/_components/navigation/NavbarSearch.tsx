"use client";

import { useEffect, useState } from "react";
import { Search, Pill, Activity, ShoppingBag } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";

export const NavbarSearch = () => {
  const [open, setOpen] = useState(false);

  //   Keyboard shortcut listener (Ctrl+K or Cmd+K to open search)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <Command>
      {/* Trigger Button - Mimics an input field */}
      <div
        onClick={() => setOpen(true)}
        className="relative w-full max-w-md md:max-w-xl lg:max-w-2xl cursor-pointer"
      >
        <div className="flex items-center w-full h-11 px-4 rounded-full border text-slate-500 hover:border-blue-400  transition-all shadow-sm">
          <Search className="mr-2 h-4 w-4 text-slate-400 shrink-0" />
          <span className="text-sm flex-1 text-left">
            Search medicines, generics, health products...
          </span>
          <Kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </Kbd>
        </div>
      </div>

      {/* shadcn Command Dialog Menu */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type medicine name or generic" />
        <CommandList className="max-h-100">
          <CommandEmpty>No results found for your search.</CommandEmpty>

          {/* Section 1: Top/Frequent Medicines */}
          <CommandGroup heading="Popular Medicines">
            <CommandItem className="cursor-pointer flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pill className="h-4 w-4 text-blue-500" />
                <span>
                  Napa Extend{" "}
                  <span className="text-xs text-slate-400">(665 mg)</span>
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                Beximco
              </span>
            </CommandItem>
            <CommandItem className="cursor-pointer flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pill className="h-4 w-4 text-blue-500" />
                <span>
                  Sergel <span className="text-xs text-slate-400">(20 mg)</span>
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                Healthcare
              </span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          {/* Section 2: Generics Search */}
          <CommandGroup heading="Search by Generics">
            <CommandItem className="cursor-pointer flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-500" />
              <span>Paracetamol</span>
            </CommandItem>
            <CommandItem className="cursor-pointer flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-500" />
              <span>Esomeprazole</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          {/* Section 3: Healthcare Marketplace Categories */}
          <CommandGroup heading="OTC & Health Categories">
            <CommandItem className="cursor-pointer flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-purple-500" />
              <span>Baby Care Products</span>
            </CommandItem>
            <CommandItem className="cursor-pointer flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-purple-500" />
              <span>Multivitamins & Supplements</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </Command>
  );
};

/*
Will make better that both up and down code one will be used in mobile and another one in desktop. Because in mobile we can not show dropdown as it is in desktop. We have to show it in full screen modal. So we can use shadcn command dialog for that. And in desktop we can show dropdown as it is. So we can use both code and show them based on screen size. We can use media query for that. We can use tailwind's responsive classes for that. For example, we can use hidden md:block for desktop and block md:hidden for mobile. So we can show dropdown in desktop and command dialog in mobile. This way we can provide better user experience for both mobile and desktop users.

"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Pill, Activity, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export const NavbarSearch = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // // Close dropdown when clicking outside
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       searchRef.current &&
  //       !searchRef.current.contains(event.target as Node)
  //     ) {
  //       setIsOpen(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  // const handleSearchSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!query.trim()) return;
  //   // Redirect to your dedicated search results page
  //   window.location.href = `/search?q=${encodeURIComponent(query)}`;
  // };

  return (
    <div ref={searchRef} className="relative w-full max-w-xl mx-auto">
      <form
        // onSubmit={handleSearchSubmit}
        className="relative flex items-center"
      >
        <Input
          type="text"
          placeholder="Search medicines, generics, health products..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(e.target.value.length > 0);
          }}
          onFocus={() => {
            if (query.length > 0) setIsOpen(true);
          }}
          className="w-full h-11 pl-11 pr-10 rounded-full border border-slate-200 bg-slate-50 focus-visible:bg-white focus-visible:ring-blue-500 text-sm transition-all"
        />
        <Search className="absolute left-4 h-4 w-4 text-slate-400 pointer-events-none" />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-4 p-0.5 rounded-full hover:bg-slate-200 text-slate-400"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </form>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 max-h-[380px] overflow-y-auto overflow-x-hidden p-2">
          <div className="p-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Suggested Medicines
          </div>
          <div className="space-y-0.5">
            <button className="w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-2.5">
                <Pill className="h-4 w-4 text-blue-500" />
                <span className="font-medium text-slate-700">
                  Napa Extend (665mg)
                </span>
              </div>
              <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                Beximco
              </span>
            </button>
          </div>

          <div className="my-1.5 border-t border-slate-100" />

          <div className="p-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Generics / Alternates
          </div>
          <div className="space-y-0.5">
            <button className="w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2.5 hover:bg-slate-50 text-slate-700 transition-colors">
              <Activity className="h-4 w-4 text-emerald-500" />
              <span>Paracetamol</span>
            </button>
          </div>

          <div className="mt-2 p-2 bg-slate-50 rounded-xl text-center text-xs text-slate-400">
            Press <kbd className="font-sans font-semibold">Enter ↵</kbd> to view
            all matching items
          </div>
        </div>
      )}
    </div>
  );
};


*/
