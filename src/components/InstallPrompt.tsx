'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Download, Smartphone, Share, Plus, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const INSTALL_PROMPT_KEY = 'hifz_install_prompt';
const VISIT_COUNT_KEY = 'hifz_visit_count';
const DISMISSED_KEY = 'hifz_install_dismissed';
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

type Platform = 'android' | 'ios' | 'desktop' | 'unknown';

function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'unknown';
  
  const ua = navigator.userAgent.toLowerCase();
  
  if (/iphone|ipad|ipod/.test(ua)) return 'ios';
  if (/android/.test(ua)) return 'android';
  if (/windows|macintosh|linux/.test(ua)) return 'desktop';
  
  return 'unknown';
}

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  );
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [platform, setPlatform] = useState<Platform>('unknown');
  const [isInstalled, setIsInstalled] = useState(false);

  // Check if should show prompt
  const shouldShowPrompt = useCallback(() => {
    if (typeof window === 'undefined') return false;
    
    // Don't show if already installed
    if (isStandalone()) return false;
    
    // Check dismissal
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      if (Date.now() - dismissedTime < DISMISS_DURATION) {
        return false;
      }
    }
    
    // Check visit count (show after 2nd visit)
    const visitCount = parseInt(localStorage.getItem(VISIT_COUNT_KEY) || '0', 10);
    return visitCount >= 2;
  }, []);

  // Track visits
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const visitCount = parseInt(localStorage.getItem(VISIT_COUNT_KEY) || '0', 10);
    localStorage.setItem(VISIT_COUNT_KEY, (visitCount + 1).toString());
  }, []);

  // Detect platform
  useEffect(() => {
    setPlatform(detectPlatform());
    setIsInstalled(isStandalone());
  }, []);

  // Listen for beforeinstallprompt event (Chrome/Android)
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Delay showing prompt
      timers.push(setTimeout(() => {
        if (shouldShowPrompt()) {
          setShowPrompt(true);
        }
      }, 3000));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Check for iOS after delay
    if (platform === 'ios' && !isInstalled) {
      timers.push(setTimeout(() => {
        if (shouldShowPrompt()) {
          setShowPrompt(true);
        }
      }, 5000));
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      timers.forEach(clearTimeout);
    };
  }, [platform, isInstalled, shouldShowPrompt]);

  // Listen for app installed event
  useEffect(() => {
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (platform === 'ios') {
      setShowIOSInstructions(true);
      return;
    }

    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
    } catch (error) {
      console.error('Install prompt error:', error);
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, Date.now().toString());
    setShowPrompt(false);
    setShowIOSInstructions(false);
  };

  // Don't render if installed or shouldn't show
  if (isInstalled || !showPrompt) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleDismiss}
          />

          {/* Prompt Card */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom"
          >
            <div className="mx-4 mb-4 bg-night-900/95 backdrop-blur-xl rounded-2xl border border-night-700 overflow-hidden shadow-2xl">
              {/* iOS Instructions View */}
              {showIOSInstructions ? (
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-night-100">
                      Install on iOS
                    </h3>
                    <button
                      onClick={handleDismiss}
                      className="p-1 text-night-400 hover:text-night-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-night-800 rounded-full flex items-center justify-center">
                        <Share className="w-4 h-4 text-gold-400" />
                      </div>
                      <div>
                        <p className="text-night-200 text-sm">
                          Tap the <strong>Share</strong> button at the bottom of Safari
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-night-800 rounded-full flex items-center justify-center">
                        <ChevronUp className="w-4 h-4 text-gold-400" />
                      </div>
                      <div>
                        <p className="text-night-200 text-sm">
                          Scroll down and tap <strong>"Add to Home Screen"</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-night-800 rounded-full flex items-center justify-center">
                        <Plus className="w-4 h-4 text-gold-400" />
                      </div>
                      <div>
                        <p className="text-night-200 text-sm">
                          Tap <strong>"Add"</strong> in the top right
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowIOSInstructions(false)}
                    className="mt-6 w-full py-3 text-night-400 hover:text-night-200 text-sm"
                  >
                    Got it
                  </button>
                </div>
              ) : (
                /* Main Install Prompt */
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center">
                        <Smartphone className="w-6 h-6 text-night-950" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-night-100">
                          Install HIFZ
                        </h3>
                        <p className="text-sm text-night-400">
                          Add to your home screen
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleDismiss}
                      className="p-1 text-night-400 hover:text-night-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-night-300 text-sm mb-6">
                    Install HIFZ for quick access, offline practice, and a native app experience.
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={handleDismiss}
                      className="flex-1 py-3 px-4 bg-night-800 hover:bg-night-700 text-night-300 rounded-xl transition-colors"
                    >
                      Not now
                    </button>
                    <button
                      onClick={handleInstall}
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gold-500 hover:bg-gold-400 text-night-950 font-medium rounded-xl transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Install
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
