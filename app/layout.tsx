import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trident | Global Shipping & Logistics Solutions",
  description: "Delivering your cargo safely, on time, and anywhere in the world. Reliable global shipping and logistics solutions.",
  keywords: ["shipping", "logistics", "global shipping", "cargo", "freight", "transportation"],
  authors: [{ name: "Trident" }],
  openGraph: {
    title: "Trident | Global Shipping & Logistics Solutions",
    description: "Delivering your cargo safely, on time, and anywhere in the world.",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Trident Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trident | Global Shipping & Logistics Solutions",
    description: "Delivering your cargo safely, on time, and anywhere in the world.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
