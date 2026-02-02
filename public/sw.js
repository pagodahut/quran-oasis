/**
 * HIFZ Service Worker v2
 * Enhanced offline functionality and caching
 */

const CACHE_VERSION = 'v2';
const STATIC_CACHE = `hifz-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `hifz-dynamic-${CACHE_VERSION}`;
const QURAN_DATA_CACHE = `hifz-quran-${CACHE_VERSION}`;
const AUDIO_CACHE = 'hifz-audio-v1'; // Persist across versions

// Static assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/practice',
  '/mushaf',
  '/lessons',
  '/profile',
  '/onboarding',
  '/surahs',
  '/settings',
  '/bookmarks',
  '/progress',
  '/offline',
  '/manifest.json',
  '/icon.svg',
  '/apple-touch-icon.png',
  '/favicon.png',
];

// Icon assets
const ICON_ASSETS = [
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
];

// API routes to cache
const CACHEABLE_API_ROUTES = [
  '/api/quran',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing v2...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll([...STATIC_ASSETS, ...ICON_ASSETS]);
      }),
    ]).then(() => {
      console.log('[SW] Install complete');
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating v2...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            // Keep audio cache across versions
            if (name === AUDIO_CACHE) return false;
            // Delete old version caches
            return name.startsWith('hifz-') && 
                   name !== STATIC_CACHE && 
                   name !== DYNAMIC_CACHE &&
                   name !== QURAN_DATA_CACHE;
          })
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// Helper: Check if request is for a page navigation
function isNavigationRequest(request) {
  return request.mode === 'navigate';
}

// Helper: Check if URL is for Quran audio
function isQuranAudio(url) {
  return url.hostname === 'everyayah.com' || 
         url.pathname.includes('/audio/');
}

// Helper: Check if URL is for API
function isApiRequest(url) {
  return url.pathname.startsWith('/api/');
}

// Helper: Check if URL is for Next.js assets
function isNextAsset(url) {
  return url.pathname.startsWith('/_next/');
}

// Helper: Check if URL is cacheable API
function isCacheableApi(url) {
  return CACHEABLE_API_ROUTES.some(route => url.pathname.startsWith(route));
}

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Strategy: Audio files - Cache first, then network
  if (isQuranAudio(url)) {
    event.respondWith(
      caches.open(AUDIO_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          console.log('[SW] Audio from cache:', url.pathname);
          return cachedResponse;
        }
        
        try {
          const networkResponse = await fetch(request);
          if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
            console.log('[SW] Audio cached:', url.pathname);
          }
          return networkResponse;
        } catch (error) {
          console.error('[SW] Audio fetch failed:', error);
          throw error;
        }
      })
    );
    return;
  }

  // Strategy: Navigation - Network first with offline fallback
  if (isNavigationRequest(request)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(async () => {
          // Try cached version first
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // Fall back to offline page
          const offlineResponse = await caches.match('/offline');
          if (offlineResponse) {
            return offlineResponse;
          }
          // Last resort: cached home page
          return caches.match('/');
        })
    );
    return;
  }

  // Strategy: Next.js static assets - Stale while revalidate
  if (isNextAsset(url)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse.ok) {
              caches.open(STATIC_CACHE).then((cache) => {
                cache.put(request, networkResponse.clone());
              });
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Strategy: Cacheable API - Network first, cache fallback
  if (isCacheableApi(url)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(QURAN_DATA_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          return cachedResponse || new Response(
            JSON.stringify({ error: 'Offline', offline: true }),
            { headers: { 'Content-Type': 'application/json' } }
          );
        })
    );
    return;
  }

  // Strategy: Other API requests - Network only (don't cache user-specific data)
  if (isApiRequest(url)) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({ error: 'Offline', offline: true }),
          { 
            status: 503,
            headers: { 'Content-Type': 'application/json' } 
          }
        );
      })
    );
    return;
  }

  // Strategy: Everything else - Cache first, network fallback
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      
      return fetch(request)
        .then((networkResponse) => {
          if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Return a simple offline response for unknown resources
          return new Response('Offline', { status: 503 });
        });
    })
  );
});

// Handle messages from the app
self.addEventListener('message', (event) => {
  const { type, data } = event.data || {};

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;

    case 'CACHE_AUDIO':
      // Cache specific audio files
      if (data?.urls) {
        caches.open(AUDIO_CACHE).then((cache) => {
          data.urls.forEach((url) => {
            fetch(url)
              .then((response) => {
                if (response.ok) {
                  cache.put(url, response);
                  console.log('[SW] Pre-cached audio:', url);
                }
              })
              .catch((err) => console.warn('[SW] Failed to cache audio:', url, err));
          });
        });
      }
      break;

    case 'CLEAR_AUDIO_CACHE':
      caches.delete(AUDIO_CACHE).then(() => {
        console.log('[SW] Audio cache cleared');
        caches.open(AUDIO_CACHE); // Re-create empty cache
      });
      break;

    case 'GET_CACHE_SIZE':
      getCacheSize().then((size) => {
        event.source?.postMessage({ type: 'CACHE_SIZE', data: size });
      });
      break;
  }
});

// Calculate cache size
async function getCacheSize() {
  const cacheNames = await caches.keys();
  let totalSize = 0;
  const sizes = {};

  for (const name of cacheNames) {
    const cache = await caches.open(name);
    const keys = await cache.keys();
    let cacheSize = 0;

    for (const request of keys) {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.clone().blob();
        cacheSize += blob.size;
      }
    }

    sizes[name] = cacheSize;
    totalSize += cacheSize;
  }

  return { total: totalSize, caches: sizes };
}

// Background sync for progress updates
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-progress') {
    event.waitUntil(syncProgress());
  }
});

async function syncProgress() {
  try {
    // Get queued progress updates from IndexedDB
    const queue = await getQueuedUpdates();
    
    for (const update of queue) {
      try {
        const response = await fetch('/api/user/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(update),
        });
        
        if (response.ok) {
          await removeFromQueue(update.id);
        }
      } catch (error) {
        console.error('[SW] Sync failed for update:', update.id);
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Placeholder for IndexedDB operations (implemented in app)
async function getQueuedUpdates() {
  // This would be implemented with IndexedDB in a real scenario
  return [];
}

async function removeFromQueue(id) {
  // This would be implemented with IndexedDB in a real scenario
}

console.log('[SW] HIFZ Service Worker v2 loaded');
