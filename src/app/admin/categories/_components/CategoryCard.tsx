"use client";

import { useState } from "react";
import { Edit3, Trash2, ArrowLeftToLine } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Button } from "@/components/ui/button";

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
    <div
      className={`bg-white rounded-xl border border-slate-200 p-5 transition-all duration-300 ${
        isTrash
          ? "opacity-60 hover:opacity-80"
          : "hover:shadow-md hover:-translate-y-0.5"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-slate-900 truncate">{cat.name}</h3>
          <p className="text-xs text-slate-400 font-mono truncate">
            /{cat.slug}
          </p>
        </div>
        {showActions && (
          <div className="flex items-center gap-1 shrink-0 ml-2">
            {!isTrash ? (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onEdit(cat)}
                  className="h-7 w-7"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onDelete(cat)}
                  className="h-7 w-7"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </>
            ) : (
              <button
                onClick={() => onRecover(cat.id)}
                className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                title="Restore"
              >
                <ArrowLeftToLine className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {(cat.imageUrl || cat.description) && (
        <div className="flex gap-3 mb-3">
          {cat.imageUrl && (
            <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-100 shrink-0 bg-slate-50 flex items-center justify-center">
              {!imageError ? (
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <svg
                  className="w-5 h-5 text-slate-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="m21 15-5-5L5 21" />
                </svg>
              )}
            </div>
          )}
          {cat.description && (
            <p className="text-sm text-slate-600 line-clamp-2 flex-1">
              {cat.description}
            </p>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="outline" className="text-[10px] font-semibold">
          {cat._count?.medicines || 0} medicines
        </Badge>
        {isTrash ? (
          <span className="text-[10px] text-red-400 font-semibold">
            Deleted
          </span>
        ) : cat.isActive ? (
          <span className="text-[10px] text-emerald-600 font-semibold">
            Active
          </span>
        ) : (
          <span className="text-[10px] text-red-500 font-semibold">
            Inactive
          </span>
        )}
      </div>
    </div>
  );
}
