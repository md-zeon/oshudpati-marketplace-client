"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
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
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-slate-200 p-6 space-y-5"
    >
      <div>
        <Label className="text-xs font-bold text-slate-700 mb-3 block">
          Shop Logo
        </Label>
        <ImageUpload
          value={logo}
          onChange={setLogo}
          onRemove={() => setLogo("")}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="name" className="text-xs font-bold text-slate-700">
          Shop Name *
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Awesome Shop"
          required
          className="rounded-lg"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="desc" className="text-xs font-bold text-slate-700">
          Description
        </Label>
        <Textarea
          id="desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tell customers about your shop"
          className="rounded-lg min-h-24"
        />
      </div>
      <Button
        type="submit"
        disabled={saving}
        className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
      >
        {saving ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
          </>
        ) : shop ? (
          "Update Shop"
        ) : (
          "Create Shop"
        )}
      </Button>
    </form>
  );
};

export default ShopForm;
