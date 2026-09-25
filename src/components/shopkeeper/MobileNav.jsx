"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  TrendingUp,
  MoreHorizontal,
  Boxes,
  Store,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { useShopkeeper } from "@/context/ShopkeeperContext";

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { setAuthStep, businessProfile } = useShopkeeper();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const navTabs = [
    {
      label: "Home",
      href: "/shopkeeper/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/shopkeeper/dashboard",
    },
    {
      label: "Products",
      href: "/shopkeeper/products",
      icon: Package,
      active: pathname.startsWith("/shopkeeper/products"),
    },
    {
      label: "Orders",
      href: "/shopkeeper/orders",
      icon: ShoppingBag,
      active: pathname === "/shopkeeper/orders",
      badge: "6",
    },
    {
      label: "Sales",
      href: "/shopkeeper/sales",
      icon: TrendingUp,
      active: pathname === "/shopkeeper/sales",
    },
  ];

  const handleLogout = () => {
    setShowMoreMenu(false);
    if (confirm("Are you sure you want to log out?")) {
      setAuthStep("register");
      router.push("/shopkeeper/register");
    }
  };

  return (
    <>
      {/* "More" Drawer / Modal */}
      {showMoreMenu && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex flex-col justify-end">
          <div
            className="flex-1"
            onClick={() => setShowMoreMenu(false)}
          />
          <div className="bg-white rounded-t-2xl p-5 shadow-xl border-t border-slate-200 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <p className="font-semibold text-slate-800">
                  {businessProfile.businessName || "Jitu Electronics"}
                </p>
                <p className="text-xs text-slate-400">LocalHub Shopkeeper</p>
              </div>
              <button
                type="button"
                onClick={() => setShowMoreMenu(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <Link
                href="/shopkeeper/inventory"
                onClick={() => setShowMoreMenu(false)}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <Boxes className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">Inventory</p>
                  <p className="text-[11px] text-slate-400">Manage Stock</p>
                </div>
              </Link>

              <Link
                href="/shopkeeper/profile"
                onClick={() => setShowMoreMenu(false)}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <Store className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">Profile</p>
                  <p className="text-[11px] text-slate-400">Store Details</p>
                </div>
              </Link>

              <Link
                href="/shopkeeper/settings"
                onClick={() => setShowMoreMenu(false)}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <Settings className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">Settings</p>
                  <p className="text-[11px] text-slate-400">Store Settings</p>
                </div>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-3 p-3 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100/50 text-rose-700 transition-colors text-left cursor-pointer"
              >
                <LogOut className="w-5 h-5 text-rose-600" />
                <div>
                  <p className="text-sm font-semibold text-rose-800">Logout</p>
                  <p className="text-[11px] text-rose-500">End Session</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xs border-t border-slate-200 py-1.5 flex items-center justify-between w-full shadow-lg"
      >
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`flex-1 flex flex-col items-center justify-center py-1 text-center relative transition-colors ${
                tab.active
                  ? "text-blue-600 font-semibold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${tab.active ? "text-blue-600 stroke-[2.3]" : "text-slate-500"}`} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{tab.label}</span>
            </Link>
          );
        })}

        {/* More Tab */}
        <button
          type="button"
          onClick={() => setShowMoreMenu(true)}
          className={`flex-1 flex flex-col items-center justify-center py-1 text-center transition-colors cursor-pointer ${
            showMoreMenu || pathname === "/shopkeeper/inventory" || pathname === "/shopkeeper/profile" || pathname === "/shopkeeper/settings"
              ? "text-blue-600 font-semibold"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <MoreHorizontal className="w-5 h-5 text-slate-500" />
          <span className="text-[11px] mt-0.5 tracking-tight">More</span>
        </button>
      </nav>
    </>
  );
}
