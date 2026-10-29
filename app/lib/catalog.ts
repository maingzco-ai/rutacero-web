import type {
  AppNotification,
  Conversation,
  LedgerEntry,
  PaymentMethod,
  Profile,
  Trip,
} from './types';

export const CURRENT_LOCATION = 'Ciudad Jardín';

export const FREQUENT_DESTINATIONS = [
  'Universidad Icesi',
  'Pontificia Universidad Javeriana Cali',
  'Universidad Autónoma de Occidente (UAO)',
  'Unicentro Cali',
  'Jardín Plaza',
] as const;

export const profile: Profile = {
  name: 'Camila Restrepo',
  email: 'camila.restrepo@icesi.edu.co',
  phone: '3158472910',
  career: 'Ingeniería Industrial',
  university: 'Universidad Icesi',
  trips: 12,
  rating: 4.9,
  memberSince: 'Marzo 2025',
};

export const trips: Trip[] = [
  {
    id: 'rc-icesi-am',
    origin: 'Unicentro Cali',
    destination: 'Universidad Icesi',
    driver: {
      id: 'd-andres',
      name: 'Andrés Molina',
      rating: 4.94,
      trips: 86,
      vehicle: 'Mazda 2 blanco',
      plate: 'KFT-284',
      university: 'Universidad Icesi',
    },
    seats: 3,
    seatsTaken: 1,
    price: 4500,
    departure: '06:50',
    arrival: '07:15',
    dateLabel: 'Hoy',
    corridor: 'Cali Sur',
    notes: 'Salida puntual. Mochilas en el maletero.',
    status: 'disponible',
  },
  {
    id: 'rc-jav-am',
    origin: 'Holguines Trade Center',
    destination: 'Pontificia Universidad Javeriana Cali',
    driver: {
      id: 'd-laura',
      name: 'Laura Cárdenas',
      rating: 4.98,
      trips: 121,
      vehicle: 'Kia Picanto gris',
      plate: 'HPL-519',
      university: 'Javeriana Cali',
    },
    seats: 2,
    seatsTaken: 0,
    price: 5000,
    departure: '07:05',
    arrival: '07:22',
    dateLabel: 'Hoy',
    corridor: 'Cañasgordas',
    status: 'disponible',
  },
  {
    id: 'rc-uao-am',
    origin: 'Ciudad Jardín',
    destination: 'Universidad Autónoma de Occidente (UAO)',
    driver: {
      id: 'd-diego',
      name: 'Diego Vargas',
      rating: 4.87,
      trips: 54,
      vehicle: 'Chevrolet Onix negro',
      plate: 'SWQ-073',
      university: 'UAO',
    },
    seats: 3,
    seatsTaken: 2,
    price: 4500,
    departure: '06:40',
    arrival: '07:05',
    dateLabel: 'Hoy',
    corridor: 'Cali Sur',
    status: 'disponible',
  },
  {
    id: 'rc-univalle',
    origin: 'Jardín Plaza',
    destination: 'Universidad del Valle (Meléndez)',
    driver: {
      id: 'd-sofia',
      name: 'Sofía Herrera',
      rating: 4.91,
      trips: 67,
      vehicle: 'Renault Logan azul',
      plate: 'TBN-441',
      university: 'Univalle',
    },
    seats: 3,
    seatsTaken: 1,
    price: 4500,
    departure: '12:10',
    arrival: '12:35',
    dateLabel: 'Hoy',
    corridor: 'Meléndez',
    status: 'disponible',
  },
  {
    id: 'rc-pance-pm',
    origin: 'Universidad Icesi',
    destination: 'Unicentro Cali',
    driver: {
      id: 'd-andres',
      name: 'Andrés Molina',
      rating: 4.94,
      trips: 86,
      vehicle: 'Mazda 2 blanco',
      plate: 'KFT-284',
      university: 'Universidad Icesi',
    },
    seats: 3,
    seatsTaken: 0,
    price: 4500,
    departure: '17:20',
    arrival: '17:45',
    dateLabel: 'Hoy',
    corridor: 'Cali Sur',
    notes: 'Regreso al norte. Aire acondicionado.',
    status: 'disponible',
  },
  {
    id: 'rc-centro',
    origin: 'San Antonio',
    destination: 'Universidad Icesi',
    driver: {
      id: 'd-camilo',
      name: 'Camilo Ríos',
      rating: 4.82,
      trips: 33,
      vehicle: 'Toyota Yaris plateado',
      plate: 'VLM-902',
      university: 'Universidad Icesi',
    },
    seats: 2,
    seatsTaken: 2,
    price: 5000,
    departure: '06:20',
    arrival: '07:00',
    dateLabel: 'Hoy',
    corridor: 'Centro → Sur',
    status: 'lleno',
  },
];

export const recentSearches = [
  { origin: 'Unicentro Cali', destination: 'Universidad Icesi' },
  { origin: 'Holguines Trade Center', destination: 'Pontificia Universidad Javeriana Cali' },
  { origin: 'Ciudad Jardín', destination: 'Universidad Autónoma de Occidente (UAO)' },
];

export const paymentMethods: PaymentMethod[] = [
  { id: 'nequi', label: 'Nequi', detail: '**** 2910', type: 'nequi' },
  { id: 'daviplata', label: 'Daviplata', detail: '**** 8472', type: 'daviplata' },
];

export const ledger: LedgerEntry[] = [
  { id: 'l1', label: 'Cupo · Unicentro → Icesi', amount: -4500, at: 'Ayer, 07:12', type: 'cargo' },
  { id: 'l2', label: 'Cupo · Holguines → Javeriana', amount: -5000, at: 'Lun, 07:18', type: 'cargo' },
  { id: 'l3', label: 'Ajuste de tarifa justa', amount: 500, at: 'Lun, 18:02', type: 'abono' },
];

export const seedConversations: Conversation[] = [
  {
    id: 'c-andres',
    tripId: 'rc-icesi-am',
    peerName: 'Andrés Molina',
    peerRole: 'conductor',
    lastMessage: 'Te recojo en la torre norte de Unicentro.',
    lastAt: '07:02',
    unread: 1,
    messages: [
      { id: 'm1', from: 'peer', text: 'Buenos días, Camila. Confirma el PIN al subir.', at: '06:41' },
      { id: 'm2', from: 'yo', text: 'Listo. Estaré en la torre norte.', at: '06:44' },
      { id: 'm3', from: 'peer', text: 'Te recojo en la torre norte de Unicentro.', at: '07:02' },
    ],
  },
  {
    id: 'c-laura',
    tripId: 'rc-jav-am',
    peerName: 'Laura Cárdenas',
    peerRole: 'conductor',
    lastMessage: 'Mañana salgo a las 7:05.',
    lastAt: 'Ayer',
    unread: 0,
    messages: [
      { id: 'm4', from: 'peer', text: 'Mañana salgo a las 7:05.', at: 'Ayer' },
      { id: 'm5', from: 'yo', text: 'Perfecto, gracias Laura.', at: 'Ayer' },
    ],
  },
];

export const seedNotifications: AppNotification[] = [
  {
    id: 'n1',
    title: 'Cupo confirmado',
    body: 'Andrés sale a las 06:50 desde Unicentro. Lleva tu PIN al abordar.',
    at: 'Hace 12 min',
    read: false,
    href: '/historial',
  },
  {
    id: 'n2',
    title: 'Ruta de la tarde',
    body: 'Hay 3 cupos Icesi → Unicentro a las 17:20.',
    at: 'Hace 1 h',
    read: false,
    href: '/buscar?origen=Universidad%20Icesi&destino=Unicentro%20Cali',
  },
  {
    id: 'n3',
    title: 'Pago registrado',
    body: 'Se debitaron $4.500 COP por el viaje de ayer.',
    at: 'Ayer',
    read: true,
    href: '/pagos',
  },
];

export function matchTrips(origin: string, destination: string): Trip[] {
  const o = origin.trim().toLowerCase();
  const d = destination.trim().toLowerCase();
  return trips.filter((trip) => {
    const originHit = !o || trip.origin.toLowerCase().includes(o) || o.includes(trip.origin.toLowerCase().slice(0, 8));
    const destHit =
      !d || trip.destination.toLowerCase().includes(d) || d.includes(trip.destination.toLowerCase().slice(0, 8));
    return originHit && destHit;
  });
}

export function getTrip(id: string): Trip | undefined {
  return trips.find((trip) => trip.id === id);
}
