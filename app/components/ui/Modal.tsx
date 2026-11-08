'use client';

import { type ReactNode, useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/app/lib/design-system';
import { EASE, springSoft } from '@/app/lib/motion';

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
};

export function Modal({ open, title, onClose, children, className }: ModalProps) {
  const reduced = useReducedMotion();

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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[400] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            type="button"
            className="absolute inset-0 bg-[#03050a]/70 backdrop-blur-md"
            aria-label="Cerrar modal"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 60, scale: 0.96, rotateX: 6 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.98 }}
            transition={springSoft}
            style={{ perspective: 1000 }}
            className={cn(
              'modal relative z-10 w-full rounded-t-[30px] p-6 sm:rounded-[30px]',
              className,
            )}
          >
            <span
              className="absolute inset-x-0 top-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)' }}
              aria-hidden="true"
            />
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="hud mb-2">RutaCero · confirmación</p>
                <h2 id="modal-title" className="display text-2xl text-text">
                  {title}
                </h2>
              </div>
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.08, rotate: 90 }}
                whileTap={{ scale: 0.92 }}
                transition={springSoft}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-text-secondary transition-colors hover:text-text"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </div>
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5, ease: EASE }}
            >
              {children}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
