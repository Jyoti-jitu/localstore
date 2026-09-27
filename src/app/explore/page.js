"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import NextLink from "next/link";
import { useSearchParams } from "next/navigation";
import { useLocation } from "@/context/LocationContext";
import { useShops, useProducts, useCategories } from "@/hooks/useSupabaseData";
import StoreCard from "@/components/StoreCard";
import ProductCard from "@/components/ProductCard";
import FilterPanel from "@/components/FilterPanel";
import SortDropdown from "@/components/SortDropdown";
import BottomSheet from "@/components/BottomSheet";
import EmptyState from "@/components/EmptyState";
import { StoreSkeleton, ProductSkeleton } from "@/components/LoadingSkeleton";
import { SlidersHorizontal, MapPin, Store, Check, Sparkles, ShoppingBag, Flame, TrendingUp } from "lucide-react";

function ExploreContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || "all";
  const viewParam = searchParams.get("view") || searchParams.get("tab");

  const { city, currentLocality, openModal } = useLocation();
  const { shops, loading: shopsLoading } = useShops();
  const { products, loading: productsLoading } = useProducts();
  const { categories } = useCategories();

  // Active view: 'stores' | 'products' | 'popular' (defaults to 'stores' when visiting /explore or clicking View all shops)
  const [activeView, setActiveView] = useState(
    viewParam === "products" ? "products" : viewParam === "popular" ? "popular" : "stores"
  );

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);

  // Sync state if URL search query changes
  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    if (viewParam) {
      setActiveView(
        viewParam === "products"
          ? "products"
          : viewParam === "popular"
          ? "popular"
          : "stores"
      );
    } else {
      setActiveView("stores");
    }
  }, [viewParam]);

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

  const catObj = useMemo(() => {
    if (selectedCategory === "all") return null;
    return (categories || []).find(
      (c) => c.id === selectedCategory || c.name.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [categories, selectedCategory]);

  // Filter & Sort Logic for Shops
  const filteredShops = useMemo(() => {
    return (shops || []).filter((shop) => {
      // Category filter
      if (selectedCategory !== "all") {
        if (catObj) {
          const targetId = catObj.id.toLowerCase();
          const targetName = catObj.name.toLowerCase();
          const shopCat = (shop.category || "").toLowerCase();
          const shopSlug = (shop.category_slug || "").toLowerCase();
          const matches =
            shopCat.includes(targetName) ||
            shopCat.includes(targetId) ||
            shopSlug.includes(targetId) ||
            (shop.catalogCategories || []).some(
              (c) => c.toLowerCase().includes(targetName) || c.toLowerCase().includes(targetId)
            );
          if (!matches) return false;
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
  }, [shops, catObj, selectedCategory, selectedDistance, minRating, onlyOpen, maxDeliveryTime, sortBy]);

  // Filter & Sort Logic for Products
  const filteredProducts = useMemo(() => {
    return (products || []).filter((product) => {
      // If popular view, filter for high sales in last month or popular flag
      if (activeView === "popular") {
        const hasHighSales = product.popular || (product.salesLastMonth && product.salesLastMonth >= 100);
        if (!hasHighSales) return false;
      }

      // Category filter
      if (selectedCategory !== "all") {
        if (catObj) {
          const targetId = catObj.id.toLowerCase();
          const targetName = catObj.name.toLowerCase();
          const pCat = (product.category || "").toLowerCase();
          const pStoreCat = (product.storeCategory || "").toLowerCase();
          const matches =
            pCat.includes(targetName) ||
            pCat.includes(targetId) ||
            pStoreCat.includes(targetName) ||
            pStoreCat.includes(targetId);
          if (!matches) return false;
        }
      }

      // Rating filter
      if (minRating > 0 && (product.rating || 4.5) < minRating) return false;

      // In-stock filter
      if (onlyOpen && product.inStock === false) return false;

      return true;
    }).sort((a, b) => {
      if (activeView === "popular") {
        if (sortBy === "rating") return (b.rating || 4.5) - (a.rating || 4.5);
        return (b.salesLastMonth || 0) - (a.salesLastMonth || 0);
      }
      if (sortBy === "rating") return (b.rating || 4.5) - (a.rating || 4.5);
      // Default: newly added products first
      const timeA = new Date(a.createdAt || 0).getTime();
      const timeB = new Date(b.createdAt || 0).getTime();
      if (timeB !== timeA) return timeB - timeA;
      return (b.salesLastMonth || 0) - (a.salesLastMonth || 0);
    });
  }, [products, catObj, selectedCategory, minRating, onlyOpen, sortBy, activeView]);

  return (
    <div className="min-h-screen bg-[#fbfbfb] py-3 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/80 p-3.5 sm:p-7 shadow-xs mb-3.5 sm:mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-700 mb-0.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hyperlocal Catalog</span>
              </div>
              <h1 className="text-lg sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                {activeView === "popular"
                  ? "Popular Near You — High Sales Last Month"
                  : activeView === "products"
                  ? "All Products Available"
                  : `All ${shops.length} Local Stores in ${city}`}
              </h1>
              <p className="text-[11px] sm:text-sm text-neutral-500 mt-0.5">
                {activeView === "popular"
                  ? `Top-selling items with high monthly order velocity from stores in ${currentLocality?.name || "Jayadev Vihar"}, ${city}`
                  : activeView === "products"
                  ? `Fresh items and neighborhood merchants in ${currentLocality?.name || "Bhubaneswar"}, ${city}`
                  : `Discover all ${shops.length} verified neighborhood merchants delivering across ${city}`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={openModal}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-[11px] sm:text-xs font-semibold text-neutral-800 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Area: {currentLocality?.name || "Jayadev Vihar"}, {city}</span>
              </button>
            </div>
          </div>

          {/* Quick Category Bar with Real Photos */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-3 border-t border-neutral-100 mt-3 sm:pt-4 sm:mt-4 pb-1">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold flex-shrink-0 transition-all ${
                selectedCategory === "all"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>All {activeView === "products" ? "Products" : "Stores"}</span>
            </button>
            {(categories || []).map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-2 pl-1 pr-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 transition-all ${
                    isSelected
                      ? "bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-500/20 scale-105"
                      : "bg-neutral-100/90 hover:bg-neutral-200/90 text-neutral-800 border border-neutral-200/60"
                  }`}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover shadow-2xs border border-white"
                    loading="lazy"
                  />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Category Real Photo Banner */}
        {catObj && (
          <div className="relative mb-5 rounded-3xl overflow-hidden border border-neutral-200/90 shadow-sm bg-neutral-900 text-white">
            <div className="absolute inset-0">
              <img
                src={catObj.image}
                alt={catObj.name}
                className="w-full h-full object-cover object-center opacity-40 scale-105 transition-transform duration-700 hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-900/70 to-transparent" />
            </div>

            <div className="relative p-5 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/15 backdrop-blur-md text-emerald-300 border border-white/20">
                  <Sparkles className="w-3 h-3 text-emerald-300" />
                  <span>{catObj.label || "Category Directory"}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {catObj.name}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
                  {catObj.description}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
                  <div className="text-lg font-black text-white">
                    {activeView === "products" ? filteredProducts.length : filteredShops.length}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-neutral-300">
                    {activeView === "products" ? "Products Found" : "Shops Available"}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="px-4 py-2.5 rounded-2xl bg-white hover:bg-neutral-100 text-neutral-900 text-xs font-bold transition-all shadow-xs"
                >
                  View All
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Layout: Desktop Filter Sidebar + Main Store/Product Grid */}
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

          {/* Main Results Section */}
          <div className="lg:col-span-3 space-y-4">
            {/* Control Bar: View Switcher (All Products vs Stores) + Filter + Sort */}
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
              {/* Tab Switcher: Stores vs Products vs Popular */}
              <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setActiveView("stores")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-bold transition-all flex-shrink-0 ${
                    activeView === "stores"
                      ? "bg-white text-emerald-800 shadow-xs scale-102"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>All Stores ({filteredShops.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveView("products")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-bold transition-all flex-shrink-0 ${
                    activeView === "products"
                      ? "bg-white text-emerald-800 shadow-xs scale-102"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>All Products</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveView("popular")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-bold transition-all flex-shrink-0 ${
                    activeView === "popular"
                      ? "bg-orange-500 text-white shadow-xs scale-102"
                      : "text-neutral-600 hover:text-orange-700"
                  }`}
                >
                  <Flame className={`w-3.5 h-3.5 ${activeView === "popular" ? "text-amber-200 fill-amber-200" : "text-orange-500"}`} />
                  <span>Popular (High Sales)</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setIsFilterSheetOpen(true)}
                  className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-semibold transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filter</span>
                </button>

                {/* Sort Dropdown */}
                <SortDropdown sortBy={sortBy} onSortChange={setSortBy} />
              </div>
            </div>

            {/* Results Grid: Products or Popular or Stores */}
            {activeView === "products" || activeView === "popular" ? (
              <>
                {activeView === "popular" && (
                  <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 rounded-2xl p-4 text-white shadow-xs flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-white/20 backdrop-blur-xs flex-shrink-0">
                        <Flame className="w-5 h-5 text-amber-200 fill-amber-200" />
                      </div>
                      <div>
                        <div className="text-sm font-black">Popular Near You — High Sales in Last Month</div>
                        <div className="text-xs text-amber-100 font-medium">
                          Showing top-velocity items with verified customer demand and repeat sales over the last 30 days.
                        </div>
                      </div>
                    </div>
                    <NextLink
                      href="/popular"
                      className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white text-orange-800 text-xs font-black shadow-xs hover:bg-amber-50 transition-colors flex-shrink-0"
                    >
                      <span>Leaderboard View</span>
                      <TrendingUp className="w-3 h-3 text-orange-700" />
                    </NextLink>
                  </div>
                )}

                {productsLoading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
                    {Array.from({ length: 8 }).map((_, idx) => (
                      <ProductSkeleton key={idx} />
                    ))}
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <EmptyState
                    type="products"
                    title={activeView === "popular" ? "No popular products found in this category" : "No products found in this category"}
                    description="Try selecting 'All Products' or clearing your filter criteria."
                    actionLabel="Show All Products"
                    onAction={resetFilters}
                  />
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} showShop={true} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              shopsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <StoreSkeleton key={idx} />
                  ))}
                </div>
              ) : filteredShops.length === 0 ? (
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
              )
            )}
          </div>
        </div>
      </div>

      {/* Mobile BottomSheet Filter Drawer */}
      <BottomSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        title="Filter & Refine"
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
            Apply Filters ({activeView === "products" ? `${filteredProducts.length} Products` : `${filteredShops.length} Shops`})
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <ProductSkeleton />
              <ProductSkeleton />
              <ProductSkeleton />
              <ProductSkeleton />
            </div>
          </div>
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
