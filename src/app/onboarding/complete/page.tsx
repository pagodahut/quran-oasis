'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  UserPlus,
  ArrowRight,
  Shield,
  Cloud,
  Smartphone,
} from 'lucide-react';

export default function OnboardingCompletePage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const [onboardingData, setOnboardingData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    // Load onboarding data from localStorage
    const stored = localStorage.getItem('quranOasis_onboarding');
    if (stored) {
      setOnboardingData(JSON.parse(stored));
    }
  }, []);

  // If user is already signed in, redirect to dashboard
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // Sync localStorage data to server
      syncOnboardingData();
      router.push('/dashboard');
    }
  }, [isLoaded, isSignedIn]);

  const syncOnboardingData = async () => {
    const stored = localStorage.getItem('quranOasis_onboarding');
    if (!stored) return;

    try {
      await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: stored,
      });
    } catch {
      // Will sync later
    }
  };

  const skipForNow = () => {
    localStorage.setItem('quranOasis_guestMode', 'true');
    router.push('/dashboard');
  };

  const benefits = [
    {
      icon: Cloud,
      title: 'Sync Across Devices',
      desc: 'Your progress follows you everywhere',
    },
    {
      icon: Shield,
      title: 'Never Lose Progress',
      desc: 'Your memorization data is safely backed up',
    },
    {
      icon: Smartphone,
      title: 'Personalized Plan',
      desc: 'AI-powered study plan based on your onboarding',
    },
  ];

  return (
    <div className="min-h-screen bg-night-950 flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <Link href="/" className="mb-8 flex items-center gap-2">
        <Image
          src="/hifz-logo.svg"
          alt="HIFZ"
          width={40}
          height={40}
          className="w-10 h-10"
        />
        <span className="text-2xl font-bold text-night-100">HIFZ</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Success badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(134,169,113,0.95) 0%, rgba(100,140,90,1) 100%)',
            boxShadow: '0 8px 32px rgba(134,169,113,0.4)',
          }}
        >
          <Sparkles className="w-8 h-8 text-white" />
        </motion.div>

        <h1 className="text-2xl font-display text-night-100 text-center mb-2">
          Your Journey Awaits!
        </h1>
        <p className="text-night-400 text-center mb-8">
          Create a free account to save your preferences and track your progress
        </p>

        {/* Benefits */}
        <div className="space-y-3 mb-8">
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-4 p-4 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(201,162,39,0.2) 0%, rgba(201,162,39,0.1) 100%)',
                  border: '1px solid rgba(201,162,39,0.2)',
                }}
              >
                <benefit.icon className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <p className="text-night-100 font-medium text-sm">{benefit.title}</p>
                <p className="text-night-500 text-xs">{benefit.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          {/* Primary: Create Account */}
          <Link href="/sign-up">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-base font-semibold"
              style={{
                background: 'linear-gradient(135deg, rgba(201,162,39,0.95) 0%, rgba(180,140,30,1) 100%)',
                color: '#0a0a0f',
                boxShadow: '0 8px 32px rgba(201,162,39,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <UserPlus className="w-5 h-5" />
              Create Free Account
            </motion.button>
          </Link>

          {/* Secondary: Sign In */}
          <Link href="/sign-in">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-base font-medium text-night-200 mt-3"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              Already have an account? Sign in
            </motion.button>
          </Link>

          {/* Skip */}
          <button
            onClick={skipForNow}
            className="w-full py-3 text-night-500 hover:text-night-300 transition-colors text-sm flex items-center justify-center gap-1"
          >
            Skip for now — continue as guest
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        <p className="text-night-600 text-xs text-center mt-6">
          You can always create an account later from Settings
        </p>
      </motion.div>
    </div>
  );
}
