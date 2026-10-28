'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Check, GraduationCap, Leaf, Lock, Route, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';

const scrollToDemo = () => {
  document.getElementById('app-dashboard')?.scrollIntoView({ behavior: 'smooth' });
};

const scrollToPurpose = () => {
  document.getElementById('proposito')?.scrollIntoView({ behavior: 'smooth' });
};

const VALUES = [
  {
    icon: ShieldCheck,
    title: 'Privacidad Primero',
    description: 'Tus datos nunca se venden. Validamos identidad institucional (@icesi, @javeriana, @uao) sin exponer información sensible. Solo estudiantes reales acceden.',
  },
  {
    icon: Leaf,
    title: 'Impacto Real',
    description: 'Cada viaje compartido mitiga 1.5kg de CO₂ en el corredor Cañasgordas. Miles de horas de trancón evitadas cada semestre.',
  },
  {
    icon: Users,
    title: 'Comunidad Verificada',
    description: 'Sistema de reputación bilateral + PIN único por viaje. Cero spam, cero desconocidos. Tu conductor sabe quién sube antes de llegar.',
  },
];

const PILLARS = [
  { icon: Route, title: 'Propósito', description: 'Movilidad universitaria accesible y segura.' },
  { icon: Sparkles, title: 'Personas', description: 'Generamos valor para estudiantes y conductores.' },
  { icon: Users, title: 'Comunidad', description: 'Construimos soluciones junto a quienes usan el servicio.' },
  { icon: Leaf, title: 'Planeta', description: 'Promovemos una movilidad compartida y sostenible.' },
];

const METRICS = [
  { value: '1.2k+', label: 'Estudiantes movilizados' },
  { value: '85+', label: 'Conductores activos' },
  { value: '-30%', label: 'CO₂ estimado evitado' },
  { value: '25 min', label: 'Tiempo promedio de viaje' },
];

const PLANS = [
  {
    icon: GraduationCap,
    title: 'Pedir Cupo',
    price: '$4.500',
    unit: 'COP / viaje',
    benefits: ['Llega en minutos', 'Precio de estudiante', 'Conductor verificado'],
    cta: 'Solicitar viaje',
    featured: true,
  },
  {
    icon: Leaf,
    title: 'Ofrecer Cupo',
    price: 'Gana $15.000',
    unit: 'base por ruta',
    benefits: ['Horarios flexibles', 'Remuneración justa', 'Ayuda al planeta'],
    cta: 'Publicar ruta',
    featured: false,
  },
];

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const, delay },
});

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-white">
      {/* ================= 1. Hero ================= */}
      <section className="relative px-4 py-20 sm:py-28 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-950 dark:to-neutral-900" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div {...reveal()} className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-600 shadow-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-300">
              <GraduationCap className="h-4 w-4 text-green-600 dark:text-green-400" aria-hidden="true" />
              Carpooling universitario · Cali, Colombia
            </motion.div>

            {/* Headline */}
            <motion.h1 {...reveal(0.1)} className="mt-8 text-5xl font-semibold leading-[1.05] tracking-tight text-neutral-900 dark:text-white sm:text-6xl lg:text-7xl">
              Movilidad Universitaria
              <br />
              con <span className="text-green-600 dark:text-green-400">Propósito</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p {...reveal(0.2)} className="mt-6 mx-auto max-w-2xl text-lg leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-xl">
              RutaCero nace porque creemos que compartir carro no debería costarte tu seguridad ni tus datos. Llega a clase sin depender de nadie más.
            </motion.p>

            {/* CTAs */}
            <motion.div {...reveal(0.3)} className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <Button size="lg" onClick={scrollToDemo} className="w-full sm:w-auto">
                Ver Demo en Vivo
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Button>
              <Button variant="secondary" size="lg" onClick={scrollToPurpose} className="w-full sm:w-auto">
                Conocer más
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div {...reveal(0.4)} className="mt-16 flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center gap-1.5">
                <Lock className="h-4 w-4" aria-hidden="true" />
                <span>Validación institucional</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                <span>PIN de seguridad por viaje</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Leaf className="h-4 w-4 text-green-600 dark:text-green-400" aria-hidden="true" />
                <span>Impacto medible</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= 2. Propósito ================= */}
      <section id="proposito" className="px-4 py-20 sm:py-28 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto">
          <motion.div {...reveal()} className="mx-auto max-w-3xl text-center">
            <Badge variant="success" className="mb-4">Nuestro propósito</Badge>
            <h2 className="text-4xl font-semibold leading-tight tracking-tight text-neutral-900 dark:text-white sm:text-5xl">
              Movilidad que genera valor para todos
            </h2>
          </motion.div>

          <motion.div {...reveal(0.1)} className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
            {VALUES.map(({ icon: Icon, title, description }, i) => (
              <Card key={title} padding="lg" className="h-full">
                <CardContent className="pt-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                    <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-neutral-900 dark:text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{description}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================= 3. Pilares ================= */}
      <section className="px-4 py-20 sm:py-28 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto">
          <motion.div {...reveal()} className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">Capitalismo consciente</Badge>
            <h2 className="text-4xl font-semibold leading-tight tracking-tight text-neutral-900 dark:text-white sm:text-5xl">
              Los 4 pilares de RutaCero
            </h2>
          </motion.div>

          <motion.div {...reveal(0.1)} className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map(({ icon: Icon, title, description }, i) => (
              <div key={title} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white">
                  <Icon className="h-8 w-8" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-neutral-900 dark:text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================= 4. Cómo funciona ================= */}
      <section className="px-4 py-20 sm:py-28 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto">
          <motion.div {...reveal()} className="mx-auto max-w-3xl text-center">
            <Badge variant="success" className="mb-4">Cómo funciona</Badge>
            <h2 className="text-4xl font-semibold leading-tight tracking-tight text-neutral-900 dark:text-white sm:text-5xl">
              Elige cómo te mueves
            </h2>
          </motion.div>

          <motion.div {...reveal(0.1)} className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {PLANS.map(({ icon: Icon, title, price, unit, benefits, cta, featured }, i) => (
              <Card key={title} padding="lg" className="h-full flex flex-col">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                    <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
                  </div>
                  <h3 className="text-2xl font-semibold text-neutral-900 dark:text-white">{title}</h3>
                </div>

                <p className="mt-8 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">{price}</p>
                <p className="mt-1 text-sm font-medium text-neutral-500 dark:text-neutral-400">{unit}</p>

                <ul className="mt-8 flex-1 flex flex-col gap-3">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                      <Check className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" strokeWidth={2.5} aria-hidden="true" />
                      {benefit}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={scrollToDemo}
                  variant={featured ? 'success' : 'secondary'}
                  fullWidth
                  className="mt-8"
                >
                  {cta}
                </Button>
              </Card>
            ))}
          </motion.div>

          <motion.p {...reveal(0.3)} className="mx-auto mt-10 max-w-2xl text-center text-sm text-neutral-500 dark:text-neutral-400">
            🌱 Viaje compartido = menor impacto ambiental. Tarifa justa estudiantil, sin intermediarios lucrativos.
          </motion.p>
        </div>
      </section>

      {/* ================= 5. Impacto ================= */}
      <section className="px-4 py-20 sm:py-28 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <motion.div {...reveal()} className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
            {METRICS.map(({ value, label }) => (
              <div key={label}>
                <p className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">{value}</p>
                <p className="mt-2 text-sm text-neutral-400">{label}</p>
              </div>
            ))}
          </motion.div>

          <motion.p {...reveal(0.2)} className="mt-14 text-center text-xs text-neutral-500">
            Cifras basadas en proyecciones del modelo operativo para el corredor Cali Sur.
          </motion.p>
        </div>
      </section>

      {/* ================= 6. Footer ================= */}
      <footer className="px-4 py-12 bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
            🎓 RutaCero es una plataforma de movilidad universitaria en desarrollo. Las métricas y funcionalidades
            mostradas representan el modelo operativo objetivo. ¿Preguntas? <a href="mailto:hola@rutacero.co" className="text-green-600 hover:underline dark:text-green-400">hola@rutacero.co</a>
          </p>
        </div>
      </footer>
    </div>
  );
}