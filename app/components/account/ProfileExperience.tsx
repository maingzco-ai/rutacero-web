'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ShieldCheck, Sun, Moon, Sparkles } from 'lucide-react';
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
  { href: '/legal', label: 'Términos y Privacidad' },
];

function readOnboardingData() {
  try {
    const raw = localStorage.getItem('rutacero-onboarding');
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        email: parsed.email || undefined,
        role: parsed.role || undefined,
        contactMethod: parsed.contactMethod || undefined,
      };
    }
  } catch {
    /* ignore */
  }
  return { email: undefined, role: undefined, contactMethod: undefined };
}

export default function ProfileExperience() {
  const { balance, unreadNotifications, reservations, published } = useAppState();
  const [theme, , setTheme] = useTheme();
  const [userData, setUserData] = useState(() => readOnboardingData());

  useEffect(() => {
    const handleStorage = () => {
      setUserData(readOnboardingData());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const totalTrips = reservations.length + published.length;
  const level = getMembershipLevel(totalTrips);
  const progress = getMembershipProgress(totalTrips);

  const userEmail = userData.email || 'usuario.demo@icesi.edu.co';
  const university = userEmail.includes('icesi')
    ? 'Universidad Icesi'
    : userEmail.includes('javeriana')
      ? 'Pontificia Universidad Javeriana'
      : userEmail.includes('uao')
        ? 'Universidad Autónoma de Occidente'
        : userEmail.includes('univalle')
          ? 'Universidad del Valle'
          : 'Universidad de Cali [DEMO]';

  const displayName = userEmail.split('@')[0]?.replace('.', ' ') || 'Usuario RutaCero';

  return (
    <div className="mx-auto max-w-lg px-4 py-4">
      <Card elevated className="flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-lg font-bold text-white shadow-md">
          {getInitials(displayName)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold capitalize text-text">{displayName}</h1>
            <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[9px] font-bold text-accent-dark dark:text-accent">
              DEMO
            </span>
          </div>
          <p className="truncate text-sm text-text-secondary">{userEmail}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="primary">{level.label}</Badge>
            <Badge variant="outline">{university}</Badge>
          </div>
        </div>
      </Card>

      <Card className="mt-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-text-secondary">Comunidad Estudiantil</p>
          <span className="flex items-center gap-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Verificado
          </span>
        </div>
        <p className="mt-1 text-sm font-semibold text-text">{university}</p>
        <p className="mt-3 text-sm text-text-secondary">
          {totalTrips} viaje{totalTrips === 1 ? '' : 's'} · 5.0 de reputación · Miembro activo
        </p>
        <Progress className="mt-4" value={progress.percent} />
        <p className="mt-2 text-xs text-text-secondary">{progress.remainingText}</p>
      </Card>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Card padding="md">
          <p className="text-xs text-text-secondary">Saldo disponible</p>
          <p className="mt-1 text-lg font-bold text-primary">{formatCOP(balance)}</p>
        </Card>
        <Card padding="md">
          <p className="text-xs text-text-secondary">Método de contacto</p>
          <p className="mt-1 text-sm font-semibold capitalize text-text">
            {userData.contactMethod || 'Email institucional'}
          </p>
        </Card>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 dark:border-border-dark dark:bg-card-dark">
        <p className="text-sm font-medium text-text">Tema de la aplicación</p>
        <div className="flex gap-1 rounded-full bg-secondary p-1 dark:bg-muted/30">
          <Button
            size="sm"
            variant={theme === 'light' ? 'primary' : 'ghost'}
            onClick={() => setTheme('light')}
            aria-label="Modo claro"
          >
            <Sun className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={theme === 'dark' ? 'primary' : 'ghost'}
            onClick={() => setTheme('dark')}
            aria-label="Modo oscuro"
          >
            <Moon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card dark:border-border-dark dark:bg-card-dark">
        {LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center justify-between border-b border-border px-4 py-3 last:border-0 hover:bg-secondary/40 transition-colors dark:border-border-dark"
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
        Identidad institucional verificada. Tus datos están protegidos conforme a la ley colombiana.
      </p>
    </div>
  );
}
