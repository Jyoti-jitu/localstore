"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getOrders, createOrder as createSupabaseOrder } from "@/lib/supabase/db";

const OrdersContext = createContext(null);

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadOrders() {
      try {
        const saved = localStorage.getItem("localstore_orders");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (isMounted && Array.isArray(parsed) && parsed.length > 0) {
            setOrders(parsed);
          } else {
            const remoteOrders = await getOrders();
            if (isMounted) setOrders(remoteOrders || []);
          }
        } else {
          // Fetch directly from Supabase
          const remoteOrders = await getOrders();
          if (isMounted) setOrders(remoteOrders || []);
        }
      } catch (e) {
        console.error(e);
        if (isMounted) setOrders([]);
      } finally {
        if (isMounted) setIsLoaded(true);
      }
    }

    loadOrders();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("localstore_orders", JSON.stringify(orders));
      } catch (e) {
        console.error(e);
      }
    }
  }, [orders, isLoaded]);

  const createOrder = async ({
    userId,
    customerName,
    customerPhone,
    items,
    shopId,
    shopName,
    shopAddress,
    shopPhone,
    deliveryAddress,
    paymentMethod,
    itemsTotal,
    deliveryFee,
    platformFee,
    discount,
    total
  }) => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newOrderId = `LS${randomNum}`;
    const now = new Date();
    const dateFormatted =
      now.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      }) + `, ${now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`;

    const newOrder = {
      orderId: newOrderId,
      userId: userId || null,
      customerName: customerName || deliveryAddress?.recipient || deliveryAddress?.name || "Customer",
      customerPhone: customerPhone || deliveryAddress?.phone || "",
      date: dateFormatted,
      shopId: shopId || "sharma-grocery",
      shopName: shopName || "Sharma Grocery Store",
      shopAddress: shopAddress || "Jayadev Vihar, Bhubaneswar",
      shopPhone: shopPhone || "+91 94370 12345",
      status: "preparing",
      statusLabel: "Store Accepted",
      estimatedDelivery: "25–35 minutes",
      estimatedArrival: "In 30 mins",
      deliveryPartner: {
        name: "Manas Barik",
        phone: "+91 97761 44556",
        vehicle: "Honda Activa (OD-02-BQ-8819)",
        rating: 4.8
      },
      items: items.map((i) => ({
        id: i.product.id,
        name: i.product.name,
        quantity: i.quantity,
        price: i.product.price
      })),
      itemsTotal,
      deliveryFee,
      platformFee,
      discount,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === "Cash on Delivery" ? "Pay on Delivery" : "Paid via UPI",
      deliveryAddress,
      timeline: [
        { step: "Order Placed", time: "Just now", completed: true, current: false },
        { step: "Store Accepted", time: "Just now", completed: true, current: true },
        { step: "Preparing Your Order", time: "Est. in 5 min", completed: false, current: false },
        { step: "Out for Delivery", time: "Est. in 15 min", completed: false, current: false },
        { step: "Delivered", time: "Est. in 30 min", completed: false, current: false }
      ]
    };

    // Update local state immediately for instant feedback
    setOrders((prev) => [newOrder, ...prev]);

    // Persist to Supabase asynchronously
    try {
      await createSupabaseOrder(newOrder);
    } catch (err) {
      console.warn("Failed to persist order to Supabase:", err);
    }

    return newOrder;
  };

  const getOrderById = (id) => {
    return orders.find((o) => o.orderId.toLowerCase() === id?.toLowerCase());
  };

  const cancelOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.orderId === orderId
          ? {
              ...o,
              status: "cancelled",
              statusLabel: "Cancelled",
              timeline: o.timeline.map((t) => ({ ...t, completed: false, current: false }))
            }
          : o
      )
    );
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        createOrder,
        getOrderById,
        cancelOrder
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
}
