"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import NextLink from "next/link";
import { useShop, useProducts } from "@/hooks/useSupabaseData";
import ProductCard from "@/components/ProductCard";
import EmptyState from "@/components/EmptyState";
import { useFavorites } from "@/context/FavoritesContext";
import { useToast } from "@/context/ToastContext";
import {
  Star,
  Clock,
  MapPin,
  Package,
  Heart,
  Share2,
  Search,
  ShieldCheck,
  Phone,
  Info,
  CheckCircle2,
  ChevronLeft,
  Store,
  Loader2,
  AlertCircle
} from "lucide-react";

export default function ShopDetailPage() {
  const params = useParams();
  const router = useRouter();
  const shopId = params.shopId;
  const { isShopFavorite, toggleFavoriteShop } = useFavorites();
  const { showToast } = useToast();

  const [selectedTab, setSelectedTab] = useState("All");
  const [storeSearch, setStoreSearch] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);

  const { shop, loading: shopLoading } = useShop(shopId);
  const { products: allDbProducts, loading: productsLoading } = useProducts();

  const isFav = shop ? isShopFavorite(shop.id) : false;

  // Shop products from Supabase
  const shopProducts = useMemo(() => {
    if (!shop) return [];
    const pool = allDbProducts || [];
    const exact = pool.filter((p) => p.shopId === shop.id);
    if (exact.length > 0) return exact;

    // Complement with similar category items mapped to this shop
    const extra = pool.slice(0, 8).map((p, idx) => ({
      ...p,
      id: `${shop.id}-prod-${idx}`,
      shopId: shop.id,
      shopName: shop.name,
      shopDistance: shop.distanceText
    }));
    return [...exact, ...extra.filter((e) => !exact.some((x) => x.name === e.name))];
  }, [shop, allDbProducts]);

  // Filtered by store internal search & category tab
  const filteredProducts = useMemo(() => {
    return shopProducts.filter((product) => {
      // Category filter
      if (selectedTab !== "All") {
        const matchesCategory =
          product.storeCategory?.toLowerCase() === selectedTab.toLowerCase() ||
          product.category?.toLowerCase() === selectedTab.toLowerCase();
        if (!matchesCategory) return false;
      }

      // Store in-shop search
      if (storeSearch.trim()) {
        const q = storeSearch.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesBrand = product.brand.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand) return false;
      }

      return true;
    });
  }, [shopProducts, selectedTab, storeSearch]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("Store link copied to clipboard!");
    } else {
      showToast("Store URL: " + window.location.href);
    }
  };

  const handleToggleFollow = () => {
    setIsFollowing(!isFollowing);
    showToast(
      isFollowing
        ? `Unfollowed ${shop.name}`
        : `Following ${shop.name}! You will receive restock updates.`
    );
  };

  const handleFavorite = () => {
    if (shop) {
      toggleFavoriteShop(shop.id);
      showToast(isFav ? `Removed from saved stores` : `Added ${shop.name} to favorites!`);
    }
  };

  if (shopLoading) {
    return (
      <div className="min-h-screen bg-[#fbfbfb] py-20 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
        <p className="text-xs text-neutral-500 font-medium">Loading store details from Supabase...</p>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-[#fbfbfb] py-20 flex flex-col items-center justify-center text-center px-4">
        <AlertCircle className="w-12 h-12 text-neutral-400 mb-3" />
        <h2 className="text-lg font-bold text-neutral-900">Store Not Found</h2>
        <p className="text-xs text-neutral-500 mt-1 max-w-sm">
          We could not find this store in our live database.
        </p>
        <NextLink
          href="/explore"
          className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
        >
          Explore All Stores
        </NextLink>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbfb] pb-16">
      {/* Top back navigation */}
      <div className="bg-white border-b border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to previous page</span>
          </button>
        </div>
      </div>

      {/* STORE HERO / COVER */}
      <div className="relative bg-neutral-900 text-white">
        {/* Cover Photo */}
        <div className="relative h-28 sm:h-72 w-full overflow-hidden">
          <img
            src={shop.coverImage || shop.image}
            alt={shop.name}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
        </div>

        {/* Store Profile Bar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="relative -mt-8 sm:-mt-20 pb-3 sm:pb-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 sm:gap-4">
            {/* Avatar & Info */}
            <div className="flex items-end gap-3 sm:gap-4">
              <div className="w-16 h-16 sm:w-28 sm:h-28 rounded-xl sm:rounded-2xl overflow-hidden border-2 sm:border-4 border-white shadow-xl bg-white flex-shrink-0">
                <img
                  src={shop.avatar || shop.image}
                  alt={shop.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-0.5 sm:space-y-1 text-white">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                    {shop.category}
                  </span>
                  <div className="flex items-center gap-1 text-emerald-400 text-[10px] sm:text-xs font-medium bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>Verified Merchant</span>
                  </div>
                </div>

                <h1 className="text-lg sm:text-3xl font-extrabold tracking-tight drop-shadow-xs">
                  {shop.name}
                </h1>

                <p className="text-[11px] sm:text-sm text-neutral-300 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-neutral-400 flex-shrink-0" />
                  <span className="truncate max-w-[200px] sm:max-w-none">{shop.address}</span>
                </p>
              </div>
            </div>

            {/* Action Buttons: Follow, Share, Favorite */}
            <div className="flex items-center gap-2 w-full sm:w-auto pt-1 sm:pt-0">
              <button
                onClick={handleToggleFollow}
                className={`flex-1 sm:flex-initial px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  isFollowing
                    ? "bg-emerald-600 text-white"
                    : "bg-white text-neutral-900 hover:bg-neutral-100"
                }`}
              >
                {isFollowing ? "✓ Following" : "+ Follow"}
              </button>

              <button
                onClick={handleShare}
                className="p-1.5 sm:p-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-xs text-white transition-colors"
                title="Share store link"
              >
                <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              <button
                onClick={handleFavorite}
                className="p-1.5 sm:p-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-xs text-white transition-colors"
                title={isFav ? "Saved to favorites" : "Save store"}
              >
                <Heart
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFav ? "fill-rose-500 text-rose-500" : ""}`}
                />
              </button>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 py-2 sm:py-3 border-t border-white/10 text-[11px] sm:text-xs text-neutral-200">
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>
                <strong className="text-white">{shop.rating}</strong> ({shop.reviewCount})
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="truncate">{shop.deliveryTime}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              <span className="truncate">{shop.distanceText}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-neutral-400" />
              <span>{shop.productCount}+ products</span>
            </div>
          </div>
        </div>
      </div>

      {/* STORE MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Products Area */}
          <div className="lg:col-span-8 space-y-6">
            {/* Store In-Search & Category Tabs */}
            <div className="bg-white rounded-3xl border border-neutral-200/80 p-4 sm:p-5 shadow-xs space-y-4">
              {/* Store search bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={storeSearch}
                  onChange={(e) => setStoreSearch(e.target.value)}
                  placeholder={`Search products in ${shop.name}...`}
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white text-xs sm:text-sm text-neutral-900 border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-600 transition-colors"
                />
              </div>

              {/* Catalog Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
                {shop.catalogCategories?.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedTab(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex-shrink-0 transition-all ${
                      selectedTab === cat
                        ? "bg-neutral-900 text-white shadow-xs"
                        : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base text-neutral-900">
                  {selectedTab === "All" ? "All Products" : selectedTab}
                </h3>
                <span className="text-xs text-neutral-500">
                  {filteredProducts.length} items available
                </span>
              </div>

              {filteredProducts.length === 0 ? (
                <EmptyState
                  type="search"
                  title="No items found in this shop"
                  description={`No products match "${storeSearch}" in this store.`}
                  actionLabel="Clear Store Search"
                  onAction={() => setStoreSearch("")}
                />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-4">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} showShop={false} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Store Info & Merchant Sidebar (Desktop) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Merchant Details Card */}
            <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 shadow-xs space-y-4">
              <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-2">
                <Store className="w-4 h-4 text-emerald-600" />
                <span>About this Merchant</span>
              </h3>

              <p className="text-xs text-neutral-600 leading-relaxed">
                {shop.description}
              </p>

              <div className="space-y-2.5 text-xs text-neutral-700 pt-3 border-t border-neutral-100">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Shopkeeper:</span>
                  <span className="font-semibold text-neutral-900">{shop.ownerName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Contact:</span>
                  <span className="font-semibold text-neutral-900">{shop.phone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Delivery Radius:</span>
                  <span className="font-semibold text-neutral-900">Up to 4.5 km</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Minimum Order:</span>
                  <span className="font-semibold text-neutral-900">₹{shop.minOrder}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {shop.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg"
                  >
                    ✓ {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Delivery Guarantee */}
            <div className="bg-emerald-50/60 rounded-3xl border border-emerald-200/80 p-5 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Direct Local Delivery</span>
              </div>
              <p className="text-xs text-emerald-900/80 leading-relaxed">
                Your order is prepared on-site by {shop.name} staff and dispatched immediately via local delivery partners.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
