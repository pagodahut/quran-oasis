'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Twitter, Copy, Check, X, MessageCircle } from 'lucide-react';
import { SITE_URL } from '@/lib/seo';

interface ShareButtonProps {
  surahName?: string;
  surahNumber?: number;
  lessonTitle?: string;
  lessonId?: string;
  type: 'lesson' | 'surah' | 'milestone';
  milestone?: {
    type: 'streak' | 'verses' | 'surah';
    value: number | string;
  };
  className?: string;
}

export default function ShareButton({
  surahName,
  surahNumber,
  lessonTitle,
  lessonId,
  type,
  milestone,
  className = '',
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const getShareText = () => {
    switch (type) {
      case 'lesson':
        return `I just completed "${lessonTitle}" on HIFZ! 📖✨ Learning Quran one step at a time. #HIFZ #Quran #IslamicLearning`;
      case 'surah':
        return `I memorized Surah ${surahName}! 🎉🕌 Start your memorization journey with HIFZ. #HIFZ #QuranMemorization`;
      case 'milestone':
        if (milestone?.type === 'streak') {
          return `🔥 ${milestone.value} day streak on HIFZ! Consistent Quran learning pays off. #HIFZ #DailyQuran`;
        }
        if (milestone?.type === 'verses') {
          return `📖 I've memorized ${milestone.value} verses of the Quran with HIFZ! #QuranMemorization #HIFZ`;
        }
        if (milestone?.type === 'surah') {
          return `🏆 Completed Surah ${milestone.value} memorization! Alhamdulillah 🤲 #HIFZ #Quran`;
        }
        return `Making progress on my Quran journey with HIFZ! 🌟 #HIFZ #Quran`;
      default:
        return `Join me in memorizing the Quran with HIFZ — free AI-powered learning! #HIFZ #Quran`;
    }
  };

  const getShareUrl = () => {
    if (type === 'lesson' && lessonId) {
      return `${SITE_URL}/lessons/${lessonId}`;
    }
    if (type === 'surah' && surahNumber) {
      return `${SITE_URL}/mushaf?surah=${surahNumber}`;
    }
    return SITE_URL;
  };

  const shareText = getShareText();
  const shareUrl = getShareUrl();
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(shareUrl);

  const shareOptions = [
    {
      name: 'Twitter / X',
      icon: Twitter,
      color: 'bg-[#1DA1F2]/20 text-[#1DA1F2] hover:bg-[#1DA1F2]/30',
      url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/30',
      url: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error('Failed to copy');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500/20 text-gold-400 hover:bg-gold-500/30 transition-all ${className}`}
      >
        <Share2 className="w-4 h-4" />
        <span className="text-sm font-medium">Share</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-night-950/80 backdrop-blur-sm p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-night-900 rounded-2xl border border-night-800 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-night-800">
                <h3 className="text-lg font-semibold text-night-100">Share Your Achievement</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-night-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-night-400" />
                </button>
              </div>

              {/* Preview */}
              <div className="p-4 border-b border-night-800">
                <div className="bg-night-800/50 rounded-xl p-4">
                  <p className="text-night-200 text-sm leading-relaxed">{shareText}</p>
                  <p className="text-gold-400/60 text-xs mt-2 truncate">{shareUrl}</p>
                </div>
              </div>

              {/* Share Options */}
              <div className="p-4 space-y-3">
                {shareOptions.map((option) => (
                  <a
                    key={option.name}
                    href={option.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all ${option.color}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <option.icon className="w-5 h-5" />
                    <span className="font-medium">Share on {option.name}</span>
                  </a>
                ))}

                {/* Copy Link */}
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-3 w-full p-3 rounded-xl bg-night-800/50 text-night-200 hover:bg-night-800 transition-all"
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5 text-green-400" />
                      <span className="font-medium text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      <span className="font-medium">Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
