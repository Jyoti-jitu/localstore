"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const ShopkeeperContext = createContext(null);

const INITIAL_PRODUCTS = [
  {
    id: "prod-1",
    name: "Samsung USB-C Cable",
    category: "Mobile Accessories",
    description: "Original fast charging braided Type-C cable (1.2m)",
    price: 299,
    stock: 25,
    status: "Active",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "prod-2",
    name: "Samsung Fast Charger",
    category: "Mobile Accessories",
    description: "25W Super Fast Wall Charger with Power Delivery",
    price: 799,
    stock: 10,
    status: "Active",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "prod-3",
    name: "Wireless Earbuds",
    category: "Audio",
    description: "TWS True Wireless Earbuds with ENC mic & deep bass",
    price: 1499,
    stock: 0,
    status: "Out of Stock",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "prod-4",
    name: "Bluetooth Speaker",
    category: "Audio",
    description: "Portable 10W Waterproof Bluetooth Speaker",
    price: 2199,
    stock: 4,
    status: "Active",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "prod-5",
    name: "Magnetic Car Mount",
    category: "Mobile Accessories",
    description: "Universal 360-degree rotating dashboard phone holder",
    price: 349,
    stock: 18,
    status: "Active",
    image: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "prod-6",
    name: "10000mAh Power Bank",
    category: "Mobile Accessories",
    description: "Slim dual port 22.5W fast charge power bank",
    price: 999,
    stock: 3,
    status: "Active",
    image: "https://images.unsplash.com/photo-1609592424855-8335f606e121?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "prod-7",
    name: "Smart Fitness Band",
    category: "Wearables",
    description: "AMOLED fitness tracker with heart rate & SpO2 monitor",
    price: 1899,
    stock: 2,
    status: "Active",
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "prod-8",
    name: "Over-Ear Wireless Headphones",
    category: "Audio",
    description: "Comfortable cushioned over-ear headphones with 30hr battery",
    price: 2499,
    stock: 8,
    status: "Active",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "prod-9",
    name: "9H Tempered Glass Screen Guard",
    category: "Mobile Accessories",
    description: "Scratch-resistant edge-to-edge protective glass",
    price: 199,
    stock: 40,
    status: "Active",
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "prod-10",
    name: "Heavy Duty Phone Case",
    category: "Mobile Accessories",
    description: "Shockproof rugged armor cover with kickstand",
    price: 399,
    stock: 15,
    status: "Active",
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "prod-11",
    name: "Wireless Optical Mouse",
    category: "Computer Accessories",
    description: "2.4GHz ergonomic quiet click optical mouse",
    price: 499,
    stock: 12,
    status: "Active",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "prod-12",
    name: "Backlit Slim Keyboard",
    category: "Computer Accessories",
    description: "Compact rechargeable wireless keyboard",
    price: 1299,
    stock: 9,
    status: "Active",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "prod-13",
    name: "OTG Adapter Dual USB 3.0",
    category: "Mobile Accessories",
    description: "High speed data transfer Type-C to USB adapter",
    price: 149,
    stock: 35,
    status: "Active",
    image: "https://images.unsplash.com/photo-1622445262464-84b14e0745b1?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "prod-14",
    name: "64GB High Speed MicroSD Card",
    category: "Storage",
    description: "Class 10 U3 100MB/s memory card for phones & cameras",
    price: 549,
    stock: 22,
    status: "Active",
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "prod-15",
    name: "Multi-Port Extension Board",
    category: "Electrical",
    description: "4 socket surge protector with 3 USB smart ports",
    price: 699,
    stock: 14,
    status: "Active",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "prod-16",
    name: "Aux Audio Cable 3.5mm",
    category: "Audio",
    description: "Gold-plated braided male-to-male auxiliary cord",
    price: 179,
    stock: 30,
    status: "Active",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "prod-17",
    name: "LED Desk Lamp with USB Port",
    category: "Home & Office",
    description: "Eye-caring touch control dimmable study light",
    price: 899,
    stock: 11,
    status: "Active",
    image: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "prod-18",
    name: "HDMI 4K Cable (2 Metres)",
    category: "Cables",
    description: "High speed 18Gbps 4K@60Hz braided monitor cable",
    price: 349,
    stock: 16,
    status: "Active",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "prod-19",
    name: "Ring Light with Tripod Stand",
    category: "Photography",
    description: "10-inch LED ring light for video calls and content",
    price: 1199,
    stock: 7,
    status: "Active",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "prod-20",
    name: "Wi-Fi Range Extender",
    category: "Networking",
    description: "300Mbps dual external antenna signal booster",
    price: 1299,
    stock: 8,
    status: "Active",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "prod-21",
    name: "USB Clip-on Mini Fan",
    category: "Appliances",
    description: "3-speed rechargeable personal desk fan",
    price: 449,
    stock: 13,
    status: "Active",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "prod-22",
    name: "Fast Car Charger 38W Dual Port",
    category: "Mobile Accessories",
    description: "Quick Charge 3.0 & PD Type-C metal car plug",
    price: 499,
    stock: 19,
    status: "Active",
    image: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "prod-23",
    name: "Universal Travel Adapter Plug",
    category: "Travel",
    description: "All-in-one international wall socket converter",
    price: 599,
    stock: 17,
    status: "Active",
    image: "https://images.unsplash.com/photo-1609592424855-8335f606e121?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "prod-24",
    name: "Waterproof Mobile Pouch",
    category: "Mobile Accessories",
    description: "IPX8 certified clear touch dry bag for smartphones",
    price: 129,
    stock: 28,
    status: "Active",
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=400&q=80",
  },
];

const INITIAL_ORDERS = [
  {
    id: "LH10245",
    customer: "Rahul Kumar",
    phone: "+91 98765 12345",
    address: "Plot 204, Near SUM Hospital, Kalinga Nagar, Bhubaneswar, 751003",
    items: [
      { name: "Samsung Charger", qty: 1, price: 799 },
      { name: "USB Cable", qty: 1, price: 299 },
    ],
    itemCount: 2,
    total: 1098,
    paymentStatus: "Paid",
    status: "New",
    createdAt: "10 mins ago",
  },
  {
    id: "LH10244",
    customer: "Priya Sharma",
    phone: "+91 98123 45678",
    address: "House 12, Jagamara Main Road, Khandagiri, Bhubaneswar, 751030",
    items: [{ name: "Bluetooth Speaker", qty: 1, price: 2199 }],
    itemCount: 1,
    total: 2199,
    paymentStatus: "Paid",
    status: "Confirmed",
    createdAt: "45 mins ago",
  },
  {
    id: "LH10243",
    customer: "Amit Patel",
    phone: "+91 97234 56789",
    address: "Flat 4B, Metro Greens, Ghatikia, Bhubaneswar, 751003",
    items: [
      { name: "Samsung USB-C Cable", qty: 2, price: 299 },
      { name: "9H Tempered Glass", qty: 1, price: 199 },
    ],
    itemCount: 3,
    total: 797,
    paymentStatus: "Paid",
    status: "Ready",
    createdAt: "2 hours ago",
  },
  {
    id: "LH10242",
    customer: "Sneha Das",
    phone: "+91 96345 67890",
    address: "B-14, Surya Enclave, Patia, Bhubaneswar, 751024",
    items: [{ name: "Smart Fitness Band", qty: 1, price: 1899 }],
    itemCount: 1,
    total: 1899,
    paymentStatus: "Paid",
    status: "Completed",
    createdAt: "Yesterday",
  },
  {
    id: "LH10241",
    customer: "Rajesh Mohanty",
    phone: "+91 95456 78901",
    address: "108 VIP Colony, Nayapalli, Bhubaneswar, 751012",
    items: [{ name: "Wireless Optical Mouse", qty: 1, price: 499 }],
    itemCount: 1,
    total: 499,
    paymentStatus: "Paid",
    status: "Completed",
    createdAt: "Yesterday",
  },
  {
    id: "LH10240",
    customer: "Sunita Behera",
    phone: "+91 94567 89012",
    address: "Lane 5, Jayadev Vihar, Bhubaneswar, 751013",
    items: [{ name: "Backlit Slim Keyboard", qty: 1, price: 1299 }],
    itemCount: 1,
    total: 1299,
    paymentStatus: "Refunded",
    status: "Cancelled",
    createdAt: "2 days ago",
  },
];

export function ShopkeeperProvider({ children }) {
  // Step in user journey: 'register' | 'verify' | 'pending' | 'approved' | 'profile_setup' | 'completed'
  const [authStep, setAuthStep] = useState("completed");

  const [shopkeeper, setShopkeeper] = useState({
    ownerName: "Jitu Sahoo",
    businessName: "Jitu Electronics",
    email: "jitu.electronics@example.com",
    phone: "+91 98765 43210",
    applicationId: "LH-10245",
  });

  const [businessProfile, setBusinessProfile] = useState({
    businessName: "Jitu Electronics",
    category: "Electronics & Mobile Accessories",
    description: "Trusted neighborhood electronics and gadget store. Authentic smartphone accessories, chargers, cables, audio gear, and prompt local delivery.",
    phone: "+91 98765 43210",
    address: "Shop #14, SUM Hospital Road, Shampur",
    city: "Bhubaneswar",
    state: "Odisha",
    pincode: "751003",
    logo: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=400&q=80",
    openingDays: "Monday – Sunday",
    openingTime: "09:00 AM",
    closingTime: "09:30 PM",
  });

  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from localStorage if present
  useEffect(() => {
    try {
      const savedStep = localStorage.getItem("lh_shopkeeper_auth_step");
      const savedUser = localStorage.getItem("lh_shopkeeper_user");
      const savedProfile = localStorage.getItem("lh_shopkeeper_profile");
      const savedProducts = localStorage.getItem("lh_shopkeeper_products");
      const savedOrders = localStorage.getItem("lh_shopkeeper_orders");

      if (savedStep) setAuthStep(savedStep);
      if (savedUser) setShopkeeper(JSON.parse(savedUser));
      if (savedProfile) setBusinessProfile(JSON.parse(savedProfile));
      if (savedProducts) setProducts(JSON.parse(savedProducts));
      if (savedOrders) setOrders(JSON.parse(savedOrders));
    } catch {
      // fallback to initial state
    }
    setIsLoaded(true);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("lh_shopkeeper_auth_step", authStep);
      localStorage.setItem("lh_shopkeeper_user", JSON.stringify(shopkeeper));
      localStorage.setItem("lh_shopkeeper_profile", JSON.stringify(businessProfile));
      localStorage.setItem("lh_shopkeeper_products", JSON.stringify(products));
      localStorage.setItem("lh_shopkeeper_orders", JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [authStep, shopkeeper, businessProfile, products, orders, isLoaded]);

  // Product management
  const addProduct = (newProduct) => {
    const item = {
      id: `prod-${Date.now()}`,
      status: Number(newProduct.stock) > 0 ? "Active" : "Out of Stock",
      ...newProduct,
      price: Number(newProduct.price),
      stock: Number(newProduct.stock),
      image: newProduct.image || "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=400&q=80",
    };
    setProducts((prev) => [item, ...prev]);
    return item;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const merged = { ...p, ...updatedFields };
          merged.status = Number(merged.stock) > 0 ? "Active" : "Out of Stock";
          return merged;
        }
        return p;
      })
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateStock = (id, newStock) => {
    const stockNum = Math.max(0, parseInt(newStock, 10) || 0);
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              stock: stockNum,
              status: stockNum > 0 ? "Active" : "Out of Stock",
            }
          : p
      )
    );
  };

  // Order status management
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  // Computed inventory metrics
  const totalProducts = products.length;
  const inStockCount = products.filter((p) => p.stock > 5).length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  // Quick reset to any step for demoing
  const jumpToStep = (step) => {
    setAuthStep(step);
  };

  const resetAllData = () => {
    setAuthStep("register");
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    localStorage.clear();
  };

  return (
    <ShopkeeperContext.Provider
      value={{
        authStep,
        setAuthStep,
        jumpToStep,
        resetAllData,
        shopkeeper,
        setShopkeeper,
        businessProfile,
        setBusinessProfile,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        orders,
        updateOrderStatus,
        inventoryStats: {
          totalProducts,
          inStock: inStockCount,
          lowStock: lowStockCount,
          outOfStock: outOfStockCount,
        },
        isLoaded,
      }}
    >
      {children}
    </ShopkeeperContext.Provider>
  );
}

export function useShopkeeper() {
  const context = useContext(ShopkeeperContext);
  if (!context) {
    throw new Error("useShopkeeper must be used within a ShopkeeperProvider");
  }
  return context;
}
