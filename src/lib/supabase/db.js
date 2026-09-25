import { createClient } from './client.js';

// ==========================================
// CATEGORIES
// ==========================================
export async function getCategories() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching categories from Supabase:', err);
    return [];
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
    console.error('Error fetching localities from Supabase:', err);
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
    console.error('Error fetching shops from Supabase:', err);
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
    console.error(`Error fetching shop ${shopId} from Supabase:`, err);
    return null;
  }
}

// ==========================================
// PRODUCTS
// ==========================================
export async function getProducts({ shopId, category, popular, search } = {}) {
  try {
    const supabase = createClient();
    let query = supabase.from('products').select('*').order('popular', { ascending: false });
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
    console.error('Error fetching products from Supabase:', err);
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
    console.error(`Error fetching product ${productId} from Supabase:`, err);
    return null;
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
    console.error('Error fetching orders from Supabase:', err);
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
    console.error(`Error fetching order ${orderId} from Supabase:`, err);
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
      payment_method: orderPayload.paymentMethod,
      status: orderPayload.status || 'placed',
      delivery_address: orderPayload.deliveryAddress || {},
      customer_name: orderPayload.deliveryAddress?.name || orderPayload.customerName || 'Customer',
      customer_phone: orderPayload.deliveryAddress?.phone || orderPayload.customerPhone || ''
    };

    const { data, error } = await supabase.from('orders').insert([row]).select().single();
    if (error) throw error;
    return { success: true, order: mapOrderFromDb(data) };
  } catch (err) {
    console.error('Failed to create order in Supabase:', err);
    return { success: false, error: err.message, order: orderPayload };
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
    console.error(`Error updating order ${orderId} status in Supabase:`, err);
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
    console.error('Error fetching addresses from Supabase:', err);
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
    console.error('Error creating address in Supabase:', err);
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
    console.error(`Error deleting address ${addressId} from Supabase:`, err);
    return false;
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
    console.error('Error fetching notifications from Supabase:', err);
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
    console.error(`Error marking notification ${notifId} read in Supabase:`, err);
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
    console.error('Error fetching FAQs from Supabase:', err);
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
    console.error('Error fetching search suggestions from Supabase:', err);
    return [];
  }
}

// ==========================================
// HELPER MAPPERS
// ==========================================
function mapShopFromDb(row) {
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

function mapProductFromDb(row) {
  return {
    id: row.id,
    shopId: row.shop_id,
    name: row.name,
    brand: row.brand,
    quantity: row.quantity,
    price: Number(row.price || 0),
    originalPrice: Number(row.original_price || row.price || 0),
    discountPercent: row.discount_percent || 0,
    category: row.category,
    storeCategory: row.store_category,
    inStock: Boolean(row.in_stock),
    rating: Number(row.rating || 0),
    reviewsCount: row.reviews_count || 0,
    popular: Boolean(row.popular),
    image: row.image,
    description: row.description,
    information: row.information || {}
  };
}

function mapOrderFromDb(row) {
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
    paymentMethod: row.payment_method || 'UPI',
    paymentStatus: row.payment_method === 'Cash on Delivery' ? 'Pay on Delivery' : 'Paid via UPI',
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
