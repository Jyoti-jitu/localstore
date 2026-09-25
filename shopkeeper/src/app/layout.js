import "./globals.css";
import { ShopkeeperProvider } from "@/context/ShopkeeperContext";

export const metadata = {
  title: "LocalHub - Shopkeeper Portal",
  description: "Sell your local products online to nearby customers with LocalHub Shopkeeper Portal.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full bg-slate-50">
      <body className="min-h-full flex flex-col font-sans text-slate-900 bg-slate-50 antialiased">
        <ShopkeeperProvider>{children}</ShopkeeperProvider>
      </body>
    </html>
  );
}
