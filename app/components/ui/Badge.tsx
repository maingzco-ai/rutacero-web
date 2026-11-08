'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/app/lib/design-system';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'accent' | 'secondary' | 'outline';
  size?: 'sm' | 'md';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = 'primary', size = 'md', className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'badge',
        `badge-${variant}`,
        size === 'sm' ? 'px-2 py-0.5 text-[9px]' : 'px-2.5 py-1',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  ),
);

Badge.displayName = 'Badge';
