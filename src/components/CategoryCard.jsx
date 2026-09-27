"use client";

import React from "react";
import NextLink from "next/link";
import {
  ShoppingBag,
  Apple,
  Croissant,
  Pill,
  Smartphone,
  Shirt,
  BookOpen,
  Home,
  Sparkles,
  Wrench,
  Utensils,
  Store
} from "lucide-react";

const ICON_MAP = {
  ShoppingBag,
  Apple,
  Croissant,
  Pill,
  Smartphone,
  Shirt,
  BookOpen,
  Home,
  Sparkles,
  Wrench,
  Utensils,
  Store
};

export default function CategoryCard({ category, isCompact = false }) {
  const isIconUrl = category.icon && (category.icon.startsWith("http") || category.icon.startsWith("/"));
  const IconComponent = ICON_MAP[category.icon] || Store;

  if (isCompact) {
    return (
      <NextLink
        href={`/explore?category=${category.id}`}
        className="flex flex-col items-center gap-1.5 p-2 rounded-xl group transition-transform hover:-translate-y-0.5 flex-shrink-0 w-20 sm:w-24 text-center"
      >
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border border-neutral-200/90 shadow-xs relative overflow-hidden group-hover:border-emerald-500 group-hover:shadow-md transition-all flex items-center justify-center">
          {category.image ? (
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full rounded-xl bg-emerald-50/70 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              {isIconUrl ? (
                <img src={category.icon} alt="" className="w-6 h-6 object-contain" />
              ) : (
                <IconComponent className="w-6 h-6 stroke-[1.8]" />
              )}
            </div>
          )}
        </div>
        <span className="text-xs font-semibold text-neutral-800 line-clamp-1 group-hover:text-emerald-700">
          {category.name}
        </span>
      </NextLink>
    );
  }

  return (
    <NextLink
      href={`/explore?category=${category.id}`}
      className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white hover:border-emerald-500 hover:shadow-lg transition-all duration-300 flex flex-col"
    >
      <div className="relative h-28 sm:h-36 w-full overflow-hidden bg-neutral-100">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute top-2.5 left-2.5 p-1.5 rounded-lg bg-white/90 backdrop-blur-xs text-emerald-800 shadow-xs flex items-center justify-center">
          {isIconUrl ? (
            <img src={category.icon} alt="" className="w-4 h-4 object-contain" />
          ) : (
            <IconComponent className="w-4 h-4" />
          )}
        </div>
        <div className="absolute bottom-2.5 left-3 right-3 text-white">
          <h3 className="font-bold text-sm sm:text-base leading-tight drop-shadow-xs">
            {category.name}
          </h3>
        </div>
      </div>
      <div className="p-3 bg-white flex-1 flex flex-col justify-between">
        <p className="text-xs text-neutral-500 line-clamp-1">{category.description}</p>
        <span className="text-[11px] font-semibold text-emerald-600 mt-2 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          Explore stores →
        </span>
      </div>
    </NextLink>
  );
}
