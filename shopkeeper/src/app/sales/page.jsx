"use client";

import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import Header from "@/components/Header";
import {
  TrendingUp,
  ShoppingBag,
  CheckCircle2,
  Calendar,
  ArrowUpRight,
  Download,
} from "lucide-react";

export default function TrackSalesPage() {
  const [timeFilter, setTimeFilter] = useState("7 Days");

  // Filter options from requirement 12: 7 Days, 30 Days, 3 Months
  const filters = ["7 Days", "30 Days", "3 Months"];

  // Data for the simple sales chart based on filter
  const chartDataMap = {
    "7 Days": [
      { label: "Mon", amount: 4200, height: 42 },
      { label: "Tue", amount: 5600, height: 56 },
      { label: "Wed", amount: 3800, height: 38 },
      { label: "Thu", amount: 7100, height: 71 },
      { label: "Fri", amount: 6400, height: 64 },
      { label: "Sat", amount: 8900, height: 89 },
      { label: "Sun (Today)", amount: 9820, height: 98 },
    ],
    "30 Days": [
      { label: "Week 1", amount: 10450, height: 52 },
      { label: "Week 2", amount: 13200, height: 66 },
      { label: "Week 3", amount: 11170, height: 55 },
      { label: "Week 4", amount: 11000, height: 55 },
    ],
    "3 Months": [
      { label: "July", amount: 38400, height: 75 },
      { label: "August", amount: 41200, height: 82 },
      { label: "September", amount: 45820, height: 91 },
    ],
  };

  const currentChartData = chartDataMap[timeFilter] || chartDataMap["7 Days"];

  const recentTransactions = [
    {
      id: "TXN-8819",
      customer: "Rahul Kumar",
      items: "Samsung Charger + USB Cable",
      amount: 1098,
      time: "Today, 02:40 PM",
      status: "Completed",
    },
    {
      id: "TXN-8818",
      customer: "Priya Sharma",
      items: "Bluetooth Speaker",
      amount: 2199,
      time: "Today, 11:15 AM",
      status: "Completed",
    },
    {
      id: "TXN-8817",
      customer: "Amit Patel",
      items: "Samsung Type-C Cable × 2",
      amount: 598,
      time: "Yesterday, 06:20 PM",
      status: "Completed",
    },
    {
      id: "TXN-8816",
      customer: "Sneha Das",
      items: "Smart Fitness Band",
      amount: 1899,
      time: "Yesterday, 04:05 PM",
      status: "Completed",
    },
    {
      id: "TXN-8815",
      customer: "Rajesh Mohanty",
      items: "Wireless Optical Mouse",
      amount: 499,
      time: "Sep 23, 01:30 PM",
      status: "Completed",
    },
  ];

  return (
    <PortalLayout>
      <Header
        title="Track Sales"
        description="Monitor store earnings, daily sales trends, and order fulfillment."
        actions={
          <button
            type="button"
            onClick={() => alert("Sales statement downloaded as CSV.")}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Download Statement</span>
          </button>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* 4 Sales Stat Cards (Requirement 12) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Total Sales
              </span>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              ₹45,820
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18% from last month</span>
            </p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Today&apos;s Sales
              </span>
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 tracking-tight">
              ₹3,250
            </div>
            <p className="text-xs text-slate-400 mt-1">4 neighborhood orders</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Total Orders
              </span>
              <ShoppingBag className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              128
            </div>
            <p className="text-xs text-slate-400 mt-1">Lifetime customer orders</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Completed Orders
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">
              116
            </div>
            <p className="text-xs text-slate-400 mt-1">90.6% fulfillment rate</p>
          </div>
        </div>

        {/* Simple Sales Chart Section (Requirement 12) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Sales Overview
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Revenue generated from local buyers
              </p>
            </div>

            {/* Time filters: 7 Days, 30 Days, 3 Months */}
            <div className="inline-flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200 self-start sm:self-auto">
              {filters.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setTimeFilter(f)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    timeFilter === f
                      ? "bg-white text-blue-600 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Simple Clean Bar Chart */}
          <div className="pt-6 pb-2">
            <div className="h-56 w-full flex items-end justify-between gap-2 sm:gap-6 px-2 sm:px-6">
              {currentChartData.map((item, idx) => (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-2 group h-full justify-end"
                >
                  {/* Tooltip on hover */}
                  <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ₹{item.amount.toLocaleString()}
                  </span>

                  {/* Clean Bar */}
                  <div
                    style={{ height: `${item.height}%` }}
                    className="w-full max-w-[48px] bg-blue-600 hover:bg-blue-700 rounded-t-md transition-all duration-300 shadow-2xs"
                  />

                  {/* Label */}
                  <span className="text-[11px] font-medium text-slate-500 text-center truncate max-w-full">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">
              Recent Completed Sales
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Settled payments automatically credited to your merchant balance
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-900">
                      {tx.customer}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {tx.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{tx.items}</p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="text-xs text-slate-400">{tx.time}</span>
                  <span className="text-sm font-bold text-emerald-600">
                    +₹{tx.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
