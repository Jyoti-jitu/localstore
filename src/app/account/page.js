"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import { useLocation } from "@/context/LocationContext";
import { useOrders } from "@/context/OrdersContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  PackageCheck,
  MapPin,
  CreditCard,
  Heart,
  Bell,
  HelpCircle,
  Shield,
  LogOut,
  ChevronRight,
  Edit2,
  Phone,
  Mail,
  Store,
  CheckCircle2,
  Sparkles,
  LogIn
} from "lucide-react";

export default function AccountPage() {
  const { currentLocality, city, openModal } = useLocation();
  const { orders } = useOrders();
  const { favoriteShopIds, favoriteProductIds } = useFavorites();
  const { showToast } = useToast();
  const {
    user: authUser,
    profile,
    isAuthenticated,
    loading: authLoading,
    signOut,
    openAuthModal,
    loginAsDemoUser
  } = useAuth();

  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'payments'

  const user = {
    name: profile?.name || "Rahul Mohapatra",
    email: profile?.email || "rahul.mohapatra@example.com",
    phone: profile?.phone || "+91 98610 54321",
    location: `${currentLocality?.name || "Jayadev Vihar"}, ${city}`
  };

  const handleLogout = async () => {
    await signOut();
    showToast("Signed out of LocalStore.");
  };

  const menuItems = [
    {
      label: "Become a Shopkeeper",
      href: "/shopkeeper",
      icon: Store,
      badge: "Start Selling",
      isHighlight: true
    },
    { label: "My Orders", href: "/orders", icon: PackageCheck, badge: `${orders.length} orders` },
    { label: "Saved Addresses", href: "/addresses", icon: MapPin, badge: "3 saved" },
    { label: "Favorite Shops", href: "/favorites", icon: Store, badge: `${favoriteShopIds.length}` },
    { label: "Favorite Products", href: "/favorites", icon: Heart, badge: `${favoriteProductIds.length}` },
    { label: "Notifications", href: "/notifications", icon: Bell, badge: "1 new" },
    { label: "Help & Support", href: "/help", icon: HelpCircle },
    { label: "Terms & Privacy", href: "/help", icon: Shield }
  ];

  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-neutral-200/90 shadow-xs p-6 sm:p-8 space-y-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs">
            <User className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              Sign In to Your Account
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-xs mx-auto">
              Access your active orders, saved addresses, and buy from neighborhood stores.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => openAuthModal("signin", "/account")}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to LocalStore</span>
            </button>

            <button
              onClick={() => openAuthModal("register", "/account")}
              className="w-full py-3 px-4 bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-800 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Register New Account</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center py-1">
            <div className="border-t border-neutral-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-bold text-neutral-400 uppercase tracking-wider relative">
              Or Quick Test
            </span>
          </div>

          <button
            onClick={async () => {
              await loginAsDemoUser();
              showToast("Logged in as Rahul Mohapatra (Demo User).");
            }}
            className="w-full py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 group"
          >
            <Sparkles className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            <span>⚡ Quick 1-Click Demo Login (Rahul Mohapatra)</span>
          </button>

          <div className="pt-3 border-t border-neutral-100 flex flex-col items-center gap-1.5 text-center">
            <p className="text-xs text-neutral-500">Are you a merchant or store owner?</p>
            <NextLink
              href="/shopkeeper"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Become a Shopkeeper on LocalHub →</span>
            </NextLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbfb] py-3 sm:py-8 pb-20 md:pb-8">
      <div className="max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-3.5 sm:space-y-6">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 p-4 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
            <div className="flex items-center gap-3.5 sm:gap-5">
              <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl bg-emerald-600 text-white font-extrabold text-xl sm:text-2xl flex items-center justify-center shadow-md flex-shrink-0">
                {profile?.initials || "RM"}
              </div>

              <div className="space-y-0.5 sm:space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-lg sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
                    {user.name}
                  </h1>
                  <span className="text-[10px] sm:text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Local Verified
                  </span>
                </div>

                <div className="text-[11px] sm:text-xs text-neutral-500 flex flex-wrap items-center gap-2 sm:gap-4 pt-0.5">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{user.email}</span>
                  </span>
                  <span className="hidden sm:flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{user.phone}</span>
                  </span>
                </div>

                <div className="pt-0.5 sm:pt-1.5 flex items-center gap-1.5 text-xs text-neutral-700">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="font-semibold">{user.location}</span>
                  <button
                    onClick={openModal}
                    className="text-emerald-600 hover:underline text-[11px] font-bold ml-1"
                  >
                    (Change)
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap sm:flex-nowrap pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
              <NextLink
                href="/shopkeeper"
                id="become-shopkeeper-btn"
                className="inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs hover:shadow transition-all group flex-shrink-0"
              >
                <Store className="w-4 h-4 text-emerald-100 group-hover:scale-110 transition-transform" />
                <span>Become a Shopkeeper</span>
              </NextLink>

              <button
                onClick={() => showToast("Profile edit is enabled for phone & email updates.")}
                className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 border border-neutral-200 hover:bg-neutral-50 rounded-xl text-xs font-semibold text-neutral-800 transition-colors flex-shrink-0"
              >
                <Edit2 className="w-3.5 h-3.5 text-neutral-400" />
                <span className="hidden sm:inline">Edit Profile</span>
                <span className="sm:hidden">Edit</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Metrics Strip */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="p-3 sm:p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-xs text-center sm:text-left">
            <div className="text-[10px] sm:text-xs text-neutral-400 font-medium">Orders</div>
            <div className="text-base sm:text-xl font-black text-neutral-900 mt-0.5 sm:mt-1">{orders.length}</div>
            <div className="text-[10px] sm:text-[11px] text-emerald-700 mt-0.5 hidden xs:block">Local stores</div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-xs text-center sm:text-left">
            <div className="text-[10px] sm:text-xs text-neutral-400 font-medium">Favorites</div>
            <div className="text-base sm:text-xl font-black text-neutral-900 mt-0.5 sm:mt-1">
              {favoriteShopIds.length}
            </div>
            <div className="text-[10px] sm:text-[11px] text-neutral-500 mt-0.5 hidden xs:block">In BBSR</div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-xs text-center sm:text-left">
            <div className="text-[10px] sm:text-xs text-neutral-400 font-medium">Local Impact</div>
            <div className="text-base sm:text-xl font-black text-emerald-700 mt-0.5 sm:mt-1">100%</div>
            <div className="text-[10px] sm:text-[11px] text-neutral-500 mt-0.5 hidden xs:block">Neighborhood</div>
          </div>
        </div>

        {/* Desktop Sidebar + Main Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-start">
          {/* Navigation Menu (Sidebar on Desktop, List on Mobile) */}
          <div className="md:col-span-5 lg:col-span-4 bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 p-2.5 sm:p-3 shadow-xs divide-y divide-neutral-100">
            <div className="p-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-400">
              Account Navigation
            </div>

            <div className="space-y-0.5 py-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NextLink
                    key={item.label}
                    href={item.href}
                    className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-colors group ${
                      item.isHighlight
                        ? "bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-950 font-bold border border-emerald-200/60 my-1"
                        : "hover:bg-neutral-50 text-neutral-700 hover:text-neutral-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <div
                        className={`p-2 rounded-xl transition-colors ${
                          item.isHighlight
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "bg-neutral-100 group-hover:bg-emerald-50 group-hover:text-emerald-700"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-xs ${item.isHighlight ? "font-bold text-emerald-950" : "font-semibold"}`}>
                        {item.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.isHighlight
                              ? "bg-emerald-600 text-white"
                              : "text-neutral-500 bg-neutral-100"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight
                        className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${
                          item.isHighlight ? "text-emerald-700" : "text-neutral-400 group-hover:text-neutral-700"
                        }`}
                      />
                    </div>
                  </NextLink>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl hover:bg-rose-50 text-neutral-600 hover:text-rose-700 text-xs font-semibold transition-colors"
              >
                <div className="p-2 rounded-xl bg-neutral-100 text-neutral-500">
                  <LogOut className="w-4 h-4" />
                </div>
                <span>Log Out of LocalStore</span>
              </button>
            </div>
          </div>

          {/* Right Area: Overview Highlights */}
          <div className="md:col-span-7 lg:col-span-8 space-y-4 sm:space-y-6">
            {/* Become a Shopkeeper Feature Card */}
            <div className="bg-gradient-to-br from-emerald-800 via-teal-800 to-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-white shadow-xs relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-md">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-xs text-[10px] font-bold text-emerald-200 uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>Sell on LocalHub</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                    Become a Shopkeeper
                  </h2>
                  <p className="text-xs text-emerald-100/90 leading-relaxed">
                    Take your offline store online. Reach nearby customers, manage your inventory in minutes, and increase your local revenue.
                  </p>
                </div>

                <NextLink
                  href="/shopkeeper"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-neutral-100 text-emerald-900 font-extrabold rounded-xl text-xs sm:text-sm shadow-sm transition-all flex-shrink-0 group"
                >
                  <Store className="w-4 h-4 text-emerald-700 group-hover:scale-110 transition-transform" />
                  <span>Start Selling</span>
                  <ChevronRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-0.5 transition-transform" />
                </NextLink>
              </div>
            </div>

            {/* Latest Order Card */}
            {orders.length > 0 && (
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 p-4 sm:p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <PackageCheck className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-xs sm:text-sm text-neutral-900">Latest Local Order</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full capitalize">
                    {orders[0].status}
                  </span>
                </div>

                <div className="pt-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-neutral-900">{orders[0].shopName}</div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">
                      Order #{orders[0].orderId} • {orders[0].items.length} items • ₹{orders[0].total}
                    </div>
                  </div>

                  <NextLink
                    href={`/orders/${orders[0].orderId}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors flex-shrink-0"
                  >
                    <span>Track</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </NextLink>
                </div>
              </div>
            )}

            {/* Saved Payment Methods preview */}
            <div className="bg-white rounded-3xl border border-neutral-200/90 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <h3 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>Saved Payment Options</span>
                </h3>
                <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                  Instant Checkout Active
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-neutral-700">
                <div className="p-3 rounded-xl border border-neutral-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 font-bold">UPI</div>
                    <div>
                      <div className="font-semibold text-neutral-900">Google Pay (Primary)</div>
                      <div className="text-[11px] text-neutral-400">rahul@oksbi</div>
                    </div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>

                <div className="p-3 rounded-xl border border-neutral-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-700 font-bold">VISA</div>
                    <div>
                      <div className="font-semibold text-neutral-900">HDFC Bank Debit Card</div>
                      <div className="text-[11px] text-neutral-400">•••• •••• •••• 0029 (Exp 08/29)</div>
                    </div>
                  </div>
                  <span className="text-[11px] text-neutral-400">Saved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
