// Script de diagnostic pour vérifier les produits sur le VPS
const { PrismaClient } = require('./node_modules/.prisma/client');
const db = new PrismaClient();
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('🔍 DIAGNOSTIC SERVEUR DE PRODUCTION\n');
  console.log('=' .repeat(50));

  // 1. Vérifier la DB
  const dbPath = path.join(process.cwd(), 'db', 'custom.db');
  console.log('\n📁 Base de données:');
  console.log('   Chemin:', dbPath);
  console.log('   Existe:', fs.existsSync(dbPath));
  if (fs.existsSync(dbPath)) {
    const stat = fs.statSync(dbPath);
    console.log('   Taille:', stat.size, 'octets');
    console.log('   Modifiée:', stat.mtime.toISOString());
  }

  // 2. Compter les produits
  const total = await db.product.count();
  const active = await db.product.count({ where: { isActive: true } });
  const inactive = await db.product.count({ where: { isActive: false } });
  console.log('\n📊 Produits:');
  console.log('   Total:', total);
  console.log('   Actifs:', active);
  console.log('   Inactifs:', inactive);

  // 3. Lister tous les produits actifs
  const products = await db.product.findMany({ where: { isActive: true }, orderBy: [{ category: 'asc' }, { order: 'asc' }] });
  console.log('\n📦 Produits actifs:');
  products.forEach((p, i) => {
    const isNew = p.imageUrl && p.imageUrl.includes('IMG-20260530');
    const marker = isNew ? ' ⭐ NOUVEAU' : '';
    console.log(`   ${i+1}. [${p.category}] ${p.title}${marker}`);
    console.log(`      Image: ${p.imageUrl}`);
  });

  // 4. Vérifier les images des nouveaux produits
  console.log('\n🖼️  Vérification des images:');
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');
  console.log('   Répertoire:', uploadDir);
  console.log('   Existe:', fs.existsSync(uploadDir));
  if (fs.existsSync(uploadDir)) {
    const files = fs.readdirSync(uploadDir).filter(f => f.startsWith('IMG-20260530'));
    console.log('   Images trouvées:', files.length);
    files.forEach(f => console.log('   -', f));
  } else {
    console.log('   ❌ Répertoire uploads/products MANQUANT !');
  }

  // 5. Vérifier standalone
  const standaloneDb = path.join(process.cwd(), '.next', 'standalone', 'db', 'custom.db');
  const standaloneUploads = path.join(process.cwd(), '.next', 'standalone', 'public', 'uploads', 'products');
  console.log('\n🖥️  Standalone:');
  console.log('   DB standalone existe:', fs.existsSync(standaloneDb));
  console.log('   Uploads standalone existe:', fs.existsSync(standaloneUploads));
  if (fs.existsSync(standaloneUploads)) {
    const files = fs.readdirSync(standaloneUploads).filter(f => f.startsWith('IMG-20260530'));
    console.log('   Images standalone:', files.length);
  }

  // 6. Vérifier la DB standalone vs source
  if (fs.existsSync(standaloneDb) && fs.existsSync(dbPath)) {
    const dbStat = fs.statSync(dbPath);
    const standaloneStat = fs.statSync(standaloneDb);
    console.log('   DB source taille:', dbStat.size);
    console.log('   DB standalone taille:', standaloneStat.size);
    console.log('   Synchronisées:', dbStat.size === standaloneStat.size ? '✅ OUI' : '❌ NON - IL FAUT RECOPIER !');
  }

  console.log('\n' + '=' .repeat(50));
}

main().catch(e => console.error(e)).finally(() => db.$disconnect());
