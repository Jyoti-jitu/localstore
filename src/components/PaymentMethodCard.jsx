"use client";

import React from "react";
import { Smartphone, CreditCard, Landmark, Banknote, Check } from "lucide-react";

export default function PaymentMethodCard({
  method,
  isSelected,
  onSelect,
  details
}) {
  const getIcon = () => {
    switch (method.id) {
      case "upi":
        return <Smartphone className="w-5 h-5 text-emerald-600" />;
      case "card":
        return <CreditCard className="w-5 h-5 text-blue-600" />;
      case "netbanking":
        return <Landmark className="w-5 h-5 text-indigo-600" />;
      case "cod":
        return <Banknote className="w-5 h-5 text-amber-600" />;
      default:
        return <CreditCard className="w-5 h-5 text-neutral-600" />;
    }
  };

  return (
    <div
      onClick={() => onSelect(method.id)}
      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
        isSelected
          ? "bg-emerald-50/50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs"
          : "bg-white border-neutral-200 hover:border-neutral-300"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-neutral-100 flex-shrink-0">
            {getIcon()}
          </div>
          <div>
            <div className="font-bold text-sm text-neutral-900">{method.title}</div>
            <p className="text-xs text-neutral-500 mt-0.5">{method.subtitle}</p>
          </div>
        </div>

        <div
          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
            isSelected
              ? "border-emerald-600 bg-emerald-600 text-white"
              : "border-neutral-300 bg-white"
          }`}
        >
          {isSelected && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
        </div>
      </div>

      {isSelected && details && (
        <div className="mt-3 pt-3 border-t border-emerald-100 text-xs">
          {details}
        </div>
      )}
    </div>
  );
}
