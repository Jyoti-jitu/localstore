"use client";

import React from "react";
import { ArrowDownUp } from "lucide-react";

export default function SortDropdown({ sortBy, onSortChange }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-neutral-500 font-medium hidden sm:inline flex items-center gap-1">
        <ArrowDownUp className="w-3.5 h-3.5" />
        <span>Sort by:</span>
      </span>
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-800 hover:border-neutral-300 focus:outline-none focus:border-emerald-600 transition-colors cursor-pointer shadow-xs"
      >
        <option value="distance">Nearest First</option>
        <option value="rating">Highest Rated</option>
        <option value="delivery">Fastest Delivery</option>
        <option value="products">Most Products</option>
      </select>
    </div>
  );
}
