'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('[App] Service Worker registered:', registration.scope);
            
            // Check for updates periodically
            setInterval(() => {
              registration.update();
            }, 1000 * 60 * 60); // Every hour
          })
          .catch((error) => {
            console.error('[App] Service Worker registration failed:', error);
          });
      });
    }
  }, []);

  return null;
}

// Utility function to pre-cache a surah's audio
export function cacheSurahAudio(surah: number, reciter: string) {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CACHE_SURAH_AUDIO',
      surah,
      reciter,
    });
  }
}
