"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PortalLayout from "@/components/PortalLayout";
import Header from "@/components/Header";
import { useShopkeeper } from "@/context/ShopkeeperContext";
import {
  ShoppingBag,
  User,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  PackageCheck,
  Check,
  X,
  ChevronRight,
  Filter,
} from "lucide-react";

function OrdersContent() {
  const { orders, updateOrderStatus } = useShopkeeper();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const viewId = searchParams.get("view");
    if (viewId) {
      const found = orders.find((o) => o.id === viewId);
      if (found) setSelectedOrder(found);
    }
  }, [searchParams, orders]);

  const tabs = ["All", "New", "Confirmed", "Ready", "Completed", "Cancelled"];

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "All") return true;
    return order.status.toLowerCase() === activeTab.toLowerCase();
  });

  const handleUpdateStatus = (orderId, nextStatus) => {
    updateOrderStatus(orderId, nextStatus);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => ({ ...prev, status: nextStatus }));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Confirmed":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Ready":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <PortalLayout>
      <Header
        title="Receive Orders"
        description="Manage live customer requests, confirm orders, and prepare for delivery or pickup."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
          {tabs.map((tab) => {
            const count =
              tab === "All"
                ? orders.length
                : orders.filter((o) => o.status.toLowerCase() === tab.toLowerCase()).length;
            const isActive = activeTab === tab;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Orders Grid (Requirement 10 Order Cards) */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
            <ShoppingBag className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-600">No {activeTab} orders found.</p>
            <p className="text-xs text-slate-400 mt-0.5">Orders will appear here as customers buy from your store.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs hover:border-blue-200 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header: Order # & Status */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Order #{order.id}
                      </span>
                      <span className="text-[11px] text-slate-400">{order.createdAt}</span>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Customer & Info */}
                  <div className="py-3.5 space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 font-medium block">Customer:</span>
                      <span className="text-sm font-bold text-slate-800">
                        {order.customer}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span>{order.itemCount || order.items.length} Products</span>
                      <span className="text-xs font-semibold text-emerald-600">
                        Payment: {order.paymentStatus}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Total:</span>
                      <span className="text-base font-bold text-slate-900">
                        ₹{order.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* View Order Button */}
                <div className="pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(order)}
                    className="w-full py-2 px-3 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>View Order</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Requirement 11: ORDER DETAIL MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base">
                    Order Details #{selectedOrder.id}
                  </h3>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Placed {selectedOrder.createdAt}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Customer Info */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                  <User className="w-4 h-4 text-blue-600" />
                  <span>Customer Name:</span>
                  <span className="font-bold text-slate-900">{selectedOrder.customer}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span className="text-slate-500">Phone Number:</span>
                  <a
                    href={`tel:${selectedOrder.phone}`}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    {selectedOrder.phone}
                  </a>
                </div>

                <div className="flex items-start gap-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-500">Delivery Address:</span>
                    <p className="font-medium text-slate-800 mt-0.5">
                      {selectedOrder.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Products List as shown in Requirement 11 Example */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Products in Order
                </h4>
                <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 flex items-center justify-between text-sm"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">
                          {item.name} × {item.qty}
                        </p>
                        <p className="text-xs text-slate-400">
                          ₹{item.price.toLocaleString()} each
                        </p>
                      </div>
                      <span className="font-bold text-slate-900">
                        ₹{(item.price * item.qty).toLocaleString()}
                      </span>
                    </div>
                  ))}

                  <div className="p-3.5 bg-slate-50/70 flex items-center justify-between text-sm border-t border-slate-200">
                    <span className="font-bold text-slate-700">Total Amount</span>
                    <span className="text-base font-extrabold text-slate-900">
                      ₹{selectedOrder.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment & Order Status */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block font-medium">Payment Status:</span>
                  <span className="font-bold text-emerald-600 text-sm mt-0.5 block">
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block font-medium">Order Status:</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Update Order Progress:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedOrder.id, "Confirmed")}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      selectedOrder.status === "Confirmed"
                        ? "bg-amber-600 text-white border-amber-600"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    Confirm Order
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedOrder.id, "Ready")}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      selectedOrder.status === "Ready"
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    Mark Ready
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedOrder.id, "Completed")}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      selectedOrder.status === "Completed"
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    Complete Order
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleUpdateStatus(selectedOrder.id, "Cancelled")}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
              >
                Cancel Order
              </button>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}

export default function ReceiveOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <div className="text-slate-400 text-sm font-medium">Loading orders...</div>
        </div>
      }
    >
      <OrdersContent />
    </Suspense>
  );
}
