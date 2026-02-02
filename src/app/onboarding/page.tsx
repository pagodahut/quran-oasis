'use client';

import { useState, useRef, useMemo } from 'react';
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
  Sparkles,
  GraduationCap,
  Brain,
  Heart,
  Star,
  Loader2,
  MapPin,
  RefreshCw,
  Music,
  Search
} from 'lucide-react';
import { RECITERS, getAudioUrl } from '@/lib/quranData';

type Step = 'arabic' | 'memorization' | 'goal' | 'time' | 'starting' | 'reciter' | 'complete';

const ARABIC_LEVELS = [
  { value: 'none' as const, label: "I can't read Arabic yet", desc: "Starting from scratch", icon: <BookOpen className="w-5 h-5" /> },
  { value: 'letters' as const, label: "I know the letters", desc: "Can recognize letters but reading is slow", icon: <GraduationCap className="w-5 h-5" /> },
  { value: 'basic' as const, label: "I can read slowly", desc: "Can read with some hesitation", icon: <Brain className="w-5 h-5" /> },
  { value: 'intermediate' as const, label: "I read fairly well", desc: "Comfortable reading most text", icon: <Star className="w-5 h-5" /> },
  { value: 'fluent' as const, label: "I'm fluent in Arabic", desc: "Can read quickly and accurately", icon: <Sparkles className="w-5 h-5" /> },
];

const MEMORIZATION_LEVELS = [
  { value: 'none' as const, label: "This is my first time", desc: "I haven't memorized any Quran yet", icon: <Heart className="w-5 h-5" /> },
  { value: 'juz_amma' as const, label: "I know Juz Amma", desc: "Memorized the 30th Juz (short surahs)", icon: <BookOpen className="w-5 h-5" /> },
  { value: 'multiple_juz' as const, label: "I know multiple Juz", desc: "Memorized 2-10 Juz", icon: <Star className="w-5 h-5" /> },
  { value: 'significant' as const, label: "Significant portion", desc: "Memorized more than 10 Juz", icon: <Sparkles className="w-5 h-5" /> },
];

const GOALS = [
  { value: 'daily_connection' as const, label: "Daily Connection", desc: "Read Quran regularly and build a habit", icon: <Heart className="w-5 h-5" /> },
  { value: 'selected_surahs' as const, label: "Selected Surahs", desc: "Memorize specific surahs for prayer", icon: <Target className="w-5 h-5" /> },
  { value: 'juz_amma' as const, label: "Juz Amma", desc: "Memorize the 30th Juz (short surahs)", icon: <Sparkles className="w-5 h-5" /> },
  { value: 'full_hifz' as const, label: "Full Hifz", desc: "Memorize the entire Quran", icon: <GraduationCap className="w-5 h-5" /> },
];

const TIME_OPTIONS = [
  { value: 10, label: "10 minutes", desc: "Quick daily practice" },
  { value: 15, label: "15 minutes", desc: "Light but consistent" },
  { value: 20, label: "20 minutes", desc: "Recommended for beginners" },
  { value: 30, label: "30 minutes", desc: "Steady progress" },
  { value: 45, label: "45 minutes", desc: "Serious commitment" },
  { value: 60, label: "60+ minutes", desc: "Intensive learning" },
];

// Starting point options based on goal
const STARTING_POINTS = {
  full_hifz: {
    title: "Where would you like to start?",
    subtitle: "Most students begin from Al-Fatiha and progress forward",
    options: [
      { value: 'fatiha', label: "Al-Fatiha (Chapter 1)", desc: "The traditional starting point", icon: <BookOpen className="w-5 h-5" />, surah: 1 },
      { value: 'juz_amma', label: "Juz Amma (Short Surahs)", desc: "Start with the 30th Juz", icon: <Star className="w-5 h-5" />, surah: 114 },
      { value: 'baqarah', label: "Al-Baqarah (Chapter 2)", desc: "The longest surah, great rewards", icon: <GraduationCap className="w-5 h-5" />, surah: 2 },
    ]
  },
  juz_amma: {
    title: "Ready to start Juz Amma!",
    subtitle: "We recommend starting from the shortest surahs",
    options: [
      { value: 'nas', label: "An-Nas (Chapter 114)", desc: "The shortest, easiest start", icon: <Heart className="w-5 h-5" />, surah: 114 },
      { value: 'ikhlas', label: "Al-Ikhlas (Chapter 112)", desc: "Equal to 1/3 of the Quran", icon: <Sparkles className="w-5 h-5" />, surah: 112 },
      { value: 'fatiha', label: "Al-Fatiha first", desc: "Master the Opening first", icon: <BookOpen className="w-5 h-5" />, surah: 1 },
    ]
  },
  selected_surahs: {
    title: "Which surahs interest you?",
    subtitle: "Pick a starting point for your journey",
    options: [
      { value: 'mulk', label: "Al-Mulk (Chapter 67)", desc: "Protection from the grave", icon: <Target className="w-5 h-5" />, surah: 67 },
      { value: 'yasin', label: "Ya-Sin (Chapter 36)", desc: "Heart of the Quran", icon: <Heart className="w-5 h-5" />, surah: 36 },
      { value: 'kahf', label: "Al-Kahf (Chapter 18)", desc: "Friday surah, light & guidance", icon: <Star className="w-5 h-5" />, surah: 18 },
      { value: 'rahman', label: "Ar-Rahman (Chapter 55)", desc: "The Most Merciful", icon: <Sparkles className="w-5 h-5" />, surah: 55 },
    ]
  },
  daily_connection: {
    title: "Let's find your starting point",
    subtitle: "Build a daily habit with achievable goals",
    options: [
      { value: 'fatiha', label: "Al-Fatiha", desc: "Perfect for daily recitation", icon: <BookOpen className="w-5 h-5" />, surah: 1 },
      { value: 'short_surahs', label: "Short Prayer Surahs", desc: "An-Nas, Al-Falaq, Al-Ikhlas", icon: <Star className="w-5 h-5" />, surah: 114 },
      { value: 'ayat_kursi', label: "Ayat Al-Kursi", desc: "The Throne Verse (2:255)", icon: <Sparkles className="w-5 h-5" />, surah: 2 },
    ]
  },
};

// Surah list for "Continue" flow (when user has prior memorization)
const POPULAR_SURAHS = [
  { number: 2, name: "Al-Baqarah", arabic: "البقرة" },
  { number: 3, name: "Ali 'Imran", arabic: "آل عمران" },
  { number: 18, name: "Al-Kahf", arabic: "الكهف" },
  { number: 19, name: "Maryam", arabic: "مريم" },
  { number: 36, name: "Ya-Sin", arabic: "يس" },
  { number: 55, name: "Ar-Rahman", arabic: "الرحمن" },
  { number: 56, name: "Al-Waqi'ah", arabic: "الواقعة" },
  { number: 67, name: "Al-Mulk", arabic: "الملك" },
  { number: 78, name: "An-Naba", arabic: "النبأ" },
];

interface OnboardingData {
  arabicLevel: 'none' | 'letters' | 'basic' | 'intermediate' | 'fluent';
  priorMemorization: 'none' | 'juz_amma' | 'multiple_juz' | 'significant';
  goal: 'full_hifz' | 'juz_amma' | 'selected_surahs' | 'daily_connection';
  dailyTimeMinutes: number;
  preferredReciter: string;
  startingPoint: string;
  startingSurah: number;
  continueSurah?: number; // For users continuing previous hifz
}

interface StudyPlanRecommendation {
  level: 'beginner' | 'intermediate' | 'advanced';
  startingLesson: {
    id: string;
    title: string;
    description: string;
  };
  totalLessonsInPath: number;
  dailyGoal: {
    newVerses: number;
    reviewVerses: number;
  };
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('arabic');
  const [data, setData] = useState<OnboardingData>({
    arabicLevel: 'none',
    priorMemorization: 'none',
    goal: 'daily_connection',
    dailyTimeMinutes: 20,
    preferredReciter: 'alafasy',
    startingPoint: '',
    startingSurah: 1,
  });
  const [playingReciter, setPlayingReciter] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recommendation, setRecommendation] = useState<StudyPlanRecommendation | null>(null);
  const [surahSearch, setSurahSearch] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);

  // Build steps dynamically - include 'starting' step for all goals
  const steps: Step[] = useMemo(() => {
    return ['arabic', 'memorization', 'goal', 'time', 'starting', 'reciter', 'complete'];
  }, []);
  
  const currentIndex = steps.indexOf(step);
  const progress = ((currentIndex) / (steps.length - 1)) * 100;
  
  // Get starting point config based on goal
  const startingConfig = STARTING_POINTS[data.goal] || STARTING_POINTS.daily_connection;
  
  // Show surah picker for users with prior memorization
  const showContinuePicker = data.priorMemorization !== 'none';

  const goNext = async () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < steps.length) {
      // If moving to complete step, submit the data
      if (steps[nextIndex] === 'complete') {
        await submitOnboarding();
      }
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

  const submitOnboarding = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setRecommendation(result.recommendation);
        
        // Also store in localStorage for offline access
        localStorage.setItem('quranOasis_onboarding', JSON.stringify(data));
        localStorage.setItem('quranOasis_preferences', JSON.stringify({
          reciter: data.preferredReciter,
          dailyMinutes: data.dailyTimeMinutes,
        }));
        localStorage.setItem('quranOasis_studyPlan', JSON.stringify(result.studyPlan));
      } else {
        // Fallback to localStorage-only if API fails
        localStorage.setItem('quranOasis_onboarding', JSON.stringify(data));
        localStorage.setItem('quranOasis_preferences', JSON.stringify({
          reciter: data.preferredReciter,
          dailyMinutes: data.dailyTimeMinutes,
        }));
      }
    } catch (error) {
      console.error('Onboarding submission error:', error);
      // Fallback to localStorage
      localStorage.setItem('quranOasis_onboarding', JSON.stringify(data));
      localStorage.setItem('quranOasis_preferences', JSON.stringify({
        reciter: data.preferredReciter,
        dailyMinutes: data.dailyTimeMinutes,
      }));
    }
    setIsSubmitting(false);
  };

  const completeOnboarding = () => {
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

  // Get level badge color
  const getLevelBadgeStyle = (level: string) => {
    switch (level) {
      case 'beginner':
        return {
          background: 'linear-gradient(135deg, rgba(134,169,113,0.2) 0%, rgba(134,169,113,0.1) 100%)',
          border: '1px solid rgba(134,169,113,0.3)',
          color: '#86A971',
        };
      case 'intermediate':
        return {
          background: 'linear-gradient(135deg, rgba(201,162,39,0.2) 0%, rgba(201,162,39,0.1) 100%)',
          border: '1px solid rgba(201,162,39,0.3)',
          color: '#c9a227',
        };
      case 'advanced':
        return {
          background: 'linear-gradient(135deg, rgba(147,112,219,0.2) 0%, rgba(147,112,219,0.1) 100%)',
          border: '1px solid rgba(147,112,219,0.3)',
          color: '#9370DB',
        };
      default:
        return {
          background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: '#a0a0a0',
        };
    }
  };

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
          {step !== 'arabic' && step !== 'complete' ? (
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={goBack} 
              className="liquid-icon-btn focus-visible-ring"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </motion.button>
          ) : (
            <div className="w-11" />
          )}
          
          {step !== 'complete' && (
            <div 
              className="flex-1 mx-4"
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Onboarding progress: ${Math.round(progress)}%`}
            >
              <div className="liquid-progress h-1.5">
                <motion.div
                  className="liquid-progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
          
          {step !== 'complete' && (
            <button 
              onClick={() => router.push('/lessons')}
              className="text-sm text-night-500 hover:text-night-300 transition-colors px-2 py-1 focus-visible-ring rounded-lg"
            >
              Skip
            </button>
          )}
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

          {/* Memorization Experience */}
          {step === 'memorization' && (
            <StepContainer key="memorization">
              <h2 className="text-2xl font-semibold text-night-100 mb-2">
                How much Quran have you memorized?
              </h2>
              <p className="text-night-400 mb-8">
                Any amount counts - this helps us personalize your journey
              </p>
              
              <div className="space-y-3 mb-8">
                {MEMORIZATION_LEVELS.map((option) => (
                  <OptionCard
                    key={option.value}
                    selected={data.priorMemorization === option.value}
                    onClick={() => setData({ ...data, priorMemorization: option.value })}
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
                {GOALS.map((option) => (
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
                {TIME_OPTIONS.map((option) => (
                  <OptionCard
                    key={option.value}
                    selected={data.dailyTimeMinutes === option.value}
                    onClick={() => setData({ ...data, dailyTimeMinutes: option.value })}
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

          {/* Starting Point - Conditional based on goal and prior memorization */}
          {step === 'starting' && (
            <StepContainer key="starting">
              <div className="flex items-center gap-3 mb-2">
                <div 
                  className="p-2 rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(201,162,39,0.2) 0%, rgba(201,162,39,0.1) 100%)',
                    border: '1px solid rgba(201,162,39,0.2)',
                  }}
                >
                  <MapPin className="w-5 h-5 text-gold-400" />
                </div>
                <h2 className="text-2xl font-semibold text-night-100">
                  {startingConfig.title}
                </h2>
              </div>
              <p className="text-night-400 mb-6">
                {startingConfig.subtitle}
              </p>
              
              {/* Show continue picker if user has prior memorization */}
              {showContinuePicker && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(134,169,113,0.1) 0%, rgba(134,169,113,0.04) 100%)',
                    border: '1px solid rgba(134,169,113,0.2)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <RefreshCw className="w-4 h-4 text-sage-400" />
                    <p className="text-sm font-medium text-sage-300">Continue where you left off?</p>
                  </div>
                  
                  {/* Surah Search */}
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-night-500" />
                    <input
                      type="text"
                      placeholder="Search for a surah..."
                      value={surahSearch}
                      onChange={(e) => setSurahSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-night-100 placeholder-night-500"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    />
                  </div>
                  
                  {/* Popular Surahs */}
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {POPULAR_SURAHS.filter(s => 
                      s.name.toLowerCase().includes(surahSearch.toLowerCase()) ||
                      s.arabic.includes(surahSearch)
                    ).map((surah) => (
                      <motion.button
                        key={surah.number}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setData({ 
                          ...data, 
                          startingPoint: 'continue',
                          startingSurah: surah.number,
                          continueSurah: surah.number 
                        })}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg text-left"
                        style={{
                          background: data.continueSurah === surah.number
                            ? 'linear-gradient(135deg, rgba(201,162,39,0.15) 0%, rgba(201,162,39,0.05) 100%)'
                            : 'transparent',
                          border: data.continueSurah === surah.number
                            ? '1px solid rgba(201,162,39,0.3)'
                            : '1px solid transparent',
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-night-500 text-xs w-6">{surah.number}</span>
                          <span className="text-night-200 text-sm">{surah.name}</span>
                        </div>
                        <span className="font-arabic text-night-400 text-sm">{surah.arabic}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {/* Divider if showing both */}
              {showContinuePicker && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-night-800" />
                  <span className="text-night-500 text-xs">or start fresh</span>
                  <div className="flex-1 h-px bg-night-800" />
                </div>
              )}
              
              {/* Goal-specific starting options */}
              <div className="space-y-3 mb-8">
                {startingConfig.options.map((option) => (
                  <OptionCard
                    key={option.value}
                    selected={data.startingPoint === option.value && !data.continueSurah}
                    onClick={() => setData({ 
                      ...data, 
                      startingPoint: option.value,
                      startingSurah: option.surah,
                      continueSurah: undefined 
                    })}
                    icon={option.icon}
                    label={option.label}
                    desc={option.desc}
                  />
                ))}
              </div>
              
              <div className="mt-auto">
                <ContinueButton 
                  onClick={goNext} 
                  disabled={!data.startingPoint && !data.continueSurah}
                />
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
                <ContinueButton onClick={goNext} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating your plan...
                    </>
                  ) : (
                    <>
                      Continue
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </ContinueButton>
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
                  Your Plan is Ready!
                </h1>
                <p className="text-night-400 max-w-sm mx-auto">
                  May Allah make this journey easy and blessed for you.
                </p>
              </div>

              {/* Personalized Recommendation */}
              {recommendation && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-5 mb-6 rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(201,162,39,0.1) 0%, rgba(201,162,39,0.02) 100%)',
                    border: '1px solid rgba(201,162,39,0.2)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="w-5 h-5 text-gold-400" />
                    <h3 className="font-semibold text-night-100">Your Personalized Path</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-night-400">Starting Level</span>
                      <span 
                        className="capitalize px-3 py-1 rounded-lg text-sm font-medium"
                        style={getLevelBadgeStyle(recommendation.level)}
                      >
                        {recommendation.level}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-night-400">First Lesson</span>
                      <span className="text-night-200 text-sm text-right max-w-[60%]">
                        {recommendation.startingLesson.title}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-night-400">Daily Goal</span>
                      <span className="text-night-200 text-sm">
                        {recommendation.dailyGoal.newVerses} new + {recommendation.dailyGoal.reviewVerses} review verses
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-night-400">Lessons Available</span>
                      <span className="text-night-200 text-sm">
                        {recommendation.totalLessonsInPath} lessons in {recommendation.level} path
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Summary - Liquid Glass */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-5 mb-8 space-y-4 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                }}
              >
                <h3 className="font-semibold text-night-100 mb-3">Your Preferences</h3>
                {[
                  { label: 'Arabic Level', value: data.arabicLevel.replace('_', ' ') },
                  { label: 'Prior Memorization', value: data.priorMemorization.replace(/_/g, ' ') },
                  { label: 'Goal', value: data.goal.replace(/_/g, ' ') },
                  { label: 'Starting Point', value: data.continueSurah 
                    ? `Surah ${data.continueSurah}` 
                    : data.startingPoint.replace(/_/g, ' ') || 'Not selected' },
                  { label: 'Daily Time', value: `${data.dailyTimeMinutes} minutes` },
                  { label: 'Reciter', value: RECITERS.find(r => r.id === data.preferredReciter)?.name.split(' ').slice(-1)[0] || '' },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center text-sm">
                    <span className="text-night-400">{item.label}</span>
                    <span 
                      className="capitalize px-3 py-1 rounded-lg"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                        color: '#d0d0d0',
                        border: '1px solid rgba(255,255,255,0.08)',
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

function ContinueButton({ 
  onClick, 
  disabled = false,
  children 
}: { 
  onClick: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
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
      {children || (
        <>
          Continue
          <ChevronRight className="w-5 h-5" />
        </>
      )}
    </motion.button>
  );
}
