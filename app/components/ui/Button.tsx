'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/app/lib/design-system';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', fullWidth = false, loading = false, disabled, className, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-2xl transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-black text-white shadow-sm hover:bg-neutral-800 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-xs focus:ring-black',
      secondary: 'bg-white text-neutral-900 border border-neutral-200 shadow-xs hover:bg-neutral-50 hover:border-neutral-300 focus:ring-neutral-400 dark:bg-neutral-900 dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-800',
      success: 'bg-green-600 text-white shadow-sm hover:bg-green-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-xs focus:ring-green-500',
      ghost: 'bg-transparent text-neutral-900 hover:bg-neutral-100 focus:ring-neutral-400 dark:text-white dark:hover:bg-neutral-800',
    };

    const sizes = {
      sm: 'px-3 py-2 text-xs rounded-xl',
      md: 'px-5 py-3 text-sm rounded-2xl',
      lg: 'px-7 py-4 text-base rounded-3xl',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(baseStyles, variants[variant], sizes[size], fullWidth && 'w-full', className)}
        {...props}
      >
        {loading && (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';