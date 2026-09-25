"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import { useLocation } from "@/context/LocationContext";
import { useAddresses } from "@/hooks/useSupabaseData";
import { createAddress, deleteAddress as deleteSupabaseAddress } from "@/lib/supabase/db";
import AddressCard from "@/components/AddressCard";
import Modal from "@/components/Modal";
import { useToast } from "@/context/ToastContext";
import { MapPin, Plus, ChevronLeft, Loader2 } from "lucide-react";

export default function AddressesPage() {
  const { localities } = useLocation();
  const locList = localities || [];

  const { addresses, setAddresses, loading } = useAddresses();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLabel, setNewLabel] = useState("Home");
  const [newStreet, setNewStreet] = useState("");
  const [newLocality, setNewLocality] = useState("Jayadev Vihar");
  const { showToast } = useToast();

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newStreet.trim()) return;

    const newAddr = {
      id: `addr-${Date.now()}`,
      label: newLabel,
      isDefault: addresses.length === 0,
      recipient: "Rahul Mohapatra",
      phone: "+91 98610 54321",
      street: newStreet,
      locality: newLocality || (locList[0]?.name || "Jayadev Vihar"),
      city: "Bhubaneswar",
      pincode: "751013"
    };

    setAddresses([newAddr, ...addresses]);
    setIsModalOpen(false);
    setNewStreet("");
    showToast("Address saved successfully!");

    try {
      await createAddress(newAddr);
    } catch (err) {
      console.error("Failed to save address to Supabase:", err);
    }
  };

  const handleDeleteAddress = async (id) => {
    setAddresses(addresses.filter((a) => a.id !== id));
    showToast("Address removed.");
    try {
      await deleteSupabaseAddress(id);
    } catch (err) {
      console.error("Failed to delete address from Supabase:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfb] py-3 sm:py-8 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-3.5 sm:space-y-6">
        {/* Back and Header */}
        <div>
          <NextLink
            href="/account"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 mb-1 sm:mb-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Account</span>
          </NextLink>

          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-700 mb-0.5 sm:mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Delivery Locations</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                Saved Addresses
              </h1>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Address</span>
            </button>
          </div>
        </div>

        {/* Address Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              selectable={false}
              onDelete={handleDeleteAddress}
            />
          ))}
        </div>
      </div>

      {/* Add Address Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Delivery Address"
        subtitle="Save a new delivery address in Bhubaneswar"
      >
        <form onSubmit={handleAddAddress} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
              Label
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["Home", "Office", "Other"].map((lbl) => (
                <button
                  key={lbl}
                  type="button"
                  onClick={() => setNewLabel(lbl)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-colors ${
                    newLabel === lbl
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100"
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
              Locality
            </label>
            <select
              value={newLocality}
              onChange={(e) => setNewLocality(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-600"
            >
              {locList.map((loc) => (
                <option key={loc.id} value={loc.name}>
                  {loc.name} ({loc.landmark})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
              Address Details
            </label>
            <textarea
              required
              rows={3}
              value={newStreet}
              onChange={(e) => setNewStreet(e.target.value)}
              placeholder="Flat / Floor number, building name, landmark..."
              className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Save Address
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
