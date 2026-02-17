'use client';

/**
 * Premium Landing Page
 * 
 * Beautiful comparison of Free vs Premium tiers.
 * "Launching Soon" with email signup for early access.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const FREE_FEATURES = [
  { text: 'All 114 Surah lessons & quizzes', included: true },
  { text: 'Flashcard memorization system', included: true },
  { text: 'Basic recitation practice', included: true },
  { text: 'Progress tracking & streaks', included: true },
  { text: 'Bookmarks & notes', included: true },
  { text: '3 daily Sheikh AI conversations', included: true },
  { text: 'Unlimited Sheikh AI access', included: false },
  { text: 'AI-generated study plans', included: false },
  { text: 'Advanced speech recognition', included: false },
  { text: 'Priority support', included: false },
];

const PREMIUM_FEATURES = [
  { text: 'Everything in Free', included: true },
  { text: 'Unlimited Sheikh AI conversations', included: true },
  { text: 'AI-powered personalized study plans', included: true },
  { text: 'Advanced tajweed speech analysis', included: true },
  { text: 'Priority support & feature requests', included: true },
  { text: 'Early access to new features', included: true },
];

export default function PremiumPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // Just store in localStorage for now — no backend
    const stored = JSON.parse(localStorage.getItem('hifz_early_access') || '[]');
    stored.push({ email: email.trim(), date: new Date().toISOString() });
    localStorage.setItem('hifz_early_access', JSON.stringify(stored));
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Back button */}
      <div className="p-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
      </div>

      <div className="max-w-lg mx-auto px-4 pb-24">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <span className="text-5xl mb-4 block">✨</span>
          <h1 className="text-3xl font-bold text-white mb-3">
            HIFZ Premium
          </h1>
          <p className="text-gray-400">
            Accelerate your Quran memorization journey with AI-powered tools
          </p>
        </motion.div>

        {/* Comparison Cards */}
        <div className="space-y-4 mb-10">
          {/* Free Tier */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Free</h2>
              <span className="text-sm text-green-400 bg-green-400/10 px-3 py-1 rounded-full">
                Current Plan
              </span>
            </div>
            <div className="space-y-2.5">
              {FREE_FEATURES.map(({ text, included }) => (
                <div key={text} className="flex items-center gap-3 text-sm">
                  {included ? (
                    <svg className="w-4 h-4 text-green-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-gray-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  <span className={included ? 'text-gray-200' : 'text-gray-500'}>
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Premium Tier */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative bg-gradient-to-b from-amber-500/10 to-amber-600/5 
                       border border-amber-500/30 rounded-2xl p-5
                       shadow-lg shadow-amber-500/10"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-gradient-to-r from-amber-600 to-amber-500 
                             text-black text-xs font-bold px-4 py-1 rounded-full">
                COMING SOON
              </span>
            </div>
            <div className="flex items-center justify-between mb-4 mt-1">
              <h2 className="text-lg font-semibold text-amber-300">Premium</h2>
              <span className="text-sm text-amber-400">
                Price TBD
              </span>
            </div>
            <div className="space-y-2.5">
              {PREMIUM_FEATURES.map(({ text, included }) => (
                <div key={text} className="flex items-center gap-3 text-sm">
                  {included ? (
                    <svg className="w-4 h-4 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-gray-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  <span className="text-gray-200">{text}</span>
                </div>
              ))}
            </div>

            {/* Coming Soon Button */}
            <button
              disabled
              className="w-full mt-5 py-3 rounded-xl font-semibold text-sm
                         bg-amber-500/20 text-amber-300 border border-amber-500/30
                         cursor-not-allowed"
            >
              🚀 Coming Soon
            </button>
          </motion.div>
        </div>

        {/* Early Access Email Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center"
        >
          {submitted ? (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <span className="text-4xl mb-3 block">🤲</span>
              <h3 className="text-lg font-semibold text-white mb-1">
                JazakAllah Khair!
              </h3>
              <p className="text-gray-400 text-sm">
                We&apos;ll notify you when Premium launches, insha&apos;Allah.
              </p>
            </motion.div>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-white mb-2">
                Get Early Access
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Be the first to know when Premium launches
              </p>
              <form onSubmit={handleEmailSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm
                           bg-white/5 border border-white/10
                           text-white placeholder:text-gray-500
                           focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold
                           bg-gradient-to-r from-amber-600 to-amber-500 text-black
                           shadow-lg shadow-amber-500/25"
                >
                  Notify Me
                </motion.button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
