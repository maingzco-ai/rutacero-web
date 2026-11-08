'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Route } from 'lucide-react';
import { brand } from '@/app/lib/brand';
import { EASE } from '@/app/lib/motion';

export function OnboardingSplash({ onFinish }: { onFinish: () => void }) {
  const [progress, setProgress] = useState(0);
  const onFinishRef = useRef(onFinish);
  const reduced = useReducedMotion();

  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  useEffect(() => {
    let start = 0;
    let raf: number | null = null;
    let timer: number | null = null;

    const step = (now: number) => {
      if (!start) start = now;
      const elapsed = now - start;
      const p = Math.min(elapsed / 2800, 1);
      setProgress(p);
      if (p < 1) {
        raf = requestAnimationFrame(step);
      } else {
        timer = window.setTimeout(() => onFinishRef.current(), 280);
      }
    };

    raf = requestAnimationFrame(step);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div aria-hidden="true" className="grid-veil pointer-events-none absolute inset-0 opacity-25" />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.07]"
        animate={reduced ? undefined : { scale: [0.9, 1.04, 0.9], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.09]"
        style={{ boxShadow: 'inset 0 0 110px rgba(79,109,245,0.10), 0 0 80px rgba(92,233,220,0.05)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 animate-spin-slow rounded-full border border-dashed border-primary/20"
      />

      <motion.div
        initial={reduced ? false : { scale: 0.7, opacity: 0, rotate: -8 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ duration: 1.1, ease: EASE }}
        className="relative"
      >
        <span className="absolute -inset-6 rounded-[34px] bg-primary/30 blur-2xl" />
        <span className="relative flex h-20 w-20 items-center justify-center rounded-[26px] border border-white/30 bg-[linear-gradient(145deg,#f4f7ff,#b9c8ff_45%,#4f6df5)] text-[#07101f] shadow-[0_20px_60px_-16px_rgba(79,109,245,0.9)]">
          <Route className="h-9 w-9" strokeWidth={1.6} />
        </span>
      </motion.div>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
        className="relative mt-8"
      >
        <h1 className="display text-[2.6rem] leading-none text-text">
          RUTA<span className="font-light tracking-[0.04em]">CERO</span>
        </h1>
        <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.3em] text-text-secondary/50">
          {brand.tagline} · Cali 03°22′ N
        </p>
      </motion.div>

      <motion.div
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="relative mt-12 w-full max-w-[280px]"
      >
        <div className="flex items-center justify-between font-mono text-[7.5px] uppercase tracking-[0.18em] text-text-secondary/50">
          <span className="flex items-center gap-1.5">
            <span className="h-1 w-1 animate-pulse rounded-full bg-accent" />
            Inicializando rutas
          </span>
          <span className="tabular text-text-secondary/70">{Math.round(progress * 100)}%</span>
        </div>
        <div className="mt-2.5 h-[3px] w-full overflow-hidden rounded-full bg-white/[0.07]">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#4f6df5,#7c9cff_55%,#5ce9dc)] shadow-[0_0_12px_rgba(92,233,220,0.7)] transition-[width] duration-150 ease-out"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between font-mono text-[7px] uppercase tracking-[0.14em] text-text-secondary/30">
          <span>Corredor sur</span>
          <span>PIN seguro</span>
          <span>Listo</span>
        </div>
      </motion.div>
    </div>
  );
}
