'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, SkipBack, SkipForward, Repeat, Volume2, VolumeX, 
  Gauge, Download, Mic, Wifi, WifiOff, ChevronDown, Check,
  RotateCcw
} from 'lucide-react';
import { getAyahAudioUrl } from '@/lib/quran';
import { 
  preloadNextAyahs, 
  downloadSurahForOffline, 
  isAyahCached,
  detectNetworkQuality,
  getCacheStats,
  type AudioQuality 
} from '@/lib/audioPreload';
import { 
  useSettings, 
  RECITERS, 
  AUDIO_QUALITY_OPTIONS,
  type AudioQuality as SettingsAudioQuality 
} from '@/lib/settings';
import { playReciterPreview, stopReciterPreview, isPreviewPlaying } from '@/lib/quranAudioService';

// ============================================
// Types
// ============================================

interface AudioPlayerProps {
  surah: number;
  ayah: number;
  reciter?: string;
  onEnded?: () => void;
  autoPlay?: boolean;
  showControls?: boolean;
  totalAyahs?: number;
  onAyahChange?: (ayah: number) => void;
}

type RepeatMode = 1 | 3 | 5 | 10 | 'infinite';

// ============================================
// Main Audio Player Component
// ============================================

export function AudioPlayer({
  surah,
  ayah,
  reciter: propReciter,
  onEnded,
  autoPlay = false,
  showControls = true,
  totalAyahs,
  onAyahChange
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { settings, update } = useSettings();
  
  // Use prop reciter or settings
  const reciter = propReciter || settings.reciter;
  
  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(1);
  const [repeatCount, setRepeatCount] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(settings.playbackSpeed);
  const [volume, setVolume] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showReciterPicker, setShowReciterPicker] = useState(false);
  const [showQualityPicker, setShowQualityPicker] = useState(false);
  const [isCached, setIsCached] = useState(false);
  const [networkQuality, setNetworkQuality] = useState<AudioQuality>('high');
  const [previewingReciter, setPreviewingReciter] = useState<string | null>(null);

  // Get effective quality
  const effectiveQuality: AudioQuality = settings.audioQuality === 'auto' 
    ? networkQuality 
    : settings.audioQuality as AudioQuality;

  const audioUrl = getAyahAudioUrl(surah, ayah, reciter);

  // Check cache status and network quality
  useEffect(() => {
    isAyahCached(surah, ayah, reciter, effectiveQuality).then(setIsCached);
    setNetworkQuality(detectNetworkQuality());
  }, [surah, ayah, reciter, effectiveQuality]);

  // Auto-preload next ayahs when playing
  useEffect(() => {
    if (isPlaying && settings.autoPreload && totalAyahs) {
      preloadNextAyahs(surah, ayah, totalAyahs, reciter, effectiveQuality, 3);
    }
  }, [isPlaying, surah, ayah, reciter, effectiveQuality, totalAyahs, settings.autoPreload]);

  // Auto-play effect
  useEffect(() => {
    if (audioRef.current && autoPlay) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [autoPlay, surah, ayah]);

  // Playback rate sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Volume sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handlers
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsLoading(false);
    }
  }, []);

  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
  }, []);

  const handleCanPlay = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleEnded = useCallback(() => {
    if (repeatMode === 'infinite' || repeatCount + 1 < repeatMode) {
      setRepeatCount(prev => prev + 1);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      setRepeatCount(0);
      setIsPlaying(false);
      onEnded?.();
    }
  }, [repeatMode, repeatCount, onEnded]);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const skipBack = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
    }
  }, []);

  const skipForward = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 5);
    }
  }, [duration]);

  const cycleRepeatMode = useCallback(() => {
    const modes: RepeatMode[] = [1, 3, 5, 10, 'infinite'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
    setRepeatCount(0);
  }, [repeatMode]);

  const cyclePlaybackRate = useCallback(() => {
    const rates = [0.5, 0.75, 1, 1.25, 1.5];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    const newRate = rates[nextIndex];
    setPlaybackRate(newRate);
    update({ playbackSpeed: newRate });
  }, [playbackRate, update]);

  const handleReciterChange = useCallback((newReciterId: string) => {
    update({ reciter: newReciterId });
    setShowReciterPicker(false);
    stopReciterPreview();
    setPreviewingReciter(null);
  }, [update]);

  const handleQualityChange = useCallback((newQuality: SettingsAudioQuality) => {
    update({ audioQuality: newQuality });
    setShowQualityPicker(false);
  }, [update]);

  const handleReciterPreview = useCallback((reciterId: string) => {
    if (previewingReciter === reciterId) {
      stopReciterPreview();
      setPreviewingReciter(null);
    } else {
      setPreviewingReciter(reciterId);
      playReciterPreview(reciterId, () => {
        setPreviewingReciter(null);
      });
    }
  }, [previewingReciter]);

  const formatTime = (time: number): string => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const currentReciter = RECITERS.find(r => r.id === reciter) || RECITERS[0];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl p-5 relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(28,33,40,0.92) 0%, rgba(22,27,34,0.96) 100%)',
        backdropFilter: 'blur(48px) saturate(180%)',
        WebkitBackdropFilter: 'blur(48px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15), 0 12px 40px rgba(0,0,0,0.12)',
      }}
    >
      {/* Animated background glow when playing */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-gold-500/10 via-transparent to-transparent"
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-night-900/50 z-20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <RotateCcw className="w-6 h-6 text-gold-400" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onEnded={handleEnded}
        preload="auto"
      />

      {showControls && (
        <div className="relative z-10">
          {/* Reciter & Quality Info Bar */}
          <div className="flex items-center justify-between mb-4 text-sm">
            {/* Reciter Selector */}
            <button
              onClick={() => setShowReciterPicker(!showReciterPicker)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg liquid-glass-subtle hover:bg-night-700/50 transition-colors"
            >
              <Mic className="w-3.5 h-3.5 text-gold-400" />
              <span className="text-night-200 truncate max-w-[140px]">{currentReciter.name}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-night-400 transition-transform ${showReciterPicker ? 'rotate-180' : ''}`} />
            </button>

            {/* Status indicators */}
            <div className="flex items-center gap-2">
              {/* Cache indicator */}
              {isCached && (
                <span className="text-xs text-sage-400 flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  Cached
                </span>
              )}
              
              {/* Quality indicator */}
              <button
                onClick={() => setShowQualityPicker(!showQualityPicker)}
                className="flex items-center gap-1 px-2 py-1 rounded-md liquid-glass-subtle hover:bg-night-700/50 transition-colors"
              >
                {settings.audioQuality === 'auto' ? (
                  networkQuality === 'high' ? <Wifi className="w-3.5 h-3.5 text-sage-400" /> : <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                ) : null}
                <span className="text-xs text-night-400 uppercase">{effectiveQuality}</span>
              </button>
            </div>
          </div>

          {/* Reciter Picker Dropdown */}
          <AnimatePresence>
            {showReciterPicker && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 overflow-hidden"
              >
                <div className="liquid-glass-strong rounded-xl p-2 space-y-1 max-h-60 overflow-y-auto">
                  {RECITERS.map((r) => (
                    <div
                      key={r.id}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                        r.id === reciter ? 'bg-gold-500/10 border border-gold-500/30' : 'hover:bg-night-700/50'
                      }`}
                    >
                      <div 
                        className="flex-1"
                        onClick={() => handleReciterChange(r.id)}
                      >
                        <p className="text-night-100 text-sm font-medium">{r.name}</p>
                        <p className="text-night-500 text-xs">{r.arabicName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Preview button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReciterPreview(r.id);
                          }}
                          className={`p-1.5 rounded-full transition-colors ${
                            previewingReciter === r.id 
                              ? 'bg-gold-500 text-night-950' 
                              : 'bg-night-700/50 text-night-300 hover:bg-night-600/50'
                          }`}
                          title="Preview reciter"
                        >
                          {previewingReciter === r.id ? (
                            <Pause className="w-3 h-3" />
                          ) : (
                            <Play className="w-3 h-3" />
                          )}
                        </button>
                        
                        {r.id === reciter && (
                          <div className="w-5 h-5 rounded-full bg-gold-500 flex items-center justify-center">
                            <Check className="w-3 h-3 text-night-950" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quality Picker Dropdown */}
          <AnimatePresence>
            {showQualityPicker && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 overflow-hidden"
              >
                <div className="liquid-glass-strong rounded-xl p-2 space-y-1">
                  {AUDIO_QUALITY_OPTIONS.map((q) => (
                    <button
                      key={q.value}
                      onClick={() => handleQualityChange(q.value)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        settings.audioQuality === q.value 
                          ? 'bg-gold-500/10 border border-gold-500/30' 
                          : 'hover:bg-night-700/50'
                      }`}
                    >
                      <div className="text-left">
                        <p className="text-night-100 text-sm font-medium">{q.label}</p>
                        <p className="text-night-500 text-xs">{q.description}</p>
                      </div>
                      {settings.audioQuality === q.value && (
                        <div className="w-5 h-5 rounded-full bg-gold-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-night-950" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress Bar - Liquid Glass Style */}
          <div className="mb-5">
            <div className="relative h-2 rounded-full overflow-hidden"
              style={{
                background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              {/* Progress fill with animated gradient */}
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, rgba(201,162,39,0.8) 0%, rgba(201,162,39,1) 50%, rgba(220,180,50,1) 100%)',
                  boxShadow: isPlaying ? '0 0 20px rgba(201,162,39,0.5)' : '0 0 12px rgba(201,162,39,0.3)',
                }}
                transition={{ duration: 0.1 }}
              />
              
              {/* Interactive slider overlay */}
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Audio progress"
                aria-valuemin={0}
                aria-valuemax={duration || 0}
                aria-valuenow={currentTime}
                aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
              />
            </div>
            
            <div className="flex justify-between text-xs text-night-500 mt-2 font-medium">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-center gap-3 mb-5">
            {/* Skip Back */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={skipBack}
              className="liquid-icon-btn"
              aria-label="Skip back 5 seconds"
            >
              <SkipBack className="w-5 h-5" />
            </motion.button>

            {/* Play/Pause - Prominent Center Button */}
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={togglePlay}
              disabled={isLoading}
              className="relative w-16 h-16 rounded-full flex items-center justify-center disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, rgba(212,175,55,1) 0%, rgba(201,162,39,1) 50%, rgba(180,140,30,1) 100%)',
                boxShadow: isPlaying 
                  ? '0 0 32px rgba(201,162,39,0.5), 0 8px 24px rgba(0,0,0,0.25)'
                  : '0 4px 20px rgba(201,162,39,0.35), 0 8px 24px rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.2)',
                transition: 'box-shadow 0.3s ease',
              }}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {/* Pulsing ring when playing */}
              {isPlaying && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-gold-400"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
              
              <AnimatePresence mode="wait">
                {isPlaying ? (
                  <motion.div
                    key="pause"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Pause className="w-7 h-7 text-night-950" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="play"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Play className="w-7 h-7 text-night-950 ml-1" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Skip Forward */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={skipForward}
              className="liquid-icon-btn"
              aria-label="Skip forward 5 seconds"
            >
              <SkipForward className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Secondary Controls - Liquid Glass Pills */}
          <div className="flex items-center justify-between">
            {/* Repeat Mode */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={cycleRepeatMode}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                repeatMode !== 1 
                  ? 'liquid-glass-gold text-gold-300' 
                  : 'liquid-glass-subtle text-night-400 hover:text-night-200'
              }`}
              aria-label={`Repeat mode: ${repeatMode === 'infinite' ? 'infinite' : repeatMode + ' times'}. Click to change.`}
              aria-pressed={repeatMode !== 1}
            >
              <Repeat className="w-4 h-4" aria-hidden="true" />
              <span>{repeatMode === 'infinite' ? '∞' : `${repeatMode}x`}</span>
              {repeatMode !== 1 && repeatCount > 0 && (
                <span className="text-xs opacity-70 ml-1" aria-live="polite">
                  ({repeatCount + 1}/{repeatMode === 'infinite' ? '∞' : repeatMode})
                </span>
              )}
            </motion.button>

            {/* Playback Speed */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={cyclePlaybackRate}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                playbackRate !== 1 
                  ? 'liquid-glass-gold text-gold-300' 
                  : 'liquid-glass-subtle text-night-400 hover:text-night-200'
              }`}
              aria-label={`Playback speed: ${playbackRate}x. Click to change.`}
            >
              <Gauge className="w-4 h-4" aria-hidden="true" />
              <span>{playbackRate}x</span>
            </motion.button>

            {/* Volume */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                className="liquid-icon-btn"
                aria-label={volume === 0 ? 'Volume muted. Click to adjust.' : `Volume ${Math.round(volume * 100)}%. Click to adjust.`}
                aria-expanded={showVolumeSlider}
                aria-controls="volume-slider"
              >
                {volume === 0 ? (
                  <VolumeX className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Volume2 className="w-4 h-4" aria-hidden="true" />
                )}
              </motion.button>

              {/* Volume Slider Popup */}
              <AnimatePresence>
                {showVolumeSlider && (
                  <motion.div
                    id="volume-slider"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute bottom-full right-0 mb-2 p-3 liquid-glass-strong rounded-xl"
                    role="group"
                    aria-label="Volume control"
                  >
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="w-24 h-1.5 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, rgba(201,162,39,0.8) 0%, rgba(201,162,39,0.8) ${volume * 100}%, rgba(255,255,255,0.1) ${volume * 100}%, rgba(255,255,255,0.1) 100%)`,
                      }}
                      aria-label="Volume"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round(volume * 100)}
                      aria-valuetext={`${Math.round(volume * 100)}%`}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ============================================
// Simple Play Button Component
// ============================================

export function PlayButton({
  surah,
  ayah,
  reciter = 'alafasy',
  size = 'md'
}: {
  surah: number;
  ayah: number;
  reciter?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioUrl = getAyahAudioUrl(surah, ayah, reciter);

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const toggle = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={() => setIsPlaying(false)}
      />
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggle}
        className={`${sizes[size]} rounded-xl flex items-center justify-center transition-all duration-300 ${
          isPlaying 
            ? 'liquid-glass-gold' 
            : 'liquid-glass-subtle hover:border-gold-500/30'
        }`}
        style={{
          boxShadow: isPlaying ? '0 0 20px rgba(201,162,39,0.3)' : undefined,
        }}
        aria-label={isPlaying ? 'Pause recitation' : 'Play recitation'}
        aria-pressed={isPlaying}
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="pause"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <Pause className={`${iconSizes[size]} text-gold-400`} aria-hidden="true" />
            </motion.div>
          ) : (
            <motion.div
              key="play"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <Play className={`${iconSizes[size]} text-gold-400 ml-0.5`} aria-hidden="true" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}

// ============================================
// Download Button Component
// ============================================

export function DownloadSurahButton({
  surah,
  totalAyahs,
  reciter = 'alafasy',
  quality = 'high' as AudioQuality,
  className = ''
}: {
  surah: number;
  totalAyahs: number;
  reciter?: string;
  quality?: AudioQuality;
  className?: string;
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState({ loaded: 0, total: 0 });

  const handleDownload = async () => {
    setIsDownloading(true);
    setProgress({ loaded: 0, total: totalAyahs });

    try {
      await downloadSurahForOffline(surah, totalAyahs, reciter, quality, (status) => {
        setProgress({ loaded: status.loaded, total: status.total });
      });
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const progressPercent = progress.total > 0 ? (progress.loaded / progress.total) * 100 : 0;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleDownload}
      disabled={isDownloading}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl liquid-glass-subtle hover:bg-night-700/50 transition-colors disabled:opacity-50 ${className}`}
    >
      {isDownloading ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Download className="w-4 h-4 text-gold-400" />
          </motion.div>
          <span className="text-sm text-night-200">
            {Math.round(progressPercent)}%
          </span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4 text-gold-400" />
          <span className="text-sm text-night-200">Download for Offline</span>
        </>
      )}
    </motion.button>
  );
}

// ============================================
// Cache Stats Component
// ============================================

export function CacheStatsDisplay() {
  const [stats, setStats] = useState<{
    totalSizeMB: string;
    itemCount: number;
    memoryItems: number;
  } | null>(null);

  useEffect(() => {
    getCacheStats().then(setStats);
  }, []);

  if (!stats) return null;

  return (
    <div className="text-xs text-night-500 space-y-1">
      <p>Cached: {stats.totalSizeMB} MB ({stats.itemCount} files)</p>
      <p>In memory: {stats.memoryItems} files</p>
    </div>
  );
}
