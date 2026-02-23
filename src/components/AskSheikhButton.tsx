'use client';

/**
 * AskSheikhButton — Liquid Glass Floating Action Button
 * 
 * A beautiful circular floating button with liquid glass effect,
 * custom AI Sheikh icon (crescent + book), breathing animation,
 * and gold glow on hover. Opens the Sheikh chat panel.
 * 
 * Positioned bottom-right, above BottomNav.
 * FeedbackButton goes bottom-left for symmetry.
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSheikh } from '@/contexts/SheikhContext';
import { MosqueIcon } from '@/components/icons';

interface AskSheikhButtonProps {
  initialQuestion?: string;
  show?: boolean;
}

/** Premium crescent moon & star icon — elegant Islamic motif */
function SheikhIcon() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="sheikh-icon"
    >
      {/* Crescent moon — thick, elegant arc */}
      <path
        d="M19.5 5.5C16.8 7.2 15.2 10.2 15.2 13.5C15.2 16.8 16.8 19.8 19.5 21.5C17.2 22.8 14.4 23 11.9 21.8C9.4 20.6 7.6 18.2 7 15.4C6.4 12.6 7.1 9.7 8.9 7.5C10.7 5.3 13.4 4 16.3 4C17.5 4 18.6 4.3 19.5 5.5Z"
        fill="url(#crescentGrad)"
        stroke="rgba(212,175,55,0.3)"
        strokeWidth="0.5"
      />
      {/* Star */}
      <path
        d="M22.5 8L23.3 10.2L25.5 10.2L23.7 11.5L24.3 13.7L22.5 12.4L20.7 13.7L21.3 11.5L19.5 10.2L21.7 10.2Z"
        fill="url(#starGrad)"
      />
      {/* Small decorative star */}
      <circle cx="25" cy="7" r="0.9" fill="currentColor" opacity="0.5" />
      <circle cx="21" cy="5.5" r="0.5" fill="currentColor" opacity="0.35" />
      {/* Subtle geometric line beneath — like a minaret silhouette hint */}
      <path
        d="M10 24.5C12.5 23 17.5 23 20 24.5"
        stroke="currentColor"
        strokeWidth="0.7"
        strokeLinecap="round"
        opacity="0.25"
      />
      <defs>
        <linearGradient id="crescentGrad" x1="7" y1="4" x2="20" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f5d680" />
          <stop offset="1" stopColor="#d4af37" />
        </linearGradient>
        <linearGradient id="starGrad" x1="20" y1="8" x2="25" y2="14" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffe8a0" />
          <stop offset="1" stopColor="#d4af37" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function AskSheikhButton({
  initialQuestion,
  show = true,
}: AskSheikhButtonProps) {
  const {
    isSheikhOpen,
    openSheikh,
    ayahContext,
    pageContext,
    isUserStuck,
    dismissStuckPrompt,
  } = useSheikh();

  // Hide on scroll in mushaf page
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const isMushafPage = pageContext.page === 'mushaf';
    
    if (isMushafPage) {
      // Hide completely on mushaf when scrolling down
      if (scrollY > lastScrollY + 10 && scrollY > 100) {
        setIsHidden(true);
      } else if (scrollY < lastScrollY - 10) {
        setIsHidden(false);
      }
      setLastScrollY(scrollY);
    }
  }, [pageContext.page, lastScrollY]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (isSheikhOpen || !show || isHidden) return null;

  const handleClick = () => {
    if (isUserStuck) {
      const stuckQuestion = ayahContext
        ? `I'm having trouble with ${ayahContext.surahName} ayah ${ayahContext.ayahNumber}. Can you help me break it down?`
        : pageContext.page === 'recite'
        ? "I'm struggling with my recitation. Can you help me with the pronunciation?"
        : "I'm stuck and need help with what I'm learning.";
      dismissStuckPrompt();
      openSheikh(stuckQuestion);
    } else {
      openSheikh(initialQuestion);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-20 right-4 z-40 flex flex-col items-end gap-3"
      >
        {/* "Stuck?" nudge */}
        {isUserStuck && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="backdrop-blur-2xl bg-amber-500/10 border border-amber-400/20
                       rounded-2xl px-4 py-3 max-w-[200px]
                       shadow-lg shadow-amber-500/10"
          >
            <p className="text-xs text-amber-200/90 leading-relaxed">
              Need help? Sheikh can guide you step by step.
            </p>
            <button
              onClick={() => dismissStuckPrompt()}
              className="text-[10px] text-night-500 hover:text-night-400 mt-1"
            >
              Dismiss
            </button>
          </motion.div>
        )}

        {/* Circular Liquid Glass FAB */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', damping: 14, stiffness: 280 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleClick}
          className="sheikh-fab"
          aria-label="Ask Sheikh"
        >
          {/* Breathing glow ring */}
          <span className="sheikh-fab__glow" />
          
          {/* Glass surface */}
          <span className="sheikh-fab__surface">
            <MosqueIcon size={28} />
          </span>
        </motion.button>
      </motion.div>

      <style jsx>{`
        .sheikh-fab {
          position: relative;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          background: transparent;
          padding: 0;
          -webkit-tap-highlight-color: transparent;
        }

        .sheikh-fab__glow {
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(212, 175, 55, 0.35) 0%,
            rgba(212, 175, 55, 0.12) 40%,
            rgba(212, 175, 55, 0.04) 60%,
            transparent 75%
          );
          animation: sheikhBreathe 3.5s ease-in-out infinite;
          pointer-events: none;
        }

        .sheikh-fab__surface {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(
            145deg,
            rgba(30, 25, 15, 0.85) 0%,
            rgba(20, 18, 12, 0.92) 50%,
            rgba(35, 28, 12, 0.88) 100%
          );
          backdrop-filter: blur(32px) saturate(1.6);
          -webkit-backdrop-filter: blur(32px) saturate(1.6);
          border: 1.5px solid rgba(212, 175, 55, 0.3);
          box-shadow:
            0 0 24px rgba(212, 175, 55, 0.2),
            0 6px 20px rgba(0, 0, 0, 0.35),
            inset 0 1px 0 rgba(212, 175, 55, 0.15),
            inset 0 -1px 0 rgba(0, 0, 0, 0.2);
          color: rgba(212, 175, 55, 0.95);
          transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .sheikh-fab:hover .sheikh-fab__surface {
          border-color: rgba(212, 175, 55, 0.55);
          box-shadow:
            0 0 40px rgba(212, 175, 55, 0.35),
            0 0 80px rgba(212, 175, 55, 0.12),
            0 8px 24px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(212, 175, 55, 0.25);
          color: rgba(245, 214, 128, 1);
          background: linear-gradient(
            145deg,
            rgba(40, 32, 15, 0.9) 0%,
            rgba(25, 22, 12, 0.95) 50%,
            rgba(45, 35, 15, 0.9) 100%
          );
        }

        .sheikh-fab:active .sheikh-fab__surface {
          box-shadow:
            0 0 20px rgba(212, 175, 55, 0.25),
            0 2px 10px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(212, 175, 55, 0.1);
        }

        @keyframes sheikhBreathe {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.12);
          }
        }
      `}</style>
    </AnimatePresence>
  );
}
