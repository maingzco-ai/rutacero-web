'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  ArrowUpDown,
  CarFront,
  Check,
  CheckCircle2,
  Clock,
  Leaf,
  Loader2,
  Lock,
  Route,
  Search,
  Sun,
  Moon,
  UserPlus,
  Users,
  XCircle,
  LocateFixed,
} from 'lucide-react';
import type { Location } from './InteractiveMap';
import { resolverPunto } from '../lib/mapsCali';
import SmartSearchInput from './SmartSearchInput';
import RideCard, { formatCOP } from './RideCard';

// Mapa solo en cliente (react-leaflet usa `window`).
const InteractiveMap = dynamic(() => import('./InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] w-full animate-pulse flex-col items-center justify-center gap-3 rounded-xl bg-slate-100 dark:bg-slate-800 lg:h-[520px]">
      <LocateFixed className="h-8 w-8 text-emerald-500" />
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Cargando mapa de Cali…
      </p>
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

// ---- Reglas de negocio (contexto del backend Python) ---------------------
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

function generarPin(): string {
  const digitos = Array.from({ length: 4 }, () =>
    Math.floor(Math.random() * 10),
  ).join('');
  return `RC-${digitos}`;
}

/** Tarifa justa: $15.000 base / cupos ≠ clamp $4.500-$5.000 COP. */
function tarifaJusta(cupos: number): number {
  return Math.min(5000, Math.max(4500, Math.round(15000 / cupos)));
}

// ---- Estilos con validación visual en tiempo real ------------------------
const clsBaseInput =
  'w-full rounded-xl border bg-slate-50 py-2.5 pl-3 pr-10 text-sm outline-none transition focus:ring-2 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500';
const clsEstado = (valor: string, valido: boolean) => {
  if (!valor)
    return 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 dark:border-slate-700';
  return valido
    ? 'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20'
    : 'border-red-400 focus:border-red-400 focus:ring-red-400/20';
};

export default function AppDashboard() {
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      document.documentElement.classList.contains('dark') ||
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  // ---- Control de viaje ---------------------------------------------------
  const [origen, setOrigen] = useState('Unicentro Cali');
  const [destino, setDestino] = useState('Universidad Icesi');
  const [buscando, setBuscando] = useState(false);

  // ---- Datos del mapa (mock basado en PUNTOS_BASE_CALI) -------------------
  const [routeData, setRouteData] = useState<RouteData | null>({
    origen: { lat: 3.3768, lng: -76.537, name: 'Unicentro Cali', estimatedTime: '6:50 AM', price: 0 },
    destino: { lat: 3.3418, lng: -76.5303, name: 'Universidad Icesi', estimatedTime: '7:15 AM', price: 0 },
    paradas: [
      { lat: 3.369, lng: -76.5285, name: 'Holguines Trade Center', estimatedTime: '6:55 AM', price: 4500 },
      { lat: 3.3644, lng: -76.5342, name: 'Ciudad Jardín', estimatedTime: '7:00 AM', price: 4500 },
    ],
  });

  const [pasajeros, setPasajeros] = useState<Pasajero[]>([
    { nombre: 'Ana Gómez', carrera: 'Medicina', viajes: 12, precio: 4500, recogida: '6:55 AM', pin: 'RC-4829', ubicacion: 'Holguines Trade Center', preferencia: 'Música' },
    { nombre: 'Mateo Cruz', carrera: 'Ing. de Sistemas', viajes: 3, precio: 4500, recogida: '7:00 AM', pin: 'RC-1937', ubicacion: 'Ciudad Jardín', preferencia: 'Silencio' },
  ]);

  /** Reconstruye la ruta a partir de origen/destino y la lista de pasajeros. */
  const construirRuta = (lista: Pasajero[]): RouteData => {
    const o = resolverPunto(origen);
    const d = resolverPunto(destino);
    return {
      origen: { name: o.nombre, lat: o.lat, lng: o.lng, estimatedTime: '6:50 AM', price: 0 },
      destino: { name: d.nombre, lat: d.lat, lng: d.lng, estimatedTime: '7:15 AM', price: 0 },
      paradas: lista.map((p) => {
        const pt = resolverPunto(p.ubicacion);
        return { name: pt.nombre, lat: pt.lat, lng: pt.lng, estimatedTime: p.recogida, price: p.precio };
      }),
    };
  };

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    setBuscando(true);
    // Simulación del backend (ai_service asigna en <1s); al terminar se
    // actualiza el mapa con la polyline y los marcadores numerados.
    setTimeout(() => {
      setRouteData(construirRuta(pasajeros));
      setBuscando(false);
    }, 900);
  };

  const swapPlaces = () => {
    setOrigen(destino);
    setDestino(origen);
  };

  // ---- Selector de rol -----------------------------------------------------
  const [rol, setRol] = useState<'pasajero' | 'conductor'>('pasajero');

  // ---- Form "Pedir Cupo" ---------------------------------------------------
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [preferencia, setPreferencia] = useState('Música');
  const [solicitudAceptada, setSolicitudAceptada] = useState<{ pin: string; nombre: string } | null>(null);

  const correoOk = esCorreoInstitucional(correo);
  const whatsappOk = whatsappValido(whatsapp);

  const confirmarSolicitud = () => {
    if (!nombre.trim() || !correoOk || !whatsappOk) return;
    const pin = generarPin();
    const nuevo: Pasajero = {
      nombre: nombre.trim(),
      carrera: 'Estudiante verificado',
      viajes: 0,
      precio: 4500,
      recogida: '6:58 AM',
      pin,
      ubicacion: routeData?.paradas[0]?.name ?? 'Cañasgordas / Pance',
      preferencia,
    };
    const lista = [...pasajeros, nuevo];
    setPasajeros(lista);
    setRouteData(construirRuta(lista));
    setSolicitudAceptada({ pin, nombre: nuevo.nombre });
    setNombre('');
    setCorreo('');
    setWhatsapp('');
  };

  // ---- Form "Ofrecer Cupo" -------------------------------------------------
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [cupos, setCupos] = useState(3);
  const [rutaHabitual, setRutaHabitual] = useState('Cañasgordas → Icesi');
  const [rutaPublicada, setRutaPublicada] = useState(false);
  const tarifa = tarifaJusta(cupos);

  const publicarRuta = () => {
    if (!placaValida(placa) || modelo.trim().length < 3) return;
    setRutaPublicada(true);
  };

  const tabActivo =
    'flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-500/25';
  const tabInactivo =
    'flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300';

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2C2C2C] dark:bg-slate-900 dark:text-slate-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        {/* Header interno */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
              <Route className="h-5 w-5" />
            </span>
            <div>
              <p className="text-lg font-bold leading-none tracking-tight">
                RutaCero
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Carpooling universitario · Cali
              </p>
            </div>
            <span className="ml-2 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              MVP · Cali Sur
            </span>
          </div>

          {/* Toggle modo oscuro / claro */}
          <div
            className="flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            role="group"
            aria-label="Cambiar tema"
          >
            <button
              type="button"
              onClick={() => setDark(false)}
              aria-label="Modo claro"
              aria-pressed={!dark}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                !dark ? 'bg-emerald-500 text-white shadow' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Sun className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setDark(true)}
              aria-label="Modo oscuro"
              aria-pressed={dark}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                dark ? 'bg-emerald-500 text-white shadow' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Moon className="h-4 w-4" />
            </button>
          </div>
        </header>

        <main className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[440px_1fr]">
          {/* ============ Panel izquierdo · Control de viaje ============ */}
          <section className="flex flex-col gap-5">
            {/* Búsqueda de ruta */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h2 className="text-lg font-semibold">Planifica tu viaje</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Autocompletado inteligente sobre los 19 puntos de Cali.
              </p>

              <form onSubmit={handleBuscar} className="mt-4 flex flex-col gap-3">
                <SmartSearchInput label="Origen" placeholder="cenco, holgui, lili…" value={origen} onValueChange={setOrigen} />
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={swapPlaces}
                    aria-label="Intercambiar origen y destino"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
                  >
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </div>
                <SmartSearchInput label="Destino" placeholder="icesi, jav, uao…" value={destino} onValueChange={setDestino} />

                <button
                  type="submit"
                  disabled={buscando}
                  className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 active:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {buscando ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Buscando ruta óptima…
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      Buscar Ruta Óptima
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Selector de rol */}
            <div className="flex gap-2" role="tablist" aria-label="Rol">
              <button type="button" role="tab" aria-selected={rol === 'pasajero'} onClick={() => setRol('pasajero')} className={rol === 'pasajero' ? tabActivo : tabInactivo}>
                <UserPlus className="h-4 w-4" />
                Pedir Cupo
              </button>
              <button type="button" role="tab" aria-selected={rol === 'conductor'} onClick={() => setRol('conductor')} className={rol === 'conductor' ? tabActivo : tabInactivo}>
                <CarFront className="h-4 w-4" />
                Ofrecer Cupo
              </button>
            </div>

            {/* Form: Pedir Cupo */}
            {rol === 'pasajero' ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <h3 className="text-base font-semibold">Solicita tu cupo</h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Solo correos institucionales · validación en tiempo real
                </p>
                <div className="mt-4 flex flex-col gap-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Nombre completo</label>
                    <input
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Ej: Ana Gómez"
                      className={`${clsBaseInput} ${nombre.trim() ? 'border-emerald-500 focus:ring-emerald-500/20' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 dark:border-slate-700'}`}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Correo institucional</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        placeholder="ana.gomez@icesi.edu.co"
                        className={`${clsBaseInput} ${clsEstado(correo, correoOk)}`}
                      />
                      {correo && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2">
                          {correoOk ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-red-400" />}
                        </span>
                      )}
                    </div>
                    {correo && (
                      <p className={correoOk ? 'mt-1 text-xs text-emerald-600 dark:text-emerald-400' : 'mt-1 text-xs text-red-500'}>
                        {correoOk ? '✅ Verificado (@icesi, @javeriana, @uao, @univalle)' : '❌ Usa un correo institucional universitario'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">WhatsApp</label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="Ej: 3151234567"
                        className={`${clsBaseInput} ${clsEstado(whatsapp, whatsappOk)}`}
                      />
                      {whatsapp && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2">
                          {whatsappOk ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-red-400" />}
                        </span>
                      )}
                    </div>
                    {whatsapp && !whatsappOk && (
                      <p className="mt-1 text-xs text-red-500">❌ Ingresa 10 dígitos empezando por 3</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Preferencia de viaje</label>
                    <select
                      value={preferencia}
                      onChange={(e) => setPreferencia(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    >
                      {['Silencio', 'Música', 'Aire'].map((op) => (
                        <option key={op} value={op}>{op}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={confirmarSolicitud}
                    disabled={!nombre.trim() || !correoOk || !whatsappOk}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none dark:disabled:bg-slate-700"
                  >
                    <Check className="h-4 w-4" />
                    Confirmar Solicitud
                  </button>

                  {solicitudAceptada && (
                    <div className="flex items-start gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400">
                      <Lock className="mt-0.5 h-4 w-4 shrink-0" />
                      <p>
                        Cupo solicitado para <b>{solicitudAceptada.nombre}</b>. Tu
                        PIN de abordaje es <b>{solicitudAceptada.pin}</b> — dictalo
                        al conductor al subir.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Form: Ofrecer Cupo */
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <h3 className="text-base font-semibold">Publica tu ruta</h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Tarifa justa estimada: $15.000 base divididos entre cupos
                </p>
                <div className="mt-4 flex flex-col gap-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Placa</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={placa}
                        onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                        placeholder="Ej: UES-123"
                        className={`${clsBaseInput} ${clsEstado(placa, placaValida(placa))}`}
                      />
                      {placa && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2">
                          {placaValida(placa) ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-red-400" />}
                        </span>
                      )}
                    </div>
                    {placa && !placaValida(placa) && (
                      <p className="mt-1 text-xs text-red-500">❌ Formato AAA-123</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Modelo y color</label>
                    <input
                      type="text"
                      value={modelo}
                      onChange={(e) => setModelo(e.target.value)}
                      placeholder="Ej: Mazda 2 Blanco"
                      className={`${clsBaseInput} ${modelo ? (modelo.trim().length >= 3 ? 'border-emerald-500 focus:ring-emerald-500/20' : 'border-red-400 focus:ring-red-400/20') : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 dark:border-slate-700'}`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">Cupos</label>
                      <select
                        value={cupos}
                        onChange={(e) => setCupos(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                      >
                        {[1, 2, 3, 4].map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">Ruta habitual</label>
                      <select
                        value={rutaHabitual}
                        onChange={(e) => setRutaHabitual(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                      >
                        {['Cañasgordas → Icesi', 'Unicentro → Javeriana', 'Holguines → UAO', 'Valle del Lili → Univalle'].map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={publicarRuta}
                    disabled={!placaValida(placa) || modelo.trim().length < 3}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none dark:disabled:bg-slate-700"
                  >
                    <CarFront className="h-4 w-4" />
                    Publicar Ruta
                  </button>

                  {rutaPublicada && (
                    <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400">
                      <p className="font-semibold">Ruta publicada · {rutaHabitual}</p>
                      <p className="mt-1">
                        Tarifa estimada por pasajero: <b>{formatCOP(tarifa)}</b>
                        <span className="text-xs opacity-80"> (base $15.000 / {cupos} cupos · tarifa justa $4.500-$5.000)</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tarjetas de viaje con membresía */}
            <div>
              <h3 className="mb-3 text-base font-semibold">Pasajeros asignados</h3>
              <div className="flex flex-col gap-4">
                {pasajeros.map((p) => (
                  <RideCard
                    key={p.pin}
                    passengerName={p.nombre}
                    career={p.carrera}
                    tripCount={p.viajes}
                    priceCOP={p.precio}
                    pickupTime={p.recogida}
                    pickupLocation={p.ubicacion}
                    pin={p.pin}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* ============ Panel derecho · Mapa + contexto ============ */}
          <section className="flex flex-col gap-5">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700">
                <div>
                  <h2 className="font-semibold">Mapa en vivo · Cali</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {origen} → {destino}
                  </p>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                  {pasajeros.length} pasajero(s)
                </span>
              </div>
              <div className="h-[400px] w-full px-2 pb-2 pt-2 lg:h-[520px]">
                <InteractiveMap routeData={routeData} />
              </div>
            </div>

            {/* Widgets de métricas en vivo */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Users, label: 'Viajes Hoy', value: '1.2k' },
                { icon: Leaf, label: 'CO₂ Mitigado', value: '-30%' },
                { icon: Clock, label: 'Tiempo Promedio', value: '25m' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
                  <Icon className="mx-auto h-5 w-5 text-emerald-500" />
                  <p className="mt-1 text-base font-bold">{value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}