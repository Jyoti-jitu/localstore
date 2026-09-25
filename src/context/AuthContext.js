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

    // Check local demo persistence or default active demo profile
    if (typeof window !== "undefined") {
      const isSignedOut = localStorage.getItem("localstore_signed_out");
      if (!isSignedOut) {
        const defaultUser = {
          id: "demo-user-rahul-01",
          email: "rahul.mohapatra@example.com",
          user_metadata: {
            full_name: "Rahul Mohapatra",
            phone: "+91 98610 54321",
          },
        };
        setUser(defaultUser);
        setSession({ user: defaultUser, access_token: "demo-token" });
        setLoading(false);
      }
    }

    // 1. Initial session load
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (mounted) {
        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession?.user || null);
        }
        setLoading(false);
      }
    });

    // 2. Real-time auth changes listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (mounted) {
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession?.user || null);
        }
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
      if (typeof window !== "undefined") {
        localStorage.setItem("localstore_signed_out", "true");
        localStorage.removeItem("localstore_demo_user");
      }
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      return { success: true };
    } catch (err) {
      if (typeof window !== "undefined") {
        localStorage.setItem("localstore_signed_out", "true");
        localStorage.removeItem("localstore_demo_user");
      }
      setUser(null);
      setSession(null);
      return { success: false, error: err.message };
    }
  };

  // Quick 1-click Demo Login for instant testing
  const loginAsDemoUser = async () => {
    const mockUser = {
      id: "demo-user-rahul-01",
      email: "rahul.mohapatra@example.com",
      user_metadata: {
        full_name: "Rahul Mohapatra",
        phone: "+91 98610 54321",
      },
    };
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("localstore_signed_out");
        localStorage.setItem("localstore_demo_user", JSON.stringify(mockUser));
      }
      setUser(mockUser);
      setSession({ user: mockUser, access_token: "demo-token" });
      return { success: true, user: mockUser };
    } catch {
      setUser(mockUser);
      setSession({ user: mockUser, access_token: "demo-token" });
      return { success: true, user: mockUser };
    }
  };

  const [customAvatar, setCustomAvatar] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAvatar = localStorage.getItem("localstore_user_avatar");
      if (savedAvatar) setCustomAvatar(savedAvatar);
    }
  }, []);

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
        user_metadata: {
          ...(user.user_metadata || {}),
          avatar_url: photoUrl || "",
        },
      };
      setUser(updatedUser);
      if (typeof window !== "undefined") {
        localStorage.setItem("localstore_demo_user", JSON.stringify(updatedUser));
      }
    }
  };

  const removeProfilePhoto = () => {
    updateProfilePhoto(null);
  };

  // Computed profile helpers
  const profile = {
    id: user?.id,
    name: user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Shopper",
    email: user?.email || "",
    phone: user?.user_metadata?.phone || "",
    avatar: customAvatar || user?.user_metadata?.avatar_url || "",
    initials: (user?.user_metadata?.full_name || user?.email || "RM")
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
