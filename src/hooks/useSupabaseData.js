"use client";

import { useState, useEffect, useCallback } from 'react';
import {
  getCategories,
  getLocalities,
  getShops,
  getShopById,
  getProducts,
  getProductById,
  getOrders,
  getAddresses,
  getNotifications,
  getFaqs,
  getSearchSuggestions,
  mapProductFromDb,
  mapShopFromDb,
  mapOrderFromDb
} from '@/lib/supabase/db';
import { subscribeToTable, onVisibilityOrFocus } from '@/lib/supabase/realtime';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getCategories()
      .then((data) => {
        if (isMounted) {
          setCategories(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return { categories, loading, error };
}

export function useLocalities() {
  const [localities, setLocalities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getLocalities()
      .then((data) => {
        if (isMounted) {
          setLocalities(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return { localities, loading, error };
}

export function useShops(filters = {}) {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filterKey = JSON.stringify(filters);

  const refresh = useCallback(() => {
    return getShops(filters)
      .then((data) => {
        setShops(data);
        setLoading(false);
        return data;
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey]);

  useEffect(() => {
    let isMounted = true;
    getShops(filters)
      .then((data) => {
        if (isMounted) {
          setShops(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      });

    // Realtime subscription to shop status / details updates
    const unsubscribe = subscribeToTable('shops', (payload) => {
      if (!isMounted) return;
      const { eventType, new: newRow } = payload;
      if (eventType === 'UPDATE' && newRow) {
        const mapped = mapShopFromDb(newRow);
        if (mapped) {
          setShops((prev) =>
            prev.map((s) => (s.id === mapped.id ? { ...s, ...mapped } : s))
          );
        }
      }
      getShops(filters)
        .then((data) => {
          if (isMounted) setShops(data);
        })
        .catch(() => {});
    });

    const unbindFocus = onVisibilityOrFocus(() => {
      if (isMounted) {
        getShops(filters)
          .then((data) => {
            if (isMounted) setShops(data);
          })
          .catch(() => {});
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
      unbindFocus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey]);

  return { shops, loading, error, refresh };
}

export function useShop(shopId) {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(Boolean(shopId));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!shopId) return;
    let isMounted = true;
    getShopById(shopId)
      .then((data) => {
        if (isMounted) {
          setShop(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      });

    const unsubscribe = subscribeToTable('shops', (payload) => {
      if (!isMounted) return;
      const { new: newRow } = payload;
      if (newRow?.id === shopId) {
        const mapped = mapShopFromDb(newRow);
        if (mapped) setShop(mapped);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [shopId]);

  return { shop, loading, error };
}

export function useProducts(filters = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filterKey = JSON.stringify(filters);

  const refresh = useCallback(() => {
    return getProducts(filters)
      .then((data) => {
        setProducts(data);
        setLoading(false);
        return data;
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey]);

  useEffect(() => {
    let isMounted = true;
    getProducts(filters)
      .then((data) => {
        if (isMounted) {
          setProducts(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      });

    // 1. Instant Realtime Subscription to Supabase 'products' table
    const unsubscribe = subscribeToTable('products', (payload) => {
      if (!isMounted) return;
      const { eventType, new: newRow, old: oldRow } = payload;

      if (eventType === 'DELETE') {
        const deletedId = oldRow?.id;
        if (deletedId) {
          // Immediately eliminate deleted product from view without waiting for roundtrip
          setProducts((prev) => prev.filter((p) => p.id !== deletedId));
        }
        // Background re-fetch to ensure counts and filters stay perfectly calibrated
        getProducts(filters)
          .then((data) => {
            if (isMounted) setProducts(data);
          })
          .catch(() => {});
      } else if (eventType === 'INSERT') {
        const mapped = mapProductFromDb(newRow);
        if (mapped) {
          setProducts((prev) => {
            if (prev.some((p) => p.id === mapped.id)) return prev;
            return [mapped, ...prev];
          });
        }
        getProducts(filters)
          .then((data) => {
            if (isMounted) setProducts(data);
          })
          .catch(() => {});
      } else if (eventType === 'UPDATE') {
        const mapped = mapProductFromDb(newRow);
        if (mapped) {
          setProducts((prev) =>
            prev.map((p) => (p.id === mapped.id ? { ...p, ...mapped } : p))
          );
        }
        getProducts(filters)
          .then((data) => {
            if (isMounted) setProducts(data);
          })
          .catch(() => {});
      }
    });

    // 2. Revalidate when tab becomes active / focused again (e.g., wake from sleep or tab switch)
    const unbindFocus = onVisibilityOrFocus(() => {
      if (isMounted) {
        getProducts(filters)
          .then((data) => {
            if (isMounted) setProducts(data);
          })
          .catch(() => {});
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
      unbindFocus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey]);

  return { products, loading, error, refresh };
}

export function useProduct(productId) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(Boolean(productId));
  const [error, setError] = useState(null);

  const refresh = useCallback(() => {
    if (!productId) return Promise.resolve(null);
    return getProductById(productId)
      .then((data) => {
        setProduct(data);
        setLoading(false);
        return data;
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [productId]);

  useEffect(() => {
    if (!productId) return;
    let isMounted = true;
    getProductById(productId)
      .then((data) => {
        if (isMounted) {
          setProduct(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      });

    // Realtime listener for this specific product
    const unsubscribe = subscribeToTable('products', (payload) => {
      if (!isMounted) return;
      const { eventType, new: newRow, old: oldRow } = payload;

      if (eventType === 'DELETE') {
        if (oldRow?.id === productId) {
          // Instant reactivity when deleted by shopkeeper
          setProduct(null);
          setError(new Error('Product was deleted by the store owner'));
        }
      } else if (eventType === 'UPDATE') {
        if (newRow?.id === productId) {
          const mapped = mapProductFromDb(newRow);
          setProduct(mapped);
        }
      }
    });

    const unbindFocus = onVisibilityOrFocus(() => {
      if (isMounted && productId) {
        getProductById(productId)
          .then((data) => {
            if (isMounted) setProduct(data);
          })
          .catch(() => {});
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
      unbindFocus();
    };
  }, [productId]);

  return { product, loading, error, refresh };
}

export function useOrdersData(userId) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(() => {
    getOrders(userId)
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [userId]);

  useEffect(() => {
    let isMounted = true;
    getOrders(userId)
      .then((data) => {
        if (isMounted) {
          setOrders(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      });

    // Realtime updates for customer order status changes
    const unsubscribe = subscribeToTable('orders', (payload) => {
      if (!isMounted) return;
      const { eventType, new: newRow } = payload;
      if (eventType === 'INSERT' && newRow) {
        const mapped = mapOrderFromDb(newRow);
        setOrders((prev) => [mapped, ...prev.filter((o) => (o.orderId || o.id) !== mapped.orderId)]);
      } else if (eventType === 'UPDATE' && newRow) {
        const mapped = mapOrderFromDb(newRow);
        setOrders((prev) =>
          prev.map((o) => ((o.orderId || o.id) === mapped.orderId ? { ...o, ...mapped } : o))
        );
      }
      getOrders(userId)
        .then((data) => {
          if (isMounted) setOrders(data);
        })
        .catch(() => {});
    });

    const unbindFocus = onVisibilityOrFocus(() => {
      if (isMounted) {
        getOrders(userId)
          .then((data) => {
            if (isMounted) setOrders(data);
          })
          .catch(() => {});
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
      unbindFocus();
    };
  }, [userId]);

  return { orders, loading, error, refresh };
}

export function useAddresses(userId) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(() => {
    getAddresses(userId)
      .then((data) => {
        setAddresses(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [userId]);

  useEffect(() => {
    let isMounted = true;
    getAddresses(userId)
      .then((data) => {
        if (isMounted) {
          setAddresses(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [userId]);

  return { addresses, setAddresses, loading, error, refresh };
}

export function useNotifications(userId) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(() => {
    getNotifications(userId)
      .then((data) => {
        setNotifications(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [userId]);

  useEffect(() => {
    let isMounted = true;
    getNotifications(userId)
      .then((data) => {
        if (isMounted) {
          setNotifications(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      });

    // Realtime notification push
    const unsubscribe = subscribeToTable('notifications', (payload) => {
      if (!isMounted) return;
      if (payload.eventType === 'INSERT' && payload.new) {
        const n = payload.new;
        const newNotif = {
          id: n.id,
          title: n.title,
          message: n.message,
          timestamp: n.timestamp || 'Just now',
          read: Boolean(n.read),
          orderId: n.order_id,
          shopId: n.shop_id
        };
        setNotifications((prev) => [newNotif, ...prev.filter((item) => item.id !== newNotif.id)]);
      }
      getNotifications(userId)
        .then((data) => {
          if (isMounted) setNotifications(data);
        })
        .catch(() => {});
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [userId]);

  return { notifications, setNotifications, loading, error, refresh };
}

export function useFaqs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getFaqs()
      .then((data) => {
        if (isMounted) {
          setFaqs(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return { faqs, loading, error };
}

export function useSearchSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getSearchSuggestions()
      .then((data) => {
        if (isMounted) {
          setSuggestions(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return { suggestions, loading, error };
}
