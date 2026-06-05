"use client";

import { useState, useEffect } from "react";
import {
  getCategoriesAction,
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/actions/admin.action";
import { Grid3X3, Plus, Edit3, Trash2, X, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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

export default function AdminCategories() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    const res = await getCategoriesAction();
    if (res?.success) setCategories(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreate = () => {
    setEditingCategory(null);
    setName("");
    setDescription("");
    setDialogOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || "");
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }
    setSaving(true);
    const tid = toast.loading(editingCategory ? "Updating..." : "Creating...");

    try {
      const res = editingCategory
        ? await updateCategoryAction(editingCategory.id, {
            name: name.trim(),
            description: description.trim() || undefined,
          })
        : await createCategoryAction({
            name: name.trim(),
            description: description.trim() || undefined,
          });

      if (res?.success) {
        toast.success(
          editingCategory ? "Category updated!" : "Category created!",
          { id: tid },
        );
        setDialogOpen(false);
        fetchCategories();
      } else {
        toast.error(res?.message || "Failed to save", { id: tid });
      }
    } catch {
      toast.error("Unexpected error", { id: tid });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    const tid = toast.loading("Deleting...");
    const res = await deleteCategoryAction(id);
    if (res?.success) {
      toast.success("Category deleted", { id: tid });
      fetchCategories();
    } else {
      toast.error(res?.message || "Failed to delete", { id: tid });
    }
  };

  if (loading) {
    return <div className="animate-pulse h-48 bg-slate-100 rounded-xl" />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-50">
            <Grid3X3 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Categories</h1>
            <p className="text-sm text-slate-500">
              {categories.length} categories
            </p>
          </div>
        </div>
        <Button
          onClick={openCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Category
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-20">
          <Grid3X3 className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-sm font-medium text-slate-500">
            No categories yet
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-slate-900">{cat.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">
                    /{cat.slug}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(cat)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {cat.description && (
                <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                  {cat.description}
                </p>
              )}
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] font-semibold">
                  {cat._count?.medicines || 0} medicines
                </Badge>
                {cat.isActive ? (
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
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {editingCategory ? "Edit Category" : "Add Category"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">Name *</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-lg"
                placeholder="Category name"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                Description
              </Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="rounded-lg min-h-20"
                placeholder="Optional description"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                </>
              ) : editingCategory ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
