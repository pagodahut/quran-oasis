'use client';

/**
 * Offline Model Loader Component
 * 
 * Allows users to download the Tarteel Whisper model for offline use.
 * Model is cached in IndexedDB via Transformers.js.
 * 
 * @see /docs/TARTEEL_INTEGRATION_PLAN.md
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  initOfflineWhisper, 
  isOfflineReady, 
  getOfflineModelProgress 
} from '@/lib/hybridTranscription';

interface OfflineModelLoaderProps {
  onReady?: () => void;
  className?: string;
  compact?: boolean;
}

type LoadingStatus = 'idle' | 'checking' | 'loading' | 'ready' | 'error';

export function OfflineModelLoader({ 
  onReady, 
  className = '',
  compact = false,
}: OfflineModelLoaderProps) {
  const [status, setStatus] = useState<LoadingStatus>('checking');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // Check if already loaded on mount
  useEffect(() => {
    if (isOfflineReady()) {
      setStatus('ready');
      onReady?.();
    } else {
      setStatus('idle');
    }
  }, [onReady]);
  
  const handleDownload = useCallback(async () => {
    setStatus('loading');
    setProgress(0);
    setError(null);
    
    try {
      await initOfflineWhisper((p) => {
        setProgress(Math.round(p));
      });
      setStatus('ready');
      onReady?.();
    } catch (err) {
      console.error('Failed to load offline model:', err);
      setError(err instanceof Error ? err.message : 'Download failed');
      setStatus('error');
    }
  }, [onReady]);
  
  // Compact view for settings/header
  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {status === 'ready' ? (
          <>
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm text-green-400">Offline Ready</span>
          </>
        ) : status === 'loading' ? (
          <>
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-sm text-amber-400">{progress}%</span>
          </>
        ) : (
          <button
            onClick={handleDownload}
            className="text-sm text-blue-400 hover:text-blue-300 underline"
          >
            Enable Offline
          </button>
        )}
      </div>
    );
  }
  
  // Full view for settings page
  return (
    <div className={`p-4 rounded-xl bg-gray-900/50 border border-gray-800 ${className}`}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="p-2 rounded-lg bg-gray-800">
          <svg 
            className="w-6 h-6 text-gold" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
            />
          </svg>
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <h3 className="font-semibold text-white">Offline Mode</h3>
          <p className="text-sm text-gray-400 mt-1">
            Download the AI model to practice without internet
          </p>
          
          {/* Status-specific content */}
          <div className="mt-3">
            {status === 'checking' && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                Checking...
              </div>
            )}
            
            {status === 'idle' && (
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-gold/20 hover:bg-gold/30 text-gold rounded-lg 
                           font-medium transition-colors text-sm"
              >
                Download Model (74 MB)
              </button>
            )}
            
            {status === 'loading' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Downloading...</span>
                  <span className="text-gold font-medium">{progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-gold to-amber-400 rounded-full 
                               transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Please keep this page open during download
                </p>
              </div>
            )}
            
            {status === 'ready' && (
              <div className="flex items-center gap-2 text-sm text-green-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path 
                    fillRule="evenodd" 
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                    clipRule="evenodd" 
                  />
                </svg>
                Ready for offline use
              </div>
            )}
            
            {status === 'error' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-red-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path 
                      fillRule="evenodd" 
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                  {error || 'Download failed'}
                </div>
                <button
                  onClick={handleDownload}
                  className="text-sm text-blue-400 hover:text-blue-300 underline"
                >
                  Try again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Info footer */}
      {status !== 'ready' && (
        <div className="mt-4 pt-3 border-t border-gray-800">
          <div className="flex items-start gap-2">
            <svg 
              className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                clipRule="evenodd" 
              />
            </svg>
            <p className="text-xs text-gray-500">
              The offline model enables Quran recitation practice without internet.
              Model is stored locally and only downloaded once.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default OfflineModelLoader;
