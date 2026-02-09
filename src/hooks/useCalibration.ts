'use client';

import { useState, useCallback } from 'react';

// ─── Types ─────────────────────────────────────────────────────────

export interface CalibrationAssessment {
  level: 'beginner' | 'intermediate' | 'advanced';
  arabicReading: 'none' | 'basic' | 'fluent';
  tajweedKnowledge: 'none' | 'basic' | 'intermediate' | 'advanced';
  memorizationCount: number;
  understanding: 'none' | 'basic' | 'deep';
  summary: string;
  recommendation: string;
}

export interface CalibrationMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface UseCalibrationReturn {
  /** All messages in the calibration conversation */
  messages: CalibrationMessage[];
  /** Whether the sheikh is currently generating a response */
  isLoading: boolean;
  /** Error message if something went wrong */
  error: string | null;
  /** The final assessment result (null until conversation completes) */
  assessment: CalibrationAssessment | null;
  /** Whether the calibration is complete */
  isComplete: boolean;
  /** Start the calibration (sheikh sends first message) */
  start: () => Promise<void>;
  /** Send a user message and get the sheikh's response */
  respond: (message: string) => Promise<void>;
  /** Reset the calibration to start over */
  reset: () => void;
  /** Current question number (1-5) for progress display */
  questionNumber: number;
}

// ─── Hook ──────────────────────────────────────────────────────────

export function useCalibration(userName?: string): UseCalibrationReturn {
  const [messages, setMessages] = useState<CalibrationMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assessment, setAssessment] = useState<CalibrationAssessment | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  // Count user messages to track progress (each user reply = 1 question answered)
  const questionNumber = messages.filter((m) => m.role === 'user').length;

  const callAPI = useCallback(
    async (allMessages: CalibrationMessage[]) => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/sheikh/calibrate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: allMessages, userName }),
        });

        if (!res.ok) throw new Error('Failed to get response');

        const data = await res.json();

        const assistantMsg: CalibrationMessage = {
          role: 'assistant',
          content: data.message,
        };

        setMessages((prev) => [...prev, assistantMsg]);

        if (data.isComplete && data.assessment) {
          setAssessment(data.assessment);
          setIsComplete(true);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    },
    [userName]
  );

  const start = useCallback(async () => {
    setMessages([]);
    setAssessment(null);
    setIsComplete(false);
    await callAPI([]);
  }, [callAPI]);

  const respond = useCallback(
    async (message: string) => {
      if (isComplete || isLoading) return;

      const userMsg: CalibrationMessage = { role: 'user', content: message };
      const updatedMessages = [...messages, userMsg];

      setMessages(updatedMessages);
      await callAPI(updatedMessages);
    },
    [messages, isComplete, isLoading, callAPI]
  );

  const reset = useCallback(() => {
    setMessages([]);
    setAssessment(null);
    setIsComplete(false);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    assessment,
    isComplete,
    start,
    respond,
    reset,
    questionNumber,
  };
}
