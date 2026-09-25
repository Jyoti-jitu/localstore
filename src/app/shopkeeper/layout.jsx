import { ShopkeeperProvider } from "@/context/ShopkeeperContext";

export const metadata = {
  title: "LocalHub - Shopkeeper Portal",
  description: "Sell your local products online to nearby customers with LocalHub Shopkeeper Portal.",
};

export default function ShopkeeperRootLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
      <ShopkeeperProvider>{children}</ShopkeeperProvider>
    </div>
  );
}
