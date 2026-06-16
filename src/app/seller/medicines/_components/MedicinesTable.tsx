"use client";

import { useState, useMemo } from "react";
import { Pill, Edit3, Trash2, Search, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
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
import type { MedicineItem, PaginationMeta } from "../page";

interface MedicinesTableProps {
  medicines: MedicineItem[];
  meta: PaginationMeta | null;
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

  return (
    <div>
      {/* Search Bar — filters already loaded data */}
      <div className="relative max-w-md mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search by name, slug, category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 rounded-lg text-sm"
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold text-slate-600">
                Medicine
              </TableHead>
              <TableHead className="font-semibold text-slate-600">
                Category
              </TableHead>
              <TableHead className="text-right font-semibold text-slate-600">
                Price
              </TableHead>
              <TableHead className="text-right font-semibold text-slate-600">
                Stock
              </TableHead>
              <TableHead className="text-right font-semibold text-slate-600">
                Sold
              </TableHead>
              <TableHead className="text-right font-semibold text-slate-600">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMedicines.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-12 text-slate-500"
                >
                  {searchQuery
                    ? "No medicines match your search"
                    : "No medicines yet"}
                </TableCell>
              </TableRow>
            ) : (
              filteredMedicines.map((m) => {
                const primaryImage =
                  m.images?.find((i) => i.isPrimary)?.imageUrl ||
                  m.images?.[0]?.imageUrl;
                const price = m.discountPrice
                  ? Number(m.discountPrice)
                  : Number(m.price);
                const originalPrice = Number(m.price);

                return (
                  <TableRow
                    key={m.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                          {primaryImage ? (
                            <Image
                              src={primaryImage}
                              alt={m.name}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          ) : (
                            <Pill className="w-4 h-4 text-slate-300" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate max-w-48">
                            {m.name}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            /{m.slug}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {m.category?.name || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold text-slate-800">
                        ৳{price.toFixed(0)}
                      </span>
                      {originalPrice > price && (
                        <span className="text-[10px] text-slate-400 line-through ml-1">
                          ৳{originalPrice.toFixed(0)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`font-semibold ${m.stockQuantity > 5 ? "text-emerald-600" : "text-red-500"}`}
                      >
                        {m.stockQuantity}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-slate-500">
                      {m._count?.orderItems || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/seller/medicines/${m.id}`}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Medicine
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete &ldquo;{m.name}
                                &rdquo;? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(m.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                {deletingId === m.id ? "Deleting..." : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filteredMedicines.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-sm text-slate-500">
              {searchQuery
                ? "No medicines match your search"
                : "No medicines yet"}
            </p>
          </div>
        ) : (
          filteredMedicines.map((m) => {
            const primaryImage =
              m.images?.find((i) => i.isPrimary)?.imageUrl ||
              m.images?.[0]?.imageUrl;
            const price = m.discountPrice
              ? Number(m.discountPrice)
              : Number(m.price);
            const originalPrice = Number(m.price);

            return (
              <div
                key={m.id}
                className="bg-white rounded-xl border border-slate-200 p-4 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                    {primaryImage ? (
                      <Image
                        src={primaryImage}
                        alt={m.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    ) : (
                      <Pill className="w-5 h-5 text-slate-300" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 truncate">
                      {m.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {m.category?.name || "-"} · /{m.slug}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="space-y-1">
                    <p className="text-slate-500">
                      Price:{" "}
                      <span className="font-semibold text-slate-800">
                        ৳{price.toFixed(0)}
                      </span>
                      {originalPrice > price && (
                        <span className="text-xs text-slate-400 line-through ml-1">
                          ৳{originalPrice.toFixed(0)}
                        </span>
                      )}
                    </p>
                    <p className="text-slate-500">
                      Stock:{" "}
                      <span
                        className={`font-semibold ${m.stockQuantity > 5 ? "text-emerald-600" : "text-red-500"}`}
                      >
                        {m.stockQuantity}
                      </span>
                      <span className="ml-3 text-slate-400">
                        Sold: {m._count?.orderItems || 0}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/seller/medicines/${m.id}`}
                      className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50"
                    >
                      <Edit3 className="w-4 h-4 text-slate-500" />
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="p-2 rounded-lg border border-slate-200 hover:bg-red-50">
                          <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Medicine</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete &ldquo;{m.name}
                            &rdquo;?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(m.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            {deletingId === m.id ? "Deleting..." : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
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
