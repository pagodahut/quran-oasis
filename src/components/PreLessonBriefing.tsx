/**
 * PreLessonBriefing — Sheikh's "Here's what you're about to learn" moment
 * 
 * Displays a brief, inspiring card at the top of the lesson page BEFORE
 * the student starts memorizing. Sets context with meaning, theme, and
 * a practical tip.
 * 
 * This is NOT a full chat — it's a 30-second teaching moment.
 * User can tap "Learn more" to open the full sheikh panel,
 * or "Bismillah, let's start" to dismiss and begin.
 * 
 * Usage:
 *   <PreLessonBriefing
 *     lessonTitle="Al-Baqarah 2:152-153"
 *     ayahs={[{ surahNumber: 2, surahName: 'Al-Baqarah', ... }]}
 *     userLevel="beginner"
 *     onStart={() => setLessonStarted(true)}
 *     onDismiss={() => setBriefingDismissed(true)}
 *   />
 */

'use client';

import { useEffect, useState } from 'react';
import SheikhButton from '@/components/ui/SheikhButton';
import { useSheikh } from '@/contexts/SheikhContext';
import { MosqueIcon, BookReadIcon, TipIcon } from '@/components/icons';
import {
  useSheikhGenerate,
  type BriefingContext,
  type BriefingResponse,
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

interface PreLessonBriefingProps {
  /** Lesson title for display */
  lessonTitle: string;
  /** Ayahs the student will study (empty for alphabet/concept lessons) */
  ayahs?: AyahInfo[];
  /** User's learning level */
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  /** Whether this is a review lesson */
  isReview?: boolean;
  /** Called when user taps "Start" */
  onStart: () => void;
  /** Called when user dismisses without starting */
  onDismiss?: () => void;
  /** Additional CSS classes */
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────

export default function PreLessonBriefing({
  lessonTitle,
  ayahs,
  userLevel,
  isReview = false,
  onStart,
  onDismiss,
  className = '',
}: PreLessonBriefingProps) {
  const { openSheikh } = useSheikh();
  const { generate, isLoading, error } = useSheikhGenerate<BriefingResponse>();
  const [briefing, setBriefing] = useState<BriefingResponse | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  const safeAyahs = ayahs ?? [];

  // Generate briefing on mount
  useEffect(() => {
    const ctx: BriefingContext = {
      lessonTitle,
      ayahs: safeAyahs,
      userLevel,
      isReview,
    };

    generate({ type: 'briefing', context: ctx }).then((data) => {
      if (data) {
        setBriefing(data);
        // Trigger entrance animation after data loads
        requestAnimationFrame(() => setAnimateIn(true));
      }
    });
  }, [lessonTitle]); // Only regenerate when lesson changes

  // Entrance animation on initial render (for skeleton)
  useEffect(() => {
    if (isLoading) {
      requestAnimationFrame(() => setAnimateIn(true));
    }
  }, [isLoading]);

  if (dismissed) return null;

  const handleDismiss = () => {
    setAnimateIn(false);
    setTimeout(() => {
      setDismissed(true);
      onDismiss?.();
    }, 300);
  };

  const handleStart = () => {
    setAnimateIn(false);
    setTimeout(() => {
      setDismissed(true);
      onStart();
    }, 300);
  };

  const handleLearnMore = () => {
    const question = briefing && safeAyahs.length > 0
      ? `Tell me more about ${lessonTitle} — what makes these ayahs special?`
      : `What should I know about ${lessonTitle} before I start?`;
    openSheikh(question);
  };

  return (
    <div
      className={`sheikh-briefing ${animateIn ? 'sheikh-briefing--visible' : ''} ${className}`}
      role="complementary"
      aria-label="Pre-lesson briefing from Sheikh HIFZ"
    >
      {/* Theme badge */}
      {briefing?.theme && (
        <div className="sheikh-briefing__theme">
          <span className="sheikh-briefing__theme-icon"><BookReadIcon size={20} /></span>
          <span className="sheikh-briefing__theme-text">{briefing.theme}</span>
        </div>
      )}

      {/* Sheikh avatar + header */}
      <div className="sheikh-briefing__header">
        <div className="sheikh-briefing__avatar">
          <MosqueIcon size={20} className="sheikh-briefing__avatar-emoji" />
        </div>
        <div className="sheikh-briefing__title">
          <span className="sheikh-briefing__label">Sheikh HIFZ</span>
          <span className="sheikh-briefing__subtitle">
            {isReview ? 'Review Session' : 'Pre-Lesson Briefing'}
          </span>
        </div>
        <SheikhButton
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          aria-label="Dismiss briefing"
        >
          ✕
        </SheikhButton>
      </div>

      {/* Content */}
      <div className="sheikh-briefing__body">
        {isLoading ? (
          <div className="sheikh-briefing__skeleton">
            <div className="sheikh-briefing__skeleton-line sheikh-briefing__skeleton-line--long" />
            <div className="sheikh-briefing__skeleton-line sheikh-briefing__skeleton-line--medium" />
            <div className="sheikh-briefing__skeleton-line sheikh-briefing__skeleton-line--long" />
          </div>
        ) : error ? (
          <p className="sheikh-briefing__message">
            Bismillah — you&apos;re about to {isReview ? 'review' : 'memorize'}{' '}
            {lessonTitle}. May Allah make it easy for you! 🤲
          </p>
        ) : briefing ? (
          <>
            <p className="sheikh-briefing__message">{briefing.message}</p>
            {briefing.tip && (
              <div className="sheikh-briefing__tip">
                <span className="sheikh-briefing__tip-icon"><TipIcon size={16} /></span>
                <span className="sheikh-briefing__tip-text">{briefing.tip}</span>
              </div>
            )}
          </>
        ) : null}
      </div>

      {/* Actions */}
      <div className="sheikh-briefing__actions">
        <SheikhButton
          variant="secondary"
          breathe
          onClick={handleLearnMore}
        >
          Learn more
        </SheikhButton>
        <SheikhButton
          variant="primary"
          onClick={handleStart}
        >
          {isReview ? '🔄 Start Review' : '﷽ Let\u2019s Start'}
        </SheikhButton>
      </div>

      {/* ─── Styles ──────────────────────────────────────────────── */}
      <style jsx>{`
        .sheikh-briefing {
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(24px) saturate(1.4);
          -webkit-backdrop-filter: blur(24px) saturate(1.4);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 20px;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.4s ease, transform 0.4s ease;
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
        }

        .sheikh-briefing::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.4), transparent);
          opacity: 0.8;
        }

        .sheikh-briefing--visible {
          opacity: 1;
          transform: translateY(0);
        }

        .sheikh-briefing__theme {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(212, 175, 55, 0.08);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 20px;
          padding: 4px 12px;
          margin-bottom: 14px;
          font-size: 12px;
          color: rgba(212, 175, 55, 0.9);
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .sheikh-briefing__theme-icon {
          font-size: 13px;
        }

        .sheikh-briefing__header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }

        .sheikh-briefing__avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(212, 175, 55, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }

        .sheikh-briefing__avatar-emoji {
          font-size: 20px;
        }

        .sheikh-briefing__title {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .sheikh-briefing__label {
          font-size: 15px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
        }

        .sheikh-briefing__subtitle {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          margin-top: 1px;
        }

        .sheikh-briefing__dismiss {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          font-size: 16px;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 8px;
          transition: background 0.2s, color 0.2s;
        }

        .sheikh-briefing__dismiss:hover {
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.9);
        }

        .sheikh-briefing__body {
          margin-bottom: 16px;
        }

        .sheikh-briefing__message {
          color: rgba(255, 255, 255, 0.8);
          font-size: 14.5px;
          line-height: 1.65;
          margin: 0;
        }

        .sheikh-briefing__tip {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-top: 12px;
          padding: 10px 12px;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 10px;
          border-left: 2px solid rgba(212, 175, 55, 0.4);
        }

        .sheikh-briefing__tip-icon {
          font-size: 14px;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .sheikh-briefing__tip-text {
          color: rgba(255, 255, 255, 0.6);
          font-size: 13.5px;
          line-height: 1.5;
        }

        /* Skeleton loader */
        .sheikh-briefing__skeleton {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .sheikh-briefing__skeleton-line {
          height: 14px;
          border-radius: 7px;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.04) 25%,
            rgba(255, 255, 255, 0.08) 50%,
            rgba(255, 255, 255, 0.04) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        .sheikh-briefing__skeleton-line--long {
          width: 100%;
        }

        .sheikh-briefing__skeleton-line--medium {
          width: 72%;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* Actions */
        .sheikh-briefing__actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }

      `}</style>
    </div>
  );
}
