"use client";

import React, { useState } from "react";
import Link from "next/link";
import PortalLayout from "@/components/PortalLayout";
import Header from "@/components/Header";
import { useShopkeeper } from "@/context/ShopkeeperContext";
import {
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  X,
  Package,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function ManageProductsPage() {
  const { products, updateProduct, deleteProduct } = useShopkeeper();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Edit modal state
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2500);
  };

  const categories = [
    "All",
    "Mobile Accessories",
    "Audio",
    "Wearables",
    "Computer Accessories",
    "Storage",
    "Electrical",
    "Home & Office",
    "Cables",
  ];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      categoryFilter === "All" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    updateProduct(editingProduct.id, {
      name: editingProduct.name,
      price: Number(editingProduct.price),
      stock: Number(editingProduct.stock),
      category: editingProduct.category,
      status: Number(editingProduct.stock) > 0 ? "Active" : "Out of Stock",
    });

    setEditingProduct(null);
    showToast("Product updated successfully.");
  };

  const handleConfirmDelete = () => {
    if (!deleteCandidate) return;
    deleteProduct(deleteCandidate.id);
    setDeleteCandidate(null);
    showToast("Product deleted successfully.");
  };

  return (
    <PortalLayout>
      <Header
        title="Manage Products"
        description="View, edit price and stock, or remove products from your LocalHub catalog."
        actions={
          <Link
            href="/products/add"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add Product</span>
          </Link>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Toast */}
        {toastMessage && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by name or category..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 whitespace-nowrap">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Desktop Table View (Requirement 8) */}
        <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-5">Product</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400 text-sm">
                    No products found matching &ldquo;{searchQuery}&rdquo;.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                          {p.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 leading-snug">
                            {p.name}
                          </p>
                          <p className="text-xs text-slate-400">{p.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      ₹{p.price.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-semibold ${
                          p.stock === 0
                            ? "text-rose-600"
                            : p.stock <= 5
                            ? "text-amber-600"
                            : "text-slate-800"
                        }`}
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          p.stock > 0
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {p.stock > 0 ? "Active" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingProduct(p)}
                          className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteCandidate(p)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Product Cards View (Requirement 8) */}
        <div className="md:hidden space-y-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-400 text-sm">
              No products found.
            </div>
          ) : (
            filteredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-slate-900 leading-snug truncate">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-400">{p.category}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-base font-bold text-slate-900">
                        ₹{p.price.toLocaleString()}
                      </span>
                      <span
                        className={`text-xs font-semibold ${
                          p.stock === 0 ? "text-rose-600" : "text-slate-600"
                        }`}
                      >
                        Stock: {p.stock}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      p.stock > 0
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                  >
                    {p.stock > 0 ? "Active" : "Out of Stock"}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(p)}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteCandidate(p)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-xl p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900">Edit Product</h3>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: e.target.value,
                      })
                    }
                    required
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingProduct.stock}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        stock: e.target.value,
                      })
                    }
                    required
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={editingProduct.category || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      category: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full border border-slate-200 shadow-xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Delete Product?
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Are you sure you want to remove &ldquo;{deleteCandidate.name}&rdquo;?
              This action cannot be undone.
            </p>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="flex-1 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
