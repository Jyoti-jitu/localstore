"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import NextLink from "next/link";
import { useProducts, useShops, useCategories } from "@/hooks/useSupabaseData";
import ProductCard from "@/components/ProductCard";
import StoreCard from "@/components/StoreCard";
import EmptyState from "@/components/EmptyState";
import { ProductSkeleton } from "@/components/LoadingSkeleton";
import { Search, Store, ShoppingBag, X, ArrowLeft, SlidersHorizontal, Sparkles } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlQuery = searchParams.get("q") || "";

  // Live real-time search query
  const [searchTerm, setSearchTerm] = useState(urlQuery);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { products: allDbProducts, loading: productsLoading } = useProducts();
  const { shops: allDbShops, loading: shopsLoading } = useShops();
  const { categories } = useCategories();

  const productPool = useMemo(() => allDbProducts || [], [allDbProducts]);
  const shopPool = useMemo(() => allDbShops || [], [allDbShops]);

  // Sync state if URL query changes externally
  useEffect(() => {
    setSearchTerm(urlQuery);
  }, [urlQuery]);

  // Handle typing & backspacing in real time
  const handleSearchChange = (newVal) => {
    setSearchTerm(newVal);
    // Instant URL update without page reload
    if (!newVal.trim()) {
      router.replace("/search", { scroll: false });
    } else {
      router.replace(`/search?q=${encodeURIComponent(newVal)}`, { scroll: false });
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    router.replace("/search", { scroll: false });
  };

  // Allow backspace when already empty to navigate back
  const handleKeyDown = (e) => {
    if (e.key === "Backspace" && !searchTerm) {
      router.back();
    } else if (e.key === "Escape") {
      handleClear();
    }
  };

  // Filter products by query and category directly
  const matchedProducts = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return productPool.filter((p) => {
      // Category filter if active
      if (selectedCategory !== "all") {
        const cat = (p.category || "").toLowerCase();
        const storeCat = (p.storeCategory || "").toLowerCase();
        if (!cat.includes(selectedCategory.toLowerCase()) && !storeCat.includes(selectedCategory.toLowerCase())) {
          return false;
        }
      }

      // Query filter
      if (!q) return true; // Show all products when query is empty (e.g. backspaced)
      return (
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.storeCategory && p.storeCategory.toLowerCase().includes(q)) ||
        (p.shopName && p.shopName.toLowerCase().includes(q))
      );
    });
  }, [searchTerm, selectedCategory, productPool]);

  // Filter shops if user searches a store or brand
  const matchedShops = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const q = searchTerm.toLowerCase().trim();
    return shopPool.filter(
      (s) =>
        (s.name && s.name.toLowerCase().includes(q)) ||
        (s.category && s.category.toLowerCase().includes(q)) ||
        (s.categoryLabel && s.categoryLabel.toLowerCase().includes(q)) ||
        (s.locality && s.locality.toLowerCase().includes(q))
    );
  }, [searchTerm, shopPool]);

  return (
    <div className="min-h-screen bg-[#fbfbfb] py-3 sm:py-6 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-4">
        {/* Streamlined Live Search Bar & Action Strip */}
        <div className="bg-white rounded-2xl border border-neutral-200/90 p-3 sm:p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-1 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
              title="Go Back"
              aria-label="Go Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            {/* Direct Live Search Input (Backspace and Typing dynamically update results) */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search products, brands, or neighborhood stores..."
                autoFocus
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white border border-neutral-200 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-200/60 transition-colors"
                  aria-label="Clear search"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Product Count Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-bold text-neutral-700 flex-shrink-0">
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
              <span>{matchedProducts.length} {matchedProducts.length === 1 ? "Product" : "Products"}</span>
            </div>
          </div>

          {/* Quick Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-3 border-t border-neutral-100 mt-3 pb-0.5">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex-shrink-0 ${
                selectedCategory === "all"
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
              }`}
            >
              All Categories
            </button>
            {(categories || []).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? "all" : cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex-shrink-0 ${
                  selectedCategory === cat.id
                    ? "bg-emerald-600 text-white shadow-2xs"
                    : "bg-neutral-100/90 hover:bg-neutral-200 text-neutral-700 border border-neutral-200/60"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* DIRECT PRODUCT RESULTS */}
        {productsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : matchedProducts.length > 0 ? (
          <div className="space-y-6">
            {/* Direct Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {matchedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Matched Local Shops Section (if any shop matches the query) */}
            {matchedShops.length > 0 && searchTerm.trim() && (
              <div className="pt-6 border-t border-neutral-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm sm:text-base font-bold text-neutral-900 flex items-center gap-2">
                    <Store className="w-4 h-4 text-emerald-600" />
                    <span>Neighborhood Stores ({matchedShops.length})</span>
                  </h3>
                  <span className="text-xs text-neutral-500 font-medium">Order directly from local shops</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {matchedShops.map((shop) => (
                    <StoreCard key={shop.id} shop={shop} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Clean Empty State when no products match */
          <div className="bg-white rounded-3xl border border-neutral-200 p-8 text-center shadow-xs">
            <EmptyState
              type="search"
              title={`No products matching "${searchTerm}"`}
              description="We couldn't find any items matching your search. Try checking your spelling or clearing your search to see all neighborhood items."
              actionLabel="Show All Products"
              onAction={handleClear}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fbfbfb] py-6 max-w-7xl mx-auto px-4 space-y-4">
          <div className="h-16 bg-neutral-200 rounded-2xl animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
