'use client';

/**
 * FeedbackPanel — Slide-up Feedback Collection Panel
 * 
 * A modal/drawer that slides up from the bottom to collect user feedback.
 * Features: category selector, text input, auto-captured URL, success animation.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedbackPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  currentPage: string;
}

type FeedbackCategory = 'bug' | 'feature' | 'general';

const CATEGORIES: { type: FeedbackCategory; emoji: string; label: string }[] = [
  { type: 'bug', emoji: '🐛', label: 'Bug Report' },
  { type: 'feature', emoji: '💡', label: 'Feature Request' },
  { type: 'general', emoji: '💬', label: 'General' },
];

export default function FeedbackPanel({
  isOpen,
  onClose,
  onSubmit,
  currentPage,
}: FeedbackPanelProps) {
  const [category, setCategory] = useState<FeedbackCategory>('general');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [pageUrl, setPageUrl] = useState('');

  // Auto-capture current page URL
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      setPageUrl(window.location.href);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!message.trim()) return;

    setIsSubmitting(true);

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          message: message.trim(),
          pageUrl,
          page: currentPage,
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        }),
      });

      setSubmitted(true);
      setTimeout(() => {
        onSubmit();
        setCategory('general');
        setMessage('');
        setSubmitted(false);
      }, 1800);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      onSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) onClose();
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
                       bg-night-900/95 backdrop-blur-xl 
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
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12"
                >
                  <motion.span
                    className="text-5xl mb-4"
                    initial={{ rotate: -20 }}
                    animate={{ rotate: 0 }}
                    transition={{ type: 'spring', damping: 8 }}
                  >
                    🤲
                  </motion.span>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    JazakAllah Khair!
                  </h3>
                  <p className="text-night-400 text-center">
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
                      <p className="text-sm text-night-400 mt-1">
                        Help us improve your learning experience
                      </p>
                    </div>
                    <button
                      onClick={handleClose}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                      aria-label="Close"
                    >
                      <svg className="w-5 h-5 text-night-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Category Selector */}
                  <div className="mb-5">
                    <p className="text-sm text-night-300 mb-3">Category</p>
                    <div className="flex gap-2">
                      {CATEGORIES.map(({ type, emoji, label }) => (
                        <motion.button
                          key={type}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCategory(type)}
                          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl
                                     border transition-all text-sm
                                     ${category === type
                                       ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
                                       : 'bg-white/5 border-white/10 text-night-300 hover:bg-white/10'
                                     }`}
                        >
                          <span>{emoji}</span>
                          <span>{label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Text Input */}
                  <div className="mb-5">
                    <label className="block text-sm text-night-300 mb-2">
                      {category === 'bug' ? 'What went wrong?' :
                       category === 'feature' ? 'What would you like to see?' :
                       'Your feedback'}
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={
                        category === 'bug'
                          ? "Describe the issue and steps to reproduce..."
                          : category === 'feature'
                          ? "Describe the feature you'd like..."
                          : "Share your thoughts..."
                      }
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl
                                bg-white/5 border border-white/10
                                text-white placeholder:text-night-500
                                focus:outline-none focus:ring-2 focus:ring-amber-500/50
                                resize-none"
                      autoFocus
                    />
                  </div>

                  {/* Page URL indicator */}
                  <div className="mb-6 flex items-center gap-2 text-xs text-night-500">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span className="truncate">Page: {currentPage}</span>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={isSubmitting || !message.trim()}
                    className={`w-full py-4 rounded-2xl font-semibold text-base
                               transition-all shadow-lg
                               ${message.trim()
                                 ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-black shadow-amber-500/25'
                                 : 'bg-white/10 text-night-500 cursor-not-allowed'
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

                  <p className="text-xs text-night-500 text-center mt-4">
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
