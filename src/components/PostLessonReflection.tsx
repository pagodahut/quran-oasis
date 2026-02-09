/**
 * PostLessonReflection — Sheikh's "Here's what you just accomplished" moment
 * 
 * Replaces the generic "✅ Lesson Complete! +50 XP" screen with a meaningful
 * reflection from Sheikh HIFZ that:
 *   1. Celebrates the student's effort
 *   2. Shares a tafsir insight about what they memorized
 *   3. Includes a relevant hadith or spiritual connection
 *   4. Builds anticipation for returning tomorrow
 * 
 * This is the emotional hook that builds daily habit.
 * Users don't come back for XP. They come back for meaning.
 * 
 * Usage:
 *   <PostLessonReflection
 *     lessonTitle="Al-Baqarah 2:152-153"
 *     ayahs={[...]}
 *     performance={{ ayahsMemorized: 3, totalAttempts: 8, ... }}
 *     userLevel="beginner"
 *     xpEarned={75}
 *     streakDays={7}
 *     onContinue={() => router.push('/dashboard')}
 *     onReview={() => startReview()}
 *   />
 */

'use client';

import { useEffect, useState } from 'react';
import SheikhButton from '@/components/ui/SheikhButton';
import { useSheikh } from '@/contexts/SheikhContext';
import {
  useSheikhGenerate,
  type ReflectionContext,
  type ReflectionResponse,
} from '@/hooks/useSheikhGenerate';

// ─── Props ───────────────────────────────────────────────────────────

interface AyahInfo {
  surahNumber: number;
  surahName: string;
  surahNameArabic: string;
  ayahNumberStart: number;
  ayahNumberEnd: number;
  arabicText: string;
  translation: string;
}

interface LessonPerformance {
  ayahsMemorized: number;
  totalAttempts: number;
  perfectRecitations: number;
  timeSpentMinutes: number;
  struggles?: string[];
}

interface PostLessonReflectionProps {
  lessonTitle: string;
  ayahs: AyahInfo[];
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  performance: LessonPerformance;
  xpEarned?: number;
  streakDays?: number;
  /** Navigate to dashboard or next lesson */
  onContinue: () => void;
  /** Start reviewing what was just learned */
  onReview?: () => void;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────

export default function PostLessonReflection({
  lessonTitle,
  ayahs,
  userLevel,
  performance,
  xpEarned,
  streakDays,
  onContinue,
  onReview,
  className = '',
}: PostLessonReflectionProps) {
  const { openSheikh } = useSheikh();
  const { generate, isLoading, error } = useSheikhGenerate<ReflectionResponse>();
  const [reflection, setReflection] = useState<ReflectionResponse | null>(null);
  const [animateIn, setAnimateIn] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Generate reflection on mount
  useEffect(() => {
    const ctx: ReflectionContext = {
      lessonTitle,
      ayahs,
      userLevel,
      performance,
      xpEarned,
      streakDays,
    };

    generate({ type: 'reflection', context: ctx }).then((data) => {
      if (data) setReflection(data);
    });

    // Staggered entrance animation
    const t1 = setTimeout(() => setAnimateIn(true), 100);
    const t2 = setTimeout(() => setShowStats(true), 600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [lessonTitle]);

  const accuracy =
    performance.totalAttempts > 0
      ? Math.round((performance.perfectRecitations / performance.totalAttempts) * 100)
      : 0;

  const handleAskSheikh = () => {
    openSheikh(`Tell me more about what I just memorized in ${lessonTitle}`);
  };

  return (
    <div
      className={`sheikh-reflection ${animateIn ? 'sheikh-reflection--visible' : ''} ${className}`}
      role="complementary"
      aria-label="Post-lesson reflection from Sheikh HIFZ"
    >
      {/* Celebration header */}
      <div className="sheikh-reflection__celebration">
        <div className="sheikh-reflection__check">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="#2dd496" fillOpacity="0.15" />
            <circle cx="16" cy="16" r="12" fill="#2dd496" fillOpacity="0.25" />
            <path
              d="M11 16.5L14.5 20L21 13"
              stroke="#2dd496"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="sheikh-reflection__title">Lesson Complete!</h2>
        <p className="sheikh-reflection__subtitle">{lessonTitle}</p>
      </div>

      {/* Stats row */}
      <div className={`sheikh-reflection__stats ${showStats ? 'sheikh-reflection__stats--visible' : ''}`}>
        <div className="sheikh-reflection__stat">
          <span className="sheikh-reflection__stat-value">{performance.ayahsMemorized}</span>
          <span className="sheikh-reflection__stat-label">
            Ayah{performance.ayahsMemorized !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="sheikh-reflection__stat-divider" />
        <div className="sheikh-reflection__stat">
          <span className="sheikh-reflection__stat-value">{accuracy}%</span>
          <span className="sheikh-reflection__stat-label">Accuracy</span>
        </div>
        <div className="sheikh-reflection__stat-divider" />
        <div className="sheikh-reflection__stat">
          <span className="sheikh-reflection__stat-value">{performance.timeSpentMinutes}m</span>
          <span className="sheikh-reflection__stat-label">Time</span>
        </div>
        {xpEarned && (
          <>
            <div className="sheikh-reflection__stat-divider" />
            <div className="sheikh-reflection__stat sheikh-reflection__stat--xp">
              <span className="sheikh-reflection__stat-value">+{xpEarned}</span>
              <span className="sheikh-reflection__stat-label">XP</span>
            </div>
          </>
        )}
      </div>

      {/* Streak banner */}
      {streakDays && streakDays > 1 && (
        <div className="sheikh-reflection__streak">
          🔥 {streakDays} day streak!
        </div>
      )}

      {/* Sheikh reflection card */}
      <div className="sheikh-reflection__card">
        <div className="sheikh-reflection__card-header">
          <div className="sheikh-reflection__avatar">
            <span>🕌</span>
          </div>
          <span className="sheikh-reflection__card-label">Sheikh HIFZ</span>
        </div>

        {isLoading ? (
          <div className="sheikh-reflection__skeleton">
            <div className="sheikh-reflection__skeleton-line sheikh-reflection__skeleton-line--long" />
            <div className="sheikh-reflection__skeleton-line sheikh-reflection__skeleton-line--medium" />
            <div className="sheikh-reflection__skeleton-line sheikh-reflection__skeleton-line--long" />
            <div className="sheikh-reflection__skeleton-line sheikh-reflection__skeleton-line--short" />
          </div>
        ) : error ? (
          <p className="sheikh-reflection__message">
            Ma sha Allah! You just completed {lessonTitle}. May Allah place this Quran
            as a light in your heart and make it easy for you to retain. 🤲
          </p>
        ) : reflection ? (
          <>
            <p className="sheikh-reflection__message">{reflection.message}</p>

            {reflection.insight && (
              <blockquote className="sheikh-reflection__insight">
                <span className="sheikh-reflection__insight-icon">✨</span>
                {reflection.insight}
              </blockquote>
            )}

            {reflection.hadith && (
              <div className="sheikh-reflection__hadith">
                <span className="sheikh-reflection__hadith-label">📜 Hadith</span>
                <p className="sheikh-reflection__hadith-text">{reflection.hadith}</p>
              </div>
            )}
          </>
        ) : null}

        <SheikhButton
          variant="secondary"
          breathe
          onClick={handleAskSheikh}
          style={{ width: '100%', marginTop: 14 }}
        >
          💬 Ask Sheikh about this
        </SheikhButton>
      </div>

      {/* Actions */}
      <div className="sheikh-reflection__actions">
        {onReview && (
          <SheikhButton
            variant="secondary"
            breathe
            onClick={onReview}
            style={{ flex: 1 }}
          >
            🔄 Review Again
          </SheikhButton>
        )}
        <SheikhButton
          variant="primary"
          onClick={onContinue}
          style={{ flex: 1 }}
        >
          Continue →
        </SheikhButton>
      </div>

      {/* ─── Styles ──────────────────────────────────────────────── */}
      <style jsx>{`
        .sheikh-reflection {
          max-width: 480px;
          margin: 0 auto;
          padding: 32px 20px;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .sheikh-reflection--visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Celebration */
        .sheikh-reflection__celebration {
          text-align: center;
          margin-bottom: 24px;
        }

        .sheikh-reflection__check {
          display: inline-block;
          margin-bottom: 12px;
          animation: checkBounce 0.6s ease 0.3s both;
        }

        @keyframes checkBounce {
          0% { transform: scale(0); }
          60% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        .sheikh-reflection__title {
          font-size: 24px;
          font-weight: 700;
          color: #e8f5f0;
          margin: 0 0 4px;
        }

        .sheikh-reflection__subtitle {
          font-size: 14px;
          color: #6bb89a;
          margin: 0;
        }

        /* Stats */
        .sheikh-reflection__stats {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: rgba(45, 212, 150, 0.06);
          border-radius: 14px;
          border: 1px solid rgba(45, 212, 150, 0.1);
          margin-bottom: 16px;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.4s ease, transform 0.4s ease;
        }

        .sheikh-reflection__stats--visible {
          opacity: 1;
          transform: translateY(0);
        }

        .sheikh-reflection__stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .sheikh-reflection__stat-value {
          font-size: 20px;
          font-weight: 700;
          color: #e8f5f0;
        }

        .sheikh-reflection__stat--xp .sheikh-reflection__stat-value {
          color: #2dd496;
        }

        .sheikh-reflection__stat-label {
          font-size: 11px;
          color: #6bb89a;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 2px;
        }

        .sheikh-reflection__stat-divider {
          width: 1px;
          height: 28px;
          background: rgba(45, 212, 150, 0.15);
        }

        /* Streak */
        .sheikh-reflection__streak {
          text-align: center;
          font-size: 14px;
          font-weight: 600;
          color: #f0a840;
          margin-bottom: 20px;
          padding: 8px;
          background: rgba(240, 168, 64, 0.08);
          border-radius: 10px;
          border: 1px solid rgba(240, 168, 64, 0.15);
        }

        /* Sheikh card */
        .sheikh-reflection__card {
          background: linear-gradient(135deg, #0c1f1a 0%, #132e25 100%);
          border: 1px solid rgba(45, 212, 150, 0.15);
          border-radius: 16px;
          padding: 18px;
          margin-bottom: 20px;
        }

        .sheikh-reflection__card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }

        .sheikh-reflection__avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2dd496, #1a7a54);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }

        .sheikh-reflection__card-label {
          font-size: 13px;
          font-weight: 600;
          color: #2dd496;
        }

        .sheikh-reflection__message {
          color: #c8e6dc;
          font-size: 14.5px;
          line-height: 1.65;
          margin: 0;
        }

        .sheikh-reflection__insight {
          margin: 14px 0 0;
          padding: 12px 14px;
          background: rgba(45, 212, 150, 0.06);
          border-left: 3px solid #2dd496;
          border-radius: 0 10px 10px 0;
          font-style: italic;
          color: #a8d8c4;
          font-size: 13.5px;
          line-height: 1.6;
          display: flex;
          gap: 8px;
        }

        .sheikh-reflection__insight-icon {
          flex-shrink: 0;
        }

        .sheikh-reflection__hadith {
          margin-top: 14px;
          padding: 12px 14px;
          background: rgba(240, 210, 120, 0.05);
          border: 1px solid rgba(240, 210, 120, 0.1);
          border-radius: 10px;
        }

        .sheikh-reflection__hadith-label {
          font-size: 11px;
          font-weight: 600;
          color: #d4b858;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: block;
          margin-bottom: 6px;
        }

        .sheikh-reflection__hadith-text {
          color: #c8c09e;
          font-size: 13px;
          line-height: 1.6;
          margin: 0;
          font-style: italic;
        }

        /* Skeleton */
        .sheikh-reflection__skeleton {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .sheikh-reflection__skeleton-line {
          height: 13px;
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

        .sheikh-reflection__skeleton-line--long { width: 100%; }
        .sheikh-reflection__skeleton-line--medium { width: 75%; }
        .sheikh-reflection__skeleton-line--short { width: 50%; }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* Actions */
        .sheikh-reflection__actions {
          display: flex;
          gap: 10px;
        }

      `}</style>
    </div>
  );
}
