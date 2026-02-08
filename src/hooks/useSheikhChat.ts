/**
 * useSheikhChat Hook V2 — Context-Aware
 * 
 * Now sends pageContext and tajweedResults to the API for full situational awareness.
 * Suggested questions adapt to the current page when no ayah is selected.
 * 
 * Usage:
 *   const { messages, sendMessage, isLoading } = useSheikhChat({
 *     ayahContext: { surahNumber: 1, surahName: 'Al-Fatiha', ... },
 *     userLevel: 'beginner',
 *   });
 */

import { useState, useCallback, useRef } from 'react';
import { getSuggestedQuestions, type PageContext, type TajweedResult } from '@/lib/sheikh-prompt';

// ─── Types ───────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface AyahContext {
  surahNumber: number;
  surahName: string;
  surahNameArabic: string;
  ayahNumber: number;
  arabicText: string;
  translation: string;
  transliteration?: string;
  juz?: number;
}

export interface UserProfile {
  level: 'beginner' | 'intermediate' | 'advanced';
  memorizedSurahs?: string[];
  currentStreak?: number;
  totalVersesMemorized?: number;
}

interface UseSheikhChatOptions {
  ayahContext?: AyahContext;
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
  userProfile?: UserProfile;
  pageContext?: PageContext;
  tajweedResults?: TajweedResult[];
  onError?: (error: string) => void;
}

interface UseSheikhChatReturn {
  messages: ChatMessage[];
  sendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearChat: () => void;
  suggestedQuestions: string[];
  stopStreaming: () => void;
}

function generateId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// ─── Hook ────────────────────────────────────────────────────────────

export function useSheikhChat(options: UseSheikhChatOptions = {}): UseSheikhChatReturn {
  const {
    ayahContext,
    userLevel = 'beginner',
    userProfile,
    pageContext,
    tajweedResults,
    onError,
  } = options;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Context-aware suggested questions
  const suggestedQuestions = getSuggestedQuestions(
    ayahContext?.surahNumber,
    ayahContext?.ayahNumber,
    pageContext?.page
  );

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    setMessages((prev) =>
      prev.map((msg) => (msg.isStreaming ? { ...msg, isStreaming: false } : msg))
    );
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      setError(null);

      const userMessage: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
      };

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true,
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setIsLoading(true);

      const apiMessages = [...messages, userMessage].map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch('/api/sheikh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: apiMessages,
            ayahContext,
            userLevel,
            userProfile,
            pageContext,
            tajweedResults,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMsg = errorData.error || 'The sheikh is unavailable right now. Please try again.';
          setError(errorMsg);
          onError?.(errorMsg);
          setMessages((prev) => prev.filter((msg) => msg.id !== assistantMessage.id));
          setIsLoading(false);
          return;
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response stream');

        const decoder = new TextDecoder();
        let buffer = '';
        let fullContent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim();
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);

                if (parsed.text) {
                  fullContent += parsed.text;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessage.id ? { ...msg, content: fullContent } : msg
                    )
                  );
                }

                if (parsed.error) {
                  setError(parsed.error);
                  onError?.(parsed.error);
                }
              } catch {
                // Skip unparseable chunks
              }
            }
          }
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id
              ? { ...msg, isStreaming: false, content: fullContent || 'I apologize, I was unable to generate a response. Please try again.' }
              : msg
          )
        );
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return;

        const errorMsg = 'Connection lost. Please check your internet and try again.';
        setError(errorMsg);
        onError?.(errorMsg);
        setMessages((prev) => prev.filter((msg) => msg.id !== assistantMessage.id));
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [messages, isLoading, ayahContext, userLevel, userProfile, pageContext, tajweedResults, onError]
  );

  const clearChat = useCallback(() => {
    stopStreaming();
    setMessages([]);
    setError(null);
  }, [stopStreaming]);

  return {
    messages,
    sendMessage,
    isLoading,
    error,
    clearChat,
    suggestedQuestions,
    stopStreaming,
  };
}
