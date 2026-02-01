'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Brain,
  Repeat,
  Layers,
  Clock,
  Moon,
  Sun,
  BookOpen,
  Heart,
  Lightbulb,
  Target,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function MemorizationTechniquesPage() {
  return (
    <div className="min-h-screen bg-night-950">
      {/* Header - Liquid Glass */}
      <header 
        className="sticky top-0 z-40 safe-area-top"
        style={{
          background: 'linear-gradient(180deg, rgba(15,15,20,0.95) 0%, rgba(15,15,20,0.85) 100%)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
        }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="liquid-icon-btn">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-semibold text-night-100 text-lg">Memorization Techniques</h1>
          <div className="w-11" />
        </div>
      </header>

      <main className="px-4 py-6 pb-28 max-w-2xl mx-auto">
        {/* Introduction - Liquid Glass Gold */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="rounded-3xl p-6 mb-8 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(201,162,39,0.12) 0%, rgba(201,162,39,0.04) 100%)',
            border: '1px solid rgba(201,162,39,0.2)',
            boxShadow: '0 8px 32px rgba(201,162,39,0.1), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 -translate-y-1/2 translate-x-1/2 pointer-events-none">
            <div className="w-full h-full rounded-full bg-gold-500/10 blur-3xl" />
          </div>
          
          <div className="relative flex items-start gap-4">
            <div 
              className="p-3 rounded-2xl flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, rgba(201,162,39,0.2) 0%, rgba(201,162,39,0.1) 100%)',
                border: '1px solid rgba(201,162,39,0.2)',
                boxShadow: '0 4px 16px rgba(201,162,39,0.15)',
              }}
            >
              <Brain className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <h2 className="font-semibold text-night-100 text-xl mb-2">Your <span className="text-gold-400 tracking-wider">HIFZ</span> Toolkit</h2>
              <p className="text-sm text-night-300 leading-relaxed">
                These proven techniques have helped millions memorize the Quran. 
                Each method works differently, so try them all and find what clicks for you.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="space-y-8"
        >
          {/* Technique 1: 10-3 Method */}
          <motion.section variants={fadeInUp}>
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="p-2.5 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(134,169,113,0.2) 0%, rgba(134,169,113,0.1) 100%)',
                  border: '1px solid rgba(134,169,113,0.2)',
                }}
              >
                <Repeat className="w-5 h-5 text-sage-400" />
              </div>
              <h2 className="text-xl font-semibold text-night-100">The 10-3 Method</h2>
            </div>
            
            <div className="liquid-card-interactive rounded-2xl p-5 space-y-4">
              <p className="text-night-300">
                <strong className="text-night-100">The most popular method for beginners.</strong> Simple, 
                effective, and builds strong neural pathways.
              </p>
              
              <div className="space-y-4">
                {[
                  { step: 1, title: 'Read the verse 10 times WHILE LOOKING', desc: 'Focus on each word. Read slowly and clearly.' },
                  { step: 2, title: 'Recite 3 times WITHOUT LOOKING', desc: 'Test your memory. Glance if needed, then continue.' },
                  { step: 3, title: 'Move to the next verse', desc: 'Repeat the process, then connect with previous verses.' },
                ].map((item) => (
                  <motion.div 
                    key={item.step}
                    whileHover={{ x: 4 }}
                    className="flex items-start gap-3"
                  >
                    <div 
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, rgba(201,162,39,0.2) 0%, rgba(201,162,39,0.1) 100%)',
                        color: '#c9a227',
                        border: '1px solid rgba(201,162,39,0.2)',
                      }}
                    >
                      {item.step}
                    </div>
                    <div>
                      <p className="font-medium text-night-100">{item.title}</p>
                      <p className="text-sm text-night-400">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div 
                className="rounded-xl p-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(134,169,113,0.12) 0%, rgba(134,169,113,0.04) 100%)',
                  border: '1px solid rgba(134,169,113,0.2)',
                }}
              >
                <p className="text-sm text-sage-300 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-sage-400 flex-shrink-0 mt-0.5" />
                  <span><span className="font-medium">Pro tip:</span> If you can't recite 3 times without 
                  looking, do 15-3 or even 20-3 until it sticks!</span>
                </p>
              </div>
            </div>
          </motion.section>

          {/* Technique 2: Stacking */}
          <motion.section variants={fadeInUp}>
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="p-2.5 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(134,169,113,0.2) 0%, rgba(134,169,113,0.1) 100%)',
                  border: '1px solid rgba(134,169,113,0.2)',
                }}
              >
                <Layers className="w-5 h-5 text-sage-400" />
              </div>
              <h2 className="text-xl font-semibold text-night-100">The Stacking Method</h2>
            </div>
            
            <div className="liquid-card-interactive rounded-2xl p-5 space-y-4">
              <p className="text-night-300">
                <strong className="text-night-100">Connect verses like building blocks.</strong> Each new 
                verse is added to what you already know.
              </p>
              
              <div className="space-y-3">
                {[
                  'Memorize verse 1 alone',
                  'Memorize verse 2, then recite 1+2 together',
                  'Memorize verse 3, then recite 1+2+3 together',
                  'Continue until the surah is complete!',
                ].map((text, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-sage-400 flex-shrink-0" />
                    <p className="text-night-300">{text}</p>
                  </motion.div>
                ))}
              </div>
              
              <div 
                className="rounded-xl p-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(134,169,113,0.12) 0%, rgba(134,169,113,0.04) 100%)',
                  border: '1px solid rgba(134,169,113,0.2)',
                }}
              >
                <p className="text-sm text-sage-300 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-sage-400 flex-shrink-0 mt-0.5" />
                  <span><span className="font-medium">Why it works:</span> You never forget earlier verses 
                  because you're constantly reviewing them while adding new ones.</span>
                </p>
              </div>
            </div>
          </motion.section>

          {/* Technique 3: 20-20 Method */}
          <motion.section variants={fadeInUp}>
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="p-2.5 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(134,169,113,0.2) 0%, rgba(134,169,113,0.1) 100%)',
                  border: '1px solid rgba(134,169,113,0.2)',
                }}
              >
                <Target className="w-5 h-5 text-sage-400" />
              </div>
              <h2 className="text-xl font-semibold text-night-100">The 20-20 Method</h2>
            </div>
            
            <div className="liquid-card-interactive rounded-2xl p-5 space-y-4">
              <p className="text-night-300">
                <strong className="text-night-100">For stronger memorization.</strong> Used in traditional 
                hifz programs worldwide.
              </p>
              
              <div className="space-y-4">
                {[
                  { step: 1, text: 'Recite verse 1 twenty times' },
                  { step: 2, text: 'Recite verse 2 twenty times' },
                  { step: 3, text: 'Recite verse 3 twenty times' },
                  { step: 4, text: 'Recite verses 1+2+3 together twenty times' },
                ].map((item) => (
                  <motion.div 
                    key={item.step}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-3"
                  >
                    <div 
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, rgba(201,162,39,0.2) 0%, rgba(201,162,39,0.1) 100%)',
                        color: '#c9a227',
                        border: '1px solid rgba(201,162,39,0.2)',
                      }}
                    >
                      {item.step}
                    </div>
                    <p className="font-medium text-night-100">{item.text}</p>
                  </motion.div>
                ))}
              </div>
              
              <div 
                className="rounded-xl p-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(134,169,113,0.12) 0%, rgba(134,169,113,0.04) 100%)',
                  border: '1px solid rgba(134,169,113,0.2)',
                }}
              >
                <p className="text-sm text-sage-300 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-sage-400 flex-shrink-0 mt-0.5" />
                  <span><span className="font-medium">When to use:</span> This is more intensive. Use for 
                  verses you find difficult, or when you want rock-solid memorization.</span>
                </p>
              </div>
            </div>
          </motion.section>

          {/* Best Times to Memorize */}
          <motion.section variants={fadeInUp}>
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="p-2.5 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(134,169,113,0.2) 0%, rgba(134,169,113,0.1) 100%)',
                  border: '1px solid rgba(134,169,113,0.2)',
                }}
              >
                <Clock className="w-5 h-5 text-sage-400" />
              </div>
              <h2 className="text-xl font-semibold text-night-100">Best Times to Memorize</h2>
            </div>
            
            <div className="liquid-card-interactive rounded-2xl p-5 space-y-4">
              {[
                { 
                  icon: Sun, 
                  iconColor: 'text-gold-400',
                  bgColor: 'rgba(201,162,39,0.1)',
                  borderColor: 'rgba(201,162,39,0.2)',
                  title: 'After Fajr (Best!)', 
                  desc: 'The mind is fresh, the world is quiet, and there\'s barakah in this time. The Prophet ﷺ said: "O Allah, bless my Ummah in their early mornings."' 
                },
                { 
                  icon: Moon, 
                  iconColor: 'text-indigo-400',
                  bgColor: 'rgba(99,102,241,0.1)',
                  borderColor: 'rgba(99,102,241,0.2)',
                  title: 'Before Bed', 
                  desc: 'Your brain consolidates memories during sleep. Review before sleeping, and you\'ll find the verses stick better by morning.' 
                },
                { 
                  icon: Repeat, 
                  iconColor: 'text-sage-400',
                  bgColor: 'rgba(134,169,113,0.1)',
                  borderColor: 'rgba(134,169,113,0.2)',
                  title: 'Consistency Over Duration', 
                  desc: '15 minutes daily beats 2 hours once a week. Build the habit, and the Quran will become part of your daily life.' 
                },
              ].map((item, i) => (
                <motion.div 
                  key={item.title}
                  whileHover={{ x: 4 }}
                  className={`flex items-start gap-4 ${i < 2 ? 'pb-4' : ''}`}
                  style={{ borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
                >
                  <div 
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${item.bgColor} 0%, transparent 100%)`,
                      border: `1px solid ${item.borderColor}`,
                    }}
                  >
                    <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                  </div>
                  <div>
                    <p className="font-medium text-night-100 mb-1">{item.title}</p>
                    <p className="text-sm text-night-400">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Review Strategy */}
          <motion.section variants={fadeInUp}>
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="p-2.5 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(134,169,113,0.2) 0%, rgba(134,169,113,0.1) 100%)',
                  border: '1px solid rgba(134,169,113,0.2)',
                }}
              >
                <BookOpen className="w-5 h-5 text-sage-400" />
              </div>
              <h2 className="text-xl font-semibold text-night-100">Review Strategy</h2>
            </div>
            
            <div className="liquid-card-interactive rounded-2xl p-5 space-y-4">
              <p className="text-night-300">
                <strong className="text-night-100">Memorization without review = forgotten Quran.</strong> The 
                Prophet ﷺ said the Quran "escapes faster than a camel from its rope."
              </p>
              
              <div className="space-y-3">
                {[
                  { 
                    title: 'Daily Review', 
                    desc: 'Recite what you memorized yesterday. Every single day.',
                    color: 'gold',
                    bgColor: 'rgba(201,162,39,0.12)',
                    borderColor: 'rgba(201,162,39,0.2)',
                    textColor: 'text-gold-400'
                  },
                  { 
                    title: 'Weekly Review', 
                    desc: 'Once a week, recite everything you\'ve memorized. This keeps the full picture fresh.',
                    color: 'sage',
                    bgColor: 'rgba(134,169,113,0.12)',
                    borderColor: 'rgba(134,169,113,0.2)',
                    textColor: 'text-sage-400'
                  },
                  { 
                    title: 'Use It in Prayer', 
                    desc: 'The best review! Recite memorized surahs in your daily prayers.',
                    color: 'indigo',
                    bgColor: 'rgba(99,102,241,0.12)',
                    borderColor: 'rgba(99,102,241,0.2)',
                    textColor: 'text-indigo-400'
                  },
                ].map((item) => (
                  <motion.div 
                    key={item.title}
                    whileHover={{ scale: 1.01 }}
                    className="rounded-xl p-4"
                    style={{
                      background: `linear-gradient(135deg, ${item.bgColor} 0%, transparent 100%)`,
                      border: `1px solid ${item.borderColor}`,
                    }}
                  >
                    <p className={`font-medium ${item.textColor} mb-1`}>{item.title}</p>
                    <p className="text-sm text-night-300">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Spiritual Tips */}
          <motion.section variants={fadeInUp}>
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="p-2.5 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(134,169,113,0.2) 0%, rgba(134,169,113,0.1) 100%)',
                  border: '1px solid rgba(134,169,113,0.2)',
                }}
              >
                <Heart className="w-5 h-5 text-sage-400" />
              </div>
              <h2 className="text-xl font-semibold text-night-100">Spiritual Keys</h2>
            </div>
            
            <div className="liquid-card-interactive rounded-2xl p-5 space-y-4">
              {[
                { title: 'Make Sincere Intention (Niyyah)', desc: 'Before each session, renew your intention: "I memorize for Allah\'s pleasure."' },
                { title: 'Ask Allah for Help', desc: '"رَبِّ زِدْنِي عِلْمًا" (Rabbi zidni \'ilma) - "My Lord, increase me in knowledge"' },
                { title: 'Avoid Major Sins', desc: 'Imam Shafi\'i said his memory weakened due to sin. A pure heart holds Quran better.' },
                { title: 'Understand the Meaning', desc: 'Comprehension aids memory. Learn the tafsir (explanation) of what you memorize.' },
              ].map((item, i) => (
                <motion.div 
                  key={item.title}
                  whileHover={{ x: 4 }}
                  className="flex items-start gap-3"
                >
                  <div 
                    className="p-1.5 rounded-lg flex-shrink-0 mt-0.5"
                    style={{
                      background: 'linear-gradient(135deg, rgba(201,162,39,0.2) 0%, rgba(201,162,39,0.1) 100%)',
                      border: '1px solid rgba(201,162,39,0.2)',
                    }}
                  >
                    <Lightbulb className="w-4 h-4 text-gold-400" />
                  </div>
                  <div>
                    <p className="font-medium text-night-100 mb-1">{item.title}</p>
                    <p className="text-sm text-night-400">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Call to Action */}
          <motion.div
            variants={fadeInUp}
            className="text-center pt-4"
          >
            <Link href="/lessons">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="liquid-btn text-base px-8 py-4 inline-flex items-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                Start Your Next Lesson
              </motion.button>
            </Link>
            
            <p className="text-sm text-night-500 mt-6 leading-relaxed">
              The best time to start memorizing Quran was yesterday.<br />
              The second best time is <span className="text-gold-400 font-medium">now</span>.
            </p>
          </motion.div>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
