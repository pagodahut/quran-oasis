'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Repeat, Volume2, VolumeX, Gauge } from 'lucide-react';
import { getAyahAudioUrl } from '@/lib/quran';

interface AudioPlayerProps {
  surah: number;
  ayah: number;
  reciter?: string;
  onEnded?: () => void;
  autoPlay?: boolean;
  showControls?: boolean;
}

type RepeatMode = 1 | 3 | 5 | 10 | 'infinite';

export function AudioPlayer({
  surah,
  ayah,
  reciter = 'alafasy',
  onEnded,
  autoPlay = false,
  showControls = true
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(1);
  const [repeatCount, setRepeatCount] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const audioUrl = getAyahAudioUrl(surah, ayah, reciter);

  useEffect(() => {
    if (audioRef.current && autoPlay) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [autoPlay, surah, ayah]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
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
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const skipBack = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 5);
    }
  };

  const cycleRepeatMode = () => {
    const modes: RepeatMode[] = [1, 3, 5, 10, 'infinite'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
    setRepeatCount(0);
  };

  const cyclePlaybackRate = () => {
    const rates = [0.5, 0.75, 1, 1.25, 1.5];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    setPlaybackRate(rates[nextIndex]);
  };

  const formatTime = (time: number): string => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="liquid-glass-strong rounded-3xl p-5 relative overflow-hidden"
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

      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {showControls && (
        <div className="relative z-10">
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlay}
              className="relative w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(201,162,39,0.95) 0%, rgba(180,140,30,1) 100%)',
                boxShadow: isPlaying 
                  ? '0 0 40px rgba(201,162,39,0.6), 0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)'
                  : '0 4px 24px rgba(201,162,39,0.4), 0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)',
                border: '1px solid rgba(255,255,255,0.2)',
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
            >
              <Repeat className="w-4 h-4" />
              <span>{repeatMode === 'infinite' ? '∞' : `${repeatMode}x`}</span>
              {repeatMode !== 1 && repeatCount > 0 && (
                <span className="text-xs opacity-70 ml-1">
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
            >
              <Gauge className="w-4 h-4" />
              <span>{playbackRate}x</span>
            </motion.button>

            {/* Volume */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                className="liquid-icon-btn"
              >
                {volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </motion.button>

              {/* Volume Slider Popup */}
              <AnimatePresence>
                {showVolumeSlider && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute bottom-full right-0 mb-2 p-3 liquid-glass-strong rounded-xl"
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

// Simple play button for inline use - Enhanced with Liquid Glass
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
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="pause"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <Pause className={`${iconSizes[size]} text-gold-400`} />
            </motion.div>
          ) : (
            <motion.div
              key="play"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <Play className={`${iconSizes[size]} text-gold-400 ml-0.5`} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
