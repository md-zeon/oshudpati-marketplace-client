"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Address } from "@/types";
import { createAddress, updateAddress } from "@/actions/address.action";

interface AddressFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingAddress: Address | null;
  onSuccess: () => void;
}

const initialFormState = {
  fullName: "",
  phoneNumber: "",
  division: "",
  district: "",
  area: "",
  streetAddress: "",
  postalCode: "",
  addressLabel: "Home",
};

export function AddressFormDialog({
  isOpen,
  onOpenChange,
  editingAddress,
  onSuccess,
}: AddressFormDialogProps) {
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when dialog opens or editingAddress changes
  useEffect(() => {
    if (editingAddress) {
      setFormData({
        fullName: editingAddress.fullName,
        phoneNumber: editingAddress.phoneNumber,
        division: editingAddress.division,
        district: editingAddress.district,
        area: editingAddress.area,
        streetAddress: editingAddress.streetAddress,
        postalCode: editingAddress.postalCode || "",
        addressLabel: editingAddress.addressLabel || "Home",
      });
    } else {
      setFormData(initialFormState);
    }
  }, [editingAddress, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingAddress) {
        const res = await updateAddress(editingAddress.id, formData);
        if (res?.success) {
          toast.success("Address updated successfully!");
          onSuccess();
          onOpenChange(false);
        } else {
          toast.error(res?.message || "Failed to update address.");
        }
      } else {
        const res = await createAddress(formData);
        if (res?.success) {
          toast.success("New address added successfully!");
          onSuccess();
          onOpenChange(false);
        } else {
          toast.error(res?.message || "Failed to add address.");
        }
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125 rounded-2xl bg-white p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-slate-900">
            {editingAddress ? "Edit Address Details" : "Add Delivery Address"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label
              htmlFor="fullName"
              className="text-xs font-bold text-slate-700"
            >
              Full Name
            </Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              className="rounded-lg text-xs"
              placeholder="Receiver name"
            />
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="phoneNumber"
              className="text-xs font-bold text-slate-700"
            >
              Phone Number
            </Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
              className="rounded-lg text-xs"
              placeholder="Active mobile number"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label
                htmlFor="division"
                className="text-xs font-bold text-slate-700"
              >
                Division
              </Label>
              <Input
                id="division"
                name="division"
                value={formData.division}
                onChange={handleInputChange}
                required
                className="rounded-lg text-xs"
                placeholder="e.g. Dhaka"
              />
            </div>
            <div className="space-y-1">
              <Label
                htmlFor="district"
                className="text-xs font-bold text-slate-700"
              >
                District
              </Label>
              <Input
                id="district"
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                required
                className="rounded-lg text-xs"
                placeholder="e.g. Gazipur"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label
                htmlFor="area"
                className="text-xs font-bold text-slate-700"
              >
                Area
              </Label>
              <Input
                id="area"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                required
                className="rounded-lg text-xs"
                placeholder="e.g. Tongi"
              />
            </div>
            <div className="space-y-1">
              <Label
                htmlFor="postalCode"
                className="text-xs font-bold text-slate-700"
              >
                Postal Code (Optional)
              </Label>
              <Input
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                className="rounded-lg text-xs"
                placeholder="e.g. 1710"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="streetAddress"
              className="text-xs font-bold text-slate-700"
            >
              Street Address
            </Label>
            <Input
              id="streetAddress"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleInputChange}
              required
              className="rounded-lg text-xs"
              placeholder="House no, Flat, Block, Road details"
            />
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="addressLabel"
              className="text-xs font-bold text-slate-700"
            >
              Address Label
            </Label>
            <Input
              id="addressLabel"
              name="addressLabel"
              value={formData.addressLabel}
              onChange={handleInputChange}
              className="rounded-lg text-xs"
              placeholder="e.g. Home, Office, Pharmacy"
            />
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="text-xs rounded-lg cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg px-5 cursor-pointer"
            >
              {isSubmitting ? "Saving changes..." : "Save Address"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
