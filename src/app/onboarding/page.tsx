'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Sparkles, Loader2 } from 'lucide-react';
import { HifzIcon } from '@/components/brand';

type Step = 'name' | 'journey' | 'arabic' | 'goal' | 'time' | 'welcome';

const ARABIC_OPTIONS = [
  { value: 'none', label: 'Complete beginner' },
  { value: 'letters', label: 'Know the letters' },
  { value: 'basic', label: 'Can read basics' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'fluent', label: 'Fluent' },
];

const GOAL_OPTIONS = [
  { value: 'full_hifz', label: 'Full Quran memorization' },
  { value: 'juz_amma', label: 'Juz Amma' },
  { value: 'selected_surahs', label: 'Selected surahs' },
  { value: 'daily_connection', label: 'Daily recitation' },
];

const TIME_OPTIONS = [
  { value: 5, label: '5 minutes' },
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 60, label: '60+ minutes' },
];

const STEPS: Step[] = ['name', 'journey', 'arabic', 'goal', 'time', 'welcome'];

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
  const nameInputRef = useRef<HTMLInputElement>(null);

  const currentIndex = STEPS.indexOf(step);
  const progress = (currentIndex / (STEPS.length - 1)) * 100;

  useEffect(() => {
    if (step === 'name' && nameInputRef.current) {
      setTimeout(() => nameInputRef.current?.focus(), 500);
    }
  }, [step]);

  const goNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < STEPS.length) {
      setStep(STEPS[nextIndex]);
    }
  };

  const goBack = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setStep(STEPS[prevIndex]);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      // Store name
      localStorage.setItem('quranOasis_userName', data.name);

      // Store onboarding data
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

      // Try syncing to server
      try {
        await fetch('/api/onboarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(onboardingData),
        });
      } catch {
        // Not authenticated — that's fine
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Onboarding error:', error);
      // Still redirect even on error
      router.push('/dashboard');
    }
    setIsSubmitting(false);
  };

  const selectOption = (key: keyof OnboardingState, value: string | number) => {
    setData(prev => ({ ...prev, [key]: value }));
    // Auto-advance after a short delay for button selections
    setTimeout(goNext, 300);
  };

  return (
    <div className="min-h-screen bg-night-950 flex flex-col">
      {/* Header */}
      <header className="p-4 safe-area-top">
        <div className="flex items-center justify-between">
          {currentIndex > 0 && step !== 'welcome' ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={goBack}
              className="text-night-400 hover:text-night-200 p-2 -ml-2"
              aria-label="Go back"
            >
              ←
            </motion.button>
          ) : (
            <div className="w-8" />
          )}

          {step !== 'welcome' && (
            <div className="flex-1 mx-4 h-1.5 rounded-full bg-night-800 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, rgba(201,162,39,1), rgba(180,140,30,1))',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          )}

          <button
            onClick={() => {
              localStorage.setItem('quranOasis_onboardingComplete', 'true');
              router.push('/dashboard');
            }}
            className="text-sm text-night-500 hover:text-night-300 px-2 py-1"
          >
            Skip
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col px-6 py-8">
        <AnimatePresence mode="wait">
          {/* Step 0: Name */}
          {step === 'name' && (
            <StepContainer key="name">
              <SheikhBubble>
                Assalamu Alaikum! I&apos;m Sheikh HIFZ, your personal guide on this beautiful journey. What&apos;s your name?
              </SheikhBubble>

              <div className="mt-8">
                <input
                  ref={nameInputRef}
                  type="text"
                  value={data.name}
                  onChange={(e) => setData(prev => ({ ...prev, name: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && data.name.trim()) goNext();
                  }}
                  placeholder="Enter your name..."
                  className="w-full px-5 py-4 rounded-2xl text-night-100 text-lg placeholder-night-600 outline-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                />
              </div>

              <div className="mt-auto pt-8">
                <GoldButton onClick={goNext} disabled={!data.name.trim()}>
                  Continue <ChevronRight className="w-5 h-5" />
                </GoldButton>
              </div>
            </StepContainer>
          )}

          {/* Step 1: The Journey (Storytelling) */}
          {step === 'journey' && (
            <StepContainer key="journey">
              <SheikhBubble>
                MashaAllah {data.name}, it&apos;s wonderful to meet you! 🌙
              </SheikhBubble>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6 p-6 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(201,162,39,0.08) 0%, rgba(201,162,39,0.02) 100%)',
                  border: '1px solid rgba(201,162,39,0.15)',
                }}
              >
                <p className="text-night-300 leading-relaxed text-base italic">
                  &ldquo;The superiority of the one who learns the Quran and teaches it over the rest of people is like the superiority of the moon over the rest of the celestial bodies.&rdquo;
                </p>
                <p className="text-night-500 text-sm mt-3">— Prophet Muhammad ﷺ</p>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-night-400 mt-6 leading-relaxed"
              >
                You&apos;re about to begin one of the most rewarding journeys of your life. Let me learn a little about you so I can guide you along the way.
              </motion.p>

              <div className="mt-auto pt-8 space-y-3">
                <GoldButton onClick={goNext}>
                  Begin my journey <ChevronRight className="w-5 h-5" />
                </GoldButton>
                <button
                  onClick={goNext}
                  className="w-full py-3 text-night-500 hover:text-night-300 text-sm"
                >
                  I&apos;m ready ✨
                </button>
              </div>
            </StepContainer>
          )}

          {/* Step 2: Arabic Level */}
          {step === 'arabic' && (
            <StepContainer key="arabic">
              <SheikhBubble>
                {data.name}, how familiar are you with Arabic?
              </SheikhBubble>

              <div className="mt-8 space-y-3">
                {ARABIC_OPTIONS.map((option) => (
                  <OptionButton
                    key={option.value}
                    selected={data.arabicLevel === option.value}
                    onClick={() => selectOption('arabicLevel', option.value)}
                  >
                    {option.label}
                  </OptionButton>
                ))}
              </div>
            </StepContainer>
          )}

          {/* Step 3: Goal */}
          {step === 'goal' && (
            <StepContainer key="goal">
              <SheikhBubble>
                What would you like to achieve, {data.name}?
              </SheikhBubble>

              <div className="mt-8 space-y-3">
                {GOAL_OPTIONS.map((option) => (
                  <OptionButton
                    key={option.value}
                    selected={data.goal === option.value}
                    onClick={() => selectOption('goal', option.value)}
                  >
                    {option.label}
                  </OptionButton>
                ))}
              </div>
            </StepContainer>
          )}

          {/* Step 4: Daily Commitment */}
          {step === 'time' && (
            <StepContainer key="time">
              <SheikhBubble>
                How much time can you dedicate each day?
              </SheikhBubble>

              <div className="mt-8 space-y-3">
                {TIME_OPTIONS.map((option) => (
                  <OptionButton
                    key={option.value}
                    selected={data.dailyTime === option.value}
                    onClick={() => selectOption('dailyTime', option.value)}
                  >
                    {option.label}
                  </OptionButton>
                ))}
              </div>
            </StepContainer>
          )}

          {/* Step 5: Personalized Welcome */}
          {step === 'welcome' && (
            <StepContainer key="welcome">
              <div className="text-center flex-1 flex flex-col items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(201,162,39,0.95) 0%, rgba(180,140,30,1) 100%)',
                    boxShadow: '0 8px 32px rgba(201,162,39,0.4)',
                  }}
                >
                  <Sparkles className="w-10 h-10 text-night-950" />
                </motion.div>

                <SheikhBubble centered>
                  {data.name}, your journey begins now. Based on what you&apos;ve told me, I&apos;ve prepared a personalized path just for you. May Allah make it easy and blessed. 🤲
                </SheikhBubble>
              </div>

              <div className="mt-auto pt-8">
                <GoldButton onClick={handleComplete} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Preparing your path...
                    </>
                  ) : (
                    <>
                      Let&apos;s start <Sparkles className="w-5 h-5" />
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
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  );
}

function SheikhBubble({ children, centered }: { children: React.ReactNode; centered?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className={`flex gap-3 ${centered ? 'flex-col items-center text-center' : 'items-start'}`}
    >
      {!centered && (
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, rgba(201,162,39,0.9), rgba(180,140,30,1))',
            boxShadow: '0 0 20px rgba(201,162,39,0.3)',
          }}
        >
          <HifzIcon size={20} animated={false} />
        </div>
      )}
      <div
        className={`p-4 rounded-2xl ${centered ? 'max-w-sm' : ''}`}
        style={{
          background: centered ? 'transparent' : 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
          border: centered ? 'none' : '1px solid rgba(255,255,255,0.06)',
          borderTopLeftRadius: centered ? undefined : '4px',
        }}
      >
        <p className="text-night-200 leading-relaxed">{children}</p>
      </div>
    </motion.div>
  );
}

function OptionButton({
  children,
  selected,
  onClick,
}: {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="w-full text-left px-5 py-4 rounded-2xl transition-all"
      style={{
        background: selected
          ? 'linear-gradient(135deg, rgba(201,162,39,0.15) 0%, rgba(201,162,39,0.05) 100%)'
          : 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        border: selected
          ? '1px solid rgba(201,162,39,0.3)'
          : '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <span className={selected ? 'text-gold-400 font-medium' : 'text-night-200'}>
        {children}
      </span>
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
      className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        background: 'linear-gradient(135deg, rgba(201,162,39,0.95) 0%, rgba(180,140,30,1) 100%)',
        color: '#0a0a0f',
        boxShadow: '0 8px 32px rgba(201,162,39,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
        border: '1px solid rgba(255,255,255,0.2)',
      }}
    >
      {children}
    </motion.button>
  );
}
