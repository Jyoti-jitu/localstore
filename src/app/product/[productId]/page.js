"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import NextLink from "next/link";
import { useProduct, useProducts, useShop } from "@/hooks/useSupabaseData";
import ProductCard from "@/components/ProductCard";
import ProductQuantityControl from "@/components/ProductQuantityControl";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useToast } from "@/context/ToastContext";
import {
  Star,
  Store,
  MapPin,
  Clock,
  ShieldCheck,
  Heart,
  Share2,
  ChevronLeft,
  Truck,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Loader2,
  AlertCircle
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.productId;

  const { getItemQuantity, addToCart, updateQuantity } = useCart();
  const { isProductFavorite, toggleFavoriteProduct } = useFavorites();
  const { showToast } = useToast();

  const { product, loading: productLoading } = useProduct(productId);
  const { shop } = useShop(product?.shopId);
  const { products: allDbProducts } = useProducts();
  const pool = allDbProducts || [];

  const quantity = product ? getItemQuantity(product.id) : 0;
  const isFav = product ? isProductFavorite(product.id) : false;

  const relatedProducts = product
    ? pool
        .filter(
          (p) =>
            p.id !== product.id &&
            (p.shopId === product.shopId || p.category === product.category)
        )
        .slice(0, 5)
    : [];

  const handleAddToCart = () => {
    addToCart(product, 1);
    showToast(`Added ${product.name} to cart!`);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("Product link copied!");
    } else {
      showToast("Product URL: " + window.location.href);
    }
  };

  if (productLoading) {
    return (
      <div className="min-h-screen bg-[#fbfbfb] py-20 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
        <p className="text-xs text-neutral-500 font-medium">Loading product details from Supabase...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#fbfbfb] py-20 flex flex-col items-center justify-center text-center px-4">
        <AlertCircle className="w-12 h-12 text-neutral-400 mb-3" />
        <h2 className="text-lg font-bold text-neutral-900">Product Not Found</h2>
        <p className="text-xs text-neutral-500 mt-1 max-w-sm">
          We could not find this product in our live database.
        </p>
        <NextLink
          href="/explore"
          className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
        >
          Browse Products
        </NextLink>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbfb] py-3 sm:py-8 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-8">
        {/* Breadcrumb / Back button */}
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 font-semibold text-neutral-700 hover:text-neutral-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <NextLink href="/" className="hover:text-emerald-700">Home</NextLink>
            <span>/</span>
            <NextLink href="/explore" className="hover:text-emerald-700">Shops</NextLink>
            <span>/</span>
            <NextLink href={`/shop/${shop.id}`} className="hover:text-emerald-700">{shop.name}</NextLink>
            <span>/</span>
            <span className="text-neutral-800 font-medium truncate max-w-[200px]">{product.name}</span>
          </div>
        </div>

        {/* Main Product Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-8 p-4 sm:p-10">
            {/* Left: Product Image Showcase */}
            <div className="md:col-span-6 space-y-3 sm:space-y-4">
              <div className="relative pt-[70%] sm:pt-[90%] rounded-xl sm:rounded-2xl overflow-hidden bg-neutral-50 border border-neutral-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {product.discountPercent > 0 && (
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-lg text-xs font-extrabold bg-rose-600 text-white shadow-sm">
                    {product.discountPercent}% OFF
                  </span>
                )}

                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="p-2.5 rounded-full bg-white/90 hover:bg-white text-neutral-700 shadow-sm backdrop-blur-xs transition-transform active:scale-95"
                    title="Share product"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      toggleFavoriteProduct(product.id);
                      showToast(isFav ? "Removed from favorites" : "Saved to favorites!");
                    }}
                    className="p-2.5 rounded-full bg-white/90 hover:bg-white text-neutral-700 shadow-sm backdrop-blur-xs transition-transform active:scale-95"
                    title="Favorite product"
                  >
                    <Heart
                      className={`w-4 h-4 ${isFav ? "fill-rose-500 text-rose-500" : ""}`}
                    />
                  </button>
                </div>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-neutral-600">
                <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>100% Genuine Local Product</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                  <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Delivered in 20–35 mins</span>
                </div>
              </div>
            </div>

            {/* Right: Product Details & Purchase Controls */}
            <div className="md:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Brand & Stock */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    {product.brand}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>In Stock</span>
                  </span>
                </div>

                {/* Product Title */}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight leading-snug">
                  {product.name}
                </h1>

                {/* Rating & Review */}
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-900 font-bold px-2.5 py-1 rounded-lg">
                    <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
                    <span>{product.rating}</span>
                  </div>
                  <span className="text-neutral-500">
                    ({product.reviewsCount} customer reviews)
                  </span>
                </div>

                {/* Pack / Unit Quantity */}
                <div className="pt-1">
                  <div className="text-xs font-semibold text-neutral-500 mb-1">
                    Pack Size / Weight
                  </div>
                  <div className="inline-block px-3.5 py-1.5 rounded-xl border-2 border-emerald-600 bg-emerald-50 text-emerald-900 text-xs font-bold">
                    {product.quantity}
                  </div>
                </div>

                {/* Price Display */}
                <div className="pt-2 pb-4 border-b border-neutral-100 flex items-baseline gap-3">
                  <span className="text-3xl font-black text-neutral-900">
                    ₹{product.price}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-base text-neutral-400 line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                  <span className="text-xs text-neutral-500 font-medium">
                    (Standard offline retail price)
                  </span>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-400">
                    Product Description
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Information Table */}
                {product.information && (
                  <div className="space-y-2 pt-2">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-400">
                      Product Specifications
                    </h3>
                    <div className="bg-neutral-50 rounded-2xl p-4 divide-y divide-neutral-200/60 text-xs">
                      {Object.entries(product.information).map(([key, value]) => (
                        <div key={key} className="py-2 first:pt-0 last:pb-0 flex justify-between gap-4">
                          <span className="text-neutral-500 font-medium">{key}</span>
                          <span className="text-neutral-900 font-semibold text-right">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Local Merchant Information Card */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Sold & Fulfilled Locally By
                </div>
                <div className="flex items-center justify-between gap-3">
                  <NextLink
                    href={`/shop/${shop.id}`}
                    className="flex items-center gap-2 group"
                  >
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border border-neutral-200 flex-shrink-0">
                      <img src={shop.avatar || shop.image} alt={shop.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-neutral-900 group-hover:text-emerald-700 transition-colors">
                        {shop.name}
                      </div>
                      <div className="text-xs text-neutral-500 flex items-center gap-1.5 mt-0.5">
                        <span className="text-amber-600 font-semibold">★ {shop.rating}</span>
                        <span>•</span>
                        <span>{shop.distanceText}</span>
                        <span>•</span>
                        <span>{shop.locality}</span>
                      </div>
                    </div>
                  </NextLink>

                  <NextLink
                    href={`/shop/${shop.id}`}
                    className="px-3 py-1.5 bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-semibold rounded-xl transition-colors"
                  >
                    Visit Shop
                  </NextLink>
                </div>
              </div>

              {/* Bottom CTA / Quantity Controls */}
              <div className="pt-4 border-t border-neutral-100 flex items-center gap-4">
                {quantity === 0 ? (
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <span>Add to Cart</span>
                    <span>•</span>
                    <span>₹{product.price}</span>
                  </button>
                ) : (
                  <div className="flex-1 flex items-center justify-between p-2 bg-emerald-50 rounded-xl border border-emerald-200">
                    <span className="text-xs font-bold text-emerald-900 px-3">
                      {quantity} in cart (₹{quantity * product.price})
                    </span>
                    <ProductQuantityControl
                      quantity={quantity}
                      onIncrement={() => updateQuantity(product.id, 1)}
                      onDecrement={() => updateQuantity(product.id, -1)}
                      size="md"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="space-y-4 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">
                  More from {shop.name}
                </h2>
                <p className="text-xs text-neutral-500">
                  Other neighborhood essentials from this store
                </p>
              </div>

              <NextLink
                href={`/shop/${shop.id}`}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
              >
                View all store items →
              </NextLink>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} showShop={false} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Fixed Bottom Purchase Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-white/95 backdrop-blur-md border-t border-neutral-200 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] text-neutral-400 font-bold uppercase leading-tight">
            {product.quantity}
          </div>
          <div className="text-lg font-black text-neutral-900 leading-tight">
            ₹{product.price}
          </div>
        </div>

        <div className="flex-1 max-w-[200px]">
          {quantity === 0 ? (
            <button
              onClick={handleAddToCart}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
            >
              <span>Add to Cart</span>
            </button>
          ) : (
            <div className="flex items-center justify-between p-1 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-xs font-bold text-emerald-900 px-2">
                {quantity} in cart
              </span>
              <ProductQuantityControl
                quantity={quantity}
                onIncrement={() => updateQuantity(product.id, 1)}
                onDecrement={() => updateQuantity(product.id, -1)}
                size="sm"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
