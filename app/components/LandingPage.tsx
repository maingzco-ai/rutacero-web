'use client';

import { motion } from 'framer-motion';
import {
  ArrowDown,
  Backpack,
  Building2,
  Car,
  Check,
  GraduationCap,
  Handshake,
  Leaf,
  ShieldCheck,
  Sprout,
  Target,
  Users,
} from 'lucide-react';
import { Playfair_Display } from 'next/font/google';

// Serif editorial (Playfair) para los títulos; el cuerpo hereda la sans del layout (Geist).
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

/**
 * Patrón de entrada compartido por todas las bloques: fade + desplazamiento
 * vertical de 20px al entrar en el viewport, se reproduce una sola vez.
 * `delay` permite escalonar hijos (stagger) sin repetir la animación.
 */
const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: 'easeOut' as const, delay },
});

/** Scroll suave hacia la demo funcional (`#app-dashboard` vive en page.tsx). */
const irAlDemo = () =>
  document
    .getElementById('app-dashboard')
    ?.scrollIntoView({ behavior: 'smooth' });

// ---- Contenido de la narrativa -------------------------------------------

const PROPOSITO = [
  {
    icon: ShieldCheck,
    titulo: 'Privacidad Primero',
    descripcion:
      'Tus datos nunca se venden. Validamos identidad institucional (@icesi, @javeriana) sin exponer información sensible. Solo estudiantes reales acceden.',
  },
  {
    icon: Leaf,
    titulo: 'Impacto Real',
    descripcion:
      'Cada viaje compartido mitiga 1.5kg de CO₂ en el corredor Cañasgordas. Hemos ahorrado 2.300 horas de trancón este semestre.',
  },
  {
    icon: Users,
    titulo: 'Comunidad Verificada',
    descripcion:
      'Sistema de reputación bilateral + PIN único por viaje. Cero spam, cero desconocidos. Tu conductor sabe quién sube antes de llegar.',
  },
];

const PILARES = [
  {
    icon: Target,
    titulo: 'Propósito',
    descripcion: 'Movilidad universitaria accesible y segura.',
  },
  {
    icon: Handshake,
    titulo: 'Personas',
    descripcion: 'Generamos valor para estudiantes y conductores.',
  },
  {
    icon: Building2,
    titulo: 'Comunidad',
    descripcion: 'Construimos soluciones junto a quienes usan el servicio.',
  },
  {
    icon: Sprout,
    titulo: 'Planeta',
    descripcion: 'Promovemos una movilidad compartida y sostenible.',
  },
];

const PLANES = [
  {
    icon: Backpack,
    titulo: 'Pedir Cupo',
    precio: '$4.500',
    unidad: 'COP / viaje',
    beneficios: [
      'Llega en minutos',
      'Precio de estudiante',
      'Conductor verificado',
    ],
    cta: 'Solicitar viaje',
    // El plan de pasajero es el camino principal: botón sólido.
    destacado: true,
  },
  {
    icon: Car,
    titulo: 'Ofrecer Cupo',
    precio: 'Gana $15.000',
    unidad: 'base por ruta',
    beneficios: [
      'Horarios flexibles',
      'Remuneración justa',
      'Ayuda al planeta',
    ],
    cta: 'Publicar ruta',
    destacado: false,
  },
];

const METRICAS = [
  { valor: '1.2k+', etiqueta: 'Estudiantes movilizados' },
  { valor: '85+', etiqueta: 'Conductores activos' },
  { valor: '-30%', etiqueta: 'CO₂ estimado evitado' },
  { valor: '25m', etiqueta: 'Tiempo promedio de viaje' },
];

// ---- Sub-componentes de apoyo ---------------------------------------------

/** Encabezado de sección: antetítulo en emerald + título serif + bajada. */
function SectionHeading({
  eyebrow,
  titulo,
  descripcion,
}: {
  eyebrow: string;
  titulo: string;
  descripcion?: string;
}) {
  return (
    <motion.div {...reveal()} className="mx-auto max-w-3xl text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
        {eyebrow}
      </p>
      <h2
        className={`${playfair.className} mt-4 text-3xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-4xl`}
      >
        {titulo}
      </h2>
      {descripcion && (
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-stone-600">
          {descripcion}
        </p>
      )}
    </motion.div>
  );
}

/** Contenedor con ancho de lectura cómodo y padding vertical generoso. */
function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`px-6 py-20 sm:py-28 ${className ?? ''}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

// ---- Componente principal -------------------------------------------------

export default function LandingPage() {
  /** CTA secundario: baja a la sección de propósito sin cambiar de vista. */
  const irAProposito = () =>
    document
      .getElementById('proposito')
      ?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="bg-stone-50 font-sans text-stone-900">
      {/* ================= 1. Hero ================= */}
      <section className="bg-stone-50 px-6 py-24 sm:py-32">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <motion.span
            {...reveal()}
            className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-1.5 text-xs font-medium text-stone-600 shadow-sm"
          >
            <GraduationCap className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            Prototipo Académico · Cali, Colombia
          </motion.span>

          <motion.h1
            {...reveal(0.1)}
            className={`${playfair.className} mt-8 text-5xl font-semibold leading-tight tracking-tight text-stone-900 md:text-6xl`}
          >
            Movilidad Universitaria
            <br />
            con <span className="text-emerald-600">Propósito</span>
          </motion.h1>

          <motion.p
            {...reveal(0.2)}
            className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-stone-600"
          >
            RutaCero nace porque creemos que compartir carro no debería costarte
            tu seguridad ni tus datos. Llega a clase sin depender de nadie más.
          </motion.p>

          <motion.div
            {...reveal(0.3)}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          >
            <button
              type="button"
              onClick={irAlDemo}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 active:bg-emerald-800 sm:w-auto"
            >
              Ver Demo en Vivo
              <ArrowDown className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={irAProposito}
              className="inline-flex w-full items-center justify-center rounded-full border border-stone-300 bg-white px-8 py-4 text-base font-semibold text-stone-900 transition hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2 sm:w-auto"
            >
              Conocer más
            </button>
          </motion.div>
        </div>
      </section>

      {/* ================= 2. Propósito ================= */}
      <Section id="proposito" className="bg-stone-50">
        <SectionHeading
          eyebrow="Nuestro propósito"
          titulo="Movilidad que genera valor para todos"
        />

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {PROPOSITO.map(({ icon: Icon, titulo, descripcion }, i) => (
            <motion.article
              key={titulo}
              {...reveal(0.1 * (i + 1))}
              className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h3
                className={`${playfair.className} mt-5 text-xl font-semibold text-stone-900`}
              >
                {titulo}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">
                {descripcion}
              </p>
            </motion.article>
          ))}
        </div>
      </Section>

      {/* ================= 3. Pilares ================= */}
      <Section className="bg-white">
        <SectionHeading
          eyebrow="Capitalismo consciente"
          titulo="Los 4 pilares de RutaCero"
        />

        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {PILARES.map(({ icon: Icon, titulo, descripcion }, i) => (
            <motion.div
              key={titulo}
              {...reveal(0.1 * (i + 1))}
              className="text-center"
            >
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-50 text-stone-900">
                <Icon className="h-7 w-7" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <h3
                className={`${playfair.className} mt-5 text-lg font-semibold text-stone-900`}
              >
                {titulo}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {descripcion}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ================= 4. Cómo funciona / Tarifas ================= */}
      <Section className="bg-stone-50">
        <SectionHeading
          eyebrow="Cómo funciona"
          titulo="Elige cómo te mueves"
        />

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {PLANES.map(
            ({ icon: Icon, titulo, precio, unidad, beneficios, cta, destacado }, i) => (
              <motion.div
                key={titulo}
                {...reveal(0.1 * (i + 1))}
                className="flex flex-col rounded-2xl border border-stone-100 bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <h3
                    className={`${playfair.className} text-2xl font-semibold text-stone-900`}
                  >
                    {titulo}
                  </h3>
                </div>

                <p className="mt-8 text-4xl font-bold tracking-tight text-stone-900">
                  {precio}
                </p>
                <p className="mt-1 text-sm font-medium text-stone-500">{unidad}</p>

                <ul className="mt-8 flex flex-col gap-3">
                  {beneficios.map((beneficio) => (
                    <li
                      key={beneficio}
                      className="flex items-center gap-3 text-sm text-stone-600"
                    >
                      <Check
                        className="h-4 w-4 shrink-0 text-emerald-600"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      />
                      {beneficio}
                    </li>
                  ))}
                </ul>

                {/* Ambos CTAs llevan a la demo funcional del dashboard. */}
                <button
                  type="button"
                  onClick={irAlDemo}
                  className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                    destacado
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 focus-visible:ring-emerald-600 active:bg-emerald-800'
                      : 'border border-stone-300 bg-white text-stone-900 hover:bg-stone-100 focus-visible:ring-stone-400'
                  }`}
                >
                  {cta}
                </button>
              </motion.div>
            ),
          )}
        </div>

        <motion.p
          {...reveal(0.3)}
          className="mx-auto mt-10 max-w-2xl text-center text-sm text-stone-500"
        >
          🌱 Viaje compartido = menor impacto ambiental. Tarifa justa
          estudiantil, sin intermediarios lucrativos.
        </motion.p>
      </Section>

      {/* ================= 5. Impacto ================= */}
      <section
        aria-label="Métricas de impacto"
        className="bg-emerald-900 px-6 py-20 text-white sm:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <motion.div
            {...reveal()}
            className="grid grid-cols-2 gap-10 text-center lg:grid-cols-4"
          >
            {METRICAS.map(({ valor, etiqueta }) => (
              <div key={etiqueta}>
                <p className="text-4xl font-bold tracking-tight sm:text-5xl">
                  {valor}
                </p>
                <p className="mt-2 text-sm text-emerald-100/80">{etiqueta}</p>
              </div>
            ))}
          </motion.div>

          <motion.p
            {...reveal(0.2)}
            className="mt-14 text-center text-xs text-emerald-100/60"
          >
            Cifras simuladas con fines de demostración del prototipo académico.
          </motion.p>
        </div>
      </section>

      {/* ================= 6. Footer de transparencia ================= */}
      <footer className="bg-stone-100 px-6 py-12">
        <motion.p
          {...reveal()}
          className="mx-auto max-w-3xl text-center text-sm leading-relaxed text-stone-500"
        >
          🎓 RutaCero es un prototipo académico de 2do semestre. Las métricas,
          pagos y algunas funcionalidades se presentan en modo demostrativo. No
          procesa datos reales.
        </motion.p>
      </footer>
    </div>
  );
}
