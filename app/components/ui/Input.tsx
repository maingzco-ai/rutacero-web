'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/app/lib/design-system';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, success, icon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="input-label mb-1.5 block">
            {label}
          </label>
        )}
        <div className="group relative">
          {icon && (
            <div className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-primary/80 transition-colors group-focus-within:text-accent">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'input',
              icon ? 'pl-11' : '',
              error ? 'input-error' : '',
              success ? 'input-success' : '',
              className,
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          <span className="pointer-events-none absolute inset-x-4 bottom-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-accent/70 to-transparent transition-transform duration-500 group-focus-within:scale-x-100" />
        </div>
        {error && (
          <motion.p
            id={`${inputId}-error`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1.5 text-xs text-error"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
