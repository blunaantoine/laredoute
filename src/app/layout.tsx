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
  title: "LA REDOUTE SARL-U - Distribution Professionnelle au Togo",
  description: "Distribution professionnelle de pneus, huiles moteurs et produits d'alimentation générale au Togo. Qualité, fiabilité et service exceptionnel.",
  keywords: ["LA REDOUTE", "distribution", "pneus", "huiles moteurs", "agroalimentaire", "Togo", "Lomé", "Michelin", "Goodyear", "Total", "Shell", "riz", "pâtes", "huiles alimentaires"],
  authors: [{ name: "LA REDOUTE SARL-U" }],
  icons: {
    icon: "/logo-main.png",
  },
  verification: {
    google: "la-redoute-verification-code", // Remplacez par votre code Google Search Console
  },
  openGraph: {
    title: "LA REDOUTE SARL-U - Distribution Professionnelle au Togo",
    description: "Distribution professionnelle de pneus, huiles moteurs et produits d'alimentation générale au Togo. Qualité, fiabilité et service exceptionnel.",
    type: "website",
    locale: "fr_TG",
    siteName: "LA REDOUTE SARL-U",
    images: [{ url: "/logo-main.png", width: 400, height: 400, alt: "LA REDOUTE SARL-U" }],
  },
  twitter: {
    card: "summary",
    title: "LA REDOUTE SARL-U - Distribution Professionnelle au Togo",
    description: "Pneus, huiles moteurs et produits agroalimentaires au Togo.",
    images: ["/logo-main.png"],
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
  alternates: {
    canonical: "https://laredoutesarl.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
