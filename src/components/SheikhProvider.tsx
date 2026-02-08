'use client';

/**
 * SheikhProvider Wrapper — Client-side wrapper for Sheikh context
 * 
 * This is a thin wrapper that can be imported into the layout.
 * It provides the SheikhProvider context and renders the global SheikhOverlay.
 */

import { SheikhProvider as SheikhContextProvider } from '@/contexts/SheikhContext';
import SheikhOverlay from '@/components/SheikhOverlay';

export default function SheikhProvider({ children }: { children: React.ReactNode }) {
  return (
    <SheikhContextProvider>
      {children}
      <SheikhOverlay />
    </SheikhContextProvider>
  );
}
