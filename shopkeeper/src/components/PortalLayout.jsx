"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useShopkeeper } from "@/context/ShopkeeperContext";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import DemoFlowBar from "@/components/DemoFlowBar";

export default function PortalLayout({ children }) {
  const { authStep, isLoaded } = useShopkeeper();
  const router = useRouter();

  // Rule 16 Gatekeeper:
  // - If not approved -> redirect to pending
  // - If approved but not completed profile -> redirect to profile setup
  // - If not registered/verified -> redirect to corresponding step
  useEffect(() => {
    if (!isLoaded) return;

    if (authStep === "register") {
      router.replace("/register");
    } else if (authStep === "verify") {
      router.replace("/verify");
    } else if (authStep === "pending") {
      router.replace("/pending");
    } else if (authStep === "approved") {
      router.replace("/approved");
    } else if (authStep === "profile_setup") {
      router.replace("/profile");
    }
  }, [authStep, isLoaded, router]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Demo helper bar to easily switch or test all 6 stages */}
      <DemoFlowBar />

      <div className="flex-1 flex w-full">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 pb-20 lg:pb-10">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
