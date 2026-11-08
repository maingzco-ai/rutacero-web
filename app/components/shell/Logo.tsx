'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/app/lib/design-system';

export function LogoMark({ size = 34, className }: { size?: number; className?: string }) {
  const reduced = useReducedMotion();

  return (
    <span
      className={cn('relative inline-flex shrink-0 items-center justify-center', className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span className="absolute -inset-1.5 rounded-[15px] bg-primary/35 blur-lg" />
      <span className="absolute inset-0 rounded-[11px] bg-[linear-gradient(145deg,#eef3ff_0%,#b9c8ff_38%,#7c9cff_72%,#4f6df5_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_6px_18px_-6px_rgba(79,109,245,0.9)]" />
      <motion.span
        className="absolute inset-0 rounded-[11px] border border-white/40"
        animate={reduced ? undefined : { opacity: [0.45, 0.9, 0.45] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <svg viewBox="0 0 32 32" className="relative z-10 h-[62%] w-[62%]" fill="none">
        <path
          d="M7 23.5C12.4 22.2 12.6 9.6 19.3 9.2C23.2 9 24.8 11.4 24.8 14.1"
          stroke="#07101f"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="7" cy="23.5" r="2.4" fill="#07101f" />
        <circle cx="24.8" cy="14.1" r="2.2" stroke="#07101f" strokeWidth="2" />
        <path d="M20.9 24.7L24.8 28.5L28.6 24.7" stroke="#07101f" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
      </svg>
    </span>
  );
}

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-baseline gap-1 leading-none">
      <span className="text-[14px] font-light tracking-[0.18em] text-text/85">RUTA</span>
      <span className="text-[14px] font-bold tracking-[0.08em] text-text">CERO</span>
      {!compact && (
        <span className="ml-1.5 hidden font-mono text-[8px] uppercase tracking-[0.18em] text-text-secondary/60 lg:inline">
          Cali
        </span>
      )}
    </span>
  );
}
