import fs from 'fs';
import { SAVED_ADDRESSES, MOCK_NOTIFICATIONS, FAQ_ITEMS, SEARCH_SUGGESTIONS, MOCK_ORDERS } from '../src/data/mockData.js';

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

function escapeJson(obj) {
  if (!obj) return `'{}'::jsonb`;
  return `'${JSON.stringify(obj).replace(/'/g, "''")}'::jsonb`;
}

let sql = '';

// 1. Addresses
sql += '-- Addresses\n';
for (const a of SAVED_ADDRESSES) {
  sql += `INSERT INTO public.addresses (id, label, is_default, recipient, phone, street, locality, city, pincode)
VALUES (${escapeSql(a.id)}, ${escapeSql(a.label)}, ${Boolean(a.isDefault)}, ${escapeSql(a.recipient)}, ${escapeSql(a.phone)}, ${escapeSql(a.street)}, ${escapeSql(a.locality)}, ${escapeSql(a.city)}, ${escapeSql(a.pincode)})
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  is_default = EXCLUDED.is_default,
  recipient = EXCLUDED.recipient,
  phone = EXCLUDED.phone,
  street = EXCLUDED.street,
  locality = EXCLUDED.locality,
  city = EXCLUDED.city,
  pincode = EXCLUDED.pincode;\n`;
}

// 2. Notifications
sql += '\n-- Notifications\n';
for (const n of MOCK_NOTIFICATIONS) {
  sql += `INSERT INTO public.notifications (id, title, message, timestamp, read, order_id, shop_id)
VALUES (${escapeSql(n.id)}, ${escapeSql(n.title)}, ${escapeSql(n.message)}, ${escapeSql(n.timestamp)}, ${Boolean(n.read)}, ${escapeSql(n.orderId)}, ${escapeSql(n.shopId)})
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  message = EXCLUDED.message,
  timestamp = EXCLUDED.timestamp,
  read = EXCLUDED.read,
  order_id = EXCLUDED.order_id,
  shop_id = EXCLUDED.shop_id;\n`;
}

// 3. FAQs
sql += '\n-- FAQs\n';
FAQ_ITEMS.forEach((f, idx) => {
  sql += `INSERT INTO public.faqs (question, answer, order_index)
VALUES (${escapeSql(f.question)}, ${escapeSql(f.answer)}, ${idx + 1});\n`;
});

// 4. Search Suggestions
sql += '\n-- Search Suggestions\n';
SEARCH_SUGGESTIONS.forEach((s, idx) => {
  sql += `INSERT INTO public.search_suggestions (query, order_index)
VALUES (${escapeSql(s)}, ${idx + 1})
ON CONFLICT (query) DO NOTHING;\n`;
});

// 5. Orders
sql += '\n-- Orders\n';
for (const o of MOCK_ORDERS) {
  sql += `INSERT INTO public.orders (id, shop_id, shop_name, items, total, subtotal, delivery_fee, payment_method, status, delivery_address, customer_name, customer_phone)
VALUES (
  ${escapeSql(o.orderId)},
  ${escapeSql(o.shopId)},
  ${escapeSql(o.shopName)},
  ${escapeJson(o.items)},
  ${o.total},
  ${o.itemsTotal || o.subtotal || o.total},
  ${o.deliveryFee || 0},
  ${escapeSql(o.paymentMethod)},
  ${escapeSql(o.status)},
  ${escapeJson(o.deliveryAddress)},
  'Rahul Mohapatra',
  '+91 98610 54321'
)
ON CONFLICT (id) DO UPDATE SET
  shop_id = EXCLUDED.shop_id,
  shop_name = EXCLUDED.shop_name,
  items = EXCLUDED.items,
  total = EXCLUDED.total,
  subtotal = EXCLUDED.subtotal,
  delivery_fee = EXCLUDED.delivery_fee,
  payment_method = EXCLUDED.payment_method,
  status = EXCLUDED.status,
  delivery_address = EXCLUDED.delivery_address;\n`;
}

fs.writeFileSync('supabase/seed_remaining.sql', sql);
console.log('Successfully generated supabase/seed_remaining.sql');
