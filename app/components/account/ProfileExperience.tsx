'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowUpRight,
  ChevronRight,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  Wallet,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { TiltCard } from '../fx/TiltCard';
import { Reveal } from '../fx/Reveal';
import { Magnetic } from '../fx/Magnetic';
import { useAppState } from '@/app/lib/AppState';
import { cn, formatCOP, getInitials, getMembershipLevel, getMembershipProgress } from '@/app/lib/design-system';
import { EASE } from '@/app/lib/motion';
import { useTheme } from '@/app/hooks/useTheme';

const LINKS = [
  { href: '/historial', label: 'Historial de viajes', meta: 'Reservas y rutas' },
  { href: '/pagos', label: 'Pagos y saldo', meta: 'Billetera COP' },
  { href: '/notificaciones', label: 'Notificaciones', meta: 'Señales del sistema' },
  { href: '/acerca', label: 'Sobre RutaCero', meta: 'Manifiesto' },
  { href: '/legal', label: 'Términos y privacidad', meta: 'Legal' },
];

function readOnboardingData() {
  try {
    const raw = localStorage.getItem('rutacero-onboarding');
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        email: parsed.email || undefined,
        role: parsed.role || undefined,
        contactMethod: parsed.contactMethod || undefined,
      };
    }
  } catch {
    /* ignore */
  }
  return { email: undefined, role: undefined, contactMethod: undefined };
}

export default function ProfileExperience() {
  const reduced = useReducedMotion();
  const { balance, unreadNotifications, reservations, published } = useAppState();
  const [theme, , setTheme] = useTheme();
  const [userData, setUserData] = useState<ReturnType<typeof readOnboardingData>>({
    email: undefined,
    role: undefined,
    contactMethod: undefined,
  });

  useEffect(() => {
    const sync = () => setUserData(readOnboardingData());
    sync();
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const totalTrips = reservations.length + published.length;
  const level = getMembershipLevel(totalTrips);
  const progress = getMembershipProgress(totalTrips);

  const userEmail = userData.email || 'valentina.rios@icesi.edu.co';
  const university = userEmail.includes('icesi')
    ? 'Universidad Icesi'
    : userEmail.includes('javeriana')
      ? 'Pontificia Universidad Javeriana'
      : userEmail.includes('uao')
        ? 'Universidad Autónoma de Occidente'
        : userEmail.includes('univalle')
          ? 'Universidad del Valle'
          : 'Universidad de Cali';
  const displayName = userData.email
    ? userEmail.split('@')[0]?.replace(/\./g, ' ') || 'Valentina Ríos'
    : 'Valentina Ríos';

  return (
    <div className="page-shell relative max-w-4xl">
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="flex items-center gap-2"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_12px_3px_rgba(92,233,220,0.5)]" />
        <p className="hud text-[8.5px]">Identidad verificada · Cali</p>
      </motion.div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <TiltCard intensity={5} lift={10}>
          <div className="glass-strong relative overflow-hidden rounded-[30px] p-6">
            <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-primary/25 blur-[80px]" />
            <div className="pointer-events-none absolute -bottom-24 -left-20 h-48 w-48 rounded-full bg-accent/15 blur-[70px]" />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"
            />

            <div className="relative flex items-start justify-between gap-3">
              <div className="relative">
                <span className="absolute -inset-2 rounded-full bg-[conic-gradient(from_120deg,rgba(124,156,255,0.6),rgba(92,233,220,0.5),rgba(167,139,250,0.5),rgba(124,156,255,0.6))] opacity-60 blur-md" />
                <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[conic-gradient(from_140deg,#7c9cff,#5ce9dc,#a78bfa,#7c9cff)] p-[1.5px]">
                  <span className="flex h-full w-full items-center justify-center rounded-full bg-[#070b14] text-xl font-semibold text-text">
                    {getInitials(displayName)}
                  </span>
                </span>
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-[#070b14] bg-accent text-[#04110f] shadow-[0_0_14px_rgba(92,233,220,0.7)]">
                  <ShieldCheck className="h-3 w-3" />
                </span>
              </div>

              <span className="badge badge-accent">
                <Sparkles className="h-3 w-3" /> {level.label}
              </span>
            </div>

            <h1 className="display relative mt-5 text-[1.9rem] capitalize leading-tight text-text">
              {displayName}
            </h1>
            <p className="relative mt-1 truncate text-[11.5px] text-text-secondary">{userEmail}</p>

            <div className="relative mt-3 flex flex-wrap gap-2">
              <Badge variant="secondary">{university}</Badge>
              <Badge variant="outline">
                {userData.contactMethod === 'demo' ? 'Exploración' : userData.contactMethod || 'Email'}
              </Badge>
            </div>

            <div className="hairline relative my-5" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <p className="hud text-[7.5px]">Progreso de reputación</p>
                <span className="font-mono text-[9px] text-accent">{progress.percent}%</span>
              </div>
              <Progress className="mt-2.5" value={progress.percent} />
              <p className="mt-2 text-[10px] text-text-secondary/70">{progress.remainingText}</p>
            </div>

            <div className="relative mt-5 grid grid-cols-3 gap-2">
              {[
                { label: 'Viajes', value: String(totalTrips) },
                { label: 'Reputación', value: '5.0' },
                { label: 'Saldo', value: formatCOP(balance).replace(' COP', '') },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2">
                  <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-text-secondary/50">{stat.label}</p>
                  <p className="mt-1 truncate font-mono text-[13px] text-text">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </TiltCard>

        <div className="space-y-3">
          <Reveal delay={0.05}>
            <div className="glass rounded-[24px] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="hud text-[7.5px]">Ambiente de la interfaz</p>
                  <p className="mt-1 text-[12px] font-medium text-text">
                    {theme === 'light' ? 'Solaris' : 'Nocturne'}
                  </p>
                </div>
                <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-text-secondary/40">
                  live render
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-1.5 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5">
                {([
                  ['dark', 'Nocturne', Moon],
                  ['light', 'Solaris', Sun],
                ] as const).map(([value, label, Icon]) => {
                  const active = theme === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setTheme(value)}
                      className={cn(
                        'relative flex items-center justify-center gap-2 rounded-xl py-2.5 text-[10.5px] font-medium transition-colors duration-300',
                        active ? 'text-text' : 'text-text-secondary/60 hover:text-text',
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="ambience-pill"
                          className="absolute inset-0 rounded-xl border border-white/10 bg-white/[0.08]"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      <Icon className="relative z-10 h-3.5 w-3.5" />
                      <span className="relative z-10">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/pagos" className="glass group rounded-[22px] p-4 transition-colors hover:border-white/20">
                <Wallet className="h-4 w-4 text-accent/80" />
                <p className="mt-6 font-mono text-[16px] text-text">{formatCOP(balance).replace(' COP', '')}</p>
                <p className="mt-1 flex items-center gap-1 text-[9.5px] text-text-secondary/60">
                  Saldo <ArrowUpRight className="h-2.5 w-2.5" />
                </p>
              </Link>
              <div className="glass rounded-[22px] p-4">
                <Sparkles className="h-4 w-4 text-amber/80" />
                <p className="mt-6 font-mono text-[16px] text-text">{unreadNotifications}</p>
                <p className="mt-1 text-[9.5px] text-text-secondary/60">Señales sin leer</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.02]">
              {LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center justify-between gap-3 border-b border-white/[0.05] px-4 py-3.5 last:border-0 transition-colors duration-300 hover:bg-white/[0.04]"
                >
                  <span className="min-w-0">
                    <span className="block text-[11.5px] font-medium text-text/90">{item.label}</span>
                    <span className="mt-0.5 block font-mono text-[7.5px] uppercase tracking-[0.12em] text-text-secondary/40">
                      {item.meta}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    {item.href === '/notificaciones' && unreadNotifications > 0 && (
                      <Badge variant="accent">{unreadNotifications}</Badge>
                    )}
                    <ChevronRight className="h-3.5 w-3.5 text-text-secondary/40 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center justify-between gap-3 pb-2 sm:flex-row">
        <p className="flex items-center gap-2 text-[9.5px] text-text-secondary/45">
          <ShieldCheck className="h-3.5 w-3.5 text-primary/70" />
          Identidad institucional verificada · datos protegidos (Ley 1581/2012)
        </p>
        <Magnetic strength={0.2}>
          <Link
            href="/acerca"
            className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[9.5px] text-text-secondary/70 transition-colors hover:border-accent/30 hover:text-accent"
          >
            Conoce el manifiesto <ArrowUpRight className="h-2.5 w-2.5" />
          </Link>
        </Magnetic>
      </div>
    </div>
  );
}
