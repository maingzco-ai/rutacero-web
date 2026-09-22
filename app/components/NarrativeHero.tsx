'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Handshake, Route, ShieldCheck, Sprout } from 'lucide-react';
import { Inter, Playfair_Display } from 'next/font/google';

// Serif elegante para títulos, Sans limpia (Inter) para cuerpo.
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});
const inter = Inter({ subsets: ['latin'] });

type NarrativeHeroProps = {
  onVerDemo: () => void;
};

const VALORES = [
  {
    icon: ShieldCheck,
    titulo: 'Privacidad Primero',
    descripcion:
      'Tus datos nunca se venden. Validamos identidad institucional (@icesi, @javeriana) sin exponer información sensible. Solo estudiantes reales acceden.',
  },
  {
    icon: Sprout,
    titulo: 'Impacto Real',
    descripcion:
      'Cada viaje compartido mitiga 1.5kg de CO₂ en el corredor Cañasgordas. Hemos ahorrado 2.300 horas de trancón este semestre.',
  },
  {
    icon: Handshake,
    titulo: 'Comunidad Verificada',
    descripcion:
      'Sistema de reputación bilateral + PIN único por viaje. Cero spam, cero desconocidos. Tu conductor sabe quién sube antes de llegar.',
  },
];

export default function NarrativeHero({ onVerDemo }: NarrativeHeroProps) {
  return (
    <section
      className={`${inter.className} flex min-h-screen flex-col items-center justify-center bg-[#FAF9F6] px-6 py-24 text-center text-[#2C2C2C] dark:bg-slate-900 dark:text-slate-100`}
    >
      <motion.span
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 shadow-sm dark:bg-slate-800"
      >
        <Route className="h-3.5 w-3.5" />
        Carpooling universitario · Cali
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`${playfair.className} mt-10 max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl`}
      >
        Movilidad Universitaria
        <br />
        con <span className="text-emerald-500">Propósito</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#2C2C2C]/70 dark:text-slate-300"
      >
        RutaCero nace porque creemos que compartir carro no debería costarte tu
        seguridad ni tus datos.
      </motion.p>

      {/* Tarjetas de valor */}
      <div className="mt-16 grid w-full max-w-5xl gap-6 sm:grid-cols-3">
        {VALORES.map(({ icon: Icon, titulo, descripcion }, i) => (
          <motion.div
            key={titulo}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3 + i * 0.12 }}
            className="rounded-2xl bg-white p-6 text-left shadow-sm ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-md dark:bg-slate-800 dark:ring-white/10"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <h2 className={`${playfair.className} mt-4 text-lg font-semibold`}>
              {titulo}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#2C2C2C]/65 dark:text-slate-300">
              {descripcion}
            </p>
          </motion.div>
        ))}
      </div>

      {/* CTA principal → scroll suave al dashboard */}
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        type="button"
        onClick={onVerDemo}
        className="group mt-16 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 active:translate-y-0"
      >
        Ver Demo en Vivo
        <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
      </motion.button>
    </section>
  );
}