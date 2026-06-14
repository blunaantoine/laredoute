import type { Metadata } from "next"
import SiteContent from "@/components/SiteContent"

export const metadata: Metadata = {
  title: "Agroalimentaire - Riz, Pâtes & Huiles | LA REDOUTE SARL-U",
  description: "Distribution de produits agroalimentaires au Togo : riz, pâtes alimentaires, huiles alimentaires et produits de première nécessité. Qualité et prix compétitifs.",
  keywords: ["riz", "pâtes alimentaires", "huiles alimentaires", "agroalimentaire", "distribution", "Togo", "Lomé", "LA REDOUTE", "produits alimentaires"],
  alternates: {
    canonical: "https://laredoutesarl.com/agroalimentaire",
  },
  openGraph: {
    title: "Agroalimentaire - Riz, Pâtes & Huiles | LA REDOUTE SARL-U",
    description: "Distribution de produits agroalimentaires au Togo : riz, pâtes, huiles et produits de première nécessité.",
    type: "website",
    locale: "fr_TG",
    siteName: "LA REDOUTE SARL-U",
    url: "https://laredoutesarl.com/agroalimentaire",
    images: [{ url: "/logo-main.png", width: 400, height: 400, alt: "LA REDOUTE SARL-U Agroalimentaire" }],
  },
  twitter: {
    card: "summary",
    title: "Agroalimentaire - Riz, Pâtes & Huiles | LA REDOUTE SARL-U",
    description: "Distribution de produits agroalimentaires au Togo.",
    images: ["/logo-main.png"],
  },
}

export default function AgroalimentairePage() {
  return <SiteContent />
}
