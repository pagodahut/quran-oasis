'use client';

/**
 * FeedbackFooterLink — Subtle footer link to open the feedback panel.
 * 
 * Replaces the floating FeedbackButton FAB. This is a muted text link
 * that sits at the bottom of pages, keeping the reading experience clean.
 */

import { useState } from 'react';
import FeedbackPanel from './FeedbackPanel';

interface FeedbackFooterLinkProps {
  currentPage?: string;
  className?: string;
}

export default function FeedbackFooterLink({ 
  currentPage = 'general',
  className = '' 
}: FeedbackFooterLinkProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <footer className={`text-center py-6 ${className}`}>
        <button
          onClick={() => setIsOpen(true)}
          className="text-xs text-night-600 hover:text-night-400 transition-colors"
        >
          Send Feedback
        </button>
      </footer>

      <FeedbackPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={() => setIsOpen(false)}
        currentPage={currentPage}
      />
    </>
  );
}
