'use client';

/**
 * AskSheikhButton — Context-Aware Floating Action Button
 * 
 * V2: Now connects to the global SheikhContext instead of managing its own state.
 * Opens the sheikh panel as a slide-up overlay on the current page.
 * 
 * Features:
 * - Contextual label changes based on current page
 * - Hides when sheikh panel is already open
 * - Includes "Stuck?" prompt that appears after 5+ replays or 3+ failed recitations
 * - Smooth spring animation with haptic-feel tap
 * - Positioned above bottom nav (bottom-20)
 * 
 * Usage:
 *   // Just drop it in — it reads context automatically
 *   <AskSheikhButton />
 * 
 *   // Or with an override question
 *   <AskSheikhButton initialQuestion="Explain the tajweed rules here" />
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useSheikh } from '@/contexts/SheikhContext';

interface AskSheikhButtonProps {
  /** Optional question to auto-send when opened */
  initialQuestion?: string;
  /** Position override */
  position?: 'bottom-right' | 'bottom-center';
  /** Whether to show (allows parent to hide in certain states) */
  show?: boolean;
}

export default function AskSheikhButton({
  initialQuestion,
  position = 'bottom-right',
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

  // Don't render if panel is open or explicitly hidden
  if (isSheikhOpen || !show) return null;

  const positionClasses = {
    'bottom-right': 'bottom-20 right-4',
    'bottom-center': 'bottom-20 left-1/2 -translate-x-1/2',
  };

  // Contextual button label based on current page + ayah
  const getLabel = (): string => {
    if (isUserStuck) return 'Need help?';
    if (ayahContext) return 'Ask about this ayah';
    switch (pageContext.page) {
      case 'mushaf':
        return 'Ask Sheikh';
      case 'lesson':
        return 'Ask Sheikh';
      case 'recite':
        return 'Tajweed help';
      case 'practice':
        return 'Review help';
      case 'dashboard':
        return 'Ask Sheikh';
      default:
        return 'Ask Sheikh';
    }
  };

  // Contextual emoji
  const getEmoji = (): string => {
    if (isUserStuck) return '🤝';
    switch (pageContext.page) {
      case 'recite':
        return '🎙️';
      case 'practice':
        return '📝';
      default:
        return '📖';
    }
  };

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
        className={`fixed ${positionClasses[position]} z-40 flex flex-col items-end gap-2`}
      >
        {/* "Stuck?" nudge — appears above the FAB when user is struggling */}
        {isUserStuck && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="bg-amber-500/15 backdrop-blur-xl border border-amber-500/25 
                       rounded-2xl px-4 py-3 max-w-[220px]
                       shadow-lg shadow-amber-500/10"
          >
            <p className="text-xs text-amber-200/90 leading-relaxed">
              Having trouble? Sheikh can help you break this down step by step.
            </p>
            <button
              onClick={() => dismissStuckPrompt()}
              className="text-[10px] text-gray-500 hover:text-gray-400 mt-1"
            >
              Dismiss
            </button>
          </motion.div>
        )}

        {/* Main FAB */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.93 }}
          onClick={handleClick}
          className={`flex items-center gap-2 
                     px-4 py-3 rounded-2xl
                     font-medium text-sm
                     shadow-lg 
                     transition-shadow duration-300
                     ${
                       isUserStuck
                         ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-orange-500/30 hover:shadow-orange-500/50'
                         : 'bg-gradient-to-r from-amber-600 to-amber-500 text-black shadow-amber-500/25 hover:shadow-amber-500/40'
                     }`}
        >
          <span className="text-base">{getEmoji()}</span>
          <span>{getLabel()}</span>
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
