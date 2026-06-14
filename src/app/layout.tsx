import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://laredoutesarl.com"),
  authors: [{ name: "LA REDOUTE SARL-U" }],
  icons: {
    icon: "/logo-main.png",
  },
  verification: {
    google: "bHZGZJOWaUOV81ZRttuXMinynmqr_WoTotmUa3qLWI0",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// JSON-LD structured data for LocalBusiness
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://laredoutesarl.com/#organization",
  name: "LA REDOUTE SARL-U",
  description: "Distribution professionnelle de pneus, huiles moteurs et produits d'alimentation générale au Togo",
  url: "https://laredoutesarl.com",
  logo: "https://laredoutesarl.com/logo-main.png",
  telephone: "+228 90 03 39 59",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lomé",
    addressCountry: "TG",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "6.1319",
    longitude: "1.2228",
  },
  sameAs: [],
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "08:00",
    closes: "18:00",
  },
  priceRange: "$$",
  hasOfferCatalog: [
    {
      "@type": "OfferCatalog",
      name: "Automobile",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "Pneus" } },
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "Huiles Moteurs" } },
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "Accessoires Auto" } },
      ],
    },
    {
      "@type": "OfferCatalog",
      name: "Agroalimentaire",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "Riz" } },
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "Pâtes Alimentaires" } },
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "Huiles Alimentaires" } },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
