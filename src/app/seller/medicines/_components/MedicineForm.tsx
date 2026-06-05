"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createMedicineAction,
  updateMedicineAction,
} from "@/actions/medicine.action";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { Category } from "@/types";

const DOSAGE_FORMS = [
  "TABLET",
  "CAPSULE",
  "SYRUP",
  "OINTMENT",
  "INJECTION",
  "DROPS",
] as const;

const MedicineFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  genericName: z.string().min(1, "Generic name is required"),
  manufacturerName: z.string().min(1, "Manufacturer is required"),
  dosageForm: z.string().min(1, "Dosage form is required"),
  unitPresentation: z.string().min(1, "Unit presentation is required"),
  price: z.number().positive("Price must be positive"),
  discountPrice: z.number().optional(),
  stockQuantity: z.number().int().nonnegative().default(0),
  categoryId: z.string().min(1, "Category is required"),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  indications: z.string().optional(),
  dosageInstructions: z.string().optional(),
  sideEffects: z.string().optional(),
  strength: z.string().optional(),
  brandName: z.string().optional(),
  sku: z.string().optional(),
  isFeatured: z.boolean().optional(),
});

interface InitialMedicineImage {
  id: string;
  imageUrl: string;
  altText: string | null;
  isPrimary: boolean;
}

interface InitialMedicineData {
  id: string;
  name: string;
  genericName: string;
  manufacturerName: string;
  dosageForm: string;
  strength: string | null;
  unitPresentation: string;
  price: string | number;
  discountPrice: string | number | null;
  stockQuantity: number;
  categoryId: string;
  shortDescription: string | null;
  description: string | null;
  indications: string | null;
  dosageInstructions: string | null;
  sideEffects: string | null;
  brandName: string | null;
  sku: string | null;
  isFeatured: boolean;
  images: InitialMedicineImage[];
}

interface MedicineFormProps {
  categories: Category[];
  initialData?: InitialMedicineData;
  isEditing?: boolean;
  medicineId?: string;
}

interface ImageEntry {
  imageUrl: string;
  altText?: string;
  isPrimary?: boolean;
}

export function MedicineForm({
  categories,
  initialData,
  isEditing,
  medicineId,
}: MedicineFormProps) {
  const router = useRouter();
  const [images, setImages] = useState<ImageEntry[]>(
    initialData?.images?.map((img: InitialMedicineImage) => ({
      imageUrl: img.imageUrl,
      altText: img.altText || "",
      isPrimary: img.isPrimary || false,
    })) || [],
  );

  const form = useForm({
    defaultValues: {
      name: initialData?.name || "",
      genericName: initialData?.genericName || "",
      manufacturerName: initialData?.manufacturerName || "",
      dosageForm: initialData?.dosageForm || "",
      strength: initialData?.strength || "",
      unitPresentation: initialData?.unitPresentation || "",
      price: initialData ? Number(initialData.price) : 0,
      discountPrice: initialData?.discountPrice
        ? Number(initialData.discountPrice)
        : undefined,
      stockQuantity: initialData?.stockQuantity || 0,
      categoryId: initialData?.categoryId || "",
      shortDescription: initialData?.shortDescription || "",
      description: initialData?.description || "",
      indications: initialData?.indications || "",
      dosageInstructions: initialData?.dosageInstructions || "",
      sideEffects: initialData?.sideEffects || "",
      brandName: initialData?.brandName || "",
      sku: initialData?.sku || "",
      isFeatured: initialData?.isFeatured || false,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validators: { onSubmit: MedicineFormSchema as any },
    onSubmit: async ({ value }) => {
      if (images.length === 0) {
        toast.error("At least one image is required");
        return;
      }

      const toastId = toast.loading(
        isEditing ? "Updating medicine..." : "Creating medicine...",
      );
      const payload = {
        ...value,
        images: images.map((img, i) => ({
          ...img,
          isPrimary: i === 0 ? true : img.isPrimary,
          id: initialData?.images?.[i]?.id,
        })),
      };

      try {
        const res =
          isEditing && medicineId
            ? await updateMedicineAction(medicineId, payload)
            : await createMedicineAction(payload);

        if (res?.success) {
          toast.success(isEditing ? "Medicine updated!" : "Medicine created!", {
            id: toastId,
          });
          router.push("/seller/medicines");
          router.refresh();
        } else {
          toast.error(res?.message || "Failed to save medicine", {
            id: toastId,
          });
        }
      } catch {
        toast.error("An unexpected error occurred", { id: toastId });
      }
    },
  });

  const addImage = (url: string) => {
    setImages((prev) => [
      ...prev,
      { imageUrl: url, isPrimary: prev.length === 0 },
    ]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit(e);
      }}
      className="space-y-6"
    >
      <div>
        <Label className="text-xs font-bold text-slate-700 mb-3 block">
          Medicine Images *
        </Label>
        <div className="flex flex-wrap gap-3">
          {images.map((img, i) => (
            <div
              key={i}
              className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.imageUrl}
                alt=""
                className="w-full h-full object-cover"
              />
              {img.isPrimary && (
                <span className="absolute top-1 left-1 text-[8px] font-bold bg-emerald-500 text-white px-1.5 py-0.5 rounded">
                  PRIMARY
                </span>
              )}
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <ImageUpload value="" onChange={addImage} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <form.Field name="name">
          {(field) => (
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                Medicine Name *
              </Label>
              <Input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="rounded-lg"
                placeholder="e.g. Napa Extend"
              />
            </div>
          )}
        </form.Field>
        <form.Field name="genericName">
          {(field) => (
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                Generic Name *
              </Label>
              <Input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="rounded-lg"
                placeholder="e.g. Paracetamol"
              />
            </div>
          )}
        </form.Field>
        <form.Field name="manufacturerName">
          {(field) => (
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                Manufacturer *
              </Label>
              <Input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="rounded-lg"
                placeholder="e.g. Beximco"
              />
            </div>
          )}
        </form.Field>
        <form.Field name="categoryId">
          {(field) => (
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                Category *
              </Label>
              <Select
                value={field.state.value}
                onValueChange={field.handleChange}
              >
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </form.Field>
        <form.Field name="dosageForm">
          {(field) => (
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                Dosage Form *
              </Label>
              <Select
                value={field.state.value}
                onValueChange={field.handleChange}
              >
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Select form" />
                </SelectTrigger>
                <SelectContent>
                  {DOSAGE_FORMS.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f.charAt(0) + f.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </form.Field>
        <form.Field name="strength">
          {(field) => (
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                Strength
              </Label>
              <Input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="rounded-lg"
                placeholder="e.g. 500mg"
              />
            </div>
          )}
        </form.Field>
        <form.Field name="unitPresentation">
          {(field) => (
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                Unit Presentation *
              </Label>
              <Input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="rounded-lg"
                placeholder="e.g. 10 Tablets"
              />
            </div>
          )}
        </form.Field>
        <form.Field name="price">
          {(field) => (
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                Price (৳) *
              </Label>
              <Input
                type="number"
                step="0.01"
                value={field.state.value}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                className="rounded-lg"
                placeholder="0.00"
              />
            </div>
          )}
        </form.Field>
        <form.Field name="discountPrice">
          {(field) => (
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                Discount Price (৳)
              </Label>
              <Input
                type="number"
                step="0.01"
                value={field.state.value || ""}
                onChange={(e) =>
                  field.handleChange(
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
                className="rounded-lg"
                placeholder="Optional"
              />
            </div>
          )}
        </form.Field>
        <form.Field name="stockQuantity">
          {(field) => (
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                Stock Quantity
              </Label>
              <Input
                type="number"
                value={field.state.value}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                className="rounded-lg"
                placeholder="0"
              />
            </div>
          )}
        </form.Field>
        <form.Field name="brandName">
          {(field) => (
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                Brand Name
              </Label>
              <Input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="rounded-lg"
                placeholder="Optional"
              />
            </div>
          )}
        </form.Field>
        <form.Field name="sku">
          {(field) => (
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">SKU</Label>
              <Input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="rounded-lg"
                placeholder="Optional"
              />
            </div>
          )}
        </form.Field>
      </div>

      <form.Field name="shortDescription">
        {(field) => (
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700">
              Short Description
            </Label>
            <Input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className="rounded-lg"
              placeholder="Brief description"
            />
          </div>
        )}
      </form.Field>

      <form.Field name="description">
        {(field) => (
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700">
              Full Description
            </Label>
            <Textarea
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className="rounded-lg min-h-24"
              placeholder="Detailed description..."
            />
          </div>
        )}
      </form.Field>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <form.Field name="indications">
          {(field) => (
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                Indications
              </Label>
              <Textarea
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="rounded-lg"
                placeholder="What it treats"
              />
            </div>
          )}
        </form.Field>
        <form.Field name="dosageInstructions">
          {(field) => (
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                Dosage Instructions
              </Label>
              <Textarea
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="rounded-lg"
                placeholder="How to take"
              />
            </div>
          )}
        </form.Field>
        <form.Field name="sideEffects">
          {(field) => (
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                Side Effects
              </Label>
              <Textarea
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="rounded-lg"
                placeholder="Possible side effects"
              />
            </div>
          )}
        </form.Field>
      </div>

      <form.Subscribe selector={(state) => [state.isSubmitting]}>
        {([isSubmitting]) => (
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-6 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                </>
              ) : isEditing ? (
                "Update Medicine"
              ) : (
                "Create Medicine"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="cursor-pointer"
            >
              Cancel
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}
