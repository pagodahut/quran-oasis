'use client';

/**
 * FeedbackButton — Floating Feedback FAB
 * 
 * A floating action button positioned bottom-left that opens a feedback panel.
 * Complements the Sheikh FAB (bottom-right) for symmetrical UX.
 * 
 * Features:
 * - Subtle pulse animation to draw attention occasionally
 * - Collapses to just icon on scroll (like bottom nav)
 * - Opens a slide-up feedback panel
 * - Tracks if user has given feedback this session
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FeedbackPanel from './FeedbackPanel';

interface FeedbackButtonProps {
  /** Pages where feedback button should appear */
  showOnPages?: string[];
  /** Current page context */
  currentPage?: string;
}

export default function FeedbackButton({
  showOnPages = ['dashboard', 'lesson', 'recite', 'practice', 'mushaf'],
  currentPage = 'dashboard',
}: FeedbackButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [hasGivenFeedback, setHasGivenFeedback] = useState(false);
  const [showPulse, setShowPulse] = useState(false);

  // Check if user has given feedback this session
  useEffect(() => {
    const feedbackGiven = sessionStorage.getItem('feedbackGiven');
    if (feedbackGiven) {
      setHasGivenFeedback(true);
    }
  }, []);

  // Subtle pulse animation after 30 seconds on page (if no feedback given)
  useEffect(() => {
    if (hasGivenFeedback) return;
    
    const timer = setTimeout(() => {
      setShowPulse(true);
      // Stop pulse after 3 cycles
      setTimeout(() => setShowPulse(false), 3000);
    }, 30000);

    return () => clearTimeout(timer);
  }, [hasGivenFeedback, currentPage]);

  // Collapse on scroll (matching bottom nav behavior)
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    setIsCompact(scrollY > 100);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Don't show on pages not in the list
  if (!showOnPages.includes(currentPage)) return null;

  // Don't show if panel is open (panel handles closing)
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  
  const handleFeedbackSubmit = () => {
    setHasGivenFeedback(true);
    sessionStorage.setItem('feedbackGiven', 'true');
    setIsOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
            className="fixed bottom-20 left-4 z-40"
          >
            {/* Pulse ring animation */}
            {showPulse && (
              <motion.div
                className="absolute inset-0 rounded-2xl bg-blue-400/30"
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1, repeat: 3, ease: 'easeOut' }}
              />
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.93 }}
              onClick={handleOpen}
              className={`flex items-center gap-2 
                         rounded-2xl font-medium text-sm
                         shadow-lg transition-all duration-300
                         bg-white/10 backdrop-blur-xl 
                         border border-white/20
                         text-white/90 
                         shadow-black/20 hover:shadow-black/30
                         hover:bg-white/15
                         ${isCompact ? 'p-3' : 'px-4 py-3'}`}
            >
              <span className="text-base">💬</span>
              <AnimatePresence mode="wait">
                {!isCompact && (
                  <motion.span
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 'auto', opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    Feedback
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Panel */}
      <FeedbackPanel
        isOpen={isOpen}
        onClose={handleClose}
        onSubmit={handleFeedbackSubmit}
        currentPage={currentPage}
      />
    </>
  );
}
