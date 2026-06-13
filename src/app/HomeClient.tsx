'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import {
  BookOpen,
  Sparkles,
  ChevronRight,
  Heart,
  Headphones,
  Brain,
  ArrowRight,
} from 'lucide-react';
import { HifzLogo, HifzIconSimple } from '@/components/brand/HifzLogo';
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from '@clerk/nextjs';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 2000 / steps);
    return () => clearInterval(timer);
  }, [isVisible, value]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroY = useSpring(useTransform(scrollYProgress, [0, 0.3], [0, -60]), { stiffness: 50, damping: 20 });

  return (
    <div ref={containerRef} className="min-h-screen" style={{ background: 'var(--theme-surface)' }}>

      {/* Header — quiet, typographic */}
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: 'var(--theme-surface)',
          borderBottom: '1px solid var(--theme-border-subtle)',
        }}
      >
        <div className="px-6 py-3 max-w-5xl mx-auto flex items-center justify-between">
          <HifzLogo iconSize={28} animated={false} />

          <nav className="flex items-center gap-4">
            <Link
              href="/mushaf"
              className="text-sm font-medium hidden sm:block px-2 py-1.5 rounded-lg transition-colors"
              style={{ color: 'var(--theme-text-secondary)' }}
            >
              Quran
            </Link>
            <Link
              href="/techniques"
              className="text-sm font-medium hidden sm:block px-2 py-1.5 rounded-lg transition-colors"
              style={{ color: 'var(--theme-text-secondary)' }}
            >
              Methods
            </Link>
            <Link
              href="/lessons"
              className="text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
              style={{
                background: 'var(--ambient-gold-subtle)',
                color: 'var(--ambient-gold)',
              }}
            >
              Lessons
            </Link>

            <SignedOut>
              <SignInButton mode="modal">
                <button
                  className="text-sm font-medium px-2 py-1.5 rounded-lg transition-colors"
                  style={{ color: 'var(--theme-text-secondary)' }}
                >
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={{ elements: { avatarBox: "w-8 h-8" } }}
              />
            </SignedIn>
          </nav>
        </div>
      </header>

      {/* Hero — manuscript-style, verse-first */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="text-center max-w-3xl"
        >
          {/* Bismillah — gold leaf, generous size */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-10"
          >
            <div
              className="inline-block px-8 py-3 rounded-lg"
              style={{
                border: '1px solid var(--panel-border-gold)',
                background: 'var(--ambient-gold-subtle)',
              }}
            >
              <p
                className="text-2xl md:text-3xl"
                style={{
                  fontFamily: 'var(--font-quran)',
                  direction: 'rtl',
                  color: 'var(--ambient-gold)',
                }}
              >
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
            </div>
          </motion.div>

          {/* Headline — editorial, serif-forward */}
          <motion.h1
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="text-4xl md:text-6xl lg:text-7xl mb-8 leading-tight"
            style={{ fontFamily: 'var(--font-display), var(--font-serif), Georgia, serif', color: 'var(--theme-text)' }}
          >
            <motion.span variants={fadeIn} className="block">Your Journey to</motion.span>
            <motion.span variants={fadeIn} className="block mt-2">
              <span style={{ color: 'var(--ambient-gold)', fontWeight: 700, letterSpacing: '0.05em' }}>HIFZ</span>
              {' '}Starts Here
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'var(--theme-text-secondary)' }}
          >
            Memorize the Quran with personalized lessons,
            beautiful recitations, and time-tested techniques from traditional Tahfiz schools.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
          >
            <SignedIn>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-base font-medium transition-transform hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'var(--ambient-gold)', color: '#fff' }}
              >
                Continue Learning <ArrowRight className="w-4 h-4" />
              </Link>
            </SignedIn>
            <SignedOut>
              <SignUpButton mode="modal">
                <button
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-base font-medium transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: 'var(--ambient-gold)', color: '#fff' }}
                >
                  <Sparkles className="w-5 h-5" />
                  Begin Your Journey
                </button>
              </SignUpButton>
            </SignedOut>
            <Link
              href="/mushaf"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-base font-medium transition-colors"
              style={{
                border: '1px solid var(--theme-border)',
                color: 'var(--theme-text-secondary)',
              }}
            >
              <BookOpen className="w-5 h-5" />
              Explore the Quran
            </Link>
          </motion.div>

          {/* Subtle feature badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap items-center justify-center gap-6 text-sm"
            style={{ color: 'var(--theme-text-muted)' }}
          >
            {[
              { icon: BookOpen, label: '6,236 Verses' },
              { icon: Headphones, label: 'Multiple Reciters' },
              { icon: Brain, label: 'AI-Powered' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <item.icon className="w-4 h-4" style={{ color: 'var(--ambient-gold)' }} />
                <span>{item.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features — clean cards with subtle borders, no glass */}
      <section className="px-6 py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="max-w-5xl mx-auto"
        >
          <motion.div variants={fadeIn} className="text-center mb-16">
            <h2
              className="text-3xl md:text-5xl mb-4"
              style={{ fontFamily: 'var(--font-display), Georgia, serif', color: 'var(--theme-text)' }}
            >
              The Path to Memorization
            </h2>
            <p className="max-w-xl mx-auto text-lg" style={{ color: 'var(--theme-text-secondary)' }}>
              Everything you need for a successful Hifz journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                arabic: 'تِلَاوَة',
                title: 'Recite & Get Feedback',
                desc: 'Real-time voice recognition tracks your recitation word-by-word with accuracy scoring.',
              },
              {
                arabic: 'كَشْف',
                title: 'Recite to Reveal',
                desc: 'Text stays hidden until you recite correctly — the ultimate memorization test.',
              },
              {
                arabic: 'تَمْيِيز',
                title: 'Identify Any Verse',
                desc: 'Like Shazam for Quran — recite any ayah and instantly find which surah it belongs to.',
              },
            ].map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeIn}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl text-center transition-shadow"
                style={{
                  background: 'var(--theme-card)',
                  border: '1px solid var(--theme-border)',
                }}
              >
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-5"
                  style={{
                    background: 'var(--ambient-gold-subtle)',
                    border: '1px solid var(--panel-border-gold)',
                  }}
                >
                  <span
                    className="text-2xl font-bold"
                    style={{
                      fontFamily: 'var(--font-arabic)',
                      direction: 'rtl',
                      color: 'var(--ambient-gold)',
                    }}
                  >
                    {feature.arabic}
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--theme-text)' }}>
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--theme-text-secondary)' }}>
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Method Section */}
      <section className="px-6 py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={fadeIn} className="text-center mb-12">
            <h2
              className="text-3xl md:text-5xl mb-4"
              style={{ fontFamily: 'var(--font-display), Georgia, serif', color: 'var(--theme-text)' }}
            >
              Traditional Methods, Modern Tools
            </h2>
            <p className="max-w-xl mx-auto text-lg" style={{ color: 'var(--theme-text-secondary)' }}>
              Centuries-old Tahfiz methodology with cutting-edge technology
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { num: '10-3', title: 'The 10-3 Method', desc: 'Read 10 times while looking, then recite 3 times from memory. Time-tested in Tahfiz schools worldwide.' },
              { num: '70/30', title: 'Review Balance', desc: '70% review of memorized verses, 30% new material. The optimal ratio for long-term retention.' },
              { num: 'سبق', title: 'Sabaq System', desc: 'Daily Sabaq (new), Sabqi (recent), and Manzil (old) — the traditional three-part revision system.' },
              { num: 'AI', title: 'Intelligent Assistance', desc: 'AI listens to your recitation and provides gentle corrections to help perfect your tajweed.' },
            ].map((method) => (
              <motion.div
                key={method.title}
                variants={fadeIn}
                className="flex gap-4 p-5 rounded-2xl"
                style={{
                  background: 'var(--theme-card)',
                  border: '1px solid var(--theme-border)',
                }}
              >
                <div
                  className="flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'var(--ambient-gold-subtle)',
                    border: '1px solid var(--panel-border-gold)',
                  }}
                >
                  <span
                    className="font-bold text-lg"
                    style={{
                      color: 'var(--ambient-gold)',
                      fontFamily: method.num === 'سبق' ? 'var(--font-arabic)' : 'inherit',
                    }}
                  >
                    {method.num}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: 'var(--theme-text)' }}>{method.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--theme-text-secondary)' }}>{method.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Pull Quote */}
      <section className="px-6 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <div
            className="py-12 px-8"
            style={{ borderTop: '1px solid var(--theme-border)', borderBottom: '1px solid var(--theme-border)' }}
          >
            <p
              className="text-2xl md:text-3xl italic leading-relaxed mb-6"
              style={{ fontFamily: 'var(--font-serif), Georgia, serif', color: 'var(--theme-text)' }}
            >
              &ldquo;The best among you are those who learn the Quran and teach it.&rdquo;
            </p>
            <p className="text-sm font-medium" style={{ color: 'var(--ambient-gold)' }}>
              Prophet Muhammad (peace be upon him) — Bukhari
            </p>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="px-6 py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-3xl mx-auto"
        >
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-xl overflow-hidden"
            style={{ background: 'var(--theme-border)' }}
          >
            {[
              { value: 6236, label: 'Verses', suffix: '' },
              { value: 114, label: 'Surahs', suffix: '' },
              { value: 30, label: 'Juz', suffix: '' },
              { value: 50, label: 'Lessons', suffix: '+' },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeIn}
                className="p-6 text-center"
                style={{ background: 'var(--theme-card)' }}
              >
                <div className="text-3xl font-serif tabular-nums mb-1" style={{ color: 'var(--ambient-gold)' }}>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <div
            className="rounded-2xl p-10 md:p-14"
            style={{
              background: 'var(--ambient-gold-subtle)',
              border: '1px solid var(--panel-border-gold)',
            }}
          >
            <h2
              className="text-3xl md:text-4xl mb-4"
              style={{ fontFamily: 'var(--font-display), Georgia, serif', color: 'var(--theme-text)' }}
            >
              Every Hafiz Started with One Verse
            </h2>
            <p className="mb-8 max-w-md mx-auto" style={{ color: 'var(--theme-text-secondary)' }}>
              Join Muslims around the world on the blessed journey of Quran memorization.
            </p>

            <SignedIn>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-base font-medium transition-transform hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'var(--ambient-gold)', color: '#fff' }}
              >
                Go to Dashboard <ArrowRight className="w-5 h-5" />
              </Link>
            </SignedIn>
            <SignedOut>
              <SignUpButton mode="modal">
                <button
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-base font-medium transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: 'var(--ambient-gold)', color: '#fff' }}
                >
                  Start Today — Free <Sparkles className="w-5 h-5" />
                </button>
              </SignUpButton>
            </SignedOut>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer
        className="px-6 py-8"
        style={{ borderTop: '1px solid var(--theme-border-subtle)' }}
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--theme-text-muted)' }}>
            <HifzIconSimple size={20} />
            <span className="font-semibold tracking-wider">HIFZ</span>
          </div>
          <p className="text-sm flex items-center gap-1.5" style={{ color: 'var(--theme-text-muted)' }}>
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for the Ummah
          </p>
          <div className="flex items-center gap-5 text-sm flex-wrap justify-center" style={{ color: 'var(--theme-text-muted)' }}>
            <Link href="/lessons" className="hover:opacity-70 transition-opacity">Lessons</Link>
            <Link href="/surahs" className="hover:opacity-70 transition-opacity">Surahs</Link>
            <Link href="/privacy" className="hover:opacity-70 transition-opacity">Privacy</Link>
            <Link href="/terms" className="hover:opacity-70 transition-opacity">Terms</Link>
            <Link href="/support" className="hover:opacity-70 transition-opacity">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
