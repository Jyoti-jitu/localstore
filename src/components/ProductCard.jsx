"use client";

import React from "react";
import NextLink from "next/link";
import { Store, MapPin, Heart, TrendingUp } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useToast } from "@/context/ToastContext";
import ProductQuantityControl from "./ProductQuantityControl";

export default function ProductCard({ product, showShop = true }) {
  const { getItemQuantity, addToCart, updateQuantity } = useCart();
  const { isProductFavorite, toggleFavoriteProduct } = useFavorites();
  const { showToast } = useToast();

  const quantity = getItemQuantity(product.id);
  const isFav = isProductFavorite(product.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavoriteProduct(product.id);
    showToast(
      isFav ? `Removed from favorites` : `Saved ${product.name} to favorites!`,
      "info"
    );
  };

  const handleAdd = () => {
    addToCart(product, 1);
    showToast(`Added ${product.name} to your cart!`);
  };

  const handleIncrement = () => {
    updateQuantity(product.id, 1);
  };

  const handleDecrement = () => {
    updateQuantity(product.id, -1);
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-neutral-200/90 hover:border-emerald-500/80 hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* Product Image Area */}
      <NextLink
        href={`/product/${product.id}`}
        className="relative pt-[85%] w-full overflow-hidden bg-neutral-50 block"
      >
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Discount or Fresh Stock Badge */}
        {product.discountPercent > 0 ? (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold bg-rose-600 text-white shadow-xs">
            {product.discountPercent}% OFF
          </span>
        ) : (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
            NEW STOCK
          </span>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          aria-label={isFav ? "Remove favorite" : "Add to favorites"}
          className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 hover:bg-white text-neutral-600 shadow-xs backdrop-blur-xs transition-transform active:scale-90"
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors ${
              isFav ? "fill-rose-500 stroke-rose-500 text-rose-500" : "stroke-neutral-600"
            }`}
          />
        </button>

        {/* Pack / Quantity Badge */}
        <div className="absolute bottom-2 left-2.5">
          <span className="px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-medium bg-neutral-900/80 text-white backdrop-blur-xs">
            {product.quantity}
          </span>
        </div>
      </NextLink>

      {/* Content Area */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Sales Velocity */}
          <div className="flex items-center justify-between gap-1.5 min-h-[18px]">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider truncate">
              {product.brand}
            </span>
            {product.salesLastMonth ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-700 bg-orange-50/90 px-1.5 py-0.5 rounded-md border border-orange-200/80 flex-shrink-0 shadow-2xs">
                <TrendingUp className="w-2.5 h-2.5 text-orange-600" />
                <span>{product.salesLastMonth}+ sold</span>
              </span>
            ) : null}
          </div>

          {/* Product Title */}
          <NextLink href={`/product/${product.id}`} className="block mt-0.5">
            <h4 className="text-xs sm:text-sm font-semibold text-neutral-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug min-h-[2.5rem]">
              {product.name}
            </h4>
          </NextLink>

          {/* Local Shop Association */}
          {showShop && product.shopName && (
            <NextLink
              href={`/shop/${product.shopId}`}
              className="mt-1.5 flex items-center gap-1 text-[11px] text-neutral-500 hover:text-emerald-700 transition-colors"
            >
              <Store className="w-3 h-3 text-neutral-400 flex-shrink-0" />
              <span className="truncate max-w-[120px] font-medium">{product.shopName}</span>
              <span className="text-neutral-300">•</span>
              <span className="text-neutral-500">{product.shopDistance}</span>
            </NextLink>
          )}
        </div>

        {/* Pricing and Cart Add Controls */}
        <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-bold text-neutral-900">
                ₹{product.price}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-[11px] sm:text-xs text-neutral-400 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            <div className="text-[10px] text-emerald-700 font-medium">
              Local retail price
            </div>
          </div>

          <div className="flex-shrink-0">
            <ProductQuantityControl
              quantity={quantity}
              onIncrement={quantity === 0 ? handleAdd : handleIncrement}
              onDecrement={handleDecrement}
              size="sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
