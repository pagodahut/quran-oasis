/**
 * DashboardGreeting — Sheikh's daily greeting card
 * Uses Tailwind classes only (no inline styles or jsx style blocks).
 * 
 * NOTE: Currently not imported by any page. Available for integration
 * into the dashboard when AI-generated greetings are desired.
 * Import with: import DashboardGreeting from '@/components/DashboardGreeting';
 */

'use client';

import { useEffect, useState, useMemo } from 'react';
import SheikhButton from '@/components/ui/SheikhButton';
import { useSheikh } from '@/contexts/SheikhContext';
import { MosqueIcon, FireIcon } from '@/components/icons';
import {
  useSheikhGenerate,
  type GreetingContext,
  type GreetingResponse,
} from '@/hooks/useSheikhGenerate';

interface DashboardGreetingProps {
  userName?: string;
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  streakDays?: number;
  totalVersesMemorized?: number;
  totalSurahsCompleted?: number;
  currentProgress?: string;
  lastStudied?: {
    surahName: string;
    ayahNumber: number;
    daysAgo: number;
  };
  nextMilestone?: string;
  className?: string;
}

function getTimeOfDay(): GreetingContext['timeOfDay'] {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 6) return 'fajr';
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

const FALLBACK_GREETINGS: Record<string, string> = {
  fajr: "As-salamu alaykum! Starting your day with Quran — the Prophet ﷺ loved to recite after Fajr.",
  morning: "As-salamu alaykum! A beautiful morning to open the Book of Allah سبحانه وتعالى.",
  afternoon: "As-salamu alaykum! Ready to continue your journey with the Quran?",
  evening: "As-salamu alaykum! Ending your day with Quran — what a blessed way to wind down.",
  night: "As-salamu alaykum! The quiet night is a beautiful time for reflection and recitation.",
};

const FALLBACK_QUESTIONS = [
  'What should I study today?',
  'How do I stay consistent with memorization?',
  'What is the 10-3 memorization method?',
];

export default function DashboardGreeting({
  userName,
  userLevel,
  streakDays,
  totalVersesMemorized,
  totalSurahsCompleted,
  currentProgress,
  lastStudied,
  nextMilestone,
  className = '',
}: DashboardGreetingProps) {
  const { openSheikh } = useSheikh();
  const { generate, isLoading } = useSheikhGenerate<GreetingResponse>();
  const [greeting, setGreeting] = useState<GreetingResponse | null>(null);
  const [animateIn, setAnimateIn] = useState(false);
  const [chipsVisible, setChipsVisible] = useState(false);

  const timeOfDay = useMemo(() => getTimeOfDay(), []);

  useEffect(() => {
    const ctx: GreetingContext = {
      userName,
      userLevel,
      timeOfDay,
      streakDays,
      totalVersesMemorized,
      totalSurahsCompleted,
      currentProgress,
      lastStudied,
      nextMilestone,
    };

    generate({ type: 'greeting', context: ctx }).then((data) => {
      if (data) setGreeting(data);
    });

    const t1 = setTimeout(() => setAnimateIn(true), 50);
    const t2 = setTimeout(() => setChipsVisible(true), 400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const displayGreeting = greeting?.greeting || FALLBACK_GREETINGS[timeOfDay];
  const displayQuestions = greeting?.suggestedQuestions || FALLBACK_QUESTIONS;

  return (
    <div
      className={`mb-5 transition-all duration-400 ease-out ${
        animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2.5'
      } ${className}`}
    >
      {/* Greeting card */}
      <button
        className="block w-full text-left liquid-glass-gold rounded-2xl p-[18px] relative overflow-hidden
                   border border-gold-500/20 hover:border-gold-500/30 transition-all duration-200
                   hover:-translate-y-px active:translate-y-0 cursor-pointer"
        onClick={() => openSheikh()}
        aria-label="Open Sheikh HIFZ"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 via-transparent to-transparent pointer-events-none" />

        <div className="relative flex items-center gap-2.5 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center flex-shrink-0">
            <MosqueIcon size={20} />
          </div>
          <div className="flex items-center gap-2 flex-1">
            <span className="text-sm font-semibold text-sage-400">Sheikh HIFZ</span>
            {streakDays && streakDays > 1 && (
              <span className="text-xs text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded-lg">
                <FireIcon size={16} className="inline -mt-0.5" /> {streakDays}
              </span>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-2 mb-2.5">
            <div className="h-3.5 rounded-full bg-gold-500/10 animate-pulse w-[90%]" />
            <div className="h-3.5 rounded-full bg-gold-500/10 animate-pulse w-[60%]" />
          </div>
        ) : (
          <p className="relative text-night-200 text-[15px] leading-relaxed mb-2.5">{displayGreeting}</p>
        )}

        <span className="text-xs text-night-500 hover:text-sage-400 transition-colors">
          Tap to chat with Sheikh →
        </span>
      </button>

      {/* Question chips */}
      <div
        className={`flex flex-wrap gap-2 mt-3 transition-all duration-300 ease-out ${
          chipsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1.5'
        }`}
      >
        {displayQuestions.map((q, i) => (
          <SheikhButton
            key={i}
            variant="chip"
            breathe
            onClick={() => openSheikh(q)}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {q}
          </SheikhButton>
        ))}
      </div>
    </div>
  );
}
