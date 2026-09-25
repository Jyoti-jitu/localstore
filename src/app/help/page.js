"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import { useFaqs } from "@/hooks/useSupabaseData";
import { useToast } from "@/context/ToastContext";
import {
  HelpCircle,
  Package,
  CreditCard,
  AlertTriangle,
  RotateCcw,
  Store,
  MessageSquare,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  Send
} from "lucide-react";

export default function HelpPage() {
  const { showToast } = useToast();
  const { faqs } = useFaqs();
  const faqList = faqs || [];
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState("Order issue");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const topics = [
    { label: "Order issue", icon: Package },
    { label: "Payment issue", icon: CreditCard },
    { label: "Missing product", icon: AlertTriangle },
    { label: "Refund inquiry", icon: RotateCcw },
    { label: "Store issue", icon: Store },
    { label: "General question", icon: MessageSquare }
  ];

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setMessage("");
      showToast(
        "Support request submitted! A Bhubaneswar local care specialist will contact you within 15 minutes."
      );
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#fbfbfb] py-3 sm:py-8 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-4 sm:space-y-8">
        <div>
          <NextLink
            href="/account"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 mb-1 sm:mb-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Account</span>
          </NextLink>

          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-700 mb-0.5 sm:mb-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Customer Assistance</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Help & Customer Support
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5 sm:mt-1">
            Have questions about local fulfillment, delivery riders, or store orders? We are here for you.
          </p>
        </div>

        {/* Quick Topic Selection */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {topics.map((t) => {
            const Icon = t.icon;
            const isSelected = selectedTopic === t.label;
            return (
              <button
                key={t.label}
                onClick={() => setSelectedTopic(t.label)}
                className={`p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border text-left flex items-center sm:items-start gap-2.5 sm:gap-3 transition-all ${
                  isSelected
                    ? "bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950 font-bold shadow-xs"
                    : "bg-white border-neutral-200 hover:border-neutral-300 text-neutral-700"
                }`}
              >
                <div
                  className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl flex-shrink-0 ${
                    isSelected ? "bg-emerald-600 text-white" : "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="text-xs sm:text-sm">{t.label}</div>
              </button>
            );
          })}
        </div>

        {/* Support Ticket Submission Form */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 p-4 sm:p-7 shadow-xs space-y-3.5 sm:space-y-4">
          <h3 className="font-bold text-sm sm:text-base text-neutral-900">
            Submit an Inquiry regarding: <span className="text-emerald-700">{selectedTopic}</span>
          </h3>

          <form onSubmit={handleSubmitTicket} className="space-y-3.5 sm:space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
                Describe your issue or question
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please include your order ID (e.g. #LS10245) or store name for fastest resolution..."
                className="w-full p-3.5 text-xs bg-neutral-50 border border-neutral-200 rounded-2xl focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <div className="text-[11px] text-neutral-400">
                Average response time: <strong>under 15 minutes</strong> for active orders.
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "Sending..." : "Submit Inquiry"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* FAQs Accordion */}
        <div className="bg-white rounded-3xl border border-neutral-200/90 p-5 sm:p-7 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-neutral-900">
            Frequently Asked Questions
          </h3>

          <div className="divide-y divide-neutral-100">
            {faqList.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="py-3.5">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                    className="w-full flex items-center justify-between text-left gap-4 font-semibold text-xs sm:text-sm text-neutral-900 hover:text-emerald-700 transition-colors"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <p className="mt-2 text-xs text-neutral-600 leading-relaxed pr-6 animate-in fade-in duration-200">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Direct Contacts Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-neutral-200 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs text-neutral-900">Bhubaneswar Helpline</div>
              <div className="text-xs text-neutral-500">+91 (0674) 259-8800 (9 AM - 10 PM)</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-neutral-200 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs text-neutral-900">Email Support</div>
              <div className="text-xs text-neutral-500">support@localstore.in</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
