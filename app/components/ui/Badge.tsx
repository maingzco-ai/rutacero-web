'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/app/lib/design-system';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'secondary' | 'warning' | 'outline';
  size?: 'sm' | 'md';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = 'primary', size = 'md', className, ...props }, ref) => {
    const variants = {
      primary: 'bg-black text-white',
      success: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      secondary: 'bg-neutral-100 text-neutral-700 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700',
      warning: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      outline: 'bg-transparent text-neutral-700 border border-neutral-300 dark:text-neutral-300 dark:border-neutral-600',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 font-semibold rounded-full',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';