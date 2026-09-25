"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/hooks/useSupabaseData";
import { markNotificationAsRead } from "@/lib/supabase/db";
import { useToast } from "@/context/ToastContext";
import { Bell, CheckCheck, Clock, Store, PackageCheck, ChevronLeft, ArrowRight } from "lucide-react";

export default function NotificationsPage() {
  const router = useRouter();
  const { notifications, setNotifications } = useNotifications();
  const { showToast } = useToast();

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    notifications.forEach((n) => {
      markNotificationAsRead(n.id).catch(console.error);
    });
    showToast("All notifications marked as read.");
  };

  const handleNotificationClick = (n) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
    );
    markNotificationAsRead(n.id).catch(console.error);
    if (n.orderId) {
      router.push(`/orders/${n.orderId}`);
    } else if (n.shopId) {
      router.push(`/shop/${n.shopId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfb] py-3 sm:py-8 pb-20 md:pb-8">
      <div className="max-w-3xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-3.5 sm:space-y-6">
        <div>
          <NextLink
            href="/account"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 mb-1 sm:mb-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Account</span>
          </NextLink>

          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-700 mb-0.5 sm:mb-1">
                <Bell className="w-3.5 h-3.5" />
                <span>Alerts & Updates</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                Notifications
              </h1>
            </div>

            <button
              onClick={markAllAsRead}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl transition-colors flex-shrink-0"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          </div>
        </div>

        {/* Notifications list */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 shadow-xs divide-y divide-neutral-100 overflow-hidden">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              className={`p-3.5 sm:p-5 flex items-start gap-3 sm:gap-4 transition-colors cursor-pointer ${
                !n.read ? "bg-emerald-50/30 hover:bg-emerald-50/60" : "hover:bg-neutral-50"
              }`}
            >
              <div
                className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl flex-shrink-0 ${
                  !n.read
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-neutral-100 text-neutral-500"
                }`}
              >
                {n.orderId ? (
                  <PackageCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Store className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-sm text-neutral-900 line-clamp-1">
                    {n.title}
                  </h4>
                  <span className="text-[11px] text-neutral-400 font-medium flex-shrink-0">
                    {n.timestamp}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                  {n.message}
                </p>

                {(n.orderId || n.shopId) && (
                  <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline">
                    <span>{n.orderId ? "View Order Status" : "View Store Details"}</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                )}
              </div>

              {!n.read && (
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 flex-shrink-0 self-center" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
