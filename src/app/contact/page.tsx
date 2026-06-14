import type { Metadata } from "next"
import SiteContent from "@/components/SiteContent"

export const metadata: Metadata = {
  title: "Contactez-nous | LA REDOUTE SARL-U",
  description: "Contactez LA REDOUTE SARL-U pour vos besoins en distribution de pneus, huiles moteurs et produits agroalimentaires au Togo. Devis et informations.",
  keywords: ["contact", "devis", "LA REDOUTE", "Togo", "Lomé", "distribution", "pneus", "huiles", "agroalimentaire"],
  alternates: {
    canonical: "https://laredoutesarl.com/contact",
  },
  openGraph: {
    title: "Contactez-nous | LA REDOUTE SARL-U",
    description: "Contactez LA REDOUTE SARL-U pour vos besoins en distribution au Togo.",
    type: "website",
    locale: "fr_TG",
    siteName: "LA REDOUTE SARL-U",
    url: "https://laredoutesarl.com/contact",
    images: [{ url: "/logo-main.png", width: 400, height: 400, alt: "LA REDOUTE SARL-U Contact" }],
  },
  twitter: {
    card: "summary",
    title: "Contactez-nous | LA REDOUTE SARL-U",
    description: "Contactez LA REDOUTE SARL-U pour vos besoins en distribution au Togo.",
    images: ["/logo-main.png"],
  },
}

export default function ContactPage() {
  return <SiteContent />
}
