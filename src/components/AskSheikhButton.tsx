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

import { motion, AnimatePresence } from 'framer-motion';
import { useSheikh } from '@/contexts/SheikhContext';

interface AskSheikhButtonProps {
  initialQuestion?: string;
  show?: boolean;
}

/** Stylized crescent moon + open book SVG icon */
function SheikhIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="sheikh-icon"
    >
      {/* Open book base */}
      <path
        d="M4 20.5C4 20.5 6.5 18.5 14 18.5C21.5 18.5 24 20.5 24 20.5V9C24 9 21.5 7 14 7C6.5 7 4 9 4 9V20.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      {/* Book spine */}
      <path
        d="M14 7V18.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* Crescent moon above book */}
      <path
        d="M16.5 3C15.2 3.8 14.5 5.2 14.5 6.5C14.5 7.8 15.2 9 16.5 9.5C15.3 9.8 14 9.3 13.2 8.3C12.4 7.3 12.2 5.9 12.8 4.7C13.4 3.5 14.8 2.8 16.5 3Z"
        fill="currentColor"
        opacity="0.85"
      />
      {/* Small star */}
      <circle cx="19" cy="4.5" r="0.8" fill="currentColor" opacity="0.6" />
      {/* Subtle page lines */}
      <path d="M7 11.5H11" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.3" />
      <path d="M7 13.5H10" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.3" />
      <path d="M17 11.5H21" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.3" />
      <path d="M17 13.5H20" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.3" />
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

  if (isSheikhOpen || !show) return null;

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
              className="text-[10px] text-gray-500 hover:text-gray-400 mt-1"
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
            <SheikhIcon />
          </span>
        </motion.button>
      </motion.div>

      <style jsx>{`
        .sheikh-fab {
          position: relative;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          background: transparent;
          padding: 0;
          -webkit-tap-highlight-color: transparent;
        }

        .sheikh-fab__glow {
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(212, 175, 55, 0.25) 0%,
            rgba(212, 175, 55, 0.08) 50%,
            transparent 70%
          );
          animation: sheikhBreathe 4s ease-in-out infinite;
          pointer-events: none;
        }

        .sheikh-fab__surface {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.12) 0%,
            rgba(255, 255, 255, 0.04) 50%,
            rgba(212, 175, 55, 0.08) 100%
          );
          backdrop-filter: blur(24px) saturate(1.4);
          -webkit-backdrop-filter: blur(24px) saturate(1.4);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow:
            0 0 20px rgba(212, 175, 55, 0.15),
            0 4px 16px rgba(0, 0, 0, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.12),
            inset 0 -1px 0 rgba(0, 0, 0, 0.1);
          color: rgba(212, 175, 55, 0.9);
          transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .sheikh-fab:hover .sheikh-fab__surface {
          border-color: rgba(212, 175, 55, 0.35);
          box-shadow:
            0 0 30px rgba(212, 175, 55, 0.3),
            0 0 60px rgba(212, 175, 55, 0.1),
            0 6px 20px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          color: rgba(212, 175, 55, 1);
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.16) 0%,
            rgba(255, 255, 255, 0.06) 50%,
            rgba(212, 175, 55, 0.12) 100%
          );
        }

        .sheikh-fab:active .sheikh-fab__surface {
          box-shadow:
            0 0 16px rgba(212, 175, 55, 0.2),
            0 2px 8px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        @keyframes sheikhBreathe {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.08);
          }
        }
      `}</style>
    </AnimatePresence>
  );
}
