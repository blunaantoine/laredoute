// Script complet pour restaurer TOUS les produits sur le VPS
// 1. Re-seed les produits originaux
// 2. Ajouter les 8 nouveaux produits Dufe Lub

const { PrismaClient } = require('./node_modules/.prisma/client');
const db = new PrismaClient();

async function main() {
  console.log('🔄 Restauration complète de la base de données...\n');

  // 1. Vérifier l'état actuel
  const currentCount = await db.product.count();
  console.log('📦 Produits actuels:', currentCount);

  // 2. Supprimer TOUS les produits pour repartir propre
  const deleted = await db.product.deleteMany();
  console.log('🗑️  Tous les produits supprimés:', deleted.count);

  // 3. Créer TOUS les produits (originaux + nouveaux)
  const allProducts = [
    // === AUTOMOBILE - PNEUS ===
    { category: 'pneus', subcategory: 'automobile', title: 'Pneu Michelin Energy Saver', description: 'Pneu tourisme Michelin Energy Saver - Économie de carburant et longue durée de vie.', imageUrl: '/products/auto-tire.png', variants: '175/65 R14, 185/65 R15, 195/65 R15, 205/55 R16, 215/55 R16', order: 1, isActive: true },
    { category: 'pneus', subcategory: 'automobile', title: 'Pneu Goodyear EfficientGrip', description: 'Pneu tourisme Goodyear EfficientGrip - Performance et confort sur route.', imageUrl: '/products/auto-tire.png', variants: '185/60 R15, 195/60 R15, 205/55 R16, 215/60 R16', order: 2, isActive: true },
    { category: 'pneus', subcategory: 'automobile', title: 'Pneu Continental ContiPremiumContact', description: 'Pneu Continental ContiPremiumContact - Adhérence et freinage optimisés.', imageUrl: '/products/auto-tire.png', variants: '175/70 R13, 185/65 R15, 195/65 R15, 205/55 R16', order: 3, isActive: true },
    { category: 'pneus', subcategory: 'automobile', title: 'Pneu Pirelli Cinturato P1', description: 'Pneu Pirelli Cinturato P1 - Éco-conçu et faible résistance au roulement.', imageUrl: '/products/auto-tire.png', variants: '155/70 R13, 165/70 R14, 175/65 R14, 185/60 R14', order: 4, isActive: true },
    { category: 'pneus', subcategory: 'automobile', title: 'Pneu 4x4 / SUV Bridgestone Dueler', description: 'Pneu SUV/4x4 Bridgestone Dueler - Pour tout terrain et route.', imageUrl: '/products/auto-tire-suv.png', variants: '225/65 R17, 235/65 R17, 255/60 R18, 265/65 R17', order: 5, isActive: true },
    { category: 'pneus', subcategory: 'automobile', title: 'Pneu Utilitaire Michelin Agilis', description: 'Pneu utilitaire Michelin Agilis - Robustesse et longévité pour véhicules commerciaux.', imageUrl: '/products/auto-tire.png', variants: '185 R14 C, 195 R15 C, 205/65 R16 C, 215/75 R16 C', order: 6, isActive: true },
    { category: 'pneus', subcategory: 'automobile', title: 'Pneu Camion Continental HSR', description: 'Pneu poids lourd Continental HSR - Pour transport longue distance.', imageUrl: '/products/auto-tire-truck.png', variants: '11R22.5, 295/80 R22.5, 315/80 R22.5, 385/65 R22.5', order: 7, isActive: true },

    // === AUTOMOBILE - HUILES ===
    { category: 'huiles', subcategory: 'automobile', title: 'Huile Moteur Total Quartz 9000 Energy', description: 'Huile moteur synthétique Total Quartz 9000 Energy. Protection avancée et performance optimale.', imageUrl: '/products/auto-oil.png', variants: '5W-30 1L, 5W-30 4L, 5W-30 5L, 5W-30 208L', order: 1, isActive: true },
    { category: 'huiles', subcategory: 'automobile', title: 'Huile Moteur Shell Helix Ultra', description: 'Huile moteur Shell Helix Ultra - Technologie PurePlus pour une protection ultime.', imageUrl: '/products/auto-oil.png', variants: '5W-40 1L, 5W-40 4L, 5W-40 5L, 10W-40 4L', order: 2, isActive: true },
    { category: 'huiles', subcategory: 'automobile', title: 'Huile Moteur Motul 8100 X-cess', description: 'Huile moteur 100% synthèse Motul 8100 X-cess - Performance extrême.', imageUrl: '/products/auto-oil.png', variants: '5W-40 1L, 5W-40 5L, 0W-40 1L', order: 3, isActive: true },
    { category: 'huiles', subcategory: 'automobile', title: 'Huile Moteur Castrol GTX', description: 'Huile moteur Castrol GTX - Protection quotidienne du moteur.', imageUrl: '/products/auto-oil.png', variants: '15W-40 1L, 15W-40 4L, 20W-50 4L', order: 4, isActive: true },
    { category: 'huiles', subcategory: 'automobile', title: 'Huile Moteur Diesel Total Rubia', description: 'Huile moteur diesel Total Rubia - Conçue pour moteurs diesel lourds.', imageUrl: '/products/auto-oil-diesel.png', variants: '15W-40 5L, 15W-40 208L, 10W-40 208L', order: 5, isActive: true },
    { category: 'huiles', subcategory: 'automobile', title: 'Huile Boîte de Vitesse ELF Tranself', description: 'Huile de transmission ELF Tranself - Pour boîtes manuelles et automatiques.', imageUrl: '/products/auto-oil-gear.png', variants: '75W-80 1L, 75W-80 5L, 80W-90 1L', order: 6, isActive: true },
    // Nouveaux Dufe Lub
    { category: 'huiles', subcategory: 'automobile', title: 'Dufe Lub Boost Protect', description: 'Huile moteur Dufe Lub - Boost & Protect The Engine Lube. Protection renforcée du moteur pour une performance optimale.', imageUrl: '/api/files/products/IMG-20260530-WA0010.jpg', variants: null, order: 7, isActive: true },
    { category: 'huiles', subcategory: 'automobile', title: 'Dufe Lub Super Ultra-5 Motor Oil', description: 'Huile moteur multi-grade Dufe Lub Ultra-5. Formule avancée pour une protection supérieure du moteur.', imageUrl: '/api/files/products/IMG-20260530-WA0014.jpg', variants: null, order: 8, isActive: true },
    { category: 'huiles', subcategory: 'automobile', title: 'Dufe Lub Shift Power ATF', description: 'Huile de transmission automatique Dufe Lub Shift Power. Compatible multi-véhicule DEXRON.', imageUrl: '/api/files/products/IMG-20260530-WA0015.jpg', variants: null, order: 9, isActive: true },
    { category: 'huiles', subcategory: 'automobile', title: 'Dufe Lub Super Ultra-5 SAE 20W-50', description: 'Huile moteur Dufe Lub Ultra-5 SAE 20W-50. Protection maximale pour moteurs à forte sollicitation.', imageUrl: '/api/files/products/IMG-20260530-WA0016.jpg', variants: null, order: 10, isActive: true },
    { category: 'huiles', subcategory: 'automobile', title: 'Dufe Lub Super Ultra-10 Motor Oil', description: 'Huile moteur Dufe Lub Ultra-10 Low Mileage. Formule spéciale pour moteurs à faible kilométrage.', imageUrl: '/api/files/products/IMG-20260530-WA0017.jpg', variants: null, order: 11, isActive: true },

    // === AUTOMOBILE - ACCESSOIRES ===
    { category: 'accessoires', subcategory: 'automobile', title: 'Batterie YUASA YBX', description: 'Batterie automobile YUASA YBX - Fiabilité et puissance de démarrage.', imageUrl: '/products/auto-battery.png', variants: '12V 45Ah, 12V 60Ah, 12V 70Ah, 12V 80Ah, 12V 100Ah', order: 1, isActive: true },
    { category: 'accessoires', subcategory: 'automobile', title: 'Filtre à Huile Bosch', description: 'Filtre à huile Bosch - Filtration efficace pour protéger votre moteur.', imageUrl: '/products/auto-filters.png', variants: 'Filtre standard, Filtre grand format, Filtre cartouche', order: 2, isActive: true },
    { category: 'accessoires', subcategory: 'automobile', title: 'Filtre à Air Mann-Filter', description: 'Filtre à air Mann-Filter - Assure un flux d\'air propre au moteur.', imageUrl: '/products/auto-filters.png', variants: 'Filtre panel, Filtre cylindrique, Filtre conique', order: 3, isActive: true },
    { category: 'accessoires', subcategory: 'automobile', title: 'Liquide de Frein DOT4', description: 'Liquide de frein DOT4 - Sécurité et performance de freinage.', imageUrl: '/products/auto-fluids.png', variants: 'DOT4 500ml, DOT4 1L, DOT5.1 500ml', order: 4, isActive: true },
    { category: 'accessoires', subcategory: 'automobile', title: 'Liquide de Refroidissement', description: 'Liquide de refroidissement - Protection contre la surchauffe.', imageUrl: '/products/auto-fluids.png', variants: 'Concentré 1L, Prêt à l\'emploi 1L, Prêt à l\'emploi 5L, Concentré 205L', order: 5, isActive: true },
    { category: 'accessoires', subcategory: 'automobile', title: 'Bougies d\'Allumage NGK', description: 'Bougies d\'allumage NGK - Performance d\'allumage supérieure.', imageUrl: '/products/auto-sparkplugs.png', variants: 'Iridium, Platinum, Standard, Nickel', order: 6, isActive: true },
    { category: 'accessoires', subcategory: 'automobile', title: 'Ampoules Automobile Philips', description: 'Ampoules automobile Philips - Éclairage puissant et durable.', imageUrl: '/products/auto-bulbs.png', variants: 'H4 12V 60/55W, H7 12V 55W, H11 12V 55W, W5W LED', order: 7, isActive: true },
    { category: 'accessoires', subcategory: 'automobile', title: 'Essuie-Glaces Bosch AeroTwin', description: 'Essuie-glaces Bosch AeroTwin - Visibilité optimale par tout temps.', imageUrl: '/products/auto-wipers.png', variants: '400mm, 450mm, 500mm, 550mm, 600mm, 650mm, 700mm', order: 8, isActive: true },
    // Nouveaux Dufe Lub accessoires
    { category: 'accessoires', subcategory: 'automobile', title: 'Dufe Lub Greaser', description: 'Graisse automobile Dufe Lub. Lubrification haute performance pour pièces mécaniques.', imageUrl: '/api/files/products/IMG-20260530-WA0012.jpg', variants: null, order: 9, isActive: true },
    { category: 'accessoires', subcategory: 'automobile', title: 'Dufe Lub DOT 3 Super Heavy Duty', description: 'Liquide de frein DOT 3 Super Heavy Duty. Fluidité et résistance aux hautes températures pour une sécurité maximale.', imageUrl: '/api/files/products/IMG-20260530-WA0013.jpg', variants: null, order: 10, isActive: true },

    // === AGROALIMENTAIRE - RIZ ===
    { category: 'riz', subcategory: 'agroalimentaire', title: 'Riz TILMSI', description: 'Riz parfumé TILMSI de qualité supérieure.', imageUrl: '/products/tilmsi-riz.jpeg', variants: 'Sac 25kg, Sac 50kg', order: 1, isActive: true },
    { category: 'riz', subcategory: 'agroalimentaire', title: 'Riz Délice', description: 'Riz Délice - Le goût authentique du riz de qualité.', imageUrl: '/products/delice-riz.jpeg', variants: 'Sac 25kg, Sac 50kg', order: 2, isActive: true },
    { category: 'riz', subcategory: 'agroalimentaire', title: 'Riz Amigo', description: 'Riz Amigo - Qualité et saveur au quotidien.', imageUrl: '/products/amigo-riz.jpeg', variants: 'Sac 25kg, Sac 50kg', order: 3, isActive: true },
    { category: 'riz', subcategory: 'agroalimentaire', title: 'Riz Royal Mekong', description: 'Riz Royal Mekong - Riz premium du Mékong.', imageUrl: '/products/royal-mekong-riz.jpeg', variants: 'Sac 25kg, Sac 50kg', order: 4, isActive: true },
    { category: 'riz', subcategory: 'agroalimentaire', title: 'Riz TIN-TINA', description: 'Riz TIN-TINA - Riz de qualité pour toute la famille.', imageUrl: '/products/tintina-riz.jpeg', variants: 'Sac 25kg, Sac 50kg', order: 5, isActive: true },
    { category: 'riz', subcategory: 'agroalimentaire', title: 'Riz Malaika\'s', description: 'Riz Malaika\'s - Le choix de la qualité.', imageUrl: '/products/malaika-riz.jpeg', variants: 'Sac 25kg, Sac 50kg', order: 6, isActive: true },
    { category: 'riz', subcategory: 'agroalimentaire', title: 'Riz Evo', description: 'Riz Evo - Innovation et qualité.', imageUrl: '/products/evo-riz.jpeg', variants: 'Sac 25kg', order: 7, isActive: true },
    { category: 'riz', subcategory: 'agroalimentaire', title: 'Riz Aïcha', description: 'Riz Aïcha - Le riz qui fait la différence.', imageUrl: '/products/aicha-riz.jpeg', variants: 'Sac 25kg', order: 8, isActive: true },

    // === AGROALIMENTAIRE - PATES ===
    { category: 'pates', subcategory: 'agroalimentaire', title: 'Spaghetti Bella', description: 'Spaghetti Bella - Pâtes de qualité supérieure.', imageUrl: '/products/spaghetti-bella.jpeg', variants: 'Paquet 500g, Carton 10kg, Carton 20kg', order: 1, isActive: true },
    { category: 'pates', subcategory: 'agroalimentaire', title: 'Spaghetti Belle Vie', description: 'Spaghetti Belle Vie - Le goût des pâtes authentiques.', imageUrl: '/products/belle-vie-spaghetti.jpeg', variants: 'Paquet 500g, Carton 10kg, Carton 20kg', order: 2, isActive: true },

    // === AGROALIMENTAIRE - HUILES ALIMENTAIRES ===
    { category: 'huiles-alimentaires', subcategory: 'agroalimentaire', title: 'Huile Bingoil', description: 'Huile alimentaire Bingoil - Qualité et économie.', imageUrl: '/products/bingoil-huile.jpeg', variants: 'Bidon 1L, Bidon 5L, Bidon 10L, Bidon 20L', order: 1, isActive: true },
    { category: 'huiles-alimentaires', subcategory: 'agroalimentaire', title: 'Huile Lou Mas', description: 'Huile alimentaire Lou Mas - L\'huile de référence au Togo.', imageUrl: '/products/loumas-huile.jpeg', variants: 'Bidon 1L, Bidon 5L, Bidon 10L, Bidon 20L, Fût 200L', order: 2, isActive: true },
    { category: 'huiles-alimentaires', subcategory: 'agroalimentaire', title: 'Huile Olé', description: 'Huile alimentaire Olé - Qualité supérieure pour votre cuisine.', imageUrl: '/products/ole-huile.jpeg', variants: 'Bidon 5L, Bidon 10L, Bidon 20L, Fût 200L', order: 3, isActive: true },
    // Nouveau
    { category: 'huiles-alimentaires', subcategory: 'agroalimentaire', title: 'Huile Alimentaire Végétale', description: 'Huile végétale alimentaire de qualité supérieure, idéale pour la cuisine quotidienne.', imageUrl: '/api/files/products/IMG-20260530-WA0011.jpg', variants: null, order: 4, isActive: true },
  ];

  for (const p of allProducts) {
    const created = await db.product.create({ data: p });
    console.log('✅', created.title, '(' + created.category + ')');
  }

  // 4. Résumé
  const total = await db.product.count();
  const active = await db.product.count({ where: { isActive: true } });
  const byCategory = {};
  const all = await db.product.findMany();
  all.forEach(p => { byCategory[p.category] = (byCategory[p.category] || 0) + 1; });
  
  console.log('\n📊 RÉSUMÉ:');
  console.log('   Total produits:', total);
  console.log('   Actifs:', active);
  console.log('   Par catégorie:');
  Object.entries(byCategory).sort().forEach(([cat, count]) => {
    console.log('     -', cat + ':', count);
  });
  console.log('\n✅ Restauration terminée !');
}

main().catch(e => console.error('❌ Erreur:', e)).finally(() => db.$disconnect());
