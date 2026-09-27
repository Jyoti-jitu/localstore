"use client";

import React, { useState, useMemo } from "react";
import NextLink from "next/link";
import { useLocation } from "@/context/LocationContext";
import { useCategories, useShops, useProducts } from "@/hooks/useSupabaseData";
import CategoryCard from "@/components/CategoryCard";
import StoreCard from "@/components/StoreCard";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import {
  CategoryCompactSkeleton,
  CategoryCircleSkeleton,
  ProductSkeleton,
  StoreSkeleton
} from "@/components/LoadingSkeleton";
import {
  MapPin,
  ChevronRight,
  Sparkles,
  Store,
  ShieldCheck,
  TrendingUp,
  HeartHandshake,
  Clock,
  CheckCircle2,
  ArrowRight,
  Heart,
  ShoppingCart,
  Zap
} from "lucide-react";

export default function HomePage() {
  const { city, currentLocality, openModal, isDetecting } = useLocation();
  const [activeTab, setActiveTab] = useState("all");

  const { categories, loading: categoriesLoading } = useCategories();
  const { shops: allShops, loading: shopsLoading } = useShops();
  const { products: allProducts, loading: productsLoading } = useProducts();

  const heroCategories = categories && categories.length > 0 ? categories.slice(0, 6) : [];

  // Filter products by active category tab, with newest products (added by shopkeepers) first!
  const displayedProducts = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return [];
    
    // Sort all products: newest first
    const sorted = [...allProducts].sort((a, b) => {
      const timeA = new Date(a.createdAt || 0).getTime();
      const timeB = new Date(b.createdAt || 0).getTime();
      if (timeB !== timeA) return timeB - timeA;
      return (b.salesLastMonth || 0) - (a.salesLastMonth || 0);
    });

    if (activeTab === "all") return sorted;
    if (activeTab === "trending") {
      return sorted.filter((p) => p.popular || (p.salesLastMonth && p.salesLastMonth >= 100));
    }
    return sorted.filter(
      (p) =>
        p.category?.toLowerCase().includes(activeTab.toLowerCase()) ||
        p.storeCategory?.toLowerCase().includes(activeTab.toLowerCase())
    );
  }, [allProducts, activeTab]);

  const featuredShops = allShops.filter((s) => s.featured);

  return (
    <div className="min-h-screen">
      {/* SECTION 1: Hero Banner (Desktop layout + Mobile layout matching reference exactly) */}
      <section className="pt-0 pb-3 sm:pb-5 bg-white">
        <div className="max-w-[1400px] 2xl:max-w-[1440px] mx-auto px-3 sm:px-5 lg:px-6">
          {/* ================= DESKTOP HERO (Laptop / Desktop Screens) ================= */}
          <div className="hidden lg:block relative w-full rounded-b-3xl border-x border-b border-neutral-200/80 overflow-hidden bg-[#F1F8FE] shadow-xs">
            <div
              className="absolute inset-0 w-full h-full bg-no-repeat bg-right bg-cover pointer-events-none select-none"
              style={{
                backgroundImage: "url('https://rchkrkbuuwxhplfqhhao.supabase.co/storage/v1/object/public/localstore-assets/brand/hero-banner-full.webp')",
              }}
            />

            <div className="relative px-8 lg:px-12 py-10 lg:py-12 min-h-[490px] flex flex-col justify-center">
              <div className="max-w-lg xl:max-w-xl space-y-5 text-left">
                {/* Pills: Tag + Location */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF7F1]/95 backdrop-blur-xs border border-emerald-200 text-xs font-bold text-emerald-800 shadow-2xs">
                    <Store className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Your neighborhood shops, now online.</span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs border border-neutral-200 shadow-2xs text-xs">
                    <span className="text-neutral-500 font-medium">Delivering in:</span>
                    <button
                      onClick={openModal}
                      className="font-bold text-emerald-800 flex items-center gap-1 hover:underline"
                    >
                      <MapPin className={`w-3.5 h-3.5 text-emerald-600 ${isDetecting ? "animate-bounce" : ""}`} />
                      <span>
                        {isDetecting
                          ? "Detecting your area..."
                          : `${currentLocality?.name || "Jayadev Vihar"}, ${city}`}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl lg:text-[46px] xl:text-[52px] font-black tracking-tight text-neutral-900 leading-[1.08]">
                  Shop Local.<br />
                  <span className="text-[#00A859]">Shop Online.</span>
                </h1>

                {/* Subtitle */}
                <p className="text-sm lg:text-base text-neutral-600 max-w-lg leading-relaxed">
                  Discover stores around you and get your everyday products delivered from local businesses.
                </p>

                {/* Search Bar */}
                <div className="pt-1 max-w-xl">
                  <SearchBar
                    variant="hero"
                    placeholder="Search for products, shops or categories..."
                    autoFocus={false}
                  />
                </div>

                {/* Value Propositions: 4 Badges Row */}
                <div className="grid grid-cols-4 gap-3 pt-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-4 h-4 fill-rose-500" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-neutral-900 leading-tight">Support Local</div>
                      <div className="text-[10px] text-neutral-500 leading-tight truncate">Help local businesses.</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <ShoppingCart className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-neutral-900 leading-tight">Convenient Shopping</div>
                      <div className="text-[10px] text-neutral-500 leading-tight truncate">Order from phone.</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-neutral-900 leading-tight">Discover Nearby</div>
                      <div className="text-[10px] text-neutral-500 leading-tight truncate">Find neighborhood shops.</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 fill-blue-500 text-blue-500" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-neutral-900 leading-tight">Fast Fulfillment</div>
                      <div className="text-[10px] text-neutral-500 leading-tight truncate">Prepared by local stores.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= MOBILE HERO (Matching Reference Mockup Exactly) ================= */}
          <div className="lg:hidden relative w-full max-w-full rounded-b-2xl border-x border-b border-neutral-200/80 overflow-hidden bg-[#F1F8FE] shadow-xs pt-4 sm:pt-6">
            <div className="flex flex-col items-center text-center px-2.5 sm:px-4 w-full max-w-full">
              {/* 1. Green Pill Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F8EE] border border-[#CDEED6] text-[11px] sm:text-xs font-semibold text-[#008744] shadow-2xs">
                <Store className="w-3.5 h-3.5 text-[#00A859] flex-shrink-0" />
                <span>Your neighborhood shops, now online.</span>
              </div>

              {/* 2. Headline */}
              <h1 className="text-[32px] sm:text-[40px] font-black tracking-tight text-neutral-900 leading-[1.08] mt-2.5 sm:mt-3.5">
                Shop Local.<br />
                <span className="text-[#00A859]">Shop Online.</span>
              </h1>

              {/* 3. Subtitle */}
              <p className="text-[12px] sm:text-sm text-neutral-600 font-normal max-w-[320px] sm:max-w-md mx-auto leading-relaxed mt-2">
                Discover stores around you and get your everyday products delivered from local businesses.
              </p>

              {/* 4. Search Bar with Green Round Button */}
              <div className="w-full max-w-md mt-3.5 sm:mt-4 px-1">
                <SearchBar
                  variant="hero"
                  placeholder="Search for products, shops or categories..."
                  autoFocus={false}
                />
              </div>

              {/* 5. 6 Quick Categories Row with Circular Icons */}
              <div className="w-full max-w-md grid grid-cols-6 gap-1 px-0 mt-4 sm:mt-5">
                {categoriesLoading ? (
                  Array.from({ length: 6 }).map((_, idx) => (
                    <CategoryCircleSkeleton key={idx} />
                  ))
                ) : (
                  heroCategories.map((cat) => {
                    const iconSrc = (cat.icon && (cat.icon.startsWith('http') || cat.icon.startsWith('/')))
                      ? cat.icon
                      : (cat.image && cat.image.startsWith('http'))
                      ? cat.image
                      : `/categories/${cat.id}-circle.png`;
                    return (
                      <NextLink
                        key={cat.id}
                        href={`/explore?category=${cat.id}`}
                        className="flex flex-col items-center group transition-transform active:scale-95 min-w-0"
                      >
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center p-0.5 group-hover:scale-105 transition-transform flex-shrink-0 bg-white/80 shadow-2xs overflow-hidden">
                          <img
                            src={iconSrc}
                            alt={cat.name}
                            className="w-full h-full object-cover rounded-full"
                            loading="eager"
                          />
                        </div>
                        <span className="text-[9px] sm:text-[10px] font-semibold text-neutral-800 text-center leading-tight mt-1 truncate w-full px-0.5">
                          {cat.name}
                        </span>
                      </NextLink>
                    );
                  })
                )}
              </div>

              {/* 6. 4 Value Propositions: Clean 2x2 Grid on Mobile, 4-col on Tablet */}
              <div className="w-full max-w-md grid grid-cols-2 sm:grid-cols-4 gap-2 px-1 mt-4 sm:mt-5 text-left">
                <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-white/70 border border-neutral-200/60 min-w-0 shadow-2xs">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#FFEDF2] flex items-center justify-center flex-shrink-0">
                    <Heart className="w-3 h-3 text-[#FF4060] fill-[#FF4060]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] sm:text-xs font-bold text-neutral-900 leading-tight truncate">Support Local</div>
                    <div className="text-[8px] sm:text-[9.5px] text-neutral-500 leading-tight truncate">Help neighborhood shops.</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-white/70 border border-neutral-200/60 min-w-0 shadow-2xs">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#E8F8EE] flex items-center justify-center flex-shrink-0">
                    <ShoppingCart className="w-3 h-3 text-[#00A859]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] sm:text-xs font-bold text-neutral-900 leading-tight truncate">Convenient Shopping</div>
                    <div className="text-[8px] sm:text-[9.5px] text-neutral-500 leading-tight truncate">Order from phone.</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-white/70 border border-neutral-200/60 min-w-0 shadow-2xs">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#FFF7E0] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] sm:text-xs font-bold text-neutral-900 leading-tight truncate">Discover Nearby</div>
                    <div className="text-[8px] sm:text-[9.5px] text-neutral-500 leading-tight truncate">Find stores near you.</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-white/70 border border-neutral-200/60 min-w-0 shadow-2xs">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#EBF4FE] flex items-center justify-center flex-shrink-0">
                    <Zap className="w-3 h-3 text-[#2563EB] fill-[#2563EB]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] sm:text-xs font-bold text-neutral-900 leading-tight truncate">Fast Local Delivery</div>
                    <div className="text-[8px] sm:text-[9.5px] text-neutral-500 leading-tight truncate">Delivered by local stores.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 7. Bottom 3D Phone & Local Store Illustration */}
            <div className="w-full mt-3 sm:mt-4 overflow-hidden">
              <picture>
                <source srcSet="https://rchkrkbuuwxhplfqhhao.supabase.co/storage/v1/object/public/localstore-assets/brand/hero-mobile-illustration.webp" type="image/webp" />
                <img
                  src="https://rchkrkbuuwxhplfqhhao.supabase.co/storage/v1/object/public/localstore-assets/brand/hero-mobile-illustration.webp"
                  alt="Shop Local, Shop Online - LocalStore Bhubaneswar"
                  className="w-full h-auto object-cover max-w-full mx-auto block"
                  loading="eager"
                  width={631}
                  height={504}
                />
              </picture>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Category Explorer */}
      <section className="py-5 sm:py-8 bg-white border-b border-neutral-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-3.5 sm:mb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300/80 mb-1.5 shadow-2xs">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>Categories</span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-neutral-900">
                Explore <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent">Categories</span>
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-neutral-700 mt-1">
                Browse neighborhood shops <span className="text-emerald-700 font-bold">by category</span>
              </p>
            </div>
            <NextLink
              href="/explore?view=products"
              className="text-xs sm:text-sm font-black text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/90 border border-emerald-200/90 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all flex items-center gap-1 shadow-2xs group"
            >
              <span>See All</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </NextLink>
          </div>

          {/* Horizontally scrollable row on mobile, wrapping grid on desktop */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 sm:pb-0 sm:grid sm:grid-cols-6 lg:grid-cols-12 sm:gap-2">
            {categoriesLoading ? (
              Array.from({ length: 12 }).map((_, idx) => (
                <CategoryCompactSkeleton key={idx} />
              ))
            ) : (
              categories.map((category) => (
                <CategoryCard key={category.id} category={category} isCompact={true} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* SECTION 3: Local Store Catalog & Fresh Stock */}
      <section className="py-10 bg-neutral-50/70 border-b border-neutral-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-xs mb-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-100" />
                <span>Live Store Catalog • Fast 20m Delivery</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
                Fresh Stock from <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">Local Stores</span>
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-neutral-700 mt-1.5 flex flex-wrap items-center gap-1.5">
                <span>Stocked live by neighborhood shopkeepers in</span>
                <span className="inline-flex items-center font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-md border border-emerald-300">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  {currentLocality?.name || "Bhubaneswar"}
                </span>
                <span className="text-neutral-400">•</span>
                <span className="text-xs font-semibold text-neutral-500">Instant counter sync</span>
              </p>
            </div>

            <NextLink
              href="/explore?view=products"
              className="text-xs sm:text-sm font-black text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/90 border border-emerald-200/90 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all flex items-center gap-1 shadow-2xs group self-start md:self-auto"
            >
              <span>Explore All {allProducts.length} Items</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </NextLink>
          </div>

          {/* Catalog Quick Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-4">
            {[
              { id: "all", label: "All Items (Newest First)" },
              { id: "trending", label: "Trending Essentials" },
              { id: "grocery", label: "Grocery & Staples" },
              { id: "bakery", label: "Dairy & Bakery" },
              { id: "fruits", label: "Fruits & Veggies" },
              { id: "pharmacy", label: "Pharmacy & Care" },
              { id: "electronics", label: "Electronics" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex-shrink-0 ${
                  activeTab === tab.id
                    ? "bg-neutral-900 text-white shadow-xs"
                    : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Responsive Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {productsLoading ? (
              Array.from({ length: 10 }).map((_, idx) => (
                <ProductSkeleton key={idx} />
              ))
            ) : displayedProducts.length > 0 ? (
              displayedProducts.slice(0, 15).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-xs text-neutral-500 bg-white rounded-2xl border border-neutral-200 p-6">
                No products found in this category.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 4: Shop by Category (Visually distinct cards) */}
      <section className="py-10 sm:py-12 bg-white border-b border-neutral-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs mb-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-100" />
              <span>Curated Departments</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
              Shop by <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Category</span>
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-neutral-700 mt-1.5">
              Find specialized offline merchants curated by category
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {categoriesLoading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-44 sm:h-52 rounded-2xl bg-neutral-100 animate-pulse border border-neutral-200/60 flex flex-col justify-between p-3">
                  <div className="h-28 sm:h-32 bg-neutral-200 rounded-xl" />
                  <div className="space-y-1.5 pt-2">
                    <div className="h-3.5 w-2/3 bg-neutral-200 rounded" />
                    <div className="h-2.5 w-1/2 bg-neutral-200 rounded" />
                  </div>
                </div>
              ))
            ) : (
              categories.map((cat) => (
                <CategoryCard key={cat.id} category={cat} isCompact={false} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* SECTION 5: Nearby Shops (Local Merchants) */}
      <section className="py-10 sm:py-14 bg-neutral-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs mb-2">
                <Store className="w-3.5 h-3.5 text-emerald-100" />
                <span>Local Merchants</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
                Shops <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">near you</span>
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-neutral-700 mt-1.5 flex flex-wrap items-center gap-1.5">
                <span>Discover offline neighborhood businesses around</span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-md border border-emerald-300">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  {currentLocality?.name || "SUM Hospital"}
                </span>
              </p>
            </div>

            <NextLink
              href="/explore?view=stores"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/90 border border-emerald-200/90 px-4 py-2 rounded-full transition-all shadow-2xs group"
            >
              <span>View all {allShops.length} shops in {city}</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </NextLink>
          </div>

          {/* Responsive Store Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {shopsLoading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <StoreSkeleton key={idx} />
              ))
            ) : (
              featuredShops.map((shop) => (
                <StoreCard key={shop.id} shop={shop} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* SECTION 6: Local Businesses Spotlight */}
      <section className="py-12 bg-gradient-to-b from-white to-emerald-50/40 border-t border-neutral-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-md p-6 sm:p-10 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Story */}
              <div className="lg:col-span-5 space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>Merchant Spotlight</span>
                </span>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                  Maa Laxmi General Store
                </h3>

                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  A cherished neighborhood institution in Saheed Nagar. Run by Subrat Mohanty and his family, this shop has supplied premium pulses, spices, and everyday dry goods to Bhubaneswar families for over a decade.
                </p>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="p-3 bg-neutral-50 rounded-xl text-center border border-neutral-100">
                    <div className="font-extrabold text-base text-neutral-900">4.8 ★</div>
                    <div className="text-[11px] text-neutral-500">340+ Reviews</div>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl text-center border border-neutral-100">
                    <div className="font-extrabold text-base text-neutral-900">350+</div>
                    <div className="text-[11px] text-neutral-500">Products</div>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl text-center border border-neutral-100">
                    <div className="font-extrabold text-base text-neutral-900">20–30m</div>
                    <div className="text-[11px] text-neutral-500">Delivery</div>
                  </div>
                </div>

                <div className="pt-2">
                  <NextLink
                    href="/shop/maa-laxmi"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md transition-all"
                  >
                    <span>Explore Store</span>
                    <ArrowRight className="w-4 h-4" />
                  </NextLink>
                </div>
              </div>

              {/* Right Column: Visual Showcase */}
              <div className="lg:col-span-7 grid grid-cols-2 gap-3.5">
                <div className="rounded-2xl overflow-hidden shadow-sm h-48 sm:h-64">
                  <img
                    src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80"
                    alt="Maa Laxmi Store Front"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-sm h-48 sm:h-64">
                  <img
                    src="https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?auto=format&fit=crop&w=800&q=80"
                    alt="Inside Store Shelves"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: Why Shop Local? (Informational Section) */}
      <section className="py-14 bg-white border-t border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Hyperlocal Advantage
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1">
              Your neighborhood, now online.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-2">
              We bridge the gap between traditional offline neighborhood stores and modern digital convenience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-neutral-50/70 border border-neutral-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-neutral-900 text-base">Support Local Businesses</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Shop directly from the businesses in your community and keep neighborhood trade thriving.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-50/70 border border-neutral-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Store className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-neutral-900 text-base">Convenient Shopping</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Browse local shelves from your phone without hopping across multiple crowded market alleys.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-50/70 border border-neutral-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-neutral-900 text-base">Discover Nearby Stores</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Find hidden gems and specialty shops just around the corner that you may never have known existed.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-50/70 border border-neutral-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-neutral-900 text-base">Fast Local Fulfillment</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Orders are packed by your trusted merchant and brought straight to your door in 20–35 minutes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
