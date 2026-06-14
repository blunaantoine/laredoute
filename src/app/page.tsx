import type { Metadata } from "next"
import SiteContent from "@/components/SiteContent"

export const metadata: Metadata = {
  title: "LA REDOUTE SARL-U - Distribution Professionnelle au Togo",
  description: "Distribution professionnelle de pneus, huiles moteurs et produits d'alimentation générale au Togo. Qualité, fiabilité et service exceptionnel.",
  keywords: ["LA REDOUTE", "distribution", "pneus", "huiles moteurs", "agroalimentaire", "Togo", "Lomé", "Michelin", "Goodyear", "Total", "Shell", "riz", "pâtes", "huiles alimentaires"],
  alternates: {
    canonical: "https://laredoutesarl.com",
  },
  openGraph: {
    title: "LA REDOUTE SARL-U - Distribution Professionnelle au Togo",
    description: "Distribution professionnelle de pneus, huiles moteurs et produits d'alimentation générale au Togo. Qualité, fiabilité et service exceptionnel.",
    type: "website",
    locale: "fr_TG",
    siteName: "LA REDOUTE SARL-U",
    url: "https://laredoutesarl.com",
    images: [{ url: "/logo-main.png", width: 400, height: 400, alt: "LA REDOUTE SARL-U" }],
  },
  twitter: {
    card: "summary",
    title: "LA REDOUTE SARL-U - Distribution Professionnelle au Togo",
    description: "Pneus, huiles moteurs et produits agroalimentaires au Togo.",
    images: ["/logo-main.png"],
  },
}

export default function Home() {
  return <SiteContent />
}
