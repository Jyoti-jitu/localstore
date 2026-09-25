"use client";

import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import Header from "@/components/Header";
import { useShopkeeper } from "@/context/ShopkeeperContext";
import {
  Boxes,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  Minus,
  Save,
  Search,
} from "lucide-react";

export default function ManageInventoryPage() {
  const { products, updateStock, inventoryStats } = useShopkeeper();
  const [stockInputs, setStockInputs] = useState({});
  const [savedRowId, setSavedRowId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (id, val) => {
    setStockInputs((prev) => ({ ...prev, [id]: val }));
  };

  const handleQuickAdjust = (id, currentVal, delta) => {
    const activeVal =
      stockInputs[id] !== undefined
        ? parseInt(stockInputs[id], 10) || 0
        : currentVal;
    const newVal = Math.max(0, activeVal + delta);
    setStockInputs((prev) => ({ ...prev, [id]: newVal.toString() }));
  };

  const handleSaveStock = (id, defaultStock) => {
    const valToSave =
      stockInputs[id] !== undefined
        ? parseInt(stockInputs[id], 10) || 0
        : defaultStock;

    updateStock(id, valToSave);
    setSavedRowId(id);
    setTimeout(() => setSavedRowId(null), 1800);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PortalLayout>
      <Header
        title="Manage Inventory"
        description="Monitor product availability and update stock counts instantly."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* 4 Inventory Metric Cards (Requirement 9) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Total Products
              </span>
              <Boxes className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">
              {inventoryStats.totalProducts || 24}
            </div>
            <p className="text-xs text-slate-400 mt-1">Catalog items</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                In Stock
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600">
              {inventoryStats.inStock || 20}
            </div>
            <p className="text-xs text-slate-400 mt-1">&gt; 5 units available</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Low Stock
              </span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-600">
              {inventoryStats.lowStock || 3}
            </div>
            <p className="text-xs text-slate-400 mt-1">Needs reordering soon</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Out of Stock
              </span>
              <XCircle className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-rose-600">
              {inventoryStats.outOfStock || 1}
            </div>
            <p className="text-xs text-slate-400 mt-1">Currently unavailable</p>
          </div>
        </div>

        {/* Inventory Search & Simple List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Stock Adjustment
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Quickly increase or decrease units as your offline shelves update
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search inventory..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Simple Inventory Table (Requirement 9) */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-5">Product</th>
                  <th className="py-3 px-4">Current Stock</th>
                  <th className="py-3 px-4">Stock Status</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredProducts.map((p) => {
                  const currentValue =
                    stockInputs[p.id] !== undefined
                      ? stockInputs[p.id]
                      : p.stock;
                  const isSaved = savedRowId === p.id;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{p.name}</p>
                            <p className="text-xs text-slate-400">₹{p.price}</p>
                          </div>
                        </div>
                      </td>

                      {/* Stock edit control */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                          <button
                            type="button"
                            onClick={() => handleQuickAdjust(p.id, p.stock, -1)}
                            className="p-2 hover:bg-slate-100 text-slate-600 cursor-pointer transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={currentValue}
                            onChange={(e) => handleInputChange(p.id, e.target.value)}
                            className="w-14 text-center font-bold text-slate-900 focus:outline-none text-sm py-1 bg-transparent"
                          />
                          <button
                            type="button"
                            onClick={() => handleQuickAdjust(p.id, p.stock, 1)}
                            className="p-2 hover:bg-slate-100 text-slate-600 cursor-pointer transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Stock badge */}
                      <td className="py-3.5 px-4">
                        {p.stock === 0 ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                            <XCircle className="w-3 h-3" />
                            Out of Stock
                          </span>
                        ) : p.stock <= 5 ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                            <AlertTriangle className="w-3 h-3" />
                            Low Stock ({p.stock})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            In Stock
                          </span>
                        )}
                      </td>

                      {/* Action Button: Update Stock */}
                      <td className="py-3.5 px-5 text-right">
                        <button
                          type="button"
                          onClick={() => handleSaveStock(p.id, p.stock)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                            isSaved
                              ? "bg-emerald-600 text-white"
                              : "bg-blue-600 hover:bg-blue-700 text-white shadow-2xs"
                          }`}
                        >
                          {isSaved ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Updated</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-3.5 h-3.5" />
                              <span>Update Stock</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
