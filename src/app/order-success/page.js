"use client";

import React, { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import NextLink from "next/link";
import confetti from "canvas-confetti";
import { useOrders } from "@/context/OrdersContext";
import { getOrderById as getSupabaseOrderById } from "@/lib/supabase/db";
import {
  CheckCircle2,
  Clock,
  Store,
  MapPin,
  ArrowRight,
  PackageCheck,
  ShoppingBag,
  Sparkles
} from "lucide-react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "LS10245";
  const { getOrderById, orders } = useOrders();
  const [remoteOrder, setRemoteOrder] = React.useState(null);

  const contextOrder =
    getOrderById(orderId) ||
    orders?.find((o) => o.orderId?.toLowerCase() === orderId?.toLowerCase());

  const order = contextOrder || remoteOrder;

  useEffect(() => {
    if (!contextOrder && orderId) {
      getSupabaseOrderById(orderId).then((data) => {
        if (data) setRemoteOrder(data);
      });
    }
  }, [contextOrder, orderId]);

  useEffect(() => {
    // Fire confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#fbfbfb] py-4 sm:py-12 pb-24 md:pb-12">
      <div className="max-w-2xl mx-auto px-3.5 sm:px-6">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 p-4 sm:p-10 shadow-sm text-center space-y-4 sm:space-y-6">
          {/* Success Check Icon */}
          <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner ring-6 sm:ring-8 ring-emerald-50/60 animate-in zoom-in-50 duration-300">
            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.2]" />
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold bg-emerald-100 text-emerald-800 mb-1.5 sm:mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Order Confirmed</span>
            </span>
            <h1 className="text-xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Order Placed Successfully!
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-0.5 sm:mt-1">
              Your order <span className="font-bold text-neutral-900">#{order?.orderId || orderId}</span> has been received by {order?.shopName}.
            </p>
          </div>

          {/* Delivery Window Highlight */}
          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-center gap-2.5 sm:gap-3 text-xs sm:text-sm text-emerald-900">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700 flex-shrink-0" />
            <span>
              Estimated arrival: <strong>{order?.estimatedDelivery || "25–35 minutes"}</strong>
            </span>
          </div>

          {/* Order Details Snippet */}
          {order && (
            <div className="bg-neutral-50 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-neutral-200/80 text-left space-y-2.5 sm:space-y-3.5 text-xs text-neutral-700">
              <div className="flex items-center justify-between pb-2.5 border-b border-neutral-200/60">
                <div className="flex items-center gap-2 font-bold text-neutral-900">
                  <Store className="w-4 h-4 text-emerald-600" />
                  <span>{order.shopName}</span>
                </div>
                <span className="font-bold text-neutral-900">₹{order.total}</span>
              </div>

              {/* Items */}
              <div className="space-y-1">
                <div className="text-[10px] sm:text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Items Ordered
                </div>
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-neutral-600 text-xs">
                    <span>
                      {item.name} <strong className="text-neutral-900">× {item.quantity}</strong>
                    </span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Delivery Address */}
              <div className="pt-2 border-t border-neutral-200/60 flex items-start gap-1.5 text-neutral-500 text-[11px] sm:text-xs">
                <MapPin className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-1">
                  Delivering to: {order.deliveryAddress?.street || "Jayadev Vihar"}, {order.deliveryAddress?.city || "Bhubaneswar"}
                </span>
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-1 sm:pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3">
            <NextLink
              href={`/orders/${order?.orderId || orderId}`}
              className="w-full sm:w-auto px-5 py-3 sm:px-6 sm:py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <PackageCheck className="w-4 h-4" />
              <span>Track Your Order</span>
            </NextLink>

            <NextLink
              href="/explore"
              className="w-full sm:w-auto px-5 py-3 sm:px-6 sm:py-3.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </NextLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fbfbfb] py-12 flex items-center justify-center">
          <div className="w-64 h-64 bg-white rounded-3xl animate-pulse" />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
