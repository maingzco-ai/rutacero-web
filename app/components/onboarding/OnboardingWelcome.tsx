'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, Gift, Route, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { OnboardingStage } from './OnboardingStage';
import { EASE, springSoft } from '@/app/lib/motion';

type Props = {
  isFirstTrip: boolean;
  onFinish: () => void;
};

export function OnboardingWelcome({ isFirstTrip, onFinish }: Props) {
  const reduced = useReducedMotion();

  return (
    <OnboardingStage
      step={5}
      eyebrow="Acceso concedido"
      title="Bienvenido a"
      accent="RutaCero."
      description="Tu identidad está verificada. El corredor sur de Cali ya está en tu mapa."
    >
      <div className="flex flex-col items-center text-center">
        <motion.span
          initial={reduced ? false : { scale: 0.4, rotate: -30, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={springSoft}
          className="relative flex h-20 w-20 items-center justify-center rounded-full border border-accent/30 bg-accent/[0.08] text-accent"
        >
          <span className="absolute inset-0 animate-ping rounded-full border border-accent/20" />
          <span
            className="absolute -inset-3 rounded-full"
            style={{ boxShadow: '0 0 60px rgba(92,233,220,0.25)' }}
          />
          <Check className="h-9 w-9" strokeWidth={2.2} />
        </motion.span>

        <h3 className="display mt-6 text-2xl text-text">Perfil confirmado</h3>
        <p className="mt-1.5 max-w-xs text-[11.5px] leading-relaxed text-text-secondary">
          Ya haces parte de la comunidad de movilidad compartida de Cali.
        </p>

        {isFirstTrip && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease: EASE }}
            className="mt-5 flex w-full items-center gap-3 rounded-2xl border border-amber/25 bg-amber/[0.06] px-3.5 py-3 text-left"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-amber/30 bg-amber/10 text-amber">
              <Gift className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-[11px] font-semibold text-amber">Primer viaje con beneficio</span>
              <span className="mt-0.5 block text-[9.5px] text-text-secondary/70">Tu primer cupo tiene tarifa promocional de bienvenida.</span>
            </span>
          </motion.div>
        )}

        <div className="mt-5 grid w-full grid-cols-3 gap-2">
          {[
            { label: 'Corredor', value: 'Sur' },
            { label: 'Cupos', value: '3' },
            { label: 'PIN', value: 'Seguro' },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-2 py-2">
              <p className="font-mono text-[7px] uppercase tracking-[0.12em] text-text-secondary/40">{item.label}</p>
              <p className="mt-0.5 truncate font-mono text-[10.5px] text-text">{item.value}</p>
            </div>
          ))}
        </div>

        <Button variant="primary" fullWidth size="lg" className="mt-5" onClick={onFinish}>
          <Route className="h-4 w-4" /> Explorar el corredor
        </Button>

        <Link
          href="/perfil"
          className="mt-3 flex items-center gap-1 text-[10px] text-text-secondary/60 transition-colors hover:text-primary-light"
        >
          <Sparkles className="h-3 w-3" /> Editar perfil después
        </Link>
      </div>
    </OnboardingStage>
  );
}
