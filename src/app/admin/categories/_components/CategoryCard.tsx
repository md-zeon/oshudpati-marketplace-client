"use client";

import { useState } from "react";
import { Edit3, Trash2, ArrowLeftToLine, Pill } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  _count: { medicines: number };
}

interface CategoryCardProps {
  cat: Category;
  showActions: boolean;
  isTrash: boolean;
  onEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
  onRecover: (id: string) => void;
}

export function CategoryCard({
  cat,
  showActions,
  isTrash,
  onEdit,
  onDelete,
  onRecover,
}: CategoryCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Card
      className={`overflow-hidden border-admin-border transition-all duration-300 ${
        isTrash
          ? "opacity-70 hover:opacity-90"
          : "hover:shadow-md hover:-translate-y-0.5"
      }`}
    >
      <CardContent className="p-5">
        <div className="mb-3 flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-bold text-trust-900">
              {cat.name}
            </h3>
            <p className="truncate font-mono text-xs text-muted-foreground">
              /{cat.slug}
            </p>
          </div>
          {showActions && (
            <div className="ml-2 flex shrink-0 items-center gap-0.5">
              {!isTrash ? (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onEdit(cat)}
                    aria-label={`Edit ${cat.name}`}
                    className="h-8 w-8 text-admin-text/60 hover:bg-trust-50 hover:text-trust-700"
                  >
                    <Edit3 className="h-3.5 w-3.5" aria-hidden />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDelete(cat)}
                    aria-label={`Delete ${cat.name}`}
                    className="h-8 w-8 text-admin-text/60 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRecover(cat.id)}
                  className="h-8 gap-1 rounded-lg border-brand-200 bg-brand-50 text-xs font-semibold text-brand-700 hover:bg-brand-100"
                >
                  <ArrowLeftToLine className="h-3.5 w-3.5" aria-hidden />
                  Restore
                </Button>
              )}
            </div>
          )}
        </div>

        {(cat.imageUrl || cat.description) && (
          <div className="mb-3 flex gap-3">
            {cat.imageUrl && (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-admin-border bg-trust-50">
                {!imageError ? (
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    fill
                    sizes="56px"
                    className="h-full w-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <svg
                    className="h-5 w-5 text-trust-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="m21 15-5-5L5 21" />
                  </svg>
                )}
              </div>
            )}
            {cat.description && (
              <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">
                {cat.description}
              </p>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="gap-1 text-[10px] font-semibold text-admin-text"
          >
            <Pill className="h-3 w-3" aria-hidden />
            {cat._count?.medicines || 0} medicine
            {cat._count?.medicines !== 1 ? "s" : ""}
          </Badge>
          {isTrash ? (
            <span className="text-[10px] font-semibold text-red-500">
              Deleted
            </span>
          ) : cat.isActive ? (
            <span className="text-[10px] font-semibold text-status-delivered">
              Active
            </span>
          ) : (
            <span className="text-[10px] font-semibold text-red-500">
              Inactive
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
