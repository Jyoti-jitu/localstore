"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { mapProductFromDb } from "@/lib/supabase/db";
import { subscribeToTable, onVisibilityOrFocus } from "@/lib/supabase/realtime";
import { useToast } from "@/context/ToastContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { showToast } = useToast();

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

  // Active validation against Supabase database for any stale, deleted, or altered cart items
  const validateCart = useCallback(async () => {
    if (items.length === 0) return { valid: true, removed: [], modified: [] };

    try {
      const supabase = createClient();
      const currentIds = items.map((i) => i.product.id);
      const { data: dbProducts, error } = await supabase
        .from("products")
        .select("*")
        .in("id", currentIds);

      if (error || !dbProducts) return { valid: true, removed: [], modified: [] };

      const dbMap = new Map(dbProducts.map((p) => [p.id, mapProductFromDb(p)]));
      const removed = [];
      const modified = [];

      setItems((prev) => {
        let changed = false;
        const next = [];

        for (const item of prev) {
          const dbProd = dbMap.get(item.product.id);
          if (!dbProd) {
            // Product no longer exists in Supabase (deleted by shopkeeper)
            removed.push(item);
            changed = true;
          } else {
            // Product exists, check for price or stock updates
            if (
              dbProd.price !== item.product.price ||
              dbProd.inStock !== item.product.inStock ||
              dbProd.name !== item.product.name
            ) {
              modified.push({ old: item.product, updated: dbProd });
              next.push({
                ...item,
                product: {
                  ...item.product,
                  ...dbProd
                }
              });
              changed = true;
            } else {
              next.push(item);
            }
          }
        }

        if (removed.length > 0) {
          const names = removed.map((r) => r.product?.name).join(", ");
          showToast(
            `"${names}" was removed because the shopkeeper deleted this product.`,
            "error",
            6000
          );
        }

        return changed ? next : prev;
      });

      return { valid: removed.length === 0, removed, modified };
    } catch (err) {
      console.error("Cart validation error:", err);
      return { valid: true, removed: [], modified: [] };
    }
  }, [items, showToast]);

  // Subscribe to real-time changes on products table
  useEffect(() => {
    const unsubscribe = subscribeToTable("products", (payload) => {
      const { eventType, new: newRow, old: oldRow } = payload;

      if (eventType === "DELETE") {
        const deletedId = oldRow?.id;
        if (!deletedId) return;

        setItems((prev) => {
          const match = prev.find((i) => i.product?.id === deletedId);
          if (!match) return prev;

          const prodName = match.product?.name || "A product in your cart";
          showToast(
            `"${prodName}" was deleted by the store owner and was removed from your cart.`,
            "error",
            6000
          );

          return prev.filter((i) => i.product?.id !== deletedId);
        });
      } else if (eventType === "UPDATE") {
        const updatedId = newRow?.id;
        if (!updatedId) return;

        setItems((prev) => {
          const match = prev.find((i) => i.product?.id === updatedId);
          if (!match) return prev;

          const updatedProd = mapProductFromDb(newRow);
          if (!updatedProd) return prev;

          if (!updatedProd.inStock && match.product?.inStock) {
            showToast(`"${updatedProd.name}" is now out of stock.`, "info", 5000);
          } else if (updatedProd.price !== match.product?.price) {
            showToast(`Price for "${updatedProd.name}" updated to ₹${updatedProd.price}.`, "info", 4000);
          }

          return prev.map((i) =>
            i.product?.id === updatedId
              ? { ...i, product: { ...i.product, ...updatedProd } }
              : i
          );
        });
      }
    });

    // Revalidate cart whenever user returns to the tab
    const unbindFocus = onVisibilityOrFocus(() => {
      validateCart();
    });

    return () => {
      unsubscribe();
      unbindFocus();
    };
  }, [showToast, validateCart]);

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
        validateCart,
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
