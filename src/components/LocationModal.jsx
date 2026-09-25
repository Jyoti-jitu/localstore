"use client";

import React, { useState } from "react";
import { useLocation } from "@/context/LocationContext";
import { MapPin, Navigation, Search, Check, X, Building2 } from "lucide-react";

export default function LocationModal() {
  const {
    city,
    currentLocality,
    localities,
    isModalOpen,
    closeModal,
    selectLocality,
    detectLocation,
    isDetecting
  } = useLocation();

  const [searchQuery, setSearchQuery] = useState("");

  if (!isModalOpen) return null;

  const filtered = localities.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.landmark.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-neutral-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-neutral-900 text-lg">Select Your Location</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Explore stores and products delivering in {city}
            </p>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Detect location button */}
        <div className="p-4 bg-emerald-50/60 border-b border-emerald-100">
          <button
            onClick={detectLocation}
            disabled={isDetecting}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-colors shadow-xs disabled:opacity-70"
          >
            <Navigation className={`w-4 h-4 ${isDetecting ? "animate-spin" : ""}`} />
            <span>{isDetecting ? "Detecting your location..." : "Detect Current Location"}</span>
          </button>
        </div>

        {/* Search input */}
        <div className="p-4 border-b border-neutral-100">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search area, landmark or neighborhood..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Localities list */}
        <div className="p-3 overflow-y-auto custom-scrollbar flex-1 divide-y divide-neutral-100">
          <div className="px-2 py-1 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Popular Neighborhoods in {city}
          </div>
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-neutral-500">
              No matching locations found in {city}.
            </div>
          ) : (
            filtered.map((loc) => {
              const isSelected = currentLocality?.id === loc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => selectLocality(loc)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors ${
                    isSelected
                      ? "bg-emerald-50 text-emerald-950 font-medium"
                      : "hover:bg-neutral-50 text-neutral-800"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg mt-0.5 ${
                        isSelected
                          ? "bg-emerald-600 text-white"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-semibold">{loc.name}</div>
                        {loc.distanceText && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            {loc.distanceText}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-neutral-400" />
                        <span>{loc.landmark}</span>
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="flex items-center text-emerald-600">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
