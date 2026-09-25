"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useShopkeeper } from "@/context/ShopkeeperContext";
import DemoFlowBar from "@/components/DemoFlowBar";
import { Store, ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const { setShopkeeper, setAuthStep } = useShopkeeper();

  const [formData, setFormData] = useState({
    ownerName: "Jitu Sahoo",
    businessName: "Jitu Electronics",
    email: "jitu.electronics@example.com",
    phone: "+91 98765 43210",
    password: "••••••••",
    confirmPassword: "••••••••",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.ownerName.trim()) {
      setError("Please enter Owner Name");
      return;
    }
    if (!formData.businessName.trim()) {
      setError("Please enter Business Name");
      return;
    }
    if (!formData.email.trim()) {
      setError("Please enter Email");
      return;
    }
    if (!formData.phone.trim()) {
      setError("Please enter Phone Number");
      return;
    }
    if (!formData.password) {
      setError("Please enter Password");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Save shopkeeper details
      setShopkeeper((prev) => ({
        ...prev,
        ownerName: formData.ownerName,
        businessName: formData.businessName,
        email: formData.email,
        phone: formData.phone,
      }));

      // Next step: Email/Phone verification
      setAuthStep("verify");
      router.push("/verify");
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <DemoFlowBar />

      <div className="flex-1 flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-8">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white mb-3 shadow-sm">
            <Store className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold tracking-wide text-blue-600 uppercase">
            LocalHub Merchant Portal
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Register Your Business
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Connect your local shop to nearby customers in your neighborhood.
          </p>
        </div>

        {/* Clean Registration Card */}
        <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Owner Name
              </label>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                placeholder="e.g. Jitu Sahoo"
                required
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Business Name
              </label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="e.g. Jitu Electronics"
                required
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@business.com"
                required
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                required
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 placeholder:text-slate-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                required
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 placeholder:text-slate-400"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                <span>{isSubmitting ? "Creating Account..." : "Create Account"}</span>
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setAuthStep("completed");
                  router.push("/dashboard");
                }}
                className="text-blue-600 font-semibold hover:text-blue-700 underline cursor-pointer"
              >
                Login
              </button>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-xs text-slate-400 mt-6 text-center">
          © {new Date().getFullYear()} LocalHub Merchant Network. All rights reserved.
        </p>
      </div>
    </div>
  );
}
