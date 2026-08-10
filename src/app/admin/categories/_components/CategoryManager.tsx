"use client";

import { useState, useEffect } from "react";
import { CategoryCard } from "./CategoryCard";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
  recoverCategoryAction,
} from "@/actions/admin.action";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { Grid3X3, Plus, Trash2, Loader2, ArchiveRestore } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Empty, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { toast } from "sonner";
import { PageSection } from "@/components/shared/PageSection";
import { useRouter } from "next/navigation";

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

interface CategoryManagerProps {
  categories: Category[];
  trashCategories: Category[];
}

export function CategoryManager({
  categories: initialCategories,
  trashCategories: initialTrashCategories,
}: CategoryManagerProps) {
  const router = useRouter();
  const categories = initialCategories;
  const trashCategories = initialTrashCategories;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);

  // Safety net: ensure Radix never leaves the body scroll-locked.
  useEffect(() => {
    if (!dialogOpen) {
      document.body.style.overflow = "";
      document.body.style.pointerEvents = "";
    }
  }, [dialogOpen]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setImageUrl("");
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingCategory(null);
    resetForm();
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingCategory(null);
      resetForm();
    }
  };

  const openCreate = () => {
    setEditingCategory(null);
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || "");
    setImageUrl(cat.imageUrl || "");
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
      const payload: {
        name: string;
        description?: string;
        imageUrl?: string;
      } = {
        name: name.trim(),
        description: description.trim() || undefined,
      };

      if (imageUrl.trim()) {
        payload.imageUrl = imageUrl.trim();
      }

      const res = editingCategory
        ? await updateCategoryAction(editingCategory.id, payload)
        : await createCategoryAction(payload);

      if (res?.success) {
        toast.success(
          editingCategory ? "Category updated!" : "Category created!",
          { id: tid },
        );
        closeDialog();
        router.refresh();
      } else {
        toast.error(res?.message || "Failed to save", { id: tid });
      }
    } catch {
      toast.error("Something went wrong", { id: tid });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (cat: Category) => {
    setDeleteTarget(cat);
    setAlertDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    const tid = toast.loading("Deleting...");

    try {
      const res = await deleteCategoryAction(deleteTarget.id);

      if (res?.success) {
        toast.success("Category moved to trash", { id: tid });
        setAlertDialogOpen(false);
        setDeleteTarget(null);
        router.refresh();
      } else {
        toast.error(res?.message || "Failed to delete", { id: tid });
      }
    } catch {
      toast.error("Something went wrong", { id: tid });
    }
  };

  const handleRecover = async (id: string) => {
    const tid = toast.loading("Restoring...");

    try {
      const res = await recoverCategoryAction(id);

      if (res?.success) {
        toast.success("Category restored!", { id: tid });
        router.refresh();
      } else {
        toast.error(res?.message || "Failed to restore", { id: tid });
      }
    } catch {
      toast.error("Something went wrong", { id: tid });
    }
  };

  return (
    <div className="space-y-6">
      <PageSection>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-trust-50 p-2.5">
              <Grid3X3 className="h-5 w-5 text-trust-600" aria-hidden />
            </div>
            <div>
              <h1 className="text-xl font-bold text-trust-900">Categories</h1>
              <p className="text-sm text-muted-foreground">
                {categories.length} active
                {trashCategories.length > 0 &&
                  ` · ${trashCategories.length} in trash`}
              </p>
            </div>
          </div>
          <Button
            onClick={openCreate}
            className="cursor-pointer bg-trust-700 text-white hover:bg-trust-600"
          >
            <Plus className="mr-1 h-4 w-4" aria-hidden /> Add Category
          </Button>
        </div>
      </PageSection>

      <PageSection delay={0.05}>
        <Tabs defaultValue="active" className="flex w-full flex-col">
          <TabsList className="mb-6">
            <TabsTrigger value="active" className="text-sm">
              Active
              <Badge className="ml-1.5 bg-trust-600 px-1.5 py-0 text-[10px] text-white">
                {categories.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="trash" className="text-sm">
              Trash
              {trashCategories.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1.5 px-1.5 py-0 text-[10px]"
                >
                  {trashCategories.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {categories.length === 0 ? (
              <Empty className="py-16">
                <Grid3X3 className="h-10 w-10 text-trust-300" aria-hidden />
                <EmptyTitle>No categories yet</EmptyTitle>
                <EmptyDescription>
                  Create your first category so sellers can organise their
                  medicines.
                </EmptyDescription>
                <Button
                  onClick={openCreate}
                  className="cursor-pointer bg-trust-700 text-white hover:bg-trust-600"
                >
                  <Plus className="mr-1 h-4 w-4" aria-hidden /> Add Category
                </Button>
              </Empty>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
                {categories.map((cat) => (
                  <CategoryCard
                    key={cat.id}
                    cat={cat}
                    showActions={true}
                    isTrash={false}
                    onEdit={openEdit}
                    onDelete={handleDeleteClick}
                    onRecover={handleRecover}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="trash">
            {trashCategories.length === 0 ? (
              <Empty className="py-16">
                <ArchiveRestore
                  className="h-10 w-10 text-trust-300"
                  aria-hidden
                />
                <EmptyTitle>Trash is empty</EmptyTitle>
                <EmptyDescription>
                  Deleted categories will appear here so you can restore them.
                </EmptyDescription>
              </Empty>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
                {trashCategories.map((cat) => (
                  <CategoryCard
                    key={cat.id}
                    cat={cat}
                    showActions={true}
                    isTrash={true}
                    onEdit={openEdit}
                    onDelete={handleDeleteClick}
                    onRecover={handleRecover}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </PageSection>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {editingCategory ? "Edit Category" : "Add Category"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-lg"
                placeholder="Category name"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                Description
              </Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-20 rounded-lg"
                placeholder="Optional description"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                Image URL
              </Label>
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="rounded-lg"
                placeholder="Paste image URL or upload below"
              />
            </div>
            <div>
              <ImageUpload
                value={imageUrl}
                onChange={(url) => setImageUrl(url)}
                onRemove={() => setImageUrl("")}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={closeDialog}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="cursor-pointer bg-trust-700 text-white hover:bg-trust-600"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
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

      {/* Delete Confirmation AlertDialog */}
      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent className="max-w-sm rounded-2xl">
          <AlertDialogHeader>
            <div className="mx-auto mb-2 inline-flex size-10 items-center justify-center rounded-full bg-red-50 sm:mx-0">
              <Trash2 className="h-5 w-5 text-red-500" aria-hidden />
            </div>
            <AlertDialogTitle className="text-lg font-bold">
              Delete Category
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {deleteTarget?.name}
              </span>
              ? It will be moved to trash and can be restored later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setDeleteTarget(null)}
              className="cursor-pointer rounded-lg"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="cursor-pointer rounded-lg bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
