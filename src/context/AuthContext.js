"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  loginWithBackend,
  registerWithBackend,
  sendBackendOtp,
  verifyBackendOtp,
  fetchCurrentBackendUser,
  logoutWithBackend,
  requestPasswordReset,
  resetPasswordWithBackend,
  sendRegistrationOtp,
  verifyRegistrationOtp,
} from "@/lib/authApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal control for seamless auth trigger anywhere (e.g., checkout)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("signin"); // "signin" | "register"
  const [authRedirectUrl, setAuthRedirectUrl] = useState(null);
  const [customAvatar, setCustomAvatar] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (typeof window === "undefined") return;

      const isSignedOut = localStorage.getItem("localstore_signed_out");
      const storedToken = localStorage.getItem("localstore_auth_token");
      const savedAvatar = localStorage.getItem("localstore_user_avatar");
      if (savedAvatar) setCustomAvatar(savedAvatar);

      // If user has an active backend JWT token
      if (storedToken && !isSignedOut) {
        const remoteUser = await fetchCurrentBackendUser(storedToken);
        if (mounted && remoteUser) {
          setUser(remoteUser);
          setSession({ access_token: storedToken, user: remoteUser });
          setLoading(false);
          return;
        }
      }

      // Check if there was a saved cached user profile
      if (!isSignedOut) {
        const cachedUserStr = localStorage.getItem("localstore_user");
        if (cachedUserStr) {
          try {
            const cachedUser = JSON.parse(cachedUserStr);
            if (mounted) {
              setUser(cachedUser);
              setSession({ access_token: storedToken || "jwt-session", user: cachedUser });
              setLoading(false);
              return;
            }
          } catch {
            // ignore JSON parse error
          }
        }

        // Default demo customer profile for seamless first-run experience
        const defaultUser = {
          id: "user-cust-001",
          email: "rahul.mohapatra@example.com",
          full_name: "Rahul Mohapatra",
          phone: "+91 98610 54321",
          role: "customer",
          shop_id: null,
          user_metadata: {
            full_name: "Rahul Mohapatra",
            phone: "+91 98610 54321",
            role: "customer",
            shop_id: null,
          },
        };
        if (mounted) {
          setUser(defaultUser);
          setSession({ access_token: "demo-jwt-token", user: defaultUser });
        }
      }

      if (mounted) {
        setLoading(false);
      }
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const openAuthModal = (mode = "signin", redirectUrl = null) => {
    setAuthModalMode(mode);
    setAuthRedirectUrl(redirectUrl);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthRedirectUrl(null);
  };

  const signIn = async ({ email, password }) => {
    try {
      const res = await loginWithBackend({ email, password });
      if (!res.success) {
        return { success: false, error: res.error || "Invalid credentials." };
      }

      if (typeof window !== "undefined") {
        localStorage.removeItem("localstore_signed_out");
        if (res.token) localStorage.setItem("localstore_auth_token", res.token);
        if (res.user) localStorage.setItem("localstore_user", JSON.stringify(res.user));
      }

      setUser(res.user);
      setSession(res.session || { access_token: res.token, user: res.user });
      return { success: true, user: res.user, session: res.session };
    } catch (err) {
      return { success: false, error: err.message || "Failed to sign in via backend." };
    }
  };

  const signUp = async ({ email, password, fullName, phone, role = "customer", shop_id = null }) => {
    try {
      const res = await registerWithBackend({
        email,
        password,
        fullName,
        phone,
        role,
        shop_id,
      });

      if (!res.success) {
        return { success: false, error: res.error || "Failed to register account." };
      }

      if (typeof window !== "undefined") {
        localStorage.removeItem("localstore_signed_out");
        if (res.token) localStorage.setItem("localstore_auth_token", res.token);
        if (res.user) localStorage.setItem("localstore_user", JSON.stringify(res.user));
      }

      setUser(res.user);
      setSession(res.session || { access_token: res.token, user: res.user });
      return { success: true, user: res.user, session: res.session };
    } catch (err) {
      return { success: false, error: err.message || "Failed to create account via backend." };
    }
  };

  const sendOtp = async ({ phone }) => {
    return await sendBackendOtp({ phone });
  };

  const verifyOtp = async ({ phone, otp }) => {
    try {
      const res = await verifyBackendOtp({ phone, otp });
      if (!res.success) {
        return { success: false, error: res.error || "Invalid verification code." };
      }

      if (typeof window !== "undefined") {
        localStorage.removeItem("localstore_signed_out");
        if (res.token) localStorage.setItem("localstore_auth_token", res.token);
        if (res.user) localStorage.setItem("localstore_user", JSON.stringify(res.user));
      }

      setUser(res.user);
      setSession(res.session || { access_token: res.token, user: res.user });
      return { success: true, user: res.user, session: res.session };
    } catch (err) {
      return { success: false, error: err.message || "OTP verification failed." };
    }
  };

  const signOut = async () => {
    try {
      const token = session?.access_token || (typeof window !== "undefined" ? localStorage.getItem("localstore_auth_token") : null);
      await logoutWithBackend(token);

      if (typeof window !== "undefined") {
        localStorage.setItem("localstore_signed_out", "true");
        localStorage.removeItem("localstore_auth_token");
        localStorage.removeItem("localstore_user");
        localStorage.removeItem("localstore_demo_user");
      }
      setUser(null);
      setSession(null);
      return { success: true };
    } catch (err) {
      if (typeof window !== "undefined") {
        localStorage.setItem("localstore_signed_out", "true");
        localStorage.removeItem("localstore_auth_token");
        localStorage.removeItem("localstore_user");
        localStorage.removeItem("localstore_demo_user");
      }
      setUser(null);
      setSession(null);
      return { success: false, error: err.message };
    }
  };

  const forgotPassword = async ({ email }) => {
    return await requestPasswordReset({ email });
  };

  const resetPassword = async ({ email, otp, newPassword }) => {
    return await resetPasswordWithBackend({ email, otp, newPassword });
  };

  const sendRegistrationEmailOtp = async ({ email, fullName }) => {
    return await sendRegistrationOtp({ email, fullName });
  };

  const verifyRegistrationOtpAndCreateAccount = async ({
    email,
    otp,
    password,
    fullName,
    phone,
    role = "customer",
    shop_id = null,
  }) => {
    try {
      const res = await verifyRegistrationOtp({
        email,
        otp,
        password,
        fullName,
        phone,
        role,
        shop_id,
      });

      if (!res.success) {
        return { success: false, error: res.error || "Verification failed." };
      }

      if (typeof window !== "undefined") {
        localStorage.removeItem("localstore_signed_out");
        if (res.token) localStorage.setItem("localstore_auth_token", res.token);
        if (res.user) localStorage.setItem("localstore_user", JSON.stringify(res.user));
      }

      setUser(res.user);
      setSession(res.session || { access_token: res.token, user: res.user });
      return { success: true, user: res.user, session: res.session };
    } catch (err) {
      return { success: false, error: err.message || "Failed to create account." };
    }
  };

  const updateProfilePhoto = (photoUrl) => {
    setCustomAvatar(photoUrl);
    if (typeof window !== "undefined") {
      if (photoUrl) {
        localStorage.setItem("localstore_user_avatar", photoUrl);
      } else {
        localStorage.removeItem("localstore_user_avatar");
      }
    }
    if (user) {
      const updatedUser = {
        ...user,
        avatar: photoUrl || "",
        user_metadata: {
          ...(user.user_metadata || {}),
          avatar_url: photoUrl || "",
        },
      };
      setUser(updatedUser);
      if (typeof window !== "undefined") {
        localStorage.setItem("localstore_user", JSON.stringify(updatedUser));
      }
    }
  };

  const removeProfilePhoto = () => {
    updateProfilePhoto(null);
  };

  // Computed profile helpers
  const profile = {
    id: user?.id,
    name: user?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Shopper",
    email: user?.email || "",
    phone: user?.phone || user?.user_metadata?.phone || "",
    avatar: customAvatar || user?.avatar || user?.user_metadata?.avatar_url || "",
    initials: (user?.full_name || user?.user_metadata?.full_name || user?.email || "RM")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2),
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
        sendOtp,
        verifyOtp,
        forgotPassword,
        resetPassword,
        sendRegistrationEmailOtp,
        verifyRegistrationOtpAndCreateAccount,
        updateProfilePhoto,
        removeProfilePhoto,
        isAuthModalOpen,
        authModalMode,
        authRedirectUrl,
        setAuthModalMode,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
