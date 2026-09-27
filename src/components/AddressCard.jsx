"use client";

import React from "react";
import { MapPin, Home, Briefcase, Users, Check, Trash2, Pencil } from "lucide-react";

export default function AddressCard({
  address,
  isSelected = false,
  onSelect,
  onDelete,
  onEdit,
  selectable = true
}) {
  const getIcon = (label) => {
    switch (label?.toLowerCase()) {
      case "home":
        return <Home className="w-4 h-4 text-emerald-600" />;
      case "office":
      case "work":
        return <Briefcase className="w-4 h-4 text-blue-600" />;
      default:
        return <Users className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div
      onClick={selectable && onSelect ? () => onSelect(address) : undefined}
      className={`relative p-4 rounded-2xl border transition-all ${
        selectable ? "cursor-pointer" : ""
      } ${
        isSelected
          ? "bg-emerald-50/50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs"
          : "bg-white border-neutral-200 hover:border-neutral-300"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-neutral-100 mt-0.5">
            {getIcon(address.label)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-neutral-900">
                {address.label}
              </span>
              {address.isDefault && (
                <span className="text-[10px] bg-neutral-200 text-neutral-800 font-semibold px-2 py-0.5 rounded-full">
                  Default
                </span>
              )}
            </div>

            <div className="text-xs font-semibold text-neutral-700 mt-1">
              {address.recipient} · {address.phone}
            </div>

            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              {address.street}, {address.locality}, {address.city} - {address.pincode}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectable && (
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                isSelected
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-neutral-300 bg-white"
              }`}
            >
              {isSelected && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
            </div>
          )}

          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(address);
              }}
              className="p-1.5 text-neutral-400 hover:text-emerald-600 rounded-lg transition-colors"
              title="Edit address"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}

          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(address.id);
              }}
              className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg transition-colors"
              title="Delete address"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
