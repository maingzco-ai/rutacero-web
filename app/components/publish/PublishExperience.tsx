'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, CheckCircle2, Clock3, Gauge, KeyRound, ShieldCheck, Users } from 'lucide-react';
import SmartSearchInput from '../SmartSearchInput';
import { Button } from '../ui/Button';
import { PageHeader } from '../ui/PageHeader';
import { TiltCard } from '../fx/TiltCard';
import { Magnetic } from '../fx/Magnetic';
import { useAppState } from '@/app/lib/AppState';
import { calculateFairFare, formatCOP, validation } from '@/app/lib/design-system';
import { cn } from '@/app/lib/design-system';
import { EASE, springSnap } from '@/app/lib/motion';

const SEAT_OPTIONS = [1, 2, 3, 4];

function Field({
  label,
  hint,
  children,
  status,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  status?: 'valid' | 'invalid' | 'neutral';
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between">
        <span className="hud text-[8px]">{label}</span>
        {hint && (
          <span
            className={cn(
              'font-mono text-[8px] uppercase tracking-[0.12em]',
              status === 'valid' && 'text-success',
              status === 'invalid' && 'text-error',
              (!status || status === 'neutral') && 'text-text-secondary/50',
            )}
          >
            {hint}
          </span>
        )}
      </span>
      {children}
    </label>
  );
}

export default function PublishExperience() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const { publishRoute } = useAppState();

  // Get last searched origin from URL params or localStorage, fallback to empty for user to choose
  const [origin, setOrigin] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlOrigin = params.get('origen');
      if (urlOrigin) return decodeURIComponent(urlOrigin);
      const saved = localStorage.getItem('rutacero-last-origin');
      if (saved) return saved;
    }
    return '';
  });
  const [destination, setDestination] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlDest = params.get('destino');
      if (urlDest) return decodeURIComponent(urlDest);
      const saved = localStorage.getItem('rutacero-last-destination');
      if (saved) return saved;
    }
    return 'Universidad Icesi';
  });
  const [plate, setPlate] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [seats, setSeats] = useState(3);
  const [departure, setDeparture] = useState('07:00');
  const [done, setDone] = useState(false);

  // Persist last used origin/destination
  useEffect(() => {
    if (origin) localStorage.setItem('rutacero-last-origin', origin);
  }, [origin]);

  useEffect(() => {
    if (destination) localStorage.setItem('rutacero-last-destination', destination);
  }, [destination]);

  const plateOk = validation.licensePlate(plate);
  const vehicleOk = vehicle.trim().length >= 3;
  const price = calculateFairFare(seats);
  const canSubmit = plateOk && vehicleOk && Boolean(origin) && Boolean(destination);

  const checklist = useMemo(
    () => [
      { label: 'Ruta definida', ok: Boolean(origin && destination) },
      { label: 'Placa válida', ok: plateOk },
      { label: 'Vehículo descrito', ok: vehicleOk },
      { label: 'Cupos y hora', ok: Boolean(seats && departure) },
    ],
    [origin, destination, plateOk, vehicleOk, seats, departure],
  );

  useEffect(() => {
    if (!done) return;
    const timer = window.setTimeout(() => router.push('/historial'), 2400);
    return () => window.clearTimeout(timer);
  }, [done, router]);

  return (
    <div className="page-shell relative">
      <PageHeader
        eyebrow="Publicar · corredor sur"
        title="Abre tu ruta,"
        accent="comparte el viaje."
        description="Publica tu recorrido habitual y reparte el costo real entre quienes viajan contigo. El PIN de abordaje se genera al confirmar cada cupo."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        {/* ---- Composer --------------------------------------------------- */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 30, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1, ease: EASE, delay: 0.1 }}
          className="glass-strong relative overflow-hidden rounded-[30px] p-5 sm:p-7"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
          />

          <div className="flex items-center justify-between">
            <p className="hud text-[8.5px]">Compositor de ruta</p>
            <span className="flex items-center gap-1.5 font-mono text-[8px] text-text-secondary/60">
              <span className="h-1 w-1 rounded-full bg-success" /> BORRADOR
            </span>
          </div>

          <div className="mt-6 space-y-5">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-mono text-[8px] text-primary-light">
                  01
                </span>
                <p className="hud text-[8px]">Trayecto</p>
              </div>
              <SmartSearchInput label="Origen" value={origin} onValueChange={setOrigin} />
              <SmartSearchInput label="Destino" value={destination} onValueChange={setDestination} />
            </div>

            <div className="hairline" />

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-mono text-[8px] text-primary-light">
                  02
                </span>
                <p className="hud text-[8px]">Horario y cupos</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Hora de salida" hint={departure ? 'LISTO' : 'REQUERIDO'} status={departure ? 'valid' : 'invalid'}>
                  <div className="relative flex items-center">
                    <Clock3 className="pointer-events-none absolute left-3.5 h-3.5 w-3.5 text-primary/70" />
                    <input
                      type="time"
                      value={departure}
                      onChange={(event) => setDeparture(event.target.value)}
                      className="input pl-10 font-mono text-[13px] [color-scheme:dark]"
                    />
                  </div>
                </Field>

                <Field label="Cupos disponibles" hint={`${seats} ASIENTO${seats === 1 ? '' : 'S'}`} status="valid">
                  <div className="grid grid-cols-4 gap-1.5 rounded-2xl border border-white/10 bg-white/[0.035] p-1.5">
                    {SEAT_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setSeats(option)}
                        className={cn(
                          'relative rounded-xl py-2.5 font-mono text-[12px] transition-colors duration-300',
                          seats === option ? 'text-[#07101f]' : 'text-text-secondary hover:text-text',
                        )}
                      >
                        {seats === option && (
                          <motion.span
                            layoutId="seat-pill"
                            className="absolute inset-0 rounded-xl bg-[linear-gradient(140deg,#eef3ff,#b9c8ff)]"
                            transition={springSnap}
                          />
                        )}
                        <span className="relative z-10">{option}</span>
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            </div>

            <div className="hairline" />

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-mono text-[8px] text-primary-light">
                  03
                </span>
                <p className="hud text-[8px]">Vehículo</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label="Placa"
                  hint={plate ? (plateOk ? 'VÁLIDA' : 'FORMATO AAA-123') : 'OBLIGATORIA'}
                  status={plate ? (plateOk ? 'valid' : 'invalid') : 'neutral'}
                >
                  <div className="relative flex items-center">
                    <KeyRound className="pointer-events-none absolute left-3.5 h-3.5 w-3.5 text-primary/70" />
                    <input
                      value={plate}
                      onChange={(event) => setPlate(event.target.value.toUpperCase().slice(0, 7))}
                      placeholder="ABC-123"
                      className="input pl-10 font-mono tracking-[0.16em]"
                    />
                  </div>
                </Field>

                <Field label="Vehículo" hint={vehicleOk ? 'LISTO' : 'MARCA Y COLOR'} status={vehicleOk ? 'valid' : 'neutral'}>
                  <div className="relative flex items-center">
                    <Gauge className="pointer-events-none absolute left-3.5 h-3.5 w-3.5 text-primary/70" />
                    <input
                      value={vehicle}
                      onChange={(event) => setVehicle(event.target.value)}
                      placeholder="Mazda 2 blanco"
                      className="input pl-10"
                    />
                  </div>
                </Field>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
            <div>
              <p className="hud text-[7.5px]">Tarifa por pasajero</p>
              <p className="mt-1 font-mono text-[20px] leading-none text-primary-light">{formatCOP(price)}</p>
            </div>
            <p className="max-w-[190px] text-right text-[10px] leading-relaxed text-text-secondary/70">
              Se reparte el costo del trayecto. Sin comisión en esta versión.
            </p>
          </div>

          <Button
            variant="primary"
            fullWidth
            size="lg"
            disabled={!canSubmit}
            className="mt-4"
            onClick={() => {
              publishRoute({ origin, destination, plate: plate.toUpperCase(), vehicle, seats, price, departure });
              setDone(true);
            }}
          >
            <span className="flex w-full items-center justify-between">
              <span>Publicar ruta</span>
              <span className="flex items-center gap-2 font-mono text-[9px] opacity-60">
                {checklist.filter((item) => item.ok).length}/4
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </span>
          </Button>
        </motion.div>

        {/* ---- Live preview ------------------------------------------------ */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <TiltCard className="group" intensity={5} lift={10}>
            <div className="relative overflow-hidden rounded-[30px] border border-white/[0.1] bg-[linear-gradient(160deg,rgba(22,30,52,0.85),rgba(5,8,16,0.94))] p-5 shadow-[0_50px_100px_-40px_rgba(0,0,0,1)] backdrop-blur-2xl">
              <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-primary/25 blur-[80px]" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

              <div className="relative flex items-center justify-between">
                <p className="hud text-[8px]">Vista previa en vivo</p>
                <span className="flex items-center gap-1.5 rounded-full border border-success/25 bg-success/10 px-2 py-0.5 font-mono text-[7.5px] uppercase tracking-[0.12em] text-success">
                  <span className="h-1 w-1 rounded-full bg-success" /> listo
                </span>
              </div>

              <div className="relative mt-6">
                <p className="display text-[1.7rem] leading-tight text-text">{destination}</p>
                <p className="mt-1 text-[11.5px] text-text-secondary">desde {origin}</p>
              </div>

              <div className="relative mt-5 flex items-end justify-between">
                <div>
                  <p className="hud text-[7.5px]">Salida</p>
                  <p className="mt-1 font-mono text-[26px] leading-none text-text">{departure}</p>
                </div>
                <div className="text-right">
                  <p className="hud text-[7.5px]">Cupos</p>
                  <div className="mt-1.5 flex gap-1">
                    {Array.from({ length: seats }).map((_, index) => (
                      <span
                        key={index}
                        className="h-1.5 w-4 rounded-full bg-accent/80 shadow-[0_0_8px_rgba(92,233,220,0.5)]"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="hairline my-5" />

              <div className="space-y-2.5">
                {[
                  { label: 'Placa', value: plate || 'ABC-123' },
                  { label: 'Vehículo', value: vehicle || 'Mazda 2 blanco' },
                  { label: 'Tarifa', value: formatCOP(price) },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-3">
                    <span className="hud text-[7.5px]">{row.label}</span>
                    <span className="truncate font-mono text-[10.5px] text-text">{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-dashed border-primary/25 bg-primary/[0.05] px-3 py-2.5">
                <p className="flex items-center gap-1.5 text-[10px] text-primary-light">
                  <ShieldCheck className="h-3 w-3" />
                  PIN de abordaje generado al confirmar
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                {checklist.map((item) => (
                  <div
                    key={item.label}
                    className={cn(
                      'flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-[9px] transition-colors duration-500',
                      item.ok
                        ? 'border-success/25 bg-success/[0.07] text-success'
                        : 'border-white/[0.07] bg-white/[0.02] text-text-secondary/50',
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-3 w-3 items-center justify-center rounded-full border',
                        item.ok ? 'border-success/50 bg-success/20' : 'border-white/15',
                      )}
                    >
                      {item.ok && <Check className="h-2 w-2" />}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between text-[9px] text-text-secondary/60">
                <span className="flex items-center gap-1">
                  <Users className="h-2.5 w-2.5" /> {seats} pasajeros
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-2.5 w-2.5 text-accent/70" /> Verificado
                </span>
              </div>
            </div>
          </TiltCard>

          <div className="glass mt-4 rounded-2xl px-4 py-3">
            <p className="hud text-[7.5px]">Aviso de comunidad</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-text-secondary/80">
              Solo comparte rutas que ya vas a realizar. La tarifa justa no es una tarifa de taxi.
            </p>
          </div>
        </div>
      </div>

      {/* ---- Success overlay ---------------------------------------------- */}
      <AnimatePresence>
        {done && (
          <motion.div
            className="fixed inset-0 z-[410] flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-[#03050a]/80 backdrop-blur-xl" />
            <motion.div
              initial={reduced ? { opacity: 0 } : { scale: 0.86, opacity: 0, rotateX: 8 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 24 }}
              className="glass-strong relative w-full max-w-sm overflow-hidden rounded-[30px] p-7 text-center"
            >
              <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-accent/25 blur-[70px]" />
              <motion.span
                initial={{ scale: 0, rotate: -40 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.15 }}
                className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-accent/40 bg-accent/15 text-accent"
              >
                <CheckCircle2 className="h-8 w-8" />
              </motion.span>
              <h2 className="display relative mt-5 text-2xl text-text">Ruta publicada</h2>
              <p className="relative mt-2 text-[12.5px] leading-relaxed text-text-secondary">
                {origin} → {destination} · {departure}. Los pasajeros ya pueden reservar su cupo con PIN.
              </p>
              <div className="relative mt-6">
                <Button variant="primary" fullWidth onClick={() => router.push('/historial')}>
                  Ver mis rutas
                </Button>
              </div>
              <p className="relative mt-3 font-mono text-[8px] uppercase tracking-[0.16em] text-text-secondary/50">
                Redirigiendo automáticamente
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
