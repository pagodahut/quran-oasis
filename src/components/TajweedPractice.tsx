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
} from 'lucide-react';
import {
  initializeRecording,
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

interface TajweedPracticeProps {
  surah: number;
  ayah: number;
  arabicText: string;
  translation?: string;
  audioUrl: string;
  onClose: () => void;
  onComplete?: (feedback: TajweedFeedback) => void;
}

type PracticeStep = 'intro' | 'listen' | 'record' | 'analyzing' | 'feedback';

export default function TajweedPractice({
  surah,
  ayah,
  arabicText,
  translation,
  audioUrl,
  onClose,
  onComplete,
}: TajweedPracticeProps) {
  // State
  const [step, setStep] = useState<PracticeStep>('intro');
  const [micPermission, setMicPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [feedback, setFeedback] = useState<TajweedFeedback | null>(null);
  const [isPlayingOriginal, setIsPlayingOriginal] = useState(false);
  const [isPlayingRecording, setIsPlayingRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [practiceStats, setPracticeStats] = useState(getVersePracticeStats(surah, ayah));
  
  // Refs
  const originalAudioRef = useRef<HTMLAudioElement>(null);
  const recordingAudioRef = useRef<HTMLAudioElement | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioLevelRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize recording on mount
  useEffect(() => {
    async function init() {
      const hasPermission = await initializeRecording();
      setMicPermission(hasPermission ? 'granted' : 'denied');
    }
    init();
    
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

  // Handle recording playback
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

  // Start recording
  const handleStartRecording = useCallback(async () => {
    if (micPermission !== 'granted') {
      const granted = await initializeRecording();
      if (!granted) {
        setMicPermission('denied');
        return;
      }
      setMicPermission('granted');
    }
    
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
  }, [micPermission]);

  // Stop recording
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

  // Analyze recording
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
    setStep('intro');
    
    if (recordingAudioRef.current) {
      URL.revokeObjectURL(recordingAudioRef.current.src);
      recordingAudioRef.current = null;
    }
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
      className="fixed inset-0 z-50 bg-night-950/95 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="liquid-modal w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-night-800/50">
          <div>
            <h2 className="font-semibold text-night-100">Tajweed Practice</h2>
            <p className="text-xs text-night-500">Surah {surah}, Ayah {ayah}</p>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X className="w-5 h-5" />
          </button>
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
                    <p>Record yourself reciting the verse</p>
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
                    onClick={() => setStep('record')}
                    disabled={micPermission === 'denied'}
                    className="flex-1 liquid-btn flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Mic className="w-5 h-5" />
                    Start Recording
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
                  onClick={() => setStep('record')}
                  disabled={micPermission === 'denied'}
                  className="w-full liquid-btn flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Mic className="w-5 h-5" />
                  Ready to Record
                  <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {/* RECORD STEP */}
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
                  {/* Audio level visualizer */}
                  {isRecording && (
                    <div className="flex items-center gap-1 h-12">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 bg-gold-500 rounded-full"
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
                    <p className="text-gold-400 font-mono text-xl">
                      {formatDuration(recordingDuration)}
                    </p>
                  )}

                  {/* Record button */}
                  <button
                    onClick={isRecording ? handleStopRecording : handleStartRecording}
                    className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                      isRecording
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-gold-500 text-night-950 hover:bg-gold-400'
                    }`}
                  >
                    {isRecording ? (
                      <Square className="w-10 h-10" />
                    ) : (
                      <Mic className="w-12 h-12" />
                    )}
                  </button>
                  
                  <p className="text-night-400 text-sm">
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
                </div>

                {/* Encouragement */}
                <div className="bg-night-900/30 rounded-xl p-4 border border-night-800/50 text-center">
                  <p className="text-night-200">{feedback.encouragement}</p>
                </div>

                {/* Tajweed rules feedback */}
                {feedback.rulesAnalysis.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-night-400 text-sm font-medium flex items-center gap-2">
                      <HelpCircle className="w-4 h-4" />
                      Tajweed Analysis
                    </h4>
                    {feedback.rulesAnalysis.map((rule, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-3 p-3 rounded-xl ${
                          rule.status === 'correct'
                            ? 'bg-sage-900/20 border border-sage-700/30'
                            : 'bg-amber-900/20 border border-amber-700/30'
                        }`}
                      >
                        {rule.status === 'correct' ? (
                          <CheckCircle2 className="w-5 h-5 text-sage-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className={`font-medium ${
                            rule.status === 'correct' ? 'text-sage-300' : 'text-amber-300'
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
