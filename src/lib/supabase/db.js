import { createClient } from './client.js';
import { broadcastLocalChange } from './realtime.js';

export const DEFAULT_CATEGORIES = [
  {
    id: "bakery",
    name: "Bakery",
    label: "Bakery & Dairy",
    icon: "Croissant",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    description: "Artisan breads, fresh pastries, dairy, cakes, cookies & local sweets"
  },
  {
    id: "beauty",
    name: "Beauty",
    label: "Beauty & Grooming",
    icon: "Sparkles",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    description: "Personal grooming, skincare serums, salon cosmetics & fragrant soaps"
  },
  {
    id: "electronics",
    name: "Electronics",
    label: "Electronics & Tech",
    icon: "Smartphone",
    image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80",
    description: "Chargers, cables, audio headphones, power adapters & smart gadgets"
  },
  {
    id: "fashion",
    name: "Fashion",
    label: "Fashion & Apparel",
    icon: "Shirt",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80",
    description: "Ethnic handloom weaves, cotton casuals, footwear & fashion accessories"
  },
  {
    id: "fruits-veg",
    name: "Fruits & Vegetables",
    label: "Fruits & Veggies",
    icon: "Apple",
    image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80",
    description: "Farm-fresh greens, seasonal crisp fruits & local morning harvest"
  },
  {
    id: "grocery",
    name: "Grocery",
    label: "Grocery & Staples",
    icon: "ShoppingBag",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
    description: "Daily grains, premium pulses, edible oils, spices & packed pantry items"
  },
  {
    id: "hardware",
    name: "Hardware",
    label: "Hardware & Tools",
    icon: "Wrench",
    image: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=800&q=80",
    description: "Electrical switches, repair tools, LED bulbs, plumbing & fittings"
  },
  {
    id: "household",
    name: "Household",
    label: "Home Essentials",
    icon: "Home",
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=800&q=80",
    description: "Kitchenware, cleaning supplies, organizers & home upkeep essentials"
  },
  {
    id: "other",
    name: "Other",
    label: "Local Specialty",
    icon: "Store",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80",
    description: "Pet supplies, gardening seeds, traditional puja samagri & specialty shops"
  },
  {
    id: "pharmacy",
    name: "Pharmacy",
    label: "Pharmacy & Care",
    icon: "Pill",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
    description: "Prescription medications, first aid, OTC relief, supplements & wellness"
  },
  {
    id: "restaurants",
    name: "Restaurants",
    label: "Sweets & Snacks",
    icon: "Utensils",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    description: "Traditional Odia sweets, hot samosas, chaat, evening bites & fresh snacks"
  },
  {
    id: "stationery",
    name: "Stationery",
    label: "Stationery & Books",
    icon: "BookOpen",
    image: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&w=800&q=80",
    description: "School supplies, notebooks, pens, fine art stationery & office materials"
  }
];

// ==========================================
// CATEGORIES
// ==========================================
export async function getCategories() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (error || !data || data.length === 0) {
      return DEFAULT_CATEGORIES;
    }
    // Return database categories with Supabase storage images & icons
    return data.map((cat) => {
      const defCat = DEFAULT_CATEGORIES.find((d) => d.id === cat.id || d.name?.toLowerCase() === cat.name?.toLowerCase()) || {};
      return {
        ...defCat,
        ...cat,
        image: cat.image || defCat.image,
        icon: cat.icon || defCat.icon || 'ShoppingBag',
      };
    });
  } catch (err) {
    console.error('Error fetching categories from Supabase, using defaults:', err?.message || err);
    return DEFAULT_CATEGORIES;
  }
}

// ==========================================
// LOCALITIES
// ==========================================
export async function getLocalities() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('localities').select('*').order('name');
    if (error) throw error;
    return (data || []).map((l) => ({
      id: l.id,
      name: l.name,
      landmark: l.landmark,
      distanceText: l.distance_text,
      latitude: l.latitude != null ? Number(l.latitude) : null,
      longitude: l.longitude != null ? Number(l.longitude) : null
    }));
  } catch (err) {
    console.error('Error fetching localities from Supabase:', err?.message || err);
    return [];
  }
}

// ==========================================
// SHOPS
// ==========================================
export async function getShops({ category, featured } = {}) {
  try {
    const supabase = createClient();
    let query = supabase.from('shops').select('*').order('rating', { ascending: false });
    if (category && category !== 'all') {
      query = query.ilike('category', `%${category}%`);
    }
    if (featured !== undefined) {
      query = query.eq('featured', featured);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(mapShopFromDb);
  } catch (err) {
    console.error('Error fetching shops from Supabase:', err?.message || err);
    return [];
  }
}

export async function getShopById(shopId) {
  if (!shopId) return null;
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('id', shopId)
      .maybeSingle();

    if (error || !data) return null;
    return mapShopFromDb(data);
  } catch (err) {
    console.error(`Error fetching shop ${shopId} from Supabase:`, err?.message || err);
    return null;
  }
}

export async function createShop(shopPayload) {
  try {
    const supabase = createClient();
    const row = {
      id: shopPayload.id || `shop-${Date.now()}`,
      name: shopPayload.name || shopPayload.businessName,
      category: shopPayload.category || 'General Store & Retail',
      category_label: shopPayload.categoryLabel || shopPayload.category || 'General Store',
      rating: Number(shopPayload.rating || 5.0),
      review_count: shopPayload.reviewCount || 1,
      distance_km: Number(shopPayload.distanceKm || 0.8),
      distance_text: shopPayload.distanceText || '0.8 km away',
      locality: shopPayload.locality || shopPayload.city || 'Bhubaneswar',
      address: shopPayload.address || 'Bhubaneswar, Odisha',
      delivery_time: shopPayload.deliveryTime || '20–30 mins',
      delivery_fee: Number(shopPayload.deliveryFee || 0),
      is_open: shopPayload.isOpen !== undefined ? Boolean(shopPayload.isOpen) : true,
      opening_hours: shopPayload.openingHours || `${shopPayload.openingTime || '09:00 AM'} - ${shopPayload.closingTime || '09:00 PM'}`,
      closes_at: shopPayload.closesAt || shopPayload.closingTime || '09:00 PM',
      product_count: Number(shopPayload.productCount || 0),
      min_order: Number(shopPayload.minOrder || 0),
      featured: Boolean(shopPayload.featured),
      image: shopPayload.image || shopPayload.logo || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=400&q=80',
      cover_image: shopPayload.coverImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
      avatar: shopPayload.avatar || shopPayload.logo || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=400&q=80',
      description: shopPayload.description || '',
      owner_name: shopPayload.ownerName || '',
      owner_email: shopPayload.ownerEmail || shopPayload.email || '',
      phone: shopPayload.phone || '',
      user_id: shopPayload.userId || null,
      tags: shopPayload.tags || ['Verified Local Shop', 'Instant Delivery'],
      catalog_categories: shopPayload.catalogCategories || [shopPayload.category || 'General Store']
    };

    const { data, error } = await supabase.from('shops').upsert([row], { onConflict: 'id' }).select().single();
    if (error) throw error;
    return { success: true, shop: mapShopFromDb(data) };
  } catch (err) {
    console.error('Error creating shop in Supabase:', err?.message || err);
    return { success: false, error: err?.message || err, shop: shopPayload };
  }
}

export async function updateShop(shopId, updates) {
  try {
    const supabase = createClient();
    const row = {};
    if (updates.name || updates.businessName) row.name = updates.name || updates.businessName;
    if (updates.category) row.category = updates.category;
    if (updates.categoryLabel) row.category_label = updates.categoryLabel;
    if (updates.description) row.description = updates.description;
    if (updates.phone) row.phone = updates.phone;
    if (updates.address) row.address = updates.address;
    if (updates.locality) row.locality = updates.locality;
    if (updates.logo || updates.image) {
      row.image = updates.logo || updates.image;
      row.avatar = updates.logo || updates.image;
    }
    if (updates.coverImage) row.cover_image = updates.coverImage;
    if (updates.openingHours) row.opening_hours = updates.openingHours;
    if (updates.openingTime && updates.closingTime) {
      row.opening_hours = `${updates.openingTime} - ${updates.closingTime}`;
      row.closes_at = updates.closingTime;
    }
    if (updates.isOpen !== undefined) row.is_open = Boolean(updates.isOpen);

    const { data, error } = await supabase
      .from('shops')
      .update(row)
      .eq('id', shopId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, shop: mapShopFromDb(data) };
  } catch (err) {
    console.error(`Error updating shop ${shopId}:`, err?.message || err);
    return { success: false, error: err?.message || err };
  }
}

// ==========================================
// PRODUCTS
// ==========================================
export async function getProducts({ shopId, category, popular, search } = {}) {
  try {
    const supabase = createClient();
    let query = supabase.from('products').select('*').order('created_at', { ascending: false });
    if (shopId) query = query.eq('shop_id', shopId);
    if (category && category !== 'all') {
      query = query.ilike('category', `%${category.toLowerCase()}%`);
    }
    if (popular !== undefined) query = query.eq('popular', popular);
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(mapProductFromDb);
  } catch (err) {
    console.error('Error fetching products from Supabase:', err?.message || err);
    return [];
  }
}

export async function getProductById(productId) {
  if (!productId) return null;
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .maybeSingle();

    if (error || !data) return null;
    return mapProductFromDb(data);
  } catch (err) {
    console.error(`Error fetching product ${productId} from Supabase:`, err?.message || err);
    return null;
  }
}

export async function createProduct(prodPayload) {
  try {
    const supabase = createClient();
    const row = {
      id: prodPayload.id || `prod-${Date.now()}`,
      shop_id: prodPayload.shopId || prodPayload.shop_id,
      name: prodPayload.name,
      brand: prodPayload.brand || '',
      quantity: prodPayload.quantity || '1 unit',
      price: Number(prodPayload.price),
      original_price: Number(prodPayload.originalPrice || prodPayload.price),
      discount_percent: Number(prodPayload.discountPercent || 0),
      category: prodPayload.category || 'General',
      store_category: prodPayload.storeCategory || prodPayload.category || 'General',
      in_stock: prodPayload.inStock !== undefined ? Boolean(prodPayload.inStock) : Number(prodPayload.stock) > 0,
      rating: Number(prodPayload.rating || 5.0),
      reviews_count: prodPayload.reviewsCount || 0,
      popular: Boolean(prodPayload.popular),
      image: prodPayload.image || '',
      description: prodPayload.description || '',
      information: prodPayload.information || {}
    };

    const { data, error } = await supabase.from('products').insert([row]).select().single();
    if (error) throw error;
    const mapped = mapProductFromDb(data);
    broadcastLocalChange('products', 'INSERT', data);
    return { success: true, product: mapped };
  } catch (err) {
    console.error('Error creating product in Supabase:', err?.message || err);
    return { success: false, error: err?.message || err, product: prodPayload };
  }
}

export async function updateProduct(productId, updates) {
  try {
    const supabase = createClient();
    const row = {};
    if (updates.name) row.name = updates.name;
    if (updates.price !== undefined) row.price = Number(updates.price);
    if (updates.originalPrice !== undefined) row.original_price = Number(updates.originalPrice);
    if (updates.stock !== undefined) row.in_stock = Number(updates.stock) > 0;
    if (updates.inStock !== undefined) row.in_stock = Boolean(updates.inStock);
    if (updates.category) row.category = updates.category;
    if (updates.description) row.description = updates.description;
    if (updates.image) row.image = updates.image;

    const { data, error } = await supabase
      .from('products')
      .update(row)
      .eq('id', productId)
      .select()
      .single();

    if (error) throw error;
    const mapped = mapProductFromDb(data);
    broadcastLocalChange('products', 'UPDATE', data);
    return { success: true, product: mapped };
  } catch (err) {
    console.error(`Error updating product ${productId}:`, err?.message || err);
    return { success: false, error: err?.message || err };
  }
}

export async function deleteProduct(productId) {
  try {
    const supabase = createClient();
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) throw error;
    broadcastLocalChange('products', 'DELETE', { id: productId });
    return { success: true };
  } catch (err) {
    console.error(`Error deleting product ${productId}:`, err?.message || err);
    return { success: false, error: err?.message || err };
  }
}

// ==========================================
// ORDERS
// ==========================================
export async function getOrders(userId) {
  try {
    const supabase = createClient();
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (userId) query = query.eq('user_id', userId);
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(mapOrderFromDb);
  } catch (err) {
    console.error('Error fetching orders from Supabase:', err?.message || err);
    return [];
  }
}

export async function getOrderById(orderId) {
  if (!orderId) return null;
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .maybeSingle();
    if (error || !data) return null;
    return mapOrderFromDb(data);
  } catch (err) {
    console.error(`Error fetching order ${orderId} from Supabase:`, err?.message || err);
    return null;
  }
}

export async function createOrder(orderPayload) {
  try {
    const supabase = createClient();
    const row = {
      id: orderPayload.orderId || orderPayload.id,
      user_id: orderPayload.userId || null,
      shop_id: orderPayload.shopId || null,
      shop_name: orderPayload.shopName,
      items: orderPayload.items || [],
      total: orderPayload.total,
      subtotal: orderPayload.itemsTotal || orderPayload.subtotal || orderPayload.total,
      delivery_fee: orderPayload.deliveryFee || 0,
      payment_method: orderPayload.paymentMethod || 'Cash on Delivery',
      status: orderPayload.status || 'placed',
      delivery_address: orderPayload.deliveryAddress || {},
      customer_name: orderPayload.deliveryAddress?.name || orderPayload.customerName || 'Customer',
      customer_phone: orderPayload.deliveryAddress?.phone || orderPayload.customerPhone || ''
    };

    const { data, error } = await supabase.from('orders').insert([row]).select().single();
    if (error) throw error;
    return { success: true, order: mapOrderFromDb(data) };
  } catch (err) {
    console.error('Failed to create order in Supabase:', err?.message || err);
    return { success: false, error: err?.message || err, order: orderPayload };
  }
}

export async function updateOrderStatus(orderId, status) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();
    if (error) throw error;
    return mapOrderFromDb(data);
  } catch (err) {
    console.error(`Error updating order ${orderId} status in Supabase:`, err?.message || err);
    return null;
  }
}

// ==========================================
// ADDRESSES
// ==========================================
export async function getAddresses(userId) {
  try {
    const supabase = createClient();
    let query = supabase.from('addresses').select('*').order('is_default', { ascending: false });
    if (userId) query = query.eq('user_id', userId);
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map((a) => ({
      id: a.id,
      label: a.label,
      isDefault: a.is_default,
      recipient: a.recipient,
      phone: a.phone,
      street: a.street,
      locality: a.locality,
      city: a.city,
      pincode: a.pincode
    }));
  } catch (err) {
    console.error('Error fetching addresses from Supabase:', err?.message || err);
    return [];
  }
}

export async function createAddress(addressPayload) {
  try {
    const supabase = createClient();
    const row = {
      id: addressPayload.id || `addr-${Date.now()}`,
      user_id: addressPayload.userId || null,
      label: addressPayload.label || 'Home',
      is_default: Boolean(addressPayload.isDefault),
      recipient: addressPayload.recipient || 'Customer',
      phone: addressPayload.phone || '',
      street: addressPayload.street || '',
      locality: addressPayload.locality || '',
      city: addressPayload.city || 'Bhubaneswar',
      pincode: addressPayload.pincode || '751013'
    };
    const { data, error } = await supabase.from('addresses').insert([row]).select().single();
    if (error) throw error;
    return {
      id: data.id,
      label: data.label,
      isDefault: data.is_default,
      recipient: data.recipient,
      phone: data.phone,
      street: data.street,
      locality: data.locality,
      city: data.city,
      pincode: data.pincode
    };
  } catch (err) {
    console.error('Error creating address in Supabase:', err?.message || err);
    return addressPayload;
  }
}

export async function deleteAddress(addressId) {
  try {
    const supabase = createClient();
    const { error } = await supabase.from('addresses').delete().eq('id', addressId);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error(`Error deleting address ${addressId} from Supabase:`, err?.message || err);
    return false;
  }
}

export async function updateAddress(addressId, addressPayload) {
  try {
    const supabase = createClient();
    const row = {
      label: addressPayload.label || 'Home',
      recipient: addressPayload.recipient || 'Customer',
      phone: addressPayload.phone || '',
      street: addressPayload.street || '',
      locality: addressPayload.locality || '',
      city: addressPayload.city || 'Bhubaneswar',
      pincode: addressPayload.pincode || '751013'
    };
    const { data, error } = await supabase.from('addresses').update(row).eq('id', addressId).select().single();
    if (error) throw error;
    return {
      id: data.id,
      label: data.label,
      isDefault: data.is_default,
      recipient: data.recipient,
      phone: data.phone,
      street: data.street,
      locality: data.locality,
      city: data.city,
      pincode: data.pincode
    };
  } catch (err) {
    console.error(`Error updating address ${addressId} in Supabase:`, err?.message || err);
    return addressPayload;
  }
}

// ==========================================
// NOTIFICATIONS
// ==========================================
export async function getNotifications(userId) {
  try {
    const supabase = createClient();
    let query = supabase.from('notifications').select('*').order('created_at', { ascending: false });
    if (userId) query = query.eq('user_id', userId);
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map((n) => ({
      id: n.id,
      title: n.title,
      message: n.message,
      timestamp: n.timestamp,
      read: Boolean(n.read),
      orderId: n.order_id,
      shopId: n.shop_id
    }));
  } catch (err) {
    console.error('Error fetching notifications from Supabase:', err?.message || err);
    return [];
  }
}

export async function markNotificationAsRead(notifId) {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notifId);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error(`Error marking notification ${notifId} read in Supabase:`, err?.message || err);
    return false;
  }
}

// ==========================================
// FAQS
// ==========================================
export async function getFaqs() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('faqs').select('*').order('order_index');
    if (error) throw error;
    return (data || []).map((f) => ({
      id: f.id,
      question: f.question,
      answer: f.answer
    }));
  } catch (err) {
    console.error('Error fetching FAQs from Supabase:', err?.message || err);
    return [];
  }
}

// ==========================================
// SEARCH SUGGESTIONS
// ==========================================
export async function getSearchSuggestions() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('search_suggestions')
      .select('query')
      .order('order_index');
    if (error) throw error;
    return (data || []).map((s) => s.query);
  } catch (err) {
    console.error('Error fetching search suggestions from Supabase:', err?.message || err);
    return [];
  }
}

// ==========================================
// HELPER MAPPERS
// ==========================================
export function mapShopFromDb(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    categoryLabel: row.category_label,
    rating: Number(row.rating || 0),
    reviewCount: row.review_count || 0,
    distanceKm: Number(row.distance_km || 0),
    distanceText: row.distance_text,
    locality: row.locality,
    address: row.address,
    deliveryTime: row.delivery_time,
    deliveryFee: Number(row.delivery_fee || 0),
    isOpen: Boolean(row.is_open),
    openingHours: row.opening_hours,
    closesAt: row.closes_at,
    productCount: row.product_count || 0,
    minOrder: Number(row.min_order || 0),
    featured: Boolean(row.featured),
    image: row.image,
    coverImage: row.cover_image,
    avatar: row.avatar,
    description: row.description,
    ownerName: row.owner_name,
    phone: row.phone,
    tags: row.tags || [],
    catalogCategories: row.catalog_categories || []
  };
}

const KNOWN_SALES_LAST_MONTH = {
  "maggi-masala-4pack": 640,
  "parle-g-gold-1kg": 580,
  "aashirvaad-atta-5kg": 510,
  "fortune-sunflower-oil-1l": 485,
  "amul-taaza-1l": 470,
  "chhena-poda-fresh": 430,
  "dolo-650-strip": 415,
  "fresh-tomatoes-1kg": 390,
  "daawat-basmati-5kg": 365,
  "amul-butter-500g": 340,
  "shimla-apple-1kg": 320,
  "fresh-bananas-dozen": 295,
  "boat-bassheads-100": 260,
  "sandwich-bread-400g": 245,
  "tata-toor-dal-1kg": 230,
  "choco-truffle-pastry": 210,
  "volini-pain-spray-100g": 190,
  "pediasure-vanilla-400g": 175,
  "classmate-notebook-pack": 160,
  "accu-chek-active-glucometer": 140,
  "tata-salt-1kg": 130,
  "vicks-vaporub-50ml": 115,
  "type-c-fast-cable": 95,
  "dettol-sanitizer-500ml": 85
};

const SHOP_MAP = {
  "sharma-grocery": { name: "Sharma Grocery Store", distance: "0.8 km away" },
  "maa-laxmi": { name: "Maa Laxmi General Store", distance: "1.2 km away" },
  "fresh-basket": { name: "Fresh Basket Organics", distance: "1.5 km away" },
  "city-bakery": { name: "City Bakery & Confectionery", distance: "2.4 km away" },
  "apna-pharmacy": { name: "Apna Pharmacy & Surgicals", distance: "0.6 km away" },
  "utkal-stationery": { name: "Utkal Book & Stationery", distance: "1.8 km away" },
  "odisha-stationery": { name: "Odisha Stationery House", distance: "2.0 km away" },
  "kumar-electronics": { name: "Kumar Electronics", distance: "3.1 km away" },
  "khandagiri-sweets": { name: "Khandagiri Sweets", distance: "3.5 km away" },
  "sum-medico": { name: "SUM Medico & Healthcare", distance: "3.8 km away" }
};

export function mapProductFromDb(row) {
  if (!row) return null;
  const isPopular = Boolean(row.popular);
  const shopMeta = SHOP_MAP[row.shop_id] || {};
  const salesLastMonth =
    row.sales_last_month ||
    row.monthly_sales ||
    row.information?.sales_last_month ||
    KNOWN_SALES_LAST_MONTH[row.id] ||
    (isPopular
      ? Math.max(150, Math.round((row.reviews_count || 50) * 1.3))
      : Math.max(25, Math.round((row.reviews_count || 20) * 0.6)));

  return {
    id: row.id,
    shopId: row.shop_id,
    shopName: row.shop_name || shopMeta.name || "Local Neighborhood Store",
    shopDistance: row.shop_distance || shopMeta.distance || "0.8 km",
    name: row.name,
    brand: row.brand,
    quantity: row.quantity,
    price: Number(row.price || 0),
    originalPrice: Number(row.original_price || row.price || 0),
    discountPercent: row.discount_percent || 0,
    category: row.category,
    storeCategory: row.store_category,
    inStock: Boolean(row.in_stock),
    rating: Number(row.rating || 4.8),
    reviewsCount: row.reviews_count || 5,
    popular: isPopular,
    salesLastMonth: Number(salesLastMonth),
    createdAt: row.created_at || new Date().toISOString(),
    image: row.image,
    description: row.description,
    information: row.information || {}
  };
}

export function mapOrderFromDb(row) {
  if (!row) return null;
  const createdAt = new Date(row.created_at || Date.now());
  const dateFormatted =
    createdAt.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }) +
    `, ${createdAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;

  return {
    orderId: row.id,
    date: dateFormatted,
    shopId: row.shop_id,
    shopName: row.shop_name,
    status: row.status,
    statusLabel:
      row.status === 'placed'
        ? 'Store Accepted'
        : row.status === 'delivered'
        ? 'Delivered'
        : row.status === 'cancelled'
        ? 'Cancelled'
        : row.status === 'out_for_delivery'
        ? 'Out for Delivery'
        : 'In Transit',
    estimatedDelivery: '25–35 minutes',
    estimatedArrival: 'In 30 mins',
    deliveryPartner: {
      name: 'Manas Barik',
      phone: '+91 97761 44556',
      vehicle: 'Honda Activa (OD-02-BQ-8819)',
      rating: 4.8
    },
    items: row.items || [],
    itemsTotal: Number(row.subtotal || row.total),
    deliveryFee: Number(row.delivery_fee || 0),
    platformFee: 5,
    discount: 0,
    total: Number(row.total),
    paymentMethod: row.payment_method || 'Cash on Delivery',
    paymentStatus: row.payment_status || 'Pay on Delivery',
    deliveryAddress: row.delivery_address || {},
    timeline: [
      { step: 'Order Placed', time: 'Just now', completed: true, current: false },
      { step: 'Store Accepted', time: 'Just now', completed: true, current: true },
      { step: 'Preparing Your Order', time: 'Est. in 5 min', completed: false, current: false },
      { step: 'Out for Delivery', time: 'Est. in 15 min', completed: false, current: false },
      { step: 'Delivered', time: 'Est. in 30 min', completed: false, current: false }
    ]
  };
}

// ==========================================
// STORAGE UPLOADS
// ==========================================
export async function uploadStorageAsset(file, folder = 'avatars') {
  try {
    const supabase = createClient();
    const fileExt = file.name ? file.name.split('.').pop() : 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('localstore-assets')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type || 'image/jpeg'
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('localstore-assets').getPublicUrl(filePath);
    return { success: true, url: data.publicUrl };
  } catch (err) {
    console.error('Storage upload error:', err?.message || err);
    return { success: false, error: err?.message || err };
  }
}

