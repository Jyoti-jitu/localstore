"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useShopkeeper } from "@/context/ShopkeeperContext";
import DemoFlowBar from "@/components/DemoFlowBar";
import { CheckCircle2, ArrowRight, Store, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

export default function ApprovedPage() {
  const router = useRouter();
  const { setAuthStep, shopkeeper } = useShopkeeper();

  useEffect(() => {
    // Confetti celebration burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#2563eb", "#10b981", "#3b82f6", "#f59e0b"],
      });
    } catch {
      // ignore
    }
  }, []);

  const handleProceed = () => {
    setAuthStep("profile_setup");
    router.push("/profile");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <DemoFlowBar />

      <div className="flex-1 flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 text-center">
          {/* Approved Icon */}
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-semibold text-emerald-700 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Verification Successful</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Your Business Has Been Approved 🎉
          </h1>

          <p className="text-sm text-slate-600 mt-3 leading-relaxed">
            Your business is now approved. Complete your business profile to start
            adding products.
          </p>

          {/* Quick Summary Pill */}
          <div className="my-6 p-4 bg-slate-50 border border-slate-200 rounded-xl text-left">
            <p className="text-xs text-slate-400 font-medium">Approved Store</p>
            <p className="text-base font-bold text-slate-900">
              {shopkeeper.businessName || "Jitu Electronics"}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Owner: {shopkeeper.ownerName || "Jitu Sahoo"} • ID: {shopkeeper.applicationId || "LH-10245"}
            </p>
          </div>

          {/* Call to action */}
          <button
            type="button"
            onClick={handleProceed}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Complete Business Profile</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs text-slate-400 mt-6 text-center">
          LocalHub Merchant Partner Network
        </p>
      </div>
    </div>
  );
}
