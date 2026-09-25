"use client";

import React from "react";
import Link from "next/link";
import PortalLayout from "@/components/PortalLayout";
import Header from "@/components/Header";
import { useShopkeeper } from "@/context/ShopkeeperContext";
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Boxes,
  PlusCircle,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function DashboardPage() {
  const { businessProfile, products, orders, inventoryStats } = useShopkeeper();

  const storeName = businessProfile.businessName || "Jitu Electronics";

  // Dashboard metrics from requirement 6:
  // Products: 24, Orders: 12, Sales: ₹8,450, Inventory: Good
  const metrics = [
    {
      title: "Products",
      value: products.length || "24",
      sub: "Active in catalog",
      icon: Package,
      href: "/products",
    },
    {
      title: "Orders",
      value: "12",
      sub: "3 waiting to pack",
      icon: ShoppingBag,
      href: "/orders",
    },
    {
      title: "Sales",
      value: "₹8,450",
      sub: "Today's revenue",
      icon: TrendingUp,
      href: "/sales",
    },
    {
      title: "Inventory",
      value: "Good",
      sub: `${inventoryStats.lowStock} low stock items`,
      icon: Boxes,
      href: "/inventory",
    },
  ];

  return (
    <PortalLayout>
      <Header
        title={`Welcome, ${storeName} 👋`}
        description="Here is an overview of your local business on LocalHub today."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* 4 Simple Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {metrics.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-300 hover:shadow-xs transition-all group"
              >
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-600">
                    {card.title}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-slate-50 group-hover:bg-blue-50 text-slate-600 group-hover:text-blue-600 flex items-center justify-center transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {card.value}
                </div>

                <div className="mt-1 text-xs text-slate-400 group-hover:text-blue-600 transition-colors flex items-center justify-between">
                  <span>{card.sub}</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* 4 Main Action Buttons (Requirement 6) */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <Link
              href="/products/add"
              className="py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl shadow-xs font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span>+ Add Product</span>
            </Link>

            <Link
              href="/orders"
              className="py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl shadow-2xs font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-slate-500 shrink-0" />
              <span>View Orders</span>
            </Link>

            <Link
              href="/products"
              className="py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl shadow-2xs font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Package className="w-4 h-4 text-slate-500 shrink-0" />
              <span>Manage Products</span>
            </Link>

            <Link
              href="/sales"
              className="py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl shadow-2xs font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <TrendingUp className="w-4 h-4 text-slate-500 shrink-0" />
              <span>View Sales</span>
            </Link>
          </div>
        </div>

        {/* Recent Orders Preview */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Recent Orders
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                New customer orders placed from your neighborhood
              </p>
            </div>
            <Link
              href="/orders"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {orders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <ShoppingBag className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">
                        Order #{order.id}
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          order.status === "New"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : order.status === "Confirmed"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Customer: <span className="font-medium text-slate-700">{order.customer}</span> • {order.items.length} item(s)
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 text-right">
                  <div>
                    <span className="text-sm font-bold text-slate-900">
                      ₹{order.total.toLocaleString()}
                    </span>
                    <span className="block text-[11px] text-emerald-600 font-medium">
                      {order.paymentStatus}
                    </span>
                  </div>

                  <Link
                    href={`/orders?view=${order.id}`}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                  >
                    View Order
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Simple Store Status Banner */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                LocalHub Verified Merchant Active
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Nearby customers within 5 km can discover and order directly from {storeName}.
              </p>
            </div>
          </div>

          <Link
            href="/profile"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 underline"
          >
            Edit Store Details
          </Link>
        </div>
      </div>
    </PortalLayout>
  );
}
