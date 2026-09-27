"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NextLink from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  Inbox
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account";
  const urlMode = searchParams.get("mode");
  const initialMode = urlMode === "register" ? "register" : urlMode === "forgot" ? "forgot" : "signin";

  const {
    isAuthenticated,
    signIn,
    forgotPassword,
    resetPassword,
    sendRegistrationEmailOtp,
    verifyRegistrationOtpAndCreateAccount,
    loading
  } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState(initialMode); // "signin" | "register" | "verify-register" | "forgot" | "reset"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Registration OTP state
  const [registerOtp, setRegisterOtp] = useState("");

  // Forgot / Reset password state
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const isSignIn = mode === "signin";
  const isRegister = mode === "register";
  const isVerifyRegister = mode === "verify-register";
  const isForgot = mode === "forgot";
  const isReset = mode === "reset";

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push(redirectUrl);
    }
  }, [loading, isAuthenticated, redirectUrl, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsSubmitting(true);

    try {
      if (isSignIn) {
        if (!email.trim() || !password.trim()) {
          setErrorMsg("Please fill in both email and password.");
          setIsSubmitting(false);
          return;
        }

        const res = await signIn({ email: email.trim(), password });
        if (!res.success) {
          setErrorMsg(res.error || "Invalid email or password.");
          setIsSubmitting(false);
          return;
        }

        showToast("Signed in successfully! Welcome back.");
        router.push(redirectUrl);
      } else if (isRegister) {
        // Step 1: Validate Registration inputs and send verification code via Resend
        if (!fullName.trim() || !email.trim() || !password.trim()) {
          setErrorMsg("Please fill in all required fields.");
          setIsSubmitting(false);
          return;
        }

        if (password.length < 6) {
          setErrorMsg("Password must be at least 6 characters.");
          setIsSubmitting(false);
          return;
        }

        const res = await sendRegistrationEmailOtp({
          email: email.trim(),
          fullName: fullName.trim(),
        });

        if (!res.success) {
          setErrorMsg(res.error || "Failed to send email verification code.");
          setIsSubmitting(false);
          return;
        }

        setSuccessMsg(res.message || `We've sent a 6-digit verification code to ${email.trim()}. Please check your email inbox and enter it below.`);
        setRegisterOtp("");
        setMode("verify-register");
        showToast("Verification code sent to your email!");
      } else if (isVerifyRegister) {
        // Step 2: Verify registration OTP and create account
        if (!registerOtp.trim()) {
          setErrorMsg("Please enter the 6-digit verification code sent to your email.");
          setIsSubmitting(false);
          return;
        }

        const res = await verifyRegistrationOtpAndCreateAccount({
          email: email.trim(),
          otp: registerOtp.trim(),
          password,
          fullName: fullName.trim(),
          phone: phone.trim() ? `+91 ${phone.replace(/^\+91\s*/, "")}` : "",
        });

        if (!res.success) {
          setErrorMsg(res.error || "Invalid or expired verification code.");
          setIsSubmitting(false);
          return;
        }

        showToast("Email verified and account created successfully! Welcome to LocalStore.");
        router.push(redirectUrl);
      } else if (isForgot) {
        if (!email.trim()) {
          setErrorMsg("Please enter your registered email address.");
          setIsSubmitting(false);
          return;
        }

        const res = await forgotPassword({ email: email.trim() });
        if (!res.success) {
          setErrorMsg(res.error || "Failed to send reset code. Please check your email.");
          setIsSubmitting(false);
          return;
        }

        setSuccessMsg(res.message || `We've sent a 6-digit verification code to ${email.trim()}. Please check your email inbox and enter it below.`);
        setOtp("");
        setMode("reset");
        showToast("Verification code sent to your email!");
      } else if (isReset) {
        if (!otp.trim()) {
          setErrorMsg("Please enter the 6-digit verification code.");
          setIsSubmitting(false);
          return;
        }

        if (newPassword.length < 6) {
          setErrorMsg("New password must be at least 6 characters long.");
          setIsSubmitting(false);
          return;
        }

        if (newPassword !== confirmPassword) {
          setErrorMsg("Passwords do not match. Please re-type your new password.");
          setIsSubmitting(false);
          return;
        }

        const res = await resetPassword({
          email: email.trim(),
          otp: otp.trim(),
          newPassword,
        });

        if (!res.success) {
          setErrorMsg(res.error || "Failed to reset password. Please check your code.");
          setIsSubmitting(false);
          return;
        }

        showToast("Password successfully reset! Please sign in with your new password.");
        setSuccessMsg("Password updated successfully. You can now sign in.");
        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setOtp("");
        setMode("signin");
      }
    } catch (err) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8 px-4 sm:px-6">
      <div className="w-full max-w-md bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <NextLink href="/" className="inline-block group">
            <img
              src="https://rchkrkbuuwxhplfqhhao.supabase.co/storage/v1/object/public/localstore-assets/brand/brand-logo.png"
              alt="LocalStore"
              className="h-9 sm:h-10 w-auto mx-auto object-contain transition-transform group-hover:scale-105"
            />
          </NextLink>

          <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight pt-2">
            {isSignIn
              ? "Sign In to Your Account"
              : isRegister
              ? "Create a LocalStore Account"
              : isVerifyRegister
              ? "Verify Your Email Address"
              : isForgot
              ? "Reset Your Password"
              : "Set New Password"}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500">
            {isVerifyRegister
              ? `We sent a 6-digit verification code to ${email} via Resend. Enter it below to activate your account.`
              : isForgot
              ? "Enter your registered email and we'll send a 6-digit verification code to reset your password."
              : isReset
              ? `Enter the 6-digit verification code sent to ${email} and set your new password.`
              : redirectUrl.includes("checkout")
              ? "You need an account to place orders from neighborhood stores."
              : isSignIn
              ? "Access your saved addresses, live orders, and favorite shops."
              : "Register in seconds with email verification to shop online from local merchants."}
          </p>
        </div>

        {/* Tab Buttons (only on signin / register step 1) */}
        {(isSignIn || isRegister) ? (
          <div className="flex p-1 bg-neutral-100 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setErrorMsg("");
                setSuccessMsg("");
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
                setMode("register");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                isRegister
                  ? "bg-white text-emerald-800 shadow-xs"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              Register
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <button
              type="button"
              onClick={() => {
                setMode(isVerifyRegister ? "register" : "signin");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isVerifyRegister ? "Edit Details" : "Back to Sign In"}</span>
            </button>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>{isVerifyRegister ? "Resend Email OTP" : "Password Recovery"}</span>
            </span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600" />
            <div className="space-y-0.5">
              <span>{successMsg}</span>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* STEP 1: REGISTER FIELDS */}
          {isRegister && (
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
                  Phone Number (for order delivery)
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

          {/* EMAIL FIELD */}
          {isSignIn || isRegister || isForgot ? (
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Email Address (Gmail / Corporate) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@gmail.com"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:border-emerald-500 focus:outline-hidden transition-all"
                />
              </div>
            </div>
          ) : isReset ? (
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Account Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-neutral-100 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-600 cursor-not-allowed"
                />
              </div>
            </div>
          ) : null}

          {/* STEP 2: REGISTRATION OTP VERIFICATION */}
          {isVerifyRegister && (
            <div className="space-y-4">
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                  <Inbox className="w-5 h-5" />
                </div>
                <div className="text-xs text-neutral-700">
                  <div>Verification code sent to:</div>
                  <div className="font-bold text-emerald-950 font-mono text-sm">{email}</div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Enter 6-Digit Email Verification Code <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={registerOtp}
                    onChange={(e) => setRegisterOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full pl-9 pr-3.5 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-center text-lg font-mono font-bold tracking-widest focus:bg-white focus:border-emerald-500 focus:outline-hidden transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PASSWORD FIELD (Only for signin and register) */}
          {(isSignIn || isRegister) && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-neutral-700">
                  Password <span className="text-rose-500">*</span>
                </label>
                {isSignIn && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot");
                      setErrorMsg("");
                      setSuccessMsg("");
                    }}
                    className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSignIn ? "Enter password" : "At least 6 characters"}
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
          )}

          {/* RESET PASSWORD STEP FIELDS */}
          {isReset && (
            <>
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  6-Digit Verification Code <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="e.g. 123456"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-mono tracking-widest focus:bg-white focus:border-emerald-500 focus:outline-hidden transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  New Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-9 pr-10 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:border-emerald-500 focus:outline-hidden transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Confirm New Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:border-emerald-500 focus:outline-hidden transition-all"
                  />
                </div>
              </div>
            </>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  {isSignIn
                    ? "Sign In & Continue"
                    : isRegister
                    ? "Continue & Send Email Verification Code"
                    : isVerifyRegister
                    ? "Verify Email & Complete Registration"
                    : isForgot
                    ? "Send Verification Code"
                    : "Reset Password & Sign In"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* REGISTRATION OTP RESEND */}
        {isVerifyRegister && (
          <div className="text-center pt-1">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={async () => {
                setErrorMsg("");
                setSuccessMsg("");
                setIsSubmitting(true);
                const res = await sendRegistrationEmailOtp({
                  email: email.trim(),
                  fullName: fullName.trim(),
                });
                setIsSubmitting(false);
                if (res.success) {
                  setSuccessMsg(`A fresh verification code has been sent via Resend to ${email.trim()}! Please check your inbox.`);
                  setRegisterOtp("");
                  showToast("New verification code sent to your email.");
                } else {
                  setErrorMsg(res.error || "Failed to resend verification code.");
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-emerald-700 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Didn't receive the email code? Resend via Resend</span>
            </button>
          </div>
        )}

        {/* FORGOT PASSWORD QUICK RESEND */}
        {isReset && (
          <div className="text-center pt-1">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={async () => {
                setErrorMsg("");
                setSuccessMsg("");
                setIsSubmitting(true);
                const res = await forgotPassword({ email: email.trim() });
                setIsSubmitting(false);
                if (res.success) {
                  setSuccessMsg(`A fresh verification code has been sent to ${email.trim()}! Please check your inbox.`);
                  setOtp("");
                  showToast("New verification code sent to your email.");
                } else {
                  setErrorMsg(res.error || "Failed to resend code.");
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-emerald-700 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Didn't receive the code? Resend</span>
            </button>
          </div>
        )}

        {/* Security Badges */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-center gap-4 text-[11px] text-neutral-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Resend Verified Email Delivery</span>
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>FastAPI Secure Auth</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
