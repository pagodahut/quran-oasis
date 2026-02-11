'use client';

/**
 * SheikhProvider Wrapper — Client-side wrapper for Sheikh context
 * 
 * This is a thin wrapper that can be imported into the layout.
 * It provides the SheikhProvider context and renders the global overlays:
 * - SheikhOverlay (AI Sheikh FAB + panel)
 * - FeedbackOverlay (Feedback FAB + panel)
 */

import { SheikhProvider as SheikhContextProvider } from '@/contexts/SheikhContext';
import SheikhOverlay from '@/components/SheikhOverlay';
import FeedbackOverlay from '@/components/FeedbackOverlay';

export default function SheikhProvider({ children }: { children: React.ReactNode }) {
  return (
    <SheikhContextProvider>
      {children}
      <SheikhOverlay />
      <FeedbackOverlay />
    </SheikhContextProvider>
  );
}
