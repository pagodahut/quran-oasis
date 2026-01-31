'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
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

// Islamic 8-pointed star SVG component
function IslamicStar({ className = "", size = 24 }: { className?: string; size?: number }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      width={size} 
      height={size} 
      className={className}
      fill="currentColor"
    >
      <path d="M12 0L14 8L22 8L16 12.5L18.5 20L12 16L5.5 20L8 12.5L2 8L10 8Z" />
    </svg>
  );
}

// Floating Islamic star particles
function FloatingStars() {
  const stars = useMemo(() => 
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 4 + Math.random() * 8,
      duration: 6 + Math.random() * 8,
      delay: Math.random() * 4,
      type: Math.random() > 0.6 ? 'star' : 'dot'
    })), []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-15, 15, -15],
            opacity: [0.15, 0.5, 0.15],
            scale: [1, 1.3, 1],
            rotate: star.type === 'star' ? [0, 180, 360] : 0,
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut"
          }}
        >
          {star.type === 'star' ? (
            <IslamicStar size={star.size} className="text-gold-500/40" />
          ) : (
            <div 
              className="rounded-full bg-gold-400/30"
              style={{ width: star.size / 2, height: star.size / 2 }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}

// Illuminated Bismillah component with ornate frame
function IlluminatedBismillah() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative mb-12"
    >
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 -m-8 blur-3xl"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(201, 162, 39, 0.2) 0%, transparent 70%)'
        }}
        animate={{ 
          scale: [1, 1.1, 1], 
          opacity: [0.4, 0.6, 0.4] 
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Ornate frame container */}
      <div className="relative liquid-glass-gold-premium rounded-2xl px-8 py-6 md:px-12 md:py-8">
        {/* Corner ornaments */}
        <div className="absolute top-2 left-2 text-gold-500/50 text-lg">✦</div>
        <div className="absolute top-2 right-2 text-gold-500/50 text-lg">✦</div>
        <div className="absolute bottom-2 left-2 text-gold-500/50 text-lg">✦</div>
        <div className="absolute bottom-2 right-2 text-gold-500/50 text-lg">✦</div>
        
        {/* Top decorative border */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div 
            className="shamsa w-8 h-8 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            <IslamicStar size={16} className="text-gold-500" />
          </motion.div>
        </div>
        
        {/* Bismillah text */}
        <p className="bismillah relative text-3xl md:text-5xl text-glow-gold text-center font-quran">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
        
        {/* Translation */}
        <p className="text-center text-night-400 text-sm mt-3 tracking-wide">
          In the name of Allah, the Most Gracious, the Most Merciful
        </p>
        
        {/* Bottom decorative line */}
        <div className="liquid-divider-gold mt-4" />
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

// Feature card with Islamic design elements
function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  gradient,
  delay = 0 
}: { 
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
  delay?: number;
}) {
  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="liquid-card-interactive p-6 group"
    >
      {/* Icon with gradient background */}
      <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-5 shadow-lg group-hover:shadow-xl transition-shadow`}>
        <Icon className="w-8 h-8 text-white" />
        {/* Subtle glow on hover */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} blur-xl opacity-0 group-hover:opacity-40 transition-opacity`} />
      </div>
      
      <h3 className="font-semibold text-night-100 text-xl mb-3">{title}</h3>
      <p className="text-night-400 leading-relaxed">{description}</p>
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
      
      {/* Floating Islamic stars */}
      <FloatingStars />
      
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
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50">
          <div className="mx-4 mt-4">
            <div className="liquid-glass rounded-2xl">
              <div className="px-6 py-4 max-w-7xl mx-auto">
                <div className="flex items-center justify-between">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 flex items-center justify-center shadow-lg">
                        <Moon className="w-5 h-5 text-night-950" />
                      </div>
                      {/* Subtle glow */}
                      <div className="absolute inset-0 w-10 h-10 rounded-xl bg-gold-500 blur-md opacity-30" />
                    </div>
                    <span className="font-display text-xl text-night-100 font-semibold">Quran Oasis</span>
                  </motion.div>
                  
                  <motion.nav
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4"
                  >
                    <Link href="/mushaf" className="text-night-400 hover:text-gold-400 transition-colors text-sm font-medium hidden sm:block">
                      Quran
                    </Link>
                    <Link href="/techniques" className="text-night-400 hover:text-gold-400 transition-colors text-sm font-medium hidden sm:block">
                      Methods
                    </Link>
                    <Link 
                      href="/lessons"
                      className="liquid-pill text-sm font-medium text-night-100 flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-gold-400" />
                      My Lessons
                    </Link>
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
            {/* Illuminated Bismillah */}
            <IlluminatedBismillah />
            
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
                  <span className="liquid-shimmer-text">Hifz</span>
                  <motion.span
                    className="absolute -inset-4 bg-gold-500/10 rounded-2xl -z-10 blur-sm"
                    animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
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
                { icon: BookOpen, label: '114 Surahs', color: 'text-sage-400' },
                { icon: Headphones, label: '5 Reciters', color: 'text-gold-400' },
                { icon: Brain, label: 'AI-Powered', color: 'text-purple-400' },
                { icon: Heart, label: 'Free Forever', color: 'text-rose-400' },
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
                    <IslamicStar size={8} className="text-gold-500/40 ml-4 hidden md:block" />
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          
          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 rounded-full border-2 border-night-700/50 flex items-start justify-center p-1.5"
            >
              <motion.div 
                className="w-1.5 h-3 rounded-full"
                style={{ background: 'linear-gradient(to bottom, #c9a227, #8b6914)' }}
              />
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
            className="max-w-6xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="liquid-divider-gold w-16" />
                <IslamicStar size={12} className="text-gold-500" />
                <div className="liquid-divider-gold w-16" />
              </div>
              <h2 className="font-display text-3xl md:text-5xl text-night-100 mb-4 heading-illuminated">
                The Path to Memorization
              </h2>
              <p className="text-night-400 max-w-xl mx-auto text-lg">
                Everything you need for a successful Hifz journey
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              <FeatureCard
                icon={Star}
                title="Personalized Learning"
                description="AI creates a custom study plan based on your level, goals, and available time"
                gradient="from-gold-500 to-amber-600"
              />
              <FeatureCard
                icon={Zap}
                title="Spaced Repetition"
                description="Science-backed review system ensures you never forget what you've memorized"
                gradient="from-purple-500 to-pink-500"
              />
              <FeatureCard
                icon={Trophy}
                title="Track Progress"
                description="Beautiful visualizations show your journey from first verse to full Hifz"
                gradient="from-sage-500 to-emerald-500"
              />
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
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="liquid-divider-gold w-16" />
                <IslamicStar size={12} className="text-gold-500" />
                <div className="liquid-divider-gold w-16" />
              </div>
              <h2 className="font-display text-3xl md:text-5xl text-night-100 mb-4 heading-illuminated">
                Traditional Methods, Modern Tools
              </h2>
              <p className="text-night-400 max-w-xl mx-auto text-lg">
                We combine centuries-old Tahfiz methodology with cutting-edge technology
              </p>
            </motion.div>

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

        {/* Quote Section */}
        <section className="px-6 py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <div className="liquid-glass-gold-premium rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
              {/* Decorative stars in corners */}
              <div className="absolute top-4 left-4">
                <IslamicStar size={16} className="text-gold-500/30" />
              </div>
              <div className="absolute top-4 right-4">
                <IslamicStar size={16} className="text-gold-500/30" />
              </div>
              <div className="absolute bottom-4 left-4">
                <IslamicStar size={16} className="text-gold-500/30" />
              </div>
              <div className="absolute bottom-4 right-4">
                <IslamicStar size={16} className="text-gold-500/30" />
              </div>
              
              <Quote className="w-12 h-12 text-gold-500/40 mx-auto mb-6" />
              <p className="text-xl md:text-2xl text-night-100 italic leading-relaxed mb-6">
                "The best among you are those who learn the Quran and teach it."
              </p>
              <p className="text-gold-400 font-medium">— Prophet Muhammad ﷺ (Bukhari)</p>
              
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
                { value: 100, label: 'Free Forever', suffix: '%' },
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
              {/* Animated decorative star */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute top-6 right-6 opacity-20"
              >
                <IslamicStar size={40} className="text-gold-400" />
              </motion.div>
              
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
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
                <Moon className="w-3.5 h-3.5 text-night-950" />
              </div>
              <span>Quran Oasis</span>
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
