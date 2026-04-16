import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/ScrollSmoother";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trident | Indian Shrimp Export Broker — USFDA-Certified Sourcing",
  description: "Trident connects global seafood buyers with USFDA-certified Indian shrimp packers. Transparent brokerage, pre-shipment quality assurance, and airtight documentation — Vannamei & Black Tiger shrimp from India to your port.",
  keywords: [
    "shrimp import broker India",
    "Indian shrimp exporter",
    "USFDA certified shrimp supplier India",
    "Vannamei shrimp export India",
    "frozen shrimp sourcing agent",
    "seafood brokerage India",
    "buy shrimp from India",
    "Indian seafood export broker",
    "shrimp procurement agent",
    "wholesale shrimp import",
    "Black Tiger shrimp India",
    "HSN compliance shrimp export",
    "seafood import India",
    "shrimp trade broker Kolkata",
    "FFDCA compliant shrimp",
  ],
  authors: [{ name: "Trident International" }],
  openGraph: {
    title: "Trident | Indian Shrimp Export Broker — USFDA-Certified Sourcing",
    description: "Transparent brokerage connecting global buyers with India's top USFDA-certified shrimp packers. Pre-shipment QA, full documentation, 24-hour quote turnaround.",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Trident International — Indian Shrimp Export Broker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trident | Indian Shrimp Export Broker — USFDA-Certified Sourcing",
    description: "Transparent brokerage connecting global buyers with India's top USFDA-certified shrimp packers.",
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
      <head>
        {/* Preload critical assets in priority order */}
        <link rel="preload" href="/images/img1.jpg" as="image" />
        <link rel="preload" href="/images/img2.jpg" as="image" />
        <link rel="preload" href="/images/main.webp" as="image" />
        <link rel="preload" href="/images/img4.jpg" as="image" />
        <link rel="preload" href="/images/img5.jpg" as="image" />
        <link rel="preload" href="/hero_gif_mobile.mov" as="video" />
        <link rel="preload" href="/logo.png" as="image" />

        {/* Structured data — Google rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Trident International",
              "description": "Commission-based shrimp export brokerage connecting global seafood buyers with USFDA-certified Indian shrimp packers. Specialising in Vannamei and Black Tiger shrimp — pre-shipment quality assurance, documentation, and transparent brokerage fees.",
              "url": "https://tridentintjp.in",
              "logo": "https://tridentintjp.in/logo.png",
              "image": "https://tridentintjp.in/logo.png",
              "telephone": "+91-9431267872",
              "email": "enquiry@tridentintjp.in",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Room No. 401, 4th Floor, 5 Mullick Street",
                "addressLocality": "Kolkata",
                "addressRegion": "West Bengal",
                "postalCode": "700007",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 22.5726,
                "longitude": 88.3639
              },
              "areaServed": ["US", "JP", "EU", "CN", "AU", "GB", "CA"],
              "knowsAbout": [
                "Shrimp Export Brokerage",
                "Vannamei Shrimp",
                "Black Tiger Shrimp",
                "USFDA Import Compliance",
                "FFDCA Import Alert 16-131",
                "Frozen Seafood Sourcing",
                "HSN Code 0306",
                "Pre-Shipment Inspection",
                "Seafood Documentation",
                "Letter of Credit"
              ],
              "sameAs": [
                "https://www.linkedin.com/company/internationaltrident/"
              ]
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
