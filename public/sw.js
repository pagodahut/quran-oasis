/**
 * Quran Oasis Service Worker
 * Enables offline functionality and caching
 */

const CACHE_NAME = 'quran-oasis-v1';
const QURAN_AUDIO_CACHE = 'quran-audio-v1';

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
  '/manifest.json',
  '/icon.svg',
  '/apple-touch-icon.png',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== QURAN_AUDIO_CACHE)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Special handling for Quran audio (everyayah.com)
  if (url.hostname === 'everyayah.com') {
    event.respondWith(
      caches.open(QURAN_AUDIO_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(request).then((networkResponse) => {
            // Cache audio files for offline use
            if (networkResponse.ok) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // For navigation requests, use network-first strategy
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful navigation responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if offline
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match('/');
          });
        })
    );
    return;
  }

  // For other requests, use stale-while-revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        // Update cache with fresh response
        if (networkResponse.ok) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, networkResponse.clone());
          });
        }
        return networkResponse;
      });

      // Return cached response immediately, update in background
      return cachedResponse || fetchPromise;
    })
  );
});

// Handle messages from the app
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
  
  // Pre-cache specific surah audio
  if (event.data.type === 'CACHE_SURAH_AUDIO') {
    const { surah, reciter } = event.data;
    caches.open(QURAN_AUDIO_CACHE).then((cache) => {
      // This would need surah verse counts - simplified for now
      console.log(`[SW] Pre-caching audio for surah ${surah}`);
    });
  }
});

console.log('[SW] Service Worker loaded - Quran Oasis');
