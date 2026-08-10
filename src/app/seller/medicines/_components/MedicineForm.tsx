"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
import {
  Loader2,
  X,
  ImagePlus,
  PackagePlus,
  Tag,
  FileText,
  CircleDot,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { cn } from "@/lib/utils";
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

function FormError({ errors }: { errors: readonly unknown[] }) {
  const message = errors
    .map((e) =>
      typeof e === "string" ? e : (e as { message?: string })?.message,
    )
    .find(Boolean);
  if (!message) return null;
  return (
    <p role="alert" className="mt-1.5 text-xs font-medium text-danger">
      {message}
    </p>
  );
}

function RequiredMark() {
  return (
    <span className="text-danger" aria-hidden>
      {" "}
      *
    </span>
  );
}

function FormSectionLabel({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-border-default pb-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
        {icon}
      </div>
      <div>
        <h2 className="text-sm font-semibold text-brand-900">{title}</h2>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
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
      <Tabs defaultValue="details" className="w-full">
        <div className="overflow-x-auto pb-1">
          <TabsList className="h-auto w-full min-w-max p-1">
            <TabsTrigger value="details" className="h-8 gap-1.5 px-3 text-xs">
              <CircleDot className="size-3.5" aria-hidden />
              Details
            </TabsTrigger>
            <TabsTrigger value="pricing" className="h-8 gap-1.5 px-3 text-xs">
              <Tag className="size-3.5" aria-hidden />
              Pricing &amp; Stock
            </TabsTrigger>
            <TabsTrigger value="description" className="h-8 gap-1.5 px-3 text-xs">
              <FileText className="size-3.5" aria-hidden />
              Description
            </TabsTrigger>
            <TabsTrigger value="images" className="h-8 gap-1.5 px-3 text-xs">
              <ImagePlus className="size-3.5" aria-hidden />
              Images
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Details */}
        <TabsContent value="details" className="space-y-5 pt-5">
          <FormSectionLabel
            icon={<CircleDot className="size-4" aria-hidden />}
            title="Basic information"
            description="How customers will identify this medicine in your shop."
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <form.Field name="name">
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor={field.name} className="text-sm font-semibold text-foreground">
                    Medicine Name<RequiredMark />
                  </Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={field.state.meta.errors.length > 0}
                    placeholder="e.g. Napa Extend"
                    className="focus-visible:ring-brand-600/40 focus-visible:border-brand-600"
                  />
                  <p className="text-xs text-muted-foreground">
                    The brand name customers see, e.g. Napa Extend.
                  </p>
                  <FormError errors={field.state.meta.errors} />
                </div>
              )}
            </form.Field>
            <form.Field name="genericName">
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor={field.name} className="text-sm font-semibold text-foreground">
                    Generic Name<RequiredMark />
                  </Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={field.state.meta.errors.length > 0}
                    placeholder="e.g. Paracetamol"
                    className="focus-visible:ring-brand-600/40 focus-visible:border-brand-600"
                  />
                  <p className="text-xs text-muted-foreground">
                    The active ingredient, e.g. Paracetamol.
                  </p>
                  <FormError errors={field.state.meta.errors} />
                </div>
              )}
            </form.Field>
            <form.Field name="manufacturerName">
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor={field.name} className="text-sm font-semibold text-foreground">
                    Manufacturer<RequiredMark />
                  </Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={field.state.meta.errors.length > 0}
                    placeholder="e.g. Beximco"
                    className="focus-visible:ring-brand-600/40 focus-visible:border-brand-600"
                  />
                  <FormError errors={field.state.meta.errors} />
                </div>
              )}
            </form.Field>
            <form.Field name="categoryId">
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor={field.name} className="text-sm font-semibold text-foreground">
                    Category<RequiredMark />
                  </Label>
                  <Select
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  >
                    <SelectTrigger
                      id={field.name}
                      className="focus-visible:ring-brand-600/40 focus-visible:border-brand-600"
                    >
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
                  <FormError errors={field.state.meta.errors} />
                </div>
              )}
            </form.Field>
            <form.Field name="dosageForm">
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor={field.name} className="text-sm font-semibold text-foreground">
                    Dosage Form<RequiredMark />
                  </Label>
                  <Select
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  >
                    <SelectTrigger
                      id={field.name}
                      className="focus-visible:ring-brand-600/40 focus-visible:border-brand-600"
                    >
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
                  <FormError errors={field.state.meta.errors} />
                </div>
              )}
            </form.Field>
            <form.Field name="strength">
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor={field.name} className="text-sm font-semibold text-foreground">
                    Strength
                  </Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. 500mg"
                    className="focus-visible:ring-brand-600/40 focus-visible:border-brand-600"
                  />
                </div>
              )}
            </form.Field>
            <form.Field name="unitPresentation">
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor={field.name} className="text-sm font-semibold text-foreground">
                    Unit Presentation<RequiredMark />
                  </Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={field.state.meta.errors.length > 0}
                    placeholder="e.g. 10 Tablets"
                    className="focus-visible:ring-brand-600/40 focus-visible:border-brand-600"
                  />
                  <FormError errors={field.state.meta.errors} />
                </div>
              )}
            </form.Field>
            <form.Field name="brandName">
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor={field.name} className="text-sm font-semibold text-foreground">
                    Brand Name
                  </Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Optional"
                    className="focus-visible:ring-brand-600/40 focus-visible:border-brand-600"
                  />
                </div>
              )}
            </form.Field>
            <form.Field name="sku">
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor={field.name} className="text-sm font-semibold text-foreground">
                    SKU
                  </Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Optional"
                    className="focus-visible:ring-brand-600/40 focus-visible:border-brand-600"
                  />
                </div>
              )}
            </form.Field>
          </div>
        </TabsContent>

        {/* Pricing & Stock */}
        <TabsContent value="pricing" className="space-y-5 pt-5">
          <FormSectionLabel
            icon={<Tag className="size-4" aria-hidden />}
            title="Pricing & stock"
            description="Set the selling price, discounts and available quantity."
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <form.Field name="price">
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor={field.name} className="text-sm font-semibold text-foreground">
                    Price (৳)<RequiredMark />
                  </Label>
                  <Input
                    id={field.name}
                    type="number"
                    step="0.01"
                    min={0}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    aria-invalid={field.state.meta.errors.length > 0}
                    placeholder="0.00"
                    className="focus-visible:ring-brand-600/40 focus-visible:border-brand-600"
                  />
                  <FormError errors={field.state.meta.errors} />
                </div>
              )}
            </form.Field>
            <form.Field name="discountPrice">
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor={field.name} className="text-sm font-semibold text-foreground">
                    Discount Price (৳)
                  </Label>
                  <Input
                    id={field.name}
                    type="number"
                    step="0.01"
                    min={0}
                    value={field.state.value || ""}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    placeholder="Optional"
                    className="focus-visible:ring-brand-600/40 focus-visible:border-brand-600"
                  />
                  <p className="text-xs text-muted-foreground">
                    Shown as the selling price with the original struck through.
                  </p>
                </div>
              )}
            </form.Field>
            <form.Field name="stockQuantity">
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor={field.name} className="text-sm font-semibold text-foreground">
                    Stock Quantity
                  </Label>
                  <Input
                    id={field.name}
                    type="number"
                    min={0}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    placeholder="0"
                    className="focus-visible:ring-brand-600/40 focus-visible:border-brand-600"
                  />
                  <p className="text-xs text-muted-foreground">
                    0 shows the medicine as out of stock to customers.
                  </p>
                </div>
              )}
            </form.Field>
          </div>
          <form.Field name="isFeatured">
            {(field) => (
              <div
                className={cn(
                  "flex items-start gap-3 rounded-xl border border-border-default bg-surface-card p-4",
                )}
              >
                <Switch
                  id={field.name}
                  checked={!!field.state.value}
                  onCheckedChange={(checked) => field.handleChange(checked)}
                />
                <div>
                  <Label
                    htmlFor={field.name}
                    className="text-sm font-semibold text-foreground"
                  >
                    Feature this medicine
                  </Label>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Featured medicines get highlighted in your shop.
                  </p>
                </div>
              </div>
            )}
          </form.Field>
        </TabsContent>

        {/* Description */}
        <TabsContent value="description" className="space-y-5 pt-5">
          <FormSectionLabel
            icon={<FileText className="size-4" aria-hidden />}
            title="Product description"
            description="Help customers understand what the medicine treats and how to take it."
          />
          <form.Field name="shortDescription">
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor={field.name} className="text-sm font-semibold text-foreground">
                  Short Description
                </Label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="One line shown in medicine cards"
                  className="focus-visible:ring-brand-600/40 focus-visible:border-brand-600"
                />
              </div>
            )}
          </form.Field>
          <form.Field name="description">
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor={field.name} className="text-sm font-semibold text-foreground">
                  Full Description
                </Label>
                <Textarea
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="min-h-28 focus-visible:ring-brand-600/40 focus-visible:border-brand-600"
                  placeholder="Detailed description..."
                />
              </div>
            )}
          </form.Field>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <form.Field name="indications">
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor={field.name} className="text-sm font-semibold text-foreground">
                    Indications
                  </Label>
                  <Textarea
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="min-h-24 focus-visible:ring-brand-600/40 focus-visible:border-brand-600"
                    placeholder="What it treats"
                  />
                </div>
              )}
            </form.Field>
            <form.Field name="dosageInstructions">
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor={field.name} className="text-sm font-semibold text-foreground">
                    Dosage Instructions
                  </Label>
                  <Textarea
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="min-h-24 focus-visible:ring-brand-600/40 focus-visible:border-brand-600"
                    placeholder="How to take"
                  />
                </div>
              )}
            </form.Field>
            <form.Field name="sideEffects">
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor={field.name} className="text-sm font-semibold text-foreground">
                    Side Effects
                  </Label>
                  <Textarea
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="min-h-24 focus-visible:ring-brand-600/40 focus-visible:border-brand-600"
                    placeholder="Possible side effects"
                  />
                </div>
              )}
            </form.Field>
          </div>
        </TabsContent>

        {/* Images */}
        <TabsContent value="images" className="space-y-5 pt-5">
          <FormSectionLabel
            icon={<ImagePlus className="size-4" aria-hidden />}
            title="Medicine images"
            description="Add at least one photo. The first image becomes the primary photo."
          />
          <div className="flex flex-wrap gap-3">
            {images.map((img, i) => (
              <div
                key={i}
                className="relative h-24 w-24 overflow-hidden rounded-xl border border-border-default"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.imageUrl}
                  alt={img.altText || `Medicine image ${i + 1}`}
                  className="h-full w-full object-cover"
                />
                {img.isPrimary && (
                  <span className="absolute left-1 top-1 rounded bg-brand-700 px-1.5 py-0.5 text-[8px] font-bold text-white">
                    PRIMARY
                  </span>
                )}
                <button
                  type="button"
                  aria-label={`Remove image ${i + 1}`}
                  onClick={() => removeImage(i)}
                  className="absolute right-1 top-1 rounded-full bg-red-600 p-1 text-white transition-colors hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                >
                  <X className="size-3" aria-hidden />
                </button>
              </div>
            ))}
            <ImageUpload value="" onChange={addImage} />
          </div>
        </TabsContent>
      </Tabs>

      <form.Subscribe selector={(state) => [state.isSubmitting]}>
        {([isSubmitting]) => (
          <div className="flex flex-col-reverse gap-3 border-t border-border-default pt-5 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer bg-brand-700 text-white hover:bg-brand-600 active:bg-brand-800"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />{" "}
                  Saving...
                </>
              ) : isEditing ? (
                "Update Medicine"
              ) : (
                <>
                  <PackagePlus className="size-4" aria-hidden /> Create Medicine
                </>
              )}
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}
