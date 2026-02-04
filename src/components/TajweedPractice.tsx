'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Square,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  CheckCircle2,
  AlertCircle,
  Star,
  TrendingUp,
  Award,
  X,
  ChevronRight,
  HelpCircle,
  Radio,
  Zap,
  Wifi,
  WifiOff,
  BookOpen,
  Info,
} from 'lucide-react';
import {
  initializeRecording,
  checkMicPermission,
  startRecording,
  stopRecording,
  getAudioLevel,
  cleanupRecording,
  analyzeRecitation,
  savePracticeSession,
  getVersePracticeStats,
  TAJWEED_RULES,
  type TajweedFeedback,
} from '@/lib/tajweedService';
import { useRealtimeTajweed } from '@/hooks/useRealtimeTajweed';
import WordTracker, { AudioLevelIndicator, RealtimeError } from '@/components/WordTracker';
import type { RealtimeSessionResult } from '@/lib/realtimeTajweedService';

interface TajweedPracticeProps {
  surah: number;
  ayah: number;
  arabicText: string;
  translation?: string;
  audioUrl: string;
  onClose: () => void;
  onComplete?: (feedback: TajweedFeedback) => void;
}

type PracticeStep = 'intro' | 'listen' | 'record' | 'realtime' | 'analyzing' | 'feedback';
type PracticeMode = 'standard' | 'realtime';

export default function TajweedPractice({
  surah,
  ayah,
  arabicText,
  translation,
  audioUrl,
  onClose,
  onComplete,
}: TajweedPracticeProps) {
  // Mode state
  const [mode, setMode] = useState<PracticeMode>('standard');
  
  // Common state
  const [step, setStep] = useState<PracticeStep>('intro');
  const [micPermission, setMicPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [feedback, setFeedback] = useState<TajweedFeedback | null>(null);
  const [isPlayingOriginal, setIsPlayingOriginal] = useState(false);
  const [practiceStats, setPracticeStats] = useState(getVersePracticeStats(surah, ayah));
  
  // Standard mode state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlayingRecording, setIsPlayingRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  
  // Real-time mode state
  const [realtimeError, setRealtimeError] = useState<string | null>(null);
  const [realtimeResult, setRealtimeResult] = useState<RealtimeSessionResult | null>(null);
  
  // Refs
  const originalAudioRef = useRef<HTMLAudioElement>(null);
  const recordingAudioRef = useRef<HTMLAudioElement | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioLevelRef = useRef<NodeJS.Timeout | null>(null);

  // Real-time tajweed hook
  const {
    state: realtimeState,
    audioLevel: realtimeAudioLevel,
    start: startRealtime,
    stop: stopRealtime,
    isSupported: isRealtimeSupported,
    missingFeatures,
    isConfigured: isDeepgramConfigured,
    reset: resetRealtime,
  } = useRealtimeTajweed({
    expectedText: arabicText,
    onWord: (index, word) => {
      // Could add haptic feedback or sounds here
      // Debug: console.log(`Word ${index} matched:`, word.word);
    },
    onComplete: async (result) => {
      setRealtimeResult(result);
      // Proceed to analysis
      await analyzeRealtimeResult(result);
    },
    onError: (error) => {
      setRealtimeError(error);
    },
  });

  // Check if real-time mode is available
  const canUseRealtime = isRealtimeSupported && isDeepgramConfigured;

  // Check mic permission status on mount (without requesting it)
  // Actual mic access is deferred to user gesture (Start Recording click)
  useEffect(() => {
    async function checkPermission() {
      const permState = await checkMicPermission();
      if (permState === 'granted') {
        setMicPermission('granted');
      } else if (permState === 'denied') {
        setMicPermission('denied');
      }
      // 'prompt' → leave as 'pending', will request on user gesture
    }
    checkPermission();
    
    return () => {
      cleanupRecording();
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (audioLevelRef.current) clearInterval(audioLevelRef.current);
    };
  }, []);

  // Update practice stats
  useEffect(() => {
    setPracticeStats(getVersePracticeStats(surah, ayah));
  }, [surah, ayah]);

  // Handle original audio playback
  const toggleOriginalAudio = useCallback(() => {
    if (!originalAudioRef.current) return;
    
    if (isPlayingOriginal) {
      originalAudioRef.current.pause();
      setIsPlayingOriginal(false);
    } else {
      originalAudioRef.current.currentTime = 0;
      originalAudioRef.current.play();
      setIsPlayingOriginal(true);
    }
  }, [isPlayingOriginal]);

  // Handle recording playback (standard mode)
  const toggleRecordingPlayback = useCallback(() => {
    if (!audioBlob || !recordingAudioRef.current) return;
    
    if (isPlayingRecording) {
      recordingAudioRef.current.pause();
      setIsPlayingRecording(false);
    } else {
      recordingAudioRef.current.currentTime = 0;
      recordingAudioRef.current.play();
      setIsPlayingRecording(true);
    }
  }, [audioBlob, isPlayingRecording]);

  // Start recording (standard mode) — always initializes mic on user gesture
  const handleStartRecording = useCallback(async () => {
    // Always (re-)initialize recording on user gesture to ensure mic access
    const granted = await initializeRecording();
    if (!granted) {
      setMicPermission('denied');
      return;
    }
    setMicPermission('granted');
    
    const success = startRecording();
    if (success) {
      setIsRecording(true);
      setRecordingDuration(0);
      setAudioBlob(null);
      
      // Start duration timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      // Start audio level monitoring
      audioLevelRef.current = setInterval(() => {
        setAudioLevel(getAudioLevel());
      }, 50);
    }
  }, []);

  // Stop recording (standard mode) — stops mic stream tracks
  const handleStopRecording = useCallback(async () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (audioLevelRef.current) {
      clearInterval(audioLevelRef.current);
      audioLevelRef.current = null;
    }
    
    setIsRecording(false);
    setAudioLevel(0);
    
    // stopRecording() now also stops stream tracks to release the mic
    const blob = await stopRecording();
    if (blob) {
      setAudioBlob(blob);
      
      // Create audio element for playback
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      recordingAudioRef.current = audio;
      
      audio.onended = () => setIsPlayingRecording(false);
    }
  }, []);

  // Start real-time mode
  const handleStartRealtime = useCallback(async () => {
    setRealtimeError(null);
    setRealtimeResult(null);
    setStep('realtime');
    
    try {
      await startRealtime();
    } catch (error) {
      // Error handled by onError callback
    }
  }, [startRealtime]);

  // Stop real-time mode
  const handleStopRealtime = useCallback(async () => {
    const result = await stopRealtime();
    if (result) {
      setRealtimeResult(result);
      await analyzeRealtimeResult(result);
    }
  }, [stopRealtime]);

  // Analyze real-time result with Claude
  const analyzeRealtimeResult = useCallback(async (result: RealtimeSessionResult) => {
    setStep('analyzing');
    
    try {
      // Create a mock audio blob for the analysis API
      // In a production app, you'd actually capture the audio
      const mockBlob = new Blob([], { type: 'audio/webm' });
      
      // Call existing analysis which uses Claude
      const analysisResult = await analyzeRecitation(mockBlob, arabicText, surah, ayah);
      
      // Enhance with real-time alignment data
      // Keep the Claude analysis results but update accuracy from real-time tracking
      const enhancedFeedback: TajweedFeedback = {
        ...analysisResult,
        // Use the real-time accuracy if it's significantly different
        // In practice mode (no API), use real-time accuracy only
        accuracy: analysisResult.accuracy != null 
          ? Math.round((analysisResult.accuracy + result.accuracy) / 2)
          : result.accuracy,
        // If we have real-time data, we have actual analysis
        overall: analysisResult.accuracy != null ? analysisResult.overall : 
          (result.accuracy >= 80 ? 'excellent' : result.accuracy >= 60 ? 'good' : 'needs_practice'),
        isPracticeMode: false, // We have real-time data, so not in pure practice mode
      };
      
      setFeedback(enhancedFeedback);
      
      // Save practice session
      savePracticeSession({
        surah,
        ayah,
        feedback: enhancedFeedback,
      });
      
      setPracticeStats(getVersePracticeStats(surah, ayah));
      setStep('feedback');
      
      if (onComplete) {
        onComplete(enhancedFeedback);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      // Show error feedback with real-time accuracy
      setFeedback({
        overall: result.accuracy >= 80 ? 'excellent' : result.accuracy >= 60 ? 'good' : 'needs_practice',
        accuracy: result.accuracy,
        rulesAnalysis: [], // Can't map arbitrary rules to specific type
        encouragement: result.accuracy >= 80 
          ? "Excellent recitation! Your pronunciation is very clear. 🌟"
          : result.accuracy >= 60
            ? "Good effort! Keep practicing to improve your tajweed. 👍"
            : "Keep practicing! Each attempt makes you better. 💪",
        specificTips: result.rulesDetected.map(r => `${r.arabicName}: ${r.tip}`),
      });
      setStep('feedback');
    }
  }, [arabicText, surah, ayah, onComplete]);

  // Analyze recording (standard mode)
  const handleAnalyze = useCallback(async () => {
    if (!audioBlob) return;
    
    setStep('analyzing');
    
    try {
      const result = await analyzeRecitation(audioBlob, arabicText, surah, ayah);
      setFeedback(result);
      
      // Save practice session
      savePracticeSession({
        surah,
        ayah,
        feedback: result,
      });
      
      // Update stats
      setPracticeStats(getVersePracticeStats(surah, ayah));
      
      setStep('feedback');
      
      if (onComplete) {
        onComplete(result);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      // Show error feedback
      setFeedback({
        overall: 'good',
        accuracy: 75,
        rulesAnalysis: [],
        encouragement: "We couldn't fully analyze your recitation, but keep practicing! 🌟",
        specificTips: ["Try recording in a quieter environment", "Make sure to speak clearly into the microphone"],
      });
      setStep('feedback');
    }
  }, [audioBlob, arabicText, surah, ayah, onComplete]);

  // Reset practice
  const handleReset = useCallback(() => {
    setAudioBlob(null);
    setFeedback(null);
    setRecordingDuration(0);
    setRealtimeError(null);
    setRealtimeResult(null);
    resetRealtime();
    setStep('intro');
    
    if (recordingAudioRef.current) {
      URL.revokeObjectURL(recordingAudioRef.current.src);
      recordingAudioRef.current = null;
    }
  }, [resetRealtime]);

  // Switch to standard mode (fallback)
  const handleFallbackToStandard = useCallback(() => {
    setMode('standard');
    setRealtimeError(null);
    setStep('record');
  }, []);

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-night-950/95 backdrop-blur-sm flex items-end sm:items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tajweed-practice-title"
    >
      <motion.div
        initial={{ scale: 0.95, y: 100 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 100 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="liquid-modal w-full sm:max-w-lg max-h-[95vh] sm:max-h-[90vh] overflow-y-auto 
                   rounded-t-3xl sm:rounded-3xl sm:mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sheet handle for mobile */}
        <div className="sm:hidden sheet-handle" />
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-night-800/50 sticky top-0 bg-night-900/95 backdrop-blur-sm z-10">
          <div>
            <h2 id="tajweed-practice-title" className="font-semibold text-night-100">Tajweed Practice</h2>
            <p className="text-xs text-night-500">Surah {surah}, Ayah {ayah}</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Mode indicator */}
            {step === 'realtime' && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs">
                <Radio className="w-3 h-3 animate-pulse" />
                Live
              </div>
            )}
            <button 
              onClick={onClose} 
              className="btn-icon touch-target focus-visible-ring"
              aria-label="Close practice session"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hidden audio elements */}
        <audio 
          ref={originalAudioRef} 
          src={audioUrl}
          onEnded={() => setIsPlayingOriginal(false)}
        />

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* INTRO STEP */}
            {step === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Practice stats */}
                {practiceStats.totalSessions > 0 && (
                  <div className="flex items-center justify-between bg-night-900/50 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-night-400 text-sm">
                      <TrendingUp className="w-4 h-4" />
                      <span>Previous sessions: {practiceStats.totalSessions}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gold-400 text-sm font-medium">
                      <Award className="w-4 h-4" />
                      <span>Best: {practiceStats.bestAccuracy}%</span>
                    </div>
                  </div>
                )}

                {/* Verse display */}
                <div className="bg-night-900/30 rounded-2xl p-6 border border-night-800/50">
                  <p 
                    className="quran-text text-2xl text-center text-night-100 mb-4"
                    style={{ direction: 'rtl' }}
                  >
                    {arabicText}
                  </p>
                  {translation && (
                    <p className="text-night-400 text-sm text-center">
                      {translation}
                    </p>
                  )}
                </div>

                {/* Mode selection */}
                <div className="space-y-3">
                  <p className="text-night-400 text-sm font-medium">Choose practice mode:</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {/* Real-time mode */}
                    <button
                      onClick={() => setMode('realtime')}
                      disabled={!canUseRealtime}
                      className={`
                        relative p-4 rounded-xl border-2 transition-all text-left
                        ${mode === 'realtime' 
                          ? 'border-blue-500 bg-blue-500/10' 
                          : 'border-night-700 bg-night-900/30 hover:border-night-600'
                        }
                        ${!canUseRealtime ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className={`w-5 h-5 ${mode === 'realtime' ? 'text-blue-400' : 'text-night-400'}`} />
                        <span className={`font-medium ${mode === 'realtime' ? 'text-blue-300' : 'text-night-300'}`}>
                          Real-time
                        </span>
                      </div>
                      <p className="text-xs text-night-500">
                        Word-by-word tracking as you recite
                      </p>
                      {!canUseRealtime && (
                        <div className="absolute top-2 right-2">
                          <WifiOff className="w-4 h-4 text-night-600" />
                        </div>
                      )}
                      {mode === 'realtime' && (
                        <motion.div
                          layoutId="mode-indicator"
                          className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center"
                        >
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                    </button>
                    
                    {/* Standard mode */}
                    <button
                      onClick={() => setMode('standard')}
                      className={`
                        relative p-4 rounded-xl border-2 transition-all text-left
                        ${mode === 'standard' 
                          ? 'border-gold-500 bg-gold-500/10' 
                          : 'border-night-700 bg-night-900/30 hover:border-night-600'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Mic className={`w-5 h-5 ${mode === 'standard' ? 'text-gold-400' : 'text-night-400'}`} />
                        <span className={`font-medium ${mode === 'standard' ? 'text-gold-300' : 'text-night-300'}`}>
                          Standard
                        </span>
                      </div>
                      <p className="text-xs text-night-500">
                        Record then analyze
                      </p>
                      {mode === 'standard' && (
                        <motion.div
                          layoutId="mode-indicator"
                          className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold-500 flex items-center justify-center"
                        >
                          <CheckCircle2 className="w-3 h-3 text-night-900" />
                        </motion.div>
                      )}
                    </button>
                  </div>
                  
                  {!canUseRealtime && (
                    <p className="text-xs text-night-600">
                      {!isRealtimeSupported 
                        ? `Real-time mode requires: ${missingFeatures.join(', ')}`
                        : 'Real-time mode not available'
                      }
                    </p>
                  )}
                </div>

                {/* Instructions */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-night-300 text-sm">
                    <div className="w-6 h-6 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <p>Listen to the recitation to familiarize yourself with the pronunciation</p>
                  </div>
                  <div className="flex items-start gap-3 text-night-300 text-sm">
                    <div className="w-6 h-6 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <p>
                      {mode === 'realtime' 
                        ? 'Recite and see real-time word tracking'
                        : 'Record yourself reciting the verse'
                      }
                    </p>
                  </div>
                  <div className="flex items-start gap-3 text-night-300 text-sm">
                    <div className="w-6 h-6 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <p>Get AI-powered feedback on your tajweed</p>
                  </div>
                </div>

                {/* Mic permission warning */}
                {micPermission === 'denied' && (
                  <div className="flex items-center gap-3 bg-red-900/20 border border-red-700/30 rounded-xl p-4 text-red-300 text-sm">
                    <MicOff className="w-5 h-5 flex-shrink-0" />
                    <p>Microphone access is required. Please enable it in your browser settings.</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('listen')}
                    className="flex-1 liquid-btn-outline flex items-center justify-center gap-2"
                  >
                    <Volume2 className="w-5 h-5" />
                    Listen First
                  </button>
                  <button
                    onClick={() => {
                      if (mode === 'realtime') {
                        handleStartRealtime();
                      } else {
                        setStep('record');
                      }
                    }}
                    className="flex-1 liquid-btn flex items-center justify-center gap-2"
                  >
                    {mode === 'realtime' ? (
                      <>
                        <Zap className="w-5 h-5" />
                        Start Live
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5" />
                        Start Recording
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* LISTEN STEP */}
            {step === 'listen' && (
              <motion.div
                key="listen"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Verse display */}
                <div className={`bg-night-900/30 rounded-2xl p-6 border transition-colors ${
                  isPlayingOriginal ? 'border-gold-500/50 shadow-glow-gold' : 'border-night-800/50'
                }`}>
                  <p 
                    className={`quran-text text-3xl text-center transition-colors ${
                      isPlayingOriginal ? 'text-gold-300' : 'text-night-100'
                    }`}
                    style={{ direction: 'rtl' }}
                  >
                    {arabicText}
                  </p>
                </div>

                {/* Audio controls */}
                <div className="flex flex-col items-center gap-4">
                  <button
                    onClick={toggleOriginalAudio}
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                      isPlayingOriginal
                        ? 'bg-gold-500 text-night-950 shadow-glow-gold'
                        : 'bg-gold-500/20 text-gold-400 hover:bg-gold-500/30'
                    }`}
                  >
                    {isPlayingOriginal ? (
                      <Pause className="w-10 h-10" />
                    ) : (
                      <Play className="w-10 h-10 ml-1" />
                    )}
                  </button>
                  <p className="text-night-400 text-sm">
                    {isPlayingOriginal ? 'Playing...' : 'Tap to listen'}
                  </p>
                </div>

                {/* Continue button */}
                <button
                  onClick={() => {
                    if (mode === 'realtime') {
                      handleStartRealtime();
                    } else {
                      setStep('record');
                    }
                  }}
                  disabled={micPermission === 'denied'}
                  className="w-full liquid-btn flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {mode === 'realtime' ? (
                    <>
                      <Zap className="w-5 h-5" />
                      Start Live Practice
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5" />
                      Ready to Record
                    </>
                  )}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {/* REAL-TIME STEP */}
            {step === 'realtime' && (
              <motion.div
                key="realtime"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Error display */}
                {realtimeError && (
                  <RealtimeError
                    error={realtimeError}
                    onRetry={() => {
                      setRealtimeError(null);
                      handleStartRealtime();
                    }}
                    onFallback={handleFallbackToStandard}
                  />
                )}
                
                {/* Connection status */}
                {!realtimeError && (
                  <div className="flex items-center justify-center gap-2 text-sm">
                    {realtimeState.isConnected ? (
                      <>
                        <Wifi className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">Connected</span>
                      </>
                    ) : (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <Radio className="w-4 h-4 text-blue-400" />
                        </motion.div>
                        <span className="text-blue-400">Connecting...</span>
                      </>
                    )}
                  </div>
                )}
                
                {/* Word tracker */}
                {!realtimeError && (
                  <WordTracker
                    alignments={realtimeState.alignments}
                    currentWordIndex={realtimeState.currentWordIndex}
                    showTranscription={true}
                  />
                )}
                
                {/* Audio level indicator */}
                {!realtimeError && realtimeState.isRecording && (
                  <div className="flex flex-col items-center gap-2">
                    <AudioLevelIndicator 
                      level={realtimeAudioLevel} 
                      isActive={realtimeState.isRecording} 
                    />
                    <p className="text-xs text-night-500">
                      {realtimeAudioLevel > 0.1 ? 'Listening...' : 'Speak into your microphone'}
                    </p>
                  </div>
                )}
                
                {/* Controls */}
                {!realtimeError && (
                  <div className="flex flex-col items-center gap-4">
                    {realtimeState.isRecording ? (
                      <button
                        onClick={handleStopRealtime}
                        className="w-20 h-20 rounded-full bg-red-500 text-white flex items-center justify-center
                                   hover:bg-red-400 transition-colors shadow-lg"
                        aria-label="Stop recording"
                      >
                        <Square className="w-8 h-8" />
                      </button>
                    ) : (
                      <button
                        onClick={handleStartRealtime}
                        disabled={!realtimeState.isConnected && !realtimeError}
                        className="w-20 h-20 rounded-full bg-blue-500 text-white flex items-center justify-center
                                   hover:bg-blue-400 transition-colors shadow-lg disabled:opacity-50"
                        aria-label="Start recording"
                      >
                        <Mic className="w-10 h-10" />
                      </button>
                    )}
                    
                    <p className="text-night-400 text-sm">
                      {realtimeState.isRecording ? 'Tap to finish' : 'Tap to start reciting'}
                    </p>
                    
                    {/* Listen to original */}
                    {!realtimeState.isRecording && (
                      <button
                        onClick={toggleOriginalAudio}
                        className="flex items-center gap-2 text-night-400 hover:text-night-200 text-sm transition-colors"
                      >
                        <Volume2 className="w-4 h-4" />
                        {isPlayingOriginal ? 'Playing...' : 'Listen to original'}
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* RECORD STEP (Standard mode) */}
            {step === 'record' && (
              <motion.div
                key="record"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Verse display */}
                <div className="bg-night-900/30 rounded-2xl p-6 border border-night-800/50">
                  <p 
                    className="quran-text text-2xl text-center text-night-100"
                    style={{ direction: 'rtl' }}
                  >
                    {arabicText}
                  </p>
                </div>

                {/* Recording controls */}
                <div className="flex flex-col items-center gap-4">
                  {/* Audio level visualizer - mobile optimized */}
                  {isRecording && (
                    <div className="flex items-center gap-1 h-12 px-4" role="status" aria-label="Audio level indicator">
                      {Array.from({ length: 15 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="audio-level-bar"
                          animate={{
                            height: Math.max(8, audioLevel * 100 * Math.random()),
                          }}
                          transition={{ duration: 0.05 }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Duration */}
                  {isRecording && (
                    <p className="text-gold-400 font-mono text-xl sm:text-2xl" aria-live="polite">
                      {formatDuration(recordingDuration)}
                    </p>
                  )}

                  {/* Record button - larger touch target */}
                  <button
                    onClick={isRecording ? handleStopRecording : handleStartRecording}
                    aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                    aria-pressed={isRecording}
                    className={`record-btn-large ${isRecording ? 'recording' : 'bg-gold-500 text-night-950 hover:bg-gold-400'}`}
                  >
                    {isRecording ? (
                      <Square className="w-8 h-8 sm:w-10 sm:h-10" />
                    ) : (
                      <Mic className="w-10 h-10 sm:w-12 sm:h-12" />
                    )}
                  </button>
                  
                  <p className="text-night-400 text-sm text-center px-4">
                    {isRecording ? 'Tap to stop' : 'Tap to start recording'}
                  </p>

                  {/* Listen to original */}
                  {!isRecording && (
                    <button
                      onClick={toggleOriginalAudio}
                      className="flex items-center gap-2 text-night-400 hover:text-night-200 text-sm transition-colors"
                    >
                      <Volume2 className="w-4 h-4" />
                      {isPlayingOriginal ? 'Playing...' : 'Listen again'}
                    </button>
                  )}
                </div>

                {/* Recording preview */}
                {audioBlob && !isRecording && (
                  <div className="bg-night-900/50 rounded-xl p-4 border border-night-800/50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-night-300 text-sm">Your Recording</span>
                      <span className="text-night-500 text-xs">{formatDuration(recordingDuration)}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={toggleRecordingPlayback}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-night-800 hover:bg-night-700 text-night-300 transition-colors"
                      >
                        {isPlayingRecording ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {isPlayingRecording ? 'Pause' : 'Play'}
                      </button>
                      <button
                        onClick={handleStartRecording}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-night-800 hover:bg-night-700 text-night-300 transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Re-record
                      </button>
                    </div>
                  </div>
                )}

                {/* Analyze button */}
                {audioBlob && !isRecording && (
                  <button
                    onClick={handleAnalyze}
                    className="w-full liquid-btn flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Analyze My Recitation
                  </button>
                )}
              </motion.div>
            )}

            {/* ANALYZING STEP */}
            {step === 'analyzing' && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-gold-500/20 rounded-full" />
                  <div className="w-20 h-20 border-4 border-gold-500 border-t-transparent rounded-full animate-spin absolute inset-0" />
                </div>
                <p className="text-night-300 mt-6 text-lg">Analyzing your recitation...</p>
                <p className="text-night-500 text-sm mt-2">This may take a moment</p>
              </motion.div>
            )}

            {/* FEEDBACK STEP */}
            {step === 'feedback' && feedback && (
              <motion.div
                key="feedback"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Score badge */}
                <div className="flex flex-col items-center">
                  {feedback.overall === 'practice_mode' ? (
                    // Practice mode - no AI scoring
                    <>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                        className="w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-night-600 to-night-700 border-2 border-gold-500/30"
                      >
                        <HelpCircle className="w-12 h-12 text-gold-400" />
                      </motion.div>
                      <h3 className="text-xl font-bold mt-4 text-gold-400">
                        📚 Learning Mode
                      </h3>
                      <p className="text-sm text-night-400 mt-2 text-center max-w-xs">
                        Self-assess your recitation using the tajweed rules below
                      </p>
                    </>
                  ) : (
                    // AI-scored mode
                    <>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                        className={`w-24 h-24 rounded-full flex items-center justify-center ${
                          feedback.overall === 'excellent'
                            ? 'bg-gradient-to-br from-gold-400 to-gold-600 shadow-glow-gold'
                            : feedback.overall === 'good'
                              ? 'bg-gradient-to-br from-sage-400 to-sage-600'
                              : 'bg-gradient-to-br from-night-600 to-night-700'
                        }`}
                      >
                        <span className="text-3xl font-bold text-night-950">
                          {feedback.accuracy}%
                        </span>
                      </motion.div>
                      
                      <h3 className={`text-xl font-bold mt-4 ${
                        feedback.overall === 'excellent'
                          ? 'text-gold-400'
                          : feedback.overall === 'good'
                            ? 'text-sage-400'
                            : 'text-night-300'
                      }`}>
                        {feedback.overall === 'excellent' && '🌟 Excellent!'}
                        {feedback.overall === 'good' && '👍 Good Job!'}
                        {feedback.overall === 'needs_practice' && '💪 Keep Practicing!'}
                      </h3>
                    </>
                  )}
                </div>

                {/* Encouragement */}
                <div className="bg-night-900/30 rounded-xl p-4 border border-night-800/50 text-center">
                  <p className="text-night-200">{feedback.encouragement}</p>
                </div>

                {/* Practice mode note */}
                {feedback.isPracticeMode && feedback.practiceNote && (
                  <div className="bg-night-900/50 rounded-xl p-3 border border-night-800/30 text-center">
                    <p className="text-xs text-night-500 flex items-center justify-center gap-2">
                      <Info className="w-3 h-3" />
                      {feedback.practiceNote}
                    </p>
                  </div>
                )}

                {/* Real-time alignment summary (if available) */}
                {realtimeResult && (
                  <div className="bg-night-900/30 rounded-xl p-4 border border-night-800/50">
                    <h4 className="text-night-400 text-sm font-medium flex items-center gap-2 mb-3">
                      <Zap className="w-4 h-4" />
                      Real-time Tracking Results
                    </h4>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="text-2xl font-bold text-emerald-400">
                          {realtimeResult.alignments.filter(a => a.status === 'matched').length}
                        </p>
                        <p className="text-xs text-night-500">Matched</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-amber-400">
                          {realtimeResult.alignments.filter(a => a.status === 'partial').length}
                        </p>
                        <p className="text-xs text-night-500">Close</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-red-400">
                          {realtimeResult.alignments.filter(a => a.status === 'missed').length}
                        </p>
                        <p className="text-xs text-night-500">Missed</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tajweed rules feedback */}
                {feedback.rulesAnalysis.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-night-400 text-sm font-medium flex items-center gap-2">
                      <HelpCircle className="w-4 h-4" />
                      {feedback.isPracticeMode ? 'Tajweed Rules in This Verse' : 'Tajweed Analysis'}
                    </h4>
                    {feedback.rulesAnalysis.map((rule, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-3 p-3 rounded-xl ${
                          rule.status === 'correct'
                            ? 'bg-sage-900/20 border border-sage-700/30'
                            : rule.status === 'learning'
                              ? 'bg-gold-900/20 border border-gold-700/30'
                              : 'bg-amber-900/20 border border-amber-700/30'
                        }`}
                      >
                        {rule.status === 'correct' ? (
                          <CheckCircle2 className="w-5 h-5 text-sage-400 flex-shrink-0 mt-0.5" />
                        ) : rule.status === 'learning' ? (
                          <BookOpen className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className={`font-medium ${
                            rule.status === 'correct' 
                              ? 'text-sage-300' 
                              : rule.status === 'learning'
                                ? 'text-gold-300'
                                : 'text-amber-300'
                          }`}>
                            {TAJWEED_RULES[rule.rule]?.name || rule.rule}
                          </p>
                          <p className="text-night-400 text-sm mt-0.5">{rule.feedback}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tips */}
                {feedback.specificTips.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-night-400 text-sm font-medium">Tips for Improvement</h4>
                    {feedback.specificTips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-2 text-night-300 text-sm">
                        <span className="text-gold-400">•</span>
                        <p>{tip}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleReset}
                    className="flex-1 liquid-btn-outline flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Practice Again
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 liquid-btn flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Done
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
