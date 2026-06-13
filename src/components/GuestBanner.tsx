'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, X, Cloud, Shield } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';

export default function GuestBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
        className="mb-2"
      >
        <GlassPanel tint="gold" blur="md" className="p-4 relative">
          <div className="relative z-10">
            <button
              onClick={() => setDismissed(true)}
              className="absolute top-0 right-0 p-1.5 rounded-lg text-night-500 hover:text-night-300 hover:bg-white/5 transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3 pr-6">
              <div className="w-10 h-10 rounded-xl bg-gold-500/15 flex items-center justify-center flex-shrink-0 border border-gold-500/20">
                <Cloud className="w-5 h-5 text-gold-400" />
              </div>
              <div className="flex-1">
                <p className="text-night-100 text-sm font-semibold mb-1">
                  You&apos;re in guest mode
                </p>
                <p className="text-night-400 text-xs mb-3 leading-relaxed">
                  Your progress is saved locally. Create an account to sync across devices and unlock AI features.
                </p>
                <Link href="/sign-up">
                  <motion.span
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg
                             bg-gold-500/15 text-gold-400 border border-gold-500/20 hover:bg-gold-500/25 transition-colors"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    Create free account
                  </motion.span>
                </Link>
              </div>
            </div>
          </div>
        </GlassPanel>
      </motion.div>
    </AnimatePresence>
  );
}
