"use client";

import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import Header from "@/components/Header";
import { useShopkeeper } from "@/context/ShopkeeperContext";
import {
  Settings,
  Bell,
  MapPin,
  CreditCard,
  CheckCircle2,
  Save,
  Volume2,
} from "lucide-react";

export default function SettingsPage() {
  const { businessProfile } = useShopkeeper();
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    orderSound: true,
    smsAlerts: true,
    whatsappAlerts: true,
    deliveryRadius: "5",
    minOrderAmount: "99",
    upiId: "jitu.electronics@okhdfcbank",
    autoConfirm: false,
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <PortalLayout>
      <Header
        title="Settings"
        description="Configure store alerts, delivery boundary, and payment preferences."
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {saved && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings saved successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          {/* Order Notifications */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 sm:p-6">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-4">
              <Bell className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-base">
                Order Notifications
              </h3>
            </div>

            <div className="space-y-3 text-sm">
              <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
                <div>
                  <p className="font-semibold text-slate-800">
                    Loud Sound Alert on New Orders
                  </p>
                  <p className="text-xs text-slate-400">
                    Plays sound immediately when a nearby customer places an order
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.orderSound}
                  onChange={(e) =>
                    setSettings({ ...settings, orderSound: e.target.checked })
                  }
                  className="w-4 h-4 accent-blue-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
                <div>
                  <p className="font-semibold text-slate-800">WhatsApp Alerts</p>
                  <p className="text-xs text-slate-400">
                    Receive order summary and customer location on WhatsApp
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.whatsappAlerts}
                  onChange={(e) =>
                    setSettings({ ...settings, whatsappAlerts: e.target.checked })
                  }
                  className="w-4 h-4 accent-blue-600 rounded"
                />
              </label>
            </div>
          </div>

          {/* Delivery & Vicinity Radius */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 sm:p-6">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-4">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-base">
                Delivery Vicinity
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Delivery Radius (Kilometres)
                </label>
                <select
                  value={settings.deliveryRadius}
                  onChange={(e) =>
                    setSettings({ ...settings, deliveryRadius: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="2">2 km (Walking / Bicycle)</option>
                  <option value="5">5 km (Standard Neighborhood)</option>
                  <option value="10">10 km (City Wide)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Minimum Order (₹)
                </label>
                <input
                  type="number"
                  value={settings.minOrderAmount}
                  onChange={(e) =>
                    setSettings({ ...settings, minOrderAmount: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Payouts / UPI */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 sm:p-6">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-4">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-base">
                Settlements & UPI ID
              </h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Merchant UPI ID for Daily Payouts
              </label>
              <input
                type="text"
                value={settings.upiId}
                onChange={(e) =>
                  setSettings({ ...settings, upiId: e.target.value })
                }
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <p className="text-xs text-slate-400 mt-1">
                Settlements occur daily at 11:00 PM directly to this bank VPA.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      </div>
    </PortalLayout>
  );
}
