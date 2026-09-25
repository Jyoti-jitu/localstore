"use client";

import React from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrdersContext";
import { Home, Compass, PackageCheck, ShoppingBag, User } from "lucide-react";

export default function BottomNavigation() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { orders } = useOrders();

  const activeOrdersCount = orders.filter(
    (o) => o.status === "out_for_delivery" || o.status === "preparing"
  ).length;

  const navItems = [
    { label: "Home", href: "/", icon: Home, exact: true },
    { label: "Explore", href: "/explore", icon: Compass },
    {
      label: "Orders",
      href: "/orders",
      icon: PackageCheck,
      badge: activeOrdersCount > 0 ? activeOrdersCount : null
    },
    {
      label: "Cart",
      href: "/cart",
      icon: ShoppingBag,
      badge: totalItems > 0 ? totalItems : null
    },
    { label: "Account", href: "/account", icon: User }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          const Icon = item.icon;

          return (
            <NextLink
              key={item.label}
              href={item.href}
              className={`relative flex flex-col items-center justify-center min-h-[44px] transition-colors ${
                isActive ? "text-emerald-600 font-semibold" : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? "scale-110 stroke-[2.2]" : "stroke-[1.8]"} transition-transform`} />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 bg-emerald-600 rounded-full" />
              )}
            </NextLink>
          );
        })}
      </div>
    </nav>
  );
}
