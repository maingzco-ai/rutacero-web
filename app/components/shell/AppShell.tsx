'use client';

import Link from 'next/link';
import { Bell, Route } from 'lucide-react';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { brand } from '@/app/lib/brand';
import { useAppState } from '@/app/lib/AppState';
import { cn } from '@/app/lib/design-system';
import { BottomNav } from './BottomNav';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { unreadNotifications } = useAppState();
  const isHome = pathname === '/';

  return (
    <div className="min-h-dvh bg-background text-text dark:bg-background-dark dark:text-text-dark">
      <header
        className={cn(
          'z-30 flex items-center justify-between gap-3 px-4 py-3',
          isHome
            ? 'pointer-events-none absolute inset-x-0 top-0'
            : 'sticky top-0 border-b border-border/70 bg-background/90 backdrop-blur-md dark:border-border-dark dark:bg-background-dark/90',
        )}
      >
        <Link
          href="/"
          className={cn(
            'pointer-events-auto inline-flex items-center gap-2 rounded-full px-3 py-2',
            isHome ? 'bg-surface/95 shadow-md dark:bg-card-dark' : '',
          )}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
            <Route className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold tracking-tight">{brand.name}</span>
            <span className="block text-[11px] text-text-secondary">{brand.tagline}</span>
          </span>
        </Link>
        <Link
          href="/notificaciones"
          aria-label="Notificaciones"
          className={cn(
            'pointer-events-auto relative flex h-10 w-10 items-center justify-center rounded-full',
            isHome ? 'bg-surface/95 shadow-md dark:bg-card-dark' : 'bg-secondary dark:bg-muted/30',
          )}
        >
          <Bell className="h-5 w-5" />
          {unreadNotifications > 0 && (
            <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background dark:ring-background-dark" />
          )}
        </Link>
      </header>
      <div className={cn(isHome ? '' : 'pb-24')}>{children}</div>
      <BottomNav />
    </div>
  );
}
