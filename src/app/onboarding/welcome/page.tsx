'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  BookOpen,
  Moon,
  Star,
  Sparkles,
  Heart,
  Target,
  Clock,
  Trophy,
  ArrowRight,
  LogIn,
} from 'lucide-react';
import OnboardingCalibration from '@/components/OnboardingCalibration';
import { useSheikh } from '@/contexts/SheikhContext';

const JOURNEY_STAGES = [
  {
    id: 'letters',
    arabic: 'أ ب ت',
    title: 'Arabic Letters',
    description: 'Learn to recognize all 28 letters',
    icon: <span className="font-arabic text-2xl">أ</span>,
    duration: '2 weeks',
    color: 'from-gold-500 to-gold-600',
  },
  {
    id: 'reading',
    arabic: 'بَ بِ بُ',
    title: 'Reading Skills',
    description: 'Master vowels, marks, and pronunciation',
    icon: <span className="font-arabic text-2xl">بَ</span>,
    duration: '1 week',
    color: 'from-sage-500 to-sage-600',
  },
  {
    id: 'words',
    arabic: 'بِسْمِ اللَّهِ',
    title: 'Quranic Words',
    description: 'Build vocabulary with common words',
    icon: <BookOpen className="w-6 h-6" />,
    duration: '2 weeks',
    color: 'from-midnight-500 to-midnight-600',
  },
  {
    id: 'fatiha',
    arabic: 'الفَاتِحَة',
    title: 'Al-Fatiha',
    description: 'Memorize the Opening Chapter',
    icon: <Moon className="w-6 h-6" />,
    duration: '1 week',
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 'surahs',
    arabic: 'جُزْء عَمَّ',
    title: 'Short Surahs',
    description: 'Memorize Juz Amma step by step',
    icon: <Star className="w-6 h-6" />,
    duration: '3-6 months',
    color: 'from-rose-500 to-rose-600',
  },
  {
    id: 'hifz',
    arabic: 'حَافِظ',
    title: 'Full HIFZ',
    description: 'Complete Quran memorization',
    icon: <Trophy className="w-6 h-6" />,
    duration: '2-5 years',
    color: 'from-amber-500 to-amber-600',
  },
];

export default function OnboardingWelcomePage() {
  const router = useRouter();
  const { setUserLevel } = useSheikh();
  const [showJourney, setShowJourney] = useState(false);
  const [showCalibration, setShowCalibration] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [userName, setUserName] = useState<string | undefined>(undefined);
  
  // Try to get user name from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('quranOasis_userName');
      if (stored) setUserName(stored);
    }
  }, []);
  
  useEffect(() => {
    if (showJourney) {
      const interval = setInterval(() => {
        setCurrentStage(prev => {
          if (prev >= JOURNEY_STAGES.length - 1) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 800);
      return () => clearInterval(interval);
    }
  }, [showJourney]);
  
  // Handle calibration completion
  const handleCalibrationComplete = (assessment: {
    level: 'beginner' | 'intermediate' | 'advanced';
    arabicReading: string;
    tajweedKnowledge: string;
    memorizationCount: number;
    understanding: string;
    summary: string;
    recommendation: string;
  }) => {
    // Save the assessment
    setUserLevel(assessment.level);
    
    // Save to localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('quranOasis_userLevel', assessment.level);
      localStorage.setItem('quranOasis_calibration', JSON.stringify(assessment));
    }
    
    // Navigate to dashboard
    router.push('/dashboard');
  };
  
  // Show calibration screen
  if (showCalibration) {
    return (
      <OnboardingCalibration
        userName={userName}
        onComplete={handleCalibrationComplete}
        onSkip={() => {
          setUserLevel('beginner');
          router.push('/dashboard');
        }}
      />
    );
  }
  
  return (
    <div className="min-h-screen bg-night-950 flex flex-col">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 -left-20 w-80 h-80 rounded-full blur-[100px]"
          style={{ background: 'rgba(201, 162, 39, 0.08)' }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-40 -right-20 w-96 h-96 rounded-full blur-[120px]"
          style={{ background: 'rgba(134, 169, 113, 0.06)' }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <div className="pattern-overlay opacity-[0.01]" />
      </div>
      
      <main className="relative flex-1 flex flex-col px-6 py-10 safe-area-top safe-area-bottom">
        <AnimatePresence mode="wait">
          {!showJourney ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 flex flex-col justify-center"
            >
              {/* Logo & Bismillah */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-10"
              >
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(201,162,39,0.95) 0%, rgba(180,140,30,1) 100%)',
                    boxShadow: '0 8px 32px rgba(201,162,39,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  {/* HIFZ Crest Logo */}
                  <img 
                    src="/hifz-crest.png" 
                    alt="HIFZ" 
                    className="w-14 h-14 object-contain"
                  />
                  {/* Glow ring */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl"
                    style={{ border: '2px solid rgba(201,162,39,0.5)' }}
                    animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                
                <motion.p 
                  className="font-arabic text-2xl text-gold-400 mb-4 text-glow-soft" 
                  style={{ direction: 'rtl' }}
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </motion.p>
                
                <h1 className="text-3xl font-bold text-night-100 mb-2">
                  Welcome to <span className="text-gold-400 tracking-wider">HIFZ</span>
                </h1>
                <p className="text-night-400 max-w-sm mx-auto">
                  Your journey to memorizing the Quran starts with a single letter
                </p>
              </motion.div>
              
              {/* Hadith Quote - Liquid Glass Sage */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-2xl p-5 mb-8 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(134,169,113,0.12) 0%, rgba(134,169,113,0.04) 100%)',
                  border: '1px solid rgba(134,169,113,0.2)',
                  boxShadow: '0 8px 32px rgba(134,169,113,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}
              >
                <div className="flex items-start gap-3 relative">
                  <div 
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, rgba(134,169,113,0.2) 0%, rgba(134,169,113,0.1) 100%)',
                      border: '1px solid rgba(134,169,113,0.2)',
                    }}
                  >
                    <Heart className="w-4 h-4 text-sage-400" />
                  </div>
                  <div>
                    <p className="text-night-200 text-sm italic leading-relaxed">
                      "The best among you are those who learn the Quran and teach it."
                    </p>
                    <p className="text-night-500 text-xs mt-2">
                      — Prophet Muhammad ﷺ (Bukhari)
                    </p>
                  </div>
                </div>
              </motion.div>
              
              {/* Features - Liquid Glass Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-2 gap-3 mb-8"
              >
                {[
                  { icon: <Sparkles className="w-5 h-5" />, text: 'AI-Powered Learning' },
                  { icon: <Target className="w-5 h-5" />, text: 'Personalized Path' },
                  { icon: <Clock className="w-5 h-5" />, text: 'Learn at Your Pace' },
                  { icon: <Trophy className="w-5 h-5" />, text: 'Track Progress' },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="flex items-center gap-2.5 p-3.5 rounded-xl"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                    }}
                  >
                    <div className="text-gold-400">{feature.icon}</div>
                    <span className="text-night-300 text-sm">{feature.text}</span>
                  </motion.div>
                ))}
              </motion.div>
              
              {/* CTA - Meet Sheikh First */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCalibration(true)}
                  className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-base font-semibold"
                  style={{
                    background: 'linear-gradient(135deg, rgba(45, 212, 150, 0.9) 0%, rgba(26, 122, 84, 1) 100%)',
                    color: '#fff',
                    boxShadow: '0 8px 32px rgba(45, 212, 150, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                    border: '1px solid rgba(255,255,255,0.15)',
                  }}
                >
                  <span className="text-lg">🕌</span>
                  Meet Sheikh HIFZ
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
                
                <p className="text-center text-night-500 text-xs mt-2 mb-4">
                  Your AI teacher will assess your level through a quick conversation
                </p>
                
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setShowJourney(true)}
                  className="w-full py-3 rounded-xl flex items-center justify-center text-sm text-night-400 hover:text-night-200 transition-colors"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  See the journey overview first
                </motion.button>
                
                {/* Sign In Link */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-6 text-center"
                >
                  <Link 
                    href="/sign-in"
                    className="inline-flex items-center gap-2 text-sm text-night-500 hover:text-gold-400 transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    Already have an account? Sign in
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="journey"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 flex flex-col"
            >
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <h2 className="text-2xl font-bold text-night-100 mb-2">
                  The Path to <span className="text-gold-400 tracking-wider">HIFZ</span>
                </h2>
                <p className="text-night-400 text-sm">
                  Your personalized journey, step by step
                </p>
              </motion.div>
              
              {/* Journey Stages */}
              <div className="flex-1 relative">
                {/* Center Line - Liquid Gradient */}
                <div 
                  className="absolute left-6 top-0 bottom-0 w-0.5"
                  style={{
                    background: 'linear-gradient(180deg, rgba(201,162,39,0.5) 0%, rgba(134,169,113,0.3) 50%, rgba(255,255,255,0.05) 100%)',
                  }}
                />
                
                <div className="space-y-4">
                  {JOURNEY_STAGES.map((stage, index) => (
                    <motion.div
                      key={stage.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ 
                        opacity: index <= currentStage ? 1 : 0.3,
                        x: 0,
                        scale: index === currentStage ? 1.02 : 1,
                      }}
                      transition={{ delay: index * 0.15, duration: 0.3 }}
                      className="relative flex items-center gap-4 pl-2"
                    >
                      {/* Icon Node */}
                      <motion.div
                        animate={{
                          scale: index === currentStage ? [1, 1.1, 1] : 1,
                          boxShadow: index === currentStage 
                            ? ['0 0 20px rgba(201,162,39,0.3)', '0 0 30px rgba(201,162,39,0.5)', '0 0 20px rgba(201,162,39,0.3)']
                            : '0 4px 16px rgba(0,0,0,0.2)',
                        }}
                        transition={{
                          repeat: index === currentStage ? Infinity : 0,
                          duration: 2,
                        }}
                        className={`
                          relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center
                          bg-gradient-to-br ${stage.color} text-white
                          ${index > currentStage ? 'grayscale opacity-50' : ''}
                        `}
                        style={{
                          border: '1px solid rgba(255,255,255,0.2)',
                        }}
                      >
                        {stage.icon}
                      </motion.div>
                      
                      {/* Content Card - Liquid Glass */}
                      <motion.div 
                        whileHover={index <= currentStage ? { scale: 1.01 } : undefined}
                        className="flex-1 p-4 rounded-xl"
                        style={{
                          background: index === currentStage 
                            ? 'linear-gradient(135deg, rgba(201,162,39,0.12) 0%, rgba(201,162,39,0.04) 100%)'
                            : 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                          border: index === currentStage 
                            ? '1px solid rgba(201,162,39,0.25)'
                            : '1px solid rgba(255,255,255,0.05)',
                          boxShadow: index === currentStage 
                            ? '0 8px 24px rgba(201,162,39,0.1)'
                            : 'none',
                        }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-semibold ${
                            index === currentStage ? 'text-gold-300' : 'text-night-200'
                          }`}>
                            {stage.title}
                          </h3>
                          <span className="text-night-500 text-xs">
                            ~{stage.duration}
                          </span>
                        </div>
                        <p className="text-night-400 text-sm">{stage.description}</p>
                        
                        {/* Arabic preview */}
                        <p 
                          className={`font-arabic text-lg mt-2 ${
                            index === currentStage ? 'text-gold-400/80' : 'text-night-600'
                          }`}
                          style={{ direction: 'rtl' }}
                        >
                          {stage.arabic}
                        </p>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Bottom CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: JOURNEY_STAGES.length * 0.15 + 0.5 }}
                className="mt-6"
              >
                <div 
                  className="rounded-xl p-4 mb-4"
                  style={{
                    background: 'linear-gradient(135deg, rgba(134,169,113,0.1) 0%, rgba(134,169,113,0.04) 100%)',
                    border: '1px solid rgba(134,169,113,0.15)',
                  }}
                >
                  <p className="text-night-300 text-sm text-center">
                    <span className="text-gold-400 font-medium">Remember:</span> Every Hafiz started 
                    with learning their first letter. Small, consistent steps lead to 
                    extraordinary achievements.
                  </p>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCalibration(true)}
                  className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-base font-semibold"
                  style={{
                    background: 'linear-gradient(135deg, rgba(45, 212, 150, 0.9) 0%, rgba(26, 122, 84, 1) 100%)',
                    color: '#fff',
                    boxShadow: '0 8px 32px rgba(45, 212, 150, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                    border: '1px solid rgba(255,255,255,0.15)',
                  }}
                >
                  <span className="text-lg">🕌</span>
                  Meet Sheikh HIFZ
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
