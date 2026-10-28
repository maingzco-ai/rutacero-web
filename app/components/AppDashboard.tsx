'use client';

import { useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Sun, Moon, Route } from 'lucide-react';
import { useTheme } from '@/app/hooks/useTheme';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import RouteSearchPanel from './dashboard/RouteSearchPanel';
import RoleSelector from './dashboard/RoleSelector';
import PassengerForm from './dashboard/PassengerForm';
import DriverForm from './dashboard/DriverForm';
import PassengersList from './dashboard/PassengersList';
import MetricsWidget from './dashboard/MetricsWidget';
import { resolverPunto } from '@/app/lib/mapsCali';
import type { Location } from './InteractiveMap';
import { cn } from '@/app/lib/design-system';

// Map loads only on client (react-leaflet uses window)
const InteractiveMap = dynamic(() => import('./InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] w-full items-center justify-center gap-3 rounded-3xl bg-neutral-100 dark:bg-neutral-800 lg:h-[520px]">
      <Route className="h-8 w-8 text-green-600 animate-pulse" aria-hidden="true" />
      <p className="text-sm text-neutral-500 dark:text-neutral-400">Cargando mapa de Cali…</p>
    </div>
  ),
});

type RouteData = {
  origen: Location;
  destino: Location;
  paradas: Location[];
};

type Pasajero = {
  nombre: string;
  carrera: string;
  viajes: number;
  precio: number;
  recogida: string;
  pin: string;
  ubicacion: string;
  preferencia?: string;
};

const DOMINIOS = [
  'icesi.edu.co',
  'javerianacali.edu.co',
  'uao.edu.co',
  'correounivalle.edu.co',
];

const esCorreoInstitucional = (c: string) =>
  /^[^@\s]+@[^@\s]+$/.test(c) && DOMINIOS.some((d) => c.toLowerCase().endsWith(d));

const whatsappValido = (w: string) => /^3\d{9}$/.test(w);
const placaValida = (p: string) => /^[A-Z]{3}-\d{3}$/i.test(p.trim());

function tarifaJusta(cupos: number): number {
  return Math.min(5000, Math.max(4500, Math.round(15000 / cupos)));
}

export default function AppDashboard() {
  const [theme, toggleTheme, setTheme] = useTheme();

  // Route state
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [searching, setSearching] = useState(false);

  // Passengers state
  const [pasajeros, setPasajeros] = useState<Pasajero[]>([
    { nombre: 'Ana Gómez', carrera: 'Medicina', viajes: 12, precio: 4500, recogida: '6:55 AM', pin: 'RC-4829', ubicacion: 'Holguines Trade Center', preferencia: 'Música' },
    { nombre: 'Mateo Cruz', carrera: 'Ing. de Sistemas', viajes: 3, precio: 4500, recogida: '7:00 AM', pin: 'RC-1937', ubicacion: 'Ciudad Jardín', preferencia: 'Silencio' },
  ]);

  // Role state
  const [rol, setRol] = useState<'pasajero' | 'conductor'>('pasajero');

  // Driver form state
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [cupos, setCupos] = useState(3);
  const [rutaHabitual, setRutaHabitual] = useState('Cañasgordas → Icesi');
  const [rutaPublicada, setRutaPublicada] = useState(false);

  // Build route from current passengers
  const construirRuta = useCallback((lista: Pasajero[]): RouteData => {
    const origen = resolverPunto('Unicentro Cali');
    const destino = resolverPunto('Universidad Icesi');
    return {
      origen: { name: origen.nombre, lat: origen.lat, lng: origen.lng, estimatedTime: '6:50 AM', price: 0 },
      destino: { name: destino.nombre, lat: destino.lat, lng: destino.lng, estimatedTime: '7:15 AM', price: 0 },
      paradas: lista.map((p) => {
        const pt = resolverPunto(p.ubicacion);
        return { name: pt.nombre, lat: pt.lat, lng: pt.lng, estimatedTime: p.recogida, price: p.precio };
      }),
    };
  }, []);

  // Initialize route data
  const initializedRouteData = useMemo(() => {
    if (!routeData) {
      return construirRuta(pasajeros);
    }
    return routeData;
  }, [routeData, pasajeros, construirRuta]);

  // Handle route search
  const handleBuscar = useCallback((origen: string, destino: string) => {
    setSearching(true);
    setTimeout(() => {
      setRouteData(construirRuta(pasajeros));
      setSearching(false);
    }, 900);
  }, [construirRuta, pasajeros]);

  // Handle passenger submission
  const handlePassengerSubmit = useCallback((pasajero: Pasajero) => {
    const lista = [...pasajeros, pasajero];
    setPasajeros(lista);
    setRouteData(construirRuta(lista));
  }, [pasajeros, construirRuta]);

  // Handle driver submission
  const handleDriverSubmit = useCallback((data: { placa: string; modelo: string; cupos: number; rutaHabitual: string; tarifa: number }) => {
    setRutaPublicada(true);
  }, []);

  const tarifa = tarifaJusta(cupos);

  return (
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white shadow-lg">
              <Route className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xl font-bold leading-none tracking-tight">RutaCero</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Carpooling universitario · Cali</p>
            </div>
            <Badge variant="secondary" className="ml-2">MVP · Cali Sur</Badge>
          </div>

          {/* Theme toggle */}
          <div
            className="flex items-center rounded-full border border-neutral-200 bg-white p-1 shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
            role="group"
            aria-label="Cambiar tema"
          >
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setTheme('light')}
              aria-label="Modo claro"
              aria-pressed={theme === 'light'}
              className={cn('h-8 w-8 rounded-full', theme === 'light' && 'bg-black text-white shadow')}
            >
              <Sun className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setTheme('dark')}
              aria-label="Modo oscuro"
              aria-pressed={theme === 'dark'}
              className={cn('h-8 w-8 rounded-full', theme === 'dark' && 'bg-black text-white shadow')}
            >
              <Moon className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </header>

        <main className="grid grid-cols-1 gap-6 lg:grid-cols-[440px_1fr]">
          {/* Left Panel - Controls */}
          <section className="flex flex-col gap-5 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto lg:sticky lg:top-4">
            {/* Route Search */}
            <RouteSearchPanel
              routeData={initializedRouteData}
              onSearch={handleBuscar}
              isSearching={searching}
            />

            {/* Role Selector */}
            <RoleSelector activeRole={rol} onChange={setRol} />

            {/* Forms */}
            {rol === 'pasajero' ? (
              <PassengerForm
                routeData={initializedRouteData}
                pasajerosCount={pasajeros.length}
                onSubmit={handlePassengerSubmit}
              />
            ) : (
              <DriverForm onSubmit={handleDriverSubmit} />
            )}

            {/* Passengers List */}
            <PassengersList pasajeros={pasajeros} />
          </section>

          {/* Right Panel - Map */}
          <section className="flex flex-col gap-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between border-b border-neutral-200 dark:border-neutral-700">
                <div>
                  <CardTitle>Mapa en vivo · Cali</CardTitle>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {initializedRouteData?.origen.name} → {initializedRouteData?.destino.name}
                  </p>
                </div>
                <Badge variant="success" className="flex items-center gap-1.5">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" aria-hidden="true" />
                  {pasajeros.length} pasajero{pasajeros.length !== 1 ? 's' : ''}
                </Badge>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[400px] w-full lg:h-[520px]">
                  <InteractiveMap routeData={initializedRouteData} />
                </div>
              </CardContent>
            </Card>

            {/* Metrics Widget */}
            <MetricsWidget />
          </section>
        </main>
      </div>
    </div>
  );
}