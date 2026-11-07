'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { generatePin } from './design-system';
import { trips as catalogTrips, addPublishedToCatalog } from './catalog';
import type {
  AppNotification,
  Conversation,
  LedgerEntry,
  PaymentMethod,
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

/** Valida que una cadena no contenga caracteres peligrosos para inyección. */
function isSafeString(value: string): boolean {
  return /^[a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\s,.\-()#/]*$/.test(value);
}

/** Sanitiza un objeto leído de localStorage para evitar inyección de claves maliciosas. */
function sanitizePersisted(raw: unknown): Persisted | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const obj = raw as Record<string, unknown>;
  const isArray = (v: unknown): v is unknown[] => Array.isArray(v);
  const isString = (v: unknown): v is string => typeof v === 'string';
  const isNumber = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
  const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

  // Safe array filter with type guard
  const safeArray = (arr: unknown[], itemGuard: (v: unknown) => v is Record<string, unknown>): Record<string, unknown>[] =>
    (arr ?? []).filter(itemGuard);

  return {
    reservations: isArray(obj.reservations) ? safeArray(obj.reservations, isObject) as Reservation[] : [],
    published: isArray(obj.published) ? safeArray(obj.published, isObject) as PublishedRoute[] : [],
    conversations: isArray(obj.conversations) ? safeArray(obj.conversations, isObject) as Conversation[] : [],
    notifications: isArray(obj.notifications) ? safeArray(obj.notifications, isObject) as AppNotification[] : [],
    ledger: isArray(obj.ledger) ? safeArray(obj.ledger, isObject) as LedgerEntry[] : [],
    balance: isNumber(obj.balance) ? obj.balance : 0,
    preferredPayment: isString(obj.preferredPayment) ? obj.preferredPayment : '',
  } as Persisted;
}

/** Métodos de pago del usuario. Inicia vacío: sin datos de demostración. */
export const paymentMethods: PaymentMethod[] = [];

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [published, setPublished] = useState<PublishedRoute[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [balance, setBalance] = useState(0);
  const [preferredPayment, setPreferredPayment] = useState(paymentMethods[0]?.id ?? '');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const safe = sanitizePersisted(parsed);
        if (safe) {
          setReservations(safe.reservations as Reservation[]);
          setPublished(safe.published as PublishedRoute[]);
          setConversations(safe.conversations as Conversation[]);
          setNotifications(safe.notifications as AppNotification[]);
          setLedger(safe.ledger as LedgerEntry[]);
          setBalance(safe.balance);
          setPreferredPayment(safe.preferredPayment);
        }
      }
    } catch {
      /* keep empty initial state */
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
      if (!isSafeString(tripId) || !isSafeString(pickup) || !isSafeString(preference)) {
        return null;
      }
      // Check for existing confirmed reservation on same trip
      const existing = reservations.find(r => r.tripId === tripId && r.status === 'confirmada');
      if (existing) return null;

      const trip = catalogTrips.find((item) => item.id === tripId);
      if (!trip || trip.seatsTaken >= trip.seats) return null;

      // Generate unique ID with crypto.randomUUID fallback
      const reservationId = typeof crypto !== 'undefined' && crypto.randomUUID
        ? `res-${crypto.randomUUID()}`
        : `res-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const ledgerId = typeof crypto !== 'undefined' && crypto.randomUUID
        ? `l-${crypto.randomUUID()}`
        : `l-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const notifId = typeof crypto !== 'undefined' && crypto.randomUUID
        ? `n-${crypto.randomUUID()}`
        : `n-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

      const reservation: Reservation = {
        id: reservationId,
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
          id: ledgerId,
          label: `Cupo · ${trip.origin} → ${trip.destination}`,
          amount: -trip.price,
          at: nowLabel(),
          type: 'cargo',
        },
        ...prev,
      ]);
      setNotifications((prev) => [
        {
          id: notifId,
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
    [reservations],
  );

  const publishRoute = useCallback((route: Omit<PublishedRoute, 'id' | 'createdAt'>): PublishedRoute => {
    const safeString = (value: string): boolean => {
      // Allow common Spanish chars, punctuation, spaces, and basic symbols
      return /^[a-zA-Z0-9áéíóúñÁÉÍÓÚÑüÜ\s,.\-()#/:°º'&]+$/.test(value);
    };

    if (
      !safeString(route.origin) ||
      !safeString(route.destination) ||
      !safeString(route.plate) ||
      !safeString(route.vehicle) ||
      !safeString(route.departure || '') ||
      !Number.isInteger(route.seats) ||
      route.seats < 1 ||
      route.seats > 8
    ) {
      throw new Error('Datos de ruta inválidos');
    }
    const publishedId = typeof crypto !== 'undefined' && crypto.randomUUID
      ? `pub-${crypto.randomUUID()}`
      : `pub-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const notifId = typeof crypto !== 'undefined' && crypto.randomUUID
      ? `n-${crypto.randomUUID()}`
      : `n-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    const created: PublishedRoute = {
      ...route,
      id: publishedId,
      createdAt: nowLabel(),
    };
    setPublished((prev) => [created, ...prev]);
    // Add to searchable catalog
    addPublishedToCatalog(created);
    setNotifications((prev) => [
      {
        id: notifId,
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
    if (!isSafeString(conversationId)) return;
    const trimmed = text.trim();
    if (!trimmed || !isSafeString(trimmed)) return;
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

