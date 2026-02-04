/**
 * React Hook for Real-time Tajweed Practice
 * 
 * Wraps RealtimeTajweedService with React state management
 * 
 * Usage:
 * ```tsx
 * function TajweedPractice({ ayahText }) {
 *   const {
 *     state,
 *     audioLevel,
 *     start,
 *     stop,
 *     isSupported,
 *   } = useRealtimeTajweed({
 *     expectedText: ayahText,
 *   });
 * 
 *   return (
 *     <div>
 *       {state.alignments.map((alignment, i) => (
 *         <span
 *           key={i}
 *           className={alignment.status === 'current' ? 'highlight' : ''}
 *         >
 *           {alignment.expectedWord}
 *         </span>
 *       ))}
 *       <button onClick={start}>Start</button>
 *       <button onClick={stop}>Stop</button>
 *     </div>
 *   );
 * }
 * ```
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  RealtimeTajweedService,
  RealtimeState,
  RealtimeSessionResult,
  checkBrowserSupport,
  TranscribedWord,
} from '@/lib/realtimeTajweedService';

interface UseRealtimeTajweedOptions {
  expectedText: string;
  onWord?: (index: number, word: TranscribedWord) => void;
  onComplete?: (result: RealtimeSessionResult) => void;
  onError?: (error: string) => void;
}

interface UseRealtimeTajweedReturn {
  /** Current service state */
  state: RealtimeState;
  /** Audio level 0-1 for visualization */
  audioLevel: number;
  /** Start real-time transcription */
  start: () => Promise<void>;
  /** Stop and get results */
  stop: () => Promise<RealtimeSessionResult | null>;
  /** Browser support info */
  isSupported: boolean;
  /** Missing browser features */
  missingFeatures: string[];
  /** Whether Deepgram is configured */
  isConfigured: boolean;
  /** Reset state for new session */
  reset: () => void;
}

const initialState: RealtimeState = {
  isConnected: false,
  isRecording: false,
  currentWordIndex: -1,
  transcription: '',
  words: [],
  alignments: [],
  error: null,
};

export function useRealtimeTajweed(
  options: UseRealtimeTajweedOptions
): UseRealtimeTajweedReturn {
  const { expectedText, onWord, onComplete, onError } = options;
  
  const [state, setState] = useState<RealtimeState>(initialState);
  const [audioLevel, setAudioLevel] = useState(0);
  const [browserSupport] = useState(() => checkBrowserSupport());
  
  const serviceRef = useRef<RealtimeTajweedService | null>(null);
  const audioLevelIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Track if Deepgram is configured (checked via API)
  const [isConfigured, setIsConfigured] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  
  // Check if Deepgram is configured via server
  useEffect(() => {
    async function checkConfig() {
      try {
        const response = await fetch('/api/deepgram/token');
        const data = await response.json();
        if (data.configured && data.apiKey) {
          setIsConfigured(true);
          setApiKey(data.apiKey);
        }
      } catch {
        setIsConfigured(false);
      }
    }
    checkConfig();
  }, []);
  
  // Initialize state when expected text changes
  useEffect(() => {
    const words = expectedText
      .replace(/[\u06DD\u0660-\u0669۰-۹]+/g, '')
      .split(/\s+/)
      .filter(w => w.length > 0);
    
    setState({
      ...initialState,
      alignments: words.map((word, i) => ({
        expectedIndex: i,
        expectedWord: word,
        status: 'pending' as const,
        confidence: 0,
      })),
    });
  }, [expectedText]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (serviceRef.current) {
        serviceRef.current.stop().catch(console.error);
      }
      if (audioLevelIntervalRef.current) {
        clearInterval(audioLevelIntervalRef.current);
      }
    };
  }, []);
  
  const start = useCallback(async () => {
    if (!isConfigured || !apiKey) {
      onError?.('Deepgram API key not configured');
      return;
    }
    
    if (!browserSupport.supported) {
      onError?.(`Browser missing: ${browserSupport.missing.join(', ')}`);
      return;
    }
    
    try {
      // Create new service instance with server-provided API key
      serviceRef.current = new RealtimeTajweedService({
        apiKey,
        expectedText,
      });
      
      // Subscribe to events
      serviceRef.current.onStateChange(setState);
      
      serviceRef.current.onWord((index, word) => {
        onWord?.(index, word);
      });
      
      serviceRef.current.onError((error) => {
        onError?.(error);
      });
      
      // Start audio level monitoring
      audioLevelIntervalRef.current = setInterval(() => {
        if (serviceRef.current) {
          setAudioLevel(serviceRef.current.getAudioLevel());
        }
      }, 50);
      
      // Start transcription
      await serviceRef.current.start();
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to start';
      onError?.(message);
      setState(prev => ({ ...prev, error: message }));
    }
  }, [expectedText, isConfigured, apiKey, browserSupport, onWord, onError]);
  
  const stop = useCallback(async (): Promise<RealtimeSessionResult | null> => {
    // Stop audio level monitoring
    if (audioLevelIntervalRef.current) {
      clearInterval(audioLevelIntervalRef.current);
      audioLevelIntervalRef.current = null;
    }
    setAudioLevel(0);
    
    if (!serviceRef.current) {
      return null;
    }
    
    try {
      const result = await serviceRef.current.stop();
      onComplete?.(result);
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to stop';
      onError?.(message);
      return null;
    }
  }, [onComplete, onError]);
  
  const reset = useCallback(() => {
    const words = expectedText
      .replace(/[\u06DD\u0660-\u0669۰-۹]+/g, '')
      .split(/\s+/)
      .filter(w => w.length > 0);
    
    setState({
      ...initialState,
      alignments: words.map((word, i) => ({
        expectedIndex: i,
        expectedWord: word,
        status: 'pending' as const,
        confidence: 0,
      })),
    });
    setAudioLevel(0);
    serviceRef.current = null;
  }, [expectedText]);
  
  return {
    state,
    audioLevel,
    start,
    stop,
    isSupported: browserSupport.supported,
    missingFeatures: browserSupport.missing,
    isConfigured,
    reset,
  };
}

export default useRealtimeTajweed;
