'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Lightbulb,
  BookOpen,
  Brain,
  Headphones,
  Sparkles,
  MessageCircle,
  CheckCircle2,
  Info,
  Star,
  Moon,
  Heart,
  Volume2,
} from 'lucide-react';

// ============================================
// Bismillah Header - Start of every lesson
// ============================================
export function BismillahHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-8 pt-2"
    >
      <div className="inline-flex items-center gap-3 text-gold-500/60 text-sm mb-3">
        <Star className="w-3 h-3" />
        <span className="tracking-widest uppercase">Begin with Blessing</span>
        <Star className="w-3 h-3" />
      </div>
      <p className="font-arabic text-2xl text-gold-400 leading-relaxed" style={{ direction: 'rtl' }}>
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </p>
      <p className="text-night-500 text-sm mt-2 italic">
        "In the name of Allah, the Most Gracious, the Most Merciful"
      </p>
    </motion.div>
  );
}

// ============================================
// Dua Card - Before/After lessons
// ============================================
export function DuaCard({ 
  type, 
  arabic, 
  transliteration, 
  translation 
}: { 
  type: 'start' | 'end';
  arabic: string;
  transliteration: string;
  translation: string;
}) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-sage-900/30 to-sage-950/40 border border-sage-800/30 rounded-2xl p-4 mb-6"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sage-800/50 flex items-center justify-center">
            {type === 'start' ? (
              <Moon className="w-4 h-4 text-sage-400" />
            ) : (
              <Heart className="w-4 h-4 text-sage-400" />
            )}
          </div>
          <span className="text-sage-300 text-sm font-medium">
            {type === 'start' ? 'Dua for Seeking Knowledge' : 'Dua for Completion'}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-sage-500 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-3">
              <p className="font-arabic text-xl text-sage-200 text-center leading-relaxed" style={{ direction: 'rtl' }}>
                {arabic}
              </p>
              <p className="text-sage-400 text-sm text-center italic">
                {transliteration}
              </p>
              <p className="text-sage-300 text-sm text-center">
                "{translation}"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================
// Content Block Types for Progressive Disclosure
// ============================================
interface ContentBlockProps {
  children: React.ReactNode;
  title?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'highlight' | 'tip' | 'example' | 'warning';
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export function ContentBlock({ 
  children, 
  title,
  icon,
  variant = 'default',
  collapsible = false,
  defaultOpen = true 
}: ContentBlockProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  const variantStyles = {
    default: 'bg-night-900/40 border-night-800/50',
    highlight: 'bg-gold-900/20 border-gold-500/30',
    tip: 'bg-sage-900/20 border-sage-700/30',
    example: 'bg-midnight-900/20 border-midnight-700/30',
    warning: 'bg-amber-900/20 border-amber-700/30',
  };
  
  const iconColors = {
    default: 'text-night-400',
    highlight: 'text-gold-400',
    tip: 'text-sage-400',
    example: 'text-midnight-400',
    warning: 'text-amber-400',
  };
  
  const content = (
    <div className="space-y-2 text-night-200 leading-relaxed">
      {children}
    </div>
  );
  
  if (!collapsible) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl border p-4 mb-4 ${variantStyles[variant]}`}
      >
        {title && (
          <div className="flex items-center gap-2 mb-3">
            {icon && <span className={iconColors[variant]}>{icon}</span>}
            <h4 className="font-semibold text-night-100">{title}</h4>
          </div>
        )}
        {content}
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border mb-4 overflow-hidden ${variantStyles[variant]}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon && <span className={iconColors[variant]}>{icon}</span>}
          {title && <h4 className="font-semibold text-night-100">{title}</h4>}
        </div>
        <ChevronDown className={`w-4 h-4 text-night-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================
// Callout Box for Important Information
// ============================================
export function Callout({ 
  type = 'info',
  title,
  children 
}: { 
  type?: 'info' | 'tip' | 'warning' | 'success';
  title?: string;
  children: React.ReactNode;
}) {
  const styles = {
    info: {
      bg: 'bg-midnight-900/30',
      border: 'border-midnight-700/50',
      icon: <Info className="w-4 h-4 text-midnight-400" />,
      titleColor: 'text-midnight-300',
    },
    tip: {
      bg: 'bg-sage-900/30',
      border: 'border-sage-700/50',
      icon: <Lightbulb className="w-4 h-4 text-sage-400" />,
      titleColor: 'text-sage-300',
    },
    warning: {
      bg: 'bg-amber-900/30',
      border: 'border-amber-700/50',
      icon: <Info className="w-4 h-4 text-amber-400" />,
      titleColor: 'text-amber-300',
    },
    success: {
      bg: 'bg-green-900/30',
      border: 'border-green-700/50',
      icon: <CheckCircle2 className="w-4 h-4 text-green-400" />,
      titleColor: 'text-green-300',
    },
  };
  
  const style = styles[type];
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`${style.bg} ${style.border} border-l-4 rounded-r-xl p-4 my-4`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{style.icon}</div>
        <div className="flex-1">
          {title && (
            <h5 className={`font-semibold ${style.titleColor} mb-1`}>{title}</h5>
          )}
          <div className="text-night-300 text-sm leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// Memory Trick Card
// ============================================
export function MemoryTrick({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-r from-gold-900/20 via-gold-900/10 to-transparent border border-gold-500/20 rounded-xl p-4 my-4"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-gold-500/20 flex items-center justify-center flex-shrink-0">
          <Brain className="w-4 h-4 text-gold-400" />
        </div>
        <div>
          <h5 className="font-semibold text-gold-400 mb-1">
            {title || '🧠 Memory Trick'}
          </h5>
          <div className="text-night-300 text-sm leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// Practice Prompt
// ============================================
export function PracticePrompt({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-sage-900/20 border border-sage-700/30 rounded-xl p-4 my-4"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-sage-700/30 flex items-center justify-center flex-shrink-0">
          <Headphones className="w-4 h-4 text-sage-400" />
        </div>
        <div>
          <h5 className="font-semibold text-sage-400 mb-1">Practice Time</h5>
          <div className="text-night-300 text-sm leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// Quran Reference Card
// ============================================
export function QuranReference({ 
  arabic, 
  transliteration, 
  translation,
  surah,
  ayah 
}: { 
  arabic: string;
  transliteration: string;
  translation: string;
  surah?: string;
  ayah?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-night-900/60 border border-night-700/50 rounded-2xl p-5 my-5"
    >
      {surah && ayah && (
        <div className="flex items-center justify-center gap-2 text-night-500 text-xs mb-3">
          <BookOpen className="w-3 h-3" />
          <span>{surah} : {ayah}</span>
        </div>
      )}
      <p className="font-arabic text-2xl text-gold-300 text-center leading-[2] mb-3" style={{ direction: 'rtl' }}>
        {arabic}
      </p>
      <p className="text-night-400 text-sm text-center italic mb-2">
        {transliteration}
      </p>
      <p className="text-night-300 text-sm text-center">
        "{translation}"
      </p>
    </motion.div>
  );
}

// ============================================
// Letter Comparison Component
// ============================================
export function LetterComparison({ 
  letters 
}: { 
  letters: Array<{
    arabic: string;
    name: string;
    description: string;
    highlight?: boolean;
  }>;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 my-4">
      {letters.map((letter, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`
            rounded-xl p-4 text-center
            ${letter.highlight 
              ? 'bg-gold-900/30 border-2 border-gold-500/50' 
              : 'bg-night-800/50 border border-night-700/50'
            }
          `}
        >
          <div 
            className={`font-arabic text-4xl mb-2 ${letter.highlight ? 'text-gold-400' : 'text-night-200'}`}
            style={{ direction: 'rtl' }}
          >
            {letter.arabic}
          </div>
          <div className={`text-sm font-medium ${letter.highlight ? 'text-gold-300' : 'text-night-300'}`}>
            {letter.name}
          </div>
          <div className="text-xs text-night-500 mt-1">
            {letter.description}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ============================================
// Step Type Icon
// ============================================
export function StepTypeIcon({ type }: { type: string }) {
  const icons: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
    instruction: { icon: <Lightbulb className="w-4 h-4" />, color: 'text-gold-400', label: 'Introduction' },
    explanation: { icon: <BookOpen className="w-4 h-4" />, color: 'text-sage-400', label: 'Learn' },
    exercise: { icon: <Brain className="w-4 h-4" />, color: 'text-purple-400', label: 'Practice' },
    practice: { icon: <Headphones className="w-4 h-4" />, color: 'text-blue-400', label: 'Listen' },
  };
  
  const config = icons[type] || icons.instruction;
  
  return (
    <div className="flex items-center gap-2">
      <div className={`${config.color}`}>{config.icon}</div>
      <span className="text-xs uppercase tracking-wider text-night-500 font-medium">
        {config.label}
      </span>
    </div>
  );
}

// ============================================
// Progress Milestone
// ============================================
export function ProgressMilestone({ 
  achieved,
  title,
  description 
}: { 
  achieved: boolean;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-start gap-3 p-3 rounded-xl ${
        achieved 
          ? 'bg-green-900/20 border border-green-700/30' 
          : 'bg-night-800/30 border border-night-700/30'
      }`}
    >
      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
        achieved ? 'bg-green-500' : 'bg-night-700'
      }`}>
        {achieved ? (
          <CheckCircle2 className="w-4 h-4 text-white" />
        ) : (
          <div className="w-2 h-2 rounded-full bg-night-500" />
        )}
      </div>
      <div>
        <h5 className={`font-medium ${achieved ? 'text-green-300' : 'text-night-400'}`}>
          {title}
        </h5>
        <p className="text-night-500 text-sm">{description}</p>
      </div>
    </motion.div>
  );
}

// ============================================
// Lesson Summary Card
// ============================================
export function LessonSummary({ 
  items 
}: { 
  items: Array<{ label: string; value: string; icon?: React.ReactNode }>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-night-900/60 border border-night-700/50 rounded-2xl p-5 my-5"
    >
      <h4 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-4 flex items-center gap-2">
        <Star className="w-4 h-4" />
        Lesson Summary
      </h4>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <span className="text-night-400 flex items-center gap-2">
              {item.icon}
              {item.label}
            </span>
            <span className="text-night-200 font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ============================================
// Encouragement Message
// ============================================
export function EncouragementMessage({ message }: { message: string }) {
  const encouragements = [
    "Mashallah! Keep going! 🌟",
    "You're doing great! 💪",
    "Every letter brings you closer! ✨",
    "Allah rewards your effort! 🤲",
    "Small steps lead to big achievements! 🎯",
  ];
  
  const displayMessage = message || encouragements[Math.floor(Math.random() * encouragements.length)];
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-r from-gold-500/20 to-gold-600/10 rounded-xl p-4 text-center my-4"
    >
      <p className="text-gold-300 font-medium">{displayMessage}</p>
    </motion.div>
  );
}
