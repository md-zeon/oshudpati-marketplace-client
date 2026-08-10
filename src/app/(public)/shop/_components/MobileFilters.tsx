"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";

interface MobileFiltersProps {
  children: React.ReactNode;
  activeCount: number;
  resultsCount: number;
}

export function MobileFilters({
  children,
  activeCount,
  resultsCount,
}: MobileFiltersProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <div className="sticky top-16 z-40 -mx-4 border-b border-border-default bg-background/95 px-4 py-2.5 backdrop-blur-sm">
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              className="w-full cursor-pointer border-brand-200 bg-card font-semibold text-brand-700 shadow-xs hover:bg-brand-50 hover:text-brand-800"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Filters & Sort
              {activeCount > 0 && (
                <Badge
                  className="ml-1 h-5 min-w-5 justify-center rounded-full bg-brand-700 px-1.5 text-[10px] text-white"
                  aria-label={`${activeCount} filters applied`}
                >
                  {activeCount}
                </Badge>
              )}
            </Button>
          </DrawerTrigger>

          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle className="text-lg font-bold text-brand-900">
                Filters & Sort
              </DrawerTitle>
              <DrawerDescription>
                Refine your results —{" "}
                <span className="font-semibold text-foreground">
                  {resultsCount}
                </span>{" "}
                {resultsCount === 1 ? "product" : "products"} currently shown.
              </DrawerDescription>
            </DrawerHeader>

            <div className="max-h-[52vh] overflow-y-auto px-5">
              <div className="space-y-6 py-2">{children}</div>
            </div>

            <Separator className="my-2" />

            <DrawerFooter className="sm:justify-between">
              <Button
                variant="outline"
                className="cursor-pointer"
                asChild
              >
                <a href="/shop">Clear all</a>
              </Button>
              <DrawerClose asChild>
                <Button className="cursor-pointer bg-brand-700 hover:bg-brand-600 active:bg-brand-800">
                  Show {resultsCount} {resultsCount === 1 ? "product" : "products"}
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
