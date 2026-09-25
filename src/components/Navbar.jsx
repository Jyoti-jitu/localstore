"use client";

import React from "react";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import { useCart } from "@/context/CartContext";
import { useLocation } from "@/context/LocationContext";
import { useOrders } from "@/context/OrdersContext";
import { useAuth } from "@/context/AuthContext";
import SearchBar from "./SearchBar";
import {
  MapPin,
  ShoppingBag,
  ShoppingCart,
  User,
  PackageCheck,
  ChevronDown,
  LogIn,
  Store
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems, itemsSubtotal } = useCart();
  const { city, currentLocality, openModal, isDetecting } = useLocation();
  const { orders } = useOrders();
  const { isAuthenticated, profile, openAuthModal, signOut } = useAuth();

  const activeOrdersCount = orders.filter(
    (o) => o.status === "out_for_delivery" || o.status === "preparing"
  ).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 transition-all">
      {/* Top Banner: Local Promise (Desktop only to maximize mobile first view) */}
      <div className="hidden sm:flex bg-emerald-900 text-white text-[11px] py-1 px-4 text-center font-medium items-center justify-center gap-2">
        <span>Discover your local shops. Shop locally. Order online.</span>
        <span className="text-emerald-300">• Delivering directly from verified neighborhood merchants</span>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Mobile Header Row */}
        <div className="flex lg:hidden items-center justify-between h-14 w-full min-w-0">
          {/* Left: Brand Logo */}
          <NextLink href="/" className="flex items-center py-1 flex-shrink-0">
            <img
              src="/brand-logo.png"
              alt="LocalStore"
              className="h-8 sm:h-9 w-auto object-contain"
            />
          </NextLink>

          {/* Right: Red Location Pin + City + Chevron, and Shopping Cart Outline with Green Badge */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 min-w-0">
            <button
              type="button"
              onClick={openModal}
              className="flex items-center gap-1 text-neutral-800 hover:text-neutral-950 py-1 transition-colors min-w-0 max-w-[130px] sm:max-w-[160px]"
              title="Change Delivery Location"
            >
              <MapPin className="w-3.5 h-3.5 text-[#E53935] fill-[#E53935] flex-shrink-0" />
              <span className="text-[11px] sm:text-xs font-semibold text-neutral-800 truncate">
                {currentLocality?.name || city || "Bhubaneswar"}
              </span>
              <ChevronDown className="w-3 h-3 text-neutral-500 flex-shrink-0" />
            </button>

            <NextLink
              href="/cart"
              className="relative p-1.5 text-neutral-800 hover:text-neutral-950 flex-shrink-0"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5 stroke-[1.8]" />
              <span className="absolute -top-0.5 -right-0.5 bg-[#00A859] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {totalItems > 0 ? totalItems : 3}
              </span>
            </NextLink>
          </div>
        </div>

        {/* Desktop Header Row */}
        <div className="hidden lg:flex items-center justify-between h-16 sm:h-[72px] gap-4 sm:gap-6">
          {/* Logo */}
          <NextLink href="/" className="flex items-center flex-shrink-0 group py-1">
            <img
              src="/brand-logo.png"
              alt="LocalStore - Shop Local. Shop Online."
              className="h-9 sm:h-11 w-auto object-contain transition-transform group-hover:scale-[1.02]"
            />
          </NextLink>

          {/* Desktop Search Bar */}
          <div className="flex-1 max-w-xl mx-auto">
            <SearchBar />
          </div>

          {/* Right Navigation Items */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Location Selector */}
            <button
              onClick={openModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 text-left bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-xl transition-colors text-xs text-neutral-700 group"
              title="Change Delivery Location"
            >
              <div className="text-emerald-600">
                <MapPin className={`w-4 h-4 ${isDetecting ? "animate-bounce text-emerald-500" : ""}`} />
              </div>
              <div className="max-w-[100px] sm:max-w-[140px] truncate">
                <div className="text-[10px] text-neutral-400 font-medium uppercase leading-tight">
                  {isDetecting ? "Detecting..." : "Location"}
                </div>
                <div className="font-semibold text-neutral-900 truncate flex items-center gap-1">
                  <span>{isDetecting ? "Finding area..." : (currentLocality?.name || "Select Area")}</span>
                  <ChevronDown className="w-3 h-3 text-neutral-400 group-hover:text-neutral-700 flex-shrink-0" />
                </div>
              </div>
            </button>

            {/* Desktop Orders */}
            <NextLink
              href="/orders"
              className={`hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                pathname.startsWith("/orders")
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <div className="relative">
                <PackageCheck className="w-4 h-4 text-neutral-600" />
                {activeOrdersCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-600 rounded-full animate-pulse" />
                )}
              </div>
              <span>Orders</span>
              {activeOrdersCount > 0 && (
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {activeOrdersCount}
                </span>
              )}
            </NextLink>

            {/* Desktop Become a Shopkeeper */}
            <NextLink
              href="/shopkeeper"
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 transition-all shadow-2xs"
            >
              <Store className="w-3.5 h-3.5 text-emerald-600" />
              <span>Become a Shopkeeper</span>
            </NextLink>

            {/* Desktop Account / Sign In */}
            {isAuthenticated ? (
              <NextLink
                href="/account"
                className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  pathname.startsWith("/account")
                    ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                    : "text-neutral-800 hover:bg-neutral-50 border-neutral-200"
                }`}
              >
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-6 h-6 rounded-full object-cover border border-emerald-400"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center">
                    {profile.initials}
                  </div>
                )}
                <span className="max-w-[100px] truncate">{profile.name.split(" ")[0]}</span>
              </NextLink>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal("signin")}
                className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-neutral-800 hover:bg-neutral-100 border border-neutral-200 transition-all shadow-2xs"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-600" />
                <span>Sign In</span>
              </button>
            )}

            {/* Cart Button */}
            <NextLink
              href="/cart"
              className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors group"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-white" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
              {itemsSubtotal > 0 && (
                <span className="hidden sm:inline bg-emerald-700/60 px-1.5 py-0.5 rounded text-[11px]">
                  ₹{itemsSubtotal}
                </span>
              )}
            </NextLink>
          </div>
        </div>

        {/* Mobile Search Bar Row (Only shown on non-homepage screens, as homepage hero has its own prominent search bar) */}
        {pathname !== "/" && (
          <div className="lg:hidden pb-3 pt-1">
            <SearchBar />
          </div>
        )}
      </div>
    </header>
  );
}
