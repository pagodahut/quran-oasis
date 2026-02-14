'use client';

import { useEffect, useState, useCallback } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logger from '@/lib/logger';

export default function ServiceWorkerRegistration() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    let updateInterval: ReturnType<typeof setInterval> | null = null;

    const handleOnline = () => {
      navigator.serviceWorker.getRegistration().then(reg => {
        reg?.update().catch(logger.error);
      });
    };

    const handleControllerChange = () => {
      window.location.reload();
    };

    // Register service worker
    const registerSW = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        logger.debug('[App] Service Worker registered:', reg.scope);
        setRegistration(reg);

        // Check for updates on registration
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New update available
              logger.debug('[App] New Service Worker available');
              setUpdateAvailable(true);
            }
          });
        });

        // Check for updates periodically (every hour)
        updateInterval = setInterval(() => {
          reg.update().catch(logger.error);
        }, 60 * 60 * 1000);

        // Check for updates when coming back online
        window.addEventListener('online', handleOnline);

      } catch (error) {
        logger.error('[App] Service Worker registration failed:', error);
      }
    };

    // Listen for controller change (means SW took over)
    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

    registerSW();

    return () => {
      if (updateInterval) {
        clearInterval(updateInterval);
      }
      window.removeEventListener('online', handleOnline);
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
    };
  }, []);

  const handleUpdate = useCallback(() => {
    if (!registration?.waiting) return;

    // Tell the waiting service worker to skip waiting
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }, [registration]);

  const handleDismiss = () => {
    setUpdateAvailable(false);
  };

  return (
    <AnimatePresence>
      {updateAvailable && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-20 left-4 right-4 z-50 safe-area-bottom"
        >
          <div className="bg-gold-500/20 backdrop-blur-xl border border-gold-500/30 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-gold-400" />
              <div>
                <p className="text-gold-300 text-sm font-medium">
                  Update available
                </p>
                <p className="text-gold-400/70 text-xs">
                  Tap to refresh with new features
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDismiss}
                className="p-2 text-gold-400/60 hover:text-gold-400"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-gold-500 hover:bg-gold-400 text-night-950 text-sm font-medium rounded-lg transition-colors"
              >
                Update
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Utility: Pre-cache audio files
export function cacheAudioFiles(urls: string[]) {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CACHE_AUDIO',
      data: { urls },
    });
  }
}

// Utility: Clear audio cache
export function clearAudioCache() {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CLEAR_AUDIO_CACHE',
    });
  }
}

// Utility: Get cache size
export async function getCacheSize(): Promise<{ total: number; caches: Record<string, number> } | null> {
  if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
    return null;
  }

  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(null), 5000);

    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'CACHE_SIZE') {
        clearTimeout(timeout);
        navigator.serviceWorker.removeEventListener('message', handler);
        resolve(event.data.data);
      }
    };

    navigator.serviceWorker.addEventListener('message', handler);
    navigator.serviceWorker.controller?.postMessage({ type: 'GET_CACHE_SIZE' });
  });
}

// Utility: Check if running as installed PWA
export function isInstalledPWA(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  );
}
