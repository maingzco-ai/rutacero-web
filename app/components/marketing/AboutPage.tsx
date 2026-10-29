'use client';

import Link from 'next/link';
import { ArrowRight, Check, Leaf, Lock, Route, ShieldCheck, Users } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { brand } from '@/app/lib/brand';

const VALUES = [
  {
    icon: ShieldCheck,
    title: 'Confianza primero',
    description: 'Cupos entre personas con correo institucional. PIN único por abordaje y reputación en cada viaje.',
  },
  {
    icon: Leaf,
    title: 'Menos autos, mismo destino',
    description: 'Pensado para el corredor sur de Cali: universidades, centros comerciales y barrios de Cañasgordas.',
  },
  {
    icon: Users,
    title: 'Tarifa justa',
    description: 'El costo se reparte entre quienes viajan. Sin recargos opacos ni subasta de precios.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-dvh bg-white text-neutral-900 dark:bg-neutral-950 dark:text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white">
            <Route className="h-4 w-4" />
          </span>
          {brand.name}
        </Link>
        <Link href="/">
          <Button variant="success" size="sm">
            Abrir la app
          </Button>
        </Link>
      </header>

      <section className="px-4 pb-16 pt-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">{brand.tagline}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">
            Comparte el camino.
            <span className="text-emerald-600"> Llega con confianza.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-neutral-600 dark:text-neutral-300">
            RutaCero es carpooling para Cali. No es un taxi por app: es un asiento en un auto que ya va a tu universidad o a tu casa.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/">
              <Button variant="success" size="lg">
                Buscar un viaje
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/publicar">
              <Button variant="secondary" size="lg">
                Publicar una ruta
              </Button>
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-neutral-500">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-4 w-4" /> Correo institucional
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" /> PIN por viaje
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Leaf className="h-4 w-4 text-emerald-600" /> Corredor Cali Sur
            </span>
          </div>
        </div>
      </section>

      <section className="bg-[#F6F7F8] px-4 py-16 dark:bg-neutral-900">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {VALUES.map(({ icon: Icon, title, description }) => (
            <Card key={title} padding="lg">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-xl font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2">
          <Card padding="lg">
            <h2 className="text-2xl font-semibold">Pedir cupo</h2>
            <p className="mt-2 text-3xl font-semibold text-emerald-700">$4.500 – $5.000</p>
            <p className="text-sm text-neutral-500">COP por trayecto típico en Cali Sur</p>
            <ul className="mt-5 space-y-2 text-sm">
              {['Elige origen y destino', 'Reserva el asiento', 'Aborda con PIN'].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" /> {item}
                </li>
              ))}
            </ul>
          </Card>
          <Card padding="lg">
            <h2 className="text-2xl font-semibold">Ofrecer cupo</h2>
            <p className="mt-2 text-3xl font-semibold">Comparte costos</p>
            <p className="text-sm text-neutral-500">La tarifa se reparte entre los asientos ocupados</p>
            <ul className="mt-5 space-y-2 text-sm">
              {['Publica tu hora y ruta', 'Acepta pasajeros verificados', 'Viaja con el auto más lleno y más justo'].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" /> {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      <footer className="border-t border-neutral-200 px-4 py-10 text-center text-sm text-neutral-500 dark:border-neutral-800">
        <p>
          {brand.name} · {brand.tagline}. Preguntas:{' '}
          <a className="text-emerald-700 hover:underline" href={`mailto:${brand.email}`}>
            {brand.email}
          </a>
        </p>
      </footer>
    </div>
  );
}
