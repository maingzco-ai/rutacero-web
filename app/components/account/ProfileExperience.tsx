'use client';

import Link from 'next/link';
import { ChevronRight, ShieldCheck, Sun, Moon } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Progress } from '../ui/Progress';
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
  const level = getMembershipLevel(0);
  const progress = getMembershipProgress(0);

  return (
    <div className="mx-auto max-w-lg px-4 py-4">
      <Card elevated className="flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
          UC
        </span>
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-text">Mi perfil</h1>
          <p className="truncate text-sm text-text-secondary">Inicia sesión para ver tu correo institucional</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="primary">{level.label}</Badge>
            <Badge variant="outline">Sin universidad</Badge>
          </div>
        </div>
      </Card>

      <Card className="mt-4">
        <p className="text-sm font-medium text-text-secondary">Carrera</p>
        <p className="mt-1 text-sm text-text-secondary">Sin datos registrados</p>
        <p className="mt-3 text-sm text-text-secondary">
          0 viajes · 0 de reputación · Miembro desde —
        </p>
        <Progress className="mt-4" value={progress.percent} />
        <p className="mt-2 text-xs text-text-secondary">{progress.remainingText}</p>
      </Card>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Card padding="md">
          <p className="text-xs text-text-secondary">Saldo</p>
          <p className="mt-1 text-lg font-semibold text-text">{formatCOP(balance)}</p>
        </Card>
        <Card padding="md">
          <p className="text-xs text-text-secondary">WhatsApp</p>
          <p className="mt-1 text-lg font-semibold text-text">Sin número registrado</p>
        </Card>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 dark:border-border-dark dark:bg-card-dark">
        <p className="text-sm font-medium text-text">Apariencia</p>
        <div className="flex gap-1 rounded-full bg-secondary p-1 dark:bg-muted/30">
          <Button size="sm" variant={theme === 'light' ? 'primary' : 'ghost'} onClick={() => setTheme('light')} aria-label="Modo claro">
            <Sun className="h-4 w-4" />
          </Button>
          <Button size="sm" variant={theme === 'dark' ? 'primary' : 'ghost'} onClick={() => setTheme('dark')} aria-label="Modo oscuro">
            <Moon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card dark:border-border-dark dark:bg-card-dark">
        {LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center justify-between border-b border-border px-4 py-3 last:border-0 dark:border-border-dark"
          >
            <span className="text-sm font-medium text-text">{item.label}</span>
            <span className="flex items-center gap-2 text-text-secondary">
              {item.href === '/notificaciones' && unreadNotifications > 0 && (
                <Badge variant="primary" size="sm">
                  {unreadNotifications}
                </Badge>
              )}
              <ChevronRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>

      <p className="mt-6 flex items-center gap-2 text-xs text-text-secondary">
        <ShieldCheck className="h-4 w-4 text-primary" />
        Identidad institucional verificada. No vendemos datos.
      </p>
    </div>
  );
}
