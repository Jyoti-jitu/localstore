"use client";

import React from "react";
import { Check, Clock, Bike, PackageCheck, CheckCircle2 } from "lucide-react";

export default function OrderTimeline({ timeline = [], currentStatus = "preparing" }) {
  const getStepIcon = (index, step) => {
    if (step.completed) {
      return <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />;
    }
    if (step.current) {
      if (index === 3) return <Bike className="w-3.5 h-3.5 text-white" />;
      return <Clock className="w-3.5 h-3.5 text-white animate-spin" />;
    }
    return <div className="w-2 h-2 rounded-full bg-neutral-300" />;
  };

  return (
    <div className="py-2">
      <div className="relative">
        {timeline.map((step, idx) => {
          const isLast = idx === timeline.length - 1;
          const isDone = step.completed;
          const isCurrent = step.current;

          return (
            <div key={step.step} className="flex items-start gap-4 pb-7 last:pb-1 relative">
              {/* Connecting vertical line */}
              {!isLast && (
                <div
                  className={`absolute left-4 top-8 -bottom-1 w-0.5 transition-colors ${
                    isDone ? "bg-emerald-600" : "bg-neutral-200"
                  }`}
                />
              )}

              {/* Status node */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all ${
                  isDone
                    ? "bg-emerald-600 text-white shadow-xs"
                    : isCurrent
                    ? "bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-md animate-pulse"
                    : "bg-neutral-100 text-neutral-400 border border-neutral-200"
                }`}
              >
                {getStepIcon(idx, step)}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center justify-between">
                  <h4
                    className={`text-xs sm:text-sm font-bold ${
                      isCurrent
                        ? "text-emerald-800"
                        : isDone
                        ? "text-neutral-900"
                        : "text-neutral-400"
                    }`}
                  >
                    {step.step}
                  </h4>
                  <span
                    className={`text-[11px] font-medium ${
                      isCurrent
                        ? "text-emerald-600 font-bold"
                        : isDone
                        ? "text-neutral-500"
                        : "text-neutral-400"
                    }`}
                  >
                    {step.time}
                  </span>
                </div>
                {isCurrent && (
                  <p className="text-xs text-emerald-700/90 mt-0.5 font-medium">
                    In progress · Local merchant & rider are coordinating your delivery.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
