'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Car, Check, RefreshCw, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { OnboardingStage } from './OnboardingStage';
import { cn } from '@/app/lib/design-system';
import { springSnap } from '@/app/lib/motion';

type Role = 'conductor' | 'viajero' | 'ambos';

const ROLES: {
  value: Role;
  label: string;
  subtitle: string;
  detail: string;
  Icon: React.ComponentType<{ className?: string }>;
}[] = [
  { value: 'conductor', label: 'Conductor', subtitle: 'Comparto mi ruta', detail: 'Publica cupos y reparte el costo de tu trayecto habitual.', Icon: Car },
  { value: 'viajero', label: 'Viajero', subtitle: 'Busco un cupo', detail: 'Reserva un asiento verificado y viaja con estudiantes de tu corredor.', Icon: User },
  { value: 'ambos', label: 'Ambos', subtitle: 'Según el día', detail: 'Conduce cuando tengas cupo y viaja cuando lo necesites.', Icon: RefreshCw },
];

export function OnboardingRole({ onSelect }: { onSelect: (role: Role) => void }) {
  const [role, setRole] = useState<Role | null>(null);
  const active = ROLES.find((item) => item.value === role);

  return (
    <OnboardingStage
      step={1}
      eyebrow="Define tu rol"
      title="¿Cómo te mueves"
      accent="por Cali?"
      description="Tu rol ajusta la experiencia: rutas que publicas, cupos que reservas y cómo te encuentra la comunidad."
    >
      <div className="space-y-2">
        {ROLES.map((item) => {
          const Icon = item.Icon;
          const selected = role === item.value;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setRole(item.value)}
              className={cn(
                'group relative flex w-full items-start gap-3.5 overflow-hidden rounded-[20px] border p-3.5 text-left transition-colors duration-300',
                selected
                  ? 'border-primary/40 bg-primary/[0.09]'
                  : 'border-white/[0.08] bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.05]',
              )}
            >
              {selected && (
                <motion.span
                  layoutId="role-glow"
                  className="pointer-events-none absolute inset-0 rounded-[20px] border border-primary/30"
                  transition={springSnap}
                />
              )}
              <span
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors duration-300',
                  selected
                    ? 'border-primary/35 bg-primary/15 text-primary-light'
                    : 'border-white/10 bg-white/[0.04] text-text-secondary group-hover:text-text',
                )}
              >
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="text-[13.5px] font-semibold text-text">{item.label}</span>
                  <span
                    className={cn(
                      'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors',
                      selected ? 'border-accent bg-accent/20' : 'border-white/15',
                    )}
                  >
                    {selected && <Check className="h-2.5 w-2.5 text-accent" />}
                  </span>
                </span>
                <span className="mt-0.5 block font-mono text-[7.5px] uppercase tracking-[0.14em] text-text-secondary/50">
                  {item.subtitle}
                </span>
                <AnimatePresence initial={false}>
                  {selected && (
                    <motion.span
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="block overflow-hidden"
                    >
                      <span className="mt-2 block text-[10.5px] leading-relaxed text-text-secondary">{item.detail}</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </button>
          );
        })}
      </div>

      <Button
        variant="primary"
        fullWidth
        size="lg"
        className="mt-5"
        disabled={!role}
        onClick={() => role && onSelect(role)}
      >
        {active ? `Continuar como ${active.label.toLowerCase()}` : 'Elige tu rol'}
      </Button>
      <p className="mt-3 text-center font-mono text-[7.5px] uppercase tracking-[0.14em] text-text-secondary/35">
        Podrás cambiarlo desde tu perfil
      </p>
    </OnboardingStage>
  );
}
