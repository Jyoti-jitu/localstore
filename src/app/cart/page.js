"use client";

import React from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import CartItem from "@/components/CartItem";
import CartSummary from "@/components/CartSummary";
import EmptyState from "@/components/EmptyState";
import {
  ShoppingBag,
  Store,
  Trash2,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Truck,
  Sparkles
} from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated, openAuthModal } = useAuth();
  const {
    items,
    groupedByStore,
    totalItems,
    itemsSubtotal,
    deliveryFee,
    platformFee,
    discount,
    grandTotal,
    clearCart,
    updateQuantity,
    removeFromCart,
    storeCount
  } = useCart();

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      openAuthModal("signin", "/checkout");
    } else {
      router.push("/checkout");
    }
  };

  if (totalItems === 0) {
    return (
      <div className="min-h-[70vh] bg-[#fbfbfb] py-12 flex items-center justify-center">
        <div className="max-w-md w-full px-4">
          <EmptyState
            type="cart"
            title="Your Cart is Empty"
            description="Looks like you haven't added anything yet. Discover fresh products from verified shops right in your neighborhood."
            actionLabel="Discover Neighborhood Shops"
            actionHref="/explore"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbfb] py-3 sm:py-8 pb-28 md:pb-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        {/* Cart Top Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
          <div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight flex items-center gap-2">
              <span>Your Cart</span>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.2 rounded-full">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
            </h1>
            <p className="text-[11px] sm:text-sm text-neutral-500 mt-0.5">
              Items are grouped by neighborhood shop
            </p>
          </div>

          <button
            onClick={clearCart}
            className="text-xs font-semibold text-neutral-400 hover:text-rose-600 transition-colors flex items-center gap-1.5 p-2 rounded-xl hover:bg-neutral-100"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear all items</span>
          </button>
        </div>

        {/* Multi-store Banner */}
        {storeCount > 1 && (
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Multi-Store Notice:</strong> Your items are sourced from{" "}
              <strong>{storeCount} separate neighborhood shops</strong>. Each shop will prepare and dispatch its items directly to ensure the freshest quality.
            </div>
          </div>
        )}

        {/* Content Layout: Store Groups (Left) + Bill Summary (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Store Groups */}
          <div className="lg:col-span-8 space-y-6">
            {Object.values(groupedByStore).map((storeGroup) => (
              <div
                key={storeGroup.shopId}
                className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs overflow-hidden"
              >
                {/* Store Header in Cart */}
                <div className="bg-neutral-50 px-5 py-4 border-b border-neutral-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-emerald-700 shadow-2xs">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <NextLink
                        href={`/shop/${storeGroup.shopId}`}
                        className="font-bold text-sm sm:text-base text-neutral-900 hover:text-emerald-700 transition-colors"
                      >
                        {storeGroup.shopName}
                      </NextLink>
                      <div className="text-[11px] text-neutral-500 flex items-center gap-1.5">
                        <span>{storeGroup.shopDistance} away</span>
                        <span>•</span>
                        <span>Direct neighborhood dispatch</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-neutral-400 font-medium">Subtotal</span>
                    <div className="text-sm sm:text-base font-extrabold text-neutral-900">
                      ₹{storeGroup.subtotal}
                    </div>
                  </div>
                </div>

                {/* Items in this Store */}
                <div className="p-4 sm:p-5 divide-y divide-neutral-100">
                  {storeGroup.items.map((item) => (
                    <CartItem
                      key={item.product.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeFromCart}
                    />
                  ))}
                </div>

                {/* Store fulfillment tag */}
                <div className="bg-neutral-50/50 px-5 py-2.5 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Fulfilled in 25–35 min</span>
                  </div>
                  <NextLink
                    href={`/shop/${storeGroup.shopId}`}
                    className="font-semibold text-emerald-700 hover:underline"
                  >
                    + Add more from this store
                  </NextLink>
                </div>
              </div>
            ))}
          </div>

          {/* Bill Summary Sticky Sidebar */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <CartSummary
              showCheckoutButton={true}
              onProceed={handleProceedToCheckout}
            />

            <div className="p-4 rounded-2xl bg-white border border-neutral-200 text-xs text-neutral-500 space-y-2">
              <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>LocalStore Promise</span>
              </div>
              <p className="leading-relaxed">
                By purchasing through LocalStore, you are directly supporting small neighborhood businesses in Bhubaneswar.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bottom Checkout Action Bar */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 z-30 p-3 bg-white/95 backdrop-blur-md border-t border-neutral-200 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] text-neutral-400 font-medium uppercase leading-tight">
              Total Amount
            </div>
            <div className="text-base font-extrabold text-neutral-900 leading-tight">
              ₹{grandTotal}
            </div>
          </div>
          <button
            onClick={handleProceedToCheckout}
            className="flex-1 max-w-[220px] py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
