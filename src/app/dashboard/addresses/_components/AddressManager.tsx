"use client";

import React, { useState } from "react";
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
import { Address } from "@/types";
import { deleteAddress, setDefaultAddress } from "@/actions/address.action";
import { motion } from "motion/react";
import { PageSection } from "@/components/shared/PageSection";
import { AddressFormDialog } from "./AddressFormDialog";
import { AddressDeleteDialog } from "./AddressDeleteDialog";

interface AddressManagerProps {
  initialAddresses: Address[];
}

export function AddressManager({ initialAddresses }: AddressManagerProps) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [isOpen, setIsOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(
    null,
  );

  const handleDelete = async (id: string) => {
    setDeleteModalOpen(false);
    try {
      const res = await deleteAddress(id);
      if (res?.success) {
        toast.success("Address deleted.");
        setAddresses((prev) => prev.filter((addr) => addr.id !== id));
      } else {
        toast.error(res?.message || "Failed to delete.");
      }
    } catch {
      toast.error("Error deleting address.");
    }
  };

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
        toast.error(res?.message || "Failed to set default address.");
      }
    } catch {
      toast.error("Error updating default address.");
    }
  };

  const handleSaveSuccess = () => {
    // Re-fetch addresses after create/update
    import("@/actions/address.action").then(({ getMyAddresses }) => {
      getMyAddresses().then((data) => {
        setAddresses(data);
      });
    });
  };

  const handleOpenModal = (address: Address | null = null) => {
    setEditingAddress(address);
    setIsOpen(true);
  };

  return (
    <>
      {/* Header Panel */}
      <PageSection>
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
      </PageSection>

      {/* Address Cards Grid */}
      {addresses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center text-center py-16 border-2 border-dashed border-slate-200/80 rounded-2xl bg-slate-50/50"
        >
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
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 stagger-children">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`relative border rounded-2xl p-5 bg-white shadow-sm transition-all flex flex-col justify-between ${
                address.isDefault
                  ? "border-emerald-500 ring-1 ring-emerald-500/20"
                  : "border-slate-200 hover:border-slate-300"
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

                {/* Identity & Details */}
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

              {/* Card Actions */}
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
                    onClick={() => {
                      setDeleteModalOpen(true);
                      setDeletingAddressId(address.id);
                    }}
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

      {/* Address Form Dialog */}
      <AddressFormDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        editingAddress={editingAddress}
        onSuccess={handleSaveSuccess}
      />
      {/* Delete Confirmation Modal */}
      <AddressDeleteDialog
        deleteModalOpen={deleteModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        handleDelete={handleDelete}
        addressId={deletingAddressId as string}
      />
    </>
  );
}
