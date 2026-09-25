"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import NextLink from "next/link";
import { useOrders } from "@/context/OrdersContext";
import { useToast } from "@/context/ToastContext";
import { getOrderById as getSupabaseOrderById } from "@/lib/supabase/db";
import OrderTimeline from "@/components/OrderTimeline";
import Modal from "@/components/Modal";
import {
  ChevronLeft,
  Store,
  Phone,
  Bike,
  MapPin,
  Clock,
  ShieldCheck,
  HelpCircle,
  XCircle,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.orderId || "LS10245";
  const { getOrderById, cancelOrder, orders } = useOrders();
  const { showToast } = useToast();

  const contextOrder =
    getOrderById(orderId) ||
    orders?.find((o) => o.orderId?.toLowerCase() === orderId?.toLowerCase());

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [remoteOrder, setRemoteOrder] = useState(null);
  const [loadingRemote, setLoadingRemote] = useState(() => !contextOrder && Boolean(orderId));

  useEffect(() => {
    if (!contextOrder && orderId) {
      let isMounted = true;
      getSupabaseOrderById(orderId)
        .then((data) => {
          if (isMounted) {
            if (data) setRemoteOrder(data);
            setLoadingRemote(false);
          }
        })
        .catch(() => {
          if (isMounted) setLoadingRemote(false);
        });
      return () => {
        isMounted = false;
      };
    }
  }, [contextOrder, orderId]);

  const order = contextOrder || remoteOrder;

  if (!order && loadingRemote) {
    return (
      <div className="min-h-screen bg-[#fbfbfb] py-12 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
        <p className="text-xs text-neutral-500 font-medium">Retrieving order details from Supabase...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#fbfbfb] py-12 flex flex-col items-center justify-center text-center px-4">
        <AlertCircle className="w-12 h-12 text-neutral-400 mb-3" />
        <h2 className="text-base font-bold text-neutral-800">Order #{orderId} not found</h2>
        <p className="text-xs text-neutral-500 mt-1 max-w-sm">
          We could not locate this order in our live database.
        </p>
        <NextLink
          href="/orders"
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-700 transition-colors"
        >
          Back to Orders
        </NextLink>
      </div>
    );
  }

  const handleCancelOrder = () => {
    cancelOrder(order.orderId);
    setIsCancelModalOpen(false);
    showToast(`Order #${order.orderId} has been cancelled.`);
  };

  const handleCall = (num, name) => {
    showToast(`Calling ${name} at ${num}...`, "info");
  };

  return (
    <div className="min-h-screen bg-[#fbfbfb] py-3 sm:py-8 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        {/* Back navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/orders")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Orders</span>
          </button>

          <button
            onClick={() => setIsHelpModalOpen(true)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-600 hover:text-emerald-700"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Need Help?</span>
          </button>
        </div>

        {/* Tracking Header */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 p-4 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-neutral-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Order #{order.orderId}
                </span>
                <span className="text-neutral-300">•</span>
                <span className="text-xs text-neutral-500">{order.date}</span>
              </div>
              <h1 className="text-lg sm:text-2xl font-extrabold text-neutral-900 tracking-tight mt-0.5">
                {order.status === "delivered"
                  ? "Order Delivered"
                  : order.status === "cancelled"
                  ? "Order Cancelled"
                  : "Order in Progress"}
              </h1>
            </div>

            {order.status !== "delivered" && order.status !== "cancelled" && (
              <div className="flex items-center gap-3 bg-emerald-50 text-emerald-900 px-4 py-2.5 rounded-2xl border border-emerald-200">
                <Clock className="w-5 h-5 text-emerald-600 animate-spin" />
                <div>
                  <div className="text-[11px] text-emerald-700 uppercase font-bold tracking-wider">
                    Estimated Delivery
                  </div>
                  <div className="text-sm font-extrabold">{order.estimatedDelivery}</div>
                </div>
              </div>
            )}
          </div>

          {/* Visual Order Timeline */}
          <div className="pt-6">
            <h3 className="font-bold text-sm text-neutral-900 mb-4">Live Tracking Timeline</h3>
            <OrderTimeline timeline={order.timeline} currentStatus={order.status} />
          </div>

          {/* Cancel button if order is fresh */}
          {order.status !== "delivered" && order.status !== "cancelled" && (
            <div className="pt-4 border-t border-neutral-100 flex justify-end">
              <button
                onClick={() => setIsCancelModalOpen(true)}
                className="text-xs text-neutral-400 hover:text-rose-600 font-medium transition-colors"
              >
                Cancel Order
              </button>
            </div>
          )}
        </div>

        {/* 2-Column Info: Rider & Merchant + Bill & Delivery Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Merchant & Delivery Partner */}
          <div className="space-y-5">
            {/* Delivery Partner Card */}
            {order.deliveryPartner && order.status !== "cancelled" && (
              <div className="bg-white rounded-3xl border border-neutral-200/90 p-5 shadow-xs space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <Bike className="w-4 h-4 text-emerald-600" />
                  <span>Assigned Delivery Rider</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-neutral-900">
                      {order.deliveryPartner.name}
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {order.deliveryPartner.vehicle} · ⭐ {order.deliveryPartner.rating}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCall(order.deliveryPartner.phone, order.deliveryPartner.name)}
                    className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                    title="Call delivery partner"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Shopkeeper Details */}
            <div className="bg-white rounded-3xl border border-neutral-200/90 p-5 shadow-xs space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Store className="w-4 h-4 text-emerald-600" />
                <span>Preparing Merchant</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <NextLink
                    href={`/shop/${order.shopId}`}
                    className="font-bold text-sm text-neutral-900 hover:text-emerald-700 transition-colors"
                  >
                    {order.shopName}
                  </NextLink>
                  <p className="text-xs text-neutral-500 mt-0.5">{order.shopAddress}</p>
                </div>
                <button
                  onClick={() => handleCall(order.shopPhone, order.shopName)}
                  className="p-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                  title="Call shopkeeper"
                >
                  <Phone className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-3xl border border-neutral-200/90 p-5 shadow-xs space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Delivery Address</span>
              </div>
              <p className="text-xs text-neutral-700 font-semibold leading-relaxed">
                {order.deliveryAddress?.street}, {order.deliveryAddress?.city} - {order.deliveryAddress?.pincode}
              </p>
            </div>
          </div>

          {/* Right Column: Order Items & Payment Breakdown */}
          <div className="bg-white rounded-3xl border border-neutral-200/90 p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-neutral-900 pb-2 border-b border-neutral-100">
              Order Summary ({order.items.length} items)
            </h3>

            {/* Item list */}
            <div className="divide-y divide-neutral-100 text-xs">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-neutral-900">{item.quantity}x</span>{" "}
                    <span className="text-neutral-700">{item.name}</span>
                  </div>
                  <span className="font-semibold text-neutral-900">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Bill Details */}
            <div className="pt-3 border-t border-neutral-100 space-y-2 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-neutral-900">₹{order.itemsTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-semibold text-neutral-900">₹{order.deliveryFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span className="font-semibold text-neutral-900">₹{order.platformFee}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Local Discount</span>
                  <span>-₹{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline pt-2 border-t border-neutral-100 text-sm font-extrabold text-neutral-900">
                <span>Total Paid</span>
                <span className="text-lg">₹{order.total}</span>
              </div>
              <div className="text-[11px] text-neutral-400">
                Paid via {order.paymentMethod} ({order.paymentStatus})
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Cancel Order?"
        subtitle="Are you sure you want to cancel this neighborhood order?"
      >
        <div className="space-y-4 text-xs text-neutral-600">
          <p>
            If you cancel now, your order will not be prepared and any online payment will be refunded to your source UPI/Card within 1–2 business days.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsCancelModalOpen(false)}
              className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl font-semibold"
            >
              Keep Order
            </button>
            <button
              onClick={handleCancelOrder}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold"
            >
              Yes, Cancel Order
            </button>
          </div>
        </div>
      </Modal>

      {/* Help Modal */}
      <Modal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        title="Order Assistance"
        subtitle={`Help for Order #${order.orderId}`}
      >
        <div className="space-y-3 text-xs text-neutral-700">
          <button
            onClick={() => {
              setIsHelpModalOpen(false);
              showToast("Support ticket raised. LocalStore agent will contact you shortly.");
            }}
            className="w-full p-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-left font-semibold"
          >
            Item missing or incorrect
          </button>
          <button
            onClick={() => {
              setIsHelpModalOpen(false);
              showToast("Rider contacted. Arrival expected shortly.");
            }}
            className="w-full p-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-left font-semibold"
          >
            Delivery delayed
          </button>
          <button
            onClick={() => {
              setIsHelpModalOpen(false);
              showToast("Calling LocalStore customer helpline at +91 674 259 8800");
            }}
            className="w-full p-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-left font-semibold"
          >
            Contact customer care helpline
          </button>
        </div>
      </Modal>
    </div>
  );
}
