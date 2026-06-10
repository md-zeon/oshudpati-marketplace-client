"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  MapPin,
  Phone,
  User,
  Trash2,
  Edit3,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getMyAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/actions/address.action";
import { Address } from "@/types";

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

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modal States
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fetch data on mount
  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      const data = await getMyAddresses();
      setAddresses(data);
    } catch (err) {
      toast.error("Could not load your addresses.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Handle Input Changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open modal for either Create or Edit Mode
  const handleOpenModal = (address: Address | null = null) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        fullName: address.fullName,
        phoneNumber: address.phoneNumber,
        division: address.division,
        district: address.district,
        area: address.area,
        streetAddress: address.streetAddress,
        postalCode: address.postalCode || "",
        addressLabel: address.addressLabel || "Home",
      });
    } else {
      setEditingAddress(null);
      setFormData(initialFormState);
    }
    setIsOpen(true);
  };

  // Save Form (Create / Update handling)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingAddress) {
        const res = await updateAddress(editingAddress.id, formData);
        if (res?.success) {
          toast.success("Address updated successfully!");
          fetchAddresses();
          setIsOpen(false);
        } else {
          toast.error(res?.message || "Failed to update address.");
        }
      } else {
        const res = await createAddress(formData);
        if (res?.success) {
          toast.success("New address added successfully!");
          fetchAddresses();
          setIsOpen(false);
        } else {
          toast.error(res?.message || "Failed to add address.");
        }
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Address Handle
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await deleteAddress(id);
      if (res?.success) {
        toast.success("Address deleted.");
        setAddresses((prev) => prev.filter((addr) => addr.id !== id));
      } else {
        toast.error(res?.message || "Failed to delete.");
      }
    } catch (err) {
      toast.error("Error deleting address.");
    }
  };

  // Toggle Default Address Logic
  const handleSetDefault = async (id: string) => {
    try {
      const res = await setDefaultAddress(id);
      if (res?.success) {
        toast.success("Default address updated.");
        setAddresses((prev) =>
          prev.map((addr) => ({
            ...addr,
            isDefault: addr.id === id,
          })),
        );
      } else {
        toast.error(res.message || "Failed to set default address.");
      }
    } catch (err) {
      toast.error("Error updating default address.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 text-slate-900">
      {/* Header Panel Layout */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5 mb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            My Addresses
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your delivery locations and shipping presets
          </p>
        </div>
        <Button
          onClick={() => handleOpenModal(null)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs tracking-wide rounded-xl gap-1.5 shadow-sm px-4 py-2.5 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Address
        </Button>
      </div>

      {/* Main UI Dynamic Display State Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-44 bg-slate-100 border border-slate-200/60 rounded-xl"
            />
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 border-2 border-dashed border-slate-200/80 rounded-2xl bg-slate-50/50">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 flex items-center justify-center rounded-full mb-3">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">
            No addresses saved yet
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mt-1 mb-5">
            Add a shipping location now for faster access during checkouts.
          </p>
          <Button
            onClick={() => handleOpenModal(null)}
            variant="outline"
            className="text-xs rounded-xl font-semibold cursor-pointer"
          >
            Add your first address
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`relative border rounded-2xl p-5 bg-white shadow-sm transition-all flex flex-col justify-between ${
                address.isDefault
                  ? "border-emerald-500 ring-1 ring-emerald-500/20"
                  : "border-slate-200"
              }`}
            >
              <div>
                {/* Upper Status Line */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200/30">
                    {address.addressLabel || "Home"}
                  </span>
                  {address.isDefault && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-50" />{" "}
                      Default
                    </span>
                  )}
                </div>

                {/* Identity & Details Blocks */}
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                    <User className="w-3.5 h-3.5 text-slate-400" />{" "}
                    {address.fullName}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />{" "}
                    {address.phoneNumber}
                  </div>
                  <div className="flex items-start gap-2 pt-1 leading-relaxed">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      {address.streetAddress}, <br />
                      {address.area}, {address.district}, {address.division}
                      {address.postalCode && ` - ${address.postalCode}`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Action Controls Footer */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-5">
                {!address.isDefault ? (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="text-xs font-semibold text-slate-500 hover:text-emerald-600 transition cursor-pointer"
                  >
                    Set as Default
                  </button>
                ) : (
                  <div className="text-[11px] font-medium text-emerald-600">
                    Primary delivery option
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenModal(address)}
                    className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer"
                    title="Edit Address"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="p-1.5 border border-slate-200 rounded-lg text-slate-400 hover:text-rose-600 hover:border-rose-100 hover:bg-rose-50/30 transition cursor-pointer"
                    title="Delete Address"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= EDIT / CREATE DIALOG DIALOG CONTAINER ================= */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-125 rounded-2xl bg-white p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              {editingAddress ? "Edit Address Details" : "Add Delivery Address"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {/* Row 1: FullName */}
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

            {/* Row 2: Phone Number */}
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

            {/* Row 3: Division & District Grid Layout */}
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

            {/* Row 4: Area & PostalCode Grid Layout */}
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

            {/* Row 5: Detailed Street Address */}
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

            {/* Row 6: Custom Address Tag/Label */}
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

            {/* Form Footer Action Switches */}
            <div className="flex gap-2 justify-end pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
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
    </div>
  );
}
