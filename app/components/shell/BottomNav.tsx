'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Car, Clock3, Home, MessageCircle, UserRound } from 'lucide-react';
import { cn } from '@/app/lib/design-system';
import { useAppState } from '@/app/lib/AppState';

const ITEMS = [
  { href: '/', label: 'Inicio', icon: Home, featured: false },
  { href: '/historial', label: 'Viajes', icon: Clock3, featured: false },
  { href: '/publicar', label: 'Publicar', icon: Car, featured: true },
  { href: '/mensajes', label: 'Chats', icon: MessageCircle, featured: false },
  { href: '/perfil', label: 'Perfil', icon: UserRound, featured: false },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const { unreadMessages } = useAppState();

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border/80 bg-background/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md dark:border-border-dark dark:bg-background-dark/95"
    >
      <ul className="mx-auto flex max-w-lg items-end justify-between">
        {ITEMS.map(({ href, label, icon: Icon, featured }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  'relative flex flex-col items-center gap-1 rounded-2xl px-2 py-1 text-[11px] font-medium',
                  featured && '-mt-5',
                  active && !featured ? 'text-primary dark:text-primary' : 'text-text-secondary dark:text-text-secondary',
                )}
              >
                <span
                  className={cn(
                    'flex items-center justify-center',
                    featured
                      ? 'h-12 w-12 rounded-full bg-primary text-white shadow-lg shadow-primary/25'
                      : 'h-8 w-8',
                  )}
                >
                  <Icon className={featured ? 'h-5 w-5' : 'h-5 w-5'} strokeWidth={active ? 2.4 : 2} />
                </span>
                {label}
                {href === '/mensajes' && unreadMessages > 0 && (
                  <span className="absolute right-4 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">
                    {unreadMessages}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
