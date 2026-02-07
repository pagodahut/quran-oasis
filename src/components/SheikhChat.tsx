'use client';

/**
 * SheikhChat Component
 * 
 * The AI Quran Teacher chat interface. This is the V1 killer feature.
 * 
 * Features:
 * - Streaming responses with real-time text appearance
 * - Suggested question chips for quick starts
 * - Beautiful Islamic-inspired glass morphism design
 * - Auto-scroll during streaming
 * - Markdown-lite rendering (bold, Arabic text detection)
 * - Mobile-first responsive layout
 * - Slide-up panel or full-page mode
 * 
 * Usage:
 *   <SheikhChat
 *     ayahContext={{ surahNumber: 1, surahName: 'Al-Fatiha', ... }}
 *     userLevel="beginner"
 *   />
 */

import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSheikhChat, type AyahContext, type ChatMessage } from '@/hooks/useSheikhChat';

// ─── Props ───────────────────────────────────────────────────────────
interface SheikhChatProps {
  ayahContext?: AyahContext;
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
  isOpen?: boolean;
  onClose?: () => void;
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

    // Process inline formatting
    const parts: JSX.Element[] = [];
    let remaining = line;
    let keyIdx = 0;

    // Bold: **text**
    while (remaining.includes('**')) {
      const startIdx = remaining.indexOf('**');
      const endIdx = remaining.indexOf('**', startIdx + 2);

      if (endIdx === -1) break;

      // Text before bold
      if (startIdx > 0) {
        const beforeText = remaining.slice(0, startIdx);
        parts.push(
          <span key={`${i}-${keyIdx++}`} className={containsArabic(beforeText) ? 'font-arabic text-right dir-rtl' : ''}>
            {beforeText}
          </span>
        );
      }

      // Bold text
      const boldText = remaining.slice(startIdx + 2, endIdx);
      parts.push(
        <strong key={`${i}-${keyIdx++}`} className={`font-semibold ${containsArabic(boldText) ? 'font-arabic text-right dir-rtl' : ''}`}>
          {boldText}
        </strong>
      );

      remaining = remaining.slice(endIdx + 2);
    }

    // Remaining text
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
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
          isUser
            ? 'bg-emerald-500/20 text-emerald-400'
            : 'bg-amber-500/20 text-amber-400'
        }`}
      >
        {isUser ? '👤' : '📖'}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-emerald-600/30 text-emerald-50 backdrop-blur-sm border border-emerald-500/20 rounded-br-md'
            : 'bg-white/5 text-gray-100 backdrop-blur-sm border border-white/10 rounded-bl-md'
        }`}
      >
        {message.content ? (
          <div className="space-y-0.5">{renderMessageContent(message.content)}</div>
        ) : message.isStreaming ? (
          <div className="flex items-center gap-1.5 py-1">
            <motion.div
              className="w-1.5 h-1.5 bg-amber-400 rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="w-1.5 h-1.5 bg-amber-400 rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="w-1.5 h-1.5 bg-amber-400 rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        ) : null}

        {/* Streaming cursor */}
        {message.isStreaming && message.content && (
          <motion.span
            className="inline-block w-0.5 h-4 bg-amber-400 ml-0.5 align-middle"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}
      </div>
    </motion.div>
  );
}

// ─── Suggested Question Chip ─────────────────────────────────────────
function QuestionChip({
  question,
  onClick,
  delay,
}: {
  question: string;
  onClick: () => void;
  delay: number;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="px-3.5 py-2 rounded-xl text-xs text-amber-200/90 bg-amber-500/10 
                 border border-amber-500/20 backdrop-blur-sm
                 hover:bg-amber-500/20 hover:border-amber-500/30
                 active:bg-amber-500/30
                 transition-colors duration-200 text-left"
    >
      {question}
    </motion.button>
  );
}

// ─── Main Component ──────────────────────────────────────────────────
export default function SheikhChat({
  ayahContext,
  userLevel = 'beginner',
  isOpen = true,
  onClose,
  mode = 'panel',
}: SheikhChatProps) {
  const {
    messages,
    sendMessage,
    isLoading,
    error,
    clearChat,
    suggestedQuestions,
    stopStreaming,
  } = useSheikhChat({ ayahContext, userLevel });

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

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

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  // ─── Wrapper Styles ──────────────────────────────────────────────
  const wrapperClasses = {
    panel: 'fixed bottom-0 left-0 right-0 z-50 max-h-[85vh]',
    fullpage: 'fixed inset-0 z-50',
    inline: 'relative w-full',
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={mode === 'inline' ? {} : { y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className={`${wrapperClasses[mode]} flex flex-col`}
      >
        {/* Backdrop for panel mode */}
        {mode === 'panel' && onClose && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 -top-[100vh] bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
        )}

        {/* Chat Container */}
        <div
          className={`relative flex flex-col bg-gradient-to-b from-gray-900/95 to-gray-950/98 
                      backdrop-blur-xl border-t border-white/10 
                      ${mode === 'panel' ? 'rounded-t-3xl max-h-[85vh]' : ''}
                      ${mode === 'fullpage' ? 'h-full' : ''}
                      ${mode === 'inline' ? 'rounded-2xl border border-white/10 max-h-[500px]' : ''}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5">
            {/* Drag handle for panel mode */}
            {mode === 'panel' && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-white/20 rounded-full" />
            )}

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-500/15 flex items-center justify-center">
                <span className="text-lg">📖</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Sheikh HIFZ</h3>
                <p className="text-[11px] text-amber-400/70">
                  {ayahContext
                    ? `${ayahContext.surahName} · Ayah ${ayahContext.ayahNumber}`
                    : 'Your AI Quran Teacher'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="text-[11px] text-gray-500 hover:text-gray-300 transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
                >
                  Clear
                </button>
              )}
              {onClose && (
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-[200px] scroll-smooth"
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}
          >
            {/* Welcome State */}
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center text-center py-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-4 border border-amber-500/20">
                  <span className="text-3xl">🕌</span>
                </div>
                <h4 className="text-base font-semibold text-white mb-1.5">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </h4>
                <p className="text-sm text-gray-400 mb-6 max-w-xs">
                  {ayahContext
                    ? `Ask me anything about ${ayahContext.surahName}, Ayah ${ayahContext.ayahNumber} — meaning, tajweed, grammar, or memorization tips.`
                    : "I'm your personal Quran teacher. Ask me anything about the Quran — tafsir, tajweed, Arabic, or memorization."}
                </p>

                {/* Suggested Questions */}
                <div className="flex flex-wrap gap-2 justify-center max-w-sm">
                  {suggestedQuestions.map((q, i) => (
                    <QuestionChip
                      key={q}
                      question={q}
                      onClick={() => handleSuggestedQuestion(q)}
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
                  className="text-xs text-red-400 hover:text-red-300 underline mt-1"
                >
                  Try again
                </button>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-white/5 px-4 py-3 bg-black/20">
            {/* Streaming stop button */}
            {isLoading && (
              <div className="flex justify-center mb-2">
                <button
                  onClick={stopStreaming}
                  className="text-[11px] text-gray-400 hover:text-white px-3 py-1 rounded-full 
                             border border-white/10 hover:border-white/20 hover:bg-white/5
                             transition-all duration-200"
                >
                  ■ Stop
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    ayahContext
                      ? 'Ask about this ayah...'
                      : 'Ask the sheikh anything...'
                  }
                  rows={1}
                  className="w-full resize-none rounded-xl bg-white/5 border border-white/10 
                             text-sm text-white placeholder-gray-500 
                             px-4 py-2.5 pr-10
                             focus:outline-none focus:border-amber-500/40 focus:bg-white/[0.07]
                             transition-colors duration-200
                             max-h-24 overflow-y-auto"
                  style={{ scrollbarWidth: 'none' }}
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
                           transition-all duration-200
                           ${
                             inputValue.trim() && !isLoading
                               ? 'bg-amber-500 text-black hover:bg-amber-400 active:scale-95'
                               : 'bg-white/5 text-gray-600 cursor-not-allowed'
                           }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              </button>
            </form>

            <p className="text-[10px] text-gray-600 text-center mt-2">
              AI-powered guidance · Always verify with qualified scholars
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
