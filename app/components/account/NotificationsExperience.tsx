'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { useAppState } from '@/app/lib/AppState';
import { cn } from '@/app/lib/design-system';

/** Escapa HTML para prevenir XSS al renderizar contenido de notificaciones. */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default function NotificationsExperience() {
  const { notifications, markNotificationsRead } = useAppState();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const timer = setTimeout(() => markNotificationsRead(), 800);
    return () => clearTimeout(timer);
  }, [markNotificationsRead]);

  return (
    <div className="mx-auto max-w-lg px-4 py-4">
      <h1 className="text-2xl font-semibold tracking-tight text-text">Notificaciones</h1>
      <div className="mt-4 space-y-2">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-text-secondary">No tienes notificaciones.</p>
            <p className="mt-2 text-xs text-text-secondary">Las alertas de tus viajes aparecerán aquí.</p>
          </div>
        ) : (
          notifications.map((item) => {
            const content = (
              <Card padding="md" className={cn(!item.read && 'border-primary/20')} key={item.id}>
                <p className="font-semibold text-text">{escapeHtml(item.title)}</p>
                <p className="mt-1 text-sm text-text-secondary dark:text-text-secondary">
                  {escapeHtml(item.body)}
                </p>
                <p className="mt-2 text-xs text-text-secondary">{item.at}</p>
              </Card>
            );
            return item.href ? (
              <Link key={item.id} href={item.href} className="block">
                {content}
              </Link>
            ) : (
              <div key={item.id}>{content}</div>
            );
          })
        )}
      </div>
    </div>
  );
}
