"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal control for seamless auth trigger anywhere (e.g., checkout)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("signin"); // "signin" | "register"
  const [authRedirectUrl, setAuthRedirectUrl] = useState(null);

  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    // 1. Initial session load
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (mounted) {
        setSession(initialSession);
        setUser(initialSession?.user || null);
        setLoading(false);
      }
    });

    // 2. Real-time auth changes listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (mounted) {
        setSession(currentSession);
        setUser(currentSession?.user || null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { success: true, user: data.user, session: data.session };
    } catch (err) {
      return { success: false, error: err.message || "Failed to sign in" };
    }
  };

  const signUp = async ({ email, password, fullName, phone }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
          },
        },
      });
      if (error) throw error;

      // In case session was not returned immediately, sign in right away
      if (!data.session && data.user) {
        const signInRes = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInRes.data?.session) {
          return { success: true, user: signInRes.data.user, session: signInRes.data.session };
        }
      }

      return { success: true, user: data.user, session: data.session };
    } catch (err) {
      return { success: false, error: err.message || "Failed to create account" };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Quick 1-click Demo Login for instant testing
  const loginAsDemoUser = async () => {
    return signIn({
      email: "rahul@localstore.com",
      password: "LocalStore123!",
    });
  };

  // Computed profile helpers
  const profile = {
    id: user?.id,
    name: user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Shopper",
    email: user?.email || "",
    phone: user?.user_metadata?.phone || "",
    initials: (user?.user_metadata?.full_name || user?.email || "U")
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
        loginAsDemoUser,
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
