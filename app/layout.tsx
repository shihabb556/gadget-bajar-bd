import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import { Toaster } from 'react-hot-toast';

import Footer from "@/components/Footer";
import MetaPixel from "@/components/MetaPixel";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://healthportall.vercel.app'),
  title: {
    default: "HealthPortall - Your Trusted Online Medicine Store",
    template: "%s | HealthPortall"
  },
  description: "HealthPortall is your trusted online medicine store in Bangladesh. Order genuine medicines, health products, and wellness essentials with fast delivery.",
  keywords: ["HealthPortall", "Online Pharmacy Bangladesh", "Buy Medicine Online BD", "Health Products Dhaka", "Medicine Delivery BD"],
  authors: [{ name: "HealthPortall Team" }],
  creator: "HealthPortall",
  publisher: "HealthPortall",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_BD",
    url: "https://healthportall.vercel.app",
    siteName: "HealthPortall",
    title: "HealthPortall - Your Trusted Online Medicine Store",
    description: "Order genuine medicines and health products online. Fast delivery across Bangladesh.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "HealthPortall",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HealthPortall - Your Trusted Online Medicine Store",
    description: "Order genuine medicines and health products online.",
    images: ["/og-image.jpg"],
    creator: "@healthportall",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MetaPixel />
        <NextAuthProvider>
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </NextAuthProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
