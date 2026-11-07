'use client';

import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/app/lib/design-system';

type BottomSheetProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  expanded?: boolean;
};

export function BottomSheet({ children, expanded = false, className, ...props }: BottomSheetProps) {
  return (
    <div
      className={cn(
        'bottom-sheet fixed inset-x-0 bottom-0 z-20 flex flex-col rounded-t-3xl border-t border-border bg-card shadow-2xl transition-all duration-300 dark:border-border-dark dark:bg-card-dark',
        expanded ? 'max-h-[88vh]' : 'max-h-[58vh] sm:max-h-[62vh]',
        className,
      )}
      {...props}
    >
      <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-muted dark:bg-muted" aria-hidden="true" />
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-28 pt-3 sm:px-6">{children}</div>
    </div>
  );
}
