'use client';
import { MosqueIcon, BookReadIcon } from '@/components/icons';

/**
 * SheikhChat V2 — Context-Aware AI Quran Teacher Panel
 * 
 * Now integrates with SheikhContext for automatic awareness of:
 * - Current ayah/surah the user is studying
 * - Which page they're on (mushaf, lesson, recite, practice)
 * - User level (beginner/intermediate/advanced)
 * - Pending questions (auto-sent when panel opens)
 * 
 * Features:
 * - Streaming responses with real-time text
 * - Suggested question chips (contextual to current ayah/page)
 * - Auto-sends pending question from SheikhContext
 * - Glass morphism overlay that preserves underlying page
 * - Drag handle to close panel
 * - Arabic text detection with RTL rendering
 * - Mobile-first responsive layout
 * 
 * Usage (standalone — reads context from SheikhProvider):
 *   <SheikhChat />
 * 
 * Usage (with overrides):
 *   <SheikhChat ayahContext={...} userLevel="intermediate" />
 */

import { useState, useRef, useEffect, useCallback, type FormEvent, type KeyboardEvent } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimation, PanInfo } from 'framer-motion';
import { useSheikhChat, type AyahContext, type ChatMessage } from '@/hooks/useSheikhChat';
import { useSheikh } from '@/contexts/SheikhContext';
import { usePremium } from '@/contexts/PremiumContext';
import { PremiumUpgradeModal } from '@/components/PremiumGate';

// ─── Props ───────────────────────────────────────────────────────────
interface SheikhChatProps {
  /** Override ayah context (if not using SheikhContext) */
  ayahContext?: AyahContext;
  /** Override user level */
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
  /** Override open state (if not using SheikhContext) */
  isOpen?: boolean;
  /** Override close handler */
  onClose?: () => void;
  /** Display mode */
  mode?: 'panel' | 'fullpage' | 'inline';
}

// ─── Arabic Text Detection ───────────────────────────────────────────
function containsArabic(text: string): boolean {
  return /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
}

// ─── Simple Markdown-lite Renderer ───────────────────────────────────
function renderMessageContent(content: string): JSX.Element[] {
  const lines = content.split('\n');

  return lines.map((line, i) => {
    if (!line.trim()) return <br key={i} />;

    const parts: JSX.Element[] = [];
    let remaining = line;
    let keyIdx = 0;

    // Bold: **text**
    while (remaining.includes('**')) {
      const startIdx = remaining.indexOf('**');
      const endIdx = remaining.indexOf('**', startIdx + 2);
      if (endIdx === -1) break;

      if (startIdx > 0) {
        const beforeText = remaining.slice(0, startIdx);
        parts.push(
          <span key={`${i}-${keyIdx++}`} className={containsArabic(beforeText) ? 'font-arabic text-right dir-rtl' : ''}>
            {beforeText}
          </span>
        );
      }

      const boldText = remaining.slice(startIdx + 2, endIdx);
      parts.push(
        <strong key={`${i}-${keyIdx++}`} className={`font-semibold ${containsArabic(boldText) ? 'font-arabic text-right dir-rtl' : ''}`}>
          {boldText}
        </strong>
      );

      remaining = remaining.slice(endIdx + 2);
    }

    if (remaining) {
      parts.push(
        <span key={`${i}-${keyIdx++}`} className={containsArabic(remaining) ? 'font-arabic text-right dir-rtl text-lg leading-loose' : ''}>
          {remaining}
        </span>
      );
    }

    return (
      <p key={i} className={`mb-1.5 last:mb-0 ${containsArabic(line) ? 'text-right dir-rtl' : ''}`}>
        {parts.length > 0 ? parts : line}
      </p>
    );
  });
}

// ─── Avatar Icons ────────────────────────────────────────────────────
function UserIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
      <circle cx="12" cy="8" r="4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SheikhIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      {/* Crescent moon */}
      <path
        d="M16 4C14.2 5.2 13 7.4 13 10C13 12.6 14.2 14.8 16 16C14.4 16.8 12.5 17 10.8 16.1C9.1 15.2 7.8 13.5 7.4 11.5C7 9.5 7.5 7.4 8.8 5.8C10.1 4.2 12 3.2 14.1 3.2C14.8 3.2 15.4 3.5 16 4Z"
        fill="currentColor"
        opacity="0.8"
      />
      {/* Star */}
      <path
        d="M18.5 6L19 7.5L20.5 7.5L19.3 8.4L19.7 9.9L18.5 9L17.3 9.9L17.7 8.4L16.5 7.5L18 7.5Z"
        fill="currentColor"
      />
      {/* Book pages */}
      <path
        d="M5 19V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14l-7-3-7 3z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}

// ─── Message Bubble ──────────────────────────────────────────────────
function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
          isUser ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gold-500/20 text-gold-400'
        }`}
      >
        {isUser ? <UserIcon className="w-4 h-4" /> : <SheikhIcon className="w-4 h-4" />}
      </div>

      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-emerald-600/30 text-emerald-50 backdrop-blur-sm border border-emerald-500/20 rounded-br-md'
            : 'bg-white/5 text-night-100 backdrop-blur-sm border border-white/10 rounded-bl-md'
        }`}
      >
        {message.content ? (
          <div className="space-y-0.5">{renderMessageContent(message.content)}</div>
        ) : message.isStreaming ? (
          <div className="flex items-center gap-1.5 py-1">
            <motion.div className="w-1.5 h-1.5 bg-gold-400 rounded-full" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0 }} />
            <motion.div className="w-1.5 h-1.5 bg-gold-400 rounded-full" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }} />
            <motion.div className="w-1.5 h-1.5 bg-gold-400 rounded-full" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }} />
          </div>
        ) : null}

        {message.isStreaming && message.content && (
          <motion.span
            className="inline-block w-0.5 h-4 bg-gold-400 ml-0.5 align-middle"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}
      </div>
    </motion.div>
  );
}

// ─── Suggested Question Chip ─────────────────────────────────────────
function QuestionChip({ question, onClick, delay }: { question: string; onClick: () => void; delay: number }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="px-3.5 py-2 rounded-xl text-xs text-gold-200/90 bg-gold-500/10 
                 border border-gold-500/20 backdrop-blur-sm
                 hover:bg-gold-500/20 hover:border-gold-500/30
                 active:bg-gold-500/30
                 transition-colors duration-200 text-left"
    >
      {question}
    </motion.button>
  );
}

// ─── Main Component ──────────────────────────────────────────────────
export default function SheikhChat({
  ayahContext: ayahContextProp,
  userLevel: userLevelProp,
  isOpen: isOpenProp,
  onClose: onCloseProp,
  mode = 'panel',
}: SheikhChatProps) {
  // Read from context (with prop overrides)
  const sheikh = useSheikh();

  const ayahContext = ayahContextProp ?? sheikh.ayahContext;
  const userLevel = userLevelProp ?? sheikh.userLevel;
  const isOpen = isOpenProp ?? sheikh.isSheikhOpen;
  const onClose = onCloseProp ?? sheikh.closeSheikh;
  const { pendingQuestion, clearPendingQuestion, pageContext } = sheikh;

  // Premium gating
  const premium = usePremium();
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const {
    messages,
    sendMessage: rawSendMessage,
    isLoading,
    error,
    clearChat,
    suggestedQuestions,
    stopStreaming,
  } = useSheikhChat({ ayahContext, userLevel, pageContext });

  // Wrap sendMessage with premium gate
  const sendMessage = (msg: string) => {
    if (!premium.canUsePremiumFeature('sheikh')) {
      setShowPremiumModal(true);
      return;
    }
    premium.incrementInteraction();
    rawSendMessage(msg);
  };

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pendingQuestionSent = useRef(false);

  // Auto-scroll on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Escape key to close + body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        e.preventDefault();
        onClose();
      }
    };

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
    // Reset pending question tracking when panel opens/closes
    if (!isOpen) {
      pendingQuestionSent.current = false;
    }
  }, [isOpen]);

  // Auto-send pending question from context
  useEffect(() => {
    if (
      isOpen &&
      pendingQuestion &&
      !pendingQuestionSent.current &&
      !isLoading &&
      messages.length === 0
    ) {
      pendingQuestionSent.current = true;
      sendMessage(pendingQuestion);
      clearPendingQuestion();
    }
  }, [isOpen, pendingQuestion, isLoading, messages.length, sendMessage, clearPendingQuestion]);

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    sendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // ─── Context-Aware Subtitle ────────────────────────────────────
  const getSubtitle = (): string => {
    if (ayahContext) {
      return `${ayahContext.surahName} · Ayah ${ayahContext.ayahNumber}`;
    }
    switch (pageContext.page) {
      case 'lesson':
        return pageContext.lessonTitle || 'Lesson Mode';
      case 'recite':
        return 'Recitation Mode';
      case 'practice':
        return 'Practice Mode';
      default:
        return 'Your AI Quran Teacher';
    }
  };

  // ─── Context-Aware Welcome Message ─────────────────────────────
  const getWelcomeMessage = (): string => {
    if (ayahContext) {
      return `Ask me anything about ${ayahContext.surahName}, Ayah ${ayahContext.ayahNumber} — meaning, tajweed, grammar, or memorization tips.`;
    }
    switch (pageContext.page) {
      case 'lesson':
        return "I can help you understand and memorize what you're learning. Ask about meaning, pronunciation, or memorization techniques.";
      case 'recite':
        return "I can help with tajweed rules, pronunciation tips, and explain any recitation challenges you're facing.";
      case 'practice':
        return "Need help with your review? I can quiz you, explain meanings, or help you strengthen weak areas.";
      default:
        return "I'm your personal Quran teacher. Ask me anything about the Quran — tafsir, tajweed, Arabic, or memorization.";
    }
  };

  if (!isOpen) return null;

  return (
    <>
    {/* Full-screen backdrop — always clickable to close */}
    {mode === 'panel' && onClose && (
      <motion.div
        key="sheikh-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[49]"
        style={{ background: 'rgba(6,9,14,0.72)', backdropFilter: 'blur(14px) saturate(130%)', WebkitBackdropFilter: 'blur(14px) saturate(130%)' }}
        onClick={onClose}
      />
    )}

    <AnimatePresence>
      <motion.div
        initial={mode === 'inline' ? {} : { y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        drag={mode === 'panel' ? 'y' : false}
        dragConstraints={{ top: 0 }}
        dragElastic={0.2}
        onDragEnd={(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
          if (info.offset.y > 100 || info.velocity.y > 500) {
            onClose?.();
          }
        }}
        className={`${
          mode === 'panel' ? 'fixed bottom-0 left-0 right-0 z-50 max-h-[85vh]' :
          mode === 'fullpage' ? 'fixed inset-0 z-50' :
          'relative w-full'
        } flex flex-col`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheikh-chat-title"
        aria-describedby="sheikh-chat-subtitle"
      >

        {/* Chat Container */}
        <div
          className={`relative flex flex-col overflow-hidden
                      ${mode === 'panel' ? 'rounded-t-3xl max-h-[85vh]' : ''}
                      ${mode === 'fullpage' ? 'h-full' : ''}
                      ${mode === 'inline' ? 'rounded-2xl max-h-[500px]' : ''}`}
          style={{
            background: 'linear-gradient(180deg, rgba(18,24,32,0.97) 0%, rgba(12,16,24,0.99) 100%)',
            backdropFilter: 'blur(56px) saturate(185%) brightness(0.95)',
            WebkitBackdropFilter: 'blur(56px) saturate(185%) brightness(0.95)',
            borderTop: mode === 'panel' ? '1px solid rgba(255,255,255,0.08)' : undefined,
            border: mode === 'inline' ? '1px solid rgba(255,255,255,0.07)' : undefined,
            boxShadow: mode === 'panel'
              ? '0 -1px 0 rgba(255,255,255,0.07), 0 -4px 32px rgba(0,0,0,0.28), 0 0 80px rgba(201,162,39,0.04), inset 0 1px 0 rgba(255,255,255,0.10)'
              : undefined,
          }}
        >
          {/* Top-edge prismatic highlight */}
          {mode === 'panel' && (
            <span aria-hidden="true" className="pointer-events-none absolute top-0 left-[5%] right-[5%] h-px z-10"
              style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 15%, rgba(255,255,255,0.20) 40%, rgba(244,212,124,0.16) 50%, rgba(255,255,255,0.20) 60%, rgba(255,255,255,0.06) 85%, transparent 100%)' }}
            />
          )}
          {/* SVG noise grain */}
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1]"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.80' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", opacity: 0.038, mixBlendMode: 'overlay' as const }}
          />
          {/* Drag handle — tappable close target */}
          {mode === 'panel' && onClose && (
            <button
              onClick={onClose}
              className="w-full py-2 flex justify-center cursor-pointer focus:outline-none"
              aria-label="Close Sheikh chat panel"
            >
              <div className="w-10 h-1 bg-white/25 rounded-full" />
            </button>
          )}

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5">

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gold-500/15 flex items-center justify-center">
                <MosqueIcon size={20} aria-hidden="true" />
              </div>
              <div>
                <h3 id="sheikh-chat-title" className="text-sm font-semibold text-white">Sheikh HIFZ</h3>
                <p id="sheikh-chat-subtitle" className="text-[11px] text-gold-400/70">{getSubtitle()}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="text-[11px] text-night-500 hover:text-night-300 transition-colors px-2 py-1 rounded-lg hover:bg-white/5 focus:ring-2 focus:ring-gold-500/50 focus:outline-none"
                  aria-label="Clear chat conversation"
                >
                  Clear
                </button>
              )}
              {onClose && (
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-night-400 hover:text-white hover:bg-white/10 transition-all focus:ring-2 focus:ring-gold-500/50 focus:outline-none"
                  aria-label="Close Sheikh chat"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div
            className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-[200px] scroll-smooth"
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}
            role="log"
            aria-live="polite"
            aria-label="Chat conversation with Sheikh AI"
          >
            {/* Welcome State */}
            {messages.length === 0 && !pendingQuestion && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center text-center py-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center mb-4 border border-gold-500/20">
                  <MosqueIcon size={32} />
                </div>
                <h4 className="text-base font-semibold text-white mb-1.5">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </h4>
                <p className="text-sm text-night-400 mb-6 max-w-xs">
                  {getWelcomeMessage()}
                </p>

                <div className="flex flex-wrap gap-2 justify-center max-w-sm">
                  {suggestedQuestions.map((q, i) => (
                    <QuestionChip
                      key={q}
                      question={q}
                      onClick={() => sendMessage(q)}
                      delay={i * 0.08}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Message Bubbles */}
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto max-w-xs text-center py-2 px-4 rounded-xl bg-red-500/10 border border-red-500/20"
              >
                <p className="text-xs text-red-300">{error}</p>
                <button
                  onClick={() => {
                    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
                    if (lastUserMsg) sendMessage(lastUserMsg.content);
                  }}
                  className="text-xs text-red-400 hover:text-red-300 underline mt-1 focus:ring-2 focus:ring-red-500/50 focus:outline-none rounded"
                  aria-label="Retry the last message"
                >
                  Try again
                </button>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-white/[0.06] px-4 py-3" style={{ background: 'rgba(14,18,26,0.80)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
            {isLoading && (
              <div className="flex justify-center mb-2">
                <button
                  onClick={stopStreaming}
                  className="text-[11px] text-night-400 hover:text-white px-3 py-1 rounded-full 
                             border border-white/10 hover:border-white/20 hover:bg-white/5
                             transition-all duration-200 focus:ring-2 focus:ring-gold-500/50 focus:outline-none"
                  aria-label="Stop AI response generation"
                >
                  ■ Stop
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex items-end gap-2">
              <div className="flex-1 relative">
                <label htmlFor="sheikh-input" className="sr-only">
                  Ask Sheikh HIFZ a question
                </label>
                <textarea
                  id="sheikh-input"
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    ayahContext
                      ? 'Ask about this ayah...'
                      : pageContext.page === 'recite'
                      ? 'Ask about tajweed...'
                      : 'Ask the sheikh anything...'
                  }
                  rows={1}
                  className="w-full resize-none rounded-xl bg-white/5 border border-white/10 
                             text-sm text-white placeholder-night-500 
                             px-4 py-2.5 pr-10
                             focus:outline-none focus:border-gold-500/40 focus:bg-white/[0.07]
                             transition-colors duration-200
                             max-h-24 overflow-y-auto"
                  style={{ scrollbarWidth: 'none' }}
                  disabled={isLoading}
                  aria-describedby="sheikh-help"
                />
                <p id="sheikh-help" className="sr-only">
                  Type your question and press Enter to send, or Shift+Enter for a new line
                </p>
              </div>

              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
                           transition-all duration-200 focus:ring-2 focus:ring-gold-500/50 focus:outline-none
                           ${
                             inputValue.trim() && !isLoading
                               ? 'bg-gold-500 text-black hover:bg-gold-400 active:scale-95'
                               : 'bg-white/5 text-night-600 cursor-not-allowed'
                           }`}
                aria-label="Send message"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              </button>
            </form>

            <p className="text-[10px] text-night-600 text-center mt-2">
              AI-powered guidance · Always verify with qualified scholars
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>

    {/* Premium Upgrade Modal */}
    <PremiumUpgradeModal
      isOpen={showPremiumModal}
      onClose={() => setShowPremiumModal(false)}
      feature="sheikh"
      usedCount={premium.sheikInteractionsToday}
      maxCount={premium.maxFreeInteractions}
    />
    </>
  );
}
