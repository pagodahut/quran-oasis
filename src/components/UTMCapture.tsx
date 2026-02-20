'use client';

import { useEffect } from 'react';
import { captureUTM } from '@/lib/utm';

/**
 * Silent component that captures UTM/ref params on first page load.
 * Drop into layout.tsx — renders nothing.
 */
export default function UTMCapture() {
  useEffect(() => {
    captureUTM();
  }, []);

  return null;
}
