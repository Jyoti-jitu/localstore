"use client";

import React from "react";
import { Plus, Minus } from "lucide-react";

export default function ProductQuantityControl({
  quantity = 0,
  onIncrement,
  onDecrement,
  size = "md",
  className = ""
}) {
  const isSmall = size === "sm";

  if (quantity === 0) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onIncrement();
        }}
        className={`inline-flex items-center justify-center gap-1 font-semibold rounded-xl transition-all active:scale-95 shadow-xs ${
          isSmall
            ? "px-2.5 py-1 text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200"
            : "px-3.5 py-1.5 text-xs sm:text-sm bg-white hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-600 shadow-xs"
        } ${className}`}
      >
        <Plus className={isSmall ? "w-3 h-3" : "w-3.5 h-3.5"} />
        <span>Add</span>
      </button>
    );
  }

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className={`inline-flex items-center justify-between rounded-xl bg-emerald-600 text-white font-bold shadow-xs select-none ${
        isSmall ? "h-7 px-1 text-xs gap-1.5" : "h-8 sm:h-9 px-1.5 text-xs sm:text-sm gap-2"
      } ${className}`}
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDecrement();
        }}
        aria-label="Decrease quantity"
        className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center hover:bg-emerald-700 active:scale-90 transition-colors"
      >
        <Minus className={isSmall ? "w-3 h-3" : "w-3.5 h-3.5"} />
      </button>
      <span className="min-w-[16px] text-center font-bold tracking-tight">
        {quantity}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onIncrement();
        }}
        aria-label="Increase quantity"
        className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center hover:bg-emerald-700 active:scale-90 transition-colors"
      >
        <Plus className={isSmall ? "w-3 h-3" : "w-3.5 h-3.5"} />
      </button>
    </div>
  );
}
