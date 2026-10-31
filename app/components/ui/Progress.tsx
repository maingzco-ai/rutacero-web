'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/app/lib/design-system';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'accent';
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ value, max = 100, size = 'md', color = 'primary', className, ...props }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    const sizes = {
      sm: 'h-1.5',
      md: 'h-2.5',
      lg: 'h-4',
    };

    const colors = {
      primary: 'progress-primary',
      accent: 'progress-accent',
    };

    return (
      <div
        ref={ref}
        className={cn('progress', sizes[size], className)}
        {...props}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn('progress-bar', colors[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  }
);

Progress.displayName = 'Progress';
