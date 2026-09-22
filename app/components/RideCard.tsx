'use client';

import {
  Clock,
  GraduationCap,
  KeyRound,
  Lock,
  MapPin,
} from 'lucide-react';

// ---- Membresía RutaPass (regla de negocio real) ---------------------------
type Nivel = {
  min: number;
  max: number;
  emoji: string;
  etiqueta: string;
  badgeClases: string;
  barraClases: string;
  proximo: number | null;
};

const NIVELES: Nivel[] = [
  {
    min: 0,
    max: 4,
    emoji: '🌱',
    etiqueta: 'Nuevo Usuario',
    badgeClases:
      'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
    barraClases: 'from-slate-400 to-slate-600',
    proximo: 5,
  },
  {
    min: 5,
    max: 19,
    emoji: '⭐',
    etiqueta: 'Miembro RutaPass',
    badgeClases:
      'bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/25 dark:text-emerald-400',
    barraClases: 'from-emerald-400 to-emerald-600',
    proximo: 20,
  },
  {
    min: 20,
    max: Infinity,
    emoji: '👑',
    etiqueta: 'Embajador Sostenible',
    badgeClases:
      'bg-amber-400/20 text-amber-800 dark:bg-amber-400/25 dark:text-amber-300',
    barraClases: 'from-amber-400 to-yellow-600',
    proximo: null,
  },
];

export function nivelMembresia(viajes: number): Nivel {
  return (
    NIVELES.find((n) => viajes >= n.min && viajes <= n.max) ?? NIVELES[0]
  );
}

// ---- Utilidades -------------------------------------------------------
export function formatCOP(value: number): string {
  return `$${new Intl.NumberFormat('es-CO').format(value)} COP`;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

// ---- Componente -------------------------------------------------------
type RideCardProps = {
  passengerName: string;
  career: string;
  tripCount: number;
  /** Precio final en COP (tarifa justa típica: 4.500-5.000). */
  priceCOP?: number;
  pickupTime?: string;
  pickupLocation?: string;
  pin?: string;
  isOnBoard?: boolean;
};

export default function RideCard({
  passengerName,
  career,
  tripCount = 0,
  priceCOP = 4500,
  pickupTime = '6:55 AM',
  pickupLocation = 'Holguines Trade Center',
  pin = 'RC-0000',
  isOnBoard = false,
}: RideCardProps) {
  const nivel = nivelMembresia(tripCount);

  // Progreso hacia el siguiente nivel (o 100% si ya es Embajador).
  let progreso = 100;
  let faltan = '';
  if (nivel.proximo !== null) {
    const rango = nivel.proximo - nivel.min;
    const dentro = Math.max(0, tripCount - nivel.min);
    progreso = Math.min(100, Math.round((dentro / rango) * 100));
    faltan = `${nivel.proximo - tripCount} viaje${nivel.proximo - tripCount === 1 ? '' : 's'} para ${nivel.etiqueta}`;
  } else {
    faltan = 'Nivel máximo alcanzado';
  }

  return (
    <article className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
      {/* Avatar + nombre + carrera */}
      <div className="flex items-center gap-3 p-4 pb-3">
        <span
          aria-hidden
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-inner"
          style={{ backgroundColor: '#10B981' }}
        >
          {getInitials(passengerName)}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-semibold leading-tight text-slate-900 dark:text-slate-100">
            {passengerName}
          </h3>
          <p className="flex items-center gap-1 truncate text-[13px] text-slate-500 dark:text-slate-400">
            <GraduationCap className="h-3.5 w-3.5 shrink-0" />
            {career}
          </p>
        </div>
        {/* Badge de membresía dinámico */}
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${nivel.badgeClases}`}
        >
          {nivel.emoji} {nivel.etiqueta}
        </span>
      </div>

      <div className="mx-4 h-px bg-slate-100 dark:bg-slate-700" />

      {/* Barra de progreso hacia el siguiente nivel */}
      <div className="px-4 pt-3">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${nivel.barraClases} transition-all duration-500`}
            style={{ width: `${progreso}%` }}
          />
        </div>
        <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
          {faltan}
        </p>
      </div>

      {/* Precio destacado + hora de recogida */}
      <div className="flex items-end justify-between px-4 pt-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Tarifa justa
          </p>
          <p className="text-[28px] font-extrabold leading-none tracking-tight text-emerald-500 dark:text-emerald-400">
            {formatCOP(priceCOP)}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">{tripCount} viajes</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-700/60">
          <Clock className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          <div className="leading-none">
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
              Recogida
            </p>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {pickupTime}
            </p>
          </div>
        </div>
      </div>

      {/* Info de recogida */}
      <div className="flex items-start gap-2 px-4 pt-3">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
        <p className="text-[13px] leading-snug text-slate-600 dark:text-slate-300">
          {pickupTime} · {pickupLocation}
        </p>
      </div>

      {/* PIN de seguridad */}
      <div className="p-4 pt-3">
        {isOnBoard ? (
          <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white">
            <Lock className="h-4 w-4" />
            A bordo · Viaje seguro
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            <KeyRound className="h-4 w-4" />
            PIN de seguridad: {pin}
          </div>
        )}
      </div>
    </article>
  );
}