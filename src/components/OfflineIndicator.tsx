'use client';

import { useEffect, useState } from 'react';
import { WifiOff, Wifi, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showBanner, setShowBanner] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check initial state
    setIsOnline(navigator.onLine);
    if (!navigator.onLine) {
      setShowBanner(true);
    }

    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        // Show "back online" message briefly
        setShowBanner(true);
        setDismissed(false);
        setTimeout(() => {
          setShowBanner(false);
        }, 3000);
      }
      setWasOffline(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      setShowBanner(true);
      setDismissed(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  const handleDismiss = () => {
    setDismissed(true);
    if (isOnline) {
      setShowBanner(false);
    }
  };

  // Don't show if dismissed or no need
  if (dismissed && !isOnline) {
    // Show a subtle indicator when offline but dismissed
    return (
      <button
        onClick={() => setDismissed(false)}
        className="fixed top-4 right-4 z-40 p-2 bg-amber-500/20 backdrop-blur-sm rounded-full"
      >
        <WifiOff className="w-4 h-4 text-amber-400" />
      </button>
    );
  }

  return (
    <AnimatePresence>
      {showBanner && !dismissed && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed top-0 left-0 right-0 z-50 safe-area-top"
        >
          <div
            className={`mx-4 mt-4 px-4 py-3 rounded-xl flex items-center justify-between backdrop-blur-xl ${
              isOnline
                ? 'bg-green-500/20 border border-green-500/30'
                : 'bg-amber-500/20 border border-amber-500/30'
            }`}
          >
            <div className="flex items-center gap-3">
              {isOnline ? (
                <>
                  <Wifi className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-green-300 text-sm font-medium">
                      You're back online
                    </p>
                    <p className="text-green-400/70 text-xs">
                      Your progress has been synced
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <WifiOff className="w-5 h-5 text-amber-400" />
                  <div>
                    <p className="text-amber-300 text-sm font-medium">
                      You're offline
                    </p>
                    <p className="text-amber-400/70 text-xs">
                      Practice continues — progress saved locally
                    </p>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={handleDismiss}
              className={`p-1 rounded ${
                isOnline
                  ? 'text-green-400 hover:bg-green-500/20'
                  : 'text-amber-400 hover:bg-amber-500/20'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
