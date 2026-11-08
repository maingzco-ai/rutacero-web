'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { Car, Clock3, Home, MessageCircle, UserRound } from 'lucide-react';
import { cn } from '@/app/lib/design-system';
import { useAppState } from '@/app/lib/AppState';
import { springSnap } from '@/app/lib/motion';

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
  const reduced = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[max(12px,env(safe-area-inset-bottom))] z-[60] flex justify-center px-3">
      <motion.nav
        aria-label="Navegación principal"
        initial={reduced ? false : { y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...springSnap, delay: 0.2 }}
        className="glass-strong pointer-events-auto relative w-full max-w-[430px] overflow-hidden rounded-[24px] px-2 py-1.5"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
        />
        <ul className="flex items-end justify-between">
          {ITEMS.map(({ href, label, icon: Icon, featured }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href);

            return (
              <li key={href} className="relative flex-1">
                <Link
                  href={href}
                  className={cn(
                    'group relative flex flex-col items-center gap-1 rounded-2xl px-1 pb-1 pt-2 text-[9px] font-medium tracking-wide transition-colors duration-300',
                    featured && 'pb-1',
                    active ? 'text-text' : 'text-text-secondary/80 hover:text-text',
                  )}
                >
                  {active && !featured && (
                    <motion.span
                      layoutId="dock-active"
                      className="absolute inset-x-1 inset-y-0.5 rounded-[16px] border border-white/10 bg-white/[0.07]"
                      transition={springSnap}
                    />
                  )}

                  {featured ? (
                    <span className="relative -mt-5 flex h-[46px] w-[46px] items-center justify-center">
                      <span className="absolute inset-0 animate-orbit rounded-full bg-[conic-gradient(from_0deg,rgba(92,233,220,0.2),rgba(124,156,255,0.85),rgba(167,139,250,0.5),rgba(92,233,220,0.2))] opacity-80 blur-[1px]" />
                      <span className="absolute inset-[1.5px] rounded-full bg-[#0a1020]" />
                      <motion.span
                        whileHover={reduced ? undefined : { scale: 1.08 }}
                        whileTap={{ scale: 0.94 }}
                        className="relative flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[linear-gradient(145deg,#eaf0ff,#b9c8ff_50%,#7c9cff)] text-[#07101f] shadow-[0_8px_24px_-6px_rgba(124,156,255,0.9)]"
                      >
                        <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} aria-hidden="true" />
                      </motion.span>
                    </span>
                  ) : (
                    <span className="relative flex h-6 w-9 items-center justify-center">
                      <Icon
                        className={cn(
                          'h-[17px] w-[17px] transition-transform duration-300 group-hover:-translate-y-0.5',
                          active && 'drop-shadow-[0_0_8px_rgba(124,156,255,0.7)]',
                        )}
                        strokeWidth={active ? 2.2 : 1.7}
                        aria-hidden="true"
                      />
                      {href === '/mensajes' && unreadMessages > 0 && (
                        <span className="absolute -right-0.5 -top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-accent px-1 font-mono text-[8px] font-bold text-[#04110f] shadow-[0_0_10px_rgba(92,233,220,0.8)]">
                          {unreadMessages}
                        </span>
                      )}
                    </span>
                  )}

                  <span className={cn('relative z-10', featured && 'mt-0.5 text-text')}>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </motion.nav>
    </div>
  );
}
