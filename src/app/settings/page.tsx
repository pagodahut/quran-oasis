'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft,
  Headphones,
  Languages,
  Target,
  Palette,
  RotateCcw,
  AlertCircle,
  Check,
  Info,
  Heart,
  Moon,
  Type,
  Volume2,
  Play,
  Clock,
  Bell,
  Download,
  Trash2,
  HardDrive,
  Cloud,
  CloudOff,
  Eye,
  EyeOff,
  Gauge,
  ChevronRight,
  Sparkles,
  BookOpen,
  GraduationCap,
  Brain,
  Star,
} from 'lucide-react';
import { 
  usePreferences,
  RECITERS,
  TRANSLATIONS,
  FONT_SIZE_OPTIONS,
  ARABIC_FONT_STYLE_OPTIONS,
  PLAYBACK_SPEED_OPTIONS,
  DAILY_GOAL_OPTIONS,
  exportPreferences,
  importPreferences,
  clearAllLocalData,
  getStorageUsage,
  type FontSize,
  type ArabicFontStyle,
  type PlaybackSpeed,
} from '@/lib/preferencesStore';
import BottomNav from '@/components/BottomNav';
import { setDailyGoal } from '@/lib/motivationStore';
import { useLearningMode } from '@/hooks/useLearningMode';
import { LearningMode, LEARNING_MODE_OPTIONS } from '@/lib/learningMode';

// ============================================
// Components
// ============================================

function SettingSection({ 
  icon: Icon, 
  title, 
  description,
  iconColor = 'text-gold-400',
  iconBg = 'bg-gold-500/10',
  children,
  collapsible = false,
  defaultOpen = true,
}: { 
  icon: React.ElementType;
  title: string;
  description?: string;
  iconColor?: string;
  iconBg?: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="space-y-4">
      <button
        onClick={() => collapsible && setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-3 ${collapsible ? 'cursor-pointer' : 'cursor-default'}`}
        disabled={!collapsible}
      >
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="flex-1 text-left">
          <h2 className="font-semibold text-night-100">{title}</h2>
          {description && <p className="text-xs text-night-500">{description}</p>}
        </div>
        {collapsible && (
          <ChevronRight className={`w-5 h-5 text-night-500 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
        )}
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="ml-0 md:ml-13">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ReciterOption({ 
  reciter, 
  selected, 
  onSelect 
}: { 
  reciter: typeof RECITERS[0];
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full p-4 rounded-xl text-left transition-all ${
        selected 
          ? 'bg-gold-500/10 border-2 border-gold-500/50' 
          : 'bg-night-800/50 border-2 border-transparent hover:border-night-700'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-night-100">{reciter.name}</p>
            {reciter.listenOnly && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-medium uppercase tracking-wide">
                Listen Only
              </span>
            )}
          </div>
          <p className="text-sm text-night-500 mt-0.5">
            <span 
              className="text-gold-400/70"
              style={{ fontFamily: 'var(--font-arabic)' }}
            >
              {reciter.arabicName}
            </span>
            <span className="mx-2">•</span>
            {reciter.style}
          </p>
          {reciter.listenOnly && (
            <p className="text-xs text-amber-500/70 mt-1">Full surah playback only</p>
          )}
        </div>
        {selected && (
          <div className="w-6 h-6 rounded-full bg-gold-500 flex items-center justify-center flex-shrink-0">
            <Check className="w-4 h-4 text-night-950" />
          </div>
        )}
      </div>
    </button>
  );
}

function ToggleSwitch({ 
  enabled, 
  onToggle,
  label 
}: { 
  enabled: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-12 h-7 rounded-full transition-colors focus-visible-ring ${
        enabled ? 'bg-gold-500' : 'bg-night-700'
      }`}
      role="switch"
      aria-checked={enabled}
      aria-label={label}
    >
      <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
        enabled ? 'left-6' : 'left-1'
      }`} />
    </button>
  );
}

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-night-800/50">
      <div className="flex-1 mr-4">
        <p className="text-night-100">{label}</p>
        {description && <p className="text-xs text-night-500 mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function SelectGrid<T extends string | number>({
  options,
  value,
  onChange,
  columns = 3,
}: {
  options: { value: T; label: string; description?: string }[];
  value: T;
  onChange: (value: T) => void;
  columns?: 2 | 3 | 4;
}) {
  const colClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }[columns];
  
  return (
    <div className={`grid ${colClass} gap-2`}>
      {options.map((option) => (
        <button
          key={String(option.value)}
          onClick={() => onChange(option.value)}
          className={`p-3 rounded-xl text-center transition-all ${
            value === option.value 
              ? 'bg-gold-500/10 border-2 border-gold-500/50' 
              : 'bg-night-800/50 border-2 border-transparent hover:border-night-700'
          }`}
        >
          <p className="font-semibold text-night-100">{option.label}</p>
          {option.description && (
            <p className="text-xs text-night-500 mt-0.5">{option.description}</p>
          )}
        </button>
      ))}
    </div>
  );
}

// ============================================
// Main Component
// ============================================

export default function SettingsPage() {
  const { preferences, update, reset, isLoaded } = usePreferences();
  const { mode: learningMode, setMode: setLearningMode, config: learningModeConfig } = useLearningMode();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showClearDataConfirm, setShowClearDataConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [storageUsage, setStorageUsage] = useState({ used: 0, total: 0, percentage: 0 });

  useEffect(() => {
    setStorageUsage(getStorageUsage());
  }, []);

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 2000);
  };

  const handleReciterChange = (reciterId: string) => {
    update('audio', { reciter: reciterId });
    showSuccess('Reciter updated');
  };

  const handleTranslationChange = (translationId: 'sahih' | 'asad') => {
    update('display', { translation: translationId });
    showSuccess('Translation updated');
  };

  const handleDailyGoalChange = (type: 'minutes' | 'verses', value: number) => {
    if (type === 'minutes') {
      update('learning', { dailyGoalMinutes: value });
    } else {
      update('learning', { dailyGoalVerses: value });
      // Sync to motivation store
      setDailyGoal('verses', value);
    }
    showSuccess('Daily goal updated');
  };

  const handleFontSizeChange = (size: FontSize) => {
    update('display', { arabicFontSize: size });
    showSuccess('Font size updated');
  };

  const handlePlaybackSpeedChange = (speed: PlaybackSpeed) => {
    update('audio', { playbackSpeed: speed });
    showSuccess('Playback speed updated');
  };

  const handleVolumeChange = (volume: number) => {
    update('audio', { volume: volume / 100 });
  };

  const handleExport = () => {
    const data = exportPreferences();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hifz-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showSuccess('Settings exported');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const text = await file.text();
      if (importPreferences(text)) {
        showSuccess('Settings imported');
      } else {
        showSuccess('Failed to import settings');
      }
    };
    input.click();
  };

  const handleReset = () => {
    reset();
    setShowResetConfirm(false);
    showSuccess('Settings reset to defaults');
  };

  const handleClearData = () => {
    clearAllLocalData();
    setShowClearDataConfirm(false);
    setStorageUsage(getStorageUsage());
    showSuccess('All local data cleared');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-night-950 flex items-center justify-center">
        <div className="animate-pulse text-gold-400">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-night-950">
      {/* Success Toast */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 
                      px-4 py-2 rounded-full bg-sage-500 text-white 
                      text-sm font-medium flex items-center gap-2 shadow-lg"
          >
            <Check className="w-4 h-4" />
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="liquid-glass sticky top-0 z-40 safe-area-top">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/profile" className="btn-icon">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-display text-xl text-night-100">Settings</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-6 pb-40 space-y-8 max-w-2xl mx-auto">
        
        {/* ============ AUDIO & RECITER ============ */}
        <SettingSection 
          icon={Headphones} 
          title="Audio & Reciter"
          description="Configure audio playback settings"
        >
          <div className="space-y-6">
            {/* Reciter Selection */}
            <div>
              <label className="text-sm text-night-400 mb-3 block">Choose Reciter</label>
              <div className="space-y-3">
                {RECITERS.map((reciter) => (
                  <ReciterOption
                    key={reciter.id}
                    reciter={reciter}
                    selected={preferences.audio.reciter === reciter.id}
                    onSelect={() => handleReciterChange(reciter.id)}
                  />
                ))}
              </div>
            </div>

            {/* Playback Speed */}
            <div>
              <label className="text-sm text-night-400 mb-3 block flex items-center gap-2">
                <Gauge className="w-4 h-4" />
                Playback Speed
              </label>
              <SelectGrid
                options={PLAYBACK_SPEED_OPTIONS}
                value={preferences.audio.playbackSpeed}
                onChange={(speed) => handlePlaybackSpeedChange(speed as PlaybackSpeed)}
                columns={3}
              />
            </div>

            {/* Volume */}
            <div className="p-4 rounded-xl bg-night-800/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-night-400" />
                  <span className="text-night-100">Volume</span>
                </div>
                <span className="text-night-400 text-sm">{Math.round(preferences.audio.volume * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={preferences.audio.volume * 100}
                onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Auto-play */}
            <SettingRow
              label="Auto-play on Lesson Start"
              description="Automatically play audio when starting a lesson"
            >
              <ToggleSwitch
                enabled={preferences.audio.autoPlayOnLesson}
                onToggle={() => update('audio', { autoPlayOnLesson: !preferences.audio.autoPlayOnLesson })}
                label="Auto-play on lesson start"
              />
            </SettingRow>

            {/* Audio Quality */}
            <div>
              <label className="text-sm text-night-400 mb-3 block flex items-center gap-2">
                <Cloud className="w-4 h-4" />
                Audio Quality
              </label>
              <SelectGrid
                options={[
                  { value: 'auto' as const, label: 'Auto', description: 'Adapts to network' },
                  { value: 'high' as const, label: 'High', description: '128-192 kbps' },
                  { value: 'medium' as const, label: 'Medium', description: '64 kbps' },
                  { value: 'low' as const, label: 'Low', description: 'Save data' },
                ]}
                value={preferences.audio.audioQuality || 'auto'}
                onChange={(quality) => update('audio', { audioQuality: quality })}
                columns={4}
              />
            </div>

            {/* Smart Preloading */}
            <SettingRow
              label="Smart Audio Preloading"
              description="Preload upcoming ayahs for seamless playback"
            >
              <ToggleSwitch
                enabled={preferences.audio.autoPreload !== false}
                onToggle={() => update('audio', { autoPreload: !preferences.audio.autoPreload })}
                label="Smart audio preloading"
              />
            </SettingRow>

            {/* Gapless Playback */}
            <SettingRow
              label="Gapless Playback"
              description="No gaps between ayahs during continuous play"
            >
              <ToggleSwitch
                enabled={preferences.audio.gaplessPlayback !== false}
                onToggle={() => update('audio', { gaplessPlayback: !preferences.audio.gaplessPlayback })}
                label="Gapless playback"
              />
            </SettingRow>

            {/* Crossfade */}
            <div className="space-y-3">
              <SettingRow
                label="Crossfade Between Ayahs"
                description="Smooth audio transition effect"
              >
                <ToggleSwitch
                  enabled={preferences.audio.crossfadeEnabled === true}
                  onToggle={() => update('audio', { crossfadeEnabled: !preferences.audio.crossfadeEnabled })}
                  label="Crossfade between ayahs"
                />
              </SettingRow>
              
              {preferences.audio.crossfadeEnabled && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 rounded-xl bg-night-800/30 ml-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-night-300">Crossfade Duration</span>
                    <span className="text-night-400 text-sm">{preferences.audio.crossfadeDuration || 500}ms</span>
                  </div>
                  <input
                    type="range"
                    min={200}
                    max={2000}
                    step={100}
                    value={preferences.audio.crossfadeDuration || 500}
                    onChange={(e) => update('audio', { crossfadeDuration: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </motion.div>
              )}
            </div>
          </div>
        </SettingSection>

        <div className="liquid-divider" />

        {/* ============ DISPLAY SETTINGS ============ */}
        <SettingSection 
          icon={Palette} 
          title="Display"
          description="Customize how content appears"
          iconColor="text-purple-400"
          iconBg="bg-purple-500/10"
        >
          <div className="space-y-6">
            {/* Arabic Font Size */}
            <div>
              <label className="text-sm text-night-400 mb-3 block flex items-center gap-2">
                <Type className="w-4 h-4" />
                Arabic Font Size
              </label>
              <SelectGrid
                options={FONT_SIZE_OPTIONS.map(opt => ({
                  value: opt.value,
                  label: opt.label,
                  description: `${opt.px}px`,
                }))}
                value={preferences.display.arabicFontSize}
                onChange={handleFontSizeChange}
                columns={4}
              />
              {/* Preview */}
              <div className="mt-4 p-4 rounded-xl bg-night-900/50 text-center">
                <p 
                  className="text-gold-400"
                  style={{ 
                    fontFamily: ARABIC_FONT_STYLE_OPTIONS.find(f => f.value === preferences.display.arabicFontStyle)?.fontFamily || 'var(--font-arabic)', 
                    fontSize: preferences.display.arabicFontSizePx,
                    direction: 'rtl'
                  }}
                  lang="ar"
                  dir="rtl"
                >
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
              </div>
            </div>

            {/* Arabic Font Style */}
            <div>
              <label className="text-sm text-night-400 mb-3 block flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Arabic Script Style
              </label>
              <div className="grid grid-cols-2 gap-3">
                {ARABIC_FONT_STYLE_OPTIONS.map((font) => (
                  <button
                    key={font.value}
                    onClick={() => update('display', { arabicFontStyle: font.value })}
                    className={`p-4 rounded-xl text-left transition-all ${
                      preferences.display.arabicFontStyle === font.value 
                        ? 'bg-gold-500/10 border-2 border-gold-500/50' 
                        : 'bg-night-800/50 border-2 border-transparent hover:border-night-700'
                    }`}
                  >
                    <p className="font-medium text-night-100">{font.label}</p>
                    <p 
                      className="text-gold-400 text-xl mt-2"
                      style={{ fontFamily: font.fontFamily, direction: 'rtl' }}
                      lang="ar"
                      dir="rtl"
                    >
                      {font.arabicSample}
                    </p>
                    <p className="text-xs text-night-500 mt-2">{font.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Translation Toggle */}
            <SettingRow
              label="Show Translation"
              description="Display English translation below verses"
            >
              <ToggleSwitch 
                enabled={preferences.display.showTranslation}
                onToggle={() => update('display', { showTranslation: !preferences.display.showTranslation })}
                label="Show translation"
              />
            </SettingRow>

            {/* Translation Selection */}
            {preferences.display.showTranslation && (
              <div>
                <label className="text-sm text-night-400 mb-3 block">Translation</label>
                <div className="grid grid-cols-2 gap-3">
                  {TRANSLATIONS.map((trans) => (
                    <button
                      key={trans.id}
                      onClick={() => handleTranslationChange(trans.id as 'sahih' | 'asad')}
                      className={`p-4 rounded-xl text-left transition-all ${
                        preferences.display.translation === trans.id 
                          ? 'bg-gold-500/10 border-2 border-gold-500/50' 
                          : 'bg-night-800/50 border-2 border-transparent hover:border-night-700'
                      }`}
                    >
                      <p className="font-medium text-night-100">{trans.name}</p>
                      <p className="text-xs text-night-500 mt-0.5">{trans.language}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Transliteration Toggle */}
            <SettingRow
              label="Show Transliteration"
              description="Display phonetic pronunciation guide"
            >
              <ToggleSwitch 
                enabled={preferences.display.showTransliteration}
                onToggle={() => update('display', { showTransliteration: !preferences.display.showTransliteration })}
                label="Show transliteration"
              />
            </SettingRow>

            {/* Theme */}
            <div className="p-4 rounded-xl bg-night-800/50">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-night-400" />
                <div className="flex-1">
                  <p className="text-night-100">Theme</p>
                  <p className="text-xs text-night-500">Dark mode only (light mode coming soon)</p>
                </div>
                <span className="px-3 py-1 rounded-lg bg-night-700 text-night-300 text-sm">
                  Dark
                </span>
              </div>
            </div>
          </div>
        </SettingSection>

        <div className="liquid-divider" />

        {/* ============ LEARNING MODE ============ */}
        <SettingSection 
          icon={GraduationCap} 
          title="Learning Mode"
          description="Control which features are shown"
          iconColor="text-gold-400"
          iconBg="bg-gold-500/10"
        >
          <div className="space-y-4">
            <p className="text-sm text-night-400 mb-3">
              Choose your experience level to show only the features you need.
            </p>
            
            <div className="space-y-3">
              {LEARNING_MODE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setLearningMode(option.id);
                    showSuccess(`Learning mode changed to ${option.label}`);
                  }}
                  className={`w-full p-4 rounded-xl text-left transition-all ${
                    learningMode === option.id 
                      ? 'bg-gold-500/10 border-2 border-gold-500/50' 
                      : 'bg-night-800/50 border-2 border-transparent hover:border-night-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        learningMode === option.id ? 'bg-gold-500/20' : 'bg-night-700/50'
                      }`}>
                        {option.id === 'beginner' && <BookOpen className={`w-5 h-5 ${learningMode === option.id ? 'text-gold-400' : 'text-night-400'}`} />}
                        {option.id === 'intermediate' && <Brain className={`w-5 h-5 ${learningMode === option.id ? 'text-gold-400' : 'text-night-400'}`} />}
                        {option.id === 'hafiz' && <Star className={`w-5 h-5 ${learningMode === option.id ? 'text-gold-400' : 'text-night-400'}`} />}
                      </div>
                      <div>
                        <p className="font-medium text-night-100">{option.label}</p>
                        <p className="text-xs text-night-500 mt-0.5">{option.shortDesc}</p>
                      </div>
                    </div>
                    {learningMode === option.id && (
                      <div className="w-6 h-6 rounded-full bg-gold-500 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-night-950" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            {/* Info about current mode */}
            <div className="flex items-start gap-2 p-3 rounded-xl bg-gold-500/10 border border-gold-500/20 mt-4">
              <Info className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gold-400">
                  {learningModeConfig.description}
                </p>
                <p className="text-xs text-night-500 mt-1">
                  {learningMode === 'beginner' && "All navigation tabs are visible: Home, Learn, Practice, Quran, Profile."}
                  {learningMode === 'intermediate' && "Navigation shows: Home, Practice, Quran, Profile. Learn tab is hidden."}
                  {learningMode === 'hafiz' && "Streamlined navigation: Home, Quran, Profile. Learn and Practice tabs are hidden."}
                </p>
              </div>
            </div>
          </div>
        </SettingSection>

        <div className="liquid-divider" />

        {/* ============ LEARNING SETTINGS ============ */}
        <SettingSection 
          icon={Target} 
          title="Learning Goals"
          description="Set your daily memorization targets"
          iconColor="text-sage-400"
          iconBg="bg-sage-500/10"
        >
          <div className="space-y-6">
            {/* Daily Goal - Verses */}
            <div>
              <label className="text-sm text-night-400 mb-3 block flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Daily Verse Goal
              </label>
              <SelectGrid
                options={DAILY_GOAL_OPTIONS.verses}
                value={preferences.learning.dailyGoalVerses}
                onChange={(v) => handleDailyGoalChange('verses', v)}
                columns={3}
              />
            </div>

            {/* Daily Goal - Time */}
            <div>
              <label className="text-sm text-night-400 mb-3 block flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Daily Time Goal
              </label>
              <SelectGrid
                options={DAILY_GOAL_OPTIONS.minutes}
                value={preferences.learning.dailyGoalMinutes}
                onChange={(v) => handleDailyGoalChange('minutes', v)}
                columns={3}
              />
            </div>

            {/* Info Tip */}
            <div className="flex items-start gap-2 p-3 rounded-xl bg-sage-500/10 border border-sage-500/20">
              <Info className="w-4 h-4 text-sage-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-sage-400">
                Consistency is key! Start with a manageable goal and increase as you build a habit.
                Your daily progress is tracked on your profile.
              </p>
            </div>

            {/* Notifications (future) */}
            <div className="opacity-60">
              <SettingRow
                label="Practice Reminders"
                description="Get reminded to practice daily (coming soon)"
              >
                <ToggleSwitch 
                  enabled={false}
                  onToggle={() => {}}
                  label="Practice reminders"
                />
              </SettingRow>
            </div>

            {preferences.learning.practiceReminders && (
              <div className="p-4 rounded-xl bg-night-800/50">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-night-400" />
                  <div className="flex-1">
                    <p className="text-night-100">Reminder Time</p>
                  </div>
                  <input
                    type="time"
                    value={preferences.learning.reminderTime}
                    onChange={(e) => update('learning', { reminderTime: e.target.value })}
                    className="bg-night-700 text-night-200 px-3 py-2 rounded-lg border border-night-600"
                  />
                </div>
              </div>
            )}
          </div>
        </SettingSection>

        <div className="liquid-divider" />

        {/* ============ DATA & PRIVACY ============ */}
        <SettingSection 
          icon={HardDrive} 
          title="Data & Privacy"
          description="Manage your data and storage"
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
        >
          <div className="space-y-4">
            {/* Storage Usage */}
            <div className="p-4 rounded-xl bg-night-800/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-night-300">Local Storage</span>
                <span className="text-sm text-night-500">
                  {(storageUsage.used / 1024).toFixed(1)} KB used
                </span>
              </div>
              <div className="h-2 bg-night-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-gold-500 to-gold-400 transition-all"
                  style={{ width: `${Math.min(storageUsage.percentage, 100)}%` }}
                />
              </div>
              <p className="text-xs text-night-600 mt-2">
                {storageUsage.percentage}% of available storage
              </p>
            </div>

            {/* Sync Status */}
            <div className="p-4 rounded-xl bg-night-800/50">
              <div className="flex items-center gap-3">
                <CloudOff className="w-5 h-5 text-night-500" />
                <div className="flex-1">
                  <p className="text-night-100">Cloud Sync</p>
                  <p className="text-xs text-night-500">Sign in to sync across devices (coming soon)</p>
                </div>
                <span className="px-3 py-1 rounded-lg bg-night-700 text-night-400 text-sm">
                  Offline
                </span>
              </div>
            </div>

            {/* Export/Import */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleExport}
                className="p-4 rounded-xl bg-night-800/50 hover:bg-night-800 transition-colors text-left"
              >
                <Download className="w-5 h-5 text-sage-400 mb-2" />
                <p className="text-night-100 font-medium">Export</p>
                <p className="text-xs text-night-500">Download settings</p>
              </button>
              <button
                onClick={handleImport}
                className="p-4 rounded-xl bg-night-800/50 hover:bg-night-800 transition-colors text-left"
              >
                <Sparkles className="w-5 h-5 text-purple-400 mb-2" />
                <p className="text-night-100 font-medium">Import</p>
                <p className="text-xs text-night-500">Restore settings</p>
              </button>
            </div>

            {/* Clear Local Data */}
            <button
              onClick={() => setShowClearDataConfirm(true)}
              className="w-full p-4 rounded-xl bg-red-500/10 border border-red-500/20 
                        text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-3"
            >
              <Trash2 className="w-5 h-5" />
              <div className="text-left">
                <p className="font-medium">Clear All Local Data</p>
                <p className="text-xs opacity-70">Remove all progress, bookmarks, and settings</p>
              </div>
            </button>
          </div>
        </SettingSection>

        <div className="liquid-divider" />

        {/* ============ RESET SETTINGS ============ */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <RotateCcw className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="font-semibold text-night-100">Reset Settings</h2>
              <p className="text-xs text-night-500">Return settings to defaults (keeps progress)</p>
            </div>
          </div>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 
                      text-amber-400 hover:bg-amber-500/20 transition-colors"
          >
            Reset All Settings
          </button>
        </div>

        <div className="liquid-divider" />

        {/* ============ ABOUT ============ */}
        <div className="space-y-4">
          <h2 className="font-semibold text-night-100 flex items-center gap-2">
            <Moon className="w-5 h-5 text-gold-400" />
            About <span className="tracking-wider">HIFZ</span>
          </h2>
          <div className="liquid-card p-4 space-y-4">
            <p className="text-night-400 text-sm leading-relaxed">
              <span className="text-gold-400 font-semibold tracking-wider">HIFZ</span> is a free, open-source Quran memorization app built with love for the Ummah. 
              It combines traditional Tahfiz methods with modern technology to help you on your journey to becoming a Hafiz.
            </p>
            
            <div className="flex items-center justify-center gap-2 text-night-500 text-sm">
              Made with <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> for the Ummah
            </div>

            <div className="pt-4 border-t border-night-800/50 space-y-3 text-sm">
              <p className="text-night-500">
                <span className="text-night-400">Version:</span> 1.0.0
              </p>
              <p className="text-night-500">
                <span className="text-night-400">Audio:</span> EveryAyah.com
              </p>
              <p className="text-night-500">
                <span className="text-night-400">Text:</span> Tanzil.net
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Reset Settings Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-night-950/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowResetConfirm(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-modal-title"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="liquid-modal p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-6 h-6 text-amber-400" />
                </div>
                <h2 id="reset-modal-title" className="text-xl font-semibold text-night-100 mb-2">
                  Reset Settings?
                </h2>
                <p className="text-night-400 mb-6">
                  This will reset all your preferences to their default values. Your bookmarks and progress will not be affected.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 py-3 rounded-xl bg-night-800 text-night-200 hover:bg-night-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 py-3 rounded-xl bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clear Data Confirmation Modal */}
      <AnimatePresence>
        {showClearDataConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-night-950/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowClearDataConfirm(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="clear-modal-title"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="liquid-modal p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-6 h-6 text-red-400" />
                </div>
                <h2 id="clear-modal-title" className="text-xl font-semibold text-night-100 mb-2">
                  Clear All Data?
                </h2>
                <p className="text-night-400 mb-6">
                  This will permanently delete all your local data including:
                </p>
                <ul className="text-left text-sm text-night-400 mb-6 space-y-1 pl-4">
                  <li>• Memorization progress</li>
                  <li>• Bookmarks</li>
                  <li>• Settings and preferences</li>
                  <li>• Streaks and achievements</li>
                </ul>
                <p className="text-red-400 text-sm mb-6 font-medium">
                  This action cannot be undone!
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowClearDataConfirm(false)}
                    className="flex-1 py-3 rounded-xl bg-night-800 text-night-200 hover:bg-night-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClearData}
                    className="flex-1 py-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
