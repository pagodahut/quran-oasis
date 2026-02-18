'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Loader2, BookOpen, ChevronLeft, Sparkles, Volume2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';
import { identifyVerse, type VerseMatch } from '@/lib/quranIdentifier';

type Phase = 'idle' | 'listening' | 'identifying' | 'results' | 'error';

export default function IdentifyPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('idle');
  const [matches, setMatches] = useState<VerseMatch[]>([]);
  const [transcript, setTranscript] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const recognitionRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>(0);

  const updateAudioLevel = useCallback(() => {
    if (!analyserRef.current) return;
    const data = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(data);
    const avg = data.reduce((s, v) => s + v, 0) / data.length;
    setAudioLevel(Math.min(avg / 128, 1));
    animFrameRef.current = requestAnimationFrame(updateAudioLevel);
  }, []);

  const startListening = useCallback(async () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMsg('Speech recognition not supported. Please use Chrome or Edge.');
      setPhase('error');
      return;
    }

    try {
      // Get mic for visualization
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const ctx = new AudioContext();
      audioContextRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyserRef.current = analyser;
      ctx.createMediaStreamSource(stream).connect(analyser);
      analyser.fftSize = 256;
      animFrameRef.current = requestAnimationFrame(updateAudioLevel);
    } catch {
      // Visualization won't work but recognition still can
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ar-SA';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    let fullText = '';

    recognition.onresult = (event: any) => {
      let text = '';
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript + ' ';
      }
      fullText = text.trim();
      setTranscript(fullText);
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'no-speech' || event.error === 'aborted') return;
      setErrorMsg(`Recognition error: ${event.error}`);
      setPhase('error');
    };

    recognition.start();
    setPhase('listening');
    setMatches([]);
    setTranscript('');
  }, [updateAudioLevel]);

  const stopAndIdentify = useCallback(async () => {
    // Stop recognition
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }

    // Stop audio
    cancelAnimationFrame(animFrameRef.current);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      try { audioContextRef.current.close(); } catch {}
      audioContextRef.current = null;
    }
    setAudioLevel(0);

    if (!transcript.trim()) {
      setErrorMsg('No speech detected. Please try again and recite clearly.');
      setPhase('error');
      return;
    }

    setPhase('identifying');

    try {
      const results = await identifyVerse(transcript, 5);
      setMatches(results);
      setPhase(results.length > 0 ? 'results' : 'error');
      if (results.length === 0) {
        setErrorMsg('Could not identify the verse. Try reciting a few more words.');
      }
    } catch (err) {
      setErrorMsg('Error identifying verse.');
      setPhase('error');
    }
  }, [transcript]);

  const reset = () => {
    setPhase('idle');
    setMatches([]);
    setTranscript('');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen min-h-dvh bg-night-950 flex flex-col">
      {/* Header */}
      <header className="px-4 pt-6 pb-4 safe-area-top">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 -ml-2 text-night-400 hover:text-night-200">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-night-100">Identify Verse</h1>
            <p className="text-night-500 text-sm">Shazam for Quran — recite and we'll find it</p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-32">
        <AnimatePresence mode="wait">
          {/* Idle State */}
          {phase === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center text-center"
            >
              <motion.div
                className="w-32 h-32 rounded-full flex items-center justify-center mb-8 relative"
                style={{
                  background: 'linear-gradient(135deg, rgba(201,162,39,0.15), rgba(201,162,39,0.05))',
                  border: '2px solid rgba(201,162,39,0.2)',
                }}
              >
                <Sparkles className="w-12 h-12 text-gold-400" />
                {/* Decorative rings */}
                <div className="absolute inset-0 rounded-full border border-gold-500/10 animate-ping" style={{ animationDuration: '3s' }} />
              </motion.div>

              <h2 className="text-2xl font-bold text-night-100 mb-3">
                What verse is this?
              </h2>
              <p className="text-night-400 mb-10 max-w-sm leading-relaxed">
                Recite any Quran verse — or play a recording near your phone — and we&apos;ll identify it instantly.
              </p>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={startListening}
                className="w-20 h-20 rounded-full flex items-center justify-center relative"
                style={{
                  background: 'linear-gradient(135deg, rgba(201,162,39,0.95), rgba(180,140,30,1))',
                  boxShadow: '0 8px 40px rgba(201,162,39,0.4)',
                }}
              >
                <Mic className="w-8 h-8 text-night-950" />
              </motion.button>
              <p className="text-night-600 text-sm mt-4">Tap to start listening</p>
            </motion.div>
          )}

          {/* Listening State */}
          {phase === 'listening' && (
            <motion.div
              key="listening"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center text-center"
            >
              {/* Animated listening indicator */}
              <motion.div
                className="w-40 h-40 rounded-full flex items-center justify-center mb-8 relative"
                style={{
                  background: `radial-gradient(circle, rgba(201,162,39,${0.15 + audioLevel * 0.25}) 0%, transparent 70%)`,
                }}
              >
                {/* Pulsing rings based on audio level */}
                {[1, 2, 3].map((ring) => (
                  <motion.div
                    key={ring}
                    className="absolute inset-0 rounded-full border border-gold-500/30"
                    animate={{
                      scale: [1, 1 + audioLevel * 0.3 * ring],
                      opacity: [0.4, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      delay: ring * 0.2,
                      repeat: Infinity,
                    }}
                  />
                ))}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={stopAndIdentify}
                  className="w-20 h-20 rounded-full flex items-center justify-center relative z-10"
                  style={{
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    boxShadow: '0 8px 40px rgba(239,68,68,0.4)',
                  }}
                >
                  <Square className="w-7 h-7 text-white" />
                </motion.button>
              </motion.div>

              <h2 className="text-xl font-bold text-night-100 mb-2">Listening...</h2>
              <p className="text-night-400 text-sm mb-6">Recite clearly, then tap stop</p>

              {/* Live transcript */}
              {transcript && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl max-w-sm w-full"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <p className="text-gold-300/80 text-lg font-arabic text-center leading-relaxed" dir="rtl">
                    {transcript}
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Identifying State */}
          {phase === 'identifying' && (
            <motion.div
              key="identifying"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center"
            >
              <Loader2 className="w-12 h-12 text-gold-400 animate-spin mb-6" />
              <h2 className="text-xl font-bold text-night-100 mb-2">Searching the Quran...</h2>
              <p className="text-night-400 text-sm">Matching against all 6,236 verses</p>
            </motion.div>
          )}

          {/* Results */}
          {phase === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-md"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-night-100 mb-1">Found it!</h2>
                <p className="text-night-400 text-sm">{matches.length} match{matches.length !== 1 ? 'es' : ''}</p>
              </div>

              <div className="space-y-3">
                {matches.map((match, i) => (
                  <motion.div
                    key={`${match.surahNumber}-${match.ayahNumber}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      href={`/mushaf?surah=${match.surahNumber}&ayah=${match.ayahNumber}`}
                      className="block p-5 rounded-2xl transition-all hover:scale-[1.01]"
                      style={{
                        background: i === 0
                          ? 'linear-gradient(135deg, rgba(201,162,39,0.12), rgba(201,162,39,0.04))'
                          : 'rgba(255,255,255,0.03)',
                        border: i === 0
                          ? '1px solid rgba(201,162,39,0.3)'
                          : '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{
                              background: i === 0 ? 'rgba(201,162,39,0.2)' : 'rgba(255,255,255,0.06)',
                            }}
                          >
                            <span className={`text-sm font-mono ${i === 0 ? 'text-gold-400' : 'text-night-400'}`}>
                              {match.surahNumber}
                            </span>
                          </div>
                          <div>
                            <h3 className={`font-semibold ${i === 0 ? 'text-gold-300' : 'text-night-200'}`}>
                              {match.surahName}
                            </h3>
                            <p className="text-night-500 text-xs">Ayah {match.ayahNumber}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            match.similarity > 0.8 ? 'bg-emerald-500/20 text-emerald-400' :
                            match.similarity > 0.5 ? 'bg-amber-500/20 text-amber-400' :
                            'bg-night-800 text-night-400'
                          }`}>
                            {Math.round(match.similarity * 100)}%
                          </span>
                          <ExternalLink className="w-4 h-4 text-night-500" />
                        </div>
                      </div>
                      <p className="text-night-300 text-lg font-arabic leading-[2.5] text-center" dir="rtl">
                        {match.ayahText.slice(0, 150)}{match.ayahText.length > 150 ? '...' : ''}
                      </p>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={reset}
                  className="flex-1 py-3.5 rounded-xl border border-night-700 text-night-300 hover:bg-night-800/50 transition text-sm font-medium"
                >
                  Try Again
                </button>
                <Link
                  href={`/mushaf?surah=${matches[0]?.surahNumber}&ayah=${matches[0]?.ayahNumber}`}
                  className="flex-1 py-3.5 rounded-xl text-center text-sm font-medium"
                  style={{
                    background: 'linear-gradient(135deg, rgba(201,162,39,0.9), rgba(180,140,30,1))',
                    color: '#0a0a0f',
                  }}
                >
                  Open in Mushaf
                </Link>
              </div>
            </motion.div>
          )}

          {/* Error */}
          {phase === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                <Volume2 className="w-7 h-7 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-night-100 mb-2">Couldn&apos;t identify</h2>
              <p className="text-night-400 mb-8 max-w-sm">{errorMsg}</p>
              <button
                onClick={reset}
                className="px-8 py-3.5 rounded-xl font-medium"
                style={{
                  background: 'linear-gradient(135deg, rgba(201,162,39,0.9), rgba(180,140,30,1))',
                  color: '#0a0a0f',
                }}
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
}
