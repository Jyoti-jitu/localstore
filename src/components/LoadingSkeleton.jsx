"use client";

import React from "react";

export function ProductSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-2xl border border-neutral-200 overflow-hidden animate-pulse">
      <div className="pt-[85%] bg-neutral-200" />
      <div className="p-3.5 space-y-2.5">
        <div className="h-3 w-16 bg-neutral-200 rounded" />
        <div className="h-4 w-full bg-neutral-200 rounded" />
        <div className="h-3 w-2/3 bg-neutral-200 rounded" />
        <div className="pt-2 flex items-center justify-between">
          <div className="h-5 w-14 bg-neutral-200 rounded" />
          <div className="h-7 w-16 bg-neutral-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function StoreSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-2xl border border-neutral-200 overflow-hidden animate-pulse">
      <div className="h-44 bg-neutral-200" />
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-neutral-200 rounded" />
          <div className="h-4 w-16 bg-neutral-200 rounded" />
        </div>
        <div className="h-5 w-48 bg-neutral-200 rounded" />
        <div className="h-3 w-full bg-neutral-200 rounded" />
        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
          <div className="h-4 w-20 bg-neutral-200 rounded" />
          <div className="h-8 w-24 bg-neutral-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function OrderSkeleton() {
  return (
    <div className="p-5 bg-white rounded-2xl border border-neutral-200 space-y-4 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-4 w-32 bg-neutral-200 rounded" />
        <div className="h-6 w-20 bg-neutral-200 rounded-full" />
      </div>
      <div className="h-5 w-44 bg-neutral-200 rounded" />
      <div className="h-16 w-full bg-neutral-100 rounded-xl" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-5 w-24 bg-neutral-200 rounded" />
        <div className="h-8 w-28 bg-neutral-200 rounded-xl" />
      </div>
    </div>
  );
}
