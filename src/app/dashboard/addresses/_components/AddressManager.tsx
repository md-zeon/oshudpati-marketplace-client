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
  const [formVersion, setFormVersion] = useState(0);
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
    setFormVersion((v) => v + 1);
    setIsOpen(true);
  };

  return (
    <>
      {/* Header Panel */}
      <PageSection>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border-default pb-5 mb-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              My Addresses
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Manage your delivery locations and shipping presets
            </p>
          </div>
          <Button
            onClick={() => handleOpenModal(null)}
            className="font-semibold text-xs tracking-wide rounded-xl gap-1.5 shadow-sm px-4 py-2.5 transition cursor-pointer"
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
          className="flex flex-col items-center justify-center text-center py-16 border-2 border-dashed border-border-default rounded-2xl bg-muted/30"
        >
          <div className="w-12 h-12 bg-muted text-muted-foreground flex items-center justify-center rounded-full mb-3">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-foreground">
            No addresses saved yet
          </h3>
          <p className="text-xs text-muted-foreground max-w-xs mt-1 mb-5">
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
              className={`relative border rounded-2xl p-5 bg-card shadow-sm transition-all flex flex-col justify-between ${
                address.isDefault
                  ? "border-brand-500 ring-1 ring-brand-500/20"
                  : "border-border-default hover:border-border-default"
              }`}
            >
              <div>
                {/* Upper Status Line */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-muted text-muted-foreground border border-border-default">
                    {address.addressLabel || "Home"}
                  </span>
                  {address.isDefault && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-brand-700">
                      <CheckCircle2 className="w-3.5 h-3.5 fill-brand-subtle" />{" "}
                      Default
                    </span>
                  )}
                </div>

                {/* Identity & Details */}
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                    <User className="w-3.5 h-3.5 text-muted-foreground" />{" "}
                    {address.fullName}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-muted-foreground" />{" "}
                    {address.phoneNumber}
                  </div>
                  <div className="flex items-start gap-2 pt-1 leading-relaxed">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      {address.streetAddress}, <br />
                      {address.area}, {address.district}, {address.division}
                      {address.postalCode && ` - ${address.postalCode}`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="flex items-center justify-between border-t border-border-default pt-4 mt-5">
                {!address.isDefault ? (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="text-xs font-semibold text-muted-foreground hover:text-brand-700 transition cursor-pointer"
                  >
                    Set as Default
                  </button>
                ) : (
                  <div className="text-[11px] font-medium text-brand-700">
                    Primary delivery option
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenModal(address)}
                    className="p-1.5 border border-border-default rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
                    title="Edit Address"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setDeleteModalOpen(true);
                      setDeletingAddressId(address.id);
                    }}
                    className="p-1.5 border border-border-default rounded-lg text-muted-foreground hover:text-danger hover:border-danger/30 hover:bg-danger/5 transition cursor-pointer"
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
        key={formVersion}
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
