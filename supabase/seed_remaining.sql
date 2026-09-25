-- Addresses
INSERT INTO public.addresses (id, label, is_default, recipient, phone, street, locality, city, pincode)
VALUES ('addr-1', 'Home', true, 'Rahul Mohapatra', '+91 98610 54321', 'Flat 402, Mayfair Lagoon Enclave, Near Pal Heights', 'Jayadev Vihar', 'Bhubaneswar', '751013')
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  is_default = EXCLUDED.is_default,
  recipient = EXCLUDED.recipient,
  phone = EXCLUDED.phone,
  street = EXCLUDED.street,
  locality = EXCLUDED.locality,
  city = EXCLUDED.city,
  pincode = EXCLUDED.pincode;
INSERT INTO public.addresses (id, label, is_default, recipient, phone, street, locality, city, pincode)
VALUES ('addr-2', 'Office', false, 'Rahul Mohapatra', '+91 98610 54321', 'Unit 304, Tower B, DLF Cybercity, Infocity', 'Patia', 'Bhubaneswar', '751024')
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  is_default = EXCLUDED.is_default,
  recipient = EXCLUDED.recipient,
  phone = EXCLUDED.phone,
  street = EXCLUDED.street,
  locality = EXCLUDED.locality,
  city = EXCLUDED.city,
  pincode = EXCLUDED.pincode;
INSERT INTO public.addresses (id, label, is_default, recipient, phone, street, locality, city, pincode)
VALUES ('addr-3', 'Parents', false, 'Ashok Mohapatra', '+91 94370 98765', 'Plot B-14, Lane 4, Near Sparsh Hospital', 'Saheed Nagar', 'Bhubaneswar', '751007')
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  is_default = EXCLUDED.is_default,
  recipient = EXCLUDED.recipient,
  phone = EXCLUDED.phone,
  street = EXCLUDED.street,
  locality = EXCLUDED.locality,
  city = EXCLUDED.city,
  pincode = EXCLUDED.pincode;
INSERT INTO public.addresses (id, label, is_default, recipient, phone, street, locality, city, pincode)
VALUES ('addr-4', 'Hospital', false, 'Dr. Rahul Mohapatra', '+91 98610 54321', 'Doctors Hostel & Staff Quarters, Block B-3, IMS & SUM Hospital Campus', 'SUM Hospital', 'Bhubaneswar', '751003')
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  is_default = EXCLUDED.is_default,
  recipient = EXCLUDED.recipient,
  phone = EXCLUDED.phone,
  street = EXCLUDED.street,
  locality = EXCLUDED.locality,
  city = EXCLUDED.city,
  pincode = EXCLUDED.pincode;

-- Notifications
INSERT INTO public.notifications (id, title, message, timestamp, read, order_id, shop_id)
VALUES ('notif-1', 'Order Out for Delivery', 'Your order #LS10245 has been picked up by rider Pradeep Rout from Sharma Grocery Store.', '12 mins ago', false, 'LS10245', NULL)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  message = EXCLUDED.message,
  timestamp = EXCLUDED.timestamp,
  read = EXCLUDED.read,
  order_id = EXCLUDED.order_id,
  shop_id = EXCLUDED.shop_id;
INSERT INTO public.notifications (id, title, message, timestamp, read, order_id, shop_id)
VALUES ('notif-2', 'Order Accepted by Store', 'Sharma Grocery Store has accepted your order and started packing your items.', '28 mins ago', true, 'LS10245', NULL)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  message = EXCLUDED.message,
  timestamp = EXCLUDED.timestamp,
  read = EXCLUDED.read,
  order_id = EXCLUDED.order_id,
  shop_id = EXCLUDED.shop_id;
INSERT INTO public.notifications (id, title, message, timestamp, read, order_id, shop_id)
VALUES ('notif-3', 'Fresh Arrival at Maa Laxmi General Store', 'Your favorite store has added fresh supplies of Daawat Basmati Rice & dry fruits.', '2 hours ago', true, NULL, 'maa-laxmi')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  message = EXCLUDED.message,
  timestamp = EXCLUDED.timestamp,
  read = EXCLUDED.read,
  order_id = EXCLUDED.order_id,
  shop_id = EXCLUDED.shop_id;
INSERT INTO public.notifications (id, title, message, timestamp, read, order_id, shop_id)
VALUES ('notif-4', 'Support Local Weekend Special', 'Enjoy ₹25 off on orders above ₹299 from any neighborhood store today!', '1 day ago', true, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  message = EXCLUDED.message,
  timestamp = EXCLUDED.timestamp,
  read = EXCLUDED.read,
  order_id = EXCLUDED.order_id,
  shop_id = EXCLUDED.shop_id;

-- FAQs
INSERT INTO public.faqs (question, answer, order_index)
VALUES ('How does LocalStore work?', 'LocalStore connects you directly to trusted offline neighborhood shops in your vicinity. When you order, the items are prepared directly by the local merchant you chose, and an assigned delivery partner delivers it directly from that specific store to your doorstep within 25–40 minutes.', 1);
INSERT INTO public.faqs (question, answer, order_index)
VALUES ('Can I order from multiple local shops at once?', 'Yes! You can add products from multiple neighborhood shops into your single cart. Your cart clearly groups items by store. Because distinct stores prepare their goods independently, orders may arrive in separate fast fulfillment packets directly from each respective store.', 2);
INSERT INTO public.faqs (question, answer, order_index)
VALUES ('How are the prices decided?', 'LocalStore guarantees honest local pricing. Shopkeepers list products at their standard offline neighborhood retail prices. You get the exact same trust and value as walking into the store yourself.', 3);
INSERT INTO public.faqs (question, answer, order_index)
VALUES ('What payment methods are supported?', 'We support UPI (Google Pay, PhonePe, Paytm, BHIM), all major Credit/Debit Cards, Net Banking, and Cash on Delivery (COD) for your convenience.', 4);
INSERT INTO public.faqs (question, answer, order_index)
VALUES ('How can I contact my local shop?', 'Once an order is placed, you can view the shop''s direct contact phone number and address on your order tracking page. You can also view merchant information on any Store page.', 5);
INSERT INTO public.faqs (question, answer, order_index)
VALUES ('What if an item is out of stock or needs replacement?', 'Our local shopkeeper will quickly call you to confirm an instant suitable alternative before packaging, ensuring you never receive unwanted surprises.', 6);

-- Search Suggestions
INSERT INTO public.search_suggestions (query, order_index)
VALUES ('SUM Hospital', 1)
ON CONFLICT (query) DO NOTHING;
INSERT INTO public.search_suggestions (query, order_index)
VALUES ('Volini Spray', 2)
ON CONFLICT (query) DO NOTHING;
INSERT INTO public.search_suggestions (query, order_index)
VALUES ('PediaSure', 3)
ON CONFLICT (query) DO NOTHING;
INSERT INTO public.search_suggestions (query, order_index)
VALUES ('Milk', 4)
ON CONFLICT (query) DO NOTHING;
INSERT INTO public.search_suggestions (query, order_index)
VALUES ('Amul Butter', 5)
ON CONFLICT (query) DO NOTHING;
INSERT INTO public.search_suggestions (query, order_index)
VALUES ('Basmati Rice', 6)
ON CONFLICT (query) DO NOTHING;
INSERT INTO public.search_suggestions (query, order_index)
VALUES ('Atta 5kg', 7)
ON CONFLICT (query) DO NOTHING;
INSERT INTO public.search_suggestions (query, order_index)
VALUES ('Dolo 650', 8)
ON CONFLICT (query) DO NOTHING;
INSERT INTO public.search_suggestions (query, order_index)
VALUES ('Bread', 9)
ON CONFLICT (query) DO NOTHING;
INSERT INTO public.search_suggestions (query, order_index)
VALUES ('Sunflower Oil', 10)
ON CONFLICT (query) DO NOTHING;
INSERT INTO public.search_suggestions (query, order_index)
VALUES ('Notebooks', 11)
ON CONFLICT (query) DO NOTHING;
INSERT INTO public.search_suggestions (query, order_index)
VALUES ('Chhena Poda', 12)
ON CONFLICT (query) DO NOTHING;
INSERT INTO public.search_suggestions (query, order_index)
VALUES ('Tomatoes', 13)
ON CONFLICT (query) DO NOTHING;
INSERT INTO public.search_suggestions (query, order_index)
VALUES ('Earphones', 14)
ON CONFLICT (query) DO NOTHING;
INSERT INTO public.search_suggestions (query, order_index)
VALUES ('Apples', 15)
ON CONFLICT (query) DO NOTHING;

-- Orders
INSERT INTO public.orders (id, shop_id, shop_name, items, total, subtotal, delivery_fee, payment_method, status, delivery_address, customer_name, customer_phone)
VALUES (
  'LS10245',
  'sharma-grocery',
  'Sharma Grocery Store',
  '[{"id":"amul-taaza-1l","name":"Amul Taaza Homogenised Toned Milk","quantity":2,"price":62},{"id":"amul-butter-500g","name":"Amul Pasteurised Salted Butter","quantity":1,"price":275}]'::jsonb,
  409,
  399,
  20,
  'UPI (Google Pay)',
  'out_for_delivery',
  '{"label":"Home","street":"Flat 402, Mayfair Lagoon Enclave, Jayadev Vihar","city":"Bhubaneswar","pincode":"751013"}'::jsonb,
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
  delivery_address = EXCLUDED.delivery_address;
INSERT INTO public.orders (id, shop_id, shop_name, items, total, subtotal, delivery_fee, payment_method, status, delivery_address, customer_name, customer_phone)
VALUES (
  'LS10189',
  'fresh-basket',
  'Fresh Basket Organics',
  '[{"id":"shimla-apple-1kg","name":"Crisp Shimla Royal Delicious Apples","quantity":1,"price":179},{"id":"fresh-tomatoes-1kg","name":"Fresh Hybrid Red Tomatoes","quantity":2,"price":38},{"id":"fresh-bananas-dozen","name":"Robusta Golden Bananas","quantity":1,"price":65}]'::jsonb,
  340,
  320,
  25,
  'Credit Card (HDFC)',
  'delivered',
  '{"label":"Home","street":"Flat 402, Mayfair Lagoon Enclave, Jayadev Vihar","city":"Bhubaneswar","pincode":"751013"}'::jsonb,
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
  delivery_address = EXCLUDED.delivery_address;
INSERT INTO public.orders (id, shop_id, shop_name, items, total, subtotal, delivery_fee, payment_method, status, delivery_address, customer_name, customer_phone)
VALUES (
  'LS10072',
  'city-bakery',
  'City Bakery & Confectionery',
  '[{"id":"sandwich-bread-400g","name":"Artisan Whole Milk Sandwich Bread","quantity":2,"price":45},{"id":"choco-truffle-pastry","name":"Belgian Dark Chocolate Truffle Pastry","quantity":1,"price":150}]'::jsonb,
  270,
  240,
  25,
  'Cash on Delivery',
  'delivered',
  '{"label":"Office","street":"Tower B, DLF Cybercity, Patia Infocity","city":"Bhubaneswar","pincode":"751024"}'::jsonb,
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
  delivery_address = EXCLUDED.delivery_address;
