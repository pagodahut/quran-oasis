'use client';

import { useState } from 'react';
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
  Github,
  ExternalLink,
  Moon,
  Type,
} from 'lucide-react';
import { 
  useSettings, 
  RECITERS, 
  TRANSLATIONS,
  DAILY_GOAL_OPTIONS,
  type UserSettings,
} from '@/lib/settings';
import BottomNav from '@/components/BottomNav';
import { setDailyGoal } from '@/lib/motivationStore';

function SettingSection({ 
  icon: Icon, 
  title, 
  description,
  children 
}: { 
  icon: React.ElementType;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-gold-400" />
        </div>
        <div>
          <h2 className="font-semibold text-night-100">{title}</h2>
          {description && <p className="text-xs text-night-500">{description}</p>}
        </div>
      </div>
      <div className="ml-13">{children}</div>
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
          <p className="font-medium text-night-100">{reciter.name}</p>
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
        </div>
        {selected && (
          <div className="w-6 h-6 rounded-full bg-gold-500 flex items-center justify-center">
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

export default function SettingsPage() {
  const { settings, update, reset } = useSettings();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 2000);
  };

  const handleReciterChange = (reciterId: string) => {
    update({ reciter: reciterId });
    showSuccess('Reciter updated');
  };

  const handleTranslationChange = (translationId: 'sahih' | 'asad') => {
    update({ translation: translationId });
    showSuccess('Translation updated');
  };

  const handleDailyGoalChange = (goal: number) => {
    update({ dailyGoal: goal });
    // Also sync to motivation store
    setDailyGoal('verses', goal);
    showSuccess('Daily goal updated');
  };

  const handleFontSizeChange = (size: number) => {
    update({ arabicFontSize: size });
  };

  const handleReset = () => {
    reset();
    setShowResetConfirm(false);
    showSuccess('Settings reset to defaults');
  };

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
      <main className="px-4 py-6 pb-28 space-y-8">
        {/* Reciter Selection */}
        <SettingSection 
          icon={Headphones} 
          title="Reciter"
          description="Choose your preferred Quran reciter"
        >
          <div className="space-y-3">
            {RECITERS.map((reciter) => (
              <ReciterOption
                key={reciter.id}
                reciter={reciter}
                selected={settings.reciter === reciter.id}
                onSelect={() => handleReciterChange(reciter.id)}
              />
            ))}
          </div>
        </SettingSection>

        <div className="liquid-divider" />

        {/* Translation */}
        <SettingSection 
          icon={Languages} 
          title="Translation"
          description="Select your preferred translation"
        >
          <div className="space-y-4">
            {/* Show/Hide Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-night-800/50">
              <div>
                <p className="text-night-100">Show Translation</p>
                <p className="text-xs text-night-500">Display English translation below verses</p>
              </div>
              <ToggleSwitch 
                enabled={settings.showTranslation}
                onToggle={() => update({ showTranslation: !settings.showTranslation })}
                label="Show translation"
              />
            </div>

            {/* Translation Options */}
            {settings.showTranslation && (
              <div className="grid grid-cols-2 gap-3">
                {TRANSLATIONS.map((trans) => (
                  <button
                    key={trans.id}
                    onClick={() => handleTranslationChange(trans.id as 'sahih' | 'asad')}
                    className={`p-4 rounded-xl text-left transition-all ${
                      settings.translation === trans.id 
                        ? 'bg-gold-500/10 border-2 border-gold-500/50' 
                        : 'bg-night-800/50 border-2 border-transparent hover:border-night-700'
                    }`}
                  >
                    <p className="font-medium text-night-100">{trans.name}</p>
                    <p className="text-xs text-night-500 mt-0.5">{trans.language}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </SettingSection>

        <div className="liquid-divider" />

        {/* Arabic Font Size */}
        <SettingSection 
          icon={Type} 
          title="Arabic Font Size"
          description="Adjust the size of Arabic text"
        >
          <div className="p-4 rounded-xl bg-night-800/50 space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="arabic-font-size" className="text-night-300">Size: {settings.arabicFontSize}px</label>
              <input
                id="arabic-font-size"
                type="range"
                min={20}
                max={48}
                value={settings.arabicFontSize}
                onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
                className="w-40"
                aria-valuemin={20}
                aria-valuemax={48}
                aria-valuenow={settings.arabicFontSize}
                aria-valuetext={`${settings.arabicFontSize} pixels`}
              />
            </div>
            <div className="text-center p-4 rounded-xl bg-night-900/50">
              <p 
                className="text-gold-400"
                style={{ 
                  fontFamily: 'var(--font-arabic)', 
                  fontSize: settings.arabicFontSize,
                  direction: 'rtl'
                }}
                lang="ar"
                dir="rtl"
                aria-label="Bismillah sample text"
              >
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
            </div>
          </div>
        </SettingSection>

        <div className="liquid-divider" />

        {/* Daily Goal */}
        <SettingSection 
          icon={Target} 
          title="Daily Goal"
          description="How many verses do you want to memorize per day?"
        >
          <div className="grid grid-cols-3 gap-2">
            {DAILY_GOAL_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleDailyGoalChange(option.value)}
                className={`p-3 rounded-xl text-center transition-all ${
                  settings.dailyGoal === option.value 
                    ? 'bg-gold-500/10 border-2 border-gold-500/50' 
                    : 'bg-night-800/50 border-2 border-transparent hover:border-night-700'
                }`}
              >
                <p className="font-semibold text-night-100">{option.label}</p>
                <p className="text-xs text-night-500 mt-0.5">{option.description}</p>
              </button>
            ))}
          </div>
          
          <div className="flex items-start gap-2 mt-4 p-3 rounded-xl bg-sage-500/10 border border-sage-500/20">
            <Info className="w-4 h-4 text-sage-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-sage-400">
              Consistency is key! Start with a manageable goal and increase as you build a habit.
            </p>
          </div>
        </SettingSection>

        <div className="liquid-divider" />

        {/* Reset Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <RotateCcw className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="font-semibold text-night-100">Reset Settings</h2>
              <p className="text-xs text-night-500">Return all settings to defaults</p>
            </div>
          </div>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full p-4 rounded-xl bg-red-500/10 border border-red-500/20 
                      text-red-400 hover:bg-red-500/20 transition-colors"
          >
            Reset All Settings
          </button>
        </div>

        <div className="liquid-divider" />

        {/* About */}
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

      {/* Reset Confirmation Modal */}
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
            aria-describedby="reset-modal-description"
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
                  <AlertCircle className="w-6 h-6 text-amber-400" aria-hidden="true" />
                </div>
                <h2 id="reset-modal-title" className="text-xl font-semibold text-night-100 mb-2">Reset Settings?</h2>
                <p id="reset-modal-description" className="text-night-400 mb-6">
                  This will reset all your preferences to their default values. Your bookmarks and progress will not be affected.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 py-3 rounded-xl bg-night-800 text-night-200 hover:bg-night-700 transition-colors focus-visible-ring"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 py-3 rounded-xl bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors focus-visible-ring"
                  >
                    Reset
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
