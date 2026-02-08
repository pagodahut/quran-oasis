'use client';

/**
 * SheikhOverlay — Global Sheikh Panel Renderer
 * 
 * This component renders the SheikhChat panel and AskSheikhButton globally.
 * Place it once in your root layout and it works on every page.
 * 
 * It reads from SheikhContext to know when to show/hide and what
 * context to pass to the chat.
 * 
 * Usage in layout.tsx:
 *   <SheikhProvider>
 *     {children}
 *     <SheikhOverlay />
 *   </SheikhProvider>
 */

import { useSheikh } from '@/contexts/SheikhContext';
import AskSheikhButton from '@/components/AskSheikhButton';
import SheikhChat from '@/components/SheikhChat';

/** Pages where the FAB should appear */
const SHOW_FAB_ON: string[] = ['mushaf', 'lesson', 'recite', 'practice', 'dashboard'];

export default function SheikhOverlay() {
  const { pageContext, isSheikhOpen, closeSheikh } = useSheikh();

  const showFab = SHOW_FAB_ON.includes(pageContext.page);

  return (
    <>
      {/* Floating Action Button — shown on key pages */}
      <AskSheikhButton show={showFab} />

      {/* Chat Panel — slides up from bottom when opened */}
      {isSheikhOpen && (
        <SheikhChat
          isOpen={isSheikhOpen}
          onClose={closeSheikh}
          mode="panel"
        />
      )}
    </>
  );
}
