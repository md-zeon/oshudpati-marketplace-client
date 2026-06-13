"use client";

import React, { useEffect } from "react";
import { MapPin, NotepadText, CreditCard } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Address } from "@/types";
import useCheckout from "../_hooks/useCheckout";

export function AddressSection({
  savedAddresses,
}: {
  savedAddresses: Address[];
}) {
  const {
    selectedAddressId,
    setSelectedAddressId,
    isCustomAddress,
    setIsCustomAddress,
    customerNote,
    setCustomerNote,
    customAddress,
    setCustomAddress,
  } = useCheckout();

  useEffect(() => {
    if (savedAddresses.length > 0 && !selectedAddressId) {
      const defaultAddr = savedAddresses.find((addr) => addr.isDefault);
      setSelectedAddressId(defaultAddr ? defaultAddr.id : savedAddresses[0].id);
    } else if (savedAddresses.length === 0) {
      setIsCustomAddress(true);
    }
  }, [
    savedAddresses,
    selectedAddressId,
    setSelectedAddressId,
    setIsCustomAddress,
  ]);

  return (
    <div className="space-y-6">
      {/* 1. Delivery Address Selection Option block */}
      <Card className="bg-white p-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <h3 className="font-bold text-sm text-slate-800">
            Delivery Address Options
          </h3>
        </div>

        {savedAddresses.length > 0 && (
          <div className="mb-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Saved Addresses
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {savedAddresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => {
                    setIsCustomAddress(false);
                    setSelectedAddressId(addr.id);
                  }}
                  className={`p-4 border rounded-xl cursor-pointer text-left transition ${
                    !isCustomAddress && selectedAddressId === addr.id
                      ? "border-emerald-600 bg-emerald-50/10 ring-1 ring-emerald-600"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <p className="font-bold text-xs text-slate-900">
                    {addr.fullName}
                  </p>
                  <p className="text-slate-500 text-[11px] font-medium mt-0.5">
                    {addr.phoneNumber}
                  </p>
                  <p className="text-slate-400 text-[11px] mt-1 line-clamp-2">
                    {addr.streetAddress}, {addr.area}, {addr.district}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        {savedAddresses.length === 0 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
            No saved addresses found. Please enter a custom address below.
          </div>
        )}

        <div
          onClick={() => setIsCustomAddress(!isCustomAddress)}
          className={`p-4 border rounded-xl cursor-pointer transition flex items-center gap-3 mt-4 ${
            isCustomAddress
              ? "border-emerald-600 bg-emerald-50/10"
              : "border-slate-200 hover:bg-slate-50/50"
          }`}
        >
          <input
            type="checkbox"
            checked={isCustomAddress}
            readOnly
            className="rounded text-emerald-600 pointer-events-none focus:ring-0"
          />
          <div className="text-xs">
            <p className="font-bold text-slate-800">
              Ship to a different location address
            </p>
            <p className="text-slate-400 text-[10px]">
              Use a custom temporary destination snapshot for this order
            </p>
          </div>
        </div>

        {isCustomAddress && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 p-4 bg-slate-50/30 rounded-xl">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500">
                Full Name *
              </label>
              <Input
                value={customAddress.fullName}
                onChange={(e) =>
                  setCustomAddress({
                    ...customAddress,
                    fullName: e.target.value,
                  })
                }
                placeholder="Receiver's name"
                className="bg-white text-xs h-9"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500">
                Phone Number *
              </label>
              <Input
                value={customAddress.phoneNumber}
                onChange={(e) =>
                  setCustomAddress({
                    ...customAddress,
                    phoneNumber: e.target.value,
                  })
                }
                placeholder="Active contact no."
                className="bg-white text-xs h-9"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500">
                Division *
              </label>
              <Input
                value={customAddress.division}
                onChange={(e) =>
                  setCustomAddress({
                    ...customAddress,
                    division: e.target.value,
                  })
                }
                placeholder="e.g. Dhaka"
                className="bg-white text-xs h-9"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500">
                District *
              </label>
              <Input
                value={customAddress.district}
                onChange={(e) =>
                  setCustomAddress({
                    ...customAddress,
                    district: e.target.value,
                  })
                }
                placeholder="e.g. Gazipur"
                className="bg-white text-xs h-9"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500">
                Area / Thana *
              </label>
              <Input
                value={customAddress.area}
                onChange={(e) =>
                  setCustomAddress({ ...customAddress, area: e.target.value })
                }
                placeholder="e.g. Tongi"
                className="bg-white text-xs h-9"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500">
                Postal Code
              </label>
              <Input
                value={customAddress.postalCode}
                onChange={(e) =>
                  setCustomAddress({
                    ...customAddress,
                    postalCode: e.target.value,
                  })
                }
                placeholder="e.g. 1710"
                className="bg-white text-xs h-9"
              />
            </div>
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[11px] font-bold text-slate-500">
                Street Address Details *
              </label>
              <Input
                value={customAddress.streetAddress}
                onChange={(e) =>
                  setCustomAddress({
                    ...customAddress,
                    streetAddress: e.target.value,
                  })
                }
                placeholder="House, Road, Apartment info"
                className="bg-white text-xs h-9"
              />
            </div>
          </div>
        )}
      </Card>

      {/* Special Instructions Notes Card */}
      <Card className="rounded-xl bg-white p-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
          <NotepadText className="w-4 h-4 text-emerald-600" />
          <h3 className="font-bold text-sm text-slate-800">
            2. Special Dispatch Notes
          </h3>
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-500">
            Instructions for Delivery Personnel
          </label>
          <Input
            placeholder="e.g., Call before arrival, drop with guard house, etc."
            value={customerNote}
            onChange={(e) => setCustomerNote(e.target.value)}
            className="text-xs h-10"
          />
        </div>
      </Card>

      {/* Static Payment Method Showcase */}
      <Card className="rounded-xl bg-white p-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <CreditCard className="w-4 h-4 text-emerald-600" />
          <h3 className="font-bold text-sm text-slate-800">Payment Method</h3>
        </div>
        <div className="bg-emerald-50/20 p-4 rounded-xl flex items-center gap-3">
          <div className="bg-emerald-600 text-white font-black text-[9px] px-2 py-1 rounded tracking-wider uppercase">
            COD
          </div>
          <div className="text-xs">
            <p className="font-bold text-slate-800">Cash On Delivery</p>
            <p className="text-slate-400 text-[10px]">
              Verify package components first, then issue cash locally to
              courier agents.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
