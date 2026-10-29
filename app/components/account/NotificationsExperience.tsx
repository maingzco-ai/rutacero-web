'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { useAppState } from '@/app/lib/AppState';
import { cn } from '@/app/lib/design-system';

export default function NotificationsExperience() {
  const { notifications, markNotificationsRead } = useAppState();

  useEffect(() => {
    const timer = setTimeout(() => markNotificationsRead(), 800);
    return () => clearTimeout(timer);
  }, [markNotificationsRead]);

  return (
    <div className="mx-auto max-w-lg px-4 py-4">
      <h1 className="text-2xl font-semibold tracking-tight">Notificaciones</h1>
      <div className="mt-4 space-y-2">
        {notifications.map((item) => {
          const content = (
            <Card padding="md" className={cn(!item.read && 'border-emerald-200')}>
              <p className="font-semibold">{item.title}</p>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{item.body}</p>
              <p className="mt-2 text-xs text-neutral-400">{item.at}</p>
            </Card>
          );
          return item.href ? (
            <Link key={item.id} href={item.href} className="block">
              {content}
            </Link>
          ) : (
            <div key={item.id}>{content}</div>
          );
        })}
      </div>
    </div>
  );
}
