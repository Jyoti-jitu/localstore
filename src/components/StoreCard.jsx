"use client";

import React from "react";
import NextLink from "next/link";
import { Star, Clock, MapPin, Package, Heart, CheckCircle2 } from "lucide-react";
import { useFavorites } from "@/context/FavoritesContext";
import { useToast } from "@/context/ToastContext";

export default function StoreCard({ shop, variant = "default" }) {
  const { isShopFavorite, toggleFavoriteShop } = useFavorites();
  const { showToast } = useToast();
  const isFav = isShopFavorite(shop.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavoriteShop(shop.id);
    showToast(
      isFav ? `Removed ${shop.name} from favorites` : `Saved ${shop.name} to favorite shops!`,
      "info"
    );
  };

  if (variant === "compact") {
    return (
      <NextLink
        href={`/shop/${shop.id}`}
        className="group flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-neutral-200 hover:border-emerald-500 hover:shadow-md transition-all"
      >
        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0">
          <img
            src={shop.image}
            alt={shop.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-neutral-900 group-hover:text-emerald-700 truncate">
            {shop.name}
          </h4>
          <p className="text-xs text-neutral-500 truncate">{shop.category} · {shop.locality}</p>
          <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-600">
            <span className="flex items-center gap-0.5 text-amber-600 font-semibold">
              <Star className="w-3 h-3 fill-amber-400 stroke-amber-500" />
              {shop.rating}
            </span>
            <span>•</span>
            <span>{shop.deliveryTime}</span>
          </div>
        </div>
      </NextLink>
    );
  }

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-neutral-200/90 hover:border-emerald-500/80 hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Cover / Image Area */}
      <NextLink href={`/shop/${shop.id}`} className="relative h-36 sm:h-48 w-full overflow-hidden bg-neutral-100 block">
        <img
          src={shop.image}
          alt={shop.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Subtle gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          aria-label={isFav ? "Remove from favorite shops" : "Add to favorite shops"}
          className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 p-1.5 sm:p-2 rounded-full bg-white/90 hover:bg-white text-neutral-600 shadow-md backdrop-blur-xs transition-transform active:scale-90 z-10"
        >
          <Heart
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
              isFav ? "fill-rose-500 stroke-rose-500 text-rose-500" : "stroke-neutral-700"
            }`}
          />
        </button>

        {/* Status Badge */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex items-center gap-1.5">
          <span
            className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold shadow-xs backdrop-blur-xs ${
              shop.isOpen
                ? "bg-emerald-600 text-white"
                : "bg-neutral-800 text-neutral-200"
            }`}
          >
            {shop.isOpen ? "Open Now" : "Closed"}
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/95 text-neutral-800 shadow-xs backdrop-blur-xs">
            {shop.distanceText}
          </span>
        </div>

        {/* Delivery Time & Locality Overlay */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 flex items-center justify-between text-white text-[11px] sm:text-xs">
          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-xs px-2 py-0.5 sm:py-1 rounded-lg">
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-300" />
            <span>{shop.deliveryTime}</span>
          </div>
          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-xs px-2 py-0.5 sm:py-1 rounded-lg">
            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-300" />
            <span className="truncate max-w-[120px]">{shop.locality}</span>
          </div>
        </div>
      </NextLink>

      {/* Content Area */}
      <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Verified Badge */}
          <div className="flex items-center justify-between gap-2 text-xs text-neutral-500 mb-1.5">
            <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              {shop.category}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-neutral-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Store</span>
            </div>
          </div>

          {/* Shop Title */}
          <NextLink href={`/shop/${shop.id}`} className="block">
            <h3 className="font-bold text-base sm:text-lg text-neutral-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
              {shop.name}
            </h3>
          </NextLink>

          {/* Opening Status & Details */}
          <div className="flex items-center gap-2 mt-2 text-xs text-neutral-600">
            <span className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
              {shop.rating}
              <span className="text-[10px] text-amber-700/70 font-normal">({shop.reviewCount})</span>
            </span>
            <span className="text-neutral-300">•</span>
            <span className="text-neutral-600 truncate">{shop.openingHours}</span>
          </div>

          <p className="text-xs text-neutral-500 mt-2.5 line-clamp-2 leading-relaxed">
            {shop.description}
          </p>
        </div>

        {/* Footer info & CTA */}
        <div className="mt-4 pt-3.5 border-t border-neutral-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1 text-xs text-neutral-500">
            <Package className="w-3.5 h-3.5 text-neutral-400" />
            <span>{shop.productCount}+ products</span>
          </div>

          <NextLink
            href={`/shop/${shop.id}`}
            className="inline-flex items-center justify-center px-4 py-2 bg-neutral-900 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
          >
            View Shop
          </NextLink>
        </div>
      </div>
    </div>
  );
}
