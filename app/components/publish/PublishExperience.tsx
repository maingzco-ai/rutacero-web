'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, CheckCircle2, Clock3, Gauge, KeyRound, ShieldCheck, Users, Car, User, Route, AlertCircle } from 'lucide-react';
import SmartSearchInput from '../SmartSearchInput';
import { Button } from '../ui/Button';
import { PageHeader } from '../ui/PageHeader';
import { TiltCard } from '../fx/TiltCard';
import { useAppState } from '@/app/lib/AppState';
import { calculateFairFare, formatCOP, validation } from '@/app/lib/design-system';
import { cn } from '@/app/lib/design-system';
import { EASE, springSnap } from '@/app/lib/motion';

const SEAT_OPTIONS = [1, 2, 3, 4];

type PublishMode = 'pedir-cupo' | 'ofrecer-viaje';

function readOnboardingRole(): 'conductor' | 'viajero' | 'ambos' | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('rutacero-onboarding');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.role && ['conductor', 'viajero', 'ambos'].includes(parsed.role)) {
        return parsed.role;
      }
    }
  } catch {
    /* ignore */
  }
  return null;
}

function getDefaultMode(): PublishMode {
  const role = readOnboardingRole();
  if (role === 'conductor') return 'ofrecer-viaje';
  return 'pedir-cupo'; // viajero o ambos por defecto piden cupo
}

function getHoursUntilDeparture(departure: string): number {
  const now = new Date();
  const [hours, minutes] = departure.split(':').map(Number);
  const departureDate = new Date();
  departureDate.setHours(hours, minutes, 0, 0);
  if (departureDate <= now) {
    departureDate.setDate(departureDate.getDate() + 1);
  }
  return (departureDate.getTime() - now.getTime()) / (1000 * 60 * 60);
}

function ModeBadge({ mode, onChange }: { mode: PublishMode; onChange: (m: PublishMode) => void }) {
  const isRequest = mode === 'pedir-cupo';
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
      <button
        type="button"
        onClick={() => onChange('pedir-cupo')}
        className={cn(
          'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-medium transition-colors duration-300',
          isRequest ? 'bg-white/[0.08] text-text' : 'text-text-secondary/60 hover:text-text hover:bg-white/[0.05]',
        )}
      >
        <User className="h-3 w-3" /> Pedir cupo
      </button>
      <button
        type="button"
        onClick={() => onChange('ofrecer-viaje')}
        className={cn(
          'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-medium transition-colors duration-300',
          !isRequest ? 'bg-white/[0.08] text-text' : 'text-text-secondary/60 hover:text-text hover:bg-white/[0.05]',
        )}
      >
        <Car className="h-3 w-3" /> Ofrecer viaje
      </button>
    </div>
  );
}

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
  const { publishRoute, publishRouteRequest } = useAppState();

  const [mode, setMode] = useState<PublishMode>(() => getDefaultMode());
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
  const [departure, setDeparture] = useState('07:00');
  const [plate, setPlate] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [seats, setSeats] = useState(3);
  const [notes, setNotes] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Persist last used origin/destination
  useEffect(() => {
    if (origin) localStorage.setItem('rutacero-last-origin', origin);
  }, [origin]);

  useEffect(() => {
    if (destination) localStorage.setItem('rutacero-last-destination', destination);
  }, [destination]);

  useEffect(() => {
    if (!done) return;
    const timer = window.setTimeout(() => router.push('/historial'), 2400);
    return () => window.clearTimeout(timer);
  }, [done, router]);

  // Validation
  const plateOk = validation.licensePlate(plate);
  const vehicleOk = vehicle.trim().length >= 3;
  const price = calculateFairFare(seats);
  const canSubmitOffer = plateOk && vehicleOk && Boolean(origin) && Boolean(destination);

  const hoursUntil = getHoursUntilDeparture(departure);
  const departureOk = hoursUntil >= 4;
  const canSubmitRequest = Boolean(origin) && Boolean(destination) && departureOk;

  const isRequestMode = mode === 'pedir-cupo';

  const handleSubmit = async () => {
    setError(null);
    try {
      if (isRequestMode) {
        if (!canSubmitRequest) throw new Error('Completa origen, destino y hora (mín 4h de antelación)');
        await publishRouteRequest({ origin, destination, departure, notes: notes || undefined });
      } else {
        if (!canSubmitOffer) throw new Error('Completa todos los campos: ruta, placa, vehículo, cupos y hora');
        await publishRoute({ origin, destination, plate: plate.toUpperCase(), vehicle, seats, price, departure });
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al publicar');
    }
  };

  return (
    <div className="page-shell relative">
      <PageHeader
        eyebrow="Publicar · corredor sur"
        title={isRequestMode ? 'Pide tu cupo,' : 'Abre tu ruta,'}
        accent={isRequestMode ? 'encuentra conductor.' : 'comparte el viaje.'}
        description={
          isRequestMode
            ? 'Publica tu necesidad de viaje. Conductores verán tu solicitud y podrán ofrecerte cupo. Requiere 4h de antelación.'
            : 'Publica tu recorrido habitual y reparte el costo real entre quienes viajan contigo. El PIN de abordaje se genera al confirmar cada cupo.'
        }
      />

      {/* Mode switcher - simple, always visible */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
        className="mt-6 glass-strong relative overflow-hidden rounded-[24px] p-4"
      >
        <div className="flex items-center justify-between">
          <p className="hud text-[8px]">¿Qué necesitas?</p>
        </div>
        <ModeBadge mode={mode} onChange={setMode} />
        <p className="mt-3 text-center text-[10px] leading-relaxed text-text-secondary/70 max-w-2xl mx-auto">
          {isRequestMode
            ? 'Los conductores verán tu solicitud en su búsqueda. Si alguien acepta, te contacta por chat y acuerdan el pago (Nequi/DaviPlata/efectivo).'
            : 'Publicas tu ruta con cupos. Pasajeros reservan y pagan por la app (te llega el 88%, RutaCero se queda 12% de comisión).'}
        </p>
      </motion.div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
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
            {/* Paso 1: Trayecto - SIEMPRE */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-mono text-[8px] text-primary-light">
                  01
                </span>
                <p className="hud text-[8px]">Trayecto</p>
              </div>
              <SmartSearchInput label="Origen" value={origin} onValueChange={setOrigin} placeholder="Ej: Ciudad Jardín" />
              <SmartSearchInput label="Destino" value={destination} onValueChange={setDestination} placeholder="Ej: Universidad Icesi" />
            </div>

            <div className="hairline" />

            {/* Paso 2: Hora - SIEMPRE */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-mono text-[8px] text-primary-light">
                  02
                </span>
                <p className="hud text-[8px]">Hora de salida</p>
              </div>

              <Field
                label="Hora"
                hint={
                  isRequestMode
                    ? departureOk
                      ? `OK · ${hoursUntil.toFixed(1)}h de antelación ✓`
                      : `MÍN 4H · Faltan ${(4 - hoursUntil).toFixed(1)}h`
                    : departure
                    ? 'OK ✓'
                    : 'REQUERIDO'
                }
                status={
                  isRequestMode
                    ? departureOk
                      ? 'valid'
                      : 'invalid'
                    : departure
                    ? 'valid'
                    : 'invalid'
                }
              >
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

              {isRequestMode && !departureOk && departure && (
                <div className="flex items-center gap-2 rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-[10px] text-error">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>Necesitas al menos 4h de antelación. Ahora son las {new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}.</span>
                </div>
              )}
            </div>

            {/* Paso 3: Solo si OFRECER VIAJE */}
            {!isRequestMode && (
              <>
                <div className="hairline" />

                {/* Cupos */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-mono text-[8px] text-primary-light">
                      03
                    </span>
                    <p className="hud text-[8px]">Cupos disponibles</p>
                  </div>

                  <Field label="Cupos" hint={`${seats} ASIENTO${seats === 1 ? '' : 'S'}`} status="valid">
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

                <div className="hairline" />

                {/* Vehículo */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-mono text-[8px] text-primary-light">
                      04
                    </span>
                    <p className="hud text-[8px]">Tu vehículo</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field
                      label="Placa"
                      hint={plate ? (plateOk ? 'VÁLIDA ✓' : 'FORMATO AAA-123') : 'OBLIGATORIA'}
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

                    <Field label="Vehículo" hint={vehicleOk ? 'OK ✓' : 'MARCA Y COLOR'} status={vehicleOk ? 'valid' : 'neutral'}>
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
              </>
            )}

            {/* Notas - solo PEDIR CUPO */}
            {isRequestMode && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-mono text-[8px] text-primary-light">
                    03
                  </span>
                  <p className="hud text-[8px]">Detalles para conductores (opcional)</p>
                </div>
                <Field label="Notas" hint="Punto de encuentro, flexibilidad, etc.">
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Ej: Salgo frente al Carulla de Ciudad Jardín. Puedo caminar 2 cuadras."
                    rows={2}
                    className="input min-h-[72px] resize-none"
                  />
                </Field>
              </div>
            )}
          </div>

          {/* Resumen / Tarifa */}
          <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
            {isRequestMode ? (
              <>
                <div>
                  <p className="hud text-[7.5px]">Tipo</p>
                  <p className="mt-1 font-mono text-[15px] leading-none text-accent">Solicitud de cupo</p>
                </div>
                <p className="max-w-[190px] text-right text-[10px] leading-relaxed text-text-secondary/70">
                  Los conductores verán tu solicitud. Gratis para ti.
                </p>
              </>
            ) : (
              <>
                <div>
                  <p className="hud text-[7.5px]">Tarifa por pasajero</p>
                  <p className="mt-1 font-mono text-[20px] leading-none text-primary-light">{formatCOP(price)}</p>
                </div>
                <p className="max-w-[190px] text-right text-[10px] leading-relaxed text-text-secondary/70">
                  Tú recibes el 88% · RutaCero 12% comisión
                </p>
              </>
            )}
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-[10px] text-error">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button
            variant="primary"
            fullWidth
            size="lg"
            disabled={isRequestMode ? !canSubmitRequest : !canSubmitOffer}
            className="mt-4"
            onClick={handleSubmit}
          >
            <span className="flex w-full items-center justify-between">
              <span>{isRequestMode ? 'Publicar solicitud de cupo' : 'Publicar mi ruta'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
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
                <p className="hud text-[8px]">Vista previa</p>
                <span className="flex items-center gap-1.5 rounded-full border border-success/25 bg-success/10 px-2 py-0.5 font-mono text-[7.5px] uppercase tracking-[0.12em] text-success">
                  <span className="h-1 w-1 rounded-full bg-success" /> listo
                </span>
              </div>

              <div className="relative mt-6">
                <p className="display text-[1.7rem] leading-tight text-text">{destination}</p>
                <p className="mt-1 text-[11.5px] text-text-secondary">desde {origin || '—'}</p>
              </div>

              <div className="relative mt-5 flex items-end justify-between">
                <div>
                  <p className="hud text-[7.5px]">Salida</p>
                  <p className="mt-1 font-mono text-[26px] leading-none text-text">{departure}</p>
                </div>
                {!isRequestMode && (
                  <div className="text-right">
                    <p className="hud text-[7.5px]">Cupos</p>
                    <div className="mt-1.5 flex gap-1">
                      {Array.from({ length: seats }).map((_, index) => (
                        <span key={index} className="h-1.5 w-4 rounded-full bg-accent/80 shadow-[0_0_8px_rgba(92,233,220,0.5)]" />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="hairline my-5" />

              {!isRequestMode && (
                <div className="space-y-2.5 mb-5">
                  {[
                    { label: 'Placa', value: plate || 'ABC-123' },
                    { label: 'Vehículo', value: vehicle || 'Mazda 2 blanco' },
                    { label: 'Tarifa', value: formatCOP(price) },
                    { label: 'Tú recibes', value: formatCOP(Math.round(price * 0.88)).replace(' COP', '') },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between gap-3">
                      <span className="hud text-[7.5px]">{row.label}</span>
                      <span className="truncate font-mono text-[10.5px] text-text">{row.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {isRequestMode && notes && (
                <div className="space-y-2.5 mb-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="hud text-[7.5px]">Notas</span>
                    <span className="truncate font-mono text-[10.5px] text-text-secondary">{notes}</span>
                  </div>
                </div>
              )}

              <div className="mt-5 rounded-2xl border border-dashed border-primary/25 bg-primary/[0.05] px-3 py-2.5">
                <p className="flex items-center gap-1.5 text-[10px] text-primary-light">
                  <ShieldCheck className="h-3 w-3" />
                  {isRequestMode
                    ? 'Conductores verán tu solicitud en su búsqueda'
                    : 'Pasajeros reservan y pagan por la app · PIN al confirmar'}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between text-[9px] text-text-secondary/60">
                <span className="flex items-center gap-1">
                  <Route className="h-2.5 w-2.5" />
                  {isRequestMode ? 'Solicitud de cupo' : 'Ruta como conductor'}
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-2.5 w-2.5 text-accent/70" /> Verificado
                </span>
              </div>
            </div>
          </TiltCard>

          <div className="glass mt-4 rounded-2xl px-4 py-3">
            <p className="hud text-[7.5px]">Aviso</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-text-secondary/80">
              {isRequestMode
                ? 'Solo publica si realmente vas a viajar. Requiere 4h de antelación para que conductores puedan planear.'
                : 'Solo comparte rutas que ya vas a hacer. La tarifa justa reparte costos, no es taxi. Comisión 12% solo en pagos digitales.'}
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
              <h2 className="display relative mt-5 text-2xl text-text">
                {isRequestMode ? 'Solicitud publicada' : 'Ruta publicada'}
              </h2>
              <p className="relative mt-2 text-[12.5px] leading-relaxed text-text-secondary">
                {origin} → {destination} · {departure}.
                {isRequestMode
                  ? 'Los conductores ya pueden ver tu solicitud y contactarte por chat.'
                  : 'Pasajeros ya pueden reservar. Recibirás el 88% por Nequi/DaviPlata.'}
              </p>
              <div className="relative mt-6">
                <Button variant="primary" fullWidth onClick={() => router.push('/historial')}>
                  Ver mi historial
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