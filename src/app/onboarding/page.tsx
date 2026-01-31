'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play,
  Pause,
  Check,
  BookOpen,
  Clock,
  Target,
  Sparkles
} from 'lucide-react';
import { RECITERS, getAudioUrl } from '@/lib/quranData';

type Step = 'arabic' | 'experience' | 'goal' | 'time' | 'reciter' | 'complete';

const ARABIC_LEVELS = [
  { value: 'none' as const, label: "I can't read Arabic yet", desc: "Starting from scratch" },
  { value: 'letters' as const, label: "I know the alphabet", desc: "Can recognize letters but slow at reading" },
  { value: 'basic' as const, label: "I can read slowly", desc: "Can read with some hesitation" },
  { value: 'intermediate' as const, label: "I read fairly well", desc: "Comfortable reading most text" },
  { value: 'fluent' as const, label: "I'm fluent in Arabic", desc: "Can read quickly and accurately" },
];

interface OnboardingData {
  arabicLevel: 'none' | 'letters' | 'basic' | 'intermediate' | 'fluent';
  memorizedBefore: boolean;
  currentMemorized: string;
  goal: 'full_hifz' | 'juz_amma' | 'selected_surahs' | 'daily_recitation';
  dailyMinutes: number;
  preferredReciter: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('arabic');
  const [data, setData] = useState<OnboardingData>({
    arabicLevel: 'none',
    memorizedBefore: false,
    currentMemorized: '',
    goal: 'juz_amma',
    dailyMinutes: 20,
    preferredReciter: 'alafasy',
  });
  const [playingReciter, setPlayingReciter] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const steps: Step[] = ['arabic', 'experience', 'goal', 'time', 'reciter', 'complete'];
  const currentIndex = steps.indexOf(step);
  const progress = ((currentIndex) / (steps.length - 1)) * 100;

  const goNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex]);
    }
  };

  const goBack = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setStep(steps[prevIndex]);
    }
  };

  const playReciterPreview = (reciterId: string) => {
    if (playingReciter === reciterId) {
      audioRef.current?.pause();
      setPlayingReciter(null);
      return;
    }
    
    const url = getAudioUrl(1, 1, reciterId);
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.play();
      setPlayingReciter(reciterId);
    }
  };

  const completeOnboarding = () => {
    localStorage.setItem('quranOasis_onboarding', JSON.stringify(data));
    localStorage.setItem('quranOasis_preferences', JSON.stringify({
      reciter: data.preferredReciter,
      dailyMinutes: data.dailyMinutes,
    }));
    
    router.push('/lessons');
  };

  // Option card component
  const OptionCard = ({ 
    selected, 
    onClick, 
    icon, 
    label, 
    desc 
  }: { 
    selected: boolean; 
    onClick: () => void; 
    icon?: React.ReactNode;
    label: string; 
    desc: string;
  }) => (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="w-full text-left p-4 rounded-2xl transition-all"
      style={{
        background: selected 
          ? 'linear-gradient(135deg, rgba(201,162,39,0.15) 0%, rgba(201,162,39,0.05) 100%)'
          : 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        border: selected 
          ? '1px solid rgba(201,162,39,0.3)'
          : '1px solid rgba(255,255,255,0.06)',
        boxShadow: selected 
          ? '0 4px 20px rgba(201,162,39,0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
          : '0 2px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      <div className="flex items-center gap-3">
        {icon ? (
          <div 
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{
              background: selected 
                ? 'linear-gradient(135deg, rgba(201,162,39,0.2) 0%, rgba(201,162,39,0.1) 100%)'
                : 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <span className={selected ? 'text-gold-400' : 'text-night-400'}>{icon}</span>
          </div>
        ) : (
          <div 
            className="w-5 h-5 rounded-full flex items-center justify-center"
            style={{
              background: selected 
                ? 'linear-gradient(135deg, rgba(201,162,39,1) 0%, rgba(180,140,30,1) 100%)'
                : 'transparent',
              border: selected ? '1px solid rgba(255,255,255,0.3)' : '2px solid rgba(255,255,255,0.15)',
            }}
          >
            {selected && <Check className="w-3 h-3 text-night-950" />}
          </div>
        )}
        <div className="flex-1">
          <p className="font-medium text-night-100">{label}</p>
          <p className="text-sm text-night-500">{desc}</p>
        </div>
      </div>
    </motion.button>
  );

  return (
    <div className="min-h-screen bg-night-950 flex flex-col">
      <audio ref={audioRef} onEnded={() => setPlayingReciter(null)} />

      {/* Header - Liquid Glass */}
      <header 
        className="p-4 safe-area-top"
        style={{
          background: step !== 'complete' 
            ? 'linear-gradient(180deg, rgba(15,15,20,0.9) 0%, transparent 100%)'
            : 'transparent',
        }}
      >
        <div className="flex items-center justify-between">
          {step !== 'arabic' ? (
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={goBack} 
              className="liquid-icon-btn"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
          ) : (
            <div className="w-11" />
          )}
          
          {step !== 'complete' && (
            <div className="flex-1 mx-4">
              <div className="liquid-progress h-1.5">
                <motion.div
                  className="liquid-progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
          
          <button 
            onClick={() => router.push('/lessons')}
            className="text-sm text-night-500 hover:text-night-300 transition-colors px-2 py-1"
          >
            Skip
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col px-6 py-8">
        <AnimatePresence mode="wait">
          {/* Arabic Level */}
          {step === 'arabic' && (
            <StepContainer key="arabic">
              <h2 className="text-2xl font-semibold text-night-100 mb-2">
                What's your Arabic reading level?
              </h2>
              <p className="text-night-400 mb-8">
                This helps us customize your starting point
              </p>
              
              <div className="space-y-3 mb-8">
                {ARABIC_LEVELS.map((option) => (
                  <OptionCard
                    key={option.value}
                    selected={data.arabicLevel === option.value}
                    onClick={() => setData({ ...data, arabicLevel: option.value })}
                    label={option.label}
                    desc={option.desc}
                  />
                ))}
              </div>
              
              <div className="mt-auto">
                <ContinueButton onClick={goNext} />
              </div>
            </StepContainer>
          )}

          {/* Experience */}
          {step === 'experience' && (
            <StepContainer key="experience">
              <h2 className="text-2xl font-semibold text-night-100 mb-2">
                Have you memorized Quran before?
              </h2>
              <p className="text-night-400 mb-8">
                Any amount counts - even a few verses
              </p>
              
              <div className="space-y-3 mb-8">
                <OptionCard
                  selected={!data.memorizedBefore}
                  onClick={() => setData({ ...data, memorizedBefore: false })}
                  label="This is my first time"
                  desc="I haven't memorized any Quran yet"
                />
                <OptionCard
                  selected={data.memorizedBefore}
                  onClick={() => setData({ ...data, memorizedBefore: true })}
                  label="Yes, I've memorized some"
                  desc="I have existing memorization"
                />
              </div>
              
              <div className="mt-auto">
                <ContinueButton onClick={goNext} />
              </div>
            </StepContainer>
          )}

          {/* Goal */}
          {step === 'goal' && (
            <StepContainer key="goal">
              <h2 className="text-2xl font-semibold text-night-100 mb-2">
                What's your goal?
              </h2>
              <p className="text-night-400 mb-8">
                We'll create a personalized plan for you
              </p>
              
              <div className="space-y-3 mb-8">
                {([
                  { value: 'daily_recitation' as const, label: "Daily Recitation", desc: "Read Quran regularly", icon: <BookOpen className="w-5 h-5" /> },
                  { value: 'selected_surahs' as const, label: "Selected Surahs", desc: "Memorize specific surahs for prayer", icon: <Target className="w-5 h-5" /> },
                  { value: 'juz_amma' as const, label: "Juz Amma", desc: "Memorize the 30th Juz (short surahs)", icon: <Sparkles className="w-5 h-5" /> },
                  { value: 'full_hifz' as const, label: "Full Hifz", desc: "Memorize the entire Quran", icon: <BookOpen className="w-5 h-5" /> },
                ]).map((option) => (
                  <OptionCard
                    key={option.value}
                    selected={data.goal === option.value}
                    onClick={() => setData({ ...data, goal: option.value })}
                    icon={option.icon}
                    label={option.label}
                    desc={option.desc}
                  />
                ))}
              </div>
              
              <div className="mt-auto">
                <ContinueButton onClick={goNext} />
              </div>
            </StepContainer>
          )}

          {/* Time Commitment */}
          {step === 'time' && (
            <StepContainer key="time">
              <h2 className="text-2xl font-semibold text-night-100 mb-2">
                How much time can you commit daily?
              </h2>
              <p className="text-night-400 mb-8">
                Consistency matters more than duration
              </p>
              
              <div className="space-y-3 mb-8">
                {[
                  { value: 10, label: "10 minutes", desc: "Quick daily practice" },
                  { value: 20, label: "20 minutes", desc: "Recommended for beginners" },
                  { value: 30, label: "30 minutes", desc: "Steady progress" },
                  { value: 45, label: "45 minutes", desc: "Serious commitment" },
                  { value: 60, label: "60+ minutes", desc: "Intensive learning" },
                ].map((option) => (
                  <OptionCard
                    key={option.value}
                    selected={data.dailyMinutes === option.value}
                    onClick={() => setData({ ...data, dailyMinutes: option.value })}
                    icon={<Clock className="w-5 h-5" />}
                    label={option.label}
                    desc={option.desc}
                  />
                ))}
              </div>
              
              <div className="mt-auto">
                <ContinueButton onClick={goNext} />
              </div>
            </StepContainer>
          )}

          {/* Reciter */}
          {step === 'reciter' && (
            <StepContainer key="reciter">
              <h2 className="text-2xl font-semibold text-night-100 mb-2">
                Choose your reciter
              </h2>
              <p className="text-night-400 mb-8">
                Tap to preview each reciter's style
              </p>
              
              <div className="space-y-3 mb-8">
                {RECITERS.map((reciter) => (
                  <motion.div
                    key={reciter.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setData({ ...data, preferredReciter: reciter.id })}
                    className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer"
                    style={{
                      background: data.preferredReciter === reciter.id 
                        ? 'linear-gradient(135deg, rgba(201,162,39,0.15) 0%, rgba(201,162,39,0.05) 100%)'
                        : 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                      border: data.preferredReciter === reciter.id 
                        ? '1px solid rgba(201,162,39,0.3)'
                        : '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-night-100">{reciter.name}</p>
                      <p className="text-sm text-night-500">{reciter.arabicName} • {reciter.style}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => { e.stopPropagation(); playReciterPreview(reciter.id); }}
                      className="p-2.5 rounded-xl"
                      style={{
                        background: playingReciter === reciter.id 
                          ? 'linear-gradient(135deg, rgba(201,162,39,1) 0%, rgba(180,140,30,1) 100%)'
                          : 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      {playingReciter === reciter.id ? (
                        <Pause className="w-4 h-4 text-night-950" />
                      ) : (
                        <Play className="w-4 h-4 text-night-300" />
                      )}
                    </motion.button>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-auto">
                <ContinueButton onClick={goNext} />
              </div>
            </StepContainer>
          )}

          {/* Complete */}
          {step === 'complete' && (
            <StepContainer key="complete">
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(134,169,113,0.95) 0%, rgba(100,140,90,1) 100%)',
                    boxShadow: '0 8px 32px rgba(134,169,113,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  <Check className="w-10 h-10 text-white" />
                </motion.div>
                <h1 className="text-3xl font-display text-night-100 mb-4">
                  You're All Set!
                </h1>
                <p className="text-night-400 max-w-sm mx-auto">
                  Your personalized learning path is ready. May Allah make this journey easy and blessed for you.
                </p>
              </div>

              {/* Summary - Liquid Glass */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-5 mb-8 space-y-4 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                }}
              >
                {[
                  { label: 'Arabic Level', value: data.arabicLevel.replace('_', ' ') },
                  { label: 'Goal', value: data.goal.replace(/_/g, ' ') },
                  { label: 'Daily Time', value: `${data.dailyMinutes} minutes` },
                  { label: 'Reciter', value: RECITERS.find(r => r.id === data.preferredReciter)?.name.split(' ').slice(-1)[0] || '' },
                ].map((item, i) => (
                  <div key={item.label} className="flex justify-between items-center text-sm">
                    <span className="text-night-400">{item.label}</span>
                    <span 
                      className="capitalize px-3 py-1 rounded-lg"
                      style={{
                        background: 'linear-gradient(135deg, rgba(201,162,39,0.15) 0%, rgba(201,162,39,0.05) 100%)',
                        color: '#c9a227',
                        border: '1px solid rgba(201,162,39,0.2)',
                      }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </motion.div>
              
              <div className="mt-auto">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={completeOnboarding} 
                  className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-base font-semibold"
                  style={{
                    background: 'linear-gradient(135deg, rgba(201,162,39,0.95) 0%, rgba(180,140,30,1) 100%)',
                    color: '#0a0a0f',
                    boxShadow: '0 8px 32px rgba(201,162,39,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  Start Learning
                  <Sparkles className="w-5 h-5" />
                </motion.button>
              </div>
            </StepContainer>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function StepContainer({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  );
}

function ContinueButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick} 
      className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-base font-semibold"
      style={{
        background: 'linear-gradient(135deg, rgba(201,162,39,0.95) 0%, rgba(180,140,30,1) 100%)',
        color: '#0a0a0f',
        boxShadow: '0 8px 32px rgba(201,162,39,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
        border: '1px solid rgba(255,255,255,0.2)',
      }}
    >
      Continue
      <ChevronRight className="w-5 h-5" />
    </motion.button>
  );
}
