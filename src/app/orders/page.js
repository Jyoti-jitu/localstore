"use client";

import React, { useState, useMemo } from "react";
import NextLink from "next/link";
import { useOrders } from "@/context/OrdersContext";
import OrderCard from "@/components/OrderCard";
import EmptyState from "@/components/EmptyState";
import { OrderSkeleton } from "@/components/LoadingSkeleton";
import { PackageCheck, Clock, CheckCircle2, XCircle, ChevronLeft } from "lucide-react";

export default function OrdersPage() {
  const { orders, loading } = useOrders();
  const [activeTab, setActiveTab] = useState("active"); // 'active' | 'completed' | 'cancelled'

  const activeOrders = useMemo(
    () => orders.filter((o) => o.status !== "delivered" && o.status !== "cancelled"),
    [orders]
  );

  const completedOrders = useMemo(
    () => orders.filter((o) => o.status === "delivered"),
    [orders]
  );

  const cancelledOrders = useMemo(
    () => orders.filter((o) => o.status === "cancelled"),
    [orders]
  );

  const displayedOrders =
    activeTab === "active"
      ? activeOrders
      : activeTab === "completed"
      ? completedOrders
      : cancelledOrders;

  return (
    <div className="min-h-screen bg-[#fbfbfb] py-3 sm:py-8 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        {/* Header with Back Button */}
        <div>
          <NextLink
            href="/account"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 mb-1.5 sm:mb-2 transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Account</span>
          </NextLink>

          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-700 mb-0.5">
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Order History</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            My Orders
          </h1>
          <p className="text-[11px] sm:text-sm text-neutral-500 mt-0.5">
            Track active neighborhood deliveries or reorder
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-neutral-200 pb-2.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("active")}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold flex-shrink-0 transition-all ${
              activeTab === "active"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Active Orders ({activeOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("completed")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "completed"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completed ({completedOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("cancelled")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "cancelled"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancelled ({cancelledOrders.length})</span>
          </button>
        </div>

        {/* Orders list or empty state */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <OrderSkeleton key={idx} />
            ))}
          </div>
        ) : displayedOrders.length === 0 ? (
          <EmptyState
            type="orders"
            title={`No ${activeTab} orders`}
            description={
              activeTab === "active"
                ? "You have no active orders in progress right now. Order fresh groceries or bakery items from your local shops."
                : `You have no ${activeTab} orders in your history.`
            }
            actionLabel="Discover Local Shops"
            actionHref="/explore"
          />
        ) : (
          <div className="space-y-4">
            {displayedOrders.map((order) => (
              <OrderCard key={order.orderId} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
