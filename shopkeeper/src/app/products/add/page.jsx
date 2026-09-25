"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PortalLayout from "@/components/PortalLayout";
import Header from "@/components/Header";
import { useShopkeeper } from "@/context/ShopkeeperContext";
import {
  Upload,
  ArrowLeft,
  CheckCircle2,
  Package,
  Sparkles,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";

export default function AddProductPage() {
  const router = useRouter();
  const { addProduct } = useShopkeeper();

  const [formData, setFormData] = useState({
    name: "Samsung USB-C Cable",
    category: "Mobile Accessories",
    description: "Original fast charging braided Type-C cable with durable connectors (1.2m)",
    price: "299",
    stock: "25",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80",
  });

  const [imagePreview, setImagePreview] = useState(formData.image);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    "Mobile Accessories",
    "Audio",
    "Wearables",
    "Computer Accessories",
    "Storage",
    "Electrical",
    "Home & Office",
    "Cables",
    "Other",
  ];

  const presetImages = [
    {
      label: "Cable",
      url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80",
    },
    {
      label: "Charger",
      url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=400&q=80",
    },
    {
      label: "Earbuds",
      url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=400&q=80",
    },
    {
      label: "Speaker",
      url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=400&q=80",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMsg("");
  };

  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setErrorMsg("Product name is required");
      return;
    }
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      setErrorMsg("Please enter a valid price");
      return;
    }
    if (formData.stock === "" || isNaN(formData.stock) || Number(formData.stock) < 0) {
      setErrorMsg("Please enter valid stock quantity");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      addProduct({
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim(),
        price: Number(formData.price),
        stock: Number(formData.stock),
        image: imagePreview,
      });

      setIsSubmitting(false);
      setSuccessMsg("Product added successfully.");

      setTimeout(() => {
        router.push("/products");
      }, 1000);
    }, 400);
  };

  return (
    <PortalLayout>
      <Header
        title="Add Product"
        description="Add a new product to your local inventory for nearby buyers."
        actions={
          <Link
            href="/products"
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Products</span>
          </Link>
        }
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Success Alert */}
        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {errorMsg}
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 sm:p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Product Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Samsung USB-C Cable"
                required
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-slate-400"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Example: Samsung USB-C Cable
              </p>
            </div>

            {/* Product Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Product Category
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

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Product Description
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Short description of technical specs, warranty, or contents"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none placeholder:text-slate-400"
              />
            </div>

            {/* Product Image */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Product Image
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                <div className="w-20 h-20 rounded-lg border border-slate-300 bg-white overflow-hidden flex items-center justify-center shrink-0">
                  {imagePreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-slate-400" />
                  )}
                </div>

                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <label
                    htmlFor="product-image-upload"
                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs cursor-pointer transition-colors"
                  >
                    <Upload className="w-4 h-4 text-slate-500" />
                    <span>Upload Product Image</span>
                    <input
                      id="product-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageFile}
                      className="hidden"
                    />
                  </label>

                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <span className="text-[11px] text-slate-400">Presets:</span>
                    {presetImages.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          setImagePreview(preset.url);
                          setFormData((prev) => ({ ...prev, image: preset.url }));
                        }}
                        className={`text-[11px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                          imagePreview === preset.url
                            ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Price (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="price"
                    min="1"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="299"
                    required
                    className="w-full pl-8 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Example: ₹299</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="stock"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="25"
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
                />
                <p className="text-[11px] text-slate-400 mt-1">Example: 25</p>
              </div>
            </div>

            {/* Buttons: Save Product, Cancel */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <Link
                href="/products"
                className="py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-lg transition-colors"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? "Saving..." : "Save Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PortalLayout>
  );
}
