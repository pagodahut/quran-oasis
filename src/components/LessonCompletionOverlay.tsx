'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, X, Share2 } from 'lucide-react';
import ShareButton from './ShareButton';

interface LessonCompletionOverlayProps {
  lessonId: string | null;
  lessonTitle?: string;
  onClose: () => void;
}

export default function LessonCompletionOverlay({
  lessonId,
  lessonTitle,
  onClose,
}: LessonCompletionOverlayProps) {
  const [show, setShow] = useState(!!lessonId);

  useEffect(() => {
    setShow(!!lessonId);
  }, [lessonId]);

  if (!lessonId || !show) return null;

  const title = lessonTitle || `Lesson ${lessonId.replace('lesson-', '')}`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-night-950/90 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="relative w-full max-w-sm bg-gradient-to-b from-night-900 to-night-950 rounded-3xl border border-gold-500/20 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={() => {
              setShow(false);
              onClose();
            }}
            className="absolute top-4 right-4 p-2 hover:bg-night-800 rounded-lg transition-colors z-10"
          >
            <X className="w-5 h-5 text-night-400" />
          </button>

          {/* Decorative top */}
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-gold-500/10 to-transparent" />

          <div className="relative p-8 pt-12 text-center">
            {/* Trophy icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', damping: 15 }}
              className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 flex items-center justify-center shadow-2xl"
              style={{
                boxShadow: '0 0 60px rgba(201, 162, 39, 0.4), 0 20px 40px rgba(0, 0, 0, 0.3)',
              }}
            >
              <Trophy className="w-12 h-12 text-night-950" />
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-night-100 mb-2">
                Lesson Complete! 🎉
              </h2>
              <p className="text-night-400 mb-6">
                Mashallah! You completed <span className="text-gold-400 font-medium">{title}</span>
              </p>

              {/* Stars */}
              <div className="flex justify-center gap-2 mb-8">
                {[1, 2, 3].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
                  >
                    <Star className="w-8 h-8 text-gold-400 fill-gold-400" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-3"
            >
              {/* Share Button */}
              <ShareButton
                type="lesson"
                lessonId={lessonId}
                lessonTitle={title}
                className="w-full justify-center py-3"
              />

              {/* Continue Button */}
              <button
                onClick={() => {
                  setShow(false);
                  onClose();
                }}
                className="w-full py-3 px-6 rounded-xl bg-gold-500 hover:bg-gold-400 text-night-950 font-semibold transition-colors"
              >
                Continue Learning
              </button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
