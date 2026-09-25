"use client";

import React from "react";
import { Star, Clock, MapPin, Check, RotateCcw } from "lucide-react";
import { useCategories } from "@/hooks/useSupabaseData";

export default function FilterPanel({
  selectedCategory,
  onSelectCategory,
  selectedDistance,
  onSelectDistance,
  minRating,
  onSelectMinRating,
  onlyOpen,
  onToggleOnlyOpen,
  maxDeliveryTime,
  onSelectMaxDeliveryTime,
  onResetFilters
}) {
  const { categories } = useCategories();
  const catList = categories || [];

  return (
    <div className="space-y-6 text-sm text-neutral-800">
      {/* Header with Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
        <h4 className="font-bold text-neutral-900 text-sm">Filters & Refinements</h4>
        <button
          onClick={onResetFilters}
          className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2.5">
          Store Category
        </label>
        <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar pr-1">
          <button
            onClick={() => onSelectCategory("all")}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors ${
              selectedCategory === "all"
                ? "bg-emerald-50 text-emerald-800 font-bold"
                : "hover:bg-neutral-100 text-neutral-700"
            }`}
          >
            <span>All Categories</span>
            {selectedCategory === "all" && <Check className="w-3.5 h-3.5 text-emerald-600" />}
          </button>
          {catList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors ${
                selectedCategory === cat.id
                  ? "bg-emerald-50 text-emerald-800 font-bold"
                  : "hover:bg-neutral-100 text-neutral-700"
              }`}
            >
              <span>{cat.name}</span>
              {selectedCategory === cat.id && <Check className="w-3.5 h-3.5 text-emerald-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Distance Filter */}
      <div>
        <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span>Maximum Distance</span>
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { label: "Within 1 km", value: 1.0 },
            { label: "Within 2 km", value: 2.0 },
            { label: "Within 4 km", value: 4.0 },
            { label: "Any Distance", value: 10.0 }
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => onSelectDistance(item.value)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-center transition-colors ${
                selectedDistance === item.value
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Store Rating</span>
        </label>
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: "All", value: 0 },
            { label: "4.0+", value: 4.0 },
            { label: "4.5+", value: 4.5 },
            { label: "4.8+", value: 4.8 }
          ].map((r) => (
            <button
              key={r.label}
              onClick={() => onSelectMinRating(r.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                minRating === r.value
                  ? "bg-amber-50 text-amber-900 border-amber-400"
                  : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Delivery Time */}
      <div>
        <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-neutral-600" />
          <span>Delivery Speed</span>
        </label>
        <div className="space-y-1.5">
          {[
            { label: "Fastest (< 25 mins)", value: 25 },
            { label: "Under 35 mins", value: 35 },
            { label: "Any time", value: 60 }
          ].map((t) => (
            <button
              key={t.label}
              onClick={() => onSelectMaxDeliveryTime(t.value)}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium border text-left transition-colors ${
                maxDeliveryTime === t.value
                  ? "bg-emerald-50 text-emerald-800 border-emerald-400 font-semibold"
                  : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300"
              }`}
            >
              <span>{t.label}</span>
              {maxDeliveryTime === t.value && <Check className="w-3.5 h-3.5 text-emerald-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Open Now Toggle */}
      <div className="pt-2 border-t border-neutral-100">
        <label className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 hover:bg-neutral-100/80 cursor-pointer transition-colors">
          <div>
            <div className="font-semibold text-xs text-neutral-900">Open Now Only</div>
            <div className="text-[11px] text-neutral-500">Show only stores currently accepting orders</div>
          </div>
          <input
            type="checkbox"
            checked={onlyOpen}
            onChange={(e) => onToggleOnlyOpen(e.target.checked)}
            className="w-4 h-4 text-emerald-600 rounded border-neutral-300 focus:ring-emerald-500 cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
}
