/**
 * useSheikhChat Hook
 * 
 * React hook for managing AI Sheikh conversations.
 * Handles streaming responses, message history, loading states,
 * and error handling with a clean API.
 * 
 * Usage:
 *   const { messages, sendMessage, isLoading, error, clearChat, suggestedQuestions } = useSheikhChat({
 *     ayahContext: { surahNumber: 1, surahName: 'Al-Fatiha', ... },
 *     userLevel: 'beginner',
 *   });
 */

import { useState, useCallback, useRef } from 'react';
import { getSuggestedQuestions } from '@/lib/sheikh-prompt';

// Types
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

export function useSheikhChat(options: UseSheikhChatOptions = {}): UseSheikhChatReturn {
  const { ayahContext, userLevel = 'beginner', userProfile, onError } = options;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Generate suggested questions based on current ayah
  const suggestedQuestions = ayahContext
    ? getSuggestedQuestions(ayahContext.surahNumber, ayahContext.ayahNumber)
    : [
        'How do I start memorizing the Quran?',
        'What is tajweed and why is it important?',
        'Which surah should a beginner start with?',
        'What is the 10-3 memorization method?',
      ];

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    // Mark any streaming message as complete
    setMessages((prev) =>
      prev.map((msg) => (msg.isStreaming ? { ...msg, isStreaming: false } : msg))
    );
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      setError(null);

      // Add user message
      const userMessage: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
      };

      // Add placeholder for assistant response
      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true,
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setIsLoading(true);

      // Build messages array for API (without IDs/timestamps)
      const apiMessages = [...messages, userMessage].map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Create abort controller for this request
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
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMsg =
            errorData.error || 'The sheikh is unavailable right now. Please try again.';
          setError(errorMsg);
          onError?.(errorMsg);

          // Remove the empty assistant message
          setMessages((prev) => prev.filter((msg) => msg.id !== assistantMessage.id));
          setIsLoading(false);
          return;
        }

        // Read the streaming response
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No response stream');
        }

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

                  // Update the assistant message with new content
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessage.id
                        ? { ...msg, content: fullContent }
                        : msg
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

        // Mark streaming as complete
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id
              ? { ...msg, isStreaming: false, content: fullContent || 'I apologize, I was unable to generate a response. Please try again.' }
              : msg
          )
        );
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          // User cancelled — that's fine
          return;
        }

        const errorMsg = 'Connection lost. Please check your internet and try again.';
        setError(errorMsg);
        onError?.(errorMsg);

        // Remove the empty assistant message
        setMessages((prev) => prev.filter((msg) => msg.id !== assistantMessage.id));
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [messages, isLoading, ayahContext, userLevel, userProfile, onError]
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
