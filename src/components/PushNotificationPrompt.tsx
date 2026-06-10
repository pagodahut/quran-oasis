'use client';

import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassPanel } from '@/components/ui/GlassPanel';
import {
  isPushSupported,
  shouldPromptForPermission,
  trackVisitForPrompt,
  dismissPermissionPrompt,
  subscribeToPush,
} from '@/lib/pushNotifications';

export default function PushNotificationPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    trackVisitForPrompt();
    const timer = setTimeout(() => {
      if (shouldPromptForPermission()) {
        setShow(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleEnable = async () => {
    setShow(false);
    await subscribeToPush();
  };

  const handleDismiss = () => {
    setShow(false);
    dismissPermissionPrompt();
  };

  if (!isPushSupported()) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-24 left-4 right-4 z-40 safe-area-bottom"
        >
          <GlassPanel tint="gold" blur="xl" glow className="p-4">
            <div className="relative z-10">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold-500/15 flex items-center justify-center shrink-0 border border-gold-500/20">
                  <Bell className="w-5 h-5 text-gold-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-night-100 text-sm font-semibold">
                    Never miss a review
                  </p>
                  <p className="text-night-400 text-xs mt-0.5">
                    Get daily reminders and streak alerts to keep your Hifz journey on track
                  </p>
                </div>
                <button onClick={handleDismiss} className="p-1.5 rounded-lg hover:bg-white/5 text-night-500 hover:text-night-300 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-2 mt-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDismiss}
                  className="flex-1 py-2.5 text-sm text-night-400 hover:text-night-200 rounded-xl hover:bg-white/5 transition-colors"
                >
                  Not now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEnable}
                  className="flex-1 py-2.5 text-sm bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 text-night-950 font-semibold rounded-xl
                           shadow-[0_2px_12px_rgba(201,162,39,0.3)]"
                >
                  Enable
                </motion.button>
              </div>
            </div>
          </GlassPanel>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
