"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLocation } from "@/context/LocationContext";
import { useShops, useCategories } from "@/hooks/useSupabaseData";
import StoreCard from "@/components/StoreCard";
import FilterPanel from "@/components/FilterPanel";
import SortDropdown from "@/components/SortDropdown";
import BottomSheet from "@/components/BottomSheet";
import EmptyState from "@/components/EmptyState";
import { StoreSkeleton } from "@/components/LoadingSkeleton";
import { SlidersHorizontal, MapPin, Store, Check } from "lucide-react";

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const { city, currentLocality, openModal } = useLocation();
  const { shops, loading: shopsLoading } = useShops();
  const { categories } = useCategories();

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedDistance, setSelectedDistance] = useState(10.0);
  const [minRating, setMinRating] = useState(0);
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [maxDeliveryTime, setMaxDeliveryTime] = useState(60);
  const [sortBy, setSortBy] = useState("distance");

  // Mobile Bottom Sheet State
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedDistance(10.0);
    setMinRating(0);
    setOnlyOpen(false);
    setMaxDeliveryTime(60);
    setSortBy("distance");
  };

  // Filter & Sort Logic
  const filteredShops = useMemo(() => {
    return (shops || []).filter((shop) => {
      // Category filter
      if (selectedCategory !== "all") {
        const catObj = (categories || []).find((c) => c.id === selectedCategory);
        if (
          catObj &&
          shop.category.toLowerCase() !== catObj.name.toLowerCase() &&
          shop.category.toLowerCase() !== catObj.id.toLowerCase()
        ) {
          return false;
        }
      }

      // Distance filter
      if (shop.distanceKm > selectedDistance) return false;

      // Rating filter
      if (minRating > 0 && shop.rating < minRating) return false;

      // Open now filter
      if (onlyOpen && !shop.isOpen) return false;

      // Delivery time filter (approximate numeric parse from deliveryTime "25–35 min")
      if (maxDeliveryTime < 60) {
        const timeDigits = parseInt(shop.deliveryTime) || 30;
        if (timeDigits > maxDeliveryTime) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "delivery") return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
      if (sortBy === "products") return b.productCount - a.productCount;
      return a.distanceKm - b.distanceKm; // default distance
    });
  }, [shops, categories, selectedCategory, selectedDistance, minRating, onlyOpen, maxDeliveryTime, sortBy]);

  return (
    <div className="min-h-screen bg-[#fbfbfb] py-3 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/80 p-3.5 sm:p-7 shadow-xs mb-3.5 sm:mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-700 mb-0.5">
                <Store className="w-3.5 h-3.5" />
                <span>Hyperlocal Directory</span>
              </div>
              <h1 className="text-lg sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                Explore Local Stores
              </h1>
              <p className="text-[11px] sm:text-sm text-neutral-500 mt-0.5">
                Neighborhood shops in {currentLocality?.name || "Bhubaneswar"}, {city}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={openModal}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-[11px] sm:text-xs font-semibold text-neutral-800 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Change Locality ({currentLocality?.name || "Select Area"})</span>
              </button>
            </div>
          </div>

          {/* Quick Category Bar */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pt-3 border-t border-neutral-100 mt-3 sm:pt-5 sm:mt-5">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-semibold flex-shrink-0 transition-colors ${
                selectedCategory === "all"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
              }`}
            >
              All Stores
            </button>
            {(categories || []).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content Layout: Desktop Filter Sidebar + Main Store Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block bg-white p-5 rounded-3xl border border-neutral-200/80 shadow-xs sticky top-24">
            <FilterPanel
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedDistance={selectedDistance}
              onSelectDistance={setSelectedDistance}
              minRating={minRating}
              onSelectMinRating={setMinRating}
              onlyOpen={onlyOpen}
              onToggleOnlyOpen={setOnlyOpen}
              maxDeliveryTime={maxDeliveryTime}
              onSelectMaxDeliveryTime={setMaxDeliveryTime}
              onResetFilters={resetFilters}
            />
          </div>

          {/* Main Store Results */}
          <div className="lg:col-span-3 space-y-4">
            {/* Control Bar: Count + Mobile Filter Button + Sort Dropdown */}
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-neutral-200/80 shadow-xs flex items-center justify-between gap-3">
              <div className="text-xs sm:text-sm font-semibold text-neutral-700">
                Showing <span className="text-emerald-700 font-bold">{filteredShops.length}</span> shops
              </div>

              <div className="flex items-center gap-2">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setIsFilterSheetOpen(true)}
                  className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-semibold transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filter & Sort</span>
                </button>

                {/* Sort Dropdown */}
                <SortDropdown sortBy={sortBy} onSortChange={setSortBy} />
              </div>
            </div>

            {/* Results Grid or Empty State */}
            {filteredShops.length === 0 ? (
              <EmptyState
                type="stores"
                title="No neighborhood shops match your criteria"
                description="Try loosening your distance, category, or rating filters to see more local businesses."
                actionLabel="Reset All Filters"
                onAction={resetFilters}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredShops.map((shop) => (
                  <StoreCard key={shop.id} shop={shop} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile BottomSheet Filter Drawer */}
      <BottomSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        title="Filter & Refine Shops"
      >
        <FilterPanel
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedDistance={selectedDistance}
          onSelectDistance={setSelectedDistance}
          minRating={minRating}
          onSelectMinRating={setMinRating}
          onlyOpen={onlyOpen}
          onToggleOnlyOpen={setOnlyOpen}
          maxDeliveryTime={maxDeliveryTime}
          onSelectMaxDeliveryTime={setMaxDeliveryTime}
          onResetFilters={resetFilters}
        />
        <div className="pt-4 mt-4 border-t border-neutral-100">
          <button
            onClick={() => setIsFilterSheetOpen(false)}
            className="w-full py-3 bg-emerald-600 text-white font-bold text-sm rounded-xl shadow-xs"
          >
            Apply Filters ({filteredShops.length} Shops Found)
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fbfbfb] py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="h-40 bg-neutral-200 rounded-3xl animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <StoreSkeleton />
              <StoreSkeleton />
              <StoreSkeleton />
            </div>
          </div>
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
