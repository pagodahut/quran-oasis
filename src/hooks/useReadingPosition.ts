'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'hifz-reading-position';
const SCROLL_DEBOUNCE_MS = 500;

interface ReadingPosition {
  surah: number;
  ayah: number;
  scrollY: number;
}

const DEFAULT_POSITION: ReadingPosition = { surah: 1, ayah: 1, scrollY: 0 };

function loadPosition(): ReadingPosition {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_POSITION;
    const parsed = JSON.parse(raw);
    if (parsed.surah >= 1 && parsed.surah <= 114) return parsed;
  } catch { /* corrupted data */ }
  return DEFAULT_POSITION;
}

function savePosition(pos: ReadingPosition) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
  } catch { /* quota exceeded */ }
}

export function useReadingPosition() {
  const [position, setPosition] = useState<ReadingPosition>(DEFAULT_POSITION);
  const [loaded, setLoaded] = useState(false);
  const posRef = useRef<ReadingPosition>(DEFAULT_POSITION);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadPosition();
    setPosition(saved);
    posRef.current = saved;
    setLoaded(true);
  }, []);

  // Debounced scroll save
  useEffect(() => {
    if (!loaded) return;
    let timer: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        posRef.current = { ...posRef.current, scrollY: window.scrollY };
        savePosition(posRef.current);
      }, SCROLL_DEBOUNCE_MS);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loaded]);

  // Save on page unload
  useEffect(() => {
    if (!loaded) return;
    const handleUnload = () => savePosition(posRef.current);
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [loaded]);

  const updateSurah = useCallback((surah: number) => {
    const next = { surah, ayah: 1, scrollY: 0 };
    posRef.current = next;
    setPosition(next);
    savePosition(next);
  }, []);

  const updateAyah = useCallback((ayah: number) => {
    posRef.current = { ...posRef.current, ayah };
    setPosition(prev => ({ ...prev, ayah }));
    savePosition(posRef.current);
  }, []);

  return { position, loaded, updateSurah, updateAyah };
}
