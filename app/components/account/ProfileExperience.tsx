'use client';

import Link from 'next/link';
import { ChevronRight, Moon, ShieldCheck, Sun } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Progress } from '../ui/Progress';
import { profile } from '@/app/lib/catalog';
import { useAppState } from '@/app/lib/AppState';
import { formatCOP, getInitials, getMembershipLevel, getMembershipProgress } from '@/app/lib/design-system';
import { useTheme } from '@/app/hooks/useTheme';

const LINKS = [
  { href: '/historial', label: 'Historial de viajes' },
  { href: '/pagos', label: 'Pagos y saldo' },
  { href: '/notificaciones', label: 'Notificaciones' },
  { href: '/acerca', label: 'Sobre RutaCero' },
];

export default function ProfileExperience() {
  const { balance, unreadNotifications } = useAppState();
  const [theme, , setTheme] = useTheme();
  const level = getMembershipLevel(profile.trips);
  const progress = getMembershipProgress(profile.trips);

  return (
    <div className="mx-auto max-w-lg px-4 py-4">
      <Card elevated className="flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-lg font-bold text-white">
          {getInitials(profile.name)}
        </span>
        <div className="min-w-0">
          <h1 className="text-xl font-semibold">{profile.name}</h1>
          <p className="truncate text-sm text-neutral-500">{profile.email}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="success">{level.label}</Badge>
            <Badge variant="outline">{profile.university}</Badge>
          </div>
        </div>
      </Card>

      <Card className="mt-4">
        <p className="text-sm font-medium">{profile.career}</p>
        <p className="mt-1 text-sm text-neutral-500">
          {profile.trips} viajes · {profile.rating} de reputación · Miembro desde {profile.memberSince}
        </p>
        <Progress className="mt-4" value={progress.percent} />
        <p className="mt-2 text-xs text-neutral-500">{progress.remainingText}</p>
      </Card>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Card padding="md">
          <p className="text-xs text-neutral-500">Saldo</p>
          <p className="mt-1 text-lg font-semibold">{formatCOP(balance)}</p>
        </Card>
        <Card padding="md">
          <p className="text-xs text-neutral-500">WhatsApp</p>
          <p className="mt-1 text-lg font-semibold">{profile.phone}</p>
        </Card>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl border border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
        <p className="text-sm font-medium">Apariencia</p>
        <div className="flex gap-1 rounded-full bg-neutral-100 p-1 dark:bg-neutral-800">
          <Button size="sm" variant={theme === 'light' ? 'primary' : 'ghost'} onClick={() => setTheme('light')} aria-label="Modo claro">
            <Sun className="h-4 w-4" />
          </Button>
          <Button size="sm" variant={theme === 'dark' ? 'primary' : 'ghost'} onClick={() => setTheme('dark')} aria-label="Modo oscuro">
            <Moon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-3xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        {LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center justify-between border-b border-neutral-100 px-4 py-3 last:border-0 dark:border-neutral-800"
          >
            <span className="text-sm font-medium">{item.label}</span>
            <span className="flex items-center gap-2 text-neutral-400">
              {item.href === '/notificaciones' && unreadNotifications > 0 && (
                <Badge variant="success" size="sm">
                  {unreadNotifications}
                </Badge>
              )}
              <ChevronRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>

      <p className="mt-6 flex items-center gap-2 text-xs text-neutral-500">
        <ShieldCheck className="h-4 w-4 text-emerald-600" />
        Identidad institucional verificada. No vendemos datos.
      </p>
    </div>
  );
}
