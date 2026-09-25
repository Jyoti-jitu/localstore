"use client";

import React from "react";
import NextLink from "next/link";
import {
  ShoppingBag,
  PackageSearch,
  Heart,
  Search,
  Store,
  Clock,
  ArrowRight
} from "lucide-react";

const ICON_MAP = {
  cart: ShoppingBag,
  orders: PackageSearch,
  favorites: Heart,
  search: Search,
  stores: Store,
  closed: Clock
};

export default function EmptyState({
  type = "search",
  title = "No results found",
  description = "Try adjusting your search or filters to find what you're looking for.",
  actionLabel = "Explore Nearby Shops",
  actionHref = "/explore",
  onAction,
  className = ""
}) {
  const Icon = ICON_MAP[type] || PackageSearch;

  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white rounded-2xl border border-neutral-200/80 shadow-xs ${className}`}
    >
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
        <Icon className="w-8 h-8 sm:w-10 sm:h-10 stroke-[1.5]" />
      </div>

      <h3 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mt-1.5 leading-relaxed">
        {description}
      </p>

      {(actionLabel && (actionHref || onAction)) && (
        <div className="mt-5">
          {onAction ? (
            <button
              onClick={onAction}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-xs"
            >
              <span>{actionLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <NextLink
              href={actionHref}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-xs"
            >
              <span>{actionLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </NextLink>
          )}
        </div>
      )}
    </div>
  );
}
