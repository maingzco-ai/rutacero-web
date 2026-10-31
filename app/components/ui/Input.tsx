'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
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
          <label htmlFor={inputId} className="input-label">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && <div className="input-icon">{icon}</div>}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'input',
              error ? 'input-error' : '',
              success ? 'input-success' : '',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          {error && (
            <p id={`${inputId}-error`} className="mt-1.5 text-xs text-error" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';
