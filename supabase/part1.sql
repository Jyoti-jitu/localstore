-- Seed data for LocalStore

-- Categories
INSERT INTO public.categories (id, name, label, icon, image, description)
VALUES ('grocery', 'Grocery', 'Grocery & Staples', 'ShoppingBag', 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80', 'Daily grains, pulses, spices, oils and household staples')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  label = EXCLUDED.label,
  icon = EXCLUDED.icon,
  image = EXCLUDED.image,
  description = EXCLUDED.description;
INSERT INTO public.categories (id, name, label, icon, image, description)
VALUES ('fruits-veg', 'Fruits & Vegetables', 'Fruits & Veggies', 'Apple', 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=600&q=80', 'Fresh farm produce picked and delivered daily')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  label = EXCLUDED.label,
  icon = EXCLUDED.icon,
  image = EXCLUDED.image,
  description = EXCLUDED.description;
INSERT INTO public.categories (id, name, label, icon, image, description)
VALUES ('bakery', 'Bakery', 'Bakery & Dairy', 'Croissant', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', 'Artisan breads, milk, fresh paneer, cakes and sweet treats')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  label = EXCLUDED.label,
  icon = EXCLUDED.icon,
  image = EXCLUDED.image,
  description = EXCLUDED.description;
INSERT INTO public.categories (id, name, label, icon, image, description)
VALUES ('pharmacy', 'Pharmacy', 'Pharmacy & Care', 'Pill', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80', 'Prescription medicines, wellness, OTC care and first aid')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  label = EXCLUDED.label,
  icon = EXCLUDED.icon,
  image = EXCLUDED.image,
  description = EXCLUDED.description;
INSERT INTO public.categories (id, name, label, icon, image, description)
VALUES ('electronics', 'Electronics', 'Electronics', 'Smartphone', 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80', 'Cables, chargers, audio, batteries and home appliances')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  label = EXCLUDED.label,
  icon = EXCLUDED.icon,
  image = EXCLUDED.image,
  description = EXCLUDED.description;
INSERT INTO public.categories (id, name, label, icon, image, description)
VALUES ('fashion', 'Fashion', 'Fashion & Apparel', 'Shirt', 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80', 'Local apparel, handloom weaves, cotton casuals and accessories')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  label = EXCLUDED.label,
  icon = EXCLUDED.icon,
  image = EXCLUDED.image,
  description = EXCLUDED.description;
INSERT INTO public.categories (id, name, label, icon, image, description)
VALUES ('stationery', 'Stationery', 'Stationery & Books', 'BookOpen', 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&w=600&q=80', 'School supplies, notebooks, stationery sets and office essentials')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  label = EXCLUDED.label,
  icon = EXCLUDED.icon,
  image = EXCLUDED.image,
  description = EXCLUDED.description;
INSERT INTO public.categories (id, name, label, icon, image, description)
VALUES ('household', 'Household', 'Home Essentials', 'Home', 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80', 'Cleaning liquids, kitchen utensils, storage and bathroom supplies')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  label = EXCLUDED.label,
  icon = EXCLUDED.icon,
  image = EXCLUDED.image,
  description = EXCLUDED.description;
INSERT INTO public.categories (id, name, label, icon, image, description)
VALUES ('beauty', 'Beauty', 'Beauty & Grooming', 'Sparkles', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80', 'Haircare, skincare, natural soaps and personal grooming')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  label = EXCLUDED.label,
  icon = EXCLUDED.icon,
  image = EXCLUDED.image,
  description = EXCLUDED.description;
INSERT INTO public.categories (id, name, label, icon, image, description)
VALUES ('hardware', 'Hardware', 'Hardware & Tools', 'Wrench', 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=600&q=80', 'Electrical switches, bulbs, repair tapes, glues and basic tools')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  label = EXCLUDED.label,
  icon = EXCLUDED.icon,
  image = EXCLUDED.image,
  description = EXCLUDED.description;
INSERT INTO public.categories (id, name, label, icon, image, description)
VALUES ('restaurants', 'Restaurants', 'Sweets & Snacks', 'Utensils', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80', 'Traditional Odia sweets, fresh hot chaat, samosas and tea')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  label = EXCLUDED.label,
  icon = EXCLUDED.icon,
  image = EXCLUDED.image,
  description = EXCLUDED.description;
INSERT INTO public.categories (id, name, label, icon, image, description)
VALUES ('other', 'Other', 'Local Specialty', 'Store', 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80', 'Pet supplies, gardening seeds, puja samagri and unique local finds')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  label = EXCLUDED.label,
  icon = EXCLUDED.icon,
  image = EXCLUDED.image,
  description = EXCLUDED.description;

-- Localities
INSERT INTO public.localities (id, name, landmark, distance_text)
VALUES ('jayadev-vihar', 'Jayadev Vihar', 'Near Pal Heights', 'Current location')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  landmark = EXCLUDED.landmark,
  distance_text = EXCLUDED.distance_text;
INSERT INTO public.localities (id, name, landmark, distance_text)
VALUES ('sum-hospital', 'SUM Hospital', 'Kalinga Nagar / Ghatikia', '3.8 km away')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  landmark = EXCLUDED.landmark,
  distance_text = EXCLUDED.distance_text;
INSERT INTO public.localities (id, name, landmark, distance_text)
VALUES ('patia', 'Patia', 'Near KIIT Square', '4.2 km away')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  landmark = EXCLUDED.landmark,
  distance_text = EXCLUDED.distance_text;
INSERT INTO public.localities (id, name, landmark, distance_text)
VALUES ('saheed-nagar', 'Saheed Nagar', 'Near Sparsh Hospital', '2.8 km away')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  landmark = EXCLUDED.landmark,
  distance_text = EXCLUDED.distance_text;
INSERT INTO public.localities (id, name, landmark, distance_text)
VALUES ('khandagiri', 'Khandagiri', 'Near Udayagiri Caves', '5.1 km away')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  landmark = EXCLUDED.landmark,
  distance_text = EXCLUDED.distance_text;
INSERT INTO public.localities (id, name, landmark, distance_text)
VALUES ('chandrasekharpur', 'Chandrasekharpur', 'Near Damana Square', '3.5 km away')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  landmark = EXCLUDED.landmark,
  distance_text = EXCLUDED.distance_text;
INSERT INTO public.localities (id, name, landmark, distance_text)
VALUES ('master-canteen', 'Master Canteen', 'Railway Station Road', '3.9 km away')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  landmark = EXCLUDED.landmark,
  distance_text = EXCLUDED.distance_text;
INSERT INTO public.localities (id, name, landmark, distance_text)
VALUES ('nayapalli', 'Nayapalli', 'Near IRC Village', '1.6 km away')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  landmark = EXCLUDED.landmark,
  distance_text = EXCLUDED.distance_text;
INSERT INTO public.localities (id, name, landmark, distance_text)
VALUES ('old-town', 'Old Town', 'Near Lingaraj Temple', '6.8 km away')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  landmark = EXCLUDED.landmark,
  distance_text = EXCLUDED.distance_text;

