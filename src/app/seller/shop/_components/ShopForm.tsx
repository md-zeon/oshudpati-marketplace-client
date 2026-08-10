"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { toast } from "sonner";
import { Loader2, Store } from "lucide-react";
import { Shop } from "@/types/shop.type";
import { createShop, updateShop } from "@/actions/shop.action";

const ShopForm = ({
  initialShop = null,
}: {
  initialShop: Partial<Shop> | null;
}) => {
  const [shop, setShop] = useState<Partial<Shop> | null>(initialShop);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(shop?.name || "");
  const [description, setDescription] = useState(shop?.description || "");
  const [logo, setLogo] = useState(shop?.logo || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const tid = toast.loading(shop ? "Updating shop..." : "Creating shop...");

    try {
      const createPayload: {
        name: string;
        description?: string;
        logo?: string;
      } = {
        name,
      };
      if (!shop) {
        if (description) createPayload.description = description;
        if (logo) createPayload.logo = logo;
      }
      const updatePayload: {
        name?: string;
        description?: string;
        logo?: string;
      } = {};
      if (shop) {
        if (name && name !== shop.name) updatePayload.name = name;
        if (description && description !== shop.description)
          updatePayload.description = description;
        if (logo && logo !== shop.logo) updatePayload.logo = logo;
      }

      const data = shop
        ? await updateShop(updatePayload)
        : await createShop(createPayload);
      console.log("Shop save response:", data); // Debug log to check the response from the server
      if (data.success) {
        toast.success(shop ? "Shop updated!" : "Shop created!", { id: tid });
        setShop(data.data);
      } else {
        toast.error(data.message || "Failed", { id: tid });
      }
    } catch (error) {
      console.error("Error saving shop:", error);
      toast.error("Error saving shop", { id: tid });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-start gap-3 border-b border-border-default pb-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
          <Store className="size-4" aria-hidden />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-brand-900">Shop identity</h2>
          <p className="text-xs text-muted-foreground">
            A clear logo and name help customers recognise your shop.
          </p>
        </div>
      </div>

      <div>
        <Label className="mb-3 block text-sm font-semibold text-foreground">
          Shop Logo
        </Label>
        <ImageUpload
          value={logo}
          onChange={setLogo}
          onRemove={() => setLogo("")}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="name" className="text-sm font-semibold text-foreground">
          Shop Name{" "}
          <span className="text-danger" aria-hidden>
            *
          </span>
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Awesome Shop"
          required
          className="focus-visible:ring-brand-600/40 focus-visible:border-brand-600"
        />
        <p className="text-xs text-muted-foreground">
          The name customers see across the marketplace.
        </p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="desc" className="text-sm font-semibold text-foreground">
          Description
        </Label>
        <Textarea
          id="desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tell customers about your shop"
          className="min-h-28 focus-visible:ring-brand-600/40 focus-visible:border-brand-600"
        />
        <p className="text-xs text-muted-foreground">
          A short summary of what your shop offers.
        </p>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-border-default pt-5 sm:flex-row sm:items-center sm:justify-end">
        <Button
          type="submit"
          disabled={saving}
          className="cursor-pointer bg-brand-700 text-white hover:bg-brand-600 active:bg-brand-800 sm:w-auto"
        >
          {saving ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden /> Saving...
            </>
          ) : shop ? (
            "Update Shop"
          ) : (
            "Create Shop"
          )}
        </Button>
      </div>
    </form>
  );
};

export default ShopForm;
