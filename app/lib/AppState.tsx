'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, startTransition, type ReactNode } from 'react';
import { generatePin, formatCOP } from './design-system';
import { trips as catalogTrips, addPublishedToCatalog, syncPublishedWithCatalog } from './catalog';
import type {
  AppNotification,
  Conversation,
  LedgerEntry,
  PaymentMethod,
  PublishedRoute,
  Reservation,
  RouteRequest,
} from './types';

type AppState = {
  reservations: Reservation[];
  published: PublishedRoute[];
  routeRequests: RouteRequest[];
  conversations: Conversation[];
  notifications: AppNotification[];
  ledger: LedgerEntry[];
  balance: number;
  preferredPayment: string;
  paymentMethods: PaymentMethod[];
  reserveSeat: (tripId: string, pickup: string, preference: string, paymentMethod: 'nequi' | 'daviplata' | 'efectivo') => Reservation | null;
  publishRoute: (route: Omit<PublishedRoute, 'id' | 'createdAt'>) => PublishedRoute;
  publishRouteRequest: (request: Omit<RouteRequest, 'id' | 'createdAt' | 'status'>) => RouteRequest;
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
  routeRequests: RouteRequest[];
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

  const safeArray = (arr: unknown[], itemGuard: (v: unknown) => v is Record<string, unknown>): Record<string, unknown>[] =>
    (arr ?? []).filter(itemGuard);

  return {
    reservations: isArray(obj.reservations) ? safeArray(obj.reservations, isObject) as Reservation[] : [],
    published: isArray(obj.published) ? safeArray(obj.published, isObject) as PublishedRoute[] : [],
    routeRequests: isArray(obj.routeRequests) ? safeArray(obj.routeRequests, isObject) as RouteRequest[] : [],
    conversations: isArray(obj.conversations) ? safeArray(obj.conversations, isObject) as Conversation[] : [],
    notifications: isArray(obj.notifications) ? safeArray(obj.notifications, isObject) as AppNotification[] : [],
    ledger: isArray(obj.ledger) ? safeArray(obj.ledger, isObject) as LedgerEntry[] : [],
    balance: isNumber(obj.balance) ? obj.balance : 25000, // Saldo inicial DEMO para pruebas
    preferredPayment: isString(obj.preferredPayment) ? obj.preferredPayment : 'nequi-default',
  } as Persisted;
}

/** Métodos de pago disponibles para el usuario */
export const paymentMethods: PaymentMethod[] = [
  { id: 'nequi-default', label: 'Nequi', detail: 'Cuenta vinculada · 315 *** 4821', type: 'nequi' },
  { id: 'daviplata-default', label: 'DaviPlata', detail: 'Cuenta de ahorros · 300 *** 1928', type: 'daviplata' },
  { id: 'cash-default', label: 'Efectivo con PIN', detail: 'Pago exacto al abordar al conductor', type: 'tarjeta' },
];

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [published, setPublished] = useState<PublishedRoute[]>([]);
  const [routeRequests, setRouteRequests] = useState<RouteRequest[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv-demo-1',
      tripId: 'trip-demo-1',
      peerName: 'Carlos Mendoza',
      peerRole: 'conductor',
      lastMessage: '¡Hola! Te espero en la bahía de Ciudad Jardín.',
      lastAt: '06:30 AM',
      unread: 1,
      messages: [
        { id: 'msg-1', from: 'peer', text: '¡Hola! Te espero en la bahía de Ciudad Jardín.', at: '06:30 AM' },
      ],
    },
  ]);
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-welcome',
      title: 'Bienvenido a RutaCero Cali',
      body: 'Tu cuenta está lista para reservar cupos universitarios o publicar rutas compartidas.',
      at: 'Hoy',
      read: false,
      href: '/buscar',
    },
  ]);
  const [ledger, setLedger] = useState<LedgerEntry[]>([
    {
      id: 'l-init',
      label: 'Recarga inicial de cortesía',
      amount: 25000,
      at: 'Hoy',
      type: 'abono',
    },
  ]);
  const [balance, setBalance] = useState(25000);
  const [preferredPayment, setPreferredPayment] = useState(paymentMethods[0]?.id ?? 'nequi-default');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const safe = sanitizePersisted(parsed);
        if (safe) {
          startTransition(() => {
            setReservations(safe.reservations as Reservation[]);
            setPublished(safe.published as PublishedRoute[]);
            setRouteRequests(safe.routeRequests as RouteRequest[]);
            if (safe.conversations.length > 0) setConversations(safe.conversations as Conversation[]);
            if (safe.notifications.length > 0) setNotifications(safe.notifications as AppNotification[]);
            if (safe.ledger.length > 0) setLedger(safe.ledger as LedgerEntry[]);
            setBalance(safe.balance);
            setPreferredPayment(safe.preferredPayment || paymentMethods[0]?.id || 'nequi-default');
          });

          // Sincronizar rutas publicadas con el catálogo
          syncPublishedWithCatalog(safe.published as PublishedRoute[]);
        }
      }
    } catch {
      /* mantener estado inicial */
    }
    startTransition(() => {
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const payload: Persisted = {
      reservations,
      published,
      routeRequests,
      conversations,
      notifications,
      ledger,
      balance,
      preferredPayment,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* ignore */
    }
  }, [hydrated, reservations, published, routeRequests, conversations, notifications, ledger, balance, preferredPayment]);

  const reserveSeat = useCallback(
    (tripId: string, pickup: string, preference: string, paymentMethod: 'nequi' | 'daviplata' | 'efectivo'): Reservation | null => {
      if (!isSafeString(tripId) || !isSafeString(pickup) || !isSafeString(preference)) {
        return null;
      }
      // Verificar si ya existe una reserva activa para este viaje
      const existing = reservations.find((r) => r.tripId === tripId && r.status === 'confirmada');
      if (existing) return existing;

      const trip = catalogTrips.find((item) => item.id === tripId);
      if (!trip || trip.seatsTaken >= trip.seats) return null;

      // Actualizar ocupación en el catálogo
      trip.seatsTaken = Math.min(trip.seats, trip.seatsTaken + 1);

      // Calcular comisión: 12% para pagos digitales, 0% para efectivo
      const isDigital = paymentMethod === 'nequi' || paymentMethod === 'daviplata';
      const commission = isDigital ? Math.round(trip.price * 0.12) : 0;
      const driverNet = trip.price - commission;

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
        paymentMethod,
        commission,
        driverNet,
        createdAt: nowLabel(),
        status: 'confirmada',
      };

      setReservations((prev) => [reservation, ...prev]);

      // Pasajero paga el precio completo
      setBalance((prev) => prev - trip.price);
      setLedger((prev) => [
        {
          id: ledgerId,
          label: `Cupo reservado · ${trip.origin} → ${trip.destination} (${paymentMethod === 'efectivo' ? 'Efectivo' : paymentMethod})`,
          amount: -trip.price,
          at: nowLabel(),
          type: 'cargo',
        },
        ...prev,
      ]);

      // Notificación al pasajero
      const paymentInfo = paymentMethod === 'efectivo'
        ? `Pago en efectivo al conductor. PIN ${reservation.pin}.`
        : `Pagado por ${paymentMethod}. Comisión 12% (${formatCOP(commission)}). Conductor recibe ${formatCOP(driverNet)}. PIN ${reservation.pin}.`;

      setNotifications((prev) => [
        {
          id: notifId,
          title: 'Cupo confirmado [PIN de abordaje]',
          body: `${trip.driver.name} te espera a las ${trip.departure}. ${paymentInfo}`,
          at: 'Ahora',
          read: false,
          href: '/historial',
        },
        ...prev,
      ]);

      // Crear o actualizar conversación con el conductor
      setConversations((prev) => {
        const existingConv = prev.find((c) => c.tripId === trip.id);
        if (existingConv) return prev;
        return [
          {
            id: `conv-${trip.id}`,
            tripId: trip.id,
            peerName: trip.driver.name,
            peerRole: 'conductor',
            lastMessage: `¡Hola! Reserva confirmada con PIN ${reservation.pin}. Pago: ${paymentMethod === 'efectivo' ? 'Efectivo' : paymentMethod}.`,
            lastAt: nowLabel(),
            unread: 0,
            messages: [
              {
                id: `msg-${Date.now()}`,
                from: 'yo',
                text: `¡Hola! He reservado un cupo con punto de recogida en ${pickup}. Mi PIN es ${reservation.pin}. Pago por ${paymentMethod === 'efectivo' ? 'efectivo' : paymentMethod}.`,
                at: nowLabel(),
              },
            ],
          },
          ...prev,
        ];
      });

      return reservation;
    },
    [reservations],
  );

  const publishRoute = useCallback((route: Omit<PublishedRoute, 'id' | 'createdAt'>): PublishedRoute => {
    const safeString = (value: string): boolean => {
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
    // Agregar inmediatamente al catálogo disponible
    addPublishedToCatalog(created);

    setNotifications((prev) => [
      {
        id: notifId,
        title: 'Ruta publicada exitosamente',
        body: `${route.origin} → ${route.destination} a las ${route.departure}. Cupos disponibles: ${route.seats}.`,
        at: 'Ahora',
        read: false,
        href: '/historial',
      },
      ...prev,
    ]);

    return created;
  }, []);

  const publishRouteRequest = useCallback(
    (request: Omit<RouteRequest, 'id' | 'createdAt' | 'status'>): RouteRequest => {
      const safeString = (value: string): boolean => {
        return /^[a-zA-Z0-9áéíóúñÁÉÍÓÚÑüÜ\s,.\-()#/:°º'&]+$/.test(value);
      };

      if (
        !safeString(request.origin) ||
        !safeString(request.destination) ||
        !safeString(request.departure || '')
      ) {
        throw new Error('Datos de solicitud inválidos');
      }

      // Validar que la salida sea en más de 4 horas
      const now = new Date();
      const [hours, minutes] = request.departure.split(':').map(Number);
      const departureDate = new Date();
      departureDate.setHours(hours, minutes, 0, 0);

      // Si la hora ya pasó hoy, asumimos que es para mañana
      if (departureDate <= now) {
        departureDate.setDate(departureDate.getDate() + 1);
      }

      const diffHours = (departureDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      if (diffHours < 4) {
        throw new Error('La solicitud debe hacerse con al menos 4 horas de antelación');
      }

      const requestId = typeof crypto !== 'undefined' && crypto.randomUUID
        ? `req-${crypto.randomUUID()}`
        : `req-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const notifId = typeof crypto !== 'undefined' && crypto.randomUUID
        ? `n-${crypto.randomUUID()}`
        : `n-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

      const created: RouteRequest = {
        ...request,
        id: requestId,
        createdAt: nowLabel(),
        status: 'pending',
      };

      setRouteRequests((prev) => [created, ...prev]);

      setNotifications((prev) => [
        {
          id: notifId,
          title: 'Solicitud de ruta publicada',
          body: `${request.origin} → ${request.destination} a las ${request.departure}. Conductores verán tu solicitud.`,
          at: 'Ahora',
          read: false,
          href: '/historial',
        },
        ...prev,
      ]);

      return created;
    },
    [],
  );

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
      routeRequests,
      conversations,
      notifications,
      ledger,
      balance,
      preferredPayment,
      paymentMethods,
      reserveSeat,
      publishRoute,
      publishRouteRequest,
      sendMessage,
      markNotificationsRead,
      setPreferredPayment,
      unreadMessages,
      unreadNotifications,
    }),
    [
      reservations,
      published,
      routeRequests,
      conversations,
      notifications,
      ledger,
      balance,
      preferredPayment,
      paymentMethods,
      reserveSeat,
      publishRoute,
      publishRouteRequest,
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
