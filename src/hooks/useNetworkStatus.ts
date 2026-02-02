'use client';

import { useEffect, useState, useCallback } from 'react';

interface NetworkStatus {
  isOnline: boolean;
  isReconnecting: boolean;
  connectionType: string | null;
  effectiveType: string | null;
  lastOnline: Date | null;
  checkConnection: () => Promise<boolean>;
}

/**
 * Hook to monitor network connectivity status
 * Provides online/offline detection with connection quality info
 */
export function useNetworkStatus(): NetworkStatus {
  const [isOnline, setIsOnline] = useState(true);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [connectionType, setConnectionType] = useState<string | null>(null);
  const [effectiveType, setEffectiveType] = useState<string | null>(null);
  const [lastOnline, setLastOnline] = useState<Date | null>(null);

  // Active connection check by pinging a reliable endpoint
  const checkConnection = useCallback(async (): Promise<boolean> => {
    try {
      // Use a tiny request to check actual connectivity
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('/api/health', {
        method: 'HEAD',
        cache: 'no-store',
        signal: controller.signal,
      }).catch(() => 
        // Fallback to external check if local API doesn't exist
        fetch('https://www.google.com/generate_204', {
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-store',
          signal: controller.signal,
        })
      );
      
      clearTimeout(timeout);
      return true;
    } catch {
      return false;
    }
  }, []);

  // Update connection info from Network Information API
  const updateConnectionInfo = useCallback(() => {
    if ('connection' in navigator) {
      const conn = (navigator as Navigator & { connection?: { type?: string; effectiveType?: string } }).connection;
      if (conn) {
        setConnectionType(conn.type || null);
        setEffectiveType(conn.effectiveType || null);
      }
    }
  }, []);

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine);
    if (navigator.onLine) {
      setLastOnline(new Date());
    }
    updateConnectionInfo();

    const handleOnline = async () => {
      setIsReconnecting(true);
      
      // Verify actual connectivity
      const isActuallyOnline = await checkConnection();
      
      if (isActuallyOnline) {
        setIsOnline(true);
        setLastOnline(new Date());
      }
      
      setIsReconnecting(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    const handleConnectionChange = () => {
      updateConnectionInfo();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for connection changes if available
    if ('connection' in navigator) {
      const conn = (navigator as Navigator & { connection?: EventTarget }).connection;
      conn?.addEventListener('change', handleConnectionChange);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if ('connection' in navigator) {
        const conn = (navigator as Navigator & { connection?: EventTarget }).connection;
        conn?.removeEventListener('change', handleConnectionChange);
      }
    };
  }, [checkConnection, updateConnectionInfo]);

  return {
    isOnline,
    isReconnecting,
    connectionType,
    effectiveType,
    lastOnline,
    checkConnection,
  };
}

export default useNetworkStatus;
