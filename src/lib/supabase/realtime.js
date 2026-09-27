"use client";

import { createClient } from './client.js';

// Table listener registry: Map<string, Set<Function>>
const tableListeners = new Map();
// Active Supabase channels: Map<string, RealtimeChannel>
const activeChannels = new Map();

// Local cross-tab broadcast channel for instantaneous zero-latency sync
let broadcastChannel = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel('localstore_realtime_bus');
    broadcastChannel.onmessage = (event) => {
      const { table, payload } = event.data || {};
      if (table && payload) {
        notifyListeners(table, payload);
      }
    };
  } catch (e) {
    console.warn('BroadcastChannel not supported or failed to initialize', e);
  }
}

function notifyListeners(table, payload) {
  const listeners = tableListeners.get(table);
  if (listeners) {
    listeners.forEach((cb) => {
      try {
        cb(payload);
      } catch (err) {
        console.error(`Error in realtime listener for ${table}:`, err);
      }
    });
  }

  // Also dispatch a DOM custom event for global decoupled listeners
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(`localstore:realtime:${table}`, { detail: payload })
    );
  }
}

/**
 * Broadcast an event locally across tabs and listeners immediately.
 * Perfect for zero-latency local optimistic updates and cross-tab communication.
 */
export function broadcastLocalChange(table, eventType, data = {}) {
  const payload = {
    schema: 'public',
    table,
    eventType,
    new: eventType === 'DELETE' ? {} : data,
    old: eventType === 'DELETE' ? (data.id ? { id: data.id } : data) : {},
    local: true,
    timestamp: Date.now()
  };

  notifyListeners(table, payload);

  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ table, payload });
    } catch (e) {
      console.warn('Failed to broadcast realtime message:', e);
    }
  }
}

/**
 * Subscribe to Supabase Postgres changes for a specific table.
 * Uses a single multiplexed channel per table to prevent connection leaks.
 * @param {string} table - Table name ('products', 'shops', 'orders', 'notifications')
 * @param {Function} callback - Callback function(payload)
 * @returns {Function} unsubscribe function
 */
export function subscribeToTable(table, callback) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  if (!tableListeners.has(table)) {
    tableListeners.set(table, new Set());
  }
  const listeners = tableListeners.get(table);
  listeners.add(callback);

  // If no Supabase channel exists for this table, create one
  if (!activeChannels.has(table)) {
    try {
      const supabase = createClient();
      const channelName = `public:${table}:realtime:${Date.now()}`;
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table },
          (payload) => {
            notifyListeners(table, payload);
          }
        )
        .subscribe((status, err) => {
          if (status === 'CHANNEL_ERROR') {
            console.warn(`Supabase realtime channel error on ${table}:`, err);
          }
        });

      activeChannels.set(table, channel);
    } catch (err) {
      console.error(`Failed to setup realtime subscription for ${table}:`, err);
    }
  }

  return () => {
    listeners.delete(callback);
  };
}

/**
 * Revalidation hook on window focus / document visibility change.
 * Fires callback when user returns to this tab (debounced).
 */
export function onVisibilityOrFocus(callback, minIntervalMs = 3000) {
  if (typeof window === 'undefined') return () => {};
  let lastTrigger = Date.now();

  const handler = () => {
    if (document.visibilityState === 'visible') {
      const now = Date.now();
      if (now - lastTrigger > minIntervalMs) {
        lastTrigger = now;
        callback();
      }
    }
  };

  window.addEventListener('focus', handler);
  document.addEventListener('visibilitychange', handler);

  return () => {
    window.removeEventListener('focus', handler);
    document.removeEventListener('visibilitychange', handler);
  };
}
