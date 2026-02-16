'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SheikhButton from '@/components/ui/SheikhButton';

export default function WelcomePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 400),
      setTimeout(() => setStep(2), 1200),
      setTimeout(() => setStep(3), 2200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="welcome">
      <div className="welcome__bg" />

      <div className="welcome__content">
        {/* Mosque icon */}
        <div className={`welcome__icon ${step >= 1 ? 'welcome__icon--visible' : ''}`}>
          🕌
        </div>

        {/* Bismillah */}
        <p className={`welcome__bismillah ${step >= 1 ? 'welcome__bismillah--visible' : ''}`}>
          بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
        </p>

        {/* Title */}
        <h1 className={`welcome__title ${step >= 2 ? 'welcome__title--visible' : ''}`}>
          Quran Oasis
        </h1>
        <p className={`welcome__subtitle ${step >= 2 ? 'welcome__subtitle--visible' : ''}`}>
          Your personal Quran memorization companion
        </p>

        {/* Sheikh intro */}
        <div className={`welcome__sheikh-intro ${step >= 3 ? 'welcome__sheikh-intro--visible' : ''}`}>
          <div className="welcome__sheikh-avatar">🕌</div>
          <div className="welcome__sheikh-bubble">
            <p>
              Assalamu alaikum! I&apos;m <strong>Sheikh HIFZ</strong>, your AI-powered Quran teacher.
              Let me learn about your background so I can personalize your journey.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className={`welcome__cta ${step >= 3 ? 'welcome__cta--visible' : ''}`}>
          <SheikhButton
            variant="primary"
            size="lg"
            breathe
            onClick={() => router.push('/onboarding/calibration')}
            style={{ width: '100%', maxWidth: 320 }}
          >
            ﷽ Let&apos;s Begin
          </SheikhButton>
          <button
            className="welcome__skip"
            onClick={() => router.push('/practice')}
          >
            Skip for now →
          </button>
        </div>
      </div>

      <style jsx>{`
        .welcome {
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #080f0c;
          position: relative;
          overflow: hidden;
          padding: 32px 20px;
        }

        .welcome__bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 30%, rgba(45, 212, 150, 0.08) 0%, transparent 60%);
          pointer-events: none;
        }

        .welcome__content {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 420px;
          width: 100%;
          gap: 8px;
        }

        .welcome__icon {
          font-size: 64px;
          opacity: 0;
          transform: scale(0.5);
          transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
          filter: drop-shadow(0 0 30px rgba(45, 212, 150, 0.4));
        }
        .welcome__icon--visible {
          opacity: 1;
          transform: scale(1);
        }

        .welcome__bismillah {
          font-size: 24px;
          color: #2dd496;
          font-family: 'Amiri', 'Scheherazade New', serif;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.6s ease;
          margin: 8px 0 16px;
          direction: rtl;
        }
        .welcome__bismillah--visible {
          opacity: 1;
          transform: translateY(0);
        }

        .welcome__title {
          font-size: 32px;
          font-weight: 800;
          color: #e8f5f0;
          margin: 0;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.6s ease;
        }
        .welcome__title--visible {
          opacity: 1;
          transform: translateY(0);
        }

        .welcome__subtitle {
          font-size: 15px;
          color: #6bb89a;
          margin: 0 0 24px;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.6s ease 0.15s;
        }
        .welcome__title--visible ~ .welcome__subtitle,
        .welcome__subtitle--visible {
          opacity: 1;
          transform: translateY(0);
        }

        .welcome__sheikh-intro {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          width: 100%;
          opacity: 0;
          transform: translateY(16px);
          transition: all 0.6s ease;
          margin-bottom: 24px;
        }
        .welcome__sheikh-intro--visible {
          opacity: 1;
          transform: translateY(0);
        }

        .welcome__sheikh-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2dd496, #1a7a54);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
          box-shadow: 0 0 20px rgba(45, 212, 150, 0.3);
        }

        .welcome__sheikh-bubble {
          padding: 12px 16px;
          background: linear-gradient(135deg, #0c1f1a, #132e25);
          border: 1px solid rgba(45, 212, 150, 0.12);
          border-radius: 16px;
          border-top-left-radius: 4px;
        }
        .welcome__sheikh-bubble p {
          margin: 0;
          font-size: 14px;
          line-height: 1.55;
          color: #c8e6dc;
        }
        .welcome__sheikh-bubble strong {
          color: #2dd496;
        }

        .welcome__cta {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          width: 100%;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.6s ease;
        }
        .welcome__cta--visible {
          opacity: 1;
          transform: translateY(0);
        }

        .welcome__skip {
          background: none;
          border: none;
          color: #4a7a66;
          font-size: 13px;
          cursor: pointer;
          padding: 8px 16px;
          font-family: inherit;
          transition: color 0.2s ease;
        }
        .welcome__skip:hover { color: #6bb89a; }
      `}</style>
    </div>
  );
}
