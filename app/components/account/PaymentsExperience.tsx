'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDownLeft, ArrowUpRight, CreditCard, Landmark, ShieldCheck, Smartphone, Sparkles, Wallet } from 'lucide-react';
import { PageHeader } from '../ui/PageHeader';
import { Badge } from '../ui/Badge';
import { TiltCard } from '../fx/TiltCard';
import { paymentMethods, useAppState } from '@/app/lib/AppState';
import { cn, formatCOP, getInitials } from '@/app/lib/design-system';
import { EASE } from '@/app/lib/motion';

const METHOD_ICON = {
  nequi: Smartphone,
  daviplata: Wallet,
  tarjeta: CreditCard,
} as const;

export default function PaymentsExperience() {
  const reduced = useReducedMotion();
  const { balance, ledger, preferredPayment, setPreferredPayment } = useAppState();
  const preferred = paymentMethods.find((method) => method.id === preferredPayment) ?? paymentMethods[0];

  return (
    <div className="page-shell relative">
      <PageHeader
        eyebrow="Billetera · COP"
        title="Tu saldo,"
        accent="sin fricción."
        description="Cargos transparentes, sin comisiones ocultas. Paga con Nequi, DaviPlata o efectivo validado con PIN."
      />

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Holographic balance card */}
        <TiltCard intensity={7} lift={14}>
          <div className="relative aspect-[1.72/1] w-full overflow-hidden rounded-[28px] border border-white/[0.16] bg-[linear-gradient(135deg,#1a2340_0%,#0a1122_45%,#050810_100%)] p-6 shadow-[0_60px_120px_-50px_rgba(0,0,0,1)]">
            <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/35 blur-[80px]" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-accent/20 blur-[80px]" />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.35]"
              style={{
                background:
                  'linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.10) 38%, rgba(255,255,255,0.02) 48%, transparent 62%)',
              }}
            />
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="font-mono text-[8px] uppercase tracking-[0.24em] text-white/50">RutaCero Wallet</p>
                <p className="mt-1 text-[11px] text-white/70">Cali · Colombia</p>
              </div>
              <Sparkles className="h-4 w-4 text-accent/80" />
            </div>

            <div className="relative mt-7">
              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/40">Saldo disponible</p>
              <p className="mt-1.5 font-mono text-[30px] leading-none tracking-tight text-white sm:text-[36px]">
                {formatCOP(balance).replace(' COP', '')}
                <span className="ml-2 font-sans text-[10px] font-medium tracking-[0.14em] text-white/50">COP</span>
              </p>
            </div>

            <div className="relative mt-8 flex items-end justify-between">
              <div>
                <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/40">Cuenta</p>
                <p className="mt-1 font-mono text-[12px] tracking-[0.22em] text-white/85">•••• 4821</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/40">Titular</p>
                <p className="mt-1 text-[11px] text-white/85">{getInitials('Valentina Ríos')} · TITULAR</p>
              </div>
            </div>

            <div className="relative mt-5 flex items-center justify-between border-t border-white/[0.08] pt-3">
              <span className="flex items-center gap-1.5 font-mono text-[7.5px] uppercase tracking-[0.16em] text-white/40">
                <ShieldCheck className="h-3 w-3 text-accent/60" /> Pago protegido
              </span>
              <div className="flex gap-1">
                <span className="h-3 w-5 rounded-sm bg-white/20" />
                <span className="h-3 w-5 rounded-sm bg-white/10" />
              </div>
            </div>
          </div>
        </TiltCard>

        {/* Methods */}
        <div>
          <div className="glass-strong overflow-hidden rounded-[26px] p-4">
            <div className="flex items-center justify-between">
              <p className="hud text-[8px]">Método preferido</p>
              <span className="font-mono text-[8px] text-text-secondary/50">{paymentMethods.length} vinculados</span>
            </div>
            <div className="mt-3 space-y-2">
              {paymentMethods.map((method) => {
                const Icon = METHOD_ICON[method.type];
                const selected = preferredPayment === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPreferredPayment(method.id)}
                    className={cn(
                      'group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border p-3 text-left transition-colors duration-300',
                      selected
                        ? 'border-primary/35 bg-primary/[0.08]'
                        : 'border-white/[0.07] bg-white/[0.025] hover:border-white/15',
                    )}
                  >
                    {selected && (
                      <motion.span
                        layoutId="method-glow"
                        className="pointer-events-none absolute inset-0 rounded-2xl border border-primary/25"
                        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                      />
                    )}
                    <span
                      className={cn(
                        'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border',
                        selected ? 'border-primary/30 bg-primary/15 text-primary-light' : 'border-white/10 bg-white/[0.04] text-text-secondary',
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[12px] font-medium text-text">{method.label}</span>
                      <span className="block truncate text-[9.5px] text-text-secondary/65">{method.detail}</span>
                    </span>
                    <span
                      className={cn(
                        'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors',
                        selected ? 'border-accent bg-accent/20' : 'border-white/20',
                      )}
                    >
                      {selected && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-[9px] text-text-secondary/50">
              <Landmark className="h-3 w-3" /> Los cargos se descuentan al confirmar un cupo.
            </p>
          </div>

          <div className="glass mt-3 flex items-center justify-between rounded-2xl px-4 py-3">
            <span className="hud text-[7.5px]">Método activo</span>
            <Badge variant="accent">{preferred?.label ?? 'Nequi'}</Badge>
          </div>
        </div>
      </div>

      {/* Ledger */}
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="hud text-[8.5px]">Movimientos</h2>
          <span className="font-mono text-[8px] text-text-secondary/40">{String(ledger.length).padStart(2, '0')} registros</span>
        </div>

        <div className="mt-4 overflow-hidden rounded-[26px] border border-white/[0.08] bg-white/[0.02]">
          {ledger.map((entry, index) => {
            const positive = entry.amount >= 0;
            return (
              <motion.div
                key={entry.id}
                initial={reduced ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: EASE, delay: index * 0.04 }}
                className="flex items-center gap-3 border-b border-white/[0.05] px-4 py-3.5 last:border-0"
              >
                <span
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border',
                    positive ? 'border-success/25 bg-success/[0.08] text-success' : 'border-white/10 bg-white/[0.04] text-text-secondary',
                  )}
                >
                  {positive ? <ArrowDownLeft className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11.5px] font-medium text-text/90">{entry.label}</p>
                  <p className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.1em] text-text-secondary/45">{entry.at}</p>
                </div>
                <p className={cn('shrink-0 font-mono text-[12px]', positive ? 'text-success' : 'text-text')}>
                  {positive ? '+' : '−'}
                  {formatCOP(Math.abs(entry.amount)).replace(' COP', '')}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <p className="mt-6 flex items-center justify-center gap-1.5 text-[9px] text-text-secondary/35">
        <ShieldCheck className="h-3 w-3" /> Transacciones cifradas · sin comisiones ocultas
      </p>
    </div>
  );
}
