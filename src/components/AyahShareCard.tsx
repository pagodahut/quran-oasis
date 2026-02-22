'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, X, Download, Copy, Check } from 'lucide-react';

interface AyahShareCardProps {
  surahNumber: number;
  surahName: string;
  surahNameArabic: string;
  ayahNumber: number;
  arabicText: string;
  translation: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function AyahShareCard({
  surahNumber,
  surahName,
  surahNameArabic,
  ayahNumber,
  arabicText,
  translation,
  isOpen,
  onClose,
}: AyahShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  const reference = `${surahName} ${surahNumber}:${ayahNumber}`;

  const shareText = `${arabicText}\n\n"${translation}"\n\n— ${reference}\n\nhifz.app`;

  const handleNativeShare = useCallback(async () => {
    if (!navigator.share) return;
    setSharing(true);
    try {
      // Try sharing with canvas image first
      if (cardRef.current) {
        try {
          const { default: html2canvas } = await import('html2canvas');
          const canvas = await html2canvas(cardRef.current, {
            backgroundColor: null,
            scale: 3,
            useCORS: true,
            logging: false,
          });
          const blob = await new Promise<Blob>((resolve) =>
            canvas.toBlob((b) => resolve(b!), 'image/png', 1.0)
          );
          const file = new File([blob], `hifz-${surahNumber}-${ayahNumber}.png`, { type: 'image/png' });
          await navigator.share({
            text: shareText,
            files: [file],
          });
          setSharing(false);
          onClose();
          return;
        } catch {
          // Canvas share failed, fall back to text-only share
        }
      }

      // Text-only fallback
      await navigator.share({
        title: reference,
        text: shareText,
      });
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.warn('Share failed:', err);
      }
    }
    setSharing(false);
  }, [shareText, reference, surahNumber, ayahNumber, onClose]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = shareText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [shareText]);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 3,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `hifz-${surahNumber}-${ayahNumber}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (err) {
      console.warn('Download failed:', err);
    }
  }, [surahNumber, ayahNumber]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 text-white/60 hover:text-white transition-colors p-2"
            >
              <X className="w-6 h-6" />
            </button>

            {/* The shareable card */}
            <div
              ref={cardRef}
              className="rounded-3xl overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, #0f1419 0%, #1a1f2e 40%, #0f1419 100%)',
                border: '1px solid rgba(201, 162, 39, 0.2)',
                boxShadow: '0 0 60px rgba(201, 162, 39, 0.08), 0 20px 60px rgba(0, 0, 0, 0.5)',
              }}
            >
              {/* Gold accent line */}
              <div
                className="h-1"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, #c9a227 30%, #d4af37 50%, #c9a227 70%, transparent 100%)',
                }}
              />

              <div className="px-8 pt-8 pb-6">
                {/* Bismillah ornament */}
                <div className="flex justify-center mb-6">
                  <svg viewBox="0 0 120 20" width={120} height={20}>
                    <line x1="0" y1="10" x2="40" y2="10" stroke="#c9a227" strokeWidth="1" opacity="0.4" />
                    <path d="M60 3l4 7-4 7-4-7z" fill="#c9a227" opacity="0.6" />
                    <line x1="80" y1="10" x2="120" y2="10" stroke="#c9a227" strokeWidth="1" opacity="0.4" />
                  </svg>
                </div>

                {/* Arabic text */}
                <p
                  className="text-2xl leading-[2.2] text-center mb-6"
                  dir="rtl"
                  lang="ar"
                  translate="no"
                  style={{
                    fontFamily: 'var(--font-quran)',
                    color: '#e5e5e5',
                    textShadow: '0 0 40px rgba(201, 162, 39, 0.15)',
                  }}
                >
                  {arabicText}
                </p>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
                </div>

                {/* Translation */}
                <p
                  className="text-sm text-center leading-relaxed mb-6"
                  style={{ color: '#a3a3a3', fontStyle: 'italic' }}
                >
                  &ldquo;{translation}&rdquo;
                </p>

                {/* Reference */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium" style={{ color: '#c9a227' }}>
                      {surahName} ({surahNameArabic})
                    </p>
                    <p className="text-xs" style={{ color: '#6b7280' }}>
                      Verse {ayahNumber}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold tracking-wider" style={{ color: '#c9a227' }}>
                      HIFZ
                    </span>
                    <span className="text-xs" style={{ color: '#6b7280' }}>
                      gethifz.com
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-center gap-3 mt-5">
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  onClick={handleNativeShare}
                  disabled={sharing}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #c9a227 0%, #d4af37 100%)',
                    color: '#0f1419',
                    boxShadow: '0 4px 16px rgba(201, 162, 39, 0.3)',
                  }}
                >
                  <Share2 className="w-4 h-4" />
                  {sharing ? 'Sharing...' : 'Share'}
                </button>
              )}
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm transition-all active:scale-95"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#e5e5e5',
                }}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm transition-all active:scale-95"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#e5e5e5',
                }}
              >
                <Download className="w-4 h-4" />
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
