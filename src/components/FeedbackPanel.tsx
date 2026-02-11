'use client';

/**
 * FeedbackPanel — Slide-up Feedback Collection Panel
 * 
 * A modal/drawer that slides up from the bottom to collect user feedback.
 * Matches the app's liquid glass aesthetic.
 * 
 * Features:
 * - Star rating (1-5)
 * - Quick reaction buttons (emoji-based)
 * - Optional text feedback
 * - Page context for targeted improvements
 * - Smooth slide-up animation with backdrop
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedbackPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  currentPage: string;
}

type FeedbackType = 'love' | 'confused' | 'suggestion' | 'bug';

const QUICK_REACTIONS: { type: FeedbackType; emoji: string; label: string }[] = [
  { type: 'love', emoji: '💚', label: 'Love it' },
  { type: 'confused', emoji: '😕', label: 'Confused' },
  { type: 'suggestion', emoji: '💡', label: 'Suggestion' },
  { type: 'bug', emoji: '🐛', label: 'Bug' },
];

export default function FeedbackPanel({
  isOpen,
  onClose,
  onSubmit,
  currentPage,
}: FeedbackPanelProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [selectedReaction, setSelectedReaction] = useState<FeedbackType | null>(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!rating && !selectedReaction && !message.trim()) {
      // Need at least something
      return;
    }

    setIsSubmitting(true);

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          reaction: selectedReaction,
          message: message.trim(),
          page: currentPage,
          timestamp: new Date().toISOString(),
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        }),
      });

      setSubmitted(true);
      setTimeout(() => {
        onSubmit();
        // Reset state for next time
        setRating(null);
        setSelectedReaction(null);
        setMessage('');
        setSubmitted(false);
      }, 1500);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      // Still close and mark as submitted for UX
      onSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 
                       bg-gray-900/95 backdrop-blur-xl 
                       border-t border-white/10
                       rounded-t-3xl
                       max-h-[85vh] overflow-y-auto
                       shadow-2xl shadow-black/50"
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>

            <div className="px-6 pb-8">
              {submitted ? (
                /* Success State */
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12"
                >
                  <span className="text-5xl mb-4">🤲</span>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    JazakAllah Khair!
                  </h3>
                  <p className="text-gray-400 text-center">
                    Your feedback helps us improve the experience.
                  </p>
                </motion.div>
              ) : (
                <>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        Share Feedback
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        Help us improve your learning experience
                      </p>
                    </div>
                    <button
                      onClick={handleClose}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                      aria-label="Close"
                    >
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Star Rating */}
                  <div className="mb-6">
                    <p className="text-sm text-gray-300 mb-3">How's your experience?</p>
                    <div className="flex gap-2 justify-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setRating(star)}
                          className="p-2 transition-colors"
                        >
                          <span className={`text-3xl ${
                            rating && star <= rating 
                              ? 'grayscale-0' 
                              : 'grayscale opacity-40'
                          } transition-all`}>
                            ⭐
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Reactions */}
                  <div className="mb-6">
                    <p className="text-sm text-gray-300 mb-3">What's on your mind?</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {QUICK_REACTIONS.map(({ type, emoji, label }) => (
                        <motion.button
                          key={type}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedReaction(
                            selectedReaction === type ? null : type
                          )}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl
                                     border transition-all
                                     ${selectedReaction === type
                                       ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
                                       : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                                     }`}
                        >
                          <span>{emoji}</span>
                          <span className="text-sm">{label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Text Input */}
                  <div className="mb-6">
                    <label className="block text-sm text-gray-300 mb-2">
                      Tell us more (optional)
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={
                        selectedReaction === 'bug'
                          ? "What went wrong? Steps to reproduce help us fix it faster..."
                          : selectedReaction === 'suggestion'
                          ? "What would make this better for you?"
                          : selectedReaction === 'confused'
                          ? "What was confusing? We'll work on making it clearer..."
                          : "Share your thoughts..."
                      }
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl
                                bg-white/5 border border-white/10
                                text-white placeholder:text-gray-500
                                focus:outline-none focus:ring-2 focus:ring-amber-500/50
                                resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={isSubmitting || (!rating && !selectedReaction && !message.trim())}
                    className={`w-full py-4 rounded-2xl font-semibold text-base
                               transition-all shadow-lg
                               ${(rating || selectedReaction || message.trim())
                                 ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-black shadow-amber-500/25'
                                 : 'bg-white/10 text-gray-500 cursor-not-allowed'
                               }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      'Send Feedback'
                    )}
                  </motion.button>

                  {/* Privacy note */}
                  <p className="text-xs text-gray-500 text-center mt-4">
                    Feedback is anonymous and helps us improve the app.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
