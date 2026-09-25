"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useShopkeeper } from "@/context/ShopkeeperContext";
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingBag,
  TrendingUp,
  Store,
  Settings,
  LogOut,
  ChevronDown,
  PlusCircle,
  List,
  Store as StoreIcon,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { businessProfile, setAuthStep } = useShopkeeper();
  const [productsOpen, setProductsOpen] = useState(
    pathname.includes("/shopkeeper/products")
  );

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out of LocalHub Shopkeeper Portal?")) {
      setAuthStep("register");
      router.push("/shopkeeper/register");
    }
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/shopkeeper/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/shopkeeper/dashboard",
    },
    {
      name: "Products",
      href: "/shopkeeper/products",
      icon: Package,
      hasSubmenu: true,
      active: pathname.startsWith("/shopkeeper/products"),
      subitems: [
        { name: "All Products", href: "/shopkeeper/products", icon: List },
        { name: "Add Product", href: "/shopkeeper/products/add", icon: PlusCircle },
      ],
    },
    {
      name: "Inventory",
      href: "/shopkeeper/inventory",
      icon: Boxes,
      active: pathname === "/shopkeeper/inventory",
    },
    {
      name: "Orders",
      href: "/shopkeeper/orders",
      icon: ShoppingBag,
      active: pathname === "/shopkeeper/orders",
      badge: "6",
    },
    {
      name: "Sales",
      href: "/shopkeeper/sales",
      icon: TrendingUp,
      active: pathname === "/shopkeeper/sales",
    },
    {
      name: "Business Profile",
      href: "/shopkeeper/profile",
      icon: Store,
      active: pathname === "/shopkeeper/profile",
    },
    {
      name: "Settings",
      href: "/shopkeeper/settings",
      icon: Settings,
      active: pathname === "/shopkeeper/settings",
    },
  ];

  return (
    <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-slate-200 h-screen sticky top-0 left-0 z-40 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
          <StoreIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-lg font-bold text-slate-900 tracking-tight block">
            LocalHub
          </span>
          <span className="text-[11px] font-medium text-slate-400 block -mt-1">
            Shopkeeper Portal
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.hasSubmenu) {
            return (
              <div key={item.name} className="space-y-1">
                <button
                  type="button"
                  onClick={() => setProductsOpen(!productsOpen)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    item.active
                      ? "text-blue-700 bg-blue-50/70"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${item.active ? "text-blue-600" : "text-slate-400"}`} />
                    <span>{item.name}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      productsOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {productsOpen && (
                  <div className="pl-9 pr-2 space-y-1">
                    {item.subitems.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubActive = pathname === sub.href;
                      return (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                            isSubActive
                              ? "text-blue-600 font-semibold bg-blue-50"
                              : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                          }`}
                        >
                          <SubIcon className="w-3.5 h-3.5" />
                          <span>{sub.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.active
                  ? "text-blue-700 bg-blue-50/80 font-semibold shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${item.active ? "text-blue-600" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[11px] font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom Profile & Logout */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center overflow-hidden shrink-0">
              {businessProfile.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={businessProfile.logo}
                  alt={businessProfile.businessName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <StoreIcon className="w-4 h-4 text-slate-500" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {businessProfile.businessName || "Jitu Electronics"}
              </p>
              <p className="text-xs text-slate-400 truncate">
                Verified Merchant
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title="Log out"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
