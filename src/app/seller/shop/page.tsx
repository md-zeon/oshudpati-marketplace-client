"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { toast } from "sonner";
import { Loader2, Store } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function SellerShopPage() {
  const [shop, setShop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/shops/my-shop`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setShop(d.data);
          setName(d.data.name);
          setDescription(d.data.description || "");
          setLogo(d.data.logo || "");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const tid = toast.loading(shop ? "Updating shop..." : "Creating shop...");

    try {
      const method = shop ? "PATCH" : "POST";
      const res = await fetch(`${API_URL}/api/shops${shop ? "" : ""}`, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, description, logo: logo || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(shop ? "Shop updated!" : "Shop created!", { id: tid });
        setShop(data.data);
      } else {
        toast.error(data.message || "Failed", { id: tid });
      }
    } catch {
      toast.error("Error saving shop", { id: tid });
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <div className="animate-pulse h-48 bg-slate-100 rounded-xl" />;

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <Store className="w-5 h-5 text-emerald-600" />
        <h1 className="text-xl font-bold text-slate-900">
          {shop ? "My Shop" : "Create Your Shop"}
        </h1>
      </div>

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
    </div>
  );
}
