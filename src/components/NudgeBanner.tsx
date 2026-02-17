'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart } from 'lucide-react';

interface NudgeBannerProps {
  message: string | null;
  type?: string;
  variant?: 'card' | 'toast';
}

export default function NudgeBanner({ message, type, variant = 'card' }: NudgeBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setDismissed(false);
      // Small delay for toast appearance
      const timer = setTimeout(() => setVisible(true), variant === 'toast' ? 500 : 0);
      return () => clearTimeout(timer);
    }
  }, [message, variant]);

  // Auto-dismiss toast after 8 seconds
  useEffect(() => {
    if (variant === 'toast' && visible) {
      const timer = setTimeout(() => setDismissed(true), 8000);
      return () => clearTimeout(timer);
    }
  }, [variant, visible]);

  if (!message || dismissed) return null;

  if (variant === 'toast') {
    return (
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-4 left-1/2 z-50 max-w-sm w-[90vw]"
          >
            <div className="bg-night-900/95 border border-gold-500/20 rounded-2xl p-4 shadow-2xl backdrop-blur-xl">
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                <p className="text-night-200 text-sm flex-1 leading-relaxed">{message}</p>
                <button
                  onClick={() => setDismissed(true)}
                  className="text-night-500 hover:text-night-300 transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Card variant (inline in dashboard)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl p-4 bg-night-900/60 border border-night-800/50"
    >
      <div className="flex items-start gap-3">
        <Heart className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
        <p className="text-night-300 text-sm leading-relaxed flex-1">{message}</p>
      </div>
    </motion.div>
  );
}
