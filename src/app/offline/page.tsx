'use client';

import { useEffect, useState } from 'react';
import { WifiOff, RefreshCw, BookOpen, Home } from 'lucide-react';
import Link from 'next/link';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    if (isOnline) {
      window.location.href = '/';
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-night-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Offline Icon */}
        <div className="relative mx-auto w-24 h-24 mb-8">
          <div className="absolute inset-0 bg-gold-500/20 rounded-full animate-pulse" />
          <div className="relative flex items-center justify-center w-full h-full bg-night-900 rounded-full border-2 border-night-700">
            <WifiOff className="w-10 h-10 text-night-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-night-100 mb-3">
          You're Offline
        </h1>

        {/* Description */}
        <p className="text-night-400 mb-8 leading-relaxed">
          Don't worry — your memorization progress is saved locally. 
          {isOnline 
            ? " You're back online! Tap below to continue."
            : " Reconnect to sync your progress and access new content."}
        </p>

        {/* Status Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-amber-400'}`} />
          <span className={`text-sm ${isOnline ? 'text-green-400' : 'text-amber-400'}`}>
            {isOnline ? 'Connected' : 'No connection'}
          </span>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleRetry}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gold-500 hover:bg-gold-400 text-night-950 font-medium rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            {isOnline ? 'Go to App' : 'Try Again'}
          </button>

          {/* Quick Links to Cached Pages */}
          <div className="pt-4 border-t border-night-800">
            <p className="text-xs text-night-500 mb-3">Cached pages you can visit:</p>
            <div className="flex gap-2 justify-center">
              <Link
                href="/"
                className="flex items-center gap-1.5 px-4 py-2 bg-night-800 hover:bg-night-700 rounded-lg text-sm text-night-300 transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                Home
              </Link>
              <Link
                href="/practice"
                className="flex items-center gap-1.5 px-4 py-2 bg-night-800 hover:bg-night-700 rounded-lg text-sm text-night-300 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                Practice
              </Link>
            </div>
          </div>
        </div>

        {/* Bismillah decoration */}
        <div className="mt-12 text-gold-500/30 text-2xl font-arabic">
          بِسْمِ ٱللَّهِ
        </div>
      </div>
    </div>
  );
}
