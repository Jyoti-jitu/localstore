import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { LocationProvider } from "@/context/LocationContext";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { OrdersProvider } from "@/context/OrdersContext";
import { ToastProvider } from "@/context/ToastContext";
import Navbar from "@/components/Navbar";
import BottomNavigation from "@/components/BottomNavigation";
import StickyCart from "@/components/StickyCart";
import LocationModal from "@/components/LocationModal";
import AuthModal from "@/components/AuthModal";
import Footer from "@/components/Footer";

export const metadata = {
  title: "LocalStore — Discover Your Local Shops. Shop Locally. Order Online.",
  description:
    "A modern hyperlocal marketplace connecting you directly to offline neighborhood stores in Bhubaneswar. Discover grocery, produce, bakery, and pharmacy shops nearby.",
  keywords: "hyperlocal, local store, shop local, grocery delivery, bhubaneswar, online shopping",
  icons: {
    icon: "/brand-icon.png",
    shortcut: "/brand-icon.png",
    apple: "/brand-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#fbfbfb] text-neutral-900 selection:bg-emerald-100 selection:text-emerald-900">
        <ToastProvider>
          <AuthProvider>
            <LocationProvider>
              <CartProvider>
                <FavoritesProvider>
                  <OrdersProvider>
                    <Navbar />
                    <main className="flex-1 pb-16 md:pb-0 w-full max-w-full overflow-x-hidden">{children}</main>
                    <Footer />
                    <StickyCart />
                    <BottomNavigation />
                    <LocationModal />
                    <AuthModal />
                  </OrdersProvider>
                </FavoritesProvider>
              </CartProvider>
            </LocationProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
