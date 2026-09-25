"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useShopkeeper } from "@/context/ShopkeeperContext";
import DemoFlowBar from "@/components/DemoFlowBar";
import { ShieldCheck, ArrowRight, RotateCw, CheckCircle2 } from "lucide-react";

export default function VerifyPage() {
  const router = useRouter();
  const { shopkeeper, setAuthStep } = useShopkeeper();

  const [otp, setOtp] = useState(["4", "8", "1", "0", "9", "2"]);
  const [timer, setTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const inputRefs = useRef([]);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleInputChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = (e) => {
    if (e) e.preventDefault();
    const enteredCode = otp.join("");

    if (enteredCode.length < 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setIsVerifying(true);
    setError("");

    setTimeout(() => {
      setIsVerifying(false);
      setSuccess(true);

      // Automatically move user to approval-pending screen as instructed in Requirement 2
      setTimeout(() => {
        setAuthStep("pending");
        router.push("/pending");
      }, 700);
    }, 600);
  };

  const handleResend = () => {
    if (!canResend) return;
    setTimer(45);
    setCanResend(false);
    setError("");
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <DemoFlowBar />

      <div className="flex-1 flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-8">
        {/* Brand/Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 mb-3 shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Verify Your Account
          </h1>
          <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
            We&apos;ve sent a verification code to your email/phone.
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-700">
            <span>{shopkeeper.phone || "+91 98765 43210"}</span>
            <span className="text-slate-300">•</span>
            <span>{shopkeeper.email || "jitu.electronics@example.com"}</span>
          </div>
        </div>

        {/* Verification Card */}
        <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 text-center">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg text-left">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Contact Verified! Redirecting to pending approval...</span>
            </div>
          )}

          <form onSubmit={handleVerify}>
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
                Enter 6-Digit Code
              </label>

              {/* 6 OTP Boxes */}
              <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isVerifying || success}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              <span>{isVerifying ? "Verifying..." : "Verify Account"}</span>
              {!isVerifying && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Resend Option */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Didn&apos;t receive code?</span>
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <RotateCw className="w-3 h-3" />
                <span>Resend Code</span>
              </button>
            ) : (
              <span className="text-slate-400 font-medium">
                Resend in {timer}s
              </span>
            )}
          </div>
        </div>

        {/* Back Link */}
        <p className="text-xs text-slate-400 mt-6 text-center">
          Entered wrong phone or email?{" "}
          <button
            type="button"
            onClick={() => {
              setAuthStep("register");
              router.push("/register");
            }}
            className="text-blue-600 hover:underline"
          >
            Change Details
          </button>
        </p>
      </div>
    </div>
  );
}
