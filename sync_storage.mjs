import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = 'https://rchkrkbuuwxhplfqhhao.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjaGtya2J1dXd4aHBsZnFoaGFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMjkwNzYsImV4cCI6MjEwNTkwNTA3Nn0.G9X1j4WPiz5iVbPKZuXpWogA24snNR8JDNL2rJjAF7w';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const BUCKET = 'localstore-assets';

function getPublicUrl(storagePath) {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${storagePath}`;
}

async function uploadBuffer(storagePath, buffer, contentType = 'image/jpeg') {
  const { data, error } = await supabase.storage.from(BUCKET).upload(storagePath, buffer, {
    contentType,
    upsert: true,
  });
  if (error) {
    console.error(`Failed to upload ${storagePath}:`, error.message);
    return null;
  }
  return getPublicUrl(storagePath);
}

async function uploadLocalFile(storagePath, localFilePath, contentType = 'image/png') {
  try {
    if (!fs.existsSync(localFilePath)) {
      console.warn(`Local file not found: ${localFilePath}`);
      return null;
    }
    const buffer = fs.readFileSync(localFilePath);
    return await uploadBuffer(storagePath, buffer, contentType);
  } catch (err) {
    console.error(`Error reading ${localFilePath}:`, err.message);
    return null;
  }
}

async function downloadAndUploadUrl(storagePath, url, defaultContentType = 'image/jpeg') {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = res.headers.get('content-type') || defaultContentType;
    return await uploadBuffer(storagePath, buffer, contentType);
  } catch (err) {
    console.error(`Failed to download & upload ${url} -> ${storagePath}:`, err.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting Supabase Storage Asset Sync...');

  // 1. Upload Local Brand Assets
  console.log('\n--- Uploading Local Brand Assets ---');
  const localDir = path.resolve('public');
  const brandAssets = [
    { src: path.join(localDir, 'brand-logo.png'), dest: 'brand/brand-logo.png', type: 'image/png' },
    { src: path.join(localDir, 'brand-icon.png'), dest: 'brand/brand-icon.png', type: 'image/png' },
    { src: path.join(localDir, 'hero-banner-full.webp'), dest: 'brand/hero-banner-full.webp', type: 'image/webp' },
    { src: path.join(localDir, 'hero-mobile-illustration.webp'), dest: 'brand/hero-mobile-illustration.webp', type: 'image/webp' },
  ];

  for (const asset of brandAssets) {
    const url = await uploadLocalFile(asset.dest, asset.src, asset.type);
    if (url) console.log(`✓ Uploaded ${asset.dest}`);
  }

  // 2. Upload Category Circle Icons
  console.log('\n--- Uploading Category Circle Icons ---');
  const catIconMap = {
    'grocery': 'grocery-circle.png',
    'fruits-veg': 'fruits-veg-circle.png',
    'bakery': 'bakery-circle.png',
    'pharmacy': 'pharmacy-circle.png',
    'electronics': 'electronics-circle.png',
    'fashion': 'fashion-circle.png',
  };

  for (const [catId, fileName] of Object.entries(catIconMap)) {
    const filePath = path.join(localDir, 'categories', fileName);
    const dest = `categories/${fileName}`;
    const url = await uploadLocalFile(dest, filePath, 'image/png');
    if (url) console.log(`✓ Uploaded category icon: ${dest}`);
  }

  // 3. Process Categories in Database
  console.log('\n--- Syncing Categories ---');
  const { data: categories, error: catErr } = await supabase.from('categories').select('*');
  if (catErr) {
    console.error('Error fetching categories:', catErr);
  } else {
    for (const cat of categories) {
      let newImage = cat.image;
      if (cat.image && !cat.image.includes(SUPABASE_URL)) {
        const dest = `categories/${cat.id}.jpg`;
        const uploaded = await downloadAndUploadUrl(dest, cat.image);
        if (uploaded) newImage = uploaded;
      }

      // Check if circle icon exists for this category
      let newIcon = cat.icon;
      if (catIconMap[cat.id]) {
        newIcon = getPublicUrl(`categories/${catIconMap[cat.id]}`);
      }

      await supabase
        .from('categories')
        .update({ image: newImage, icon: newIcon })
        .eq('id', cat.id);
      console.log(`✓ Updated category ${cat.id} -> image: ${newImage}`);
    }
  }

  // 4. Process Shops in Database
  console.log('\n--- Syncing Shops ---');
  const { data: shops, error: shopErr } = await supabase.from('shops').select('*');
  if (shopErr) {
    console.error('Error fetching shops:', shopErr);
  } else {
    for (const shop of shops) {
      let newImage = shop.image;
      let newCover = shop.cover_image;

      if (shop.image && !shop.image.includes(SUPABASE_URL)) {
        const dest = `shops/${shop.id}.jpg`;
        const uploaded = await downloadAndUploadUrl(dest, shop.image);
        if (uploaded) newImage = uploaded;
      }

      if (shop.cover_image && !shop.cover_image.includes(SUPABASE_URL)) {
        const dest = `shops/${shop.id}-cover.jpg`;
        const uploaded = await downloadAndUploadUrl(dest, shop.cover_image);
        if (uploaded) newCover = uploaded;
      }

      await supabase
        .from('shops')
        .update({ image: newImage, cover_image: newCover })
        .eq('id', shop.id);
      console.log(`✓ Updated shop ${shop.id} -> image: ${newImage}`);
    }
  }

  // 5. Process Products in Database
  console.log('\n--- Syncing Products ---');
  const { data: products, error: prodErr } = await supabase.from('products').select('*');
  if (prodErr) {
    console.error('Error fetching products:', prodErr);
  } else {
    for (const prod of products) {
      let newImage = prod.image;
      if (prod.image && !prod.image.includes(SUPABASE_URL)) {
        const dest = `products/${prod.id}.jpg`;
        const uploaded = await downloadAndUploadUrl(dest, prod.image);
        if (uploaded) newImage = uploaded;
      }

      await supabase
        .from('products')
        .update({ image: newImage })
        .eq('id', prod.id);
      console.log(`✓ Updated product ${prod.id} -> image: ${newImage}`);
    }
  }

  console.log('\n🎉 Storage Sync Completed Successfully!');
}

main().catch(console.error);
