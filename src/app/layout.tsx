import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "Kiddnest - ইনভেন্টরি ম্যানেজমেন্ট সিস্টেম",
  description: "Kiddnest পণ্য, স্টক, ক্রয়-বিক্রয় ব্যবস্থাপনা সিস্টেম",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Kiddnest",
  },
};

export const viewport: Viewport = {
  themeColor: "#F5F8FC",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="bn">
      <body className="bg-gray-50 text-gray-900 antialiased min-h-screen">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
