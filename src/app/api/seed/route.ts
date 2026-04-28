import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const DEFAULT_CONTENTS = [
  // Homepage content
  { key: 'hero-title', category: 'homepage', content: 'LA REDOUTE' },
  { key: 'hero-subtitle', category: 'homepage', content: 'SARL-U' },
  { key: 'hero-description', category: 'homepage', content: "Distribution professionnelle de pneus, huiles moteurs et produits d'alimentation générale au Togo. Qualité, fiabilité et service exceptionnel." },
  { key: 'hero-badge', category: 'homepage', content: 'Votre partenaire de confiance depuis des années' },
  { key: 'about-title', category: 'homepage', content: "Une entreprise togolaise engagée pour l'excellence" },
  { key: 'about-description', category: 'homepage', content: "Fondée avec la vision de fournir des produits de qualité supérieure au marché togolais, LA REDOUTE SARL-U a grandi pour devenir un distributeur de confiance." },
  { key: 'about-mission', category: 'homepage', content: 'Fournir des produits de qualité à des prix compétitifs, tout en assurant un service client exceptionnel. Nous nous efforçons d\'être le pont entre les meilleurs fabricants mondiaux et le marché togolais.' },
  { key: 'about-vision', category: 'homepage', content: "Devenir le leader de la distribution en Afrique de l'Ouest, reconnu pour l'excellence de nos produits, la fiabilité de notre service et notre contribution au développement économique de la région." },
  { key: 'about-story', category: 'homepage', content: "Depuis sa création, LA REDOUTE SARL-U s'est imposée comme un acteur majeur de la distribution au Togo. Notre engagement envers la qualité et le service client a fait de nous le partenaire de confiance de centaines de professionnels et particuliers." },
  { key: 'about-story2', category: 'homepage', content: "Spécialisée dans la distribution de produits automobiles et agro-alimentaires, nous offrons une gamme complète de produits soigneusement sélectionnés pour répondre aux besoins les plus exigeants du marché togolais et de la sous-région ouest-africaine." },
  { key: 'cta-title', category: 'homepage', content: 'Prêt à Travailler Avec Nous ?' },
  { key: 'cta-description', category: 'homepage', content: "Nous sommes à votre disposition pour répondre à toutes vos questions et vous accompagner dans vos projets." },
  { key: 'values-title', category: 'homepage', content: 'Ce Qui Nous Définit' },
  { key: 'products-title', category: 'homepage', content: "Deux Domaines d'Expertise" },
  { key: 'auto-description', category: 'homepage', content: "Large sélection de pneus, huiles moteurs et accessoires automobiles pour tous véhicules." },
  { key: 'agro-description', category: 'homepage', content: 'Distribution de produits alimentaires de qualité, boissons et céréales.' },
  // Automobile page content
  { key: 'auto-page-title', category: 'automobile', content: 'Nos Produits Automobile' },
  { key: 'auto-page-subtitle', category: 'automobile', content: 'Découvrez notre gamme complète de produits automobiles' },
  // Agro-alimentaire page content
  { key: 'agro-page-title', category: 'agroalimentaire', content: 'Nos Produits Agro-alimentaire' },
  { key: 'agro-page-subtitle', category: 'agroalimentaire', content: 'Des produits de qualité pour votre alimentation' },
]

const DEFAULT_IMAGES = [
  { key: 'logo-main', category: 'logo', title: 'Logo Principal', imageUrl: '/logo-main.png' },
  { key: 'logo-alt', category: 'logo', title: 'Logo Alternatif', imageUrl: '/logo-alt.png' },
  { key: 'hero-background', category: 'hero', title: 'Arrière-plan Hero', imageUrl: '/pattern.png' },
  { key: 'about-team', category: 'about', title: 'Photo Équipe', imageUrl: '/about-team.png' },
]

// Category-level images
const CATEGORY_IMAGES: Record<string, string> = {
  pneus: '/products/pneus.png',
  huiles: '/products/huiles.png',
  accessoires: '/products/accessoires.png',
  alimentation: '/products/alimentation.png',
  boissons: '/products/boissons.png',
  cereales: '/products/cereales.png',
}

// Individual product images (for featured products)
const PRODUCT_IMAGES: Record<string, string> = {
  'Pneu Michelin Energy Saver': '/products/tire-michelin.png',
  'Pneu Goodyear EfficientGrip': '/products/tire-michelin.png',
  'Pneu Continental ContiPremiumContact': '/products/tire-michelin.png',
  'Pneu Pirelli Cinturato P1': '/products/tire-michelin.png',
  'Pneu 4x4 / SUV Bridgestone Dueler': '/products/tire-michelin.png',
  'Pneu Utilitaire Michelin Agilis': '/products/tire-michelin.png',
  'Pneu Camion Continental HSR': '/products/tire-michelin.png',
  'Huile Moteur Total Quartz 9000 Energy': '/products/oil-total.png',
  'Huile Moteur Shell Helix Ultra': '/products/oil-total.png',
  'Huile Moteur Motul 8100 X-cess': '/products/oil-total.png',
  'Huile Moteur Castrol GTX': '/products/oil-total.png',
  'Huile Moteur Diesel Total Rubia': '/products/oil-total.png',
  'Huile Boîte de Vitesse ELF Tranself': '/products/oil-total.png',
  'Batterie YUASA YBX': '/products/battery.png',
  'Filtre à Huile Bosch': '/products/auto-parts.png',
  'Filtre à Air Mann-Filter': '/products/auto-parts.png',
  'Liquide de Frein DOT4': '/products/auto-parts.png',
  'Liquide de Refroidissement': '/products/auto-parts.png',
  'Bougies d\'Allumage NGK': '/products/auto-parts.png',
  'Ampoules Automobile Philips': '/products/auto-parts.png',
  'Essuie-Glaces Bosch AeroTwin': '/products/auto-parts.png',
  'Riz Parfumé Grand Cru': '/products/riz.png',
  'Sucre Blanc Cristallisé': '/products/alimentation.png',
  'Farine de Blé Type 55': '/products/alimentation.png',
  'Huile Végétale Raffinée': '/products/huile-veg.png',
  'Pâte Alimentaire (Pâtes)': '/products/alimentation.png',
  'Conserve de Tomate': '/products/alimentation.png',
  'Lait en Poudre Entier': '/products/alimentation.png',
  'Eau Minérale en Bouteille': '/products/eau.png',
  'Jus de Fruits Tropical': '/products/boissons.png',
  'Boisson Énergisante': '/products/boissons.png',
  'Café Torréfié': '/products/cafe.png',
  'Soda & Boissons Gazeuses': '/products/boissons.png',
  'Maïs Grain': '/products/grain.png',
  'Mil / Millet': '/products/grain.png',
  'Sorgho': '/products/cereales.png',
  'Soja Grain': '/products/grain.png',
  'Farine de Maïs': '/products/cereales.png',
  'Niébé (Haricot Cornille)': '/products/grain.png',
}

const DEFAULT_PRODUCTS = [
  // === AUTOMOBILE - PNEUS ===
  {
    category: 'pneus',
    subcategory: 'automobile',
    title: 'Pneu Michelin Energy Saver',
    description: 'Pneu tourisme haute performance avec faible résistance au roulement. Économie de carburant et longue durée de vie.',
    variants: '175/65 R14, 185/65 R15, 195/65 R15, 205/55 R16, 215/55 R16',
    imageUrl: '/products/tire-michelin.png',
    order: 1,
    isActive: true,
  },
  {
    category: 'pneus',
    subcategory: 'automobile',
    title: 'Pneu Goodyear EfficientGrip',
    description: 'Pneu premium pour voiture de tourisme. Excellente adhérence sur route mouillée et freinage court.',
    variants: '185/60 R15, 195/60 R15, 205/55 R16, 215/60 R16',
    imageUrl: '/products/tire-michelin.png',
    order: 2,
    isActive: true,
  },
  {
    category: 'pneus',
    subcategory: 'automobile',
    title: 'Pneu Continental ContiPremiumContact',
    description: 'Pneu tourisme offrant sécurité et confort. Technologie de dernière génération pour une conduite optimale.',
    variants: '175/70 R13, 185/65 R15, 195/65 R15, 205/55 R16',
    imageUrl: '/products/pneus.png',
    order: 3,
    isActive: true,
  },
  {
    category: 'pneus',
    subcategory: 'automobile',
    title: 'Pneu Pirelli Cinturato P1',
    description: 'Pneu écologique pour petites et moyennes cylindrées. Réduction de la résistance au roulement et bruit réduit.',
    variants: '155/70 R13, 165/70 R14, 175/65 R14, 185/60 R14',
    imageUrl: '/products/pneus.png',
    order: 4,
    isActive: true,
  },
  {
    category: 'pneus',
    subcategory: 'automobile',
    title: 'Pneu 4x4 / SUV Bridgestone Dueler',
    description: 'Pneu tout-terrain pour SUV et véhicules 4x4. Robustesse et performance sur tous les types de routes.',
    variants: '225/65 R17, 235/65 R17, 255/60 R18, 265/65 R17',
    imageUrl: '/products/pneus.png',
    order: 5,
    isActive: true,
  },
  {
    category: 'pneus',
    subcategory: 'automobile',
    title: 'Pneu Utilitaire Michelin Agilis',
    description: 'Pneu conçu pour véhicules utilitaires et camionnettes. Haute résistance et longue durabilité pour un usage intensif.',
    variants: '185 R14 C, 195 R15 C, 205/65 R16 C, 215/75 R16 C',
    imageUrl: '/products/pneus.png',
    order: 6,
    isActive: true,
  },
  {
    category: 'pneus',
    subcategory: 'automobile',
    title: 'Pneu Camion Continental HSR',
    description: 'Pneu pour poids lourds et camions. Haute performance pour transport longue distance.',
    variants: '11R22.5, 295/80 R22.5, 315/80 R22.5, 385/65 R22.5',
    imageUrl: '/products/pneus.png',
    order: 7,
    isActive: true,
  },

  // === AUTOMOBILE - HUILES ===
  {
    category: 'huiles',
    subcategory: 'automobile',
    title: 'Huile Moteur Total Quartz 9000 Energy',
    description: 'Huile moteur synthétique 5W-30 de haute performance. Protection optimale du moteur et économie de carburant.',
    variants: '5W-30 1L, 5W-30 4L, 5W-30 5L, 5W-30 208L',
    imageUrl: '/products/oil-total.png',
    order: 10,
    isActive: true,
  },
  {
    category: 'huiles',
    subcategory: 'automobile',
    title: 'Huile Moteur Shell Helix Ultra',
    description: 'Huile moteur 100% synthétique avec technologie PurePlus. Nettoyage exceptionnel et protection contre l\'usure.',
    variants: '5W-40 1L, 5W-40 4L, 5W-40 5L, 10W-40 4L',
    imageUrl: '/products/oil-total.png',
    order: 11,
    isActive: true,
  },
  {
    category: 'huiles',
    subcategory: 'automobile',
    title: 'Huile Moteur Motul 8100 X-cess',
    description: 'Huile synthétique 100% pour moteurs essence et diesel. Performance extrême et intervalles de vidange prolongés.',
    variants: '5W-40 1L, 5W-40 5L, 0W-40 1L',
    imageUrl: '/products/huiles.png',
    order: 12,
    isActive: true,
  },
  {
    category: 'huiles',
    subcategory: 'automobile',
    title: 'Huile Moteur Castrol GTX',
    description: 'Huile minérale premium pour moteurs à usage courant. Protection fiable et entretien régulier.',
    variants: '15W-40 1L, 15W-40 4L, 20W-50 4L',
    imageUrl: '/products/huiles.png',
    order: 13,
    isActive: true,
  },
  {
    category: 'huiles',
    subcategory: 'automobile',
    title: 'Huile Moteur Diesel Total Rubia',
    description: 'Huile spécialement formulée pour moteurs diesel de camions et engins lourds. Résistance aux températures extrêmes.',
    variants: '15W-40 5L, 15W-40 208L, 10W-40 208L',
    imageUrl: '/products/huiles.png',
    order: 14,
    isActive: true,
  },
  {
    category: 'huiles',
    subcategory: 'automobile',
    title: 'Huile Boîte de Vitesse ELF Tranself',
    description: 'Huile pour boîtes de vitesses manuelles. Lubrification optimale et changement de vitesse fluide.',
    variants: '75W-80 1L, 75W-80 5L, 80W-90 1L',
    imageUrl: '/products/huiles.png',
    order: 15,
    isActive: true,
  },

  // === AUTOMOBILE - ACCESSOIRES ===
  {
    category: 'accessoires',
    subcategory: 'automobile',
    title: 'Batterie YUASA YBX',
    description: 'Batterie automobile de haute qualité. Démarrage fiable par tous les temps, longue durée de vie.',
    variants: '12V 45Ah, 12V 60Ah, 12V 70Ah, 12V 80Ah, 12V 100Ah',
    imageUrl: '/products/battery.png',
    order: 20,
    isActive: true,
  },
  {
    category: 'accessoires',
    subcategory: 'automobile',
    title: 'Filtre à Huile Bosch',
    description: 'Filtre à huile de qualité OEM. Filtration efficace pour protéger votre moteur contre les impuretés.',
    variants: 'Filtre standard, Filtre grand format, Filtre cartouche',
    imageUrl: '/products/auto-parts.png',
    order: 21,
    isActive: true,
  },
  {
    category: 'accessoires',
    subcategory: 'automobile',
    title: 'Filtre à Air Mann-Filter',
    description: 'Filtre à air haute performance. Assure un apport d\'air propre pour une combustion optimale.',
    variants: 'Filtre panel, Filtre cylindrique, Filtre conique',
    imageUrl: '/products/auto-parts.png',
    order: 22,
    isActive: true,
  },
  {
    category: 'accessoires',
    subcategory: 'automobile',
    title: 'Liquide de Frein DOT4',
    description: 'Liquide de frein haute performance. Point d\'ébullition élevé pour une sécurité maximale.',
    variants: 'DOT4 500ml, DOT4 1L, DOT5.1 500ml',
    imageUrl: '/products/auto-parts.png',
    order: 23,
    isActive: true,
  },
  {
    category: 'accessoires',
    subcategory: 'automobile',
    title: 'Liquide de Refroidissement',
    description: 'Liquide de refroidissement concentré. Protection contre le gel, la surchauffe et la corrosion.',
    variants: 'Concentré 1L, Prêt à l\'emploi 1L, Prêt à l\'emploi 5L, Concentré 205L',
    imageUrl: '/products/auto-parts.png',
    order: 24,
    isActive: true,
  },
  {
    category: 'accessoires',
    subcategory: 'automobile',
    title: 'Bougies d\'Allumage NGK',
    description: 'Bougie d\'allumage de qualité supérieure. Combustion optimale et durée de vie prolongée.',
    variants: 'Iridium, Platinum, Standard, Nickel',
    imageUrl: '/products/auto-parts.png',
    order: 25,
    isActive: true,
  },
  {
    category: 'accessoires',
    subcategory: 'automobile',
    title: 'Ampoules Automobile Philips',
    description: 'Ampoules halogène et LED pour phares automobiles. Éclairage puissant et durable.',
    variants: 'H4 12V 60/55W, H7 12V 55W, H11 12V 55W, W5W LED',
    imageUrl: '/products/accessoires.png',
    order: 26,
    isActive: true,
  },
  {
    category: 'accessoires',
    subcategory: 'automobile',
    title: 'Essuie-Glaces Bosch AeroTwin',
    description: 'Balais d\'essuie-glace plat. Essuyage silencieux et efficace par tous les temps.',
    variants: '400mm, 450mm, 500mm, 550mm, 600mm, 650mm, 700mm',
    imageUrl: '/products/accessoires.png',
    order: 27,
    isActive: true,
  },

  // === AGRO-ALIMENTAIRE - ALIMENTATION ===
  {
    category: 'alimentation',
    subcategory: 'agroalimentaire',
    title: 'Riz Parfumé Grand Cru',
    description: 'Riz parfumé de qualité supérieure, idéal pour la restauration et la grande distribution. Grain long et aromatique.',
    variants: 'Sac 5kg, Sac 10kg, Sac 25kg, Sac 50kg',
    imageUrl: '/products/riz.png',
    order: 30,
    isActive: true,
  },
  {
    category: 'alimentation',
    subcategory: 'agroalimentaire',
    title: 'Sucre Blanc Cristallisé',
    description: 'Sucre blanc raffiné de première qualité. Idéal pour la consommation quotidienne et l\'industrie agroalimentaire.',
    variants: 'Sac 1kg, Sac 5kg, Sac 25kg, Sac 50kg',
    imageUrl: '/products/alimentation.png',
    order: 31,
    isActive: true,
  },
  {
    category: 'alimentation',
    subcategory: 'agroalimentaire',
    title: 'Farine de Blé Type 55',
    description: 'Farine de blé tout usage pour boulangerie et pâtisserie. Mouture fine et régulière pour des résultats professionnels.',
    variants: 'Sac 1kg, Sac 5kg, Sac 25kg, Sac 50kg',
    imageUrl: '/products/alimentation.png',
    order: 32,
    isActive: true,
  },
  {
    category: 'alimentation',
    subcategory: 'agroalimentaire',
    title: 'Huile Végétale Raffinée',
    description: 'Huile végétale 100% raffinée pour cuisine et friture. Point de fumée élevé et goût neutre.',
    variants: 'Bidon 1L, Bidon 5L, Bidon 10L, Bidon 20L, Fût 200L',
    imageUrl: '/products/huile-veg.png',
    order: 33,
    isActive: true,
  },
  {
    category: 'alimentation',
    subcategory: 'agroalimentaire',
    title: 'Pâte Alimentaire (Pâtes)',
    description: 'Pâtes alimentaires de qualité supérieure fabriquées à partir de semoule de blé dur. Cuisson parfaite et texture al dente.',
    variants: 'Paquet 500g, Sac 1kg, Carton 5kg, Carton 10kg',
    imageUrl: '/products/alimentation.png',
    order: 34,
    isActive: true,
  },
  {
    category: 'alimentation',
    subcategory: 'agroalimentaire',
    title: 'Conserve de Tomate',
    description: 'Concentré et purée de tomate de première qualité. Sans conservateurs, 100% naturel.',
    variants: 'Boîte 70g, Boîte 400g, Boîte 1kg, Boîte 2.5kg',
    imageUrl: '/products/alimentation.png',
    order: 35,
    isActive: true,
  },
  {
    category: 'alimentation',
    subcategory: 'agroalimentaire',
    title: 'Lait en Poudre Entier',
    description: 'Lait en poudre entier de qualité supérieure. Riche en calcium et vitamines, idéal pour la consommation familiale.',
    variants: 'Sac 400g, Sac 1kg, Sac 5kg, Sac 25kg',
    imageUrl: '/products/alimentation.png',
    order: 36,
    isActive: true,
  },

  // === AGRO-ALIMENTAIRE - BOISSONS ===
  {
    category: 'boissons',
    subcategory: 'agroalimentaire',
    title: 'Eau Minérale en Bouteille',
    description: 'Eau minérale naturelle pure et rafraîchissante. Source certifiée, idéale pour la hydration quotidienne.',
    variants: 'Bouteille 0.5L, Bouteille 1L, Bouteille 1.5L, Pack 6x1.5L, Pack 12x1.5L',
    imageUrl: '/products/eau.png',
    order: 40,
    isActive: true,
  },
  {
    category: 'boissons',
    subcategory: 'agroalimentaire',
    title: 'Jus de Fruits Tropical',
    description: 'Jus de fruits 100% naturel aux saveurs tropicales. Sans additifs ni conservateurs artificiels.',
    variants: 'Bouteille 1L, Pack 6x1L, Brique 200ml, Pack 24x200ml',
    imageUrl: '/products/boissons.png',
    order: 41,
    isActive: true,
  },
  {
    category: 'boissons',
    subcategory: 'agroalimentaire',
    title: 'Boisson Énergisante',
    description: 'Boisson énergisante pour un coup de fouet instantané. Formule rafraîchissante et revigorante.',
    variants: 'Canette 250ml, Pack 6x250ml, Pack 24x250ml',
    imageUrl: '/products/boissons.png',
    order: 42,
    isActive: true,
  },
  {
    category: 'boissons',
    subcategory: 'agroalimentaire',
    title: 'Café Torréfié',
    description: 'Café torréfié premium sélectionné pour son arôme riche et sa saveur intense. Mouture fine ou grossière.',
    variants: 'Paquet 250g, Paquet 500g, Sac 1kg, Sac 5kg',
    imageUrl: '/products/cafe.png',
    order: 43,
    isActive: true,
  },
  {
    category: 'boissons',
    subcategory: 'agroalimentaire',
    title: 'Soda & Boissons Gazeuses',
    description: 'Boissons gazeuses rafraîchissantes dans une variété de saveurs. Idéales pour la restauration et les points de vente.',
    variants: 'Bouteille 33cl, Bouteille 50cl, Bouteille 1L, Pack 6x33cl',
    imageUrl: '/products/boissons.png',
    order: 44,
    isActive: true,
  },

  // === AGRO-ALIMENTAIRE - CÉRÉALES ===
  {
    category: 'cereales',
    subcategory: 'agroalimentaire',
    title: 'Maïs Grain',
    description: 'Maïs grain de qualité supérieure pour l\'alimentation humaine et animale. Séché et conditionné avec soin.',
    variants: 'Sac 25kg, Sac 50kg, Sac 100kg',
    imageUrl: '/products/grain.png',
    order: 50,
    isActive: true,
  },
  {
    category: 'cereales',
    subcategory: 'agroalimentaire',
    title: 'Mil / Millet',
    description: 'Millet de première qualité, source naturelle de nutriments essentiels. Aliment de base traditionnel africain.',
    variants: 'Sac 25kg, Sac 50kg, Sac 100kg',
    imageUrl: '/products/cereales.png',
    order: 51,
    isActive: true,
  },
  {
    category: 'cereales',
    subcategory: 'agroalimentaire',
    title: 'Sorgho',
    description: 'Sorgho grain de qualité supérieure. Riche en fibres et sans gluten, adapté à de multiples usages culinaires.',
    variants: 'Sac 25kg, Sac 50kg, Sac 100kg',
    imageUrl: '/products/cereales.png',
    order: 52,
    isActive: true,
  },
  {
    category: 'cereales',
    subcategory: 'agroalimentaire',
    title: 'Soja Grain',
    description: 'Graines de soja de haute qualité. Source exceptionnelle de protéines végétales et d\'acides aminés essentiels.',
    variants: 'Sac 25kg, Sac 50kg, Sac 100kg',
    imageUrl: '/products/grain.png',
    order: 53,
    isActive: true,
  },
  {
    category: 'cereales',
    subcategory: 'agroalimentaire',
    title: 'Farine de Maïs',
    description: 'Farine de maïs fine pour la préparation de plats traditionnels et modernes. Mouture régulière et texture homogène.',
    variants: 'Sac 1kg, Sac 5kg, Sac 25kg, Sac 50kg',
    imageUrl: '/products/cereales.png',
    order: 54,
    isActive: true,
  },
  {
    category: 'cereales',
    subcategory: 'agroalimentaire',
    title: 'Niébé (Haricot Cornille)',
    description: 'Niébé de qualité premium, légumineuse riche en protéines. Ingrédient essentiel de la cuisine ouest-africaine.',
    variants: 'Sac 5kg, Sac 25kg, Sac 50kg, Sac 100kg',
    imageUrl: '/products/grain.png',
    order: 55,
    isActive: true,
  },
]

export async function POST() {
  try {
    let contentCreated = 0
    let imagesCreated = 0
    let productsCreated = 0
    let productsUpdated = 0

    // Seed SiteContent entries
    for (const item of DEFAULT_CONTENTS) {
      const existing = await db.siteContent.findUnique({ where: { key: item.key } })
      if (!existing) {
        await db.siteContent.create({ data: item })
        contentCreated++
      }
    }

    // Seed SiteImage entries
    for (const item of DEFAULT_IMAGES) {
      const existing = await db.siteImage.findUnique({ where: { key: item.key } })
      if (!existing) {
        await db.siteImage.create({ data: item })
        imagesCreated++
      }
    }

    // Seed Products - create if not exists, update imageUrl if exists but missing
    for (const item of DEFAULT_PRODUCTS) {
      const existing = await db.product.findFirst({
        where: {
          title: item.title,
          category: item.category,
          subcategory: item.subcategory,
        },
      })
      if (!existing) {
        await db.product.create({ data: item })
        productsCreated++
      } else if (!existing.imageUrl && item.imageUrl) {
        // Update existing product with image
        await db.product.update({
          where: { id: existing.id },
          data: { imageUrl: item.imageUrl },
        })
        productsUpdated++
      }
    }

    return NextResponse.json({
      success: true,
      contentCreated,
      imagesCreated,
      productsCreated,
      productsUpdated,
      totalCreated: contentCreated + imagesCreated + productsCreated,
    })
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors du seed de la base de données' },
      { status: 500 }
    )
  }
}
