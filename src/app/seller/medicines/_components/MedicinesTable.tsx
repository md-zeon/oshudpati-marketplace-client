"use client";

import { useState, useMemo } from "react";
import {
  Pill,
  Pencil,
  Trash2,
  Search,
  X,
  BadgeCheck,
  EyeOff,
  PackageCheck,
  TriangleAlert,
  PackageX,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import PaginationControls from "@/components/shared/pagination/PaginationControls";
import { toast } from "sonner";
import { deleteMedicineAction } from "@/actions/medicine.action";
import { cn } from "@/lib/utils";
import type { MedicineItem, PaginationMeta } from "../page";

interface MedicinesTableProps {
  medicines: MedicineItem[];
  meta: PaginationMeta | null;
}

const LOW_STOCK_THRESHOLD = 5;

function MedicineStatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <Badge
      className={cn(
        "gap-1 border px-2 py-0.5 text-[11px] font-semibold",
        isActive
          ? "bg-brand-50 text-brand-700 border-brand-200"
          : "bg-slate-50 text-slate-600 border-slate-200",
      )}
    >
      {isActive ? (
        <BadgeCheck className="size-3" aria-hidden />
      ) : (
        <EyeOff className="size-3" aria-hidden />
      )}
      {isActive ? "Active" : "Inactive"}
    </Badge>
  );
}

function StockBadge({ quantity }: { quantity: number }) {
  if (quantity === 0) {
    return (
      <Badge className="gap-1 border bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-status-cancelled border-red-200">
        <PackageX className="size-3" aria-hidden />
        Out of stock
      </Badge>
    );
  }
  if (quantity <= LOW_STOCK_THRESHOLD) {
    return (
      <Badge className="gap-1 border bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-status-processing border-amber-200">
        <TriangleAlert className="size-3" aria-hidden />
        Low · {quantity}
      </Badge>
    );
  }
  return (
    <Badge className="gap-1 border bg-status-delivered/10 px-2 py-0.5 text-[11px] font-semibold text-status-delivered border-status-delivered/20">
      <PackageCheck className="size-3" aria-hidden />
      In stock · {quantity}
    </Badge>
  );
}

function MedicinePrice({
  price,
  originalPrice,
}: {
  price: number;
  originalPrice: number;
}) {
  const hasDiscount = originalPrice > price;
  const savingsPct = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className="flex items-center justify-end gap-2">
      <div className="text-right">
        <p className="font-semibold text-brand-900">৳{price.toFixed(0)}</p>
        {hasDiscount && (
          <p className="text-xs text-muted-foreground line-through">
            ৳{originalPrice.toFixed(0)}
          </p>
        )}
      </div>
      {hasDiscount && (
        <Badge className="border-0 bg-brand-100 px-1.5 py-0.5 text-[10px] font-bold text-brand-800">
          -{savingsPct}%
        </Badge>
      )}
    </div>
  );
}

export function MedicinesTable({ medicines, meta }: MedicinesTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Client-side search filtering
  const filteredMedicines = useMemo(() => {
    if (!searchQuery.trim()) return medicines;
    const query = searchQuery.toLowerCase();
    return medicines.filter(
      (m) =>
        m.name.toLowerCase().includes(query) ||
        m.slug.toLowerCase().includes(query) ||
        (m.category?.name || "").toLowerCase().includes(query),
    );
  }, [medicines, searchQuery]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const res = await deleteMedicineAction(id);
    if (res?.success) {
      toast.success("Medicine deleted");
    } else {
      toast.error(res?.message || "Failed to delete");
    }
    setDeletingId(null);
  };

  const getPrimaryImage = (m: MedicineItem) =>
    m.images?.find((i) => i.isPrimary)?.imageUrl || m.images?.[0]?.imageUrl;

  const getPrice = (m: MedicineItem) => {
    const price = m.discountPrice ? Number(m.discountPrice) : Number(m.price);
    return { price, originalPrice: Number(m.price) };
  };

  const noResults = (
    <Empty className="bg-card py-16">
      <EmptyHeader>
        <EmptyTitle className="text-sm font-semibold text-foreground">
          {searchQuery
            ? "No medicines match your search"
            : "No medicines yet"}
        </EmptyTitle>
        {searchQuery && (
          <EmptyDescription>
            Try searching by medicine name, slug or category.
          </EmptyDescription>
        )}
      </EmptyHeader>
      {searchQuery && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSearchQuery("")}
          className="cursor-pointer"
        >
          Clear search
        </Button>
      )}
    </Empty>
  );

  return (
    <div>
      {/* Search Bar — filters already loaded data */}
      <div className="relative max-w-md mb-4">
        <Search
          className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          aria-label="Search medicines by name, slug or category"
          placeholder="Search by name, slug, category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9 rounded-lg pl-9 pr-9 focus-visible:ring-brand-600/40 focus-visible:border-brand-600"
        />
        {searchQuery && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setSearchQuery("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-brand-50 hover:text-brand-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            <X className="size-4" aria-hidden />
          </button>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-xl border border-border-default bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface-card">
              <TableHead className="font-semibold text-muted-foreground">
                Medicine
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground">
                Category
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="text-right font-semibold text-muted-foreground">
                Price
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground">
                Stock
              </TableHead>
              <TableHead className="text-right font-semibold text-muted-foreground">
                Sold
              </TableHead>
              <TableHead className="text-right font-semibold text-muted-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMedicines.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10">
                  {noResults}
                </TableCell>
              </TableRow>
            ) : (
              filteredMedicines.map((m) => {
                const primaryImage = getPrimaryImage(m);
                const { price, originalPrice } = getPrice(m);

                return (
                  <TableRow
                    key={m.id}
                    className="transition-colors hover:bg-brand-50/30"
                  >
                    <TableCell>
                      <Link
                        href={`/seller/medicines/${m.id}`}
                        className="flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 rounded-md"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-card">
                          {primaryImage ? (
                            <Image
                              src={primaryImage}
                              alt={m.name}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          ) : (
                            <Pill className="size-4 text-muted-foreground" aria-hidden />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="max-w-48 truncate font-semibold text-foreground">
                            {m.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            /{m.slug}
                          </p>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {m.category?.name || "-"}
                    </TableCell>
                    <TableCell>
                      <MedicineStatusBadge isActive={m.isActive} />
                    </TableCell>
                    <TableCell className="text-right">
                      <MedicinePrice price={price} originalPrice={originalPrice} />
                    </TableCell>
                    <TableCell>
                      <StockBadge quantity={m.stockQuantity} />
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {m._count?.orderItems || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      <TooltipProvider delayDuration={200}>
                        <div className="flex items-center justify-end gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link
                                href={`/seller/medicines/${m.id}`}
                                aria-label={`Edit ${m.name}`}
                                className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                              >
                                <Pencil className="size-4" aria-hidden />
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent>Edit medicine</TooltipContent>
                          </Tooltip>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button
                                type="button"
                                aria-label={`Delete ${m.name}`}
                                className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-red-50 hover:text-status-cancelled focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                              >
                                <Trash2 className="size-4" aria-hidden />
                              </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Medicine</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete &ldquo;{m.name}
                                  &rdquo;? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(m.id)}
                                  className="bg-red-600 text-white hover:bg-red-700"
                                >
                                  {deletingId === m.id ? "Deleting..." : "Delete"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {filteredMedicines.length === 0 ? (
          noResults
        ) : (
          filteredMedicines.map((m) => {
            const primaryImage = getPrimaryImage(m);
            const { price, originalPrice } = getPrice(m);

            return (
              <div
                key={m.id}
                className="space-y-3 rounded-xl border border-border-default bg-card p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-card">
                    {primaryImage ? (
                      <Image
                        src={primaryImage}
                        alt={m.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    ) : (
                      <Pill className="size-5 text-muted-foreground" aria-hidden />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-foreground">
                      {m.name}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {m.category?.name || "-"} · /{m.slug}
                    </p>
                  </div>
                  <MedicineStatusBadge isActive={m.isActive} />
                </div>

                <div className="flex items-end justify-between gap-3 border-t border-border-default pt-3">
                  <div className="space-y-2">
                    <StockBadge quantity={m.stockQuantity} />
                    <p className="text-xs text-muted-foreground">
                      Sold: {m._count?.orderItems || 0}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <MedicinePrice price={price} originalPrice={originalPrice} />
                  </div>
                </div>

                <div className="flex items-center gap-2 border-t border-border-default pt-3">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="flex-1 cursor-pointer"
                  >
                    <Link href={`/seller/medicines/${m.id}`}>
                      <Pencil className="size-3.5" aria-hidden /> Edit
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex-1 cursor-pointer text-status-cancelled hover:bg-red-50"
                      >
                        <Trash2 className="size-3.5" aria-hidden /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Medicine</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete &ldquo;{m.name}&rdquo;?
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(m.id)}
                          className="bg-red-600 text-white hover:bg-red-700"
                        >
                          {deletingId === m.id ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {meta && <PaginationControls meta={meta} />}
    </div>
  );
}
