'use client';

/**
 * SheikhProvider Wrapper — Client-side wrapper for Sheikh context
 * 
 * This is a thin wrapper that can be imported into the layout.
 * It provides the SheikhProvider context and renders the global overlay:
 * - SheikhOverlay (AI Sheikh FAB + panel) — the ONLY persistent FAB
 * 
 * FeedbackButton was removed as a floating FAB to reduce mushaf clutter.
 * Feedback is now a subtle footer link on key pages.
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
