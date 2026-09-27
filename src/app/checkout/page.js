"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrdersContext";
import { useToast } from "@/context/ToastContext";
import { useLocation } from "@/context/LocationContext";
import { useAuth } from "@/context/AuthContext";
import { useAddresses } from "@/hooks/useSupabaseData";
import { createAddress, updateAddress } from "@/lib/supabase/db";
import AddressCard from "@/components/AddressCard";
import PaymentMethodCard from "@/components/PaymentMethodCard";
import Modal from "@/components/Modal";
import {
  MapPin,
  Clock,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  ChevronLeft,
  Plus,
  Store,
  Truck,
  ArrowRight,
  AlertCircle,
  User,
  Phone,
  Pencil,
  Sparkles,
  LogIn,
  Lock,
  Banknote
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    user,
    profile,
    isAuthenticated,
    loading: authLoading,
    openAuthModal,
  } = useAuth();

  const {
    items,
    groupedByStore,
    totalItems,
    itemsSubtotal,
    deliveryFee,
    platformFee,
    discount,
    grandTotal,
    clearCart,
    validateCart
  } = useCart();

  const { createOrder } = useOrders();
  const { showToast } = useToast();
  const { localities } = useLocation();
  const locList = localities || [];

  // Step 1: Address from Supabase
  const { addresses, setAddresses } = useAddresses(user?.id);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const selectedAddress =
    addresses.find((a) => a.id === selectedAddressId) ||
    addresses.find((a) => a.isDefault) ||
    addresses[0] ||
    null;

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [newLabel, setNewLabel] = useState("Home");
  const [newRecipient, setNewRecipient] = useState(profile?.name || "");
  const [newPhone, setNewPhone] = useState(profile?.phone || "");
  const [newStreet, setNewStreet] = useState("");
  const [newLocality, setNewLocality] = useState("Jayadev Vihar");

  const handleOpenAddAddressModal = () => {
    setEditingAddressId(null);
    setNewLabel("Home");
    setNewRecipient(profile?.name || "Rahul Mohapatra");
    setNewPhone(profile?.phone || "+91 98610 54321");
    setNewStreet("");
    setNewLocality(locList[0]?.name || "Jayadev Vihar");
    setIsAddressModalOpen(true);
  };

  const handleOpenEditAddressModal = (addr) => {
    setEditingAddressId(addr.id);
    setNewLabel(addr.label || "Home");
    setNewRecipient(addr.recipient || profile?.name || "Rahul Mohapatra");
    setNewPhone(addr.phone || profile?.phone || "+91 98610 54321");
    setNewStreet(addr.street || "");
    setNewLocality(addr.locality || locList[0]?.name || "Jayadev Vihar");
    setIsAddressModalOpen(true);
  };

  // Step 2: Delivery Notes
  const [deliveryNote, setDeliveryNote] = useState("");
  const [leaveAtDoor, setLeaveAtDoor] = useState(false);

  // Step 3: Payment (Cash on Delivery Only)
  const [selectedPayment, setSelectedPayment] = useState("cod");

  // Step 4: Submission
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // If cart is empty, redirect back to cart
  if (totalItems === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-neutral-900 mb-2">No Items in Cart</h2>
        <p className="text-sm text-neutral-500 mb-4">
          Please add items to your cart before proceeding to checkout.
        </p>
        <NextLink
          href="/explore"
          className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
        >
          Browse Local Stores
        </NextLink>
      </div>
    );
  }

  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    if (!newStreet.trim()) return;

    const recipientName = newRecipient.trim() || profile?.name || "Customer";
    const phoneNo = newPhone.trim() || profile?.phone || "";

    if (editingAddressId) {
      const updatedAddr = {
        ...addresses.find((a) => a.id === editingAddressId),
        label: newLabel,
        recipient: recipientName,
        phone: phoneNo,
        street: newStreet.trim(),
        locality: newLocality || (locList[0]?.name || "Jayadev Vihar"),
        city: "Bhubaneswar",
        pincode: "751013"
      };

      setAddresses((prev) => prev.map((a) => (a.id === editingAddressId ? updatedAddr : a)));
      setSelectedAddressId(updatedAddr.id);
      setIsAddressModalOpen(false);
      setEditingAddressId(null);
      showToast("Address updated successfully!");

      try {
        await updateAddress(editingAddressId, updatedAddr);
      } catch (err) {
        console.error("Failed to update address in Supabase:", err);
      }
    } else {
      const newAddr = {
        id: `addr-${Date.now()}`,
        label: newLabel,
        isDefault: addresses.length === 0,
        recipient: recipientName,
        phone: phoneNo,
        street: newStreet.trim(),
        locality: newLocality || (locList[0]?.name || "Jayadev Vihar"),
        city: "Bhubaneswar",
        pincode: "751013",
        userId: user?.id || null
      };

      setAddresses((prev) => [newAddr, ...prev]);
      setSelectedAddressId(newAddr.id);
      setIsAddressModalOpen(false);
      setNewStreet("");
      showToast("New address added successfully!");

      try {
        await createAddress(newAddr);
      } catch (err) {
        console.error("Failed to save address to Supabase:", err);
      }
    }
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      openAuthModal("signin", "/checkout");
      showToast("Please sign in or register to place your order.");
      return;
    }

    setIsPlacingOrder(true);

    // Live validation against Supabase products table
    try {
      const validation = await validateCart();
      if (validation && validation.removed && validation.removed.length > 0) {
        setIsPlacingOrder(false);
        showToast(
          "Some items in your cart were removed because they were deleted by the store owner. Please review before proceeding.",
          "error",
          6000
        );
        return;
      }
    } catch (e) {
      console.warn("Pre-order validation check bypassed on error", e);
    }

    const firstStoreGroup = Object.values(groupedByStore)[0];

    setTimeout(async () => {
      const order = await createOrder({
        userId: user?.id,
        customerName: selectedAddress?.recipient || profile?.name || "Customer",
        customerPhone: selectedAddress?.phone || profile?.phone || "",
        items,
        shopId: firstStoreGroup?.shopId || "sharma-grocery",
        shopName: firstStoreGroup?.shopName || "Sharma Grocery Store",
        shopAddress: "Bhubaneswar, Odisha",
        deliveryAddress: selectedAddress,
        paymentMethod: "Cash on Delivery",
        itemsTotal: itemsSubtotal,
        deliveryFee,
        platformFee,
        discount,
        total: grandTotal
      });

      clearCart();
      setIsPlacingOrder(false);
      showToast("Order placed successfully!", "success");
      router.push(`/order-success?orderId=${order.orderId}`);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#fbfbfb] py-3 sm:py-10 pb-28 lg:pb-10">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-8">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-neutral-200">
          <div>
            <NextLink
              href="/cart"
              className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-neutral-500 hover:text-neutral-900 mb-0.5"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Back to Cart</span>
            </NextLink>
            <h1 className="text-xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Checkout & Payment
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Secure Hyperlocal Checkout</span>
          </div>
        </div>

        {/* Multi-step Layout: Steps Left + Order Summary Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start">
          {/* Checkout Steps */}
          <div className="lg:col-span-8 space-y-6">
            {/* USER AUTH GATE OR LOGGED IN BADGE */}
            {!isAuthenticated ? (
              <div className="bg-white rounded-3xl border-2 border-emerald-500/40 p-5 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center font-bold flex-shrink-0">
                    <User className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 mb-1">
                      <span>Account Required to Buy</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-black text-neutral-900 tracking-tight">
                      Sign In or Register to Complete Order
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">
                      To protect local merchants and verify order delivery, please sign in or create an account.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => openAuthModal("signin", "/checkout")}
                    className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 group"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In to Your Account</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openAuthModal("register", "/checkout")}
                    className="py-3 px-4 bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-800 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <User className="w-4 h-4 text-neutral-500" />
                    <span>Register New Account</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center shadow-xs flex-shrink-0">
                    {profile.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-neutral-900">{profile.name}</span>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full">
                        Verified Buyer
                      </span>
                    </div>
                    <div className="text-[11px] sm:text-xs text-neutral-600 mt-0.5">
                      {profile.email} {profile.phone ? `• ${profile.phone}` : ""}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openAuthModal("signin", "/checkout")}
                  className="text-[11px] font-bold text-emerald-700 hover:underline"
                >
                  Switch
                </button>
              </div>
            )}

            {/* STEP 1: Delivery Address */}
            <div className="bg-white rounded-3xl border border-neutral-200/90 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                    1
                  </div>
                  <h2 className="font-bold text-base sm:text-lg text-neutral-900">
                    Delivery Address
                  </h2>
                </div>

                <button
                  onClick={handleOpenAddAddressModal}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {addresses.map((addr) => (
                  <AddressCard
                    key={addr.id}
                    address={addr}
                    isSelected={selectedAddress?.id === addr.id}
                    onSelect={() => setSelectedAddressId(addr.id)}
                    onEdit={handleOpenEditAddressModal}
                  />
                ))}
              </div>
            </div>

            {/* STEP 2: Delivery & Store Fulfillment Details */}
            <div className="bg-white rounded-3xl border border-neutral-200/90 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                  2
                </div>
                <h2 className="font-bold text-base sm:text-lg text-neutral-900">
                  Fulfillment & Delivery Details
                </h2>
              </div>

              <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/70 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-neutral-700 font-semibold">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>Estimated Delivery Window:</span>
                  </div>
                  <span className="font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                    25–35 minutes
                  </span>
                </div>

                <div className="pt-2 border-t border-neutral-200/60 text-neutral-600 space-y-1">
                  <div className="font-medium text-neutral-900">Fulfilling Neighborhood Shops:</div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {Object.values(groupedByStore).map((sg) => (
                      <span
                        key={sg.shopId}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-neutral-200 rounded-lg font-semibold text-neutral-800"
                      >
                        <Store className="w-3 h-3 text-emerald-600" />
                        <span>{sg.shopName}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Delivery instructions */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-700">
                  Instructions for Store & Delivery Partner (Optional)
                </label>
                <input
                  type="text"
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  placeholder="e.g. Call upon reaching gate, leave with security, ring bell twice..."
                  className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                />

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={leaveAtDoor}
                    onChange={(e) => setLeaveAtDoor(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-neutral-300 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-neutral-600">
                    Opt for contactless delivery (Leave package at doorstep)
                  </span>
                </label>
              </div>
            </div>

            {/* STEP 3: Payment Method */}
            <div className="bg-white rounded-3xl border border-neutral-200/90 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                  3
                </div>
                <h2 className="font-bold text-base sm:text-lg text-neutral-900">
                  Payment Method
                </h2>
              </div>

              <div className="space-y-3">
                {/* Cash on Delivery as the sole payment method */}
                <PaymentMethodCard
                  method={{
                    id: "cod",
                    title: "Cash on Delivery (COD)",
                    subtitle: "Pay in cash or scan delivery partner's QR code at your doorstep"
                  }}
                  isSelected={true}
                  onSelect={() => setSelectedPayment("cod")}
                  details={
                    <div className="space-y-2.5 pt-1 text-xs text-neutral-600">
                      <div className="flex items-start gap-2 text-neutral-700">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span><strong>100% Risk-Free:</strong> No advance online payment required. Inspect your order at your doorstep before paying.</span>
                      </div>
                      <div className="flex items-start gap-2 text-neutral-700">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span><strong>Doorstep Payment Options:</strong> Keep exact cash ready or scan the rider&apos;s UPI QR code upon delivery.</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-800 text-[11px] flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-amber-700 flex-shrink-0" />
                        <span>Online advance payments (UPI/Card) are disabled. Only Cash on Delivery is supported for all local store orders.</span>
                      </div>
                    </div>
                  }
                />
              </div>
            </div>
          </div>

          {/* STEP 4: Order Review & Sticky Summary */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-white rounded-3xl border border-neutral-200/90 p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                  4
                </div>
                <h3 className="font-bold text-base text-neutral-900">Order Review</h3>
              </div>

              {/* Items summary list */}
              <div className="max-h-48 overflow-y-auto custom-scrollbar divide-y divide-neutral-100 text-xs pr-1">
                {items.map((i) => (
                  <div key={i.product.id} className="py-2 flex items-center justify-between gap-2">
                    <div className="truncate flex-1">
                      <span className="font-bold text-neutral-800">{i.quantity}x</span>{" "}
                      <span className="text-neutral-700">{i.product.name}</span>
                    </div>
                    <span className="font-semibold text-neutral-900">
                      ₹{i.product.price * i.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price details */}
              <div className="space-y-2 pt-3 border-t border-neutral-100 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-neutral-900">₹{itemsSubtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Local Delivery Fee</span>
                  <span className="font-semibold text-neutral-900">₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span className="font-semibold text-neutral-900">₹{platformFee}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-emerald-700" />
                    <span className="text-neutral-700 font-medium">Payment Mode</span>
                  </div>
                  <span className="font-bold text-emerald-800">Cash on Delivery</span>
                </div>

                <div className="flex justify-between items-baseline pt-2 border-t border-neutral-100 text-sm font-extrabold text-neutral-900">
                  <span>Payable on Delivery</span>
                  <span className="text-xl">₹{grandTotal}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-75 text-white rounded-xl text-sm font-bold shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isPlacingOrder ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Placing Order with Store...</span>
                  </>
                ) : !isAuthenticated ? (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Sign In & Place COD Order</span>
                    <span>•</span>
                    <span>₹{grandTotal}</span>
                  </>
                ) : (
                  <>
                    <span>Place COD Order</span>
                    <span>•</span>
                    <span>₹{grandTotal}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero cancellation fee within 60 seconds</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bottom Place Order Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-white/95 backdrop-blur-md border-t border-neutral-200 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] text-neutral-400 font-bold uppercase leading-tight">
            Pay on Delivery
          </div>
          <div className="text-lg font-black text-neutral-900 leading-tight">
            ₹{grandTotal}
          </div>
        </div>
        <button
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder}
          className="flex-1 max-w-[240px] py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-75 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
        >
          {isPlacingOrder ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Placing Order...</span>
            </>
          ) : !isAuthenticated ? (
            <>
              <Lock className="w-3.5 h-3.5" />
              <span>Sign In to Buy</span>
            </>
          ) : (
            <>
              <span>Place COD Order</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

      {/* Add / Edit Delivery Address Modal */}
      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => {
          setIsAddressModalOpen(false);
          setEditingAddressId(null);
        }}
        title={editingAddressId ? "Edit Delivery Address" : "Add New Delivery Address"}
        subtitle={
          editingAddressId
            ? "Update recipient name, phone number, and address details"
            : "Save address for fast neighborhood delivery in Bhubaneswar"
        }
      >
        <form onSubmit={handleAddNewAddress} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
              Address Label
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["Home", "Office", "Other"].map((lbl) => (
                <button
                  key={lbl}
                  type="button"
                  onClick={() => setNewLabel(lbl)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-colors ${
                    newLabel === lbl
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100"
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          {/* Customer / Recipient Name & Contact Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                Customer Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={newRecipient}
                  onChange={(e) => setNewRecipient(e.target.value)}
                  placeholder="e.g. Rahul Mohapatra"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-600 font-medium text-neutral-800"
                />
                <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                Contact Phone <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="e.g. +91 98610 54321"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-600 font-medium text-neutral-800"
                />
                <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
              Neighborhood / Area (Bhubaneswar)
            </label>
            <select
              value={newLocality}
              onChange={(e) => setNewLocality(e.target.value)}
              className="w-full px-3 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-600"
            >
              {locList.map((loc) => (
                <option key={loc.id} value={loc.name}>
                  {loc.name} ({loc.landmark})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
              House / Flat / Street Details
            </label>
            <textarea
              required
              rows={3}
              value={newStreet}
              onChange={(e) => setNewStreet(e.target.value)}
              placeholder="Flat number, building name, street, nearby landmark..."
              className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsAddressModalOpen(false);
                setEditingAddressId(null);
              }}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              {editingAddressId ? "Update Address" : "Save & Deliver Here"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
