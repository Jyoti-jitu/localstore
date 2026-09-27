"use client";

import React, { useState, useRef } from "react";
import NextLink from "next/link";
import { useLocation } from "@/context/LocationContext";
import { useOrders } from "@/context/OrdersContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import { uploadStorageAsset } from "@/lib/supabase/db";
import Modal from "@/components/Modal";
import {
  User,
  PackageCheck,
  MapPin,
  CreditCard,
  Heart,
  Bell,
  HelpCircle,
  Shield,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Camera,
  Upload,
  Trash2,
  Check,
  Lock,
  Edit2,
  Phone,
  Mail,
  Store,
  CheckCircle2,
  Sparkles,
  LogIn,
  Banknote
} from "lucide-react";

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=240&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=240&auto=format&fit=crop&q=80"
];

export default function AccountPage() {
  const { currentLocality, city, openModal } = useLocation();
  const { orders } = useOrders();
  const { favoriteShopIds, favoriteProductIds } = useFavorites();
  const { showToast } = useToast();
  const {
    user: authUser,
    profile,
    isAuthenticated,
    loading: authLoading,
    signOut,
    openAuthModal,
    updateProfilePhoto,
    removeProfilePhoto
  } = useAuth();

  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'payments'
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please choose an image file (PNG, JPG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("Image size must be under 5MB.");
      return;
    }

    showToast("Uploading to Supabase Storage...");
    try {
      const res = await uploadStorageAsset(file, "avatars");
      if (res.success && res.url) {
        updateProfilePhoto(res.url);
        setIsPhotoModalOpen(false);
        showToast("Profile photo uploaded to Supabase Storage!");
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result;
          updateProfilePhoto(dataUrl);
          setIsPhotoModalOpen(false);
          showToast("Profile photo updated successfully!");
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error("Avatar upload error:", err);
    }
  };

  const user = {
    name: profile?.name || "Rahul Mohapatra",
    email: profile?.email || "rahul.mohapatra@example.com",
    phone: profile?.phone || "+91 98610 54321",
    location: `${currentLocality?.name || "Jayadev Vihar"}, ${city}`
  };

  const handleLogout = async () => {
    await signOut();
    showToast("Signed out of LocalStore.");
  };

  const menuItems = [
    { label: "My Orders", href: "/orders", icon: PackageCheck, badge: `${orders.length} orders` },
    { label: "Saved Addresses", href: "/addresses", icon: MapPin, badge: "3 saved" },
    { label: "Favorite Shops", href: "/favorites", icon: Store, badge: `${favoriteShopIds.length}` },
    { label: "Favorite Products", href: "/favorites", icon: Heart, badge: `${favoriteProductIds.length}` },
    { label: "Notifications", href: "/notifications", icon: Bell, badge: "1 new" },
    { label: "Help & Support", href: "/help", icon: HelpCircle },
    { label: "Terms & Privacy", href: "/help", icon: Shield }
  ];

  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-neutral-200/90 shadow-xs p-6 sm:p-8 space-y-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs">
            <User className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              Sign In to Your Account
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-xs mx-auto">
              Access your active orders, saved addresses, and buy from neighborhood stores.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => openAuthModal("signin", "/account")}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to LocalStore</span>
            </button>

            <button
              onClick={() => openAuthModal("register", "/account")}
              className="w-full py-3 px-4 bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-800 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Register New Account</span>
            </button>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => openAuthModal("forgot", "/account")}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline transition-colors"
            >
              Forgot your password? Recover your account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbfb] py-3 sm:py-8 pb-20 md:pb-8">
      <div className="max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-3.5 sm:space-y-6">
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between">
          <NextLink
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Home</span>
          </NextLink>

          <span className="text-[11px] font-semibold text-neutral-400">
            Account & Profile
          </span>
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 p-4 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
            <div className="flex items-center gap-3.5 sm:gap-5">
              {/* Profile Photo / Avatar with Edit Trigger */}
              <div className="relative group/avatar flex-shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-xl sm:text-2xl flex items-center justify-center shadow-md border-2 border-white ring-2 ring-emerald-100/90">
                  {profile?.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{profile?.initials || "RM"}</span>
                  )}
                </div>

                {/* Edit Photo overlay button */}
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(true)}
                  className="absolute -bottom-1.5 -right-1.5 p-1.5 sm:p-2 bg-neutral-900 hover:bg-emerald-600 text-white rounded-xl shadow-md border-2 border-white transition-all hover:scale-110 flex items-center justify-center"
                  title="Add or Change Profile Photo"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-0.5 sm:space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-lg sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
                    {user.name}
                  </h1>
                  <span className="text-[10px] sm:text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Local Verified
                  </span>
                </div>

                <div className="text-[11px] sm:text-xs text-neutral-500 flex flex-wrap items-center gap-2 sm:gap-4 pt-0.5">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{user.email}</span>
                  </span>
                  <span className="hidden sm:flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{user.phone}</span>
                  </span>
                </div>

                <div className="pt-0.5 sm:pt-1.5 flex items-center gap-1.5 text-xs text-neutral-700">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="font-semibold">{user.location}</span>
                  <button
                    onClick={openModal}
                    className="text-emerald-600 hover:underline text-[11px] font-bold ml-1"
                  >
                    (Change)
                  </button>
                </div>

                <div className="pt-1 text-[11px] text-neutral-400 font-medium flex items-center gap-1">
                  <Lock className="w-3 h-3 text-neutral-400" />
                  <span>Profile details verified • Only profile photo is editable</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap sm:flex-nowrap pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 border border-neutral-200 hover:bg-neutral-50 rounded-xl text-xs font-semibold text-neutral-800 transition-colors flex-shrink-0"
                title="Change or upload profile photo"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-600" />
                <span>Change Photo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Metrics Strip */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="p-3 sm:p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-xs text-center sm:text-left">
            <div className="text-[10px] sm:text-xs text-neutral-400 font-medium">Orders</div>
            <div className="text-base sm:text-xl font-black text-neutral-900 mt-0.5 sm:mt-1">{orders.length}</div>
            <div className="text-[10px] sm:text-[11px] text-emerald-700 mt-0.5 hidden xs:block">Local stores</div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-xs text-center sm:text-left">
            <div className="text-[10px] sm:text-xs text-neutral-400 font-medium">Favorites</div>
            <div className="text-base sm:text-xl font-black text-neutral-900 mt-0.5 sm:mt-1">
              {favoriteShopIds.length}
            </div>
            <div className="text-[10px] sm:text-[11px] text-neutral-500 mt-0.5 hidden xs:block">In BBSR</div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-xs text-center sm:text-left">
            <div className="text-[10px] sm:text-xs text-neutral-400 font-medium">Local Impact</div>
            <div className="text-base sm:text-xl font-black text-emerald-700 mt-0.5 sm:mt-1">100%</div>
            <div className="text-[10px] sm:text-[11px] text-neutral-500 mt-0.5 hidden xs:block">Neighborhood</div>
          </div>
        </div>

        {/* Desktop Sidebar + Main Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-start">
          {/* Navigation Menu (Sidebar on Desktop, List on Mobile) */}
          <div className="md:col-span-5 lg:col-span-4 bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 p-2.5 sm:p-3 shadow-xs divide-y divide-neutral-100">
            <div className="p-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-400">
              Account Navigation
            </div>

            <div className="space-y-0.5 py-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NextLink
                    key={item.label}
                    href={item.href}
                    className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-colors group ${
                      item.isHighlight
                        ? "bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-950 font-bold border border-emerald-200/60 my-1"
                        : "hover:bg-neutral-50 text-neutral-700 hover:text-neutral-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <div
                        className={`p-2 rounded-xl transition-colors ${
                          item.isHighlight
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "bg-neutral-100 group-hover:bg-emerald-50 group-hover:text-emerald-700"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-xs ${item.isHighlight ? "font-bold text-emerald-950" : "font-semibold"}`}>
                        {item.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.isHighlight
                              ? "bg-emerald-600 text-white"
                              : "text-neutral-500 bg-neutral-100"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight
                        className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${
                          item.isHighlight ? "text-emerald-700" : "text-neutral-400 group-hover:text-neutral-700"
                        }`}
                      />
                    </div>
                  </NextLink>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl hover:bg-rose-50 text-neutral-600 hover:text-rose-700 text-xs font-semibold transition-colors"
              >
                <div className="p-2 rounded-xl bg-neutral-100 text-neutral-500">
                  <LogOut className="w-4 h-4" />
                </div>
                <span>Log Out of LocalStore</span>
              </button>
            </div>
          </div>

          {/* Right Area: Overview Highlights */}
          <div className="md:col-span-7 lg:col-span-8 space-y-4 sm:space-y-6">
            {/* Latest Order Card */}
            {orders.length > 0 && (
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 p-4 sm:p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <PackageCheck className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-xs sm:text-sm text-neutral-900">Latest Local Order</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full capitalize">
                    {orders[0].status}
                  </span>
                </div>

                <div className="pt-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-neutral-900">{orders[0].shopName}</div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">
                      Order #{orders[0].orderId} • {orders[0].items.length} items • ₹{orders[0].total}
                    </div>
                  </div>

                  <NextLink
                    href={`/orders/${orders[0].orderId}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors flex-shrink-0"
                  >
                    <span>Track</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </NextLink>
                </div>
              </div>
            )}

            {/* Default Payment Mode preview */}
            <div className="bg-white rounded-3xl border border-neutral-200/90 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <h3 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-emerald-600" />
                  <span>Default Payment Mode</span>
                </h3>
                <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                  100% Doorstep COD
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-neutral-700">
                <div className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 font-bold">
                      <Banknote className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div>
                      <div className="font-bold text-neutral-900">Cash on Delivery (COD)</div>
                      <div className="text-[11px] text-neutral-500">Pay cash or scan QR code at doorstep upon delivery</div>
                    </div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                </div>

                <div className="text-[11px] text-neutral-500 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/60">
                  Online UPI and card prepayments are disabled. All neighborhood orders are safely collected on delivery at your doorstep.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Profile Photo Modal */}
      <Modal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        title="Edit Profile Photo"
        subtitle="Upload a personal photo or select a verified avatar"
        maxWidth="max-w-lg"
      >
        <div className="space-y-5 py-1">
          {/* Current Avatar Preview */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/90">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-2xl flex items-center justify-center shadow-md flex-shrink-0 border-2 border-white ring-2 ring-emerald-200">
              {profile?.avatar ? (
                <img
                  src={profile.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{profile?.initials || "RM"}</span>
              )}
            </div>

            <div className="text-center sm:text-left space-y-1 flex-1">
              <h4 className="text-sm font-bold text-neutral-900">{user.name}</h4>
              <p className="text-xs text-neutral-500">
                {profile?.avatar ? "Custom profile picture is active" : "Using default name initials"}
              </p>
              <div className="text-[11px] text-emerald-700 font-semibold flex items-center justify-center sm:justify-start gap-1 pt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>JPG, PNG, WEBP up to 5MB supported</span>
              </div>
            </div>

            {profile?.avatar && (
              <button
                type="button"
                onClick={() => {
                  removeProfilePhoto();
                  showToast("Profile photo removed.");
                }}
                className="p-2 px-3 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-rose-200"
                title="Remove custom photo and reset to initials"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            )}
          </div>

          {/* Option 1: Upload from Device */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
              Upload from Device
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3.5 px-4 border-2 border-dashed border-neutral-300 hover:border-emerald-500 hover:bg-emerald-50/50 rounded-2xl flex items-center justify-center gap-2.5 text-xs font-bold text-neutral-700 hover:text-emerald-800 transition-all group"
            >
              <Upload className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span>Choose photo from your computer or phone</span>
            </button>
          </div>

          {/* Option 2: Curated Avatar Presets */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
              Or Choose a Preset Avatar
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              {AVATAR_PRESETS.map((preset, idx) => {
                const isSelected = profile?.avatar === preset;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      updateProfilePhoto(preset);
                      showToast("Profile photo updated!");
                    }}
                    className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all hover:scale-105 ${
                      isSelected
                        ? "border-emerald-600 ring-2 ring-emerald-300 shadow-sm"
                        : "border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    <img
                      src={preset}
                      alt={`Avatar option ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-emerald-600/30 flex items-center justify-center">
                        <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Account Policy Notice */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/70 flex items-start gap-2.5 text-amber-900 text-xs">
            <Lock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Verified Profile:</strong> Only your profile photo is editable. Full name, registered phone number, and email address are locked for security and neighborhood order verification.
            </p>
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => setIsPhotoModalOpen(false)}
              className="py-2.5 px-5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
