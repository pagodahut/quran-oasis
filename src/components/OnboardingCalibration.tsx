'use client';

import { useEffect, useRef, useState } from 'react';
import SheikhButton from '@/components/ui/SheikhButton';
import { useCalibration, type CalibrationAssessment } from '@/hooks/useCalibration';

interface OnboardingCalibrationProps {
  userName?: string;
  /** Called when calibration completes with the assessed level */
  onComplete: (assessment: CalibrationAssessment) => void;
  /** Called if user wants to skip calibration */
  onSkip?: () => void;
  className?: string;
}

const QUICK_REPLIES: Record<number, string[]> = {
  0: [], // Sheikh's opening — user types freely
  1: [
    'Yes, I can read Arabic fluently',
    'I can read slowly',
    'I know some letters but struggle',
    "No, I can't read Arabic yet",
  ],
  2: [
    'Yes, I know the basic rules',
    "I've heard of it but don't know the rules",
    "No, I don't know what tajweed is",
  ],
  3: [
    "I haven't memorized anything yet",
    'A few short surahs (Fatiha, Ikhlas, etc.)',
    'Several surahs from Juz Amma',
    'More than one juz',
  ],
  4: [
    'Yes, I understand the meanings',
    'Some of them — mostly the short surahs',
    "Not really, I've memorized the sounds",
  ],
};

export default function OnboardingCalibration({
  userName,
  onComplete,
  onSkip,
  className = '',
}: OnboardingCalibrationProps) {
  const {
    messages,
    isLoading,
    error,
    assessment,
    isComplete,
    start,
    respond,
    questionNumber,
  } = useCalibration(userName);

  const [inputValue, setInputValue] = useState('');
  const [animateIn, setAnimateIn] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Start calibration on mount
  useEffect(() => {
    start();
    const t = setTimeout(() => setAnimateIn(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Show result card after assessment
  useEffect(() => {
    if (isComplete && assessment) {
      const t = setTimeout(() => setShowResult(true), 600);
      return () => clearTimeout(t);
    }
  }, [isComplete, assessment]);

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

  const currentQuickReplies = QUICK_REPLIES[questionNumber] || [];

  const progressPercent = Math.min((questionNumber / 5) * 100, 100);

  return (
    <div
      className={`calibration ${animateIn ? 'calibration--visible' : ''} ${className}`}
      role="region"
      aria-label="Sheikh HIFZ level assessment"
    >
      {/* Header */}
      <div className="calibration__header">
        <div className="calibration__header-top">
          <div className="calibration__title-row">
            <div className="calibration__avatar"><span>🕌</span></div>
            <div>
              <h2 className="calibration__title">Meet Sheikh HIFZ</h2>
              <p className="calibration__subtitle">Your personal Quran teacher</p>
            </div>
          </div>
          {onSkip && !isComplete && (
            <SheikhButton variant="ghost" size="sm" onClick={onSkip}>
              Skip →
            </SheikhButton>
          )}
        </div>

        {/* Progress bar */}
        <div className="calibration__progress">
          <div
            className="calibration__progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Messages */}
      <div className="calibration__messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`calibration__bubble calibration__bubble--${msg.role}`}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {msg.role === 'assistant' && (
              <div className="calibration__bubble-avatar"><span>🕌</span></div>
            )}
            <div className="calibration__bubble-content">
              <p>{msg.content}</p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="calibration__bubble calibration__bubble--assistant">
            <div className="calibration__bubble-avatar"><span>🕌</span></div>
            <div className="calibration__bubble-content">
              <div className="calibration__typing">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}

        {/* Result card */}
        {showResult && assessment && (
          <div className="calibration__result">
            <div className="calibration__result-badge">
              {assessment.level === 'beginner' && '🌱'}
              {assessment.level === 'intermediate' && '🌿'}
              {assessment.level === 'advanced' && '🌳'}
            </div>
            <h3 className="calibration__result-level">
              {assessment.level.charAt(0).toUpperCase() + assessment.level.slice(1)} Level
            </h3>
            <p className="calibration__result-summary">{assessment.summary}</p>

            <div className="calibration__result-skills">
              <SkillPill label="Arabic Reading" value={assessment.arabicReading} />
              <SkillPill label="Tajweed" value={assessment.tajweedKnowledge} />
              <SkillPill label="Memorized" value={`${assessment.memorizationCount} surah${assessment.memorizationCount !== 1 ? 's' : ''}`} />
              <SkillPill label="Understanding" value={assessment.understanding} />
            </div>

            <p className="calibration__result-rec">
              <strong>Recommendation:</strong> {assessment.recommendation}
            </p>

            <SheikhButton
              variant="primary"
              size="lg"
              onClick={() => onComplete(assessment)}
              style={{ width: '100%', marginTop: 16 }}
            >
              ﷽ Begin My Journey
            </SheikhButton>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area — hidden when complete */}
      {!isComplete && (
        <div className="calibration__input-area">
          {/* Quick replies */}
          {currentQuickReplies.length > 0 && !isLoading && (
            <div className="calibration__quick-replies">
              {currentQuickReplies.map((reply, i) => (
                <SheikhButton
                  key={i}
                  variant="chip"
                  breathe
                  onClick={() => handleSend(reply)}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {reply}
                </SheikhButton>
              ))}
            </div>
          )}

          {/* Text input */}
          <div className="calibration__input-row">
            <input
              ref={inputRef}
              type="text"
              className="calibration__input"
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

      {/* Error */}
      {error && (
        <div className="calibration__error">
          <p>Something went wrong. <SheikhButton variant="ghost" size="sm" onClick={start}>Try again</SheikhButton></p>
        </div>
      )}

      <style jsx>{`
        .calibration {
          display: flex;
          flex-direction: column;
          height: 100vh;
          height: 100dvh;
          max-width: 520px;
          margin: 0 auto;
          background: #080f0c;
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .calibration--visible { opacity: 1; }

        /* ─── Header ─── */
        .calibration__header {
          padding: 16px 20px 12px;
          border-bottom: 1px solid rgba(45, 212, 150, 0.08);
        }
        .calibration__header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .calibration__title-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .calibration__avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2dd496, #1a7a54);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }
        .calibration__title {
          font-size: 16px;
          font-weight: 700;
          color: #e8f5f0;
          margin: 0;
        }
        .calibration__subtitle {
          font-size: 12px;
          color: #6bb89a;
          margin: 0;
        }
        .calibration__progress {
          height: 3px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 2px;
          overflow: hidden;
        }
        .calibration__progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #2dd496, #1a7a54);
          border-radius: 2px;
          transition: width 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        }

        /* ─── Messages ─── */
        .calibration__messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .calibration__bubble {
          display: flex;
          gap: 10px;
          max-width: 85%;
          animation: bubbleFadeIn 0.3s ease both;
        }
        @keyframes bubbleFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .calibration__bubble--assistant {
          align-self: flex-start;
        }
        .calibration__bubble--user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }
        .calibration__bubble-avatar {
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
        .calibration__bubble-content {
          padding: 10px 14px;
          border-radius: 16px;
          font-size: 14px;
          line-height: 1.55;
        }
        .calibration__bubble-content p {
          margin: 0;
        }
        .calibration__bubble--assistant .calibration__bubble-content {
          background: linear-gradient(135deg, #0c1f1a, #132e25);
          border: 1px solid rgba(45, 212, 150, 0.12);
          color: #c8e6dc;
          border-top-left-radius: 4px;
        }
        .calibration__bubble--user .calibration__bubble-content {
          background: linear-gradient(135deg, #1a7a54, #22915f);
          color: #fff;
          border-top-right-radius: 4px;
        }

        /* ─── Typing indicator ─── */
        .calibration__typing {
          display: flex;
          gap: 4px;
          padding: 4px 0;
        }
        .calibration__typing span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #6bb89a;
          animation: typingDot 1.4s ease-in-out infinite;
        }
        .calibration__typing span:nth-child(2) { animation-delay: 0.2s; }
        .calibration__typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typingDot {
          0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-4px); }
        }

        /* ─── Result card ─── */
        .calibration__result {
          background: linear-gradient(135deg, #0c1f1a, #132e25);
          border: 1px solid rgba(45, 212, 150, 0.2);
          border-radius: 20px;
          padding: 24px 20px;
          text-align: center;
          animation: resultSlideIn 0.5s cubic-bezier(0.23, 1, 0.32, 1) both;
          box-shadow: 0 0 30px rgba(45, 212, 150, 0.1);
        }
        @keyframes resultSlideIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .calibration__result-badge {
          font-size: 48px;
          margin-bottom: 8px;
        }
        .calibration__result-level {
          font-size: 22px;
          font-weight: 700;
          color: #2dd496;
          margin: 0 0 8px;
        }
        .calibration__result-summary {
          font-size: 14px;
          color: #a8c8bc;
          line-height: 1.55;
          margin: 0 0 16px;
        }
        .calibration__result-skills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          margin-bottom: 14px;
        }
        .calibration__result-rec {
          font-size: 13px;
          color: #8ab8a4;
          line-height: 1.55;
          margin: 0;
          padding: 12px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 10px;
          text-align: left;
        }
        .calibration__result-rec strong {
          color: #2dd496;
        }

        /* ─── Input area ─── */
        .calibration__input-area {
          padding: 12px 20px 20px;
          border-top: 1px solid rgba(45, 212, 150, 0.06);
        }
        .calibration__quick-replies {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 12px;
        }
        .calibration__input-row {
          display: flex;
          gap: 8px;
        }
        .calibration__input {
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
        .calibration__input::placeholder {
          color: #4a7a66;
        }
        .calibration__input:focus {
          border-color: rgba(45, 212, 150, 0.35);
          box-shadow: 0 0 12px rgba(45, 212, 150, 0.1);
        }
        .calibration__input:disabled {
          opacity: 0.5;
        }

        .calibration__error {
          padding: 12px 20px;
          text-align: center;
          color: #e06050;
          font-size: 13px;
        }
      `}</style>
    </div>
  );
}

// ─── Skill Pill Sub-component ──────────────────────────────────────

function SkillPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="skill-pill">
      <span className="skill-pill__label">{label}</span>
      <span className="skill-pill__value">{value}</span>
      <style jsx>{`
        .skill-pill {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          padding: 8px 14px;
          background: rgba(45, 212, 150, 0.06);
          border: 1px solid rgba(45, 212, 150, 0.1);
          border-radius: 12px;
          min-width: 80px;
        }
        .skill-pill__label {
          font-size: 10px;
          color: #4a7a66;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }
        .skill-pill__value {
          font-size: 13px;
          color: #2dd496;
          font-weight: 600;
          text-transform: capitalize;
        }
      `}</style>
    </div>
  );
}
