'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Clock3, KeyRound, MapPin, Route, ShieldCheck, Sparkles, Users, AlertCircle, MessageCircle, Smartphone, Wallet } from 'lucide-react';
import { PageHeader } from '../ui/PageHeader';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Reveal } from '../fx/Reveal';
import { TiltCard } from '../fx/TiltCard';
import { useAppState } from '@/app/lib/AppState';
import { getTrip } from '@/app/lib/catalog';
import { cn, formatCOP } from '@/app/lib/design-system';
import { EASE } from '@/app/lib/motion';

export default function HistoryExperience() {
  const reduced = useReducedMotion();
  const { reservations, published, routeRequests } = useAppState();

  const spent = reservations.reduce((sum, reservation) => {
    const trip = getTrip(reservation.tripId);
    return sum + (trip?.price ?? 0);
  }, 0);

  // Filtrar solicitudes propias
  const myRequests = routeRequests.filter((req) => req.status !== 'expired');

  return (
    <div className="page-shell relative">
      <PageHeader
        eyebrow="Archivo de movilidad"
        title="Tus rutas,"
        accent="tu historial."
        description="Cada cupo reservado, cada ruta publicada y cada solicitud de cupo, con su estado. Tu reputación se construye viaje a viaje."
      />

      <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-3">
        {[
          { value: reservations.length, label: 'reservas', icon: KeyRound },
          { value: published.length, label: 'rutas publicadas', icon: Route },
          { value: myRequests.length, label: 'solicitudes', icon: Users },
          { value: formatCOP(spent).replace(' COP', ''), label: 'invertido', icon: Sparkles },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: index * 0.08 }}
              className="glass relative overflow-hidden rounded-2xl px-3 py-3 sm:px-4"
            >
              <Icon className="h-3.5 w-3.5 text-accent/70" />
              <p className="mt-2 truncate font-mono text-[17px] leading-none text-text sm:text-[20px]">{stat.value}</p>
              <p className="mt-1.5 font-mono text-[7.5px] uppercase tracking-[0.14em] text-text-secondary/60">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(92,233,220,0.7)]" />
            <h2 className="hud text-[8.5px]">Reservas confirmadas</h2>
          </div>
          <span className="font-mono text-[8px] text-text-secondary/40">{String(reservations.length).padStart(2, '0')}</span>
        </div>

        {reservations.length === 0 ? (
          <Reveal>
            <div className="glass-strong flex flex-col items-center rounded-[28px] px-6 py-14 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-primary-light">
                <Route className="h-6 w-6" />
              </span>
              <p className="display mt-5 text-2xl text-text">Todavía sin rutas</p>
              <p className="mt-2 max-w-xs text-[12.5px] leading-relaxed text-text-secondary">
                Reserva tu primer cupo y el PIN de abordaje aparecerá aquí, listo para mostrar.
              </p>
              <Link href="/" className="mt-6">
                <Button variant="primary" size="sm">
                  Explorar el corredor <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </Reveal>
        ) : (
          <div className="relative mt-5 pl-6">
            <span
              aria-hidden="true"
              className="absolute bottom-3 left-[6px] top-3 w-px bg-gradient-to-b from-primary/70 via-accent/35 to-transparent"
            />
            {reservations.map((reservation, index) => {
              const trip = getTrip(reservation.tripId);
              return (
                <motion.div
                  key={reservation.id}
                  initial={reduced ? false : { opacity: 0, x: 22 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 0.7, ease: EASE, delay: index * 0.05 }}
                  className="relative mb-3"
                >
                  <span className="absolute -left-[22px] top-6 h-2 w-2 rounded-full border border-accent/70 bg-accent/30 shadow-[0_0_14px_rgba(92,233,220,0.6)]" />
                  <div className="glass group relative overflow-hidden rounded-[24px] p-4 sm:p-5">
                    <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/15 blur-[60px]" />
                    <div className="relative flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="hud text-[7.5px]">
                          {reservation.createdAt} · {reservation.preference}
                        </p>
                        <p className="mt-1.5 truncate text-[15px] font-medium text-text">
                          {trip ? `${trip.origin} → ${trip.destination}` : 'Viaje reservado'}
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-[10.5px] text-text-secondary">
                          <MapPin className="h-3 w-3 text-primary/80" />
                          Recogida: {reservation.pickup}
                        </p>
                      </div>
                      <Badge variant="accent">{reservation.status}</Badge>
                    </div>

                    <div className="relative mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.07] pt-3">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-black/20 px-2.5 py-1.5">
                          <KeyRound className="h-3 w-3 text-accent" />
                          <span className="font-mono text-[11px] tracking-[0.14em] text-text">{reservation.pin}</span>
                        </span>
                        {reservation.paymentMethod && (
                          <span className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-black/20 px-2.5 py-1.5 text-[9px]">
                            {reservation.paymentMethod === 'nequi' && <Smartphone className="h-2.5 w-2.5 text-primary" />}
                            {reservation.paymentMethod === 'daviplata' && <Smartphone className="h-2.5 w-2.5 text-amber" />}
                            {reservation.paymentMethod === 'efectivo' && <Wallet className="h-2.5 w-2.5 text-success" />}
                            <span className="font-mono text-text-secondary/70 capitalize">{reservation.paymentMethod}</span>
                          </span>
                        )}
                        {trip && (
                          <span className="text-[10px] text-text-secondary/70">
                            {trip.driver.name} · {trip.price !== undefined ? formatCOP(trip.price) : ''}
                          </span>
                        )}
                      </div>
                      {reservation.commission !== undefined && reservation.commission > 0 && (
                        <div className="flex items-center gap-1.5 text-[9px] text-primary/80">
                          <Sparkles className="h-2.5 w-2.5" />
                          <span className="font-mono">Comisión: {formatCOP(reservation.commission)}</span>
                        </div>
                      )}
                      {trip && (
                        <Link
                          href={`/viaje/${trip.id}`}
                          className="flex items-center gap-1 text-[10px] font-medium text-accent/80 transition-colors hover:text-accent"
                        >
                          Ver detalle <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(124,156,255,0.7)]" />
            <h2 className="hud text-[8.5px]">Rutas que ofreces</h2>
          </div>
          <Link href="/publicar" className="flex items-center gap-1 text-[9.5px] text-accent/80 hover:text-accent">
            Publicar <ArrowUpRight className="h-2.5 w-2.5" />
          </Link>
        </div>

        {published.length === 0 ? (
          <Reveal>
            <div className="glass flex items-center justify-between gap-4 rounded-[24px] p-5">
              <div>
                <p className="text-[13px] font-medium text-text">Aún no publicas rutas</p>
                <p className="mt-1 text-[11px] text-text-secondary">Comparte tu recorrido habitual y reparte el costo.</p>
              </div>
              <Link href="/publicar">
                <Button variant="secondary" size="sm">
                  Publicar
                </Button>
              </Link>
            </div>
          </Reveal>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {published.map((route, index) => (
              <motion.div
                key={route.id}
                initial={reduced ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: EASE, delay: index * 0.05 }}
              >
                <TiltCard intensity={3} lift={6} className="h-full">
                  <div className="glass relative h-full overflow-hidden rounded-[24px] p-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="hud text-[7.5px]">Ruta publicada · {route.departure}</p>
                      <ShieldCheck className="h-3.5 w-3.5 text-success/80" />
                    </div>
                    <p className="mt-2 text-[13.5px] font-medium leading-snug text-text">
                      {route.origin} <span className="text-primary-light">→</span> {route.destination}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] text-text-secondary">
                      <span className="flex items-center gap-1">
                        <Clock3 className="h-3 w-3" /> {route.departure}
                      </span>
                      <span className="opacity-30">/</span>
                      <span>{route.seats} cupos</span>
                      <span className="opacity-30">/</span>
                      <span className="font-mono">{formatCOP(route.price)}</span>
                    </div>
                    <p className="mt-3 truncate font-mono text-[9px] uppercase tracking-[0.1em] text-text-secondary/40">
                      {route.vehicle} · {route.plate}
                    </p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Solicitudes de cupo */}
      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber shadow-[0_0_10px_rgba(255,176,0,0.7)]" />
            <h2 className="hud text-[8.5px]">Solicitudes de cupo</h2>
          </div>
          <Link href="/publicar" className="flex items-center gap-1 text-[9.5px] text-amber/80 hover:text-amber">
            Pedir cupo <ArrowUpRight className="h-2.5 w-2.5" />
          </Link>
        </div>

        {myRequests.length === 0 ? (
          <Reveal>
            <div className="glass flex items-center justify-between gap-4 rounded-[24px] p-5">
              <div>
                <p className="text-[13px] font-medium text-text">Aún no pides cupos</p>
                <p className="mt-1 text-[11px] text-text-secondary">Publica tu necesidad de viaje y los conductores te contactarán.</p>
              </div>
              <Link href="/publicar">
                <Button variant="secondary" size="sm">
                  Pedir cupo
                </Button>
              </Link>
            </div>
          </Reveal>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {myRequests.map((req, index) => (
              <motion.div
                key={req.id}
                initial={reduced ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: EASE, delay: index * 0.05 }}
              >
                <TiltCard intensity={3} lift={6} className="h-full">
                  <div className="glass relative h-full overflow-hidden rounded-[24px] p-4 border border-amber/10">
                    <div className="flex items-start justify-between gap-2">
                      <p className="hud text-[7.5px] flex items-center gap-1">
                        <Users className="h-3 w-3 text-amber/70" />
                        Solicitud · {req.departure}
                      </p>
                      <Badge variant={req.status === 'matched' ? 'accent' : 'secondary'}>{req.status === 'matched' ? 'Emparejado' : 'Pendiente'}</Badge>
                    </div>
                    <p className="mt-2 text-[13.5px] font-medium leading-snug text-text">
                      {req.origin} <span className="text-amber">→</span> {req.destination}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] text-text-secondary">
                      <span className="flex items-center gap-1">
                        <Clock3 className="h-3 w-3" /> {req.departure}
                      </span>
                    </div>
                    {req.notes && (
                      <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber/20 bg-amber/5 px-3 py-2">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber/70" />
                        <p className="text-[10px] text-text-secondary/80 min-w-0">{req.notes}</p>
                      </div>
                    )}
                    <p className="mt-3 truncate font-mono text-[9px] uppercase tracking-[0.1em] text-text-secondary/40">
                      Creada: {req.createdAt}
                    </p>
                    {req.status === 'pending' && (
                      <div className="mt-3 flex items-center justify-center gap-1">
                        <MessageCircle className="h-3.5 w-3.5 text-accent/70" />
                        <span className="text-[10px] text-accent/80">Esperando conductor...</span>
                      </div>
                    )}
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <div className={cn('mt-10 flex items-center justify-center gap-2 pb-2 text-[9px] text-text-secondary/40')}>
        <ShieldCheck className="h-3 w-3" />
        Historial local cifrado en tu dispositivo
      </div>
    </div>
  );
}
