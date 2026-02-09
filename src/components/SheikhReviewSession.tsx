'use client';

import { useEffect, useRef, useState } from 'react';
import SheikhButton from '@/components/ui/SheikhButton';
import {
  useSheikhReview,
  type ReviewType,
  type ReviewAyah,
  type SessionResult,
} from '@/hooks/useSheikhReview';

// ─── Types ─────────────────────────────────────────────────────────

interface SheikhReviewSessionProps {
  /** Ayahs to review, grouped by type */
  sabaqAyahs?: ReviewAyah[];
  sabqiAyahs?: ReviewAyah[];
  manzilAyahs?: ReviewAyah[];
  /** User info */
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  userName?: string;
  streakDays?: number;
  /** Callbacks */
  onComplete?: (type: ReviewType, result: SessionResult) => void;
  onExit?: () => void;
  className?: string;
}

const REVIEW_META: Record<ReviewType, { label: string; emoji: string; color: string; description: string }> = {
  sabaq: {
    label: 'Sabaq',
    emoji: '🌱',
    color: '#2dd496',
    description: 'New lesson — solidify what you just memorized',
  },
  sabqi: {
    label: 'Sabqi',
    emoji: '🌿',
    color: '#40b8e0',
    description: 'Recent review — keep it fresh',
  },
  manzil: {
    label: 'Manzil',
    emoji: '🌳',
    color: '#d4a844',
    description: 'Long-term review — maintain forever',
  },
};

// ─── Component ─────────────────────────────────────────────────────

export default function SheikhReviewSession({
  sabaqAyahs = [],
  sabqiAyahs = [],
  manzilAyahs = [],
  userLevel,
  userName,
  streakDays,
  onComplete,
  onExit,
  className = '',
}: SheikhReviewSessionProps) {
  const {
    messages,
    isLoading,
    error,
    sessionResult,
    isComplete,
    start,
    respond,
    reset,
    reviewType,
  } = useSheikhReview();

  const [activeTab, setActiveTab] = useState<ReviewType | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [animateIn, setAnimateIn] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Determine which tabs are available
  const availableTabs: { type: ReviewType; ayahs: ReviewAyah[] }[] = [];
  if (sabaqAyahs.length > 0) availableTabs.push({ type: 'sabaq', ayahs: sabaqAyahs });
  if (sabqiAyahs.length > 0) availableTabs.push({ type: 'sabqi', ayahs: sabqiAyahs });
  if (manzilAyahs.length > 0) availableTabs.push({ type: 'manzil', ayahs: manzilAyahs });

  useEffect(() => {
    const t = setTimeout(() => setAnimateIn(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Show result
  useEffect(() => {
    if (isComplete && sessionResult) {
      const t = setTimeout(() => setShowResult(true), 500);
      return () => clearTimeout(t);
    }
  }, [isComplete, sessionResult]);

  const handleStartReview = (type: ReviewType) => {
    const ayahMap: Record<ReviewType, ReviewAyah[]> = {
      sabaq: sabaqAyahs,
      sabqi: sabqiAyahs,
      manzil: manzilAyahs,
    };
    setActiveTab(type);
    start({
      reviewType: type,
      ayahs: ayahMap[type],
      userLevel,
      userName,
      streakDays,
    });
  };

  const handleSend = async (text?: string) => {
    const message = text || inputValue.trim();
    if (!message || isLoading) return;
    setInputValue('');
    await respond(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSessionComplete = () => {
    if (sessionResult && reviewType) {
      onComplete?.(reviewType, sessionResult);
    }
    // Check if there are more review types to do
    const currentIndex = availableTabs.findIndex((t) => t.type === reviewType);
    if (currentIndex < availableTabs.length - 1) {
      // More reviews available — offer to continue
      reset();
      setActiveTab(null);
      setShowResult(false);
    } else {
      onExit?.();
    }
  };

  // ─── Tab Selection Screen ────────────────────────────────────────

  if (!activeTab || (!reviewType && messages.length === 0)) {
    return (
      <div className={`review-session ${animateIn ? 'review-session--visible' : ''} ${className}`}>
        <div className="review-session__picker">
          <div className="review-session__picker-header">
            <div className="review-session__avatar"><span>🕌</span></div>
            <h2 className="review-session__picker-title">Review Time</h2>
            <p className="review-session__picker-subtitle">
              Sheikh HIFZ will guide you through each review type
            </p>
          </div>

          <div className="review-session__tabs">
            {availableTabs.map(({ type, ayahs }) => {
              const meta = REVIEW_META[type];
              return (
                <button
                  key={type}
                  className="review-session__tab"
                  onClick={() => handleStartReview(type)}
                >
                  <div className="review-session__tab-left">
                    <span className="review-session__tab-emoji">{meta.emoji}</span>
                    <div>
                      <span className="review-session__tab-label" style={{ color: meta.color }}>
                        {meta.label}
                      </span>
                      <span className="review-session__tab-desc">{meta.description}</span>
                    </div>
                  </div>
                  <div className="review-session__tab-count">
                    <span className="review-session__tab-num">{ayahs.length}</span>
                    <span className="review-session__tab-unit">ayah{ayahs.length !== 1 ? 's' : ''}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {availableTabs.length === 0 && (
            <div className="review-session__empty">
              <p>No ayahs to review right now — great job staying on top of it! 🎉</p>
              <SheikhButton variant="primary" onClick={onExit}>
                Back to Dashboard
              </SheikhButton>
            </div>
          )}

          {onExit && availableTabs.length > 0 && (
            <SheikhButton
              variant="ghost"
              size="sm"
              onClick={onExit}
              style={{ marginTop: 16, alignSelf: 'center' }}
            >
              ← Back
            </SheikhButton>
          )}
        </div>

        <style jsx>{`${pickerStyles}`}</style>
      </div>
    );
  }

  // ─── Active Review Session ───────────────────────────────────────

  const meta = reviewType ? REVIEW_META[reviewType] : null;

  return (
    <div className={`review-session review-session--active ${className}`}>
      {/* Session header */}
      <div className="review-session__header">
        <div className="review-session__header-left">
          {meta && (
            <>
              <span style={{ fontSize: 18 }}>{meta.emoji}</span>
              <span className="review-session__header-type" style={{ color: meta.color }}>
                {meta.label} Review
              </span>
            </>
          )}
        </div>
        {!isComplete && (
          <SheikhButton variant="ghost" size="sm" onClick={() => { reset(); setActiveTab(null); }}>
            ✕ End
          </SheikhButton>
        )}
      </div>

      {/* Messages */}
      <div className="review-session__messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`review-session__bubble review-session__bubble--${msg.role}`}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {msg.role === 'assistant' && (
              <div className="review-session__bubble-avatar"><span>🕌</span></div>
            )}
            <div className="review-session__bubble-content">
              <p>{msg.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="review-session__bubble review-session__bubble--assistant">
            <div className="review-session__bubble-avatar"><span>🕌</span></div>
            <div className="review-session__bubble-content">
              <div className="review-session__typing"><span /><span /><span /></div>
            </div>
          </div>
        )}

        {/* Session result */}
        {showResult && sessionResult && (
          <div className="review-session__result">
            <div className="review-session__result-perf">
              {sessionResult.overallPerformance === 'excellent' && '⭐'}
              {sessionResult.overallPerformance === 'good' && '👍'}
              {sessionResult.overallPerformance === 'needs_work' && '💪'}
              <span style={{
                color: sessionResult.overallPerformance === 'excellent' ? '#2dd496'
                  : sessionResult.overallPerformance === 'good' ? '#40b8e0'
                  : '#d4a844',
              }}>
                {sessionResult.overallPerformance === 'excellent' ? 'Excellent!'
                  : sessionResult.overallPerformance === 'good' ? 'Good work!'
                  : 'Keep going!'}
              </span>
            </div>

            <div className="review-session__result-stats">
              <div className="review-session__result-stat">
                <span className="review-session__result-stat-num">{sessionResult.ayahsCovered}</span>
                <span className="review-session__result-stat-label">Ayahs Covered</span>
              </div>
              <div className="review-session__result-stat">
                <span className="review-session__result-stat-num">
                  {sessionResult.nextReviewSuggestion}
                </span>
                <span className="review-session__result-stat-label">Next Review</span>
              </div>
            </div>

            <p className="review-session__result-rec">{sessionResult.recommendation}</p>

            <div className="review-session__result-actions">
              {availableTabs.findIndex((t) => t.type === reviewType) < availableTabs.length - 1 ? (
                <SheikhButton variant="primary" onClick={handleSessionComplete} style={{ flex: 1 }}>
                  Next Review →
                </SheikhButton>
              ) : (
                <SheikhButton variant="primary" onClick={handleSessionComplete} style={{ flex: 1 }}>
                  Done ✓
                </SheikhButton>
              )}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {!isComplete && (
        <div className="review-session__input-area">
          <div className="review-session__quick-replies">
            <SheikhButton variant="chip" breathe onClick={() => handleSend("I'll try to recite it now")}>
              🎙️ Recite
            </SheikhButton>
            <SheikhButton variant="chip" breathe onClick={() => handleSend("I'm not sure, can you help?")}>
              🤔 Help me
            </SheikhButton>
            <SheikhButton variant="chip" breathe onClick={() => handleSend("Let's move to the next one")}>
              ⏭️ Next
            </SheikhButton>
          </div>
          <div className="review-session__input-row">
            <input
              type="text"
              className="review-session__input"
              placeholder="Type your answer..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <SheikhButton
              variant="primary"
              size="sm"
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isLoading}
            >
              Send
            </SheikhButton>
          </div>
        </div>
      )}

      {error && (
        <div className="review-session__error">
          Something went wrong. <SheikhButton variant="ghost" size="sm" onClick={() => reset()}>Retry</SheikhButton>
        </div>
      )}

      <style jsx>{`${sessionStyles}`}</style>
    </div>
  );
}

// ─── Styles ────────────────────────────────────────────────────────

const pickerStyles = `
  .review-session {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    min-height: 100dvh;
    max-width: 520px;
    margin: 0 auto;
    background: #080f0c;
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  .review-session--visible { opacity: 1; }

  .review-session__picker {
    display: flex;
    flex-direction: column;
    padding: 32px 20px;
  }
  .review-session__picker-header {
    text-align: center;
    margin-bottom: 28px;
  }
  .review-session__avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2dd496, #1a7a54);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    margin-bottom: 12px;
    box-shadow: 0 0 30px rgba(45, 212, 150, 0.3);
  }
  .review-session__picker-title {
    font-size: 22px;
    font-weight: 700;
    color: #e8f5f0;
    margin: 0 0 6px;
  }
  .review-session__picker-subtitle {
    font-size: 14px;
    color: #6bb89a;
    margin: 0;
  }

  .review-session__tabs {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .review-session__tab {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 18px;
    background: linear-gradient(135deg, #0c1f1a, #132e25);
    border: 1px solid rgba(45, 212, 150, 0.1);
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
    text-align: left;
    color: inherit;
    font-family: inherit;
  }
  .review-session__tab:hover {
    border-color: rgba(45, 212, 150, 0.25);
    transform: translateY(-2px);
    box-shadow: 0 0 20px rgba(45, 212, 150, 0.1);
  }
  .review-session__tab-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .review-session__tab-emoji { font-size: 24px; }
  .review-session__tab-label {
    display: block;
    font-size: 15px;
    font-weight: 600;
  }
  .review-session__tab-desc {
    display: block;
    font-size: 12px;
    color: #6bb89a;
    margin-top: 2px;
  }
  .review-session__tab-count {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 42px;
  }
  .review-session__tab-num {
    font-size: 20px;
    font-weight: 700;
    color: #2dd496;
  }
  .review-session__tab-unit {
    font-size: 10px;
    color: #4a7a66;
  }

  .review-session__empty {
    text-align: center;
    padding: 32px 16px;
    color: #6bb89a;
    font-size: 15px;
  }
`;

const sessionStyles = `
  .review-session--active {
    display: flex;
    flex-direction: column;
    height: 100vh;
    height: 100dvh;
    max-width: 520px;
    margin: 0 auto;
    background: #080f0c;
  }

  .review-session__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px;
    border-bottom: 1px solid rgba(45, 212, 150, 0.08);
  }
  .review-session__header-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .review-session__header-type {
    font-size: 14px;
    font-weight: 600;
  }

  .review-session__messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .review-session__bubble {
    display: flex;
    gap: 10px;
    max-width: 85%;
    animation: rBubbleFadeIn 0.3s ease both;
  }
  @keyframes rBubbleFadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .review-session__bubble--assistant { align-self: flex-start; }
  .review-session__bubble--user { align-self: flex-end; flex-direction: row-reverse; }

  .review-session__bubble-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2dd496, #1a7a54);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .review-session__bubble-content {
    padding: 10px 14px;
    border-radius: 16px;
    font-size: 14px;
    line-height: 1.55;
  }
  .review-session__bubble-content p { margin: 0; }
  .review-session__bubble--assistant .review-session__bubble-content {
    background: linear-gradient(135deg, #0c1f1a, #132e25);
    border: 1px solid rgba(45, 212, 150, 0.12);
    color: #c8e6dc;
    border-top-left-radius: 4px;
  }
  .review-session__bubble--user .review-session__bubble-content {
    background: linear-gradient(135deg, #1a7a54, #22915f);
    color: #fff;
    border-top-right-radius: 4px;
  }

  .review-session__typing {
    display: flex;
    gap: 4px;
    padding: 4px 0;
  }
  .review-session__typing span {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #6bb89a;
    animation: rTypingDot 1.4s ease-in-out infinite;
  }
  .review-session__typing span:nth-child(2) { animation-delay: 0.2s; }
  .review-session__typing span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes rTypingDot {
    0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
    30% { opacity: 1; transform: translateY(-4px); }
  }

  /* Result card */
  .review-session__result {
    background: linear-gradient(135deg, #0c1f1a, #132e25);
    border: 1px solid rgba(45, 212, 150, 0.2);
    border-radius: 20px;
    padding: 24px 20px;
    animation: rResultIn 0.5s cubic-bezier(0.23, 1, 0.32, 1) both;
    box-shadow: 0 0 30px rgba(45, 212, 150, 0.1);
  }
  @keyframes rResultIn {
    from { opacity: 0; transform: translateY(16px) scale(0.96); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  .review-session__result-perf {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 16px;
  }
  .review-session__result-stats {
    display: flex;
    gap: 12px;
    margin-bottom: 14px;
  }
  .review-session__result-stat {
    flex: 1;
    text-align: center;
    padding: 12px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
  }
  .review-session__result-stat-num {
    display: block;
    font-size: 18px;
    font-weight: 700;
    color: #2dd496;
    margin-bottom: 2px;
  }
  .review-session__result-stat-label {
    font-size: 11px;
    color: #4a7a66;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .review-session__result-rec {
    font-size: 13.5px;
    color: #a8c8bc;
    line-height: 1.55;
    margin: 0 0 14px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 10px;
  }
  .review-session__result-actions {
    display: flex;
    gap: 10px;
  }

  /* Input */
  .review-session__input-area {
    padding: 10px 20px 20px;
    border-top: 1px solid rgba(45, 212, 150, 0.06);
  }
  .review-session__quick-replies {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 10px;
  }
  .review-session__input-row {
    display: flex;
    gap: 8px;
  }
  .review-session__input {
    flex: 1;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(45, 212, 150, 0.12);
    border-radius: 12px;
    padding: 10px 14px;
    font-size: 14px;
    color: #e8f5f0;
    outline: none;
    font-family: inherit;
    transition: border-color 0.2s ease;
  }
  .review-session__input::placeholder { color: #4a7a66; }
  .review-session__input:focus {
    border-color: rgba(45, 212, 150, 0.35);
    box-shadow: 0 0 12px rgba(45, 212, 150, 0.1);
  }
  .review-session__input:disabled { opacity: 0.5; }

  .review-session__error {
    padding: 12px 20px;
    text-align: center;
    color: #e06050;
    font-size: 13px;
  }
`;
