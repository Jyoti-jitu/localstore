"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import Modal from "@/components/Modal";
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function AuthModal() {
  const router = useRouter();
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    setAuthModalMode,
    authRedirectUrl,
    signIn,
    signUp,
    loginAsDemoUser
  } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isAuthModalOpen) return null;

  const isSignIn = authModalMode === "signin";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      if (isSignIn) {
        if (!email.trim() || !password.trim()) {
          setErrorMsg("Please fill in both email and password.");
          setIsLoading(false);
          return;
        }

        const res = await signIn({ email: email.trim(), password });
        if (!res.success) {
          setErrorMsg(res.error || "Invalid email or password.");
          setIsLoading(false);
          return;
        }

        showToast("Signed in successfully! Welcome back.");
      } else {
        if (!fullName.trim() || !email.trim() || !password.trim()) {
          setErrorMsg("Please fill in all required fields.");
          setIsLoading(false);
          return;
        }

        if (password.length < 6) {
          setErrorMsg("Password must be at least 6 characters.");
          setIsLoading(false);
          return;
        }

        const res = await signUp({
          email: email.trim(),
          password,
          fullName: fullName.trim(),
          phone: phone.trim() ? `+91 ${phone.replace(/^\+91\s*/, "")}` : "",
        });

        if (!res.success) {
          setErrorMsg(res.error || "Failed to create account.");
          setIsLoading(false);
          return;
        }

        showToast("Account created successfully! Welcome to LocalStore.");
      }

      // Success
      closeAuthModal();
      if (authRedirectUrl) {
        router.push(authRedirectUrl);
      }
    } catch (err) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setErrorMsg("");
    setIsLoading(true);
    try {
      const res = await loginAsDemoUser();
      if (res.success) {
        showToast("Logged in as Rahul Mohapatra (Demo User).");
        closeAuthModal();
        if (authRedirectUrl) {
          router.push(authRedirectUrl);
        }
      } else {
        setErrorMsg(res.error || "Failed demo login.");
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isAuthModalOpen} onClose={closeAuthModal} maxWidth="max-w-md">
      <div className="p-5 sm:p-7 text-left space-y-5">
        {/* Header Icon & Title */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md">
            <ShoppingBag className="w-6 h-6" />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              {isSignIn ? "Welcome Back to LocalStore" : "Create Your LocalStore Account"}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              {authRedirectUrl
                ? "Please sign in or register to complete your order."
                : isSignIn
                ? "Sign in to manage orders and checkout faster."
                : "Join to support local neighborhood stores in Bhubaneswar."}
            </p>
          </div>
        </div>

        {/* Auth Mode Toggle Tabs */}
        <div className="flex p-1 bg-neutral-100 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setAuthModalMode("signin");
              setErrorMsg("");
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
              isSignIn
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthModalMode("register");
              setErrorMsg("");
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
              !isSignIn
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {!isSignIn && (
            <>
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Mohapatra"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:border-emerald-500 focus:outline-hidden transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Phone Number (for Delivery Updates)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 98610 54321"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:border-emerald-500 focus:outline-hidden transition-all"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full pl-9 pr-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:border-emerald-500 focus:outline-hidden transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSignIn ? "Enter your password" : "At least 6 characters"}
                className="w-full pl-9 pr-10 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:border-emerald-500 focus:outline-hidden transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{isSignIn ? "Sign In & Continue" : "Create Account & Continue"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center py-1">
          <div className="border-t border-neutral-200 w-full" />
          <span className="bg-white px-3 text-[11px] font-bold text-neutral-400 uppercase tracking-wider relative">
            Or Quick Test
          </span>
        </div>

        {/* 1-Click Demo Login */}
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={isLoading}
          className="w-full py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 group"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
          <span>Quick 1-Click Demo Login (Rahul Mohapatra)</span>
        </button>

        {/* Trust Badges */}
        <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-neutral-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure Supabase Auth</span>
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted Data</span>
          </span>
        </div>
      </div>
    </Modal>
  );
}
