'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { generatePin } from './design-system';
import {
  ledger as seedLedger,
  paymentMethods,
  profile,
  seedConversations,
  seedNotifications,
  trips as catalogTrips,
} from './catalog';
import type {
  AppNotification,
  Conversation,
  LedgerEntry,
  PublishedRoute,
  Reservation,
} from './types';

type AppState = {
  reservations: Reservation[];
  published: PublishedRoute[];
  conversations: Conversation[];
  notifications: AppNotification[];
  ledger: LedgerEntry[];
  balance: number;
  preferredPayment: string;
  reserveSeat: (tripId: string, pickup: string, preference: string) => Reservation | null;
  publishRoute: (route: Omit<PublishedRoute, 'id' | 'createdAt'>) => PublishedRoute;
  sendMessage: (conversationId: string, text: string) => void;
  markNotificationsRead: () => void;
  setPreferredPayment: (id: string) => void;
  unreadMessages: number;
  unreadNotifications: number;
};

const AppStateContext = createContext<AppState | null>(null);
const STORAGE_KEY = 'rutacero-session';

type Persisted = {
  reservations: Reservation[];
  published: PublishedRoute[];
  conversations: Conversation[];
  notifications: AppNotification[];
  ledger: LedgerEntry[];
  balance: number;
  preferredPayment: string;
};

function nowLabel() {
  return new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [published, setPublished] = useState<PublishedRoute[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>(seedConversations);
  const [notifications, setNotifications] = useState<AppNotification[]>(seedNotifications);
  const [ledger, setLedger] = useState<LedgerEntry[]>(seedLedger);
  const [balance, setBalance] = useState(18500);
  const [preferredPayment, setPreferredPayment] = useState(paymentMethods[0].id);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Persisted;
        setReservations(parsed.reservations ?? []);
        setPublished(parsed.published ?? []);
        setConversations(parsed.conversations?.length ? parsed.conversations : seedConversations);
        setNotifications(parsed.notifications?.length ? parsed.notifications : seedNotifications);
        setLedger(parsed.ledger?.length ? parsed.ledger : seedLedger);
        setBalance(typeof parsed.balance === 'number' ? parsed.balance : 18500);
        setPreferredPayment(parsed.preferredPayment ?? paymentMethods[0].id);
      }
    } catch {
      /* keep seeds */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const payload: Persisted = {
      reservations,
      published,
      conversations,
      notifications,
      ledger,
      balance,
      preferredPayment,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [hydrated, reservations, published, conversations, notifications, ledger, balance, preferredPayment]);

  const reserveSeat = useCallback(
    (tripId: string, pickup: string, preference: string): Reservation | null => {
      const trip = catalogTrips.find((item) => item.id === tripId);
      if (!trip || trip.seatsTaken >= trip.seats) return null;
      const reservation: Reservation = {
        id: `res-${Date.now()}`,
        tripId,
        pin: generatePin(),
        pickup,
        preference,
        createdAt: nowLabel(),
        status: 'confirmada',
      };
      setReservations((prev) => [reservation, ...prev]);
      setBalance((prev) => prev - trip.price);
      setLedger((prev) => [
        {
          id: `l-${Date.now()}`,
          label: `Cupo · ${trip.origin} → ${trip.destination}`,
          amount: -trip.price,
          at: nowLabel(),
          type: 'cargo',
        },
        ...prev,
      ]);
      setNotifications((prev) => [
        {
          id: `n-${Date.now()}`,
          title: 'Cupo reservado',
          body: `PIN ${reservation.pin}. ${trip.driver.name} sale a las ${trip.departure}.`,
          at: 'Ahora',
          read: false,
          href: '/historial',
        },
        ...prev,
      ]);
      return reservation;
    },
    [],
  );

  const publishRoute = useCallback((route: Omit<PublishedRoute, 'id' | 'createdAt'>): PublishedRoute => {
    const created: PublishedRoute = {
      ...route,
      id: `pub-${Date.now()}`,
      createdAt: nowLabel(),
    };
    setPublished((prev) => [created, ...prev]);
    setNotifications((prev) => [
      {
        id: `n-${Date.now()}`,
        title: 'Ruta publicada',
        body: `${route.origin} → ${route.destination} a las ${route.departure}.`,
        at: 'Ahora',
        read: false,
        href: '/historial',
      },
      ...prev,
    ]);
    return created;
  }, []);

  const sendMessage = useCallback((conversationId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              lastMessage: trimmed,
              lastAt: nowLabel(),
              unread: 0,
              messages: [
                ...conversation.messages,
                { id: `msg-${Date.now()}`, from: 'yo', text: trimmed, at: nowLabel() },
              ],
            }
          : conversation,
      ),
    );
  }, []);

  const markNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  }, []);

  const unreadMessages = conversations.reduce((sum, item) => sum + item.unread, 0);
  const unreadNotifications = notifications.filter((item) => !item.read).length;

  const value = useMemo<AppState>(
    () => ({
      reservations,
      published,
      conversations,
      notifications,
      ledger,
      balance,
      preferredPayment,
      reserveSeat,
      publishRoute,
      sendMessage,
      markNotificationsRead,
      setPreferredPayment,
      unreadMessages,
      unreadNotifications,
    }),
    [
      reservations,
      published,
      conversations,
      notifications,
      ledger,
      balance,
      preferredPayment,
      reserveSeat,
      publishRoute,
      sendMessage,
      markNotificationsRead,
      unreadMessages,
      unreadNotifications,
    ],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState debe usarse dentro de AppStateProvider');
  return ctx;
}

export { profile, paymentMethods };
