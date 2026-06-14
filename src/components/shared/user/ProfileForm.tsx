"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfileAction } from "@/actions/user.action";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { useRouter } from "next/navigation";

interface ProfileFormProps {
  initialData: {
    name: string;
    email: string;
    phoneNumber: string | null;
    image: string | null;
  };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData.name);
  const [phoneNumber, setPhoneNumber] = useState(initialData.phoneNumber || "");
  const [image, setImage] = useState(initialData.image || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const toastId = toast.loading("Updating profile...");

    try {
      const res = await updateProfileAction({
        name,
        phoneNumber,
        image: image || undefined,
      });

      if (res?.success) {
        toast.success("Profile updated successfully!", { id: toastId });
        router.refresh();
      } else {
        toast.error(res?.message || "Failed to update profile", {
          id: toastId,
        });
      }
    } catch {
      toast.error("An unexpected error occurred", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar */}
      <div>
        <Label className="text-xs font-bold text-slate-700 mb-3 block">
          Profile Picture
        </Label>
        <ImageUpload
          value={image}
          onChange={setImage}
          onRemove={() => setImage("")}
        />
      </div>

      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="name" className="text-xs font-bold text-slate-700">
          Full Name
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="rounded-lg text-sm"
          placeholder="Your name"
        />
      </div>

      {/* Email (disabled) */}
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-xs font-bold text-slate-700">
          Email
        </Label>
        <Input
          id="email"
          value={initialData.email}
          disabled
          className="rounded-lg text-sm bg-slate-50"
        />
        <p className="text-[10px] text-slate-400">Email cannot be changed</p>
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <Label
          htmlFor="phoneNumber"
          className="text-xs font-bold text-slate-700"
        >
          Phone Number
        </Label>
        <Input
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="rounded-lg text-sm"
          placeholder="e.g. +880134567890"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg px-6 cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </>
        )}
      </Button>
    </form>
  );
}
