"use client";

import React from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, ArrowRight, Store } from "lucide-react";

export default function StickyCart() {
  const pathname = usePathname();
  const { totalItems, itemsSubtotal, storeCount } = useCart();

  // Hide on cart, checkout, and order confirmation pages
  if (
    totalItems === 0 ||
    pathname === "/cart" ||
    pathname === "/checkout" ||
    pathname.startsWith("/order-success")
  ) {
    return null;
  }

  return (
    <>
      {/* Mobile Sticky Cart Bar (Placed directly above bottom navigation) */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 z-30 p-2.5 animate-in slide-in-from-bottom-2">
        <NextLink
          href="/cart"
          className="flex items-center justify-between px-4 py-3 bg-emerald-700 text-white rounded-2xl shadow-xl border border-emerald-600/50"
        >
          <div className="flex items-center gap-3">
            <div className="relative p-2 bg-emerald-800 rounded-xl">
              <ShoppingBag className="w-5 h-5 text-emerald-200" />
              <span className="absolute -top-1 -right-1 bg-white text-emerald-900 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            </div>
            <div>
              <div className="font-bold text-sm leading-tight">
                {totalItems} {totalItems === 1 ? "item" : "items"} · ₹{itemsSubtotal}
              </div>
              <div className="text-[11px] text-emerald-200 flex items-center gap-1 mt-0.5">
                <Store className="w-3 h-3" />
                <span>
                  {storeCount === 1 ? "From 1 local store" : `From ${storeCount} neighborhood stores`}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-white text-emerald-900 px-3 py-1.5 rounded-xl shadow-xs">
            <span>View Cart</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </NextLink>
      </div>

      {/* Desktop Floating Cart Pill */}
      <div className="hidden md:block fixed bottom-8 right-8 z-30 animate-in fade-in slide-in-from-bottom-3">
        <NextLink
          href="/cart"
          className="group flex items-center gap-4 pl-4 pr-5 py-3.5 bg-neutral-900 hover:bg-emerald-700 text-white rounded-full shadow-2xl border border-neutral-800 transition-all hover:scale-105"
        >
          <div className="relative p-2 rounded-full bg-emerald-600 text-white">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-white text-emerald-900 text-[11px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              {totalItems}
            </span>
          </div>

          <div className="text-left">
            <div className="text-xs text-neutral-400 group-hover:text-emerald-200 font-medium">
              {storeCount === 1 ? "1 local store" : `${storeCount} local stores`}
            </div>
            <div className="text-sm font-bold tracking-tight">
              {totalItems} items · ₹{itemsSubtotal}
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-emerald-400 group-hover:text-white pl-2 border-l border-neutral-700">
            <span>View Cart</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </NextLink>
      </div>
    </>
  );
}
