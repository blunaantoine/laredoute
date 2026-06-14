import type { Metadata } from "next"
import SiteContent from "@/components/SiteContent"

export const metadata: Metadata = {
  title: "Automobile - Pneus & Huiles Moteurs | LA REDOUTE SARL-U",
  description: "Distribution professionnelle de pneus (Michelin, Goodyear, Continental) et huiles moteurs (Total, Shell, Castrol) au Togo. Large gamme pour tous véhicules.",
  keywords: ["pneus", "huiles moteurs", "automobile", "Michelin", "Goodyear", "Total", "Shell", "Togo", "Lomé", "LA REDOUTE"],
  alternates: {
    canonical: "https://laredoutesarl.com/automobile",
  },
  openGraph: {
    title: "Automobile - Pneus & Huiles Moteurs | LA REDOUTE SARL-U",
    description: "Distribution professionnelle de pneus et huiles moteurs au Togo. Large gamme pour tous véhicules.",
    type: "website",
    locale: "fr_TG",
    siteName: "LA REDOUTE SARL-U",
    url: "https://laredoutesarl.com/automobile",
    images: [{ url: "/logo-main.png", width: 400, height: 400, alt: "LA REDOUTE SARL-U Automobile" }],
  },
  twitter: {
    card: "summary",
    title: "Automobile - Pneus & Huiles Moteurs | LA REDOUTE SARL-U",
    description: "Distribution professionnelle de pneus et huiles moteurs au Togo.",
    images: ["/logo-main.png"],
  },
}

export default function AutomobilePage() {
  return <SiteContent />
}
