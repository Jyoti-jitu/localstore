"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useShopkeeper } from "@/context/ShopkeeperContext";
import DemoFlowBar from "@/components/shopkeeper/DemoFlowBar";
import Header from "@/components/shopkeeper/Header";
import Sidebar from "@/components/shopkeeper/Sidebar";
import MobileNav from "@/components/shopkeeper/MobileNav";
import {
  Store,
  Upload,
  Clock,
  CheckCircle2,
  ArrowRight,
  Camera,
} from "lucide-react";

export default function BusinessProfilePage() {
  const router = useRouter();
  const { authStep, setAuthStep, businessProfile, setBusinessProfile } =
    useShopkeeper();

  const [formData, setFormData] = useState({
    businessName: businessProfile.businessName || "Jitu Electronics",
    category: businessProfile.category || "Electronics & Mobile Accessories",
    description:
      businessProfile.description ||
      "Local electronic appliances, chargers, cables, earbuds, and prompt home delivery.",
    phone: businessProfile.phone || "+91 98765 43210",
    address: businessProfile.address || "Shop #14, SUM Hospital Road, Shampur",
    city: businessProfile.city || "Bhubaneswar",
    state: businessProfile.state || "Odisha",
    pincode: businessProfile.pincode || "751003",
    openingDays: businessProfile.openingDays || "Monday – Sunday",
    openingTime: businessProfile.openingTime || "09:00 AM",
    closingTime: businessProfile.closingTime || "09:30 PM",
    logo:
      businessProfile.logo ||
      "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=400&q=80",
  });

  const [isSaved, setIsSaved] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(formData.logo);

  const categories = [
    "Electronics & Mobile Accessories",
    "Grocery & Daily Essentials",
    "Pharmacy & Healthcare",
    "Clothing & Fashion",
    "Bakery & Sweets",
    "Hardware & Electrical",
    "Books & Stationery",
    "Home & Kitchen",
  ];

  const samplePhotos = [
    "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setFormData((prev) => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (url) => {
    setPhotoPreview(url);
    setFormData((prev) => ({ ...prev, logo: url }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setBusinessProfile(formData);
    setIsSaved(true);

    setTimeout(() => {
      // Step 5: After saving, take the shopkeeper to the dashboard
      setAuthStep("completed");
      router.push("/shopkeeper/dashboard");
    }, 600);
  };

  const isSetupFlow = authStep === "profile_setup" || authStep === "approved";

  const content = (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Complete Business Profile
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Tell nearby customers about your business, location, and opening hours.
        </p>
      </div>

      {isSaved && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Profile saved successfully! Redirecting to Dashboard...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Business Information */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 sm:p-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-4">
            <Store className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Business Information
            </h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Jitu Electronics"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Business Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Business Description
              </label>
              <textarea
                name="description"
                rows={2}
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of your shop & items sold"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  PIN Code
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  placeholder="751003"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Shop number, street, landmark"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="City"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  placeholder="State"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Business Photo */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 sm:p-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-4">
            <Camera className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Business Logo / Shop Photo
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
              {photoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoPreview}
                  alt="Shop Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Store className="w-8 h-8 text-slate-400" />
              )}
            </div>

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <label
                htmlFor="photo-upload"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4 text-slate-500" />
                <span>Upload Photo</span>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>

              <p className="text-xs text-slate-400">
                Or select a preset shop photo:
              </p>

              <div className="flex items-center gap-2 justify-center sm:justify-start">
                {samplePhotos.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectSample(url)}
                    className={`w-9 h-9 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      photoPreview === url
                        ? "border-blue-600 ring-2 ring-blue-100"
                        : "border-slate-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Preset ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Opening Hours */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 sm:p-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-4">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Opening Hours
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Working Days
              </label>
              <input
                type="text"
                name="openingDays"
                value={formData.openingDays}
                onChange={handleChange}
                placeholder="Monday – Sunday"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Opening Time
                </label>
                <input
                  type="text"
                  name="openingTime"
                  value={formData.openingTime}
                  onChange={handleChange}
                  placeholder="09:00 AM"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Closing Time
                </label>
                <input
                  type="text"
                  name="closingTime"
                  value={formData.closingTime}
                  onChange={handleChange}
                  placeholder="09:30 PM"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Save & Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );

  // If in onboarding flow, display standalone clean page
  if (isSetupFlow) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <DemoFlowBar />
        <div className="flex-1 py-8">{content}</div>
        <p className="text-xs text-slate-400 py-6 text-center">
          LocalHub Shopkeeper Onboarding • Step 5 of 6
        </p>
      </div>
    );
  }

  // If logged in and managing profile from sidebar
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <DemoFlowBar />
      <div className="flex-1 flex w-full">
        <Sidebar />
        <main className="flex-1 min-w-0 pb-20 lg:pb-10">
          <Header
            title="Business Profile"
            description="Manage your shop identity, location, contact, and operational hours."
          />
          {content}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
