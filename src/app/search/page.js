"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import NextLink from "next/link";
import { useProducts, useShops, useCategories, useSearchSuggestions } from "@/hooks/useSupabaseData";
import ProductCard from "@/components/ProductCard";
import StoreCard from "@/components/StoreCard";
import SearchBar from "@/components/SearchBar";
import EmptyState from "@/components/EmptyState";
import { ProductSkeleton } from "@/components/LoadingSkeleton";
import { Search, Store, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'products' | 'shops'

  const { products: allDbProducts } = useProducts();
  const { shops: allDbShops } = useShops();
  const { categories } = useCategories();
  const { suggestions: searchSuggestions } = useSearchSuggestions();

  const productPool = useMemo(() => allDbProducts || [], [allDbProducts]);
  const shopPool = useMemo(() => allDbShops || [], [allDbShops]);
  const suggestionsList = searchSuggestions || [];
  const catList = categories || [];

  // Filter products by query
  const matchedProducts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return productPool.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.storeCategory && p.storeCategory.toLowerCase().includes(q)) ||
        (p.shopName && p.shopName.toLowerCase().includes(q))
    );
  }, [query, productPool]);

  // Filter shops by name, category, or if they sell matched products
  const matchedShops = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    
    // Shops with matching name or category
    const directShops = shopPool.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.category && s.category.toLowerCase().includes(q)) ||
        (s.categoryLabel && s.categoryLabel.toLowerCase().includes(q)) ||
        (s.locality && s.locality.toLowerCase().includes(q))
    );

    // Shops that stock matching products
    const shopsWithMatchingProducts = matchedProducts.map((p) => p.shopId);
    const relatedShops = shopPool.filter((s) => shopsWithMatchingProducts.includes(s.id));

    // Combine unique
    const shopMap = new Map();
    [...directShops, ...relatedShops].forEach((s) => shopMap.set(s.id, s));
    return Array.from(shopMap.values());
  }, [query, matchedProducts, shopPool]);

  return (
    <div className="min-h-screen bg-[#fbfbfb] py-3 sm:py-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        {/* Search header container */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/80 p-3.5 sm:p-7 shadow-xs">
          <div className="max-w-2xl mx-auto space-y-2.5 sm:space-y-3">
            <h1 className="text-center text-base sm:text-2xl font-bold text-neutral-900">
              {query ? (
                <span>
                  Search results for &ldquo;<span className="text-emerald-700">{query}</span>&rdquo;
                </span>
              ) : (
                "Search Products & Neighborhood Shops"
              )}
            </h1>

            <SearchBar initialQuery={query} autoFocus={!query} />

            {/* Quick tags: horizontal scrolling pill strip on mobile */}
            <div className="flex items-center gap-1.5 pt-1 sm:pt-2 text-xs text-neutral-500 overflow-x-auto no-scrollbar py-0.5 sm:flex-wrap sm:justify-center">
              <span className="font-semibold text-neutral-400 flex-shrink-0 text-[11px] sm:text-xs">Try:</span>
              {suggestionsList.slice(0, 6).map((term) => (
                <NextLink
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-emerald-50 hover:text-emerald-700 text-neutral-700 transition-colors text-[11px] sm:text-xs"
                >
                  {term}
                </NextLink>
              ))}
            </div>
          </div>

          {/* Results Tabs if query is present */}
          {query && (
            <div className="flex items-center justify-center gap-2 pt-3 sm:pt-6 mt-3 sm:mt-6 border-t border-neutral-100">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all ${
                  activeTab === "all"
                    ? "bg-neutral-900 text-white shadow-xs"
                    : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                }`}
              >
                All ({matchedProducts.length + matchedShops.length})
              </button>
              <button
                onClick={() => setActiveTab("products")}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all ${
                  activeTab === "products"
                    ? "bg-neutral-900 text-white shadow-xs"
                    : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Products ({matchedProducts.length})</span>
              </button>
              <button
                onClick={() => setActiveTab("shops")}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all ${
                  activeTab === "shops"
                    ? "bg-neutral-900 text-white shadow-xs"
                    : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Shops ({matchedShops.length})</span>
              </button>
            </div>
          )}
        </div>

        {/* If no query entered yet, show discovery screen */}
        {!query && (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8">
              <h3 className="font-bold text-base text-neutral-900 mb-4">
                Popular Search Terms
              </h3>
              <div className="flex flex-wrap gap-2">
                {suggestionsList.map((term) => (
                  <NextLink
                    key={term}
                    href={`/search?q=${encodeURIComponent(term)}`}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-50 hover:bg-emerald-50 hover:text-emerald-800 border border-neutral-200/80 text-xs font-medium transition-colors"
                  >
                    <Search className="w-3 h-3 text-neutral-400" />
                    <span>{term}</span>
                  </NextLink>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg text-neutral-900 mb-4">
                Browse by Category
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {catList.slice(0, 6).map((cat) => (
                  <NextLink
                    key={cat.id}
                    href={`/explore?category=${cat.id}`}
                    className="p-4 rounded-2xl bg-white border border-neutral-200 hover:border-emerald-500 hover:shadow-xs transition-all text-center group"
                  >
                    <div className="font-semibold text-xs text-neutral-800 group-hover:text-emerald-700">
                      {cat.name}
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-0.5">Explore →</div>
                  </NextLink>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* When query is entered: No results state */}
        {query && matchedProducts.length === 0 && matchedShops.length === 0 && (
          <EmptyState
            type="search"
            title={`No results found for "${query}"`}
            description="We couldn't find any products or neighborhood shops matching your search. Try checking your spelling or searching for a broader term like 'milk', 'rice', or 'bread'."
            actionLabel="Explore All Shops"
            actionHref="/explore"
          />
        )}

        {/* Content Tabs Results */}
        {query && (matchedProducts.length > 0 || matchedShops.length > 0) && (
          <div className="space-y-5 sm:space-y-8">
            {/* Products Section */}
            {(activeTab === "all" || activeTab === "products") && matchedProducts.length > 0 && (
              <section className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm sm:text-lg font-bold text-neutral-900 flex items-center gap-1.5 sm:gap-2">
                    <ShoppingBag className="w-4 h-4 text-emerald-600" />
                    <span>Products matching &ldquo;{query}&rdquo;</span>
                  </h2>
                  <span className="text-[11px] sm:text-xs text-neutral-500">
                    {matchedProducts.length} items
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4">
                  {matchedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}

            {/* Shops Section */}
            {(activeTab === "all" || activeTab === "shops") && matchedShops.length > 0 && (
              <section className="space-y-3 sm:space-y-4 pt-1 sm:pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-neutral-900 flex items-center gap-2">
                      <Store className="w-4 h-4 text-emerald-600" />
                      <span>Local Stores stocking &ldquo;{query}&rdquo;</span>
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Order directly from these verified neighborhood shopkeepers
                    </p>
                  </div>
                  <span className="text-xs text-neutral-500">
                    {matchedShops.length} shops
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {matchedShops.map((shop) => (
                    <StoreCard key={shop.id} shop={shop} />
                  ))}
                </div>
              </section>
            )}
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
        <div className="min-h-screen bg-[#fbfbfb] py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="h-44 bg-neutral-200 rounded-3xl animate-pulse" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <ProductSkeleton />
              <ProductSkeleton />
              <ProductSkeleton />
              <ProductSkeleton />
              <ProductSkeleton />
            </div>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
