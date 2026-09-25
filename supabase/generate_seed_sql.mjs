import fs from 'fs';
import { CATEGORIES, LOCALITIES, SHOPS, PRODUCTS } from '../src/data/mockData.js';

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

function escapeJson(obj) {
  if (!obj) return `'{}'::jsonb`;
  return `'${JSON.stringify(obj).replace(/'/g, "''")}'::jsonb`;
}

function escapeArray(arr) {
  if (!arr || !Array.isArray(arr) || arr.length === 0) return `'{}'::text[]`;
  const items = arr.map(item => `"${String(item).replace(/"/g, '\\"')}"`).join(',');
  return `'${"{" + items + "}"}'::text[]`;
}

let sql = `-- Seed data for LocalStore\n\n`;

// 1. Categories
sql += `-- Categories\n`;
for (const c of CATEGORIES) {
  sql += `INSERT INTO public.categories (id, name, label, icon, image, description)
VALUES (${escapeSql(c.id)}, ${escapeSql(c.name)}, ${escapeSql(c.label)}, ${escapeSql(c.icon)}, ${escapeSql(c.image)}, ${escapeSql(c.description)})
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  label = EXCLUDED.label,
  icon = EXCLUDED.icon,
  image = EXCLUDED.image,
  description = EXCLUDED.description;\n`;
}

// 2. Localities
sql += `\n-- Localities\n`;
for (const l of LOCALITIES) {
  sql += `INSERT INTO public.localities (id, name, landmark, distance_text)
VALUES (${escapeSql(l.id)}, ${escapeSql(l.name)}, ${escapeSql(l.landmark)}, ${escapeSql(l.distanceText)})
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  landmark = EXCLUDED.landmark,
  distance_text = EXCLUDED.distance_text;\n`;
}

// 3. Shops
sql += `\n-- Shops\n`;
for (const s of SHOPS) {
  sql += `INSERT INTO public.shops (
  id, name, category, category_label, rating, review_count, distance_km, distance_text,
  locality, address, delivery_time, delivery_fee, is_open, opening_hours, closes_at,
  product_count, min_order, featured, image, cover_image, avatar, description,
  owner_name, phone, tags, catalog_categories
) VALUES (
  ${escapeSql(s.id)},
  ${escapeSql(s.name)},
  ${escapeSql(s.category.toLowerCase())},
  ${escapeSql(s.categoryLabel)},
  ${s.rating || 0},
  ${s.reviewCount || 0},
  ${s.distanceKm || 0},
  ${escapeSql(s.distanceText)},
  ${escapeSql(s.locality)},
  ${escapeSql(s.address)},
  ${escapeSql(s.deliveryTime)},
  ${s.deliveryFee || 0},
  ${Boolean(s.isOpen)},
  ${escapeSql(s.openingHours)},
  ${escapeSql(s.closesAt)},
  ${s.productCount || 0},
  ${s.minOrder || 0},
  ${Boolean(s.featured)},
  ${escapeSql(s.image)},
  ${escapeSql(s.coverImage)},
  ${escapeSql(s.avatar)},
  ${escapeSql(s.description)},
  ${escapeSql(s.ownerName)},
  ${escapeSql(s.phone)},
  ${escapeArray(s.tags)},
  ${escapeArray(s.catalogCategories)}
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  distance_km = EXCLUDED.distance_km,
  distance_text = EXCLUDED.distance_text,
  locality = EXCLUDED.locality,
  address = EXCLUDED.address,
  delivery_time = EXCLUDED.delivery_time,
  delivery_fee = EXCLUDED.delivery_fee,
  is_open = EXCLUDED.is_open,
  opening_hours = EXCLUDED.opening_hours,
  closes_at = EXCLUDED.closes_at,
  product_count = EXCLUDED.product_count,
  min_order = EXCLUDED.min_order,
  featured = EXCLUDED.featured,
  image = EXCLUDED.image,
  cover_image = EXCLUDED.cover_image,
  avatar = EXCLUDED.avatar,
  description = EXCLUDED.description,
  owner_name = EXCLUDED.owner_name,
  phone = EXCLUDED.phone,
  tags = EXCLUDED.tags,
  catalog_categories = EXCLUDED.catalog_categories;\n`;
}

// 4. Products
sql += `\n-- Products\n`;
for (const p of PRODUCTS) {
  sql += `INSERT INTO public.products (
  id, shop_id, name, brand, quantity, price, original_price, discount_percent,
  category, store_category, in_stock, rating, reviews_count, popular, image,
  description, information
) VALUES (
  ${escapeSql(p.id)},
  ${escapeSql(p.shopId)},
  ${escapeSql(p.name)},
  ${escapeSql(p.brand)},
  ${escapeSql(p.quantity)},
  ${p.price || 0},
  ${p.originalPrice || p.price || 0},
  ${p.discountPercent || 0},
  ${escapeSql(p.category.toLowerCase())},
  ${escapeSql(p.storeCategory)},
  ${Boolean(p.inStock)},
  ${p.rating || 0},
  ${p.reviewsCount || 0},
  ${Boolean(p.popular)},
  ${escapeSql(p.image)},
  ${escapeSql(p.description)},
  ${escapeJson(p.information)}
)
ON CONFLICT (id) DO UPDATE SET
  shop_id = EXCLUDED.shop_id,
  name = EXCLUDED.name,
  brand = EXCLUDED.brand,
  quantity = EXCLUDED.quantity,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  discount_percent = EXCLUDED.discount_percent,
  category = EXCLUDED.category,
  store_category = EXCLUDED.store_category,
  in_stock = EXCLUDED.in_stock,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  popular = EXCLUDED.popular,
  image = EXCLUDED.image,
  description = EXCLUDED.description,
  information = EXCLUDED.information;\n`;
}

fs.writeFileSync('supabase/seed.sql', sql);
console.log('Successfully generated supabase/seed.sql');
