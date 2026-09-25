"use client";

import React, { useState } from "react";
import { useShopkeeper } from "@/context/ShopkeeperContext";
import { useRouter, usePathname } from "next/navigation";
import { CheckCircle2, ChevronRight, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";

export default function DemoFlowBar() {
  const { authStep, jumpToStep, resetAllData } = useShopkeeper();
  const router = useRouter();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  const steps = [
    { key: "register", label: "1. Register", path: "/register" },
    { key: "verify", label: "2. Verify OTP", path: "/verify" },
    { key: "pending", label: "3. Pending Admin", path: "/pending" },
    { key: "approved", label: "4. Approved 🎉", path: "/approved" },
    { key: "profile_setup", label: "5. Setup Profile", path: "/profile" },
    { key: "completed", label: "6. Shop Dashboard", path: "/dashboard" },
  ];

  const handleSelectStep = (stepKey, path) => {
    jumpToStep(stepKey);
    router.push(path);
  };

  const handleReset = () => {
    if (confirm("Reset flow to Step 1 (Register)?")) {
      resetAllData();
      router.push("/register");
    }
  };

  return (
    <aside aria-label="Demo Flow Navigator" className="bg-slate-900 text-white border-b border-slate-800 text-xs py-2 px-3 sm:px-6 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-200 hidden sm:inline">
            LocalHub Onboarding Flow:
          </span>
          <span className="font-medium text-blue-400 capitalize sm:hidden">
            Step: {authStep}
          </span>
        </div>

        {/* Desktop Step Buttons */}
        <nav aria-label="Onboarding Steps" className="hidden md:flex items-center gap-1.5 overflow-x-auto py-0.5">
          {steps.map((s, idx) => {
            const isActive = authStep === s.key || (s.key === "completed" && authStep === "completed" && pathname !== "/register" && pathname !== "/verify" && pathname !== "/pending" && pathname !== "/approved" && pathname !== "/profile");
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => handleSelectStep(s.key, s.path)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1 cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm ring-1 ring-blue-400"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {isActive && <CheckCircle2 className="w-3 h-3 text-emerald-300" />}
                {s.label}
              </button>
            );
          })}
        </nav>

        {/* Mobile Dropdown & Reset */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="md:hidden px-2.5 py-1 bg-slate-800 rounded text-slate-200 hover:bg-slate-700 flex items-center gap-1"
          >
            <span>Jump Step</span>
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
          </button>

          <button
            type="button"
            onClick={handleReset}
            title="Reset to initial Register step"
            className="px-2.5 py-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Mobile expanded drawer */}
      {isExpanded && (
        <div className="md:hidden pt-2 pb-1 border-t border-slate-800 mt-2 grid grid-cols-2 gap-1.5">
          {steps.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => {
                setIsExpanded(false);
                handleSelectStep(s.key, s.path);
              }}
              className={`p-2 rounded text-left text-xs font-medium ${
                authStep === s.key ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-200"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </aside>
  );
}
