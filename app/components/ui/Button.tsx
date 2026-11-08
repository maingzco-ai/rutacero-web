'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/app/lib/design-system';
import { springSnap } from '@/app/lib/motion';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      disabled,
      className,
      icon,
      ...props
    },
    ref,
  ) => {
    const reduced = useReducedMotion();
    const inactive = disabled || loading;

    return (
      <motion.button
        ref={ref}
        disabled={inactive}
        whileHover={reduced || inactive ? undefined : { scale: 1.018 }}
        whileTap={reduced || inactive ? undefined : { scale: 0.972 }}
        transition={springSnap}
        className={cn(
          'btn group/btn',
          `btn-${variant}`,
          size !== 'md' && `btn-${size}`,
          fullWidth && 'btn-full',
          className,
        )}
        {...(props as unknown as React.ComponentProps<typeof motion.button>)}
      >
        <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
          <span className="absolute -left-1/3 top-0 h-full w-1/3 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-all duration-700 group-hover/btn:translate-x-[400%] group-hover/btn:opacity-100" />
        </span>
        {loading ? (
          <svg className="relative z-10 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          icon && <span className="relative z-10 inline-flex shrink-0">{icon}</span>
        )}
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      </motion.button>
    );
  },
);

Button.displayName = 'Button';
