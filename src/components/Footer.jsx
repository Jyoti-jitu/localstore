"use client";

import React from "react";
import NextLink from "next/link";
import { Heart, ShieldCheck, MapPin, Phone, Mail } from "lucide-react";
import { useCategories } from "@/hooks/useSupabaseData";

export default function Footer() {
  const { categories } = useCategories();
  const catList = categories || [];
  return (
    <footer className="bg-white border-t border-neutral-200/90 pt-12 pb-24 md:pb-12 text-neutral-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-neutral-100">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <NextLink href="/" className="inline-block">
              <img
                src="/brand-logo.png"
                alt="LocalStore - Shop Local. Shop Online."
                className="h-9 sm:h-10 w-auto object-contain"
              />
            </NextLink>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Discover your local shops. Shop locally. Order online. A modern hyperlocal marketplace empowering neighborhood stores in Bhubaneswar.
            </p>
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-xs pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Genuine Neighborhood Stores</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="font-bold text-neutral-900 text-sm mb-3">Shop by Category</h4>
            <ul className="space-y-2">
              {catList.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <NextLink
                    href={`/explore?category=${cat.id}`}
                    className="hover:text-emerald-700 transition-colors"
                  >
                    {cat.name}
                  </NextLink>
                </li>
              ))}
              <li>
                <NextLink href="/explore" className="text-emerald-600 font-semibold hover:underline">
                  All categories →
                </NextLink>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="font-bold text-neutral-900 text-sm mb-3">Customer Care</h4>
            <ul className="space-y-2">
              <li>
                <NextLink href="/orders" className="hover:text-emerald-700 transition-colors">
                  Track Your Order
                </NextLink>
              </li>
              <li>
                <NextLink href="/help" className="hover:text-emerald-700 transition-colors">
                  Help & FAQs
                </NextLink>
              </li>
              <li>
                <NextLink href="/help" className="hover:text-emerald-700 transition-colors">
                  Report Store or Order Issue
                </NextLink>
              </li>
              <li>
                <NextLink href="/addresses" className="hover:text-emerald-700 transition-colors">
                  Saved Addresses
                </NextLink>
              </li>
              <li>
                <NextLink href="/favorites" className="hover:text-emerald-700 transition-colors">
                  Favorite Stores & Products
                </NextLink>
              </li>
            </ul>
          </div>

          {/* Neighborhood Hub */}
          <div>
            <h4 className="font-bold text-neutral-900 text-sm mb-3">Bhubaneswar Hub</h4>
            <div className="space-y-2.5 text-neutral-500">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Operating across Jayadev Vihar, Patia, Saheed Nagar, Khandagiri & Chandrasekharpur.</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>+91 (0674) 259-8800</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>support@localstore.in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-400 text-[11px]">
          <div>
            © {new Date().getFullYear()} LocalStore Technologies Pvt Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <NextLink href="/help" className="hover:text-neutral-600">Privacy Policy</NextLink>
            <NextLink href="/help" className="hover:text-neutral-600">Terms of Service</NextLink>
            <NextLink href="/shopkeeper" className="text-emerald-700 font-bold hover:underline">Become a Shopkeeper</NextLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
