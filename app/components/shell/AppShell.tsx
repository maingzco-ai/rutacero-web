'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Bell, Moon, Sun } from 'lucide-react';
import { brand } from '@/app/lib/brand';
import { useAppState } from '@/app/lib/AppState';
import { useTheme } from '@/app/hooks/useTheme';
import { cn } from '@/app/lib/design-system';
import { springSnap } from '@/app/lib/motion';
import { BottomNav } from './BottomNav';
import { LogoMark, Wordmark } from './Logo';
import { PageVeil, RouteBeam } from '../fx/PageVeil';
import { Magnetic } from '../fx/Magnetic';

const NAV = [
  { href: '/', label: 'Inicio' },
  { href: '/buscar', label: 'Explorar' },
  { href: '/historial', label: 'Viajes' },
  { href: '/mensajes', label: 'Mensajes' },
  { href: '/perfil', label: 'Perfil' },
] as const;

function AmbienceToggle() {
  const [theme, , setTheme] = useTheme();
  const reduced = useReducedMotion();
  const isSolaris = theme === 'light';

  return (
    <button
      type="button"
      onClick={() => setTheme(isSolaris ? 'dark' : 'light')}
      aria-label={isSolaris ? 'Cambiar a ambience Nocturne' : 'Cambiar a ambience Solaris'}
      title={isSolaris ? 'Nocturne' : 'Solaris'}
      className="group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/[0.05] text-text-secondary transition-all duration-500 hover:border-white/25 hover:text-text"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={reduced ? false : { y: 12, opacity: 0, rotate: -30 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -12, opacity: 0, rotate: 30 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center"
        >
          {isSolaris ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </motion.span>
      </AnimatePresence>
      <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 shadow-[0_0_24px_rgba(124,156,255,0.5)] transition-opacity duration-500 group-hover:opacity-100" />
    </button>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { unreadNotifications } = useAppState();
  const isHome = pathname === '/';

  return (
    <div className="relative flex min-h-dvh flex-col">
      <PageVeil />
      <RouteBeam />

      {/* HUD frame */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-4 z-[45] hidden lg:block">
        <span className="absolute left-0 top-0 h-4 w-4 border-l border-t border-white/15" />
        <span className="absolute right-0 top-0 h-4 w-4 border-r border-t border-white/15" />
        <span className="absolute bottom-0 left-0 h-4 w-4 border-b border-l border-white/15" />
        <span className="absolute bottom-0 right-0 h-4 w-4 border-b border-r border-white/15" />
        <span className="hud absolute bottom-1 left-6 text-[8px] opacity-40">
          {brand.city} · 03°22′ N / 76°31′ O
        </span>
        <span className="hud absolute bottom-1 right-6 text-[8px] opacity-40">SYS · ONLINE</span>
      </div>

      <header className="pointer-events-none fixed inset-x-0 top-0 z-[60] px-3 pt-3 sm:px-5 sm:pt-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <Magnetic strength={0.16} scale={1.01}>
            <Link
              href="/"
              aria-label={`${brand.name} — inicio`}
              className={cn(
                'glass group pointer-events-auto flex items-center gap-3 rounded-full py-1.5 pl-1.5 pr-4 transition-colors duration-500 hover:border-white/25',
              )}
            >
              <LogoMark size={32} />
              <span className="flex flex-col leading-none">
                <Wordmark />
                <span className="mt-1 hidden font-mono text-[7.5px] uppercase tracking-[0.24em] text-text-secondary/60 sm:block">
                  {brand.tagline}
                </span>
              </span>
            </Link>
          </Magnetic>

          <nav
            aria-label="Secciones"
            className="glass pointer-events-auto hidden items-center gap-0.5 rounded-full p-1 md:flex"
          >
            {NAV.map((item) => {
              const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative rounded-full px-3.5 py-2 text-[11px] font-medium tracking-wide transition-colors duration-300',
                    active ? 'text-text' : 'text-text-secondary hover:text-text',
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="head-active"
                      className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.08]"
                      transition={springSnap}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                  {active && (
                    <span className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_8px_rgba(92,233,220,0.9)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="pointer-events-auto flex items-center gap-2">
            <AmbienceToggle />
            <Link
              href="/notificaciones"
              aria-label={`Notificaciones${unreadNotifications > 0 ? ` · ${unreadNotifications} sin leer` : ''}`}
              className="glass group relative flex h-10 w-10 items-center justify-center rounded-full text-text-secondary transition-all duration-500 hover:border-white/25 hover:text-text"
            >
              <Bell className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-12" />
              {unreadNotifications > 0 && (
                <>
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_rgba(92,233,220,0.9)]" />
                  <span className="absolute right-2 top-2 h-2 w-2 animate-ping rounded-full bg-accent/60" />
                </>
              )}
            </Link>
          </div>
        </div>
      </header>

      <main className={cn('relative flex-1', isHome ? 'overflow-hidden' : 'pb-32 pt-24 sm:pt-28')}>
        {children}
      </main>

      <BottomNav />
    </div>
  );
}
