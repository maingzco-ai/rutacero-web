'use client';

import { type ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/app/lib/design-system';

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
};

export function Modal({ open, title, onClose, children, className }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[400] flex items-end justify-center sm:items-center">
      <button type="button" className="absolute inset-0 bg-black/45" aria-label="Cerrar" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cn(
          'modal',
          className,
        )}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id="modal-title" className="text-lg font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-text-secondary dark:bg-muted dark:text-text-secondary"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
