"use client";

import React from "react";
import NextLink from "next/link";
import { Trash2 } from "lucide-react";
import ProductQuantityControl from "./ProductQuantityControl";

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  const { product, quantity } = item;

  return (
    <div className="flex items-center gap-3.5 py-3.5 border-b border-neutral-100 last:border-b-0">
      {/* Product Image */}
      <NextLink
        href={`/product/${product.id}`}
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-200"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </NextLink>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
          {product.brand}
        </div>
        <NextLink
          href={`/product/${product.id}`}
          className="text-xs sm:text-sm font-semibold text-neutral-900 hover:text-emerald-700 transition-colors line-clamp-1 block"
        >
          {product.name}
        </NextLink>
        <div className="text-[11px] text-neutral-500 mt-0.5">
          Pack: {product.quantity}
        </div>
        <div className="flex items-baseline gap-1.5 mt-1 sm:hidden">
          <span className="text-xs font-bold text-neutral-900">
            ₹{product.price * quantity}
          </span>
          <span className="text-[10px] text-neutral-400">
            (₹{product.price} each)
          </span>
        </div>
      </div>

      {/* Controls & Subtotal */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <ProductQuantityControl
          quantity={quantity}
          onIncrement={() => onUpdateQuantity(product.id, 1)}
          onDecrement={() => onUpdateQuantity(product.id, -1)}
          size="sm"
        />

        <div className="hidden sm:block text-right min-w-[70px]">
          <div className="text-sm font-bold text-neutral-900">
            ₹{product.price * quantity}
          </div>
          <div className="text-[10px] text-neutral-400">
            ₹{product.price} each
          </div>
        </div>

        <button
          onClick={() => onRemove(product.id)}
          aria-label="Remove item"
          className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
          title="Remove from cart"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
