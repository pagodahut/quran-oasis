'use client';

import { useState } from 'react';
import SheikhButton from '@/components/ui/SheikhButton';
import type { SRSStats } from '@/lib/spaced-repetition';

interface ShareProgressProps {
  stats: SRSStats;
  userName?: string;
  /** Optional milestone text to share instead of stats */
  milestoneText?: string;
  className?: string;
}

export default function ShareProgress({
  stats,
  userName = 'Student',
  milestoneText,
  className = '',
}: ShareProgressProps) {
  const [copied, setCopied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://quranoasis.app';

  // Build OG image URL
  const ogUrl = milestoneText
    ? `${baseUrl}/api/og?type=milestone&text=${encodeURIComponent(milestoneText)}`
    : `${baseUrl}/api/og?type=progress&ayahs=${stats.totalAyahs}&streak=${stats.longestStreak}&accuracy=${Math.round(stats.averageAccuracy * 100)}&name=${encodeURIComponent(userName)}`;

  // Share text
  const shareText = milestoneText
    ? `${milestoneText} 🕌 #QuranOasis`
    : `Alhamdulillah! ${stats.totalAyahs} ayahs memorized with ${Math.round(stats.averageAccuracy * 100)}% accuracy. ${stats.longestStreak}-day streak! 🕌 #QuranOasis`;

  const shareUrl = `${baseUrl}/practice`;

  const handleShare = async (platform: 'twitter' | 'whatsapp' | 'copy') => {
    if (platform === 'twitter') {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
        '_blank'
      );
    } else if (platform === 'whatsapp') {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`,
        '_blank'
      );
    } else {
      await navigator.clipboard?.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    setShowOptions(false);
  };

  // Native share API if available
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My Quran Progress', text: shareText, url: shareUrl });
      } catch {
        // User cancelled
      }
    } else {
      setShowOptions(!showOptions);
    }
  };

  return (
    <div className={`share-progress ${className}`}>
      <SheikhButton variant="secondary" size="sm" onClick={handleNativeShare}>
        📤 Share Progress
      </SheikhButton>

      {showOptions && (
        <div className="share-progress__options">
          <button className="share-progress__option" onClick={() => handleShare('twitter')}>
            𝕏 Twitter
          </button>
          <button className="share-progress__option" onClick={() => handleShare('whatsapp')}>
            💬 WhatsApp
          </button>
          <button className="share-progress__option" onClick={() => handleShare('copy')}>
            {copied ? '✓ Copied!' : '📋 Copy Link'}
          </button>
        </div>
      )}

      <style jsx>{`
        .share-progress { position: relative; display: inline-block; }
        .share-progress__options {
          position: absolute;
          bottom: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 6px;
          padding: 8px;
          background: #132e25;
          border: 1px solid rgba(45, 212, 150, 0.15);
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
          animation: shareSlideUp 0.2s ease;
          z-index: 10;
        }
        @keyframes shareSlideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(4px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .share-progress__option {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(45, 212, 150, 0.08);
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 12px;
          color: #c8e6dc;
          cursor: pointer;
          font-family: inherit;
          white-space: nowrap;
          transition: all 0.2s ease;
        }
        .share-progress__option:hover {
          background: rgba(45, 212, 150, 0.1);
          border-color: rgba(45, 212, 150, 0.2);
        }
      `}</style>
    </div>
  );
}
