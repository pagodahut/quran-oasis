'use client';

import { useEffect, useState } from 'react';
import SheikhButton from '@/components/ui/SheikhButton';
import { useSheikh } from '@/contexts/SheikhContext';
import {
  useSheikhGenerate,
  type TajweedFeedbackContext,
  type TajweedFeedbackResponse,
} from '@/hooks/useSheikhGenerate';

interface AyahInfo {
  surahNumber: number;
  surahName: string;
  surahNameArabic: string;
  ayahNumberStart: number;
  ayahNumberEnd: number;
  arabicText: string;
  translation: string;
}

interface TajweedResult {
  rule: string;
  location: string;
  feedback: string;
  severity: 'correct' | 'minor' | 'major';
}

interface TajweedSheikhFeedbackProps {
  ayah: AyahInfo;
  tajweedResults: TajweedResult[];
  overallScore: number;
  attemptNumber: number;
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  onRetry?: () => void;
  onContinue?: () => void;
  className?: string;
}

function getScoreColor(score: number): string {
  if (score >= 90) return '#2dd496';
  if (score >= 70) return '#f0c840';
  return '#e06050';
}

function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent!';
  if (score >= 80) return 'Great job!';
  if (score >= 70) return 'Good effort!';
  if (score >= 50) return 'Keep practicing!';
  return "Don't give up!";
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'high': return '#e06050';
    case 'medium': return '#f0c840';
    default: return '#6bb89a';
  }
}

export default function TajweedSheikhFeedback({
  ayah,
  tajweedResults,
  overallScore,
  attemptNumber,
  userLevel,
  onRetry,
  onContinue,
  className = '',
}: TajweedSheikhFeedbackProps) {
  const { openSheikh } = useSheikh();
  const { generate, isLoading, error } = useSheikhGenerate<TajweedFeedbackResponse>();
  const [feedback, setFeedback] = useState<TajweedFeedbackResponse | null>(null);
  const [animateIn, setAnimateIn] = useState(false);
  const [showCorrections, setShowCorrections] = useState(false);

  useEffect(() => {
    const ctx: TajweedFeedbackContext = {
      userLevel,
      ayah,
      tajweedResults,
      overallScore,
      attemptNumber,
    };

    generate({ type: 'tajweed', context: ctx }).then((data) => {
      if (data) setFeedback(data);
    });

    const t1 = setTimeout(() => setAnimateIn(true), 50);
    const t2 = setTimeout(() => setShowCorrections(true), 500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [attemptNumber]);

  const scoreColor = getScoreColor(overallScore);
  const scoreLabel = getScoreLabel(overallScore);
  const shouldRetry = feedback?.shouldRetry ?? overallScore < 80;

  const handleAskSheikh = () => {
    const question = feedback?.corrections?.length
      ? `Can you explain the ${feedback.corrections[0].rule} rule in more detail? I keep getting it wrong at "${feedback.corrections[0].location}".`
      : `How can I improve my tajweed for ${ayah.surahName} ${ayah.ayahNumberStart}?`;
    openSheikh(question);
  };

  return (
    <div
      className={`tajweed-feedback ${animateIn ? 'tajweed-feedback--visible' : ''} ${className}`}
      role="region"
      aria-label="Tajweed feedback from Sheikh HIFZ"
    >
      {/* Score circle */}
      <div className="tajweed-feedback__score-section">
        <div className="tajweed-feedback__score-ring">
          <svg viewBox="0 0 100 100" className="tajweed-feedback__score-svg">
            <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="44" fill="none"
              stroke={scoreColor} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${(overallScore / 100) * 276.5} 276.5`}
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dasharray 1s ease 0.3s' }}
            />
          </svg>
          <div className="tajweed-feedback__score-value">
            <span style={{ fontSize: 28, fontWeight: 700, color: scoreColor }}>{overallScore}</span>
            <span style={{ fontSize: 14, color: '#6bb89a', marginLeft: 1 }}>%</span>
          </div>
        </div>
        <span style={{ fontSize: 16, fontWeight: 600, color: scoreColor }}>{scoreLabel}</span>
        {attemptNumber > 1 && (
          <span style={{ fontSize: 12, color: '#6bb89a', marginTop: 2 }}>Attempt #{attemptNumber}</span>
        )}
      </div>

      {/* Sheikh feedback card */}
      <div className="tajweed-feedback__card">
        <div className="tajweed-feedback__card-header">
          <div className="tajweed-feedback__avatar"><span>🕌</span></div>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#2dd496' }}>Sheikh HIFZ</span>
        </div>

        {isLoading ? (
          <div className="tajweed-feedback__skeleton">
            <div className="skeleton-line skeleton-line--long" />
            <div className="skeleton-line skeleton-line--medium" />
            <div className="skeleton-line skeleton-line--long" />
          </div>
        ) : error ? (
          <p className="tajweed-feedback__message">
            {overallScore >= 80
              ? `Nice recitation, ma sha Allah! Score: ${overallScore}%. Keep refining your tajweed.`
              : `Good attempt! Let\u2019s work on getting that score higher. Practice makes perfect!`}
          </p>
        ) : feedback ? (
          <p className="tajweed-feedback__message">{feedback.feedback}</p>
        ) : null}
      </div>

      {/* Corrections detail */}
      {feedback?.corrections && feedback.corrections.length > 0 && (
        <div className={`tajweed-feedback__corrections ${showCorrections ? 'tajweed-feedback__corrections--visible' : ''}`}>
          <h4 className="tajweed-feedback__corrections-title">Points to improve</h4>
          {feedback.corrections.map((c, i) => (
            <div key={i} className="tajweed-feedback__correction" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="tajweed-feedback__correction-header">
                <span className="tajweed-feedback__correction-dot" style={{ background: getPriorityColor(c.priority) }} />
                <span className="tajweed-feedback__correction-rule">{c.rule}</span>
                <span className="tajweed-feedback__correction-loc">at &ldquo;{c.location}&rdquo;</span>
              </div>
              <p className="tajweed-feedback__correction-text">{c.explanation}</p>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="tajweed-feedback__actions">
        <SheikhButton variant="secondary" breathe onClick={handleAskSheikh} style={{ flex: 1 }}>
          💬 Ask Sheikh
        </SheikhButton>
        {shouldRetry && onRetry ? (
          <SheikhButton variant="primary" onClick={onRetry} style={{ flex: 1 }}>
            🎙️ Try Again
          </SheikhButton>
        ) : onContinue ? (
          <SheikhButton variant="primary" onClick={onContinue} style={{ flex: 1 }}>
            Continue →
          </SheikhButton>
        ) : null}
      </div>

      <style jsx>{`
        .tajweed-feedback {
          max-width: 480px;
          margin: 0 auto;
          padding: 24px 20px;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .tajweed-feedback--visible { opacity: 1; transform: translateY(0); }

        .tajweed-feedback__score-section {
          display: flex; flex-direction: column; align-items: center; margin-bottom: 20px;
        }
        .tajweed-feedback__score-ring {
          position: relative; width: 100px; height: 100px; margin-bottom: 8px;
        }
        .tajweed-feedback__score-svg { width: 100%; height: 100%; }
        .tajweed-feedback__score-value {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          display: flex; align-items: baseline;
        }

        .tajweed-feedback__card {
          background: linear-gradient(135deg, #0c1f1a 0%, #132e25 100%);
          border: 1px solid rgba(45, 212, 150, 0.15);
          border-radius: 16px; padding: 18px; margin-bottom: 16px;
        }
        .tajweed-feedback__card-header {
          display: flex; align-items: center; gap: 10px; margin-bottom: 12px;
        }
        .tajweed-feedback__avatar {
          width: 32px; height: 32px; border-radius: 50%;
          background: linear-gradient(135deg, #2dd496, #1a7a54);
          display: flex; align-items: center; justify-content: center; font-size: 16px;
        }
        .tajweed-feedback__message {
          color: #c8e6dc; font-size: 14.5px; line-height: 1.65; margin: 0;
        }

        .tajweed-feedback__skeleton { display: flex; flex-direction: column; gap: 10px; }
        .skeleton-line {
          height: 13px; border-radius: 7px;
          background: linear-gradient(90deg, rgba(45,212,150,0.08) 25%, rgba(45,212,150,0.15) 50%, rgba(45,212,150,0.08) 75%);
          background-size: 200% 100%; animation: shimmer 1.5s infinite;
        }
        .skeleton-line--long { width: 100%; }
        .skeleton-line--medium { width: 70%; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        .tajweed-feedback__corrections {
          margin-bottom: 16px; opacity: 0; transform: translateY(8px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .tajweed-feedback__corrections--visible { opacity: 1; transform: translateY(0); }
        .tajweed-feedback__corrections-title {
          font-size: 13px; font-weight: 600; color: #6bb89a; margin: 0 0 10px;
          text-transform: uppercase; letter-spacing: 0.5px;
        }
        .tajweed-feedback__correction {
          padding: 12px 14px; background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; margin-bottom: 8px;
          animation: corrFadeIn 0.3s ease both;
        }
        @keyframes corrFadeIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
        .tajweed-feedback__correction-header {
          display: flex; align-items: center; gap: 8px; margin-bottom: 6px;
        }
        .tajweed-feedback__correction-dot {
          width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
        }
        .tajweed-feedback__correction-rule { font-size: 14px; font-weight: 600; color: #e8f5f0; }
        .tajweed-feedback__correction-loc { font-size: 12px; color: #6bb89a; }
        .tajweed-feedback__correction-text {
          color: #a8c8bc; font-size: 13.5px; line-height: 1.55; margin: 0; padding-left: 16px;
        }

        .tajweed-feedback__actions { display: flex; gap: 10px; }
      `}</style>
    </div>
  );
}
