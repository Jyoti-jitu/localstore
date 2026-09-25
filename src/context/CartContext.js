"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("localstore_cart");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter((item) => item && item.product && item.product.id);
        }
      }
    } catch (e) {
      console.error("Failed to load cart from storage", e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem("localstore_cart", JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart", e);
    }
  }, [items]);

  const addToCart = (product, qty = 1) => {
    if (!product || !product.id) return;
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i?.product?.id === product.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: (next[existingIndex].quantity || 0) + qty
        };
        return next;
      }
      return [
        ...prev,
        {
          product,
          quantity: qty,
          addedAt: Date.now()
        }
      ];
    });
  };

  const updateQuantity = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i?.product?.id === productId ? { ...i, quantity: qty } : i))
    );
  };

  const removeFromCart = (productId) => {
    setItems((prev) => prev.filter((i) => i?.product?.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemQuantity = (productId) => {
    const item = items.find((i) => i?.product?.id === productId);
    return item ? item.quantity : 0;
  };

  // Derived summaries
  const totalItems = items.reduce((sum, i) => sum + (i?.quantity || 0), 0);
  const itemsSubtotal = items.reduce(
    (sum, i) => sum + (i?.product?.price || 0) * (i?.quantity || 0),
    0
  );

  // Group by store
  const groupedByStore = items.reduce((acc, item) => {
    if (!item?.product) return acc;
    const shopId = item.product.shopId || "unknown";
    if (!acc[shopId]) {
      acc[shopId] = {
        shopId,
        shopName: item.product.shopName || "Local Neighborhood Store",
        shopDistance: item.product.shopDistance || "Nearby",
        items: [],
        storeTotal: 0
      };
    }
    acc[shopId].items.push(item);
    acc[shopId].storeTotal += (item.product.price || 0) * (item.quantity || 0);
    return acc;
  }, {});

  // Fees calculation
  const storeCount = Object.keys(groupedByStore).length;
  const deliveryFee = storeCount > 0 ? storeCount * 20 : 0;
  const platformFee = items.length > 0 ? 5 : 0;
  const discount = itemsSubtotal > 500 ? 50 : 0;
  const grandTotal = Math.max(0, itemsSubtotal + deliveryFee + platformFee - discount);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getItemQuantity,
        totalItems,
        itemsSubtotal,
        groupedByStore,
        storeCount,
        deliveryFee,
        platformFee,
        discount,
        grandTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
