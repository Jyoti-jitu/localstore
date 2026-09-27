"use client";

import React, { useState, useMemo } from "react";
import { useLocation } from "@/context/LocationContext";
import { useToast } from "@/context/ToastContext";
import {
  MapPin,
  Search,
  Check,
  X,
  Building2,
  Navigation,
  Compass,
  Sparkles,
  ChevronRight,
  Plus
} from "lucide-react";

const SUPPORTED_CITIES = [
  { id: "Bhubaneswar", name: "Bhubaneswar", tag: "Capital Hub" },
  { id: "Cuttack", name: "Cuttack", tag: "Silver City" },
  { id: "Puri", name: "Puri", tag: "Heritage Coastal" },
  { id: "Rourkela", name: "Rourkela", tag: "Steel City" }
];

const EXTENDED_LOCALITIES_BY_CITY = {
  Bhubaneswar: [
    { id: "jayadev-vihar", name: "Jayadev Vihar", landmark: "Near Pal Heights & Fortune Towers", distanceText: "0.8 km" },
    { id: "patia", name: "Patia", landmark: "Near KIIT Square & Infocity", distanceText: "4.2 km" },
    { id: "saheed-nagar", name: "Saheed Nagar", landmark: "Near Sparsh Hospital & Maharshi College", distanceText: "2.8 km" },
    { id: "nayapalli", name: "Nayapalli", landmark: "Near IRC Village & Behera Sahi", distanceText: "1.6 km" },
    { id: "chandrasekharpur", name: "Chandrasekharpur", landmark: "Near Damana Square & Sailashree Vihar", distanceText: "3.5 km" },
    { id: "khandagiri", name: "Khandagiri", landmark: "Near Udayagiri Caves & Jagamara", distanceText: "5.1 km" },
    { id: "master-canteen", name: "Master Canteen", landmark: "Railway Station Road & Unit 3", distanceText: "3.9 km" },
    { id: "sum-hospital", name: "SUM Hospital", landmark: "Kalinga Nagar & Ghatikia", distanceText: "3.8 km" },
    { id: "old-town", name: "Old Town", landmark: "Near Lingaraj Temple & Bindusagar", distanceText: "6.8 km" }
  ],
  Cuttack: [
    { id: "badambadi", name: "Badambadi", landmark: "Central Bus Terminal & Link Road", distanceText: "18.2 km" },
    { id: "cda-sec-6", name: "CDA Sector 6", landmark: "Near Biju Patnaik Park & Markat Nagar", distanceText: "21.5 km" },
    { id: "ranihat", name: "Ranihat", landmark: "Near SCB Medical College & Hospital", distanceText: "19.8 km" },
    { id: "college-square", name: "College Square", landmark: "Near Ravenshaw University", distanceText: "19.0 km" },
    { id: "madhupatna", name: "Madhupatna", landmark: "Near OMP Square & Flyover", distanceText: "17.4 km" }
  ],
  Puri: [
    { id: "grand-road", name: "Grand Road (Bada Danda)", landmark: "Near Jagannath Temple & Gundicha", distanceText: "56.0 km" },
    { id: "sea-beach-road", name: "Sea Beach Road", landmark: "Near Swargadwar & Marine Drive", distanceText: "58.2 km" },
    { id: "vip-road", name: "VIP Road", landmark: "Near Police Line & Hospital Square", distanceText: "55.4 km" }
  ],
  Rourkela: [
    { id: "civil-township", name: "Civil Township", landmark: "Near Panposh Road & Raghunathpali", distanceText: "310 km" },
    { id: "koel-nagar", name: "Koel Nagar", landmark: "Near NIT Rourkela Campus & Sector 2", distanceText: "314 km" },
    { id: "main-market", name: "Main Market (Sector 19)", landmark: "Near Daily Market & Municipal Complex", distanceText: "312 km" }
  ]
};

export default function LocationModal() {
  const {
    city,
    setCity,
    selectCity,
    currentLocality,
    localities: dbLocalities,
    isModalOpen,
    closeModal,
    selectLocality,
    detectLocation,
    isDetecting
  } = useLocation();

  const { showToast } = useToast();
  const [selectedCity, setSelectedCity] = useState(() => city || "Bhubaneswar");
  const [searchQuery, setSearchQuery] = useState("");

  if (!isModalOpen) return null;

  // Active pool of localities for selected city
  const cityPool = useMemo(() => {
    if (selectedCity === "Bhubaneswar" && dbLocalities && dbLocalities.length > 0) {
      return dbLocalities;
    }
    return EXTENDED_LOCALITIES_BY_CITY[selectedCity] || dbLocalities || [];
  }, [selectedCity, dbLocalities]);

  // Filtered by user search
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return cityPool;
    return cityPool.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        (l.landmark && l.landmark.toLowerCase().includes(q))
    );
  }, [cityPool, searchQuery]);

  const handleSelect = (loc) => {
    selectLocality(loc, selectedCity);
    showToast(`Delivery location set to ${loc.name}, ${selectedCity}`);
  };

  const handleCustomManualSelect = () => {
    if (!searchQuery.trim()) return;
    const customLoc = {
      id: `manual-${Date.now()}`,
      name: searchQuery.trim(),
      landmark: `Manually entered area in ${selectedCity}`,
      distanceText: "Delivery available"
    };
    selectLocality(customLoc, selectedCity);
    showToast(`Delivery location set to ${customLoc.name}, ${selectedCity}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-neutral-100 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/60">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              <Compass className="w-3.5 h-3.5" />
              <span>Manual Location Selector</span>
            </div>
            <h3 className="font-extrabold text-neutral-900 text-base sm:text-lg mt-0.5">
              Choose Your Delivery Area
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Select your neighborhood to explore local stores and products
            </p>
          </div>
          <button
            onClick={closeModal}
            className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* City Switcher Tabs */}
        <div className="px-4 sm:px-5 pt-3.5 pb-2 border-b border-neutral-100 bg-white">
          <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-2">
            1. Select City
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {SUPPORTED_CITIES.map((c) => {
              const isCityActive = selectedCity.toLowerCase() === c.name.toLowerCase();
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setSelectedCity(c.name);
                    if (selectCity) selectCity(c.name);
                    setSearchQuery("");
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                    isCityActive
                      ? "bg-emerald-600 text-white shadow-xs scale-102"
                      : "bg-neutral-100 hover:bg-neutral-200/80 text-neutral-700"
                  }`}
                >
                  <MapPin className={`w-3.5 h-3.5 ${isCityActive ? "text-white" : "text-neutral-500"}`} />
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Input */}
        <div className="p-4 sm:p-5 border-b border-neutral-100 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  if (filtered.length > 0) {
                    handleSelect(filtered[0]);
                  } else {
                    handleCustomManualSelect();
                  }
                }
              }}
              placeholder={`Search neighborhood, street, colony in ${selectedCity}...`}
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded-2xl focus:outline-none focus:border-emerald-600 focus:bg-white transition-all font-medium text-neutral-900 placeholder:text-neutral-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-0.5 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Localities List */}
        <div className="p-3 sm:p-4 overflow-y-auto custom-scrollbar flex-1 divide-y divide-neutral-100 space-y-1">
          <div className="px-2 py-1 text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
            <span>Neighborhoods in {selectedCity}</span>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
              {filtered.length} Areas Verified
            </span>
          </div>

          {/* Option to select custom typed area */}
          {searchQuery.trim().length > 1 && (
            <button
              type="button"
              onClick={handleCustomManualSelect}
              className="w-full mt-1.5 flex items-center justify-between p-3 rounded-2xl text-left bg-emerald-50/80 hover:bg-emerald-100/90 border border-emerald-200 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                    <span>Use &ldquo;{searchQuery.trim()}&rdquo;</span>
                  </div>
                  <div className="text-[11px] text-emerald-800">
                    Set this as your manual delivery area in {selectedCity}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}

          {filtered.length === 0 && !searchQuery.trim() ? (
            <div className="py-10 text-center text-xs text-neutral-500">
              No neighborhoods cataloged yet for {selectedCity}. Type your area above to set it manually.
            </div>
          ) : (
            filtered.map((loc) => {
              const isSelected =
                currentLocality?.id === loc.id ||
                (currentLocality?.name?.toLowerCase() === loc.name.toLowerCase() &&
                  city?.toLowerCase() === selectedCity.toLowerCase());

              return (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => handleSelect(loc)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-emerald-50/90 text-emerald-950 font-medium ring-1 ring-emerald-600/30"
                      : "hover:bg-neutral-50 text-neutral-800"
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-xl mt-0.5 flex-shrink-0 transition-colors ${
                        isSelected
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold truncate">
                          {loc.name}
                        </span>
                        {loc.distanceText && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full flex-shrink-0">
                            {loc.distanceText}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5 truncate">
                        <Building2 className="w-3 h-3 text-neutral-400 flex-shrink-0" />
                        <span className="truncate">{loc.landmark}</span>
                      </div>
                    </div>
                  </div>

                  {isSelected ? (
                    <div className="flex items-center gap-1 bg-emerald-600 text-white text-[11px] font-bold px-2 py-1 rounded-xl shadow-xs flex-shrink-0 ml-2">
                      <Check className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Active</span>
                    </div>
                  ) : (
                    <span className="text-neutral-300 group-hover:text-neutral-500 transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer: Subtle optional GPS fallback for users who explicitly ask for it */}
        <div className="p-3 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 px-4 sm:px-5">
          <span className="text-[11px]">
            Currently delivering to: <strong className="text-neutral-800 font-semibold">{currentLocality?.name || "Bhubaneswar"}</strong>
          </span>

          <button
            type="button"
            onClick={detectLocation}
            disabled={isDetecting}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-neutral-600 hover:text-emerald-700 transition-colors py-1 cursor-pointer"
          >
            <Navigation className={`w-3.5 h-3.5 text-neutral-400 ${isDetecting ? "animate-spin text-emerald-600" : ""}`} />
            <span>{isDetecting ? "Locating..." : "Use GPS fallback"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
