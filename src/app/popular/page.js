"use client";

import React, { useState, useMemo, Suspense } from "react";
import NextLink from "next/link";
import { useLocation } from "@/context/LocationContext";
import { useProducts, useCategories, useShops } from "@/hooks/useSupabaseData";
import ProductCard from "@/components/ProductCard";
import EmptyState from "@/components/EmptyState";
import { ProductSkeleton } from "@/components/LoadingSkeleton";
import {
  TrendingUp,
  MapPin,
  Flame,
  Award,
  Filter,
  ArrowUpDown,
  ShoppingBag,
  Sparkles,
  ChevronRight,
  Home,
  CheckCircle2,
  Clock,
  Store,
  Search,
  RotateCcw
} from "lucide-react";

function PopularPageContent() {
  const { city, currentLocality, openModal } = useLocation();
  const { products, loading: productsLoading } = useProducts();
  const { categories } = useCategories();
  const { shops } = useShops();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("sales_desc"); // 'sales_desc' | 'rating_desc' | 'price_asc' | 'price_desc' | 'discount_desc'
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [minSalesThreshold, setMinSalesThreshold] = useState(0); // 0, 200, 400

  // Filter and rank products by high sales in last month
  const popularFilteredProducts = useMemo(() => {
    let list = (products || []).filter((p) => {
      // Must be marked popular or have monthly sales >= 100
      const hasHighSales = p.popular || (p.salesLastMonth && p.salesLastMonth >= 100);
      if (!hasHighSales) return false;

      // Category filter
      if (selectedCategory !== "all") {
        const cat = (p.category || "").toLowerCase();
        const storeCat = (p.storeCategory || "").toLowerCase();
        const target = selectedCategory.toLowerCase();
        if (!cat.includes(target) && !storeCat.includes(target)) {
          return false;
        }
      }

      // In stock filter
      if (onlyInStock && !p.inStock) {
        return false;
      }

      // Min sales filter
      if (minSalesThreshold > 0 && (p.salesLastMonth || 0) < minSalesThreshold) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = (p.name || "").toLowerCase().includes(q);
        const matchesBrand = (p.brand || "").toLowerCase().includes(q);
        const matchesShop = (p.shopName || "").toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesShop) {
          return false;
        }
      }

      return true;
    });

    // Sorting logic
    return list.sort((a, b) => {
      if (sortBy === "sales_desc") {
        return (b.salesLastMonth || 0) - (a.salesLastMonth || 0);
      }
      if (sortBy === "rating_desc") {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (sortBy === "price_asc") {
        return (a.price || 0) - (b.price || 0);
      }
      if (sortBy === "price_desc") {
        return (b.price || 0) - (a.price || 0);
      }
      if (sortBy === "discount_desc") {
        return (b.discountPercent || 0) - (a.discountPercent || 0);
      }
      return (b.salesLastMonth || 0) - (a.salesLastMonth || 0);
    });
  }, [products, selectedCategory, sortBy, searchQuery, onlyInStock, minSalesThreshold]);

  // Aggregate stats
  const totalMonthlySales = useMemo(() => {
    return (products || [])
      .filter((p) => p.popular || (p.salesLastMonth && p.salesLastMonth >= 100))
      .reduce((acc, curr) => acc + (curr.salesLastMonth || 0), 0);
  }, [products]);

  const categoryCounts = useMemo(() => {
    const counts = { all: 0 };
    (products || []).forEach((p) => {
      if (p.popular || (p.salesLastMonth && p.salesLastMonth >= 100)) {
        counts.all = (counts.all || 0) + 1;
        const cat = (p.category || "").toLowerCase();
        counts[cat] = (counts[cat] || 0) + 1;
      }
    });
    return counts;
  }, [products]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSortBy("sales_desc");
    setSearchQuery("");
    setOnlyInStock(false);
    setMinSalesThreshold(0);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-24 md:pb-16">
      {/* Top Breadcrumb */}
      <div className="bg-white border-b border-neutral-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
            <NextLink href="/" className="flex items-center gap-1 hover:text-neutral-900 transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </NextLink>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-orange-700 font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Popular Near You (High Sales)
            </span>
          </nav>
        </div>
      </div>

      {/* Hero Showcase Banner */}
      <section className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 text-white relative overflow-hidden shadow-md">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-xs">
                <Flame className="w-3.5 h-3.5 text-amber-200 fill-amber-200 animate-pulse" />
                <span>Monthly Velocity Leaderboard</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.15]">
                Popular Near You — <br className="hidden sm:inline" />
                <span className="text-amber-100 underline decoration-amber-300/60 decoration-wavy underline-offset-4">
                  High Sales in Last Month
                </span>
              </h1>

              <p className="text-xs sm:text-base text-amber-50/95 font-medium max-w-xl leading-relaxed">
                Neighborhood consumer favorites with verified high order volumes and repeat purchases in the last 30 days. Stocked locally in{" "}
                <button
                  onClick={openModal}
                  className="font-bold underline decoration-white/80 hover:text-white inline-flex items-center gap-1"
                >
                  <MapPin className="w-3.5 h-3.5 inline" />
                  {currentLocality?.name || "Jayadev Vihar"}, {city}
                </button>
              </p>
            </div>

            {/* Live Telemetry KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 flex-shrink-0">
              <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-3 sm:p-4 text-center shadow-xs">
                <div className="text-xl sm:text-3xl font-black text-white">
                  {totalMonthlySales > 0 ? `${totalMonthlySales.toLocaleString()}+` : "6,400+"}
                </div>
                <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-100 mt-0.5">
                  Units Sold Last Month
                </div>
              </div>

              <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-3 sm:p-4 text-center shadow-xs">
                <div className="text-xl sm:text-3xl font-black text-white">
                  {popularFilteredProducts.length}
                </div>
                <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-100 mt-0.5">
                  Top Trending SKUs
                </div>
              </div>

              <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-3 sm:p-4 text-center shadow-xs col-span-2 sm:col-span-1">
                <div className="text-xl sm:text-3xl font-black text-white flex items-center justify-center gap-1">
                  <span>20–30</span>
                  <span className="text-xs sm:text-sm font-bold text-amber-200">min</span>
                </div>
                <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-100 mt-0.5">
                  Instant Neighborhood Dispatch
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* Interactive Controls & Category Strip */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/80 p-4 sm:p-6 shadow-xs space-y-4">
          {/* Search bar inside popular products */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search popular products, brands, or local shops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400 hover:text-neutral-700"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort & Quick Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Sort selector */}
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-bold text-neutral-700">
                <ArrowUpDown className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
                <span className="text-neutral-400 font-medium">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none text-xs font-bold text-neutral-900 focus:outline-none cursor-pointer"
                >
                  <option value="sales_desc">🔥 Highest Sales Last Month</option>
                  <option value="rating_desc">⭐ Top Customer Rating</option>
                  <option value="price_asc">💵 Price: Low to High</option>
                  <option value="price_desc">💎 Price: High to Low</option>
                  <option value="discount_desc">🏷️ Highest Discount</option>
                </select>
              </div>

              {/* In-Stock Only Toggle */}
              <button
                type="button"
                onClick={() => setOnlyInStock(!onlyInStock)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                  onlyInStock
                    ? "bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs"
                    : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100"
                }`}
              >
                <CheckCircle2 className={`w-3.5 h-3.5 ${onlyInStock ? "text-emerald-600" : "text-neutral-400"}`} />
                <span>In Stock Only</span>
              </button>

              {/* Min Sales 300+ Filter Pill */}
              <button
                type="button"
                onClick={() => setMinSalesThreshold(minSalesThreshold === 300 ? 0 : 300)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                  minSalesThreshold === 300
                    ? "bg-orange-500 text-white border-orange-600 shadow-2xs"
                    : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100"
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-300" />
                <span>Super Fast Movers (300+ Sold)</span>
              </button>

              {/* Reset filter button if active */}
              {(selectedCategory !== "all" || searchQuery || onlyInStock || minSalesThreshold > 0 || sortBy !== "sales_desc") && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-2.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Chips Bar with Photo Pills */}
          <div className="pt-3 border-t border-neutral-100">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold flex-shrink-0 transition-all ${
                  selectedCategory === "all"
                    ? "bg-orange-600 text-white shadow-xs scale-102"
                    : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>All Popular Items ({categoryCounts.all || 0})</span>
              </button>

              {(categories || []).map((cat) => {
                const count = categoryCounts[cat.id.toLowerCase()] || 0;
                if (count === 0 && selectedCategory !== cat.id) return null;
                const isSelected = selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`inline-flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 transition-all ${
                      isSelected
                        ? "bg-orange-600 text-white shadow-xs ring-2 ring-orange-500/20 scale-105"
                        : "bg-neutral-100/90 hover:bg-neutral-200/90 text-neutral-800 border border-neutral-200/60"
                    }`}
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-5 h-5 rounded-full object-cover shadow-2xs border border-white"
                      loading="lazy"
                    />
                    <span>{cat.name}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        isSelected ? "bg-white/20 text-white" : "bg-neutral-200 text-neutral-600"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Count & Active Category Indicator */}
        <div className="flex items-center justify-between px-1">
          <div className="text-xs sm:text-sm font-bold text-neutral-700 flex items-center gap-2">
            <span>
              Showing <strong className="text-neutral-900">{popularFilteredProducts.length}</strong> top-selling items
            </span>
            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-800 bg-orange-100 px-2 py-0.5 rounded-full border border-orange-200">
                Filtered: {categories?.find((c) => c.id === selectedCategory)?.name || selectedCategory}
              </span>
            )}
            {minSalesThreshold > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-200">
                🔥 300+ Sold
              </span>
            )}
          </div>

          <div className="text-xs text-neutral-500 font-medium hidden sm:block">
            Ranked by total verified customer orders over the last 30 days
          </div>
        </div>

        {/* Product Cards Grid */}
        {productsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : popularFilteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {popularFilteredProducts.map((product, index) => (
              <div key={product.id} className="relative group">
                {/* Ranking Trophy / Pill for Top 3 */}
                {index < 3 && sortBy === "sales_desc" && (
                  <div className="absolute -top-2.5 -left-2 z-20 flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-md border border-white/40 backdrop-blur-xs transition-transform group-hover:scale-105"
                    style={{
                      background:
                        index === 0
                          ? "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)"
                          : index === 1
                          ? "linear-gradient(135deg, #E0E0E0 0%, #9E9E9E 100%)"
                          : "linear-gradient(135deg, #CD7F32 0%, #8D5524 100%)"
                    }}
                  >
                    <Award className="w-3 h-3 text-white fill-white" />
                    <span>#{index + 1} Best Seller</span>
                  </div>
                )}

                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-neutral-200 p-8 text-center shadow-xs">
            <EmptyState
              title="No popular products match your filters"
              description="Try adjusting your category selection, search terms, or resetting your sales filters."
              actionLabel="Reset All Filters"
              onAction={resetFilters}
            />
          </div>
        )}

        {/* Bottom Banner: Hyperlocal merchant support */}
        <section className="bg-gradient-to-r from-orange-50 via-amber-50 to-neutral-50 rounded-3xl border border-orange-200/80 p-6 sm:p-8 mt-10 shadow-xs">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1 text-xs font-bold text-orange-800 uppercase tracking-wider bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-300">
                <Store className="w-3.5 h-3.5 text-orange-700" />
                <span>Hyperlocal Commerce Guarantee</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-neutral-900">
                All top-selling products are fulfilled by verified neighborhood stores
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 max-w-xl">
                Every order directly supports offline retail merchants in your locality with zero counterfeit goods and quick 30-minute bike courier delivery.
              </p>
            </div>

            <NextLink
              href="/explore"
              className="px-5 py-3 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 flex-shrink-0 group"
            >
              <span>Explore All {shops.length} Local Stores</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </NextLink>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function PopularPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fcfcfc] p-6 max-w-7xl mx-auto space-y-6">
          <div className="h-44 bg-neutral-200 animate-pulse rounded-3xl" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <PopularPageContent />
    </Suspense>
  );
}
