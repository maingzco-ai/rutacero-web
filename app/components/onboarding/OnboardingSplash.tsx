'use client';

import { useEffect, useState } from 'react';
import { Route } from 'lucide-react';
import { brand } from '@/app/lib/brand';

export function OnboardingSplash({ onFinish }: { onFinish: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Barra de carga progresiva durante ~3 segundos, llega a 100% y avanza
    let start = 0;
    let raf: number | null = null;

    const step = (now: number) => {
      if (!start) start = now;
      const elapsed = now - start;
      const p = Math.min(elapsed / 3000, 1);
      setProgress(p);
      if (p < 1) {
        raf = requestAnimationFrame(step);
      } else {
        // Al llegar al 100%, esperar un poco y avanzar
        const t = setTimeout(() => {
          onFinish();
        }, 300);
        return () => clearTimeout(t);
      }
    };

    raf = requestAnimationFrame(step);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 bg-canvas dark:bg-background-dark flex flex-col items-center justify-center text-center font-sans">
      {/* Logo */}
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-white shadow-xl shadow-primary/30 mb-8 animate-pulse">
        <Route className="h-10 w-10" aria-hidden="true" />
      </div>

      <h1 className="text-2xl font-bold text-text tracking-tight">{brand.name}</h1>
      <p className="mt-2 text-sm text-text-secondary">{brand.tagline}</p>

      {/* Barra de carga */}
      <div className="mt-10 w-full max-w-xs">
        <div className="flex items-center justify-between mb-2 text-xs font-medium text-text-secondary uppercase tracking-wider">
          <span>Cargando RutaCero</span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
        <div className="h-3 w-full rounded-full bg-secondary overflow-hidden dark:bg-muted/30">
          <div className="h-full bg-primary transition-all duration-300 ease-out" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
    </div>
  );
}
