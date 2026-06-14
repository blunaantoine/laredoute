import type { Metadata } from "next"
import SiteContent from "@/components/SiteContent"

export const metadata: Metadata = {
  title: "À Propos - Notre Histoire | LA REDOUTE SARL-U",
  description: "Découvrez LA REDOUTE SARL-U, votre partenaire de distribution professionnelle au Togo depuis des années. Engagés pour la qualité, la fiabilité et le service exceptionnel.",
  keywords: ["LA REDOUTE", "à propos", "histoire", "entreprise", "distribution", "Togo", "Lomé", "SARL-U"],
  alternates: {
    canonical: "https://laredoutesarl.com/a-propos",
  },
  openGraph: {
    title: "À Propos - Notre Histoire | LA REDOUTE SARL-U",
    description: "Découvrez LA REDOUTE SARL-U, votre partenaire de distribution professionnelle au Togo.",
    type: "website",
    locale: "fr_TG",
    siteName: "LA REDOUTE SARL-U",
    url: "https://laredoutesarl.com/a-propos",
    images: [{ url: "/logo-main.png", width: 400, height: 400, alt: "LA REDOUTE SARL-U À Propos" }],
  },
  twitter: {
    card: "summary",
    title: "À Propos - Notre Histoire | LA REDOUTE SARL-U",
    description: "Découvrez LA REDOUTE SARL-U, votre partenaire de distribution au Togo.",
    images: ["/logo-main.png"],
  },
}

export default function AboutPage() {
  return <SiteContent />
}
