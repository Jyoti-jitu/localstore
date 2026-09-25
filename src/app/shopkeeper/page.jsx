"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useShopkeeper } from "@/context/ShopkeeperContext";
import { Store } from "lucide-react";

export default function ShopkeeperPortalRedirect() {
  const router = useRouter();
  const { authStep, isLoaded } = useShopkeeper();

  useEffect(() => {
    if (!isLoaded) return;

    switch (authStep) {
      case "register":
        router.replace("/shopkeeper/register");
        break;
      case "verify":
        router.replace("/shopkeeper/verify");
        break;
      case "pending":
        router.replace("/shopkeeper/pending");
        break;
      case "approved":
        router.replace("/shopkeeper/approved");
        break;
      case "profile_setup":
        router.replace("/shopkeeper/profile");
        break;
      case "completed":
      default:
        router.replace("/shopkeeper/dashboard");
        break;
    }
  }, [authStep, isLoaded, router]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm animate-pulse">
          <Store className="w-6 h-6" />
        </div>
        <div className="text-center">
          <h2 className="text-base font-bold text-slate-900">LocalHub</h2>
          <p className="text-xs text-slate-400 mt-0.5">Shopkeeper Portal</p>
        </div>
      </div>
    </div>
  );
}
