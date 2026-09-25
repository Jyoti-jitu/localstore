"use client";

import React from "react";
import NextLink from "next/link";
import { Store, ChevronRight, RotateCcw, PackageCheck, Clock, MapPin } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useProducts } from "@/hooks/useSupabaseData";

export default function OrderCard({ order }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { products: allDbProducts } = useProducts();
  const pool = allDbProducts || [];

  const isDelivered = order.status === "delivered";
  const isCancelled = order.status === "cancelled";
  const isActive = !isDelivered && !isCancelled;

  const handleReorder = () => {
    let count = 0;
    order.items.forEach((item) => {
      const match = pool.find((p) => p.id === item.id);
      if (match) {
        addToCart(match, item.quantity);
        count += item.quantity;
      }
    });
    showToast(`Added ${count || order.items.length} items from ${order.shopName} to cart!`);
  };

  const getStatusBadge = () => {
    if (isDelivered) {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          Delivered
        </span>
      );
    }
    if (isCancelled) {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          Cancelled
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5 animate-pulse">
        <Clock className="w-3 h-3" />
        <span>{order.statusLabel || "In Progress"}</span>
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/90 p-4 sm:p-5 hover:border-neutral-300 hover:shadow-md transition-all">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-neutral-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Order #{order.orderId}
            </span>
            <span className="text-neutral-300">•</span>
            <span className="text-xs text-neutral-500">{order.date}</span>
          </div>

          <NextLink
            href={`/shop/${order.shopId}`}
            className="flex items-center gap-1.5 mt-1 text-sm sm:text-base font-bold text-neutral-900 hover:text-emerald-700 transition-colors"
          >
            <Store className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{order.shopName}</span>
          </NextLink>
        </div>

        <div>{getStatusBadge()}</div>
      </div>

      {/* Items Preview */}
      <div className="py-3 text-xs text-neutral-600 space-y-1">
        <div className="font-medium text-neutral-900">
          {order.items.length} {order.items.length === 1 ? "item" : "items"}:
        </div>
        <div className="text-neutral-600 line-clamp-1">
          {order.items.map((i) => `${i.name} (${i.quantity}x)`).join(", ")}
        </div>
        <div className="flex items-center gap-1 text-[11px] text-neutral-400 mt-1">
          <MapPin className="w-3 h-3 text-neutral-400" />
          <span className="truncate">Delivered to: {order.deliveryAddress?.street || "Jayadev Vihar"}</span>
        </div>
      </div>

      {/* Footer Details & CTAs */}
      <div className="pt-3.5 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[11px] text-neutral-400 font-medium">Total Amount</div>
          <div className="text-base font-extrabold text-neutral-900">
            ₹{order.total}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isActive ? (
            <NextLink
              href={`/orders/${order.orderId}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <span>Track Order</span>
              <ChevronRight className="w-4 h-4" />
            </NextLink>
          ) : (
            <>
              <button
                onClick={handleReorder}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-neutral-100 hover:bg-emerald-50 hover:text-emerald-700 text-neutral-700 rounded-xl text-xs font-semibold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reorder</span>
              </button>
              <NextLink
                href={`/orders/${order.orderId}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-neutral-200 hover:bg-neutral-50 text-neutral-800 rounded-xl text-xs font-semibold transition-colors"
              >
                <span>View Details</span>
              </NextLink>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
