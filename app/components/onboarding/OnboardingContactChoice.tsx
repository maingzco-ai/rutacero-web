'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Mail, MessageSquare, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { OnboardingStage } from './OnboardingStage';
import { cn } from '@/app/lib/design-system';
import { springSnap } from '@/app/lib/motion';

type Method = 'telegram' | 'email' | 'demo';

interface Props {
  onSelect: (method: Method) => void;
}

const METHODS: {
  value: Method;
  label: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  benefits: string[];
  badge?: string;
}[] = [
  {
    value: 'telegram',
    label: 'Telegram',
    subtitle: 'Gratis · sin exponer tu número',
    icon: MessageSquare,
    benefits: ['Código y notificaciones en el chat', 'Privacidad total del teléfono', 'Desvinculación inmediata con /desvincular'],
  },
  {
    value: 'email',
    label: 'Correo institucional',
    subtitle: 'Código OTP de 5 dígitos',
    icon: Mail,
    benefits: ['@icesi · @javerianacali · @uao · @corunivalle', 'Código con vigencia de 5 minutos', 'Cambiable desde tu perfil'],
  },
  {
    value: 'demo',
    label: 'Modo exploración',
    subtitle: 'Acceso inmediato de evaluación',
    icon: Sparkles,
    badge: 'ABIERTO',
    benefits: ['Datos precargados para recorrer la app', 'Sin email ni Telegram', 'Ideal para una revisión completa'],
  },
];

export function OnboardingContactChoice({ onSelect }: Props) {
  const [method, setMethod] = useState<Method | null>(null);
  const active = METHODS.find((item) => item.value === method);

  return (
    <OnboardingStage
      step={2}
      eyebrow="Método de acceso"
      title="Verifica tu"
      accent="identidad."
      description="Elige cómo recibir tu código de acceso. En todos los casos verificamos que perteneces a la comunidad."
    >
      <div className="space-y-2">
        {METHODS.map((item) => {
          const Icon = item.icon;
          const selected = method === item.value;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setMethod(item.value)}
              className={cn(
                'group relative w-full overflow-hidden rounded-[20px] border p-3.5 text-left transition-colors duration-300',
                selected
                  ? 'border-primary/40 bg-primary/[0.09]'
                  : 'border-white/[0.08] bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.05]',
              )}
            >
              {selected && (
                <motion.span
                  layoutId="contact-glow"
                  className="pointer-events-none absolute inset-0 rounded-[20px] border border-primary/30"
                  transition={springSnap}
                />
              )}
              <div className="flex items-start gap-3.5">
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
                    <span className="flex items-center gap-2">
                      <span className="text-[13.5px] font-semibold text-text">{item.label}</span>
                      {item.badge && (
                        <span className="rounded-full border border-amber/30 bg-amber/10 px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.1em] text-amber">
                          {item.badge}
                        </span>
                      )}
                    </span>
                    <span
                      className={cn(
                        'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors',
                        selected ? 'border-accent bg-accent/20' : 'border-white/15',
                      )}
                    >
                      {selected && <CheckCircle2 className="h-3 w-3 text-accent" />}
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
                        <span className="mt-2.5 block space-y-1.5">
                          {item.benefits.map((benefit) => (
                            <span key={benefit} className="flex items-start gap-1.5 text-[10px] leading-relaxed text-text-secondary">
                              <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-accent/70" />
                              {benefit}
                            </span>
                          ))}
                        </span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <Button
        variant={method === 'demo' ? 'secondary' : 'primary'}
        fullWidth
        size="lg"
        className="mt-5"
        disabled={!method}
        onClick={() => method && onSelect(method)}
      >
        {active ? (
          method === 'demo' ? (
            <>
              <Sparkles className="h-4 w-4" /> Entrar en modo exploración
            </>
          ) : (
            `Continuar con ${active.label}`
          )
        ) : (
          'Elige un método'
        )}
      </Button>
      <p className="mt-3 text-center font-mono text-[7.5px] uppercase tracking-[0.14em] text-text-secondary/35">
        Puedes cambiarlo después en ajustes
      </p>
    </OnboardingStage>
  );
}
