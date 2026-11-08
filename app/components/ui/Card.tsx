'use client';

import { forwardRef, useRef, type HTMLAttributes } from 'react';
import { cn } from '@/app/lib/design-system';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  spotlight?: boolean;
}

const PADDINGS = {
  none: '',
  sm: 'p-4',
  md: 'p-5 sm:p-6',
  lg: 'p-6 sm:p-8',
} as const;

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, elevated = false, padding = 'md', spotlight = true, className, onPointerMove, ...props }, ref) => {
    const inner = useRef<HTMLDivElement | null>(null);

    return (
      <div
        ref={(node) => {
          inner.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        onPointerMove={(event) => {
          onPointerMove?.(event);
          if (!inner.current || !spotlight) return;
          const bounds = inner.current.getBoundingClientRect();
          inner.current.style.setProperty('--mx', `${event.clientX - bounds.left}px`);
          inner.current.style.setProperty('--my', `${event.clientY - bounds.top}px`);
        }}
        className={cn(
          'group/card relative overflow-hidden rounded-[26px] border border-white/[0.09]',
          'bg-[linear-gradient(150deg,rgba(255,255,255,0.062),rgba(255,255,255,0.018))]',
          'backdrop-blur-[22px] backdrop-saturate-[150%]',
          'shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_30px_70px_-44px_rgba(0,0,0,0.95)]',
          elevated && 'shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_46px_100px_-46px_rgba(0,0,0,1)]',
          spotlight && 'spotlight',
          PADDINGS[padding],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  ),
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ children, className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-lg font-semibold tracking-tight', className)} {...props}>
      {children}
    </h3>
  ),
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ children, className, ...props }, ref) => (
    <p ref={ref} className={cn('mt-1 text-sm text-text-secondary', className)} {...props}>
      {children}
    </p>
  ),
);
CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  ),
);
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn('mt-4 border-t border-white/10 pt-4', className)} {...props}>
      {children}
    </div>
  ),
);
CardFooter.displayName = 'CardFooter';
