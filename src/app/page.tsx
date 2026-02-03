'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Sparkles, 
  ChevronRight,
  Heart,
  Headphones,
  Brain,
  Flame,
  ArrowRight,
  Quote,
  User,
} from 'lucide-react';
import { HifzLogo, HifzIcon, HifzIconSimple } from '@/components/brand/HifzLogo';
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from '@clerk/nextjs';

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

// Geometric diamond accent - subtle Islamic-inspired motif
function GeometricAccent({ className = "", size = 8 }: { className?: string; size?: number }) {
  return (
    <svg 
      viewBox="0 0 12 12" 
      width={size} 
      height={size} 
      className={className}
      fill="currentColor"
    >
      <path d="M6 0L12 6L6 12L0 6Z" />
    </svg>
  );
}

// Elegant gold divider with Islamic-inspired center ornament
function GeometricDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div 
        className="flex-1 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(201, 162, 39, 0.4) 100%)'
        }}
      />
      <svg 
        viewBox="0 0 24 24" 
        width={20} 
        height={20} 
        className="text-gold-500"
      >
        {/* 8-pointed star (Islamic geometric motif) */}
        <path 
          d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" 
          fill="currentColor" 
          opacity="0.6"
        />
        <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.8" />
      </svg>
      <div 
        className="flex-1 h-px"
        style={{
          background: 'linear-gradient(90deg, rgba(201, 162, 39, 0.4) 0%, transparent 100%)'
        }}
      />
    </div>
  );
}

// Scroll-animated golden star with circle forming around it
function ScrollAnimatedStar() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // Circle draws as you scroll (0 to 1)
  const circleProgress = useTransform(scrollYProgress, [0.2, 0.6], [0, 1]);
  // Star grows slightly
  const starScale = useTransform(scrollYProgress, [0.2, 0.6], [1, 1.15]);
  const starGlow = useTransform(scrollYProgress, [0.2, 0.6], [0.3, 0.8]);
  
  return (
    <motion.div 
      ref={ref}
      className="flex items-center justify-center my-8"
    >
      <div className="relative w-24 h-24">
        {/* Animated circle forming around star */}
        <svg 
          viewBox="0 0 100 100" 
          className="absolute inset-0 w-full h-full"
        >
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            style={{
              pathLength: circleProgress,
              rotate: -90,
            }}
            strokeDasharray="1"
            strokeDashoffset="0"
          />
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f4d47c" />
              <stop offset="100%" stopColor="#c9a227" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Growing golden star */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ scale: starScale }}
        >
          <motion.div
            className="absolute inset-0 rounded-full blur-xl"
            style={{ 
              opacity: starGlow,
              background: 'radial-gradient(circle, rgba(201, 162, 39, 0.4) 0%, transparent 70%)'
            }}
          />
          <svg 
            viewBox="0 0 24 24" 
            width={40} 
            height={40}
            className="text-gold-500 relative z-10"
          >
            {/* 8-pointed star */}
            <path 
              d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" 
              fill="currentColor"
            />
            <circle cx="12" cy="12" r="3" fill="#0a0a0f" opacity="0.6" />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Subtle floating geometric particles - minimal, elegant
// Uses seeded positions to avoid hydration mismatch
function FloatingParticles() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fixed positions to avoid hydration mismatch (server/client must match)
  const particles = useMemo(() => [
    { id: 0, x: 12, y: 18, size: 4, duration: 10, delay: 0 },
    { id: 1, x: 85, y: 25, size: 5, duration: 12, delay: 1 },
    { id: 2, x: 45, y: 72, size: 3.5, duration: 9, delay: 2 },
    { id: 3, x: 28, y: 45, size: 6, duration: 11, delay: 0.5 },
    { id: 4, x: 72, y: 88, size: 4.5, duration: 13, delay: 1.5 },
    { id: 5, x: 92, y: 55, size: 3, duration: 8, delay: 3 },
    { id: 6, x: 18, y: 82, size: 5.5, duration: 10, delay: 2.5 },
    { id: 7, x: 55, y: 12, size: 4, duration: 14, delay: 0.8 },
    { id: 8, x: 38, y: 92, size: 6.5, duration: 9, delay: 1.2 },
    { id: 9, x: 78, y: 38, size: 3.5, duration: 11, delay: 3.5 },
    { id: 10, x: 8, y: 62, size: 5, duration: 12, delay: 0.3 },
    { id: 11, x: 62, y: 48, size: 4.5, duration: 10, delay: 2.8 },
    { id: 12, x: 95, y: 15, size: 3, duration: 8, delay: 1.8 },
    { id: 13, x: 32, y: 28, size: 5.5, duration: 13, delay: 0.6 },
    { id: 14, x: 48, y: 65, size: 4, duration: 11, delay: 2.2 },
  ], []);

  if (!mounted) {
    return <div className="absolute inset-0 overflow-hidden pointer-events-none" />;
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [-15, 15, -15],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        >
          <div 
            className="rounded-full bg-gold-400/20"
            style={{ width: particle.size, height: particle.size }}
          />
        </motion.div>
      ))}
    </div>
  );
}

// Traditional door plaque style Bismillah - simple, elegant, authoritative
function BismillahPlacard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative mb-10 inline-block"
    >
      {/* Subtle glow */}
      <div 
        className="absolute inset-0 -m-4 blur-2xl opacity-30"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(201, 162, 39, 0.4) 0%, transparent 70%)'
        }}
      />
      
      {/* Door plaque style frame - minimal and elegant */}
      <div 
        className="relative px-8 py-3 rounded-lg"
        style={{
          background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.08) 0%, rgba(201, 162, 39, 0.03) 100%)',
          border: '1px solid rgba(201, 162, 39, 0.25)',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 2px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        {/* Simple line accents at edges */}
        <div className="absolute top-1/2 left-2 -translate-y-1/2 w-3 h-px bg-gold-500/40" />
        <div className="absolute top-1/2 right-2 -translate-y-1/2 w-3 h-px bg-gold-500/40" />
        
        {/* Bismillah text - Arabic only */}
        <p 
          className="relative text-xl md:text-2xl text-gold-400 text-center"
          style={{ 
            fontFamily: 'var(--font-quran)',
            direction: 'rtl',
            textShadow: '0 0 20px rgba(201, 162, 39, 0.3)',
            letterSpacing: '0.02em',
          }}
        >
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
      </div>
    </motion.div>
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

// Arabic calligraphy icons for Path to Memorization - large, golden, elegant
function PersonalizedIcon({ className = "" }: { className?: string }) {
  // Arabic: تَعَلُّم (ta'allum - learning/personalized learning)
  return (
    <div className={`${className} flex items-center justify-center`}>
      <span 
        className="text-3xl font-bold leading-none text-gold-400"
        style={{ 
          fontFamily: 'var(--font-arabic)', 
          direction: 'rtl',
          textShadow: '0 0 20px rgba(201, 162, 39, 0.5), 0 2px 4px rgba(0,0,0,0.3)'
        }}
      >
        تَعَلُّم
      </span>
    </div>
  );
}

function SpacedRepIcon({ className = "" }: { className?: string }) {
  // Arabic: تَكرار (takraar - repetition)
  return (
    <div className={`${className} flex items-center justify-center`}>
      <span 
        className="text-3xl font-bold leading-none text-gold-400"
        style={{ 
          fontFamily: 'var(--font-arabic)', 
          direction: 'rtl',
          textShadow: '0 0 20px rgba(201, 162, 39, 0.5), 0 2px 4px rgba(0,0,0,0.3)'
        }}
      >
        تَكرار
      </span>
    </div>
  );
}

function ProgressIcon({ className = "" }: { className?: string }) {
  // Arabic: تَقَدُّم (taqaddum - progress)
  return (
    <div className={`${className} flex items-center justify-center`}>
      <span 
        className="text-3xl font-bold leading-none text-gold-400"
        style={{ 
          fontFamily: 'var(--font-arabic)', 
          direction: 'rtl',
          textShadow: '0 0 20px rgba(201, 162, 39, 0.5), 0 2px 4px rgba(0,0,0,0.3)'
        }}
      >
        تَقَدُّم
      </span>
    </div>
  );
}

// Feature card with custom icon - CENTERED layout
function FeatureCard({ 
  iconComponent: IconComponent,
  title, 
  description, 
  gradient,
}: { 
  iconComponent: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="liquid-card-interactive p-6 group text-center"
    >
      {/* Golden Arabic calligraphy icon with subtle glow - CENTERED */}
      <div className="relative w-20 h-20 rounded-2xl bg-night-900/60 border border-gold-500/30 flex items-center justify-center mb-5 group-hover:border-gold-500/50 transition-colors mx-auto">
        <IconComponent className="" />
        {/* Golden glow on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gold-500/20 blur-xl opacity-0 group-hover:opacity-60 transition-opacity" />
      </div>
      
      <h3 className="font-semibold text-night-100 text-lg mb-2">{title}</h3>
      <p className="text-night-400 leading-relaxed text-sm">{description}</p>
    </motion.div>
  );
}

// Method card with number badge
function MethodCard({ 
  number, 
  title, 
  description,
  isArabic = false
}: { 
  number: string;
  title: string;
  description: string;
  isArabic?: boolean;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ scale: 1.02 }}
      className="flex gap-5 p-5 liquid-card-interactive"
    >
      <motion.div 
        className="flex-shrink-0 w-20 h-20 rounded-2xl liquid-glass-gold flex items-center justify-center relative overflow-hidden"
        whileHover={{ rotate: [0, -3, 3, 0] }}
        transition={{ duration: 0.4 }}
      >
        <span className={`text-gold-400 font-display text-xl font-bold ${isArabic ? 'font-arabic' : ''}`}>
          {number}
        </span>
      </motion.div>
      <div>
        <h3 className="font-semibold text-night-100 text-lg mb-2">{title}</h3>
        <p className="text-night-400 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
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
      {/* Enhanced Animated Background */}
      <motion.div 
        className="fixed inset-0 bg-gradient-divine-warm"
        style={{ scale: bgScale }}
      />
      
      {/* Pattern overlay */}
      <div className="fixed inset-0 pattern-arabesque opacity-30" />
      <div className="fixed inset-0 pattern-overlay" />
      
      {/* Subtle floating particles */}
      <FloatingParticles />
      
      {/* Decorative orbs with parallax */}
      <motion.div 
        className="fixed top-10 left-5 w-[600px] h-[600px] rounded-full blur-[120px]"
        style={{ 
          y: smoothY,
          background: 'radial-gradient(circle, rgba(201, 162, 39, 0.08) 0%, transparent 70%)'
        }}
      />
      <motion.div 
        className="fixed bottom-20 right-5 w-[700px] h-[700px] rounded-full blur-[140px]"
        style={{ 
          y: useTransform(scrollYProgress, [0, 1], [0, 150]),
          background: 'radial-gradient(circle, rgba(78, 122, 81, 0.06) 0%, transparent 70%)'
        }}
      />
      <motion.div 
        className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full blur-[180px]"
        style={{
          background: 'radial-gradient(circle, rgba(30, 58, 95, 0.08) 0%, transparent 60%)'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header - Premium Frosted Glass */}
        <header className="fixed top-0 left-0 right-0 z-50 safe-area-top">
          <div className="mx-3 mt-3">
            <div className="liquid-glass rounded-2xl">
              <div className="px-4 sm:px-6 py-3 sm:py-4 max-w-7xl mx-auto">
                <div className="flex items-center justify-between">
                  <HifzLogo iconSize={32} animated={true} />
                  
                  <motion.nav
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 sm:gap-4"
                  >
                    <Link 
                      href="/mushaf" 
                      className="text-night-400 hover:text-gold-400 transition-colors text-sm font-medium hidden sm:block px-2 py-1.5 rounded-lg hover:bg-white/5 focus-visible-ring"
                    >
                      Quran
                    </Link>
                    <Link 
                      href="/techniques" 
                      className="text-night-400 hover:text-gold-400 transition-colors text-sm font-medium hidden sm:block px-2 py-1.5 rounded-lg hover:bg-white/5 focus-visible-ring"
                    >
                      Methods
                    </Link>
                    <Link 
                      href="/lessons"
                      className="liquid-pill text-sm font-medium text-night-100 flex items-center gap-2 focus-visible-ring"
                    >
                      <Sparkles className="w-4 h-4 text-gold-400" />
                      <span className="hidden sm:inline">My Lessons</span>
                      <span className="sm:hidden">Lessons</span>
                    </Link>
                    
                    {/* Auth Buttons */}
                    <SignedOut>
                      <SignInButton mode="modal">
                        <button className="text-night-400 hover:text-gold-400 transition-colors text-sm font-medium flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-white/5 min-h-[36px]">
                          <User className="w-4 h-4" />
                          <span className="hidden sm:inline">Sign In</span>
                        </button>
                      </SignInButton>
                    </SignedOut>
                    <SignedIn>
                      <UserButton 
                        afterSignOutUrl="/"
                        appearance={{
                          elements: {
                            avatarBox: "w-9 h-9"
                          }
                        }}
                      />
                    </SignedIn>
                  </motion.nav>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-16">
          <motion.div
            style={{ y: smoothY, opacity: heroOpacity }}
            className="text-center max-w-4xl"
          >
            {/* Bismillah - door plaque style */}
            <BismillahPlacard />
            
            {/* Main Headline */}
            <motion.h1 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="font-display text-5xl md:text-7xl lg:text-8xl text-night-100 mb-8 leading-tight"
            >
              <motion.span variants={fadeInUp} className="block">Your Journey to</motion.span>
              <motion.span variants={fadeInUp} className="block mt-2">
                <span className="relative inline-block">
                  <span className="liquid-shimmer-text tracking-wider font-bold">HIFZ</span>
                  <motion.span
                    className="absolute -inset-8 bg-gold-500/15 rounded-full -z-10 blur-2xl"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                </span>
                <span className="text-night-100"> Starts Here</span>
              </motion.span>
            </motion.h1>
            
            {/* Subheadline */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-night-300 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Memorize the Quran with AI-powered personalized lessons, 
              beautiful recitations, and time-tested techniques from traditional Tahfiz schools.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Link href="/onboarding/welcome" className="group relative">
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="relative liquid-btn text-base px-10 py-4 flex items-center gap-3">
                  <Sparkles className="w-5 h-5" />
                  Begin Your Journey
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link href="/mushaf" className="liquid-btn-outline text-base px-10 py-4 flex items-center gap-3">
                <BookOpen className="w-5 h-5" />
                Explore the Quran
              </Link>
            </motion.div>

            {/* Stats Row with Islamic star separators */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-sm"
            >
              {[
                { icon: BookOpen, label: 'Complete Quran', color: 'text-sage-400' },
                { icon: Headphones, label: 'Multiple Reciters', color: 'text-gold-400' },
                { icon: Brain, label: 'AI-Powered', color: 'text-purple-400' },
                { icon: Sparkles, label: 'Personalized Learning', color: 'text-rose-400' },
              ].map((stat, i, arr) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + i * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <div className="flex items-center gap-2 text-night-300">
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    <span>{stat.label}</span>
                  </div>
                  {i < arr.length - 1 && (
                    <GeometricAccent size={6} className="text-gold-500/40 ml-4 hidden md:block" />
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          
        </section>

        {/* Features Section - Islamic Manuscript Box */}
        <section className="px-6 py-24 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-6xl mx-auto"
          >
            {/* Islamic Manuscript-style Container */}
            <div 
              className="relative p-8 md:p-12 rounded-3xl"
              style={{
                background: 'linear-gradient(135deg, rgba(139, 105, 20, 0.08) 0%, rgba(201, 162, 39, 0.04) 50%, rgba(139, 105, 20, 0.08) 100%)',
                border: '2px solid rgba(201, 162, 39, 0.2)',
                boxShadow: 'inset 0 0 60px rgba(139, 105, 20, 0.05), 0 8px 32px rgba(0, 0, 0, 0.2)',
              }}
            >
              {/* Decorative corner ornaments */}
              <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-gold-500/40 rounded-tl-lg" />
              <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-gold-500/40 rounded-tr-lg" />
              <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-gold-500/40 rounded-bl-lg" />
              <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-gold-500/40 rounded-br-lg" />
              
              <motion.div variants={fadeInUp} className="text-center mb-12">
                <div className="flex items-center justify-center mb-4">
                  <GeometricDivider className="text-gold-500" />
                </div>
                <h2 id="features" className="font-display text-3xl md:text-5xl text-night-100 mb-4 heading-illuminated">
                  The Path to Memorization
                </h2>
                <p className="text-night-400 max-w-xl mx-auto text-lg">
                  Everything you need for a successful <span className="text-gold-400 font-semibold">HIFZ</span> journey
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-6">
                <FeatureCard
                  iconComponent={PersonalizedIcon}
                  title="Personalized Learning"
                  description="AI creates a custom study plan based on your level, goals, and available time"
                  gradient="from-gold-500 to-amber-600"
                />
                <FeatureCard
                  iconComponent={SpacedRepIcon}
                  title="Spaced Repetition"
                  description="Science-backed review system ensures you never forget what you've memorized"
                  gradient="from-purple-500 to-pink-500"
                />
                <FeatureCard
                  iconComponent={ProgressIcon}
                  title="Track Progress"
                  description="Beautiful visualizations show your journey from first verse to full HIFZ"
                  gradient="from-sage-500 to-emerald-500"
                />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Method Section */}
        <section className="px-6 py-24 relative overflow-hidden">
          {/* Subtle pattern background */}
          <div className="absolute inset-0 pattern-interlace opacity-20" />
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-5xl mx-auto relative"
          >
            <motion.div variants={fadeInUp} className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <GeometricDivider className="text-gold-500" />
              </div>
              <h2 className="font-display text-3xl md:text-5xl text-night-100 mb-4 heading-illuminated">
                Traditional Methods, Modern Tools
              </h2>
              <p className="text-night-400 max-w-xl mx-auto text-lg">
                We combine centuries-old Tahfiz methodology with cutting-edge technology
              </p>
            </motion.div>
            
            {/* Scroll-animated star with circle forming around it */}
            <ScrollAnimatedStar />

            <div className="grid md:grid-cols-2 gap-6">
              <MethodCard 
                number="10-3" 
                title="The 10-3 Method" 
                description="Read 10 times while looking, then recite 3 times from memory. Time-tested technique used in Tahfiz schools worldwide."
              />
              <MethodCard 
                number="70/30" 
                title="Review Balance" 
                description="70% review of memorized verses, 30% new material. The optimal ratio for long-term retention."
              />
              <MethodCard 
                number="سبق" 
                title="Sabaq System" 
                description="Daily structure of Sabaq (new), Sabqi (recent), and Manzil (old) - the traditional three-part revision system."
                isArabic
              />
              <MethodCard 
                number="AI" 
                title="Intelligent Assistance" 
                description="AI listens to your recitation and provides gentle corrections to help perfect your tajweed."
              />
            </div>
          </motion.div>
        </section>

        {/* Quote Section - Centered, scaled up, no quote symbol */}
        <section className="px-6 py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="liquid-glass-gold-premium rounded-3xl p-10 md:p-16 flex flex-col items-center justify-center min-h-[280px] relative overflow-hidden">
              {/* Subtle corner accents */}
              <div className="absolute top-4 left-4">
                <GeometricAccent size={8} className="text-gold-500/25" />
              </div>
              <div className="absolute top-4 right-4">
                <GeometricAccent size={8} className="text-gold-500/25" />
              </div>
              <div className="absolute bottom-4 left-4">
                <GeometricAccent size={8} className="text-gold-500/25" />
              </div>
              <div className="absolute bottom-4 right-4">
                <GeometricAccent size={8} className="text-gold-500/25" />
              </div>
              
              {/* No quote symbol - just the text, scaled up and centered */}
              <p className="text-2xl md:text-4xl text-night-100 italic leading-relaxed mb-8 text-center max-w-2xl">
                "The best among you are those who learn the Quran and teach it."
              </p>
              <p className="text-gold-400 font-semibold text-lg">— Prophet Muhammad ﷺ (Bukhari)</p>
              
              {/* Subtle glow effects */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gold-500/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-sage-500/5 rounded-full blur-2xl" />
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="px-6 py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { value: 6236, label: 'Verses', suffix: '' },
                { value: 114, label: 'Surahs', suffix: '' },
                { value: 30, label: 'Juz', suffix: '' },
                { value: 50, label: 'Lessons', suffix: '+' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  variants={scaleIn}
                  className="liquid-stat"
                >
                  <div className="text-3xl md:text-4xl font-bold text-gold-gradient mb-2">
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
            <div className="liquid-glass-gold-premium rounded-3xl p-10 md:p-16 relative overflow-hidden">
              {/* Subtle corner accent */}
              <div className="absolute top-6 right-6 opacity-15">
                <GeometricAccent size={20} className="text-gold-400" />
              </div>
              
              {/* Flame icon with glow */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative inline-block mb-6"
              >
                <Flame className="w-16 h-16 text-gold-400" />
                <div className="absolute inset-0 blur-xl bg-gold-500/30" />
              </motion.div>
              
              <h2 className="font-display text-3xl md:text-4xl text-night-100 mb-4 heading-illuminated">
                Every Hafiz Started with One Verse
              </h2>
              <p className="text-night-300 mb-8 max-w-md mx-auto">
                Join Muslims around the world on the blessed journey of Quran memorization.
              </p>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="relative inline-block"
              >
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 rounded-2xl blur-lg opacity-50"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <Link href="/onboarding/welcome" className="relative liquid-btn text-lg px-10 py-4 inline-flex items-center gap-3">
                  Start Today — It's Free
                  <Sparkles className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="p-6 border-t border-night-800/30 safe-area-bottom">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-night-500 text-sm">
              <HifzIconSimple size={24} />
              <span className="font-semibold tracking-wider">HIFZ</span>
            </div>
            <p className="text-night-500 text-sm flex items-center gap-2">
              Made with <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> for the Ummah
            </p>
            <div className="flex items-center gap-6 text-sm text-night-500">
              <Link href="/lessons" className="hover:text-gold-400 transition-colors">Lessons</Link>
              <Link href="/techniques" className="hover:text-gold-400 transition-colors">Techniques</Link>
              <Link href="/mushaf" className="hover:text-gold-400 transition-colors">Quran</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
