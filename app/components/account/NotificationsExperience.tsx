'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Bell, Sparkles } from 'lucide-react';
import { PageHeader } from '../ui/PageHeader';
import { useAppState } from '@/app/lib/AppState';
import { cn } from '@/app/lib/design-system';
import { EASE } from '@/app/lib/motion';

export default function NotificationsExperience() {
  const reduced = useReducedMotion();
  const { notifications, markNotificationsRead } = useAppState();

  useEffect(() => {
    const timer = window.setTimeout(() => markNotificationsRead(), 2200);
    return () => window.clearTimeout(timer);
  }, [markNotificationsRead]);

  return (
    <div className="page-shell max-w-3xl">
      <PageHeader
        eyebrow="Señales del sistema"
        title="Todo lo que"
        accent="importa, al instante."
        description="Confirmaciones de cupo, PINs de abordaje, cambios de ruta y alertas de seguridad."
      />

      <div className="mt-8 space-y-2.5">
        {notifications.length === 0 ? (
          <div className="glass flex flex-col items-center rounded-[28px] px-6 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-primary-light">
              <Bell className="h-6 w-6" />
            </span>
            <p className="display mt-5 text-2xl">Sin señales nuevas</p>
            <p className="mt-2 text-sm text-text-secondary">Las alertas de tus viajes aparecerán aquí.</p>
          </div>
        ) : (
          notifications.map((item, index) => {
            const content = (
              <motion.div
                initial={reduced ? false : { opacity: 0, y: 16, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.7, ease: EASE, delay: index * 0.06 }}
                className={cn(
                  'group relative overflow-hidden rounded-[22px] border p-4 transition-colors duration-500',
                  item.read
                    ? 'border-white/[0.07] bg-white/[0.025]'
                    : 'border-primary/25 bg-primary/[0.06] shadow-[0_0_44px_-20px_rgba(124,156,255,0.5)]',
                )}
              >
                {!item.read && (
                  <span className="absolute left-0 top-4 h-8 w-[2px] rounded-full bg-gradient-to-b from-primary to-accent" />
                )}
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border',
                      item.read
                        ? 'border-white/10 bg-white/[0.04] text-text-secondary'
                        : 'border-accent/30 bg-accent/10 text-accent',
                    )}
                  >
                    {item.read ? <Bell className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[12.5px] font-semibold leading-snug text-text">{item.title}</p>
                      <span className="shrink-0 font-mono text-[8px] text-text-secondary/45">{item.at}</span>
                    </div>
                    <p className="mt-1 text-[11.5px] leading-relaxed text-text-secondary">{item.body}</p>
                    {item.href && (
                      <span className="mt-2 inline-flex items-center gap-1 text-[9.5px] font-medium text-accent/80 transition-colors group-hover:text-accent">
                        Abrir detalle <ArrowUpRight className="h-2.5 w-2.5" />
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );

            return item.href ? (
              <Link key={item.id} href={item.href} className="block">
                {content}
              </Link>
            ) : (
              <div key={item.id}>{content}</div>
            );
          })
        )}
      </div>

      <p className="mt-8 text-center font-mono text-[8px] uppercase tracking-[0.16em] text-text-secondary/35">
        Las notificaciones se marcan como leídas automáticamente
      </p>
    </div>
  );
}
