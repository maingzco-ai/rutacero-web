'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/app/lib/design-system';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'success' | 'primary' | 'warning';
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ value, max = 100, size = 'md', color = 'success', className, ...props }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    const sizes = {
      sm: 'h-1.5',
      md: 'h-2.5',
      lg: 'h-4',
    };

    const colors = {
      success: 'bg-gradient-to-r from-green-500 to-green-600',
      primary: 'bg-gradient-to-r from-black to-neutral-700',
      warning: 'bg-gradient-to-r from-amber-400 to-yellow-500',
    };

    return (
      <div
        ref={ref}
        className={cn('w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700', sizes[size], className)}
        {...props}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            colors[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  }
);

Progress.displayName = 'Progress';