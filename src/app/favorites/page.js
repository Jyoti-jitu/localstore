"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import { useFavorites } from "@/context/FavoritesContext";
import { useShops, useProducts } from "@/hooks/useSupabaseData";
import StoreCard from "@/components/StoreCard";
import ProductCard from "@/components/ProductCard";
import EmptyState from "@/components/EmptyState";
import { Heart, Store, ShoppingBag, ChevronLeft } from "lucide-react";

export default function FavoritesPage() {
  const { favoriteShopIds, favoriteProductIds } = useFavorites();
  const [activeTab, setActiveTab] = useState("shops"); // 'shops' | 'products'

  const { shops: allDbShops } = useShops();
  const { products: allDbProducts } = useProducts();

  const shopPool = allDbShops || [];
  const productPool = allDbProducts || [];

  const favoriteShops = shopPool.filter((s) => favoriteShopIds.includes(s.id));
  const favoriteProducts = productPool.filter((p) => favoriteProductIds.includes(p.id));

  return (
    <div className="min-h-screen bg-[#fbfbfb] py-3 sm:py-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-3.5 sm:space-y-6">
        {/* Header with Back Button */}
        <div>
          <NextLink
            href="/account"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 mb-1.5 sm:mb-2 transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Account</span>
          </NextLink>

          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-rose-600 mb-0.5 sm:mb-1">
            <Heart className="w-3.5 h-3.5 fill-rose-500" />
            <span>Saved Favorites</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Your Favorite Local Places
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5 sm:mt-1">
            Quick access to your saved neighborhood stores and everyday staples
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-neutral-200 pb-2.5 sm:pb-3">
          <button
            onClick={() => setActiveTab("shops")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "shops"
                ? "bg-neutral-900 text-white shadow-xs"
                : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Favorite Shops ({favoriteShops.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "products"
                ? "bg-neutral-900 text-white shadow-xs"
                : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Favorite Products ({favoriteProducts.length})</span>
          </button>
        </div>

        {/* Content */}
        {activeTab === "shops" && (
          <div>
            {favoriteShops.length === 0 ? (
              <EmptyState
                type="favorites"
                title="No Favorite Shops Yet"
                description="Click the heart icon on any store card to bookmark your preferred neighborhood merchants here."
                actionLabel="Explore Stores in Bhubaneswar"
                actionHref="/explore"
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
                {favoriteShops.map((shop) => (
                  <StoreCard key={shop.id} shop={shop} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "products" && (
          <div>
            {favoriteProducts.length === 0 ? (
              <EmptyState
                type="favorites"
                title="No Favorite Products Saved"
                description="Save your recurring daily groceries, dairy, and fruits for faster one-tap reordering."
                actionLabel="Browse Popular Products"
                actionHref="/search"
              />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4">
                {favoriteProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
