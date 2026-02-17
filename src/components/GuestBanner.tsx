'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, X, Cloud } from 'lucide-react';

export default function GuestBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="relative rounded-2xl p-4 mb-2"
        style={{
          background: 'linear-gradient(135deg, rgba(201,162,39,0.12) 0%, rgba(201,162,39,0.04) 100%)',
          border: '1px solid rgba(201,162,39,0.2)',
        }}
      >
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-3 right-3 p-1 text-night-500 hover:text-night-300 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3 pr-6">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{
              background: 'linear-gradient(135deg, rgba(201,162,39,0.2) 0%, rgba(201,162,39,0.1) 100%)',
            }}
          >
            <Cloud className="w-4 h-4 text-gold-400" />
          </div>
          <div className="flex-1">
            <p className="text-night-200 text-sm font-medium mb-1">
              You&apos;re in guest mode
            </p>
            <p className="text-night-500 text-xs mb-3">
              Your progress is saved locally. Create an account to sync across devices and never lose your data.
            </p>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-gold-400 hover:text-gold-300 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Create free account
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
