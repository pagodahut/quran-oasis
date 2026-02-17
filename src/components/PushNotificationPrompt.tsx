'use client';

import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    // Delay check to not compete with install prompt
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
          className="fixed bottom-24 left-4 right-4 z-40 safe-area-bottom"
        >
          <div className="bg-night-900/95 backdrop-blur-xl border border-gold-500/20 rounded-2xl p-4 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gold-500/10 rounded-xl shrink-0">
                <Bell className="w-5 h-5 text-gold-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-night-100 text-sm font-medium">
                  Stay on track with reminders
                </p>
                <p className="text-night-400 text-xs mt-0.5">
                  Get daily review reminders and streak alerts
                </p>
              </div>
              <button onClick={handleDismiss} className="p-1 text-night-500 hover:text-night-300">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleDismiss}
                className="flex-1 py-2 text-sm text-night-400 hover:text-night-300 rounded-lg transition-colors"
              >
                Not now
              </button>
              <button
                onClick={handleEnable}
                className="flex-1 py-2 text-sm bg-gold-500 hover:bg-gold-400 text-night-950 font-medium rounded-lg transition-colors"
              >
                Enable
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
