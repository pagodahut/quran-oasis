'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Sparkles, 
  Play, 
  ChevronRight,
  Moon,
  Star,
  Heart,
  Headphones,
  Brain,
  Trophy,
  Flame,
  ArrowRight,
  Quote,
  Users,
  Clock,
  Target,
  Zap
} from 'lucide-react';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

// Floating particles component
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-gold-400/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

// Animated counter
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
    const duration = 2000;
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
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isVisible, value]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  // Parallax transforms
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  
  // Smooth spring animations
  const smoothY = useSpring(heroY, { stiffness: 50, damping: 20 });

  return (
    <div ref={containerRef} className="min-h-screen relative overflow-x-hidden">
      {/* Animated Background */}
      <motion.div 
        className="fixed inset-0 bg-gradient-divine"
        style={{ scale: bgScale }}
      />
      <div className="fixed inset-0 pattern-overlay" />
      <FloatingParticles />
      
      {/* Decorative orbs with parallax */}
      <motion.div 
        className="fixed top-20 left-10 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[100px]"
        style={{ y: smoothY }}
      />
      <motion.div 
        className="fixed bottom-40 right-10 w-[600px] h-[600px] bg-sage-500/5 rounded-full blur-[120px]"
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, 150]) }}
      />
      <motion.div 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-midnight-500/3 rounded-full blur-[150px]"
      />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 liquid-glass">
          <div className="px-6 py-4 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center shadow-glow-gold">
                  <Moon className="w-5 h-5 text-night-950" />
                </div>
                <span className="font-display text-xl text-night-100 font-semibold">Quran Oasis</span>
              </motion.div>
              
              <motion.nav
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4"
              >
                <Link href="/mushaf" className="text-night-400 hover:text-night-100 transition-colors text-sm font-medium">
                  Quran
                </Link>
                <Link href="/techniques" className="text-night-400 hover:text-night-100 transition-colors text-sm font-medium">
                  Methods
                </Link>
                <Link 
                  href="/lessons"
                  className="liquid-pill text-sm font-medium text-night-100"
                >
                  My Lessons
                </Link>
              </motion.nav>
            </div>
          </div>
        </header>

        {/* Hero Section with Parallax */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-24">
          <motion.div
            style={{ y: smoothY, opacity: heroOpacity }}
            className="text-center max-w-3xl"
          >
            {/* Animated Bismillah */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="relative mb-8"
            >
              <motion.div
                className="absolute inset-0 blur-2xl bg-gold-500/20 rounded-full"
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.3, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <p className="bismillah relative text-3xl md:text-4xl text-glow-gold">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
            </motion.div>
            
            {/* Main Headline with staggered animation */}
            <motion.h1 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="font-display text-5xl md:text-7xl text-night-100 mb-6 leading-tight"
            >
              <motion.span variants={fadeInUp} className="block">Your Journey to</motion.span>
              <motion.span variants={fadeInUp} className="block">
                <span className="relative">
                  <span className="gold-accent text-glow-gold">Hifz</span>
                  <motion.span
                    className="absolute -inset-2 bg-gold-500/10 rounded-xl -z-10"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </span>
                {' '}Starts Here
              </motion.span>
            </motion.h1>
            
            {/* Subheadline */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-night-300 text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed"
            >
              Memorize the Quran with AI-powered personalized lessons, 
              beautiful recitations, and time-tested techniques from traditional Tahfiz schools.
            </motion.p>

            {/* CTA Buttons - Liquid Glass Style */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Link href="/onboarding/welcome" className="group relative">
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-gold-500 to-gold-400 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity"
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <span className="relative liquid-btn text-base px-8 py-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Begin Your Journey
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link href="/mushaf" className="liquid-btn-outline text-base px-8 py-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Explore the Quran
              </Link>
            </motion.div>

            {/* Animated Stats Row */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex flex-wrap items-center justify-center gap-8 text-sm"
            >
              {[
                { icon: BookOpen, label: '114 Surahs', color: 'text-sage-500' },
                { icon: Headphones, label: '5 Reciters', color: 'text-gold-500' },
                { icon: Brain, label: 'AI-Powered', color: 'text-purple-400' },
                { icon: Users, label: 'Free Forever', color: 'text-blue-400' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + i * 0.1 }}
                  className="flex items-center gap-2 text-night-400"
                >
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  <span>{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          
          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-10"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 rounded-full border-2 border-night-700 flex items-start justify-center p-1.5"
            >
              <motion.div className="w-1.5 h-3 bg-gold-500 rounded-full" />
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-24 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-5xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="font-display text-3xl md:text-4xl text-night-100 mb-4">
                The Path to Memorization
              </h2>
              <p className="text-night-400 max-w-xl mx-auto">
                Everything you need for a successful Hifz journey
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { 
                  icon: Star, 
                  title: 'Personalized Learning',
                  description: 'AI creates a custom study plan based on your level, goals, and available time',
                  gradient: 'from-gold-500 to-amber-500'
                },
                { 
                  icon: Zap, 
                  title: 'Spaced Repetition',
                  description: 'Science-backed review system ensures you never forget what you\'ve memorized',
                  gradient: 'from-purple-500 to-pink-500'
                },
                { 
                  icon: Trophy, 
                  title: 'Track Progress',
                  description: 'Beautiful visualizations show your journey from first verse to full Hifz',
                  gradient: 'from-sage-500 to-emerald-500'
                },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  variants={scaleIn}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="liquid-card-interactive p-6"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-night-100 text-xl mb-3">{feature.title}</h3>
                  <p className="text-night-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Method Section with Parallax Cards */}
        <section className="px-6 py-24 relative overflow-hidden">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-5xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="font-display text-3xl md:text-4xl text-night-100 mb-4">
                Traditional Methods, Modern Tools
              </h2>
              <p className="text-night-400 max-w-xl mx-auto">
                We combine centuries-old Tahfiz methodology with cutting-edge technology
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { number: '10-3', title: 'The 10-3 Method', description: 'Read 10 times while looking, then recite 3 times from memory. Time-tested technique used in Tahfiz schools worldwide.' },
                { number: '70/30', title: 'Review Balance', description: '70% review of memorized verses, 30% new material. The optimal ratio for long-term retention.' },
                { number: 'سبق', title: 'Sabaq System', description: 'Daily structure of Sabaq (new), Sabqi (recent), and Manzil (old) - the traditional three-part revision system.' },
                { number: 'AI', title: 'Intelligent Assistance', description: 'AI listens to your recitation and provides gentle corrections to help perfect your tajweed.' },
              ].map((method, i) => (
                <motion.div
                  key={method.title}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                  className="flex gap-5 p-5 liquid-card-interactive"
                >
                  <motion.div 
                    className="flex-shrink-0 w-20 h-20 rounded-2xl liquid-glass-gold flex items-center justify-center"
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="text-gold-400 font-display text-xl font-bold">{method.number}</span>
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-night-100 text-lg mb-2">{method.title}</h3>
                    <p className="text-night-400 text-sm leading-relaxed">{method.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Testimonial/Quote Section */}
        <section className="px-6 py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <div className="liquid-glass-gold rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
              <Quote className="w-12 h-12 text-gold-500/30 mx-auto mb-6" />
              <p className="text-xl md:text-2xl text-night-100 italic leading-relaxed mb-6">
                "The best among you are those who learn the Quran and teach it."
              </p>
              <p className="text-gold-400 font-medium">— Prophet Muhammad ﷺ (Bukhari)</p>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-sage-500/5 rounded-full blur-2xl" />
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="px-6 py-24 bg-night-950/50">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: 6236, label: 'Verses', suffix: '' },
                { value: 114, label: 'Surahs', suffix: '' },
                { value: 30, label: 'Juz', suffix: '' },
                { value: 100, label: 'Free Forever', suffix: '%' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  variants={scaleIn}
                  className="text-center p-6 liquid-card"
                >
                  <div className="text-4xl md:text-5xl font-bold text-gold-400 mb-2">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-night-400 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Final CTA Section */}
        <section className="px-6 py-24">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="liquid-glass-gold rounded-3xl p-10 md:p-16 relative overflow-hidden">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-4 right-4 opacity-10"
              >
                <Star className="w-16 h-16 text-gold-400" />
              </motion.div>
              
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Flame className="w-16 h-16 text-gold-400 mx-auto mb-6" />
              </motion.div>
              
              <h2 className="font-display text-3xl md:text-4xl text-night-100 mb-4">
                Every Hafiz Started with One Verse
              </h2>
              <p className="text-night-300 mb-8 max-w-md mx-auto">
                Join Muslims around the world on the blessed journey of Quran memorization.
              </p>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="/onboarding/welcome" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-3">
                  Start Today — It's Free
                  <Sparkles className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="p-6 border-t border-night-800/50 safe-area-bottom">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-night-500 text-sm">
              <Moon className="w-4 h-4 text-gold-500" />
              <span>Quran Oasis</span>
            </div>
            <p className="text-night-500 text-sm">
              Made with ❤️ for the Ummah
            </p>
            <div className="flex items-center gap-6 text-sm text-night-500">
              <Link href="/lessons" className="hover:text-night-300 transition-colors">Lessons</Link>
              <Link href="/techniques" className="hover:text-night-300 transition-colors">Techniques</Link>
              <Link href="/mushaf" className="hover:text-night-300 transition-colors">Quran</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
