'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpDown, Compass, Route, SlidersHorizontal, Sparkles, Users, Car, AlertCircle } from 'lucide-react';
import SmartSearchInput from '../SmartSearchInput';
import { Button } from '../ui/Button';
import { TripCard } from '../trips/TripCard';
import { PageHeader } from '../ui/PageHeader';
import { TiltCard } from '../fx/TiltCard';
import { Stagger, StaggerItem } from '../fx/Reveal';
import { Magnetic } from '../fx/Magnetic';
import { matchTrips } from '@/app/lib/catalog';
import { resolverPunto } from '@/app/lib/mapsCali';
import { cn } from '@/app/lib/design-system';
import { useAppState } from '@/app/lib/AppState';
import { RouteRequestCard } from './RouteRequestCard';

type SortMode = 'salida' | 'precio';

function readUserRole(): 'conductor' | 'viajero' | 'ambos' | null {
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

export default function SearchExperience({
  initialOrigin,
  initialDestination,
}: {
  initialOrigin: string;
  initialDestination: string;
}) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const { routeRequests } = useAppState();
  const [origin, setOrigin] = useState(initialOrigin);
  const [destination, setDestination] = useState(initialDestination);
  const [sort, setSort] = useState<SortMode>('salida');
  const [userRole, setUserRole] = useState<'conductor' | 'viajero' | 'ambos' | null>(null);

  useEffect(() => {
    setUserRole(readUserRole());
    window.addEventListener('storage', () => setUserRole(readUserRole()));
    return () => window.removeEventListener('storage', () => setUserRole(readUserRole()));
  }, []);

  const isDriver = userRole === 'conductor' || userRole === 'ambos';

  const results = useMemo(() => {
    const resolvedOrigin = resolverPunto(origin).nombre;
    const resolvedDest = resolverPunto(destination).nombre;
    const matched = matchTrips(resolvedOrigin, resolvedDest);
    const base = matched.length
      ? matched
      : Array.from(
          new Map(
            [...matchTrips('', resolvedDest), ...matchTrips(resolvedOrigin, '')].map((trip) => [trip.id, trip]),
          ).values(),
        ).slice(0, 4);

    return [...base].sort((a, b) => (sort === 'precio' ? a.price - b.price : 0));
  }, [origin, destination, sort]);

  // Filtrar solicitudes de ruta que coincidan con la búsqueda (solo para conductores)
  const matchingRequests = useMemo(() => {
    if (!isDriver) return [];
    const resolvedOrigin = resolverPunto(origin).nombre;
    const resolvedDest = resolverPunto(destination).nombre;
    const o = resolvedOrigin.toLowerCase();
    const d = resolvedDest.toLowerCase();

    return routeRequests
      .filter((req) => req.status === 'pending')
      .filter((req) => {
        const reqOrigin = req.origin.toLowerCase();
        const reqDest = req.destination.toLowerCase();
        const originHit = reqOrigin.includes(o) || o.includes(reqOrigin.slice(0, 8));
        const destHit = reqDest.includes(d) || d.includes(reqDest.slice(0, 8));
        return originHit && destHit;
      })
      .slice(0, 4);
  }, [origin, destination, routeRequests, isDriver]);

  const best = results[0];

  return (
    <div className="page-shell relative">
      <PageHeader
        eyebrow="Motor de rutas · Cali Sur"
        title="Encuentra tu"
        accent="próximo cupo."
        description="Rutas verificadas entre universidades, barrios y centros comerciales. Ajusta origen y destino: el motor recalcula el corredor en tiempo real."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge badge-accent">
              <span className="h-1 w-1 animate-pulse rounded-full bg-accent" />
              {results.length} cupo{results.length === 1 ? '' : 's'} disponible{results.length === 1 ? '' : 's'}
            </span>
            <span className="badge badge-secondary">
              <Sparkles className="h-3 w-3" /> Precio fijo justo
            </span>
          </div>
        }
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-[380px_1fr] xl:gap-10">
        {/* ---- Search console ---------------------------------------------- */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="glass-strong relative overflow-hidden rounded-[28px] p-5 sm:p-6">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
            />
            <div className="flex items-center justify-between">
              <p className="hud text-[8px]">Parámetros de búsqueda</p>
              <Compass className="h-3.5 w-3.5 text-accent/70" />
            </div>

            <form
              className="mt-5 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                router.replace(`/buscar?origen=${encodeURIComponent(origin)}&destino=${encodeURIComponent(destination)}`);
              }}
            >
              <SmartSearchInput label="Origen" value={origin} onValueChange={setOrigin} placeholder="¿Desde dónde sales?" />
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-white/10" />
                <Magnetic strength={0.3}>
                  <button
                    type="button"
                    aria-label="Intercambiar origen y destino"
                    onClick={() => {
                      setOrigin(destination);
                      setDestination(origin);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/12 bg-white/[0.06] text-text-secondary transition-all duration-500 hover:rotate-180 hover:border-accent/40 hover:text-accent"
                  >
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </button>
                </Magnetic>
                <span className="h-px flex-1 bg-white/10" />
              </div>
              <SmartSearchInput label="Destino" value={destination} onValueChange={setDestination} placeholder="¿A dónde vas?" />
              <Button type="submit" variant="primary" fullWidth size="lg">
                Recalcular ruta
              </Button>
            </form>

            <div className="hairline my-5" />

            <div className="flex items-center justify-between">
              <p className="hud text-[8px]">Vector activo</p>
              <span className="font-mono text-[8px] text-text-secondary/50">{best?.corridor ?? 'Sur · Cañasgordas'}</span>
            </div>

            <div className="relative mt-3 flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-black/20 p-3">
              <svg viewBox="0 0 44 44" className="h-11 w-11 shrink-0" fill="none" aria-hidden="true">
                <circle cx="22" cy="22" r="20" stroke="rgba(255,255,255,0.08)" />
                <circle
                  cx="22"
                  cy="22"
                  r="14"
                  stroke="url(#searchArc)"
                  strokeWidth="1.4"
                  strokeDasharray="26 62"
                  strokeLinecap="round"
                  className={reduced ? '' : 'animate-spin-slow'}
                  style={{ transformOrigin: '22px 22px' }}
                />
                <circle
                  cx="22"
                  cy="22"
                  r="7"
                  stroke="rgba(124,156,255,0.35)"
                  strokeDasharray="3 5"
                  style={{ transformOrigin: '22px 22px' }}
                />
                <circle cx="22" cy="8" r="1.8" fill="#5ce9dc" />
                <defs>
                  <linearGradient id="searchArc" x1="0" y1="0" x2="44" y2="44">
                    <stop stopColor="#7c9cff" />
                    <stop offset="1" stopColor="#5ce9dc" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="min-w-0">
                <p className="truncate text-[11.5px] font-medium text-text">{resolverPunto(origin).nombre}</p>
                <p className="mt-0.5 truncate text-[10px] text-text-secondary/70">→ {resolverPunto(destination).nombre}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {[
                { label: 'Cupos libres', value: `${results.reduce((sum, trip) => sum + Math.max(0, trip.seats - trip.seatsTaken), 0)}` },
                { label: 'Tarifa desde', value: `$${Math.min(...results.map((trip) => trip.price), 4500).toLocaleString('es-CO')}` },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2">
                  <p className="hud text-[7.5px]">{item.label}</p>
                  <p className="mt-1 font-mono text-[13px] text-text">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ---- Results ------------------------------------------------------ */}
        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="hud text-[8.5px]">
              {results.length} resultado{results.length === 1 ? '' : 's'} · orden
            </p>
            <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1">
              <SlidersHorizontal className="ml-1.5 h-3 w-3 text-text-secondary/50" />
              {([
                ['salida', 'Salida'],
                ['precio', 'Precio'],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSort(value)}
                  className={cn(
                    'relative rounded-full px-3 py-1.5 text-[10px] font-medium transition-colors duration-300',
                    sort === value ? 'text-text' : 'text-text-secondary/70 hover:text-text',
                  )}
                >
                  {sort === value && (
                    <motion.span
                      layoutId="sort-pill"
                      className="absolute inset-0 rounded-full bg-white/[0.08]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {results.length > 0 || (isDriver && matchingRequests.length > 0) ? (
              <>
                {results.length > 0 && (
                  <Stagger key="trips" className="grid gap-4 sm:grid-cols-2" stagger={0.09}>
                    {results.map((trip) => (
                      <StaggerItem key={trip.id} className="h-full">
                        <TripCard trip={trip} />
                      </StaggerItem>
                    ))}
                  </Stagger>
                )}
                {isDriver && matchingRequests.length > 0 && (
                  <div key="requests">
                    <p className="hud text-[8px] mb-3 flex items-center gap-2 text-accent/80">
                      <Users className="h-3 w-3" />
                      Solicitudes de cupo ({matchingRequests.length})
                    </p>
                    <Stagger className="grid gap-4 sm:grid-cols-2" stagger={0.09}>
                      {matchingRequests.map((req) => (
                        <StaggerItem key={req.id} className="h-full">
                          <RouteRequestCard request={req} />
                        </StaggerItem>
                      ))}
                    </Stagger>
                  </div>
                )}
                {results.length === 0 && (!isDriver || matchingRequests.length === 0) && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="glass-strong flex flex-col items-center rounded-[28px] px-6 py-16 text-center"
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-primary-light">
                      <Route className="h-6 w-6" />
                    </span>
                    <p className="display mt-5 text-2xl">Sin rutas en ese vector</p>
                    <p className="mt-2 max-w-xs text-sm text-text-secondary">
                      No hay cupos para esa combinación ahora mismo. Prueba un destino cercano o publica el tramo.
                    </p>
                    <div className="mt-6 flex gap-2">
                      <Button variant="secondary" size="sm" onClick={() => setDestination('Universidad Icesi')}>
                        Universidad Icesi
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => router.push('/publicar')}>
                        Publicar ruta
                      </Button>
                    </div>
                  </motion.div>
                )}
              </>
            ) : null}
          </AnimatePresence>

          {best && (
            <TiltCard className="mt-6 hidden lg:block" intensity={3}>
              <div className="relative overflow-hidden rounded-[26px] border border-white/[0.08] bg-[linear-gradient(135deg,rgba(124,156,255,0.12),rgba(92,233,220,0.05)_55%,rgba(6,9,17,0.7))] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="hud text-[8px] text-accent/80">Sugerencia del motor</p>
                    <p className="mt-1.5 text-[15px] font-medium text-text">
                      La salida de {best.departure} es la más eficiente para tu vector.
                    </p>
                    <p className="mt-1 text-[11.5px] text-text-secondary">
                      {best.origin} → {best.destination} · {best.driver.name}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="shrink-0"
                    onClick={() => router.push(`/viaje/${best.id}`)}
                  >
                    Ver cupo
                  </Button>
                </div>
              </div>
            </TiltCard>
          )}
        </div>
      </div>
    </div>
  );
}
