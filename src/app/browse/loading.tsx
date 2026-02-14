'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function BrowseLoading() {
  return (
    <div className="min-h-screen bg-night-950 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="mx-auto mb-4"
        >
          <Loader2 className="w-8 h-8 text-sage-400" />
        </motion.div>
        <p className="text-night-500 text-sm">Loading Garden of Surahs...</p>
      </motion.div>
    </div>
  );
}
