'use client';

/**
 * FeedbackOverlay — Global Feedback Button Renderer
 * 
 * This component renders the FeedbackButton globally, similar to SheikhOverlay.
 * Place it once in your root layout and it works on every page.
 * 
 * It reads from SheikhContext to know which page we're on
 * so feedback is contextual.
 * 
 * Usage in SheikhProvider:
 *   <SheikhProvider>
 *     {children}
 *     <SheikhOverlay />
 *     <FeedbackOverlay />
 *   </SheikhProvider>
 */

import { useSheikh } from '@/contexts/SheikhContext';
import FeedbackButton from '@/components/FeedbackButton';

export default function FeedbackOverlay() {
  const { pageContext } = useSheikh();

  // Show feedback button on ALL pages — it's a global floating element
  return (
    <FeedbackButton
      currentPage={pageContext.page}
      showOnPages={[pageContext.page]} // Always include current page
    />
  );
}
