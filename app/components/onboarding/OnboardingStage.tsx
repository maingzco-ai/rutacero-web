'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { LogoMark, Wordmark } from '../shell/Logo';
import { EASE } from '@/app/lib/motion';
import { cn } from '@/app/lib/design-system';

const LABELS = ['Rol', 'Contacto', 'Acceso', 'Verificación', 'Bienvenida'];

export function OnboardingStage({
  step,
  total = 5,
  eyebrow,
  title,
  accent,
  description,
  children,
  className,
}: {
  step: number;
  total?: number;
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <div className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden px-4 py-24">
      <div aria-hidden="true" className="grid-veil pointer-events-none absolute inset-0 opacity-20" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/4 h-[520px] w-[520px] rounded-full border border-white/[0.05]"
        style={{ boxShadow: 'inset 0 0 120px rgba(79,109,245,0.08)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-1/4 h-[420px] w-[420px] rounded-full border border-white/[0.05]"
        style={{ boxShadow: 'inset 0 0 100px rgba(92,233,220,0.06)' }}
      />

      <div className="relative grid w-full max-w-5xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <div className="hidden lg:block">
          <div className="flex items-center gap-3">
            <LogoMark size={36} />
            <div className="flex flex-col">
              <Wordmark />
              <span className="mt-1 font-mono text-[7.5px] uppercase tracking-[0.24em] text-text-secondary/50">
                Acceso espacial
              </span>
            </div>
          </div>

          <div className="mt-14 flex items-center gap-2">
            <span className="font-mono text-[9px] tracking-[0.2em] text-accent">
              {String(step).padStart(2, '0')}
            </span>
            <span className="h-px w-10 bg-white/15" />
            <span className="font-mono text-[8px] tracking-[0.18em] text-text-secondary/40">
              / {String(total).padStart(2, '0')}
            </span>
          </div>

          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 24, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.95, ease: EASE }}
            className="display mt-5 text-[3.1rem] leading-[0.94] text-text"
          >
            {title}
            {accent && (
              <>
                <br />
                <span className="serif text-primary-light">{accent}</span>
              </>
            )}
          </motion.h1>

          {description && (
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
              className="mt-5 max-w-sm text-[13px] leading-relaxed text-text-secondary"
            >
              {description}
            </motion.p>
          )}

          <div className="mt-10 flex flex-col gap-2.5">
            {LABELS.slice(0, total).map((label, index) => {
              const position = index + 1;
              const active = position === step;
              const complete = position < step;
              return (
                <div key={label} className="flex items-center gap-3">
                  <span
                    className={cn(
                      'flex h-5 w-5 items-center justify-center rounded-full border text-[7.5px] font-mono transition-colors duration-500',
                      active && 'border-accent/50 bg-accent/15 text-accent',
                      complete && 'border-success/30 bg-success/10 text-success',
                      !active && !complete && 'border-white/10 text-text-secondary/30',
                    )}
                  >
                    {complete ? '✓' : String(position).padStart(2, '0')}
                  </span>
                  <span
                    className={cn(
                      'font-mono text-[8px] uppercase tracking-[0.18em] transition-colors duration-500',
                      active ? 'text-text' : 'text-text-secondary/35',
                    )}
                  >
                    {label}
                  </span>
                  {active && <motion.span layoutId="step-line" className="h-px flex-1 bg-gradient-to-r from-accent/40 to-transparent" />}
                </div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 30, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
          className={cn(
            'glass-strong relative w-full overflow-hidden rounded-[30px] p-5 sm:p-8',
            className,
          )}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"
          />

          <div className="mb-6 flex items-center justify-between lg:hidden">
            <div className="flex items-center gap-2.5">
              <LogoMark size={28} />
              <Wordmark compact />
            </div>
            <span className="font-mono text-[8px] tracking-[0.18em] text-text-secondary/45">
              {String(step).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
          </div>

          <div className="lg:hidden">
            <p className="hud text-[7.5px]">{eyebrow}</p>
            <h2 className="display mt-2.5 text-[1.8rem] leading-tight text-text">
              {title}
              {accent && (
                <>
                  {' '}
                  <span className="serif text-primary-light">{accent}</span>
                </>
              )}
            </h2>
            {description && <p className="mt-2 text-[11.5px] leading-relaxed text-text-secondary">{description}</p>}
          </div>

          <div className="mt-6 lg:mt-0">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}
