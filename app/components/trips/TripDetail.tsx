'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Clock3, MapPin, MessageCircle, ShieldCheck, Sparkles, Star, Users, Smartphone, Wallet } from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { TiltCard } from '../fx/TiltCard';
import { Reveal, Stagger, StaggerItem, Words } from '../fx/Reveal';
import { formatCOP, getInitials, cn } from '@/app/lib/design-system';
import { EASE } from '@/app/lib/motion';
import { useAppState } from '@/app/lib/AppState';
import { CURRENT_LOCATION } from '@/app/lib/catalog';
import { resolverPunto } from '@/app/lib/mapsCali';
import { calculateRoute, type CalculatedRoute } from '@/app/lib/routing';
import type { Trip } from '@/app/lib/types';
const InteractiveMap = dynamic(() => import('../InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#05080f]">
      <span className="h-1.5 w-1.5 animate-ping rounded-full bg-accent" />
    </div>
  ),
});

// RouteDirections lives beside the Leaflet map, so it must stay out of the
// server graph. Loading it lazily keeps /viaje/[id] renderable on the server.
const RouteDirections = dynamic(() => import('../InteractiveMap').then((mod) => mod.RouteDirections), {
  ssr: false,
  loading: () => <div className="glass h-28 animate-pulse rounded-[26px]" />,
});

export default function TripDetail({ trip }: { trip: Trip }) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const { reserveSeat, reservations, paymentMethods } = useAppState();
  const [open, setOpen] = useState(false);
  const [preference, setPreference] = useState('Conversación ligera');
  const [pickup, setPickup] = useState(CURRENT_LOCATION);
  const [paymentMethod, setPaymentMethod] = useState<'nequi' | 'daviplata' | 'efectivo'>('nequi');
  const [route, setRoute] = useState<CalculatedRoute | null>(null);

  const existing = reservations.find((item) => item.tripId === trip.id && item.status === 'confirmada');
  const available = trip.seats - trip.seatsTaken;
  const origin = resolverPunto(trip.origin);
  const dest = resolverPunto(trip.destination);

  const routeData = useMemo(
    () => ({
      origen: { name: origin.nombre, lat: origin.lat, lng: origin.lng, estimatedTime: trip.departure },
      destino: { name: dest.nombre, lat: dest.lat, lng: dest.lng, estimatedTime: trip.arrival },
      paradas: [],
    }),
    [origin, dest, trip.departure, trip.arrival],
  );

  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;
    calculateRoute(routeData.origen, routeData.destino).then((calculated) => {
      if (!cancelledRef.current && calculated) setRoute(calculated);
    });
    return () => {
      cancelledRef.current = true;
    };
  }, [routeData]);

  return (
    <div className="page-shell relative">
      {/* Holographic hero */}
      <motion.div
        initial={reduced ? false : { opacity: 0, scale: 0.985, filter: 'blur(14px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1, ease: EASE }}
        className="map-frame relative h-[46vh] min-h-[320px] overflow-hidden rounded-[30px] border border-white/[0.1] shadow-[0_50px_100px_-46px_rgba(0,0,0,1)]"
      >
        <InteractiveMap routeData={routeData} className="h-full rounded-[30px]" hud={false} />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[500] flex items-center justify-between p-4">
          <span className="glass flex items-center gap-2 rounded-full px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(92,233,220,0.8)]" />
            <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-text-secondary">
              {trip.dateLabel} · {trip.corridor}
            </span>
          </span>
          <span className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5">
            <ShieldCheck className="h-3 w-3 text-success" />
            <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-text-secondary">Verificado</span>
          </span>
        </div>
      </motion.div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_390px]">
        <div>
          <Reveal>
            <p className="hud text-[8px]">Cupo compartido</p>
            <h1 className="display mt-3 text-[2.2rem] leading-[1.02] text-text sm:text-[2.8rem]">
              <Words text={trip.origin} />
              <span className="serif text-primary-light"> → </span>
              <Words text={trip.destination} delay={0.1} />
            </h1>
          </Reveal>

          <Reveal delay={0.1} className="mt-6">
            <div className="glass flex items-center gap-4 rounded-[24px] p-4">
              <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[conic-gradient(from_140deg,#7c9cff,#5ce9dc,#a78bfa,#7c9cff)] p-[1.5px]">
                <span className="flex h-full w-full items-center justify-center rounded-full bg-[#0a0f1c] text-sm font-semibold text-text">
                  {getInitials(trip.driver.name)}
                </span>
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold text-text">{trip.driver.name}</p>
                <p className="mt-1 flex flex-wrap items-center gap-1.5 text-[10.5px] text-text-secondary">
                  <Star className="h-3 w-3 fill-amber text-amber" />
                  <span className="font-mono">{trip.driver.rating.toFixed(2)}</span>
                  <span className="opacity-40">/</span>
                  <span>{trip.driver.trips} viajes</span>
                  <span className="opacity-40">/</span>
                  <span>{trip.driver.university}</span>
                </p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-text-secondary/50">
                  {trip.driver.vehicle} · {trip.driver.plate}
                </p>
              </div>
              <button
                type="button"
                onClick={() => router.push('/mensajes')}
                aria-label="Escribir al conductor"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-text-secondary transition-colors hover:border-accent/30 hover:text-accent"
              >
                <MessageCircle className="h-4 w-4" />
              </button>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="mt-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="glass-soft rounded-2xl p-4">
                <p className="hud text-[7.5px]">Salida</p>
                <p className="mt-2 font-mono text-[24px] leading-none text-text">{trip.departure}</p>
                <p className="mt-2 flex items-center gap-1.5 text-[10px] text-text-secondary">
                  <MapPin className="h-3 w-3 text-primary" /> {trip.origin}
                </p>
              </div>
              <div className="glass-soft rounded-2xl p-4">
                <p className="hud text-[7.5px]">Llegada estimada</p>
                <p className="mt-2 font-mono text-[24px] leading-none text-accent">{trip.arrival}</p>
                <p className="mt-2 flex items-center gap-1.5 text-[10px] text-text-secondary">
                  <MapPin className="h-3 w-3 text-accent" /> {trip.destination}
                </p>
              </div>
            </div>
          </Reveal>

          {trip.notes && (
            <Reveal delay={0.18} className="mt-4">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 py-3">
                <p className="hud text-[7.5px]">Nota del conductor</p>
                <p className="mt-1.5 text-[12px] leading-relaxed text-text-secondary">{trip.notes}</p>
              </div>
            </Reveal>
          )}

          <Reveal delay={0.2} className="mt-4">
            <RouteDirections route={route} originName={origin.nombre} destName={dest.nombre} />
          </Reveal>
        </div>

        {/* Reserve panel */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <TiltCard intensity={4} lift={10}>
            <div className="glass-strong relative overflow-hidden rounded-[28px] p-6">
              <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-primary/25 blur-[70px]" />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"
              />
              <div className="relative flex items-center justify-between">
                <p className="hud text-[8px]">Tarifa justa</p>
                <span className="badge badge-accent">
                  <Sparkles className="h-3 w-3" /> sin subasta
                </span>
              </div>
              <p className="relative mt-3 font-mono text-[34px] leading-none text-text">
                {formatCOP(trip.price).replace(' COP', '')}
                <span className="ml-1.5 align-top font-sans text-[10px] font-medium tracking-[0.12em] text-text-secondary/60">
                  COP
                </span>
              </p>

              <div className="relative mt-4 flex items-center justify-between rounded-2xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5">
                <div className="flex items-center gap-1">
                  {Array.from({ length: trip.seats }).map((_, index) => (
                    <span
                      key={index}
                      className={cn(
                        'h-1.5 w-4 rounded-full',
                        index < trip.seatsTaken ? 'bg-white/15' : 'bg-accent/80 shadow-[0_0_8px_rgba(92,233,220,0.5)]',
                      )}
                    />
                  ))}
                </div>
                <span className="flex items-center gap-1.5 font-mono text-[9px] text-text-secondary">
                  <Users className="h-3 w-3" />
                  {available} / {trip.seats} libres
                </span>
              </div>

              {existing ? (
                <div className="relative mt-4">
                  <div className="rounded-2xl border border-success/25 bg-success/[0.07] p-4">
                    <p className="flex items-center gap-2 text-[12px] font-semibold text-success">
                      <ShieldCheck className="h-4 w-4" /> Cupo confirmado
                    </p>
                    <div className="mt-3 rounded-xl border border-dashed border-success/30 bg-black/20 px-3 py-2.5 text-center">
                      <p className="hud text-[7px] text-success/70">PIN de abordaje</p>
                      <p className="mt-1 font-mono text-[20px] tracking-[0.3em] text-text">{existing.pin}</p>
                    </div>
                    <p className="mt-3 text-[10px] leading-relaxed text-text-secondary">
                      Muéstralo al conductor al subir. No lo compartas fuera del viaje.
                    </p>
                  </div>
                  <Button className="mt-3" fullWidth variant="secondary" onClick={() => router.push('/mensajes')}>
                    <MessageCircle className="h-4 w-4" /> Escribir al conductor
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    className="relative mt-4"
                    fullWidth
                    size="lg"
                    disabled={available <= 0}
                    onClick={() => setOpen(true)}
                  >
                    <span className="flex w-full items-center justify-between">
                      <span>{available > 0 ? 'Reservar este cupo' : 'Sin cupos'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Button>
                  <div className="relative mt-4 space-y-2">
                    {[
                      'PIN único generado al confirmar',
                      'Cancela sin costo hasta 1 h antes',
                      'Pago con Nequi, DaviPlata o efectivo',
                    ].map((item) => (
                      <p key={item} className="flex items-center gap-2 text-[10px] text-text-secondary/70">
                        <span className="h-1 w-1 rounded-full bg-accent/70" /> {item}
                      </p>
                    ))}
                  </div>
                </>
              )}
            </div>
          </TiltCard>

          <div className="glass mt-3 flex items-center justify-between rounded-2xl px-4 py-3">
            <span className="flex items-center gap-2 text-[10px] text-text-secondary">
              <Clock3 className="h-3 w-3 text-primary" /> Confirmación instantánea
            </span>
            <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-text-secondary/40">RutaCero</span>
          </div>
        </div>
      </div>

      {/* Reservation modal */}
      <Modal open={open} title="Confirmar cupo" onClose={() => setOpen(false)}>
        <p className="text-[12px] leading-relaxed text-text-secondary">
          El cargo se hace al confirmar. Tu PIN de abordaje se revela de inmediato.
        </p>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="hud mb-2 block text-[8px]">Punto de recogida</span>
            <input
              value={pickup}
              onChange={(event) => setPickup(event.target.value)}
              className="input"
            />
          </label>

          <label className="block">
            <span className="hud mb-2 block text-[8px]">Preferencia de viaje</span>
            <select
              value={preference}
              onChange={(event) => setPreference(event.target.value)}
              className="input appearance-none"
            >
              <option>Conversación ligera</option>
              <option>Silencio</option>
              <option>Música baja</option>
              <option>Aire acondicionado</option>
            </select>
          </label>

          <label className="block">
            <span className="hud mb-2 block text-[8px]">Método de pago</span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'nequi', label: 'Nequi', icon: Smartphone, color: 'bg-primary/20 text-primary' },
                { id: 'daviplata', label: 'DaviPlata', icon: Smartphone, color: 'bg-amber/20 text-amber' },
                { id: 'efectivo', label: 'Efectivo', icon: Wallet, color: 'bg-success/20 text-success' },
              ].map((method) => {
                const Icon = method.icon;
                const selected = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id as 'nequi' | 'daviplata' | 'efectivo')}
                    className={cn(
                      'relative flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-[10px] font-medium transition-all duration-300',
                      selected
                        ? 'border-accent/50 bg-accent/10'
                        : 'border-white/10 hover:border-white/20',
                    )}
                  >
                    <Icon className={cn('h-5 w-5', method.color)} />
                    <span className={selected ? 'text-text' : 'text-text-secondary'}>{method.label}</span>
                    {selected && (
                      <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-accent flex items-center justify-center">
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </label>

          {/* Commission breakdown */}
          {paymentMethod !== 'efectivo' && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
              <p className="flex items-center gap-1.5 text-[10px] text-primary-light">
                <Sparkles className="h-3 w-3" />
                Comisión RutaCero: 12% ({formatCOP(Math.round(trip.price * 0.12))})
              </p>
              <p className="mt-1 text-[10px] text-text-secondary/70">
                El conductor recibe: <span className="font-mono text-text">{formatCOP(Math.round(trip.price * 0.88))}</span>
              </p>
              <p className="mt-1 text-[10px] text-text-secondary/70">
                Tú pagas: <span className="font-mono text-text">{formatCOP(trip.price)}</span>
              </p>
            </div>
          )}

          {paymentMethod === 'efectivo' && (
            <div className="rounded-xl border border-success/20 bg-success/5 p-3">
              <p className="flex items-center gap-1.5 text-[10px] text-success">
                <Wallet className="h-3 w-3" />
                Sin comisión · Pago directo al conductor
              </p>
              <p className="mt-1 text-[10px] text-text-secondary/70">
                Tú pagas: <span className="font-mono text-text">{formatCOP(trip.price)}</span> en efectivo al abordar
              </p>
              <p className="mt-1 text-[10px] text-text-secondary/70">
                El conductor recibe: <span className="font-mono text-text">{formatCOP(trip.price)}</span> (100%)
              </p>
            </div>
          )}

          <div className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
            <span className="hud text-[7.5px]">Total a pagar</span>
            <span className="font-mono text-[15px] text-text">{formatCOP(trip.price)}</span>
          </div>
        </div>

        <Button
          className="mt-5"
          variant="primary"
          fullWidth
          size="lg"
          onClick={() => {
            const reservation = reserveSeat(trip.id, pickup, preference, paymentMethod);
            setOpen(false);
            if (reservation) router.push('/historial');
          }}
        >
          {paymentMethod === 'efectivo' ? 'Confirmar y pagar en efectivo' : `Pagar ${formatCOP(trip.price)} y reservar`}
        </Button>
        <p className="mt-3 text-center font-mono text-[8px] uppercase tracking-[0.14em] text-text-secondary/50">
          Protegido por RutaCero · Cancela 1 h antes sin costo
        </p>
      </Modal>
    </div>
  );
}
