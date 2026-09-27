"use client";

import React from "react";

export function ProductSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-2xl border border-neutral-200/80 overflow-hidden animate-pulse shadow-xs">
      <div className="pt-[85%] bg-neutral-200/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      </div>
      <div className="p-3.5 space-y-2.5">
        <div className="h-3 w-16 bg-neutral-200 rounded-md" />
        <div className="h-4 w-full bg-neutral-200 rounded-md" />
        <div className="h-3 w-2/3 bg-neutral-200 rounded-md" />
        <div className="pt-2 flex items-center justify-between">
          <div className="h-5 w-14 bg-neutral-200 rounded-md" />
          <div className="h-7 w-16 bg-neutral-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function StoreSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-2xl border border-neutral-200/80 overflow-hidden animate-pulse shadow-xs">
      <div className="h-40 sm:h-44 bg-neutral-200/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-3.5 w-24 bg-neutral-200 rounded-md" />
          <div className="h-3.5 w-16 bg-neutral-200 rounded-md" />
        </div>
        <div className="h-5 w-48 bg-neutral-200 rounded-md" />
        <div className="h-3.5 w-3/4 bg-neutral-200 rounded-md" />
        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
          <div className="h-4 w-24 bg-neutral-200 rounded-md" />
          <div className="h-7 w-20 bg-neutral-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function CategoryCompactSkeleton() {
  return (
    <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl flex-shrink-0 w-20 sm:w-24 text-center animate-pulse">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-neutral-200/80 border border-neutral-200 relative overflow-hidden" />
      <div className="h-3 w-14 bg-neutral-200 rounded-md mt-1" />
    </div>
  );
}

export function CategoryCircleSkeleton() {
  return (
    <div className="flex flex-col items-center animate-pulse min-w-0">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-neutral-200/80 flex-shrink-0" />
      <div className="h-2.5 w-10 bg-neutral-200 rounded-sm mt-1.5" />
    </div>
  );
}

export function OrderSkeleton() {
  return (
    <div className="p-4 sm:p-5 bg-white rounded-2xl border border-neutral-200/80 space-y-4 animate-pulse shadow-xs">
      <div className="flex justify-between items-center">
        <div className="h-4 w-28 bg-neutral-200 rounded-md" />
        <div className="h-6 w-20 bg-neutral-200 rounded-full" />
      </div>
      <div className="h-5 w-44 bg-neutral-200 rounded-md" />
      <div className="h-14 w-full bg-neutral-100 rounded-xl" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-5 w-24 bg-neutral-200 rounded-md" />
        <div className="h-8 w-28 bg-neutral-200 rounded-xl" />
      </div>
    </div>
  );
}

export function AddressSkeleton() {
  return (
    <div className="p-4 sm:p-5 bg-white rounded-2xl border border-neutral-200/80 animate-pulse space-y-3 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-neutral-200" />
          <div className="h-4 w-20 bg-neutral-200 rounded-md" />
        </div>
        <div className="h-4 w-12 bg-neutral-200 rounded-md" />
      </div>
      <div className="h-4 w-32 bg-neutral-200 rounded-md" />
      <div className="h-3.5 w-48 bg-neutral-200 rounded-md" />
      <div className="h-3.5 w-36 bg-neutral-200 rounded-md" />
      <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-100">
        <div className="h-7 w-16 bg-neutral-200 rounded-lg" />
        <div className="h-7 w-16 bg-neutral-200 rounded-lg" />
      </div>
    </div>
  );
}

export function ShopHeaderSkeleton() {
  return (
    <div className="bg-white border-b border-neutral-200 animate-pulse">
      <div className="h-44 sm:h-64 bg-neutral-200/80 relative overflow-hidden" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16 pb-6 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="flex items-end gap-3 sm:gap-4">
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-neutral-300 border-4 border-white shadow-md flex-shrink-0" />
            <div className="space-y-2 pb-1">
              <div className="h-6 w-48 sm:w-64 bg-neutral-200 rounded-md" />
              <div className="h-4 w-32 bg-neutral-200 rounded-md" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-24 bg-neutral-200 rounded-xl" />
            <div className="h-9 w-24 bg-neutral-200 rounded-xl" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-5 mt-4 border-t border-neutral-100">
          <div className="h-10 bg-neutral-100 rounded-xl" />
          <div className="h-10 bg-neutral-100 rounded-xl" />
          <div className="h-10 bg-neutral-100 rounded-xl" />
          <div className="h-10 bg-neutral-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

