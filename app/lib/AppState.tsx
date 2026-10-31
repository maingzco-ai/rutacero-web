'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { generatePin } from './design-system';
import { trips as catalogTrips } from './catalog';
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

  const safe = (arr: unknown[], itemGuard: (v: unknown) => boolean): unknown[] =>
    (arr ?? []).filter(itemGuard);

  return {
    reservations: isArray(obj.reservations) ? safe(obj.reservations, isString) : [],
    published: isArray(obj.published) ? safe(obj.published, isString) : [],
    conversations: isArray(obj.conversations) ? safe(obj.conversations, isString) : [],
    notifications: isArray(obj.notifications) ? safe(obj.notifications, isString) : [],
    ledger: isArray(obj.ledger) ? safe(obj.ledger, isString) : [],
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
    if (
      !isSafeString(route.origin) ||
      !isSafeString(route.destination) ||
      !isSafeString(route.plate) ||
      !isSafeString(route.vehicle) ||
      !Number.isInteger(route.seats) ||
      route.seats < 1 ||
      route.seats > 8
    ) {
      throw new Error('Datos de ruta inválidos');
    }
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

