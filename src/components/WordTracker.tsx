'use client';

import { motion } from 'framer-motion';
import type { WordAlignment } from '@/lib/realtimeTajweedService';

interface WordTrackerProps {
  alignments: WordAlignment[];
  currentWordIndex: number;
  showTranscription?: boolean;
}

/**
 * Visual word tracker for real-time Quran recitation
 * 
 * Displays Arabic verse with word-by-word highlighting:
 * - Green: Correctly matched words
 * - Yellow: Partially matched (close pronunciation)
 * - Red: Missed words
 * - Blue pulse: Currently being recited
 * - Gray: Pending words
 */
export default function WordTracker({
  alignments,
  currentWordIndex,
  showTranscription = false,
}: WordTrackerProps) {
  const getWordStyles = (alignment: WordAlignment, index: number) => {
    const isCurrent = index === currentWordIndex || alignment.status === 'current';
    
    switch (alignment.status) {
      case 'matched':
        return {
          className: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          glow: 'shadow-[0_0_10px_rgba(16,185,129,0.3)]',
        };
      case 'partial':
        return {
          className: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          glow: 'shadow-[0_0_10px_rgba(245,158,11,0.3)]',
        };
      case 'missed':
        return {
          className: 'bg-red-500/20 text-red-400 border-red-500/40 opacity-60',
          glow: '',
        };
      case 'current':
        return {
          className: 'bg-blue-500/30 text-blue-200 border-blue-400',
          glow: 'shadow-[0_0_15px_rgba(59,130,246,0.5)]',
        };
      case 'extra':
        return {
          className: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          glow: '',
        };
      case 'pending':
      default:
        if (isCurrent) {
          return {
            className: 'bg-blue-500/30 text-blue-200 border-blue-400',
            glow: 'shadow-[0_0_15px_rgba(59,130,246,0.5)]',
          };
        }
        return {
          className: 'bg-night-800/30 text-night-400 border-night-700/50',
          glow: '',
        };
    }
  };

  const getStatusEmoji = (status: WordAlignment['status']) => {
    switch (status) {
      case 'matched':
        return '✓';
      case 'partial':
        return '~';
      case 'missed':
        return '✗';
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Word display - RTL Arabic text */}
      <div 
        className="flex flex-wrap gap-2 justify-center p-4 rounded-2xl bg-night-900/30 border border-night-800/50"
        style={{ direction: 'rtl' }}
      >
        {alignments.map((alignment, index) => {
          const { className, glow } = getWordStyles(alignment, index);
          const isCurrent = index === currentWordIndex || alignment.status === 'current';
          const statusEmoji = getStatusEmoji(alignment.status);
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0.5, scale: 0.95 }}
              animate={{ 
                opacity: 1, 
                scale: isCurrent ? 1.05 : 1,
              }}
              transition={{ 
                duration: 0.2,
                type: 'spring',
                stiffness: 300,
                damping: 20,
              }}
              className="relative"
            >
              <span
                className={`
                  inline-block px-3 py-2 rounded-lg border
                  quran-text text-xl sm:text-2xl
                  transition-all duration-200
                  ${className}
                  ${glow}
                  ${isCurrent ? 'ring-2 ring-blue-400/50 ring-offset-2 ring-offset-night-900' : ''}
                `}
              >
                {alignment.expectedWord}
              </span>
              
              {/* Status indicator */}
              {statusEmoji && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`
                    absolute -top-1 -right-1 w-5 h-5 
                    flex items-center justify-center 
                    text-xs rounded-full
                    ${alignment.status === 'matched' ? 'bg-emerald-500 text-white' : ''}
                    ${alignment.status === 'partial' ? 'bg-amber-500 text-white' : ''}
                    ${alignment.status === 'missed' ? 'bg-red-500 text-white' : ''}
                  `}
                >
                  {statusEmoji}
                </motion.span>
              )}
              
              {/* Current word pulse animation */}
              {isCurrent && (
                <motion.span
                  className="absolute inset-0 rounded-lg bg-blue-400/20"
                  animate={{ 
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.02, 1],
                  }}
                  transition={{ 
                    duration: 1,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
      
      {/* Transcription feedback (optional) */}
      {showTranscription && (
        <div className="text-center">
          <p className="text-xs text-night-500 uppercase tracking-wide mb-1">
            What we heard:
          </p>
          <div 
            className="text-night-300 quran-text text-lg"
            style={{ direction: 'rtl' }}
          >
            {alignments
              .filter(a => a.transcribedWord)
              .map(a => a.transcribedWord)
              .join(' ') || (
              <span className="text-night-600 italic text-sm font-sans">
                Listening...
              </span>
            )}
          </div>
        </div>
      )}
      
      {/* Progress indicator */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-night-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-gold-500 to-gold-400"
            initial={{ width: 0 }}
            animate={{ 
              width: `${((currentWordIndex + 1) / alignments.length) * 100}%` 
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
        <span className="text-night-400 text-sm tabular-nums">
          {Math.max(0, currentWordIndex + 1)}/{alignments.length}
        </span>
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 text-xs text-night-500">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500/50" />
          <span>Correct</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-amber-500/30 border border-amber-500/50" />
          <span>Close</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-red-500/30 border border-red-500/50" />
          <span>Missed</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-blue-500/30 border border-blue-400" />
          <span>Current</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Audio level visualizer component
 */
export function AudioLevelIndicator({ 
  level, 
  isActive 
}: { 
  level: number; 
  isActive: boolean;
}) {
  const bars = 12;
  
  return (
    <div 
      className="flex items-end justify-center gap-1 h-8"
      role="status"
      aria-label={`Audio level: ${Math.round(level * 100)}%`}
    >
      {Array.from({ length: bars }).map((_, i) => {
        // Create a wave pattern based on position and level
        const baseHeight = Math.sin((i / bars) * Math.PI) * 0.5 + 0.5;
        const animatedHeight = isActive 
          ? Math.max(0.15, level * baseHeight * (0.8 + Math.random() * 0.4))
          : 0.15;
        
        return (
          <motion.div
            key={i}
            className={`w-1 rounded-full ${
              isActive && level > 0.1 
                ? 'bg-gradient-to-t from-emerald-500 to-emerald-400' 
                : 'bg-night-600'
            }`}
            animate={{
              height: `${animatedHeight * 100}%`,
            }}
            transition={{
              duration: 0.05,
              ease: 'easeOut',
            }}
            style={{ minHeight: '4px' }}
          />
        );
      })}
    </div>
  );
}

/**
 * Error message component for real-time issues
 */
export function RealtimeError({
  error,
  onRetry,
  onFallback,
}: {
  error: string;
  onRetry?: () => void;
  onFallback?: () => void;
}) {
  const isPermissionError = error.toLowerCase().includes('permission') || 
                            error.toLowerCase().includes('denied');
  const isNetworkError = error.toLowerCase().includes('network') ||
                         error.toLowerCase().includes('websocket') ||
                         error.toLowerCase().includes('connection');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-900/20 border border-red-700/30 rounded-xl p-4"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
          <span className="text-red-400">⚠️</span>
        </div>
        <div className="flex-1">
          <h4 className="text-red-300 font-medium mb-1">
            {isPermissionError && 'Microphone Access Required'}
            {isNetworkError && 'Connection Issue'}
            {!isPermissionError && !isNetworkError && 'Something Went Wrong'}
          </h4>
          <p className="text-red-400/80 text-sm mb-3">
            {isPermissionError && 'Please enable microphone access in your browser settings and try again.'}
            {isNetworkError && 'Check your internet connection and try again.'}
            {!isPermissionError && !isNetworkError && error}
          </p>
          <div className="flex gap-2">
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-3 py-1.5 text-sm bg-red-500/20 hover:bg-red-500/30 
                         text-red-300 rounded-lg transition-colors"
              >
                Try Again
              </button>
            )}
            {onFallback && (
              <button
                onClick={onFallback}
                className="px-3 py-1.5 text-sm bg-night-700 hover:bg-night-600 
                         text-night-300 rounded-lg transition-colors"
              >
                Use Standard Mode
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
