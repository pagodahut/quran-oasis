'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronLeft, Check, X, Sparkles, Crown, Zap } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import BottomNav from '@/components/BottomNav';

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

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const featureStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const featureItem = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export default function PremiumPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      const raw = JSON.parse(localStorage.getItem('hifz_early_access') || '[]');
      const stored = Array.isArray(raw) ? raw : [];
      stored.push({ email: email.trim(), date: new Date().toISOString() });
      localStorage.setItem('hifz_early_access', JSON.stringify(stored));
    } catch {
      localStorage.setItem('hifz_early_access', JSON.stringify([{ email: email.trim(), date: new Date().toISOString() }]));
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pb-32">
      <header className="liquid-glass sticky top-0 z-40 safe-area-top">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="p-1 rounded-lg hover:bg-white/5 transition-colors">
              <ChevronLeft className="w-5 h-5 text-night-400" />
            </Link>
            <h1 className="font-display text-xl text-night-100">Premium</h1>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="space-y-6"
        >
          {/* Hero */}
          <motion.div variants={fadeInUp} className="text-center pt-4 pb-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 15, stiffness: 200 }}
              className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gold-400/20 to-gold-600/10
                         border border-gold-500/20 flex items-center justify-center mx-auto mb-5
                         shadow-[0_0_40px_rgba(201,162,39,0.15)]"
            >
              <Crown className="w-10 h-10 text-gold-400" />
            </motion.div>
            <h2 className="text-2xl font-bold text-night-100 mb-2">
              Quran Oasis Premium
            </h2>
            <p className="text-night-400 text-sm leading-relaxed max-w-xs mx-auto">
              Accelerate your Quran memorization journey with AI-powered tools
            </p>
          </motion.div>

          {/* Free Tier */}
          <motion.div variants={fadeInUp}>
            <GlassPanel tint="neutral" blur="md" className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sage-500/15 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-sage-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-night-100">Free</h3>
                </div>
                <span className="text-xs text-sage-400 bg-sage-500/10 px-3 py-1 rounded-full border border-sage-500/20">
                  Current Plan
                </span>
              </div>
              <motion.div variants={featureStagger} initial="hidden" animate="visible" className="space-y-2.5">
                {FREE_FEATURES.map(({ text, included }) => (
                  <motion.div key={text} variants={featureItem} className="flex items-center gap-3 text-sm">
                    {included ? (
                      <div className="w-5 h-5 rounded-full bg-sage-500/15 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-sage-400" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-night-800/60 flex items-center justify-center flex-shrink-0">
                        <X className="w-3 h-3 text-night-600" />
                      </div>
                    )}
                    <span className={included ? 'text-night-200' : 'text-night-500'}>
                      {text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </GlassPanel>
          </motion.div>

          {/* Premium Tier */}
          <motion.div variants={fadeInUp}>
            <GlassPanel tint="gold" blur="md" glow className="p-5 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <span className="bg-gradient-to-r from-gold-500 to-gold-400
                               text-night-950 text-xs font-bold px-4 py-1 rounded-full
                               shadow-[0_2px_12px_rgba(201,162,39,0.4)]">
                  COMING SOON
                </span>
              </div>
              <div className="flex items-center justify-between mb-4 mt-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gold-500/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-gold-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gold-300">Premium</h3>
                </div>
                <span className="text-sm text-gold-400/70">
                  Price TBD
                </span>
              </div>
              <motion.div variants={featureStagger} initial="hidden" animate="visible" className="space-y-2.5">
                {PREMIUM_FEATURES.map(({ text, included }) => (
                  <motion.div key={text} variants={featureItem} className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-gold-500/15 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-gold-400" />
                    </div>
                    <span className="text-night-200">{text}</span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                disabled
                className="w-full mt-5 py-3.5 rounded-xl font-semibold text-sm
                           bg-gold-500/15 text-gold-300 border border-gold-500/20
                           cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Coming Soon
              </motion.button>
            </GlassPanel>
          </motion.div>

          {/* Early Access Signup */}
          <motion.div variants={fadeInUp}>
            <GlassPanel tint="deep" blur="lg" className="p-6 text-center">
              {submitted ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-sage-500/10 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-7 h-7 text-sage-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-night-100 mb-1">
                    JazakAllah Khair!
                  </h3>
                  <p className="text-night-400 text-sm">
                    We&apos;ll notify you when Premium launches, insha&apos;Allah.
                  </p>
                </motion.div>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-night-100 mb-2">
                    Get Early Access
                  </h3>
                  <p className="text-night-400 text-sm mb-5">
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
                               text-night-100 placeholder:text-night-600
                               focus:outline-none focus:ring-1 focus:ring-gold-500/40 focus:border-gold-500/20
                               backdrop-blur-sm"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="px-5 py-2.5 rounded-xl text-sm font-semibold
                               bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 text-night-950
                               shadow-[0_2px_12px_rgba(201,162,39,0.3)]"
                    >
                      Notify Me
                    </motion.button>
                  </form>
                </>
              )}
            </GlassPanel>
          </motion.div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
