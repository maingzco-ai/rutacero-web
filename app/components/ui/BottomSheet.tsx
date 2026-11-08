'use client';

import { type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/app/lib/design-system';
import { EASE } from '@/app/lib/motion';

type BottomSheetProps = {
  children: ReactNode;
  expanded?: boolean;
  className?: string;
};

export function BottomSheet({ children, expanded = false, className }: BottomSheetProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : { y: '105%' }}
      animate={{ y: 0 }}
      transition={{ duration: 1, ease: EASE, delay: 0.15 }}
      className={cn(
        'bottom-sheet fixed inset-x-0 bottom-0 z-20 flex flex-col rounded-t-[30px] border-t border-white/10',
        expanded ? 'max-h-[88vh]' : 'max-h-[58vh] sm:max-h-[62vh]',
        className,
      )}
    >
      <span
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }}
        aria-hidden="true"
      />
      <div className="mx-auto mt-3 h-1 w-12 shrink-0 rounded-full bg-white/25" aria-hidden="true" />
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-32 pt-4 sm:px-6" data-lenis-prevent>
        {children}
      </div>
    </motion.div>
  );
}
