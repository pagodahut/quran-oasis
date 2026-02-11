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

/** Pages where the feedback button should appear */
const SHOW_FEEDBACK_ON: string[] = ['mushaf', 'lesson', 'recite', 'practice', 'dashboard'];

export default function FeedbackOverlay() {
  const { pageContext } = useSheikh();
  
  const showFeedback = SHOW_FEEDBACK_ON.includes(pageContext.page);

  if (!showFeedback) return null;

  return (
    <FeedbackButton
      currentPage={pageContext.page}
      showOnPages={SHOW_FEEDBACK_ON}
    />
  );
}
