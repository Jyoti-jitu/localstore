"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useShopkeeper } from "@/context/ShopkeeperContext";
import DemoFlowBar from "@/components/shopkeeper/DemoFlowBar";
import {
  Clock,
  Check,
  FileText,
  LogOut,
  ArrowRight,
  X,
  Sparkles,
} from "lucide-react";

export default function PendingApprovalPage() {
  const router = useRouter();
  const { shopkeeper, setAuthStep } = useShopkeeper();
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  const handleSimulateApprove = () => {
    // Admin approves the business
    setAuthStep("approved");
    router.push("/shopkeeper/approved");
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      setAuthStep("register");
      router.push("/shopkeeper/register");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <DemoFlowBar />

      <div className="flex-1 flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-8">
        {/* Main Status Card */}
        <div className="w-full max-w-lg bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
          {/* Header Icon */}
          <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
            <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Review in Progress
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
                Your Business Is Under Review
              </h1>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 mt-4 leading-relaxed">
            Your registration has been submitted successfully. Our admin team will
            review your business before you can start selling.
          </p>

          {/* Application ID Card */}
          <div className="my-5 p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-slate-500" />
              <div>
                <p className="text-[11px] text-slate-400 font-medium">
                  Application Reference
                </p>
                <p className="text-sm font-bold text-slate-900">
                  Application ID: {shopkeeper.applicationId || "LH-10245"}
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2 py-1 bg-white border border-slate-200 text-slate-700 rounded">
              Standard Queue
            </span>
          </div>

          {/* Simple Status Tracker */}
          <div className="space-y-3.5 py-4 border-y border-slate-100">
            {/* Step 1 */}
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div className="flex-1 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-800">
                  Account Created
                </span>
                <span className="text-xs text-emerald-600 font-medium">Completed</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div className="flex-1 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-800">
                  Contact Verified
                </span>
                <span className="text-xs text-emerald-600 font-medium">Completed</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              </div>
              <div className="flex-1 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">
                  Waiting for Admin Approval
                </span>
                <span className="text-xs text-amber-600 font-medium">In Review</span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => setShowApplicationModal(true)}
              className="flex-1 py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>View Application</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="py-2.5 px-4 bg-white border border-slate-300 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-600 font-semibold text-sm rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Reviewer / Admin Simulator Action */}
          <div className="mt-5 pt-4 border-t border-dashed border-slate-200 text-center">
            <button
              type="button"
              onClick={handleSimulateApprove}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate Admin Approval (Proceed to Step 4)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Simulates platform admin reviewing and approving your business application.
            </p>
          </div>
        </div>

        {/* Support Help */}
        <p className="text-xs text-slate-500 mt-6 text-center">
          Need help with your application? Contact{" "}
          <span className="text-blue-600 font-semibold">support@localhub.com</span>
        </p>
      </div>

      {/* View Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-xl p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Application Details</h3>
              <button
                type="button"
                onClick={() => setShowApplicationModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Application ID:</span>
                <span className="font-semibold text-slate-900">{shopkeeper.applicationId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Owner Name:</span>
                <span className="font-medium text-slate-800">{shopkeeper.ownerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Business Name:</span>
                <span className="font-medium text-slate-800">{shopkeeper.businessName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Email:</span>
                <span className="font-medium text-slate-800">{shopkeeper.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Phone:</span>
                <span className="font-medium text-slate-800">{shopkeeper.phone}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Current Status:</span>
                <span className="font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-xs">
                  Pending Admin Approval
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowApplicationModal(false)}
              className="w-full mt-2 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
