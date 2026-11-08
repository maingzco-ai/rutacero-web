'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { EASE } from './lib/motion';

export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: EASE }}
      className="flex min-h-dvh flex-col"
    >
      {children}
    </motion.div>
  );
}
