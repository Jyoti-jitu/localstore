"use client";

import React from "react";
import NextLink from "next/link";
import { ArrowRight, ShieldCheck, Truck, Sparkles, AlertCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartSummary({ showCheckoutButton = true, onProceed }) {
  const {
    itemsSubtotal,
    deliveryFee,
    platformFee,
    discount,
    grandTotal,
    totalItems,
    storeCount
  } = useCart();

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 shadow-xs">
      <h3 className="font-bold text-neutral-900 text-base mb-4 flex items-center justify-between">
        <span>Bill Summary</span>
        <span className="text-xs font-normal text-neutral-500">
          {totalItems} {totalItems === 1 ? "item" : "items"}
        </span>
      </h3>

      {/* Breakdown */}
      <div className="space-y-2.5 text-xs text-neutral-600 pb-4 border-b border-neutral-100">
        <div className="flex justify-between items-center">
          <span>Items Total</span>
          <span className="font-semibold text-neutral-900">₹{itemsSubtotal}</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <span>Local Delivery Fee</span>
            <span className="text-[10px] text-neutral-400">({storeCount} {storeCount === 1 ? "store" : "stores"})</span>
          </div>
          <span className="font-semibold text-neutral-900">
            {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span>Platform Fee</span>
          <span className="font-semibold text-neutral-900">₹{platformFee}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between items-center text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg font-semibold">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Local Shop Discount</span>
            </span>
            <span>-₹{discount}</span>
          </div>
        )}
      </div>

      {/* Grand Total */}
      <div className="py-4 border-b border-neutral-100 flex justify-between items-baseline">
        <div>
          <div className="text-sm font-bold text-neutral-900">To Pay</div>
          <div className="text-[11px] text-neutral-400">Inclusive of all local taxes</div>
        </div>
        <div className="text-xl font-extrabold text-neutral-900">
          ₹{grandTotal}
        </div>
      </div>

      {/* Multi-store fulfillment note */}
      {storeCount > 1 && (
        <div className="mt-3.5 p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="leading-snug">
            <strong>Multi-Store Order:</strong> Items will be prepared freshly and dispatched directly from {storeCount} neighborhood shops.
          </div>
        </div>
      )}

      {/* Checkout Button */}
      {showCheckoutButton && (
        <div className="mt-5">
          {onProceed ? (
            <button
              onClick={onProceed}
              disabled={totalItems === 0}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md transition-all active:scale-[0.98]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <NextLink
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-all active:scale-[0.98]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </NextLink>
          )}
        </div>
      )}

      {/* Trust reassurance */}
      <div className="mt-4 pt-3 flex items-center justify-center gap-1.5 text-[11px] text-neutral-500 font-medium">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Direct merchant support & local quality guarantee</span>
      </div>
    </div>
  );
}
