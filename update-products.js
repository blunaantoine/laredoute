// Script pour mettre à jour la DB sur le VPS
// - Supprime les 18 produits inactifs
// - Ajoute les 8 nouveaux produits Dufe Lub + Huile Alimentaire

const { PrismaClient } = require('./node_modules/.prisma/client');
const db = new PrismaClient();

async function main() {
  console.log('🔄 Mise à jour de la base de données...\n');

  // 1. Supprimer tous les produits inactifs
  const deleted = await db.product.deleteMany({ where: { isActive: false } });
  console.log('🗑️  Produits inactifs supprimés:', deleted.count);

  // 2. Récupérer l'ordre max par catégorie
  const products = await db.product.findMany({ orderBy: { order: 'desc' } });
  const maxOrders = {};
  products.forEach(p => {
    if (!maxOrders[p.category] || p.order > maxOrders[p.category]) {
      maxOrders[p.category] = p.order;
    }
  });

  // 3. Ajouter les nouveaux produits
  const newProducts = [
    {
      category: 'huiles',
      subcategory: 'automobile',
      title: 'Dufe Lub Boost Protect',
      description: 'Huile moteur Dufe Lub - Boost & Protect The Engine Lube. Protection renforcée du moteur pour une performance optimale.',
      imageUrl: '/api/files/products/IMG-20260530-WA0010.jpg',
      variants: null,
      order: (maxOrders['huiles'] || 0) + 1,
      isActive: true,
    },
    {
      category: 'huiles-alimentaires',
      subcategory: 'agroalimentaire',
      title: 'Huile Alimentaire Végétale',
      description: 'Huile végétale alimentaire de qualité supérieure, idéale pour la cuisine quotidienne.',
      imageUrl: '/api/files/products/IMG-20260530-WA0011.jpg',
      variants: null,
      order: (maxOrders['huiles-alimentaires'] || 0) + 1,
      isActive: true,
    },
    {
      category: 'accessoires',
      subcategory: 'automobile',
      title: 'Dufe Lub Greaser',
      description: 'Graisse automobile Dufe Lub. Lubrification haute performance pour pièces mécaniques.',
      imageUrl: '/api/files/products/IMG-20260530-WA0012.jpg',
      variants: null,
      order: (maxOrders['accessoires'] || 0) + 1,
      isActive: true,
    },
    {
      category: 'accessoires',
      subcategory: 'automobile',
      title: 'Dufe Lub DOT 3 Super Heavy Duty',
      description: 'Liquide de frein DOT 3 Super Heavy Duty. Fluidité et résistance aux hautes températures pour une sécurité maximale.',
      imageUrl: '/api/files/products/IMG-20260530-WA0013.jpg',
      variants: null,
      order: (maxOrders['accessoires'] || 0) + 2,
      isActive: true,
    },
    {
      category: 'huiles',
      subcategory: 'automobile',
      title: 'Dufe Lub Super Ultra-5 Motor Oil',
      description: 'Huile moteur multi-grade Dufe Lub Ultra-5. Formule avancée pour une protection supérieure du moteur.',
      imageUrl: '/api/files/products/IMG-20260530-WA0014.jpg',
      variants: null,
      order: (maxOrders['huiles'] || 0) + 2,
      isActive: true,
    },
    {
      category: 'huiles',
      subcategory: 'automobile',
      title: 'Dufe Lub Shift Power ATF',
      description: 'Huile de transmission automatique Dufe Lub Shift Power. Compatible multi-véhicule DEXRON.',
      imageUrl: '/api/files/products/IMG-20260530-WA0015.jpg',
      variants: null,
      order: (maxOrders['huiles'] || 0) + 3,
      isActive: true,
    },
    {
      category: 'huiles',
      subcategory: 'automobile',
      title: 'Dufe Lub Super Ultra-5 SAE 20W-50',
      description: 'Huile moteur Dufe Lub Ultra-5 SAE 20W-50. Protection maximale pour moteurs à forte sollicitation.',
      imageUrl: '/api/files/products/IMG-20260530-WA0016.jpg',
      variants: null,
      order: (maxOrders['huiles'] || 0) + 4,
      isActive: true,
    },
    {
      category: 'huiles',
      subcategory: 'automobile',
      title: 'Dufe Lub Super Ultra-10 Motor Oil',
      description: 'Huile moteur Dufe Lub Ultra-10 Low Mileage. Formule spéciale pour moteurs à faible kilométrage.',
      imageUrl: '/api/files/products/IMG-20260530-WA0017.jpg',
      variants: null,
      order: (maxOrders['huiles'] || 0) + 5,
      isActive: true,
    },
  ];

  for (const p of newProducts) {
    const created = await db.product.create({ data: p });
    console.log('✅ Ajouté:', created.title, '(' + created.category + ')');
  }

  // 4. Résumé
  const total = await db.product.count();
  const active = await db.product.count({ where: { isActive: true } });
  const inactive = await db.product.count({ where: { isActive: false } });
  console.log('\n📊 Résumé:');
  console.log('   Total produits:', total);
  console.log('   Actifs:', active);
  console.log('   Inactifs:', inactive);
  console.log('\n✅ Mise à jour terminée !');
}

main()
  .catch(e => console.error('❌ Erreur:', e))
  .finally(() => db.$disconnect());
