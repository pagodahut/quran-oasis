'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Sparkles, Loader2, BookOpen, Target, Clock, Check } from 'lucide-react';
import { HifzIcon } from '@/components/brand';

type Step = 'name' | 'journey' | 'arabic' | 'goal' | 'time' | 'welcome';

const ARABIC_OPTIONS = [
  { value: 'none', label: 'Complete beginner', icon: '🌱' },
  { value: 'letters', label: 'Know the letters', icon: '🔤' },
  { value: 'basic', label: 'Can read basics', icon: '📖' },
  { value: 'intermediate', label: 'Intermediate', icon: '📚' },
  { value: 'fluent', label: 'Fluent', icon: '✨' },
];

const GOAL_OPTIONS = [
  { value: 'full_hifz', label: 'Full Quran memorization', icon: '🕌' },
  { value: 'juz_amma', label: 'Juz Amma', icon: '🌙' },
  { value: 'selected_surahs', label: 'Selected surahs', icon: '⭐' },
  { value: 'daily_connection', label: 'Daily recitation', icon: '🤲' },
];

const TIME_OPTIONS = [
  { value: 5, label: '5 minutes', sub: 'A gentle start' },
  { value: 15, label: '15 minutes', sub: 'Steady progress' },
  { value: 30, label: '30 minutes', sub: 'Dedicated learner' },
  { value: 60, label: '60+ minutes', sub: 'Deep immersion' },
];

const STEPS: Step[] = ['name', 'journey', 'arabic', 'goal', 'time', 'welcome'];

const SHEIKH_RESPONSES: Record<string, string> = {
  none: "Everyone starts somewhere. I'll guide you from the very beginning. 🌟",
  letters: "Great foundation! We'll build on that together.",
  basic: "MashaAllah, you're already on your way!",
  intermediate: "Wonderful progress! Let's take it further.",
  fluent: "SubhanAllah! You're blessed with a strong foundation.",
  full_hifz: "The highest aspiration! May Allah make it easy for you. 🤲",
  juz_amma: "A beautiful and achievable goal. Let's do this!",
  selected_surahs: "Quality over quantity — a wise approach.",
  daily_connection: "Consistency is the key to connection with the Quran.",
};

interface OnboardingState {
  name: string;
  arabicLevel: string;
  goal: string;
  dailyTime: number;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('name');
  const [data, setData] = useState<OnboardingState>({
    name: '',
    arabicLevel: '',
    goal: '',
    dailyTime: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sheikhResponse, setSheikhResponse] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);

  const currentIndex = STEPS.indexOf(step);

  useEffect(() => {
    if (step === 'name' && nameInputRef.current) {
      setTimeout(() => nameInputRef.current?.focus(), 500);
    }
  }, [step]);

  const goNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < STEPS.length) {
      setSheikhResponse('');
      setStep(STEPS[nextIndex]);
    }
  }, [currentIndex]);

  const goBack = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setSheikhResponse('');
      setStep(STEPS[prevIndex]);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      localStorage.setItem('quranOasis_userName', data.name);
      const onboardingData = {
        name: data.name,
        arabicLevel: data.arabicLevel,
        goal: data.goal,
        dailyTimeMinutes: data.dailyTime,
        priorMemorization: 'none',
        preferredReciter: 'alafasy',
        learningMode: 'beginner',
      };
      localStorage.setItem('quranOasis_onboarding', JSON.stringify(onboardingData));
      localStorage.setItem('quranOasis_onboardingComplete', 'true');
      localStorage.setItem('quranOasis_preferences', JSON.stringify({
        reciter: 'alafasy',
        dailyMinutes: data.dailyTime,
      }));
      try {
        await fetch('/api/onboarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(onboardingData),
        });
      } catch { /* not authenticated */ }
      router.push('/dashboard');
    } catch (error) {
      console.error('Onboarding error:', error);
      router.push('/dashboard');
    }
    setIsSubmitting(false);
  };

  const selectOption = (key: keyof OnboardingState, value: string | number) => {
    setData(prev => ({ ...prev, [key]: value }));
    const responseKey = String(value);
    if (SHEIKH_RESPONSES[responseKey]) {
      setSheikhResponse(SHEIKH_RESPONSES[responseKey]);
    }
    setTimeout(goNext, 800);
  };

  return (
    <div className="min-h-screen min-h-dvh bg-night-950 flex flex-col relative overflow-hidden">
      {/* Ambient background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(201,162,39,0.04) 0%, transparent 70%)',
        }}
      />

      {/* Header */}
      <header className="p-4 safe-area-top relative z-10">
        <div className="flex items-center justify-between">
          {currentIndex > 0 && step !== 'welcome' ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={goBack}
              className="text-night-400 hover:text-night-200 p-2 -ml-2 text-lg"
              aria-label="Go back"
            >
              ←
            </motion.button>
          ) : (
            <div className="w-8" />
          )}

          {/* Progress dots */}
          {step !== 'welcome' && (
            <div className="flex gap-2 items-center">
              {STEPS.filter(s => s !== 'welcome').map((s, i) => (
                <motion.div
                  key={s}
                  className="rounded-full"
                  style={{
                    width: i === currentIndex ? 24 : 8,
                    height: 8,
                    background: i <= currentIndex
                      ? 'linear-gradient(90deg, #c9a227, #f4d47c)'
                      : 'rgba(255,255,255,0.1)',
                    borderRadius: 4,
                  }}
                  animate={{
                    width: i === currentIndex ? 24 : 8,
                  }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          )}

          <button
            onClick={() => {
              localStorage.setItem('quranOasis_onboardingComplete', 'true');
              router.push('/dashboard');
            }}
            className="text-sm text-night-600 hover:text-night-400 px-2 py-1 transition-colors"
          >
            Skip
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col px-6 py-6 relative z-10">
        <AnimatePresence mode="wait">
          {/* Step 0: Name */}
          {step === 'name' && (
            <StepContainer key="name">
              <SheikhBubble typing>
                Assalamu Alaikum! I&apos;m Sheikh HIFZ, your personal guide on this beautiful journey. What&apos;s your name?
              </SheikhBubble>

              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <input
                  ref={nameInputRef}
                  type="text"
                  value={data.name}
                  onChange={(e) => setData(prev => ({ ...prev, name: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && data.name.trim()) goNext();
                  }}
                  placeholder="Enter your name..."
                  className="w-full px-5 py-4 rounded-2xl text-night-100 text-lg placeholder-night-600 outline-none transition-all duration-300 focus:shadow-[0_0_0_1px_rgba(201,162,39,0.4),0_0_20px_rgba(201,162,39,0.1)]"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    fontFamily: "'Inter', system-ui, sans-serif",
                  }}
                />
              </motion.div>

              <div className="mt-auto pt-8">
                <GoldButton onClick={goNext} disabled={!data.name.trim()}>
                  Continue <ChevronRight className="w-5 h-5" />
                </GoldButton>
              </div>
            </StepContainer>
          )}

          {/* Step 1: The Journey (Hadith) */}
          {step === 'journey' && (
            <StepContainer key="journey">
              <SheikhBubble>
                MashaAllah {data.name}, it&apos;s wonderful to meet you! 🌙
              </SheikhBubble>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mt-8 p-8 rounded-3xl relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(201,162,39,0.06) 0%, rgba(15,20,25,0.8) 100%)',
                  border: '1px solid rgba(201,162,39,0.15)',
                }}
              >
                {/* Moon motif */}
                <div
                  className="absolute top-4 right-4 w-16 h-16 rounded-full opacity-10"
                  style={{
                    background: 'radial-gradient(circle at 30% 30%, #c9a227 0%, transparent 70%)',
                  }}
                />

                {/* Arabic text */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-gold-400 text-xl leading-relaxed text-center mb-6"
                  style={{
                    fontFamily: "'Amiri', 'Scheherazade New', serif",
                    direction: 'rtl',
                  }}
                >
                  خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ
                </motion.p>

                {/* Divider */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                  className="h-px mx-auto mb-6 w-24"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(201,162,39,0.4), transparent)' }}
                />

                {/* English */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-night-300 leading-relaxed text-base italic text-center"
                  style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
                >
                  &ldquo;The best among you are those who learn the Quran and teach it.&rdquo;
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="text-night-500 text-sm mt-3 text-center"
                >
                  — Prophet Muhammad ﷺ (Sahih al-Bukhari)
                </motion.p>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="text-night-400 mt-6 leading-relaxed text-center"
              >
                You&apos;re about to begin one of the most rewarding journeys of your life.
              </motion.p>

              <div className="mt-auto pt-8">
                <GoldButton onClick={goNext}>
                  Begin my journey <ChevronRight className="w-5 h-5" />
                </GoldButton>
              </div>
            </StepContainer>
          )}

          {/* Step 2: Arabic Level */}
          {step === 'arabic' && (
            <StepContainer key="arabic">
              <SheikhBubble>
                {data.name}, how familiar are you with Arabic?
              </SheikhBubble>

              <motion.div
                className="mt-8 space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {ARABIC_OPTIONS.map((option, i) => (
                  <OptionPill
                    key={option.value}
                    selected={data.arabicLevel === option.value}
                    onClick={() => selectOption('arabicLevel', option.value)}
                    icon={option.icon}
                    delay={0.05 * i}
                  >
                    {option.label}
                  </OptionPill>
                ))}
              </motion.div>

              <SheikhResponse text={sheikhResponse} />
            </StepContainer>
          )}

          {/* Step 3: Goal */}
          {step === 'goal' && (
            <StepContainer key="goal">
              <SheikhBubble>
                What would you like to achieve, {data.name}?
              </SheikhBubble>

              <motion.div
                className="mt-8 space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {GOAL_OPTIONS.map((option, i) => (
                  <OptionPill
                    key={option.value}
                    selected={data.goal === option.value}
                    onClick={() => selectOption('goal', option.value)}
                    icon={option.icon}
                    delay={0.05 * i}
                  >
                    {option.label}
                  </OptionPill>
                ))}
              </motion.div>

              <SheikhResponse text={sheikhResponse} />
            </StepContainer>
          )}

          {/* Step 4: Daily Commitment */}
          {step === 'time' && (
            <StepContainer key="time">
              <SheikhBubble>
                How much time can you dedicate each day?
              </SheikhBubble>

              <motion.div
                className="mt-8 space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {TIME_OPTIONS.map((option, i) => (
                  <OptionPill
                    key={option.value}
                    selected={data.dailyTime === option.value}
                    onClick={() => selectOption('dailyTime', option.value)}
                    delay={0.05 * i}
                  >
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      <span className="text-xs text-night-500 mt-0.5">{option.sub}</span>
                    </div>
                  </OptionPill>
                ))}
              </motion.div>

              <SheikhResponse text={sheikhResponse} />
            </StepContainer>
          )}

          {/* Step 5: Personalized Welcome */}
          {step === 'welcome' && (
            <StepContainer key="welcome">
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                {/* Golden bloom */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2, damping: 15 }}
                  className="relative mb-8"
                >
                  <div
                    className="absolute inset-0 blur-3xl"
                    style={{
                      background: 'radial-gradient(circle, rgba(201,162,39,0.3) 0%, transparent 70%)',
                      transform: 'scale(3)',
                    }}
                  />
                  <div
                    className="w-20 h-20 rounded-3xl flex items-center justify-center relative z-10"
                    style={{
                      background: 'linear-gradient(135deg, rgba(201,162,39,0.95) 0%, rgba(180,140,30,1) 100%)',
                      boxShadow: '0 8px 40px rgba(201,162,39,0.4)',
                    }}
                  >
                    <Sparkles className="w-10 h-10 text-night-950" />
                  </div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-2xl font-bold text-night-100 mb-3"
                >
                  {data.name}, your journey begins now
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-night-400 mb-10 leading-relaxed max-w-sm"
                >
                  I&apos;ve prepared a personalized path just for you. May Allah make it easy and blessed. 🤲
                </motion.p>

                {/* Feature preview cards */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="grid grid-cols-3 gap-3 w-full max-w-sm mb-10"
                >
                  {[
                    { icon: BookOpen, label: 'Guided\nLessons' },
                    { icon: Target, label: 'Smart\nReview' },
                    { icon: Clock, label: 'Daily\nPractice' },
                  ].map((feature, i) => (
                    <motion.div
                      key={feature.label}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + i * 0.1 }}
                      className="flex flex-col items-center gap-2 p-4 rounded-2xl"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                        border: '1px solid rgba(201,162,39,0.1)',
                      }}
                    >
                      <feature.icon className="w-5 h-5 text-gold-400" />
                      <span className="text-xs text-night-300 text-center whitespace-pre-line leading-tight">{feature.label}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              <div className="pt-4">
                <GoldButton onClick={handleComplete} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Preparing your path...
                    </>
                  ) : (
                    <>
                      Enter <Sparkles className="w-5 h-5" />
                    </>
                  )}
                </GoldButton>
              </div>
            </StepContainer>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

/* ─── Sub-components ─── */

function StepContainer({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  );
}

function SheikhBubble({ children, typing }: { children: React.ReactNode; typing?: boolean }) {
  const [showContent, setShowContent] = useState(!typing);

  useEffect(() => {
    if (typing) {
      const t = setTimeout(() => setShowContent(true), 600);
      return () => clearTimeout(t);
    }
  }, [typing]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="flex gap-3 items-start"
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background: 'linear-gradient(135deg, rgba(201,162,39,0.9), rgba(180,140,30,1))',
          boxShadow: '0 0 24px rgba(201,162,39,0.25)',
        }}
      >
        <HifzIcon size={20} animated={false} />
      </div>
      <div
        className="p-4 rounded-2xl max-w-[85%]"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 100%)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderTopLeftRadius: '4px',
          backdropFilter: 'blur(12px)',
        }}
      >
        {!showContent && typing ? (
          <div className="flex gap-1.5 py-1 px-1">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-night-500"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }}
              />
            ))}
          </div>
        ) : (
          <p className="text-night-200 leading-relaxed">{children}</p>
        )}
      </div>
    </motion.div>
  );
}

function SheikhResponse({ text }: { text: string }) {
  if (!text) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 ml-13 pl-[52px]"
    >
      <p className="text-gold-400/80 text-sm italic">{text}</p>
    </motion.div>
  );
}

function OptionPill({
  children,
  selected,
  onClick,
  icon,
  delay = 0,
}: {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  icon?: string;
  delay?: number;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="w-full text-left px-5 py-4 rounded-2xl transition-all duration-300 flex items-center gap-3 relative overflow-hidden"
      style={{
        background: selected
          ? 'linear-gradient(135deg, rgba(201,162,39,0.12) 0%, rgba(201,162,39,0.04) 100%)'
          : 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        border: selected
          ? '1px solid rgba(201,162,39,0.35)'
          : '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {icon && <span className="text-lg">{icon}</span>}
      <span className={`flex-1 ${selected ? 'text-gold-400 font-medium' : 'text-night-200'}`}>
        {children}
      </span>
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #c9a227, #f4d47c)' }}
        >
          <Check className="w-3.5 h-3.5 text-night-950" />
        </motion.div>
      )}
    </motion.button>
  );
}

function GoldButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-base font-semibold disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(201,162,39,0.95) 0%, rgba(180,140,30,1) 100%)',
        color: '#0a0a0f',
        boxShadow: disabled ? 'none' : '0 8px 32px rgba(201,162,39,0.35), inset 0 1px 0 rgba(255,255,255,0.3)',
        border: '1px solid rgba(255,255,255,0.2)',
      }}
    >
      {/* Shine sweep */}
      {!disabled && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)',
          }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 3 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
