"use client";

import React, { useState } from "react";
import { useShopkeeper } from "@/context/ShopkeeperContext";
import { Bell, Store } from "lucide-react";
import Link from "next/link";

export default function Header({ title, description, actions }) {
  const { businessProfile } = useShopkeeper();
  const [storeOnline, setStoreOnline] = useState(true);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 lg:top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Left: Page Title & Breadcrumb/Desc */}
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight">
              {title}
            </h1>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                storeOnline
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${storeOnline ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
              {storeOnline ? "Store Open" : "Closed"}
            </span>
          </div>
          {description && (
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {description}
            </p>
          )}
        </div>

        {/* Right Actions & Store Status */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {actions}

          {/* Quick Store Open/Close Toggle */}
          <button
            type="button"
            onClick={() => setStoreOnline(!storeOnline)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Toggle store status"
          >
            <span className="text-slate-500">Status:</span>
            <span className={storeOnline ? "text-emerald-600 font-semibold" : "text-slate-600"}>
              {storeOnline ? "Open" : "Closed"}
            </span>
          </button>

          {/* Business Badge */}
          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-200 text-xs text-slate-600">
            <span className="font-semibold text-slate-800">
              {businessProfile.businessName || "Jitu Electronics"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
