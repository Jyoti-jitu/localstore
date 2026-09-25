"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

export default function BottomSheet({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:hidden bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div
        className="w-full bg-white rounded-t-3xl shadow-2xl border-t border-neutral-200 overflow-hidden max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300"
      >
        {/* Grab Handle */}
        <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto mt-3" />

        {/* Header */}
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="font-bold text-neutral-900 text-base">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto custom-scrollbar flex-1 pb-10">
          {children}
        </div>
      </div>
    </div>
  );
}
