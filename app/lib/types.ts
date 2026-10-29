export type TripStatus = 'disponible' | 'lleno' | 'en_curso' | 'completado';

export type Driver = {
  id: string;
  name: string;
  rating: number;
  trips: number;
  vehicle: string;
  plate: string;
  university: string;
};

export type Trip = {
  id: string;
  origin: string;
  destination: string;
  driver: Driver;
  seats: number;
  seatsTaken: number;
  price: number;
  departure: string;
  arrival: string;
  dateLabel: string;
  corridor: string;
  notes?: string;
  status: TripStatus;
};

export type Reservation = {
  id: string;
  tripId: string;
  pin: string;
  pickup: string;
  preference: string;
  createdAt: string;
  status: 'confirmada' | 'completada' | 'cancelada';
};

export type PublishedRoute = {
  id: string;
  origin: string;
  destination: string;
  plate: string;
  vehicle: string;
  seats: number;
  price: number;
  departure: string;
  createdAt: string;
};

export type Conversation = {
  id: string;
  tripId: string;
  peerName: string;
  peerRole: 'conductor' | 'pasajero';
  lastMessage: string;
  lastAt: string;
  unread: number;
  messages: Message[];
};

export type Message = {
  id: string;
  from: 'yo' | 'peer';
  text: string;
  at: string;
};

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  at: string;
  read: boolean;
  href?: string;
};

export type PaymentMethod = {
  id: string;
  label: string;
  detail: string;
  type: 'nequi' | 'daviplata' | 'tarjeta';
};

export type LedgerEntry = {
  id: string;
  label: string;
  amount: number;
  at: string;
  type: 'cargo' | 'abono';
};

export type Profile = {
  name: string;
  email: string;
  phone: string;
  career: string;
  university: string;
  trips: number;
  rating: number;
  memberSince: string;
};
