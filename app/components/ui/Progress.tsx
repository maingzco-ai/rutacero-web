'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/app/lib/design-system';
import { EASE } from '@/app/lib/motion';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'accent';
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ value, max = 100, size = 'md', color = 'primary', className, ...props }, ref) => {
    const reduced = useReducedMotion();
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    const heights = { sm: 'h-1.5', md: 'h-2', lg: 'h-3' };

    return (
      <div
        ref={ref}
        className={cn('progress', heights[size], className)}
        {...props}
        role="progressbar"
        aria-valuenow={Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className={cn('progress-bar', color === 'accent' && 'progress-accent')}
          initial={reduced ? false : { width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.1, ease: EASE }}
        />
      </div>
    );
  },
);

Progress.displayName = 'Progress';
