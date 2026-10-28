'use client';

import { forwardRef, InputHTMLAttributes, LabelHTMLAttributes } from 'react';
import { cn } from '@/app/lib/design-system';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, success, icon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-neutral-900 dark:text-white">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 dark:text-green-400 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded-2xl bg-white py-2.5 pl-10 pr-10 text-sm text-neutral-900 outline-none transition-all duration-150',
              'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
              'dark:bg-neutral-900 dark:text-white dark:border-neutral-700',
              error
                ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20'
                : success
                ? 'border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                : 'border-neutral-200 focus:border-black focus:ring-2 focus:ring-black/10 dark:border-neutral-700 dark:focus:border-green-500 dark:focus:ring-green-500/20',
              icon ? 'pl-10' : '',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          {error && (
            <p id={`${inputId}-error`} className="mt-1.5 text-xs text-red-500" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';