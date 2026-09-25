import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { CATEGORIES, LOCALITIES, SHOPS, PRODUCTS } from '../src/data/mockData.js';

// Read .env.local manually to avoid external dependencies
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf-8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...values] = trimmed.split('=');
    env[key.trim()] = values.join('=').trim().replace(/^["']|["']$/g, '');
  }
  return env;
}

const env = { ...loadEnv(), ...process.env };
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || 'https://rchkrkbuuwxhplfqhhao.supabase.co';
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error('\n❌ Missing Supabase key! Please set NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local before running the seed script.\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log(`\nConnecting to Supabase at: ${supabaseUrl}`);

  // 1. Seed Categories
  console.log('Seeding categories...');
  const categoryRows = CATEGORIES.map((c) => ({
    id: c.id,
    name: c.name,
    label: c.label,
    icon: c.icon,
    image: c.image,
    description: c.description
  }));
  const { error: catErr } = await supabase.from('categories').upsert(categoryRows);
  if (catErr) console.error('Error seeding categories:', catErr.message);
  else console.log(`✓ ${categoryRows.length} categories seeded.`);

  // 2. Seed Localities
  console.log('Seeding localities...');
  const localityRows = LOCALITIES.map((l) => ({
    id: l.id,
    name: l.name,
    landmark: l.landmark,
    distance_text: l.distanceText
  }));
  const { error: locErr } = await supabase.from('localities').upsert(localityRows);
  if (locErr) console.error('Error seeding localities:', locErr.message);
  else console.log(`✓ ${localityRows.length} localities seeded.`);

  // 3. Seed Shops
  console.log('Seeding shops...');
  const shopRows = SHOPS.map((s) => ({
    id: s.id,
    name: s.name,
    category: s.category.toLowerCase(),
    category_label: s.categoryLabel,
    rating: s.rating,
    review_count: s.reviewCount,
    distance_km: s.distanceKm,
    distance_text: s.distanceText,
    locality: s.locality,
    address: s.address,
    delivery_time: s.deliveryTime,
    delivery_fee: s.deliveryFee,
    is_open: s.isOpen,
    opening_hours: s.openingHours,
    closes_at: s.closesAt,
    product_count: s.productCount,
    min_order: s.minOrder,
    featured: s.featured,
    image: s.image,
    cover_image: s.coverImage,
    avatar: s.avatar,
    description: s.description,
    owner_name: s.ownerName,
    phone: s.phone,
    tags: s.tags || [],
    catalog_categories: s.catalogCategories || []
  }));
  const { error: shopErr } = await supabase.from('shops').upsert(shopRows);
  if (shopErr) console.error('Error seeding shops:', shopErr.message);
  else console.log(`✓ ${shopRows.length} shops seeded.`);

  // 4. Seed Products
  console.log('Seeding products...');
  const productRows = PRODUCTS.map((p) => ({
    id: p.id,
    shop_id: p.shopId,
    name: p.name,
    brand: p.brand,
    quantity: p.quantity,
    price: p.price,
    original_price: p.originalPrice,
    discount_percent: p.discountPercent || 0,
    category: p.category,
    store_category: p.storeCategory,
    in_stock: p.inStock,
    rating: p.rating,
    reviews_count: p.reviewsCount,
    popular: p.popular || false,
    image: p.image,
    description: p.description,
    information: p.information || {}
  }));
  const { error: prodErr } = await supabase.from('products').upsert(productRows);
  if (prodErr) console.error('Error seeding products:', prodErr.message);
  else console.log(`✓ ${productRows.length} products seeded.`);

  console.log('\n✨ Database seeding completed!\n');
}

seed().catch((err) => {
  console.error('Fatal error seeding database:', err);
  process.exit(1);
});
