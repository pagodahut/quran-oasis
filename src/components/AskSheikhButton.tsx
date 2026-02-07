'use client';

/**
 * AskSheikhButton
 * 
 * Floating action button that appears on any page with Quran content.
 * Tapping it opens the SheikhChat panel with the current ayah context.
 * 
 * This is the primary entry point to the AI teacher feature.
 * 
 * Usage:
 *   <AskSheikhButton
 *     ayahContext={{ surahNumber: 1, surahName: 'Al-Fatiha', ... }}
 *     userLevel="beginner"
 *   />
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SheikhChat from './SheikhChat';
import type { AyahContext } from '@/hooks/useSheikhChat';

interface AskSheikhButtonProps {
  ayahContext?: AyahContext;
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
  position?: 'bottom-right' | 'bottom-center';
}

export default function AskSheikhButton({
  ayahContext,
  userLevel = 'beginner',
  position = 'bottom-right',
}: AskSheikhButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const positionClasses = {
    'bottom-right': 'bottom-20 right-4',
    'bottom-center': 'bottom-20 left-1/2 -translate-x-1/2',
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className={`fixed ${positionClasses[position]} z-40
                       flex items-center gap-2 
                       px-4 py-3 rounded-2xl
                       bg-gradient-to-r from-amber-600 to-amber-500
                       text-black font-medium text-sm
                       shadow-lg shadow-amber-500/25
                       hover:shadow-amber-500/40
                       transition-shadow duration-300`}
          >
            <span className="text-base">📖</span>
            <span>Ask Sheikh</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <SheikhChat
            ayahContext={ayahContext}
            userLevel={userLevel}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            mode="panel"
          />
        )}
      </AnimatePresence>
    </>
  );
}
