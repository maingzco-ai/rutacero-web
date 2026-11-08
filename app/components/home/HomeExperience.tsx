'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { animate } from 'motion';
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  Compass,
  LocateFixed,
  MapPin,
  Navigation,
  Route as RouteIcon,
  Sparkles,
  Wifi,
} from 'lucide-react';
import SmartSearchInput from '../SmartSearchInput';
import { Button } from '../ui/Button';
import { TripCard } from '../trips/TripCard';
import { SpatialOrb } from '../fx/SpatialOrb';
import { Magnetic } from '../fx/Magnetic';
import { Words } from '../fx/Reveal';
import { CURRENT_LOCATION, FREQUENT_DESTINATIONS, recentSearches, trips } from '@/app/lib/catalog';
import { resolverPunto } from '@/app/lib/mapsCali';
import { cn } from '@/app/lib/design-system';
import { EASE } from '@/app/lib/motion';
import { useDepth } from '@/app/hooks/useDepth';
import type { Location } from '../InteractiveMap';
import { OnboardingFlow } from '../onboarding/OnboardingFlow';

const InteractiveMap = dynamic(() => import('../InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#05080f]">
      <div className="flex items-center gap-3">
        <span className="h-1.5 w-1.5 animate-ping rounded-full bg-accent" />
        <span className="hud">Calibrando el corredor sur</span>
      </div>
    </div>
  ),
});

function toLocation(name: string, time?: string): Location {
  const point = resolverPunto(name);
  return { name: point.nombre, lat: point.lat, lng: point.lng, estimatedTime: time };
}

function shorten(place: string) {
  return place
    .replace('Pontificia Universidad Javeriana Cali', 'Javeriana Cali')
    .replace('Universidad Autónoma de Occidente (UAO)', 'UAO')
    .replace('Universidad del Valle (Meléndez)', 'Univalle')
    .replace('Universidad Icesi', 'Icesi')
    .replace('Holguines Trade Center', 'Holguines');
}

function Counter({ to, suffix = '', decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const controls = animate(0, to, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (value) => {
        node.textContent = `${value.toFixed(decimals)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [to, suffix, decimals]);

  return <span ref={ref} className="tabular">{`0${suffix}`}</span>;
}

function LiveClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () =>
      setTime(new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false }));
    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return <span className="tabular text-[10px] text-text-secondary/70">{time ?? '--:--'}</span>;
}

export default function HomeExperience() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const { sx, sy } = useDepth();
  const [origin, setOrigin] = useState(CURRENT_LOCATION);
  const [destination, setDestination] = useState('');
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  const featured = trips.filter((trip) => trip.status === 'disponible').slice(0, 3);
  const mapX = useTransform(sx, [-0.5, 0.5], [14, -14]);
  const mapY = useTransform(sy, [-0.5, 0.5], [10, -10]);

  const routeData = useMemo(() => {
    const dest = destination || featured[0]?.destination || 'Universidad Icesi';
    return {
      origen: toLocation(origin, 'Ahora'),
      destino: toLocation(dest),
      paradas: [],
    };
  }, [origin, destination, featured]);

  const goSearch = (from = origin, to = destination) => {
    const destino = to || 'Universidad Icesi';
    router.push(`/buscar?origen=${encodeURIComponent(from)}&destino=${encodeURIComponent(destino)}`);
  };

  const quickDestinations = FREQUENT_DESTINATIONS.slice(0, 5);

  if (!onboardingComplete) {
    return (
      <div className="relative min-h-[100dvh]">
        <OnboardingFlow onFinish={() => setOnboardingComplete(true)} />
      </div>
    );
  }

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden">
      {/* ---- Map depth layer ------------------------------------------------ */}
      <motion.div className="absolute inset-[-3%]" style={{ x: mapX, y: mapY }}>
        <InteractiveMap routeData={routeData} className="h-full rounded-none" hud={false} />
      </motion.div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_95%_at_50%_0%,rgba(4,6,12,0.10)_20%,rgba(4,6,12,0.72)_78%,rgba(4,6,12,0.96)_100%)]"
      />
      <div aria-hidden="true" className="grid-veil pointer-events-none absolute inset-0 opacity-[0.22]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: 'linear-gradient(90deg, rgba(4,6,12,0.92), rgba(4,6,12,0.35) 42%, transparent 68%)' }}
      />

      {/* ---- Spatial orb ---------------------------------------------------- */}
      <div className="pointer-events-none absolute right-[0%] top-[8%] hidden opacity-95 lg:block xl:right-[2%]">
        <div className="relative">
          <SpatialOrb size={600} />
          <div className="glass absolute -left-16 top-[22%] w-max animate-float whitespace-nowrap rounded-2xl px-3 py-2">
            <p className="hud text-[8px]">Salida</p>
            <p className="mt-0.5 font-mono text-[12px] text-text">06:45 AM</p>
          </div>
          <div className="glass absolute -right-2 top-[58%] w-max animate-float whitespace-nowrap rounded-2xl px-3 py-2 [animation-delay:-3s]">
            <p className="hud text-[8px]">Cupos</p>
            <p className="mt-0.5 font-mono text-[12px] text-accent">03 / 04</p>
          </div>
          <div className="glass absolute bottom-[12%] left-[6%] w-max animate-float whitespace-nowrap rounded-2xl px-3 py-2 [animation-delay:-5s]">
            <p className="hud text-[8px]">PIN abordaje</p>
            <p className="mt-0.5 font-mono text-[12px] tracking-[0.2em] text-text">RC-2481</p>
          </div>
        </div>
      </div>

      {/* ---- Console -------------------------------------------------------- */}
      <div className="absolute inset-x-0 bottom-[calc(82px+env(safe-area-inset-bottom))] z-20 px-3 sm:px-5 lg:inset-y-0 lg:bottom-0 lg:right-auto lg:flex lg:max-w-[540px] lg:flex-col lg:justify-center lg:px-0 lg:pb-6 lg:pl-8 lg:pr-2 lg:pt-[88px] xl:pl-12">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 40, filter: 'blur(16px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
          className="glass-strong relative max-h-[64dvh] w-full overflow-y-auto rounded-[28px] p-4 no-scrollbar sm:p-6 lg:max-h-[calc(100dvh-9rem)] lg:rounded-[32px] lg:p-7"
          data-lenis-prevent
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"
          />

          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-accent/70" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              <span className="hud text-[8.5px] text-accent/90">Corredor sur · en vivo</span>
            </span>
            <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-2 py-1">
              <Wifi className="h-2.5 w-2.5 text-accent" />
              <LiveClock />
            </span>
          </div>

          <h1 className="display mt-4 text-[2.15rem] text-text sm:text-[2.7rem] lg:text-[3.1rem]">
            <Words text="Tu ruta, ya está" accent="en marcha." />
          </h1>

          <p className="mt-2.5 max-w-sm text-[12.5px] leading-relaxed text-text-secondary sm:text-[13px]">
            Cupos verificados entre estudiantes del sur de Cali. Tarifa justa, PIN de abordaje y cero
            vueltas.
          </p>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              goSearch();
            }}
            className="mt-5 space-y-3"
          >
            <div className="rounded-[20px] border border-white/10 bg-white/[0.035] p-2">
              <div className="flex items-center gap-2.5 px-2 py-1.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-primary">
                  <LocateFixed className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="hud text-[8px]">Origen · ubicación actual</p>
                  <p className="mt-0.5 truncate text-[13px] font-medium text-text">{origin}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOrigin(CURRENT_LOCATION)}
                  className="hud shrink-0 rounded-full border border-white/10 bg-white/[0.05] px-2 py-1 text-[7.5px] text-text-secondary transition-colors hover:text-accent"
                >
                  Reset
                </button>
              </div>
              <div className="hairline my-1.5" />
              <div className="px-1">
                <SmartSearchInput
                  value={destination}
                  onValueChange={setDestination}
                  placeholder="¿A dónde vas hoy?"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              className="justify-between px-5"
            >
              <span className="flex items-center gap-2">
                <Navigation className="h-4 w-4" />
                Buscar cupos
              </span>
              <span className="flex items-center gap-2">
                <span className="font-mono text-[9px] font-medium opacity-60">{featured.length} rutas</span>
                <ArrowRight className="h-4 w-4" />
              </span>
            </Button>
          </form>

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <p className="hud text-[8px]">Accesos rápidos</p>
              <Compass className="h-3 w-3 text-text-secondary/50" />
            </div>
            <div className="mask-fade-x mt-2 flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {quickDestinations.map((place) => (
                <Magnetic key={place} strength={0.2} scale={1.02}>
                  <button
                    type="button"
                    onClick={() => goSearch(origin, place)}
                    className="group flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 text-[10.5px] font-medium text-text-secondary transition-all duration-300 hover:border-accent/30 hover:bg-accent/[0.08] hover:text-text"
                  >
                    <MapPin className="h-2.5 w-2.5 text-accent/80" />
                    {shorten(place)}
                  </button>
                </Magnetic>
              ))}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl border border-white/[0.07] bg-black/20 p-3">
            {[
              { value: 12, suffix: '', label: 'rutas activas' },
              { value: 4, suffix: ' min', label: 'espera media' },
              { value: 98, suffix: '%', label: 'puntualidad' },
            ].map((metric) => (
              <div key={metric.label} className="text-center">
                <p className="text-[17px] font-semibold leading-none text-text sm:text-[19px]">
                  <Counter to={metric.value} suffix={metric.suffix} />
                </p>
                <p className="mt-1 font-mono text-[7.5px] uppercase tracking-[0.14em] text-text-secondary/60">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <p className="hud text-[8px]">En tu corredor</p>
              <Link href="/buscar" className="flex items-center gap-1 text-[9.5px] font-medium text-accent/90">
                Ver todos <ArrowUpRight className="h-2.5 w-2.5" />
              </Link>
            </div>
            <div className="mask-fade-x mt-2 flex gap-2.5 overflow-x-auto pb-1 no-scrollbar lg:hidden">
              {featured.map((trip) => (
                <div key={trip.id} className="w-[270px] shrink-0">
                  <TripCard trip={trip} compact />
                </div>
              ))}
            </div>
            <div className="mt-2 hidden gap-1.5 lg:flex">
              {recentSearches.slice(0, 2).map((item) => (
                <button
                  key={`${item.origin}-${item.destination}`}
                  type="button"
                  onClick={() => goSearch(item.origin, item.destination)}
                  className="group flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-2.5 py-2 text-left transition-colors hover:border-white/20 hover:bg-white/[0.05]"
                >
                  <Clock className="h-3 w-3 shrink-0 text-text-secondary/60" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[10px] font-medium text-text/80">{shorten(item.origin)}</span>
                    <span className="block truncate text-[9px] text-text-secondary/60">→ {shorten(item.destination)}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/[0.06] pt-3">
            <p className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.12em] text-text-secondary/50">
              <Sparkles className="h-2.5 w-2.5 text-amber/70" />
              Tarifa justa · sin subasta
            </p>
            <Link
              href="/publicar"
              className="flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-[9.5px] font-medium text-text-secondary transition-colors hover:border-primary/40 hover:text-primary-light"
            >
              <RouteIcon className="h-2.5 w-2.5" />
              Ofrecer cupo
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ---- Floating corridor cards ---------------------------------------- */}
      <motion.aside
        initial={reduced ? false : { opacity: 0, y: 50, filter: 'blur(14px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1.1, ease: EASE, delay: 0.5 }}
        className="absolute bottom-[calc(104px+env(safe-area-inset-bottom))] right-8 z-20 hidden w-[632px] xl:right-12 lg:block"
      >
        <div className="mb-2.5 flex items-end justify-between">
          <div>
            <p className="hud text-[8px]">Ahora en tu corredor</p>
            <p className="mt-1 text-[13px] font-medium text-text">Salidas confirmadas en los próximos 40 min</p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-accent" />
            <span className="h-1 w-1 rounded-full bg-accent/50" />
            <span className="h-1 w-1 rounded-full bg-accent/25" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {featured.slice(0, 2).map((trip) => (
            <TripCard key={trip.id} trip={trip} compact />
          ))}
        </div>
      </motion.aside>

      {/* Mobile top HUD */}
      <div className="pointer-events-none absolute inset-x-4 top-20 z-20 flex items-center justify-between lg:hidden">
        <span className="glass flex items-center gap-2 rounded-full px-2.5 py-1.5">
          <span className="h-1 w-1 rounded-full bg-accent" />
          <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-text-secondary">Cali · 03°22′ N</span>
        </span>
        <span className="glass flex items-center gap-1.5 rounded-full px-2.5 py-1.5">
          <RouteIcon className="h-2.5 w-2.5 text-primary" />
          <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-text-secondary">Ruta activa</span>
        </span>
      </div>
    </div>
  );
}
