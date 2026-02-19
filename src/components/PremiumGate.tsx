'use client';

/**
 * PremiumGate — Wrapper that checks premium status before rendering content.
 * Shows a beautiful upgrade modal when the user exceeds their free tier limit.
 */

import { type ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePremium } from '@/contexts/PremiumContext';
import { SparkleIcon, MosqueIcon, StarIcon, NotesIcon, ReciteIcon } from '@/components/icons';
import Link from 'next/link';

interface PremiumGateProps {
  feature: 'sheikh' | 'study-plan' | 'speech';
  children: ReactNode;
  /** If true, always render children but call onGated when limit hit */
  soft?: boolean;
  onGated?: () => void;
}

export default function PremiumGate({ feature, children, soft, onGated }: PremiumGateProps) {
  const { canUsePremiumFeature, sheikInteractionsToday, maxFreeInteractions } = usePremium();
  const [showModal, setShowModal] = useState(false);

  const allowed = canUsePremiumFeature(feature);

  if (allowed) return <>{children}</>;

  if (soft) {
    // In soft mode, render children but trigger modal callback
    if (onGated) onGated();
    return <>{children}</>;
  }

  return (
    <>
      {/* Blurred/locked content hint */}
      <div className="relative">
        <div className="opacity-40 blur-[2px] pointer-events-none select-none">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="px-6 py-3 rounded-2xl font-semibold
                       bg-gradient-to-r from-amber-600 to-amber-500 
                       text-black shadow-lg shadow-amber-500/25
                       flex items-center gap-2"
          >
            <SparkleIcon size={18} />
            <span>Unlock Premium</span>
          </motion.button>
        </div>
      </div>

      <PremiumUpgradeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        feature={feature}
        usedCount={sheikInteractionsToday}
        maxCount={maxFreeInteractions}
      />
    </>
  );
}

/** Standalone upgrade modal — can also be used independently */
export function PremiumUpgradeModal({
  isOpen,
  onClose,
  feature,
  usedCount,
  maxCount,
}: {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
  usedCount?: number;
  maxCount?: number;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 
                       max-w-md mx-auto
                       bg-gradient-to-b from-gray-900 to-gray-950
                       border border-amber-500/20
                       rounded-3xl p-6 shadow-2xl"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ rotate: -10 }}
                animate={{ rotate: 0 }}
                transition={{ type: 'spring', damping: 8 }}
                className="text-5xl mb-3"
              >
                <SparkleIcon size={48} />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Upgrade to Premium
              </h2>
              {feature === 'sheikh' && usedCount !== undefined && maxCount !== undefined && (
                <p className="text-gray-400 text-sm">
                  You&apos;ve used {usedCount}/{maxCount} free Sheikh conversations today
                </p>
              )}
              {feature === 'study-plan' && (
                <p className="text-gray-400 text-sm">
                  AI-generated study plans are a premium feature
                </p>
              )}
              {feature === 'speech' && (
                <p className="text-gray-400 text-sm">
                  Advanced speech recognition is a premium feature
                </p>
              )}
            </div>

            {/* Benefits */}
            <div className="space-y-3 mb-6">
              {[
                { icon: <MosqueIcon size={20} />, text: 'Unlimited Sheikh AI conversations' },
                { icon: <NotesIcon size={20} />, text: 'AI-powered personalized study plans' },
                { icon: <ReciteIcon size={20} />, text: 'Advanced speech recognition & tajweed analysis' },
                { icon: <StarIcon size={20} />, text: 'Priority support & early access to new features' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm">
                  <span className="text-lg">{icon}</span>
                  <span className="text-gray-200">{text}</span>
                </div>
              ))}
            </div>

            {/* Free tier reminder */}
            <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/10">
              <p className="text-xs text-gray-400 text-center">
                <span className="text-amber-400 font-medium">Free tier includes:</span>{' '}
                All lessons, quizzes, flashcards, recitation practice, progress tracking,
                and 3 daily Sheikh conversations.
              </p>
            </div>

            {/* CTA */}
            <Link href="/premium">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-2xl font-semibold text-base text-center
                           bg-gradient-to-r from-amber-600 to-amber-500 
                           text-black shadow-lg shadow-amber-500/25 mb-3"
              >
                View Premium Plans
              </motion.div>
            </Link>

            <button
              onClick={onClose}
              className="w-full py-3 text-gray-400 text-sm hover:text-gray-300 transition-colors"
            >
              Maybe later
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
