"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { subscribeToTable } from "@/lib/supabase/realtime";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favoriteShopIds, setFavoriteShopIds] = useState(() => {
    if (typeof window === "undefined") return ["sharma-grocery"];
    try {
      const savedShops = localStorage.getItem("localstore_fav_shops");
      if (savedShops) return JSON.parse(savedShops);
    } catch (e) {
      console.error(e);
    }
    return ["sharma-grocery"];
  });

  const [favoriteProductIds, setFavoriteProductIds] = useState(() => {
    if (typeof window === "undefined") return ["amul-taaza-1l", "shimla-apple-1kg"];
    try {
      const savedProds = localStorage.getItem("localstore_fav_prods");
      if (savedProds) return JSON.parse(savedProds);
    } catch (e) {
      console.error(e);
    }
    return ["amul-taaza-1l", "shimla-apple-1kg"];
  });

  useEffect(() => {
    try {
      localStorage.setItem("localstore_fav_shops", JSON.stringify(favoriteShopIds));
      localStorage.setItem("localstore_fav_prods", JSON.stringify(favoriteProductIds));
    } catch (e) {
      console.error(e);
    }
  }, [favoriteShopIds, favoriteProductIds]);

  // Real-time pruning of deleted favorites
  useEffect(() => {
    const unsubProds = subscribeToTable("products", (payload) => {
      if (payload.eventType === "DELETE" && payload.old?.id) {
        setFavoriteProductIds((prev) => prev.filter((id) => id !== payload.old.id));
      }
    });

    const unsubShops = subscribeToTable("shops", (payload) => {
      if (payload.eventType === "DELETE" && payload.old?.id) {
        setFavoriteShopIds((prev) => prev.filter((id) => id !== payload.old.id));
      }
    });

    return () => {
      unsubProds();
      unsubShops();
    };
  }, []);

  const toggleFavoriteShop = (shopId) => {
    setFavoriteShopIds((prev) =>
      prev.includes(shopId) ? prev.filter((id) => id !== shopId) : [...prev, shopId]
    );
  };

  const isShopFavorite = (shopId) => favoriteShopIds.includes(shopId);

  const toggleFavoriteProduct = (productId) => {
    setFavoriteProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isProductFavorite = (productId) => favoriteProductIds.includes(productId);

  return (
    <FavoritesContext.Provider
      value={{
        favoriteShopIds,
        favoriteProductIds,
        toggleFavoriteShop,
        isShopFavorite,
        toggleFavoriteProduct,
        isProductFavorite
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
