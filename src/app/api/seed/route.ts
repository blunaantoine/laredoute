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

// Individual product images (automobile - clean, no watermark)
const PRODUCT_IMAGES: Record<string, string> = {
  'Pneu Michelin Energy Saver': '/products/auto-tire.png',
  'Pneu Goodyear EfficientGrip': '/products/auto-tire.png',
  'Pneu Continental ContiPremiumContact': '/products/auto-tire.png',
  'Pneu Pirelli Cinturato P1': '/products/auto-tire.png',
  'Pneu 4x4 / SUV Bridgestone Dueler': '/products/auto-tire-suv.png',
  'Pneu Utilitaire Michelin Agilis': '/products/auto-tire.png',
  'Pneu Camion Continental HSR': '/products/auto-tire-truck.png',
  'Huile Moteur Total Quartz 9000 Energy': '/products/auto-oil.png',
  'Huile Moteur Shell Helix Ultra': '/products/auto-oil.png',
  'Huile Moteur Motul 8100 X-cess': '/products/auto-oil.png',
  'Huile Moteur Castrol GTX': '/products/auto-oil.png',
  'Huile Moteur Diesel Total Rubia': '/products/auto-oil-diesel.png',
  'Huile Boîte de Vitesse ELF Tranself': '/products/auto-oil-gear.png',
  'Batterie YUASA YBX': '/products/auto-battery.png',
  'Filtre à Huile Bosch': '/products/auto-filters.png',
  'Filtre à Air Mann-Filter': '/products/auto-filters.png',
  'Liquide de Frein DOT4': '/products/auto-fluids.png',
  'Liquide de Refroidissement': '/products/auto-fluids.png',
  'Bougies d\'Allumage NGK': '/products/auto-sparkplugs.png',
  'Ampoules Automobile Philips': '/products/auto-bulbs.png',
  'Essuie-Glaces Bosch AeroTwin': '/products/auto-wipers.png',
}

const DEFAULT_PRODUCTS = [
  // === AUTOMOBILE - PNEUS ===
  {
    category: 'pneus',
    subcategory: 'automobile',
    title: 'Pneu Michelin Energy Saver',
    description: 'Pneu tourisme haute performance avec faible résistance au roulement. Économie de carburant et longue durée de vie.',
    variants: '175/65 R14, 185/65 R15, 195/65 R15, 205/55 R16, 215/55 R16',
    imageUrl: '/products/auto-tire.png',
    order: 1,
    isActive: true,
  },
  {
    category: 'pneus',
    subcategory: 'automobile',
    title: 'Pneu Goodyear EfficientGrip',
    description: 'Pneu premium pour voiture de tourisme. Excellente adhérence sur route mouillée et freinage court.',
    variants: '185/60 R15, 195/60 R15, 205/55 R16, 215/60 R16',
    imageUrl: '/products/auto-tire.png',
    order: 2,
    isActive: true,
  },
  {
    category: 'pneus',
    subcategory: 'automobile',
    title: 'Pneu Continental ContiPremiumContact',
    description: 'Pneu tourisme offrant sécurité et confort. Technologie de dernière génération pour une conduite optimale.',
    variants: '175/70 R13, 185/65 R15, 195/65 R15, 205/55 R16',
    imageUrl: '/products/auto-tire.png',
    order: 3,
    isActive: true,
  },
  {
    category: 'pneus',
    subcategory: 'automobile',
    title: 'Pneu Pirelli Cinturato P1',
    description: 'Pneu écologique pour petites et moyennes cylindrées. Réduction de la résistance au roulement et bruit réduit.',
    variants: '155/70 R13, 165/70 R14, 175/65 R14, 185/60 R14',
    imageUrl: '/products/auto-tire.png',
    order: 4,
    isActive: true,
  },
  {
    category: 'pneus',
    subcategory: 'automobile',
    title: 'Pneu 4x4 / SUV Bridgestone Dueler',
    description: 'Pneu tout-terrain pour SUV et véhicules 4x4. Robustesse et performance sur tous les types de routes.',
    variants: '225/65 R17, 235/65 R17, 255/60 R18, 265/65 R17',
    imageUrl: '/products/auto-tire-suv.png',
    order: 5,
    isActive: true,
  },
  {
    category: 'pneus',
    subcategory: 'automobile',
    title: 'Pneu Utilitaire Michelin Agilis',
    description: 'Pneu conçu pour véhicules utilitaires et camionnettes. Haute résistance et longue durabilité pour un usage intensif.',
    variants: '185 R14 C, 195 R15 C, 205/65 R16 C, 215/75 R16 C',
    imageUrl: '/products/auto-tire.png',
    order: 6,
    isActive: true,
  },
  {
    category: 'pneus',
    subcategory: 'automobile',
    title: 'Pneu Camion Continental HSR',
    description: 'Pneu pour poids lourds et camions. Haute performance pour transport longue distance.',
    variants: '11R22.5, 295/80 R22.5, 315/80 R22.5, 385/65 R22.5',
    imageUrl: '/products/auto-tire-truck.png',
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
    imageUrl: '/products/auto-oil.png',
    order: 10,
    isActive: true,
  },
  {
    category: 'huiles',
    subcategory: 'automobile',
    title: 'Huile Moteur Shell Helix Ultra',
    description: 'Huile moteur 100% synthétique avec technologie PurePlus. Nettoyage exceptionnel et protection contre l\'usure.',
    variants: '5W-40 1L, 5W-40 4L, 5W-40 5L, 10W-40 4L',
    imageUrl: '/products/auto-oil.png',
    order: 11,
    isActive: true,
  },
  {
    category: 'huiles',
    subcategory: 'automobile',
    title: 'Huile Moteur Motul 8100 X-cess',
    description: 'Huile synthétique 100% pour moteurs essence et diesel. Performance extrême et intervalles de vidange prolongés.',
    variants: '5W-40 1L, 5W-40 5L, 0W-40 1L',
    imageUrl: '/products/auto-oil.png',
    order: 12,
    isActive: true,
  },
  {
    category: 'huiles',
    subcategory: 'automobile',
    title: 'Huile Moteur Castrol GTX',
    description: 'Huile minérale premium pour moteurs à usage courant. Protection fiable et entretien régulier.',
    variants: '15W-40 1L, 15W-40 4L, 20W-50 4L',
    imageUrl: '/products/auto-oil.png',
    order: 13,
    isActive: true,
  },
  {
    category: 'huiles',
    subcategory: 'automobile',
    title: 'Huile Moteur Diesel Total Rubia',
    description: 'Huile spécialement formulée pour moteurs diesel de camions et engins lourds. Résistance aux températures extrêmes.',
    variants: '15W-40 5L, 15W-40 208L, 10W-40 208L',
    imageUrl: '/products/auto-oil-diesel.png',
    order: 14,
    isActive: true,
  },
  {
    category: 'huiles',
    subcategory: 'automobile',
    title: 'Huile Boîte de Vitesse ELF Tranself',
    description: 'Huile pour boîtes de vitesses manuelles. Lubrification optimale et changement de vitesse fluide.',
    variants: '75W-80 1L, 75W-80 5L, 80W-90 1L',
    imageUrl: '/products/auto-oil-gear.png',
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
    imageUrl: '/products/auto-battery.png',
    order: 20,
    isActive: true,
  },
  {
    category: 'accessoires',
    subcategory: 'automobile',
    title: 'Filtre à Huile Bosch',
    description: 'Filtre à huile de qualité OEM. Filtration efficace pour protéger votre moteur contre les impuretés.',
    variants: 'Filtre standard, Filtre grand format, Filtre cartouche',
    imageUrl: '/products/auto-filters.png',
    order: 21,
    isActive: true,
  },
  {
    category: 'accessoires',
    subcategory: 'automobile',
    title: 'Filtre à Air Mann-Filter',
    description: 'Filtre à air haute performance. Assure un apport d\'air propre pour une combustion optimale.',
    variants: 'Filtre panel, Filtre cylindrique, Filtre conique',
    imageUrl: '/products/auto-filters.png',
    order: 22,
    isActive: true,
  },
  {
    category: 'accessoires',
    subcategory: 'automobile',
    title: 'Liquide de Frein DOT4',
    description: 'Liquide de frein haute performance. Point d\'ébullition élevé pour une sécurité maximale.',
    variants: 'DOT4 500ml, DOT4 1L, DOT5.1 500ml',
    imageUrl: '/products/auto-fluids.png',
    order: 23,
    isActive: true,
  },
  {
    category: 'accessoires',
    subcategory: 'automobile',
    title: 'Liquide de Refroidissement',
    description: 'Liquide de refroidissement concentré. Protection contre le gel, la surchauffe et la corrosion.',
    variants: 'Concentré 1L, Prêt à l\'emploi 1L, Prêt à l\'emploi 5L, Concentré 205L',
    imageUrl: '/products/auto-fluids.png',
    order: 24,
    isActive: true,
  },
  {
    category: 'accessoires',
    subcategory: 'automobile',
    title: 'Bougies d\'Allumage NGK',
    description: 'Bougie d\'allumage de qualité supérieure. Combustion optimale et durée de vie prolongée.',
    variants: 'Iridium, Platinum, Standard, Nickel',
    imageUrl: '/products/auto-sparkplugs.png',
    order: 25,
    isActive: true,
  },
  {
    category: 'accessoires',
    subcategory: 'automobile',
    title: 'Ampoules Automobile Philips',
    description: 'Ampoules halogène et LED pour phares automobiles. Éclairage puissant et durable.',
    variants: 'H4 12V 60/55W, H7 12V 55W, H11 12V 55W, W5W LED',
    imageUrl: '/products/auto-bulbs.png',
    order: 26,
    isActive: true,
  },
  {
    category: 'accessoires',
    subcategory: 'automobile',
    title: 'Essuie-Glaces Bosch AeroTwin',
    description: 'Balais d\'essuie-glace plat. Essuyage silencieux et efficace par tous les temps.',
    variants: '400mm, 450mm, 500mm, 550mm, 600mm, 650mm, 700mm',
    imageUrl: '/products/auto-wipers.png',
    order: 27,
    isActive: true,
  },

  // === AGRO-ALIMENTAIRE - RIZ ===
  {
    category: 'riz',
    subcategory: 'agroalimentaire',
    title: 'Riz TILMSI',
    description: 'Riz blanc 5% broken de qualité supérieure. Marque TILMSI, conditionné en sacs. Idéal pour la restauration et la grande distribution.',
    imageUrl: '/products/tilmsi-riz.jpeg',
    variants: 'Sac 25kg, Sac 50kg',
    order: 1,
    isActive: true,
  },
  {
    category: 'riz',
    subcategory: 'agroalimentaire',
    title: 'Riz Délice',
    description: 'Riz brisure naturellement parfumé. Marque Délice, qualité constante et goût authentique pour tous les jours.',
    imageUrl: '/products/delice-riz.jpeg',
    variants: 'Sac 25kg, Sac 50kg',
    order: 2,
    isActive: true,
  },
  {
    category: 'riz',
    subcategory: 'agroalimentaire',
    title: 'Riz Amigo',
    description: 'Riz vietnamien de qualité premium. Marque Amigo, grain long et savoureux, parfait pour la cuisine africaine et asiatique.',
    imageUrl: '/products/amigo-riz.jpeg',
    variants: 'Sac 25kg, Sac 50kg',
    order: 3,
    isActive: true,
  },
  {
    category: 'riz',
    subcategory: 'agroalimentaire',
    title: 'Riz Royal Mekong',
    description: 'Riz jasmin long grain vietnamien parfumé. Marque Royal Mekong, arôme délicat et grains tendres pour un résultat parfait à chaque cuisson.',
    imageUrl: '/products/royal-mekong-riz.jpeg',
    variants: 'Sac 25kg, Sac 50kg',
    order: 4,
    isActive: true,
  },
  {
    category: 'riz',
    subcategory: 'agroalimentaire',
    title: 'Riz TIN-TINA',
    description: 'Riz Super Kovie parfumé. Marque TIN-TINA, riz de qualité supérieure naturellement parfumé, grain long et moelleux.',
    imageUrl: '/products/tintina-riz.jpeg',
    variants: 'Sac 25kg, Sac 50kg',
    order: 5,
    isActive: true,
  },
  {
    category: 'riz',
    subcategory: 'agroalimentaire',
    title: "Riz Malaika's",
    description: "Riz long grain parfumé vietnamien. Marque Malaika's, sélection premium pour un goût et une texture exceptionnels.",
    imageUrl: '/products/malaika-riz.jpeg',
    variants: 'Sac 25kg, Sac 50kg',
    order: 6,
    isActive: true,
  },
  {
    category: 'riz',
    subcategory: 'agroalimentaire',
    title: 'Riz Evo',
    description: 'Riz long grains naturellement parfumé. Marque Evo, conditionné en sac de 25kg (5x5). Qualité constante et goût authentique.',
    imageUrl: '/products/evo-riz.jpeg',
    variants: 'Sac 25kg',
    order: 7,
    isActive: true,
  },
  {
    category: 'riz',
    subcategory: 'agroalimentaire',
    title: 'Riz Aïcha',
    description: 'Riz parfumé long grain du Vietnam. Marque Aïcha, poids net 25kg. Grain tendre et parfum délicat pour une cuisine raffinée.',
    imageUrl: '/products/aicha-riz.jpeg',
    variants: 'Sac 25kg',
    order: 8,
    isActive: true,
  },

  // === AGRO-ALIMENTAIRE - PÂTES ===
  {
    category: 'pates',
    subcategory: 'agroalimentaire',
    title: 'Spaghetti Bella',
    description: 'Spaghetti de qualité supérieure. Marque Bella, cuisson parfaite et texture al dente. Idéal pour la restauration et la consommation familiale.',
    imageUrl: '/products/spaghetti-bella.jpeg',
    variants: 'Paquet 500g, Carton 10kg, Carton 20kg',
    order: 10,
    isActive: true,
  },
  {
    category: 'pates',
    subcategory: 'agroalimentaire',
    title: 'Spaghetti Belle Vie',
    description: "Spaghetti et pâtes alimentaires de qualité. Marque Belle Vie, semoule de blé dur sélectionnée pour une cuisson optimale.",
    imageUrl: '/products/belle-vie-spaghetti.jpeg',
    variants: 'Paquet 500g, Carton 10kg, Carton 20kg',
    order: 11,
    isActive: true,
  },

  // === AGRO-ALIMENTAIRE - HUILES ALIMENTAIRES ===
  {
    category: 'huiles-alimentaires',
    subcategory: 'agroalimentaire',
    title: 'Huile Bingoil',
    description: 'Huile de tournesol raffinée de qualité supérieure. Marque Bingoil, bidon 1 litre. Idéale pour la cuisine et la friture.',
    imageUrl: '/products/bingoil-huile.jpeg',
    variants: 'Bidon 1L, Bidon 5L, Bidon 10L, Bidon 20L',
    order: 20,
    isActive: true,
  },
  {
    category: 'huiles-alimentaires',
    subcategory: 'agroalimentaire',
    title: 'Huile Lou Mas',
    description: 'Huile de tournesol de qualité premium. Marque Lou Mas, goût neutre et point de fumée élevé pour une cuisine saine.',
    imageUrl: '/products/loumas-huile.jpeg',
    variants: 'Bidon 1L, Bidon 5L, Bidon 10L, Bidon 20L, Fût 200L',
    order: 21,
    isActive: true,
  },
  {
    category: 'huiles-alimentaires',
    subcategory: 'agroalimentaire',
    title: 'Huile Olé',
    description: "Huile de tournesol raffinée. Marque Olé, bidon 5 litres. Qualité professionnelle pour la restauration et l'hôtellerie.",
    imageUrl: '/products/ole-huile.jpeg',
    variants: 'Bidon 5L, Bidon 10L, Bidon 20L, Fût 200L',
    order: 22,
    isActive: true,
  },
]

export async function POST() {
  try {
    let contentCreated = 0
    let imagesCreated = 0
    let productsCreated = 0
    let productsUpdated = 0

    // Seed default admin user if not exists
    const existingAdmin = await db.user.findFirst({ where: { role: 'admin' } })
    if (!existingAdmin) {
      await db.user.create({
        data: {
          email: 'admin@laredoutesarl.com',
          name: 'Administrateur',
          password: process.env.ADMIN_PASSWORD || 'laredoute2024',
          role: 'admin',
        },
      })
    }

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

    // Seed Products - create if not exists, update imageUrl if exists
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
      } else if (item.imageUrl && existing.imageUrl !== item.imageUrl) {
        // Update existing product with new image URL
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
