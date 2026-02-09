/**
 * DashboardGreeting — Sheikh's daily "As-salamu alaykum" moment
 * 
 * Replaces or augments the dashboard header with a personalized greeting
 * based on: time of day, streak, progress, and learning context.
 * 
 * Single sentence — not a full chat. Tapping it opens the sheikh panel.
 * Below the greeting: 2-3 contextual question chips that change daily.
 * 
 * Usage:
 *   <DashboardGreeting
 *     userName="Naimul"
 *     userLevel="beginner"
 *     streakDays={7}
 *     totalVersesMemorized={45}
 *     currentProgress="Juz Amma — Surah An-Naba"
 *   />
 */

'use client';

import { useEffect, useState, useMemo } from 'react';
import SheikhButton from '@/components/ui/SheikhButton';
import { useSheikh } from '@/contexts/SheikhContext';
import {
  useSheikhGenerate,
  type GreetingContext,
  type GreetingResponse,
} from '@/hooks/useSheikhGenerate';

// ─── Props ───────────────────────────────────────────────────────────

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

// ─── Helpers ─────────────────────────────────────────────────────────

function getTimeOfDay(): GreetingContext['timeOfDay'] {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 6) return 'fajr';
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

/** Fallback greetings if API fails (keyed by time of day) */
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

// ─── Component ───────────────────────────────────────────────────────

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

  // Generate greeting on mount
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

    // Staggered entrance
    const t1 = setTimeout(() => setAnimateIn(true), 50);
    const t2 = setTimeout(() => setChipsVisible(true), 400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []); // Only on mount

  const displayGreeting = greeting?.greeting || FALLBACK_GREETINGS[timeOfDay];
  const displayQuestions = greeting?.suggestedQuestions || FALLBACK_QUESTIONS;

  const handleGreetingTap = () => {
    openSheikh();
  };

  const handleQuestionTap = (question: string) => {
    openSheikh(question);
  };

  return (
    <div
      className={`dashboard-greeting ${animateIn ? 'dashboard-greeting--visible' : ''} ${className}`}
    >
      {/* Greeting card */}
      <button
        className="dashboard-greeting__card"
        onClick={handleGreetingTap}
        aria-label="Open Sheikh HIFZ"
      >
        <div className="dashboard-greeting__avatar-row">
          <div className="dashboard-greeting__avatar">
            <span>🕌</span>
          </div>
          <div className="dashboard-greeting__meta">
            <span className="dashboard-greeting__label">Sheikh HIFZ</span>
            {streakDays && streakDays > 1 && (
              <span className="dashboard-greeting__streak">🔥 {streakDays}</span>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="dashboard-greeting__skeleton">
            <div className="dashboard-greeting__skeleton-line dashboard-greeting__skeleton-line--long" />
            <div className="dashboard-greeting__skeleton-line dashboard-greeting__skeleton-line--medium" />
          </div>
        ) : (
          <p className="dashboard-greeting__text">{displayGreeting}</p>
        )}

        <span className="dashboard-greeting__cta">Tap to chat with Sheikh →</span>
      </button>

      {/* Question chips */}
      <div
        className={`dashboard-greeting__chips ${chipsVisible ? 'dashboard-greeting__chips--visible' : ''}`}
      >
        {displayQuestions.map((q, i) => (
          <SheikhButton
            key={i}
            variant="chip"
            breathe
            onClick={() => handleQuestionTap(q)}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {q}
          </SheikhButton>
        ))}
      </div>

      {/* ─── Styles ──────────────────────────────────────────────── */}
      <style jsx>{`
        .dashboard-greeting {
          margin-bottom: 20px;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.4s ease, transform 0.4s ease;
        }

        .dashboard-greeting--visible {
          opacity: 1;
          transform: translateY(0);
        }

        .dashboard-greeting__card {
          display: block;
          width: 100%;
          text-align: left;
          background: linear-gradient(135deg, #0c1f1a 0%, #132e25 60%, #1a3a2f 100%);
          border: 1px solid rgba(45, 212, 150, 0.12);
          border-radius: 16px;
          padding: 18px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        .dashboard-greeting__card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
            ellipse at top right,
            rgba(45, 212, 150, 0.04) 0%,
            transparent 60%
          );
          pointer-events: none;
        }

        .dashboard-greeting__card:hover {
          border-color: rgba(45, 212, 150, 0.25);
          transform: translateY(-1px);
        }

        .dashboard-greeting__card:active {
          transform: translateY(0);
        }

        .dashboard-greeting__avatar-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .dashboard-greeting__avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2dd496, #1a7a54);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .dashboard-greeting__meta {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }

        .dashboard-greeting__label {
          font-size: 14px;
          font-weight: 600;
          color: #2dd496;
        }

        .dashboard-greeting__streak {
          font-size: 12px;
          color: #f0a840;
          background: rgba(240, 168, 64, 0.1);
          padding: 2px 8px;
          border-radius: 10px;
        }

        .dashboard-greeting__text {
          color: #c8e6dc;
          font-size: 15px;
          line-height: 1.6;
          margin: 0 0 10px;
          position: relative;
        }

        .dashboard-greeting__cta {
          font-size: 12px;
          color: #4a9b7d;
          transition: color 0.2s;
        }

        .dashboard-greeting__card:hover .dashboard-greeting__cta {
          color: #2dd496;
        }

        /* Skeleton */
        .dashboard-greeting__skeleton {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 10px;
        }

        .dashboard-greeting__skeleton-line {
          height: 14px;
          border-radius: 7px;
          background: linear-gradient(
            90deg,
            rgba(45, 212, 150, 0.08) 25%,
            rgba(45, 212, 150, 0.15) 50%,
            rgba(45, 212, 150, 0.08) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        .dashboard-greeting__skeleton-line--long { width: 90%; }
        .dashboard-greeting__skeleton-line--medium { width: 60%; }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* Question chips */
        .dashboard-greeting__chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .dashboard-greeting__chips--visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}
