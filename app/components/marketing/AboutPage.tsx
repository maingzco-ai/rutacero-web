'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Lock,
  Quote,
  Route,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { TiltCard } from '../fx/TiltCard';
import { Magnetic } from '../fx/Magnetic';
import { Reveal, Stagger, StaggerItem, Words } from '../fx/Reveal';
import { SpatialOrb } from '../fx/SpatialOrb';
import { LogoMark, Wordmark } from '../shell/Logo';
import { brand } from '@/app/lib/brand';
import { EASE } from '@/app/lib/motion';

const VALUES = [
  {
    icon: ShieldCheck,
    index: '01',
    title: 'Confianza primero',
    description:
      'Cupos entre personas con correo institucional. PIN único por abordaje y reputación viva en cada viaje.',
  },
  {
    icon: Users,
    index: '02',
    title: 'Menos autos, mismo destino',
    description:
      'Diseñado para el corredor sur de Cali: universidades, centros comerciales y barrios de Cañasgordas.',
  },
  {
    icon: Lock,
    index: '03',
    title: 'Tarifa justa, sin subasta',
    description:
      'El costo se reparte entre quienes viajan. Sin recargos opacos ni precios que suben cuando más lo necesitas.',
  },
];

const STEPS = [
  {
    index: '01',
    title: 'Elige tu vector',
    description: 'Origen, destino y hora. El motor calcula el corredor óptimo en segundos.',
  },
  {
    index: '02',
    title: 'Reserva tu asiento',
    description: 'Paga desde la billetera y recibe un PIN único de abordaje al instante.',
  },
  {
    index: '03',
    title: 'Aborda y llega',
    description: 'Muestra tu PIN al conductor. Comparte el viaje, reparte el costo, llega seguro.',
  },
];

const METRICS = [
  { value: '04', label: 'universidades conectadas', suffix: '' },
  { value: '3', label: 'minutos de espera media', suffix: ' min' },
  { value: '0', label: 'comisiones ocultas', suffix: '%' },
  { value: '100', label: 'trazabilidad del viaje', suffix: '%' },
];

export default function AboutPage() {
  const reduced = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const orbY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const orbScale = useTransform(scrollYProgress, [0, 1], [1, 0.82]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.1]);

  return (
    <div className="relative min-h-dvh overflow-x-hidden">
      {/* Floating brand bar */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[80] px-4 pt-4 sm:px-6 sm:pt-5">
        <div className="pointer-events-auto mx-auto flex max-w-7xl items-center justify-between gap-3">
          <Link href="/" className="glass flex items-center gap-3 rounded-full py-1.5 pl-1.5 pr-4">
            <LogoMark size={32} />
            <Wordmark />
          </Link>
          <div className="flex items-center gap-2">
            <span className="glass hidden items-center gap-2 rounded-full px-3 py-2 sm:flex">
              <span className="h-1 w-1 rounded-full bg-accent" />
              <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-text-secondary">Manifiesto 2026</span>
            </span>
            <Link href="/">
              <Button variant="primary" size="sm">
                Abrir la app <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section ref={heroRef} className="relative flex min-h-[100dvh] items-center overflow-hidden px-4 pb-24 pt-32 sm:px-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(70% 60% at 72% 38%, rgba(79,109,245,0.20), transparent 62%), radial-gradient(50% 50% at 12% 82%, rgba(92,233,220,0.08), transparent 65%)',
          }}
        />
        <div className="grid-veil pointer-events-none absolute inset-0 opacity-30" />

        <div className="page-shell relative grid w-full items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div style={{ y: copyY, opacity: copyOpacity }}>
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 backdrop-blur-md"
            >
              <Sparkles className="h-3 w-3 text-amber/80" />
              <span className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-text-secondary">
                Movilidad compartida · Cali, Colombia
              </span>
            </motion.div>

            <h1 className="display mt-6 text-[3.1rem] leading-[0.92] text-text sm:text-[4.4rem] xl:text-[5.4rem]">
              <Words text="Comparte el" />
              <br />
              <span className="text-aurora">camino.</span>
              <br />
              <span className="serif text-[0.72em] font-normal text-primary-light">Llega con confianza.</span>
            </h1>

            <motion.p
              initial={reduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.45 }}
              className="mt-6 max-w-lg text-[14px] leading-relaxed text-text-secondary sm:text-[15px]"
            >
              RutaCero no es un taxi por app. Es un asiento en un auto que ya va a tu universidad
              o a tu casa. Cupos verificados, tarifa justa y un PIN de abordaje para viajar seguro.
            </motion.p>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.58 }}
              className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:items-center"
            >
              <Magnetic strength={0.22}>
                <Link href="/">
                  <Button variant="primary" size="lg">
                    Buscar un viaje <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </Magnetic>
              <Magnetic strength={0.18}>
                <Link href="/publicar">
                  <Button variant="secondary" size="lg">
                    Publicar una ruta
                  </Button>
                </Link>
              </Magnetic>
            </motion.div>

            <motion.div
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.85 }}
              className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[10.5px] text-text-secondary/70"
            >
              <span className="inline-flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-primary/80" /> Correo institucional verificado
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-primary/80" /> PIN único por viaje
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-accent/80" /> Corredor Cali Sur
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            style={{ y: orbY, scale: orbScale }}
            className="relative mx-auto hidden w-full max-w-[560px] lg:block"
          >
            <div className="animate-drift">
              <SpatialOrb size={560} />
            </div>
            <div className="glass absolute left-0 top-[16%] animate-float rounded-2xl px-3.5 py-2.5">
              <p className="hud text-[7.5px]">Corredor activo</p>
              <p className="mt-1 font-mono text-[12px] text-text">Sur · Cañasgordas</p>
            </div>
            <div className="glass absolute -right-2 bottom-[20%] animate-float rounded-2xl px-3.5 py-2.5 [animation-delay:-4s]">
              <p className="hud text-[7.5px]">PIN de abordaje</p>
              <p className="mt-1 font-mono text-[12px] tracking-[0.22em] text-accent">RC-2481</p>
            </div>
            <div className="glass absolute bottom-[4%] left-[10%] animate-float rounded-2xl px-3.5 py-2.5 [animation-delay:-7s]">
              <p className="hud text-[7.5px]">Tarifa justa</p>
              <p className="mt-1 font-mono text-[12px] text-text">$4.500 COP</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute inset-x-0 bottom-8 flex justify-center"
          animate={reduced ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="flex flex-col items-center gap-2 font-mono text-[7.5px] uppercase tracking-[0.2em] text-text-secondary/40">
            Scroll
            <ChevronDown className="h-3.5 w-3.5" />
          </span>
        </motion.div>
      </section>

      {/* Manifesto statement */}
      <section className="relative px-4 py-24 sm:px-6 sm:py-32">
        <div className="page-shell">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-1 w-1 rounded-full bg-accent" />
              <p className="hud text-[8px]">Manifiesto</p>
              <span className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="display mt-8 max-w-4xl text-[2.2rem] leading-[1.02] text-text sm:text-[3.4rem]">
              Cada asiento vacío es una oportunidad para<span className="serif text-primary-light"> movernos mejor.</span>
            </h2>
          </Reveal>

          <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal delay={0.15}>
              <p className="max-w-md text-[13.5px] leading-relaxed text-text-secondary">
                En Cali, miles de autos cruzan la ciudad con un solo ocupante. RutaCero convierte esos
                trayectos en comunidad: menos tráfico, menos costo, más confianza. No inventamos una
                nueva forma de movernos; activamos la que ya existe.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="flex items-start gap-4 rounded-[26px] border border-white/[0.08] bg-white/[0.025] p-5">
                <Quote className="h-6 w-6 shrink-0 text-primary/60" />
                <p className="text-[15px] leading-relaxed text-text/85">
                  «El carro de tu compañero de clase, verificado por la universidad.»
                  <span className="mt-3 block font-mono text-[8px] uppercase tracking-[0.18em] text-text-secondary/50">
                    Principio de diseño · RutaCero
                  </span>
                </p>
              </div>
            </Reveal>
          </div>

          <Stagger className="mt-12 grid gap-4 md:grid-cols-3">
            {VALUES.map(({ icon: Icon, index, title, description }) => (
              <StaggerItem key={title} className="h-full">
                <TiltCard intensity={4} lift={8} className="h-full">
                  <div className="glass relative h-full overflow-hidden rounded-[26px] p-5">
                    <div className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-primary/15 blur-[60px]" />
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-primary-light">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="font-mono text-[9px] tracking-[0.2em] text-text-secondary/30">{index}</span>
                    </div>
                    <h3 className="display mt-6 text-[1.25rem] text-text">{title}</h3>
                    <p className="mt-2 text-[11.5px] leading-relaxed text-text-secondary">{description}</p>
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Metrics band */}
      <section className="relative border-y border-white/[0.06] bg-white/[0.015] px-4 py-14 backdrop-blur-sm sm:px-6">
        <div className="page-shell grid grid-cols-2 gap-6 md:grid-cols-4">
          {METRICS.map((metric, index) => (
            <Reveal key={metric.label} delay={index * 0.06}>
              <div>
                <p className="font-mono text-[26px] leading-none text-text sm:text-[34px]">
                  {metric.value}
                  <span className="text-[12px] text-accent">{metric.suffix}</span>
                </p>
                <p className="mt-2 font-mono text-[7.5px] uppercase tracking-[0.16em] text-text-secondary/50">
                  {metric.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative px-4 py-24 sm:px-6 sm:py-32">
        <div className="page-shell">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-1 w-1 rounded-full bg-primary" />
              <p className="hud text-[8px]">Protocolo de viaje</p>
              <span className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
            </div>
            <h2 className="display mt-6 text-[2.1rem] leading-[1.03] sm:text-[3rem]">
              Tres pasos.<span className="serif text-accent"> Cero fricción.</span>
            </h2>
          </Reveal>

          <div className="relative mt-10 grid gap-4 md:grid-cols-3">
            <span
              aria-hidden="true"
              className="absolute left-[10%] right-[10%] top-[46px] hidden h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent md:block"
            />
            {STEPS.map((step, index) => (
              <Reveal key={step.index} delay={index * 0.1}>
                <div className="group relative rounded-[26px] border border-white/[0.07] bg-white/[0.02] p-5 transition-colors duration-500 hover:border-white/15 hover:bg-white/[0.04]">
                  <span className="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-[#070b14] font-mono text-[12px] text-primary-light shadow-[0_0_30px_-8px_rgba(124,156,255,0.6)]">
                    {step.index}
                    <span className="absolute inset-0 rounded-full border border-primary/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </span>
                  <h3 className="mt-6 text-[16px] font-semibold text-text">{step.title}</h3>
                  <p className="mt-2 text-[11.5px] leading-relaxed text-text-secondary">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Two-sided offering */}
      <section className="relative px-4 pb-24 sm:px-6 sm:pb-32">
        <div className="page-shell grid gap-4 lg:grid-cols-2">
          {[
            {
              eyebrow: 'Para pasajeros',
              title: 'Pedir cupo',
              price: '$4.500 – $5.000',
              note: 'COP por trayecto típico en Cali Sur',
              items: ['Elige origen y destino', 'Reserva el asiento', 'Aborda con PIN'],
              accent: 'primary' as const,
            },
            {
              eyebrow: 'Para conductores',
              title: 'Ofrecer cupo',
              price: 'Comparte costos',
              note: 'La tarifa se reparte entre los asientos ocupados',
              items: ['Publica tu hora y ruta', 'Acepta pasajeros verificados', 'Viaja con el auto más lleno y más justo'],
              accent: 'accent' as const,
            },
          ].map((block) => (
            <Reveal key={block.title}>
              <TiltCard intensity={4} lift={8} className="h-full">
                <div className="glass-strong relative h-full overflow-hidden rounded-[30px] p-6 sm:p-8">
                  <div
                    className={`pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full blur-[80px] ${
                      block.accent === 'primary' ? 'bg-primary/25' : 'bg-accent/15'
                    }`}
                  />
                  <p className="hud text-[8px]">{block.eyebrow}</p>
                  <h3 className="display mt-3 text-[1.9rem] text-text">{block.title}</h3>
                  <p
                    className={`mt-3 font-mono text-[26px] ${
                      block.accent === 'primary' ? 'text-primary-light' : 'text-accent'
                    }`}
                  >
                    {block.price}
                  </p>
                  <p className="mt-1 text-[10.5px] text-text-secondary/70">{block.note}</p>
                  <div className="hairline my-6" />
                  <ul className="space-y-2.5">
                    {block.items.map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-[11.5px] text-text/80">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                          <ShieldCheck className="h-2.5 w-2.5 text-accent/80" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link href={block.accent === 'primary' ? '/buscar' : '/publicar'} className="mt-6 inline-block">
                    <Button variant={block.accent === 'primary' ? 'primary' : 'secondary'} size="sm">
                      {block.accent === 'primary' ? 'Buscar cupo' : 'Publicar ruta'}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Closing */}
      <section className="relative overflow-hidden px-4 py-24 sm:px-6 sm:py-32">
        <div className="page-shell">
          <Reveal>
            <div className="relative overflow-hidden rounded-[34px] border border-white/[0.1] bg-[linear-gradient(150deg,rgba(22,32,58,0.8),rgba(5,8,16,0.9))] px-6 py-14 text-center sm:px-12 sm:py-20">
              <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/25 blur-[90px]" />
              <div className="pointer-events-none absolute -bottom-32 right-0 h-64 w-64 rounded-full bg-accent/15 blur-[90px]" />
              <p className="hud relative text-[8px]">El camino ya existe</p>
              <h2 className="display relative mx-auto mt-5 max-w-2xl text-[2.2rem] leading-[1.02] text-text sm:text-[3.4rem]">
                Solo falta<span className="serif text-primary-light"> compartirlo.</span>
              </h2>
              <p className="relative mx-auto mt-4 max-w-md text-[12.5px] leading-relaxed text-text-secondary">
                Abre la app, elige tu corredor y reserva tu primer cupo. La comunidad ya está en marcha.
              </p>
              <div className="relative mx-auto mt-8 flex w-fit flex-col gap-2.5 sm:flex-row">
                <Link href="/">
                  <Button variant="primary" size="lg">
                    Entrar a RutaCero <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/legal">
                  <Button variant="ghost" size="lg">
                    Términos y privacidad
                  </Button>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-white/[0.06] px-4 py-10 sm:px-6">
        <div className="page-shell flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-3">
            <LogoMark size={26} />
            <div>
              <p className="text-[11px] font-medium text-text">{brand.name}</p>
              <p className="mt-0.5 font-mono text-[7.5px] uppercase tracking-[0.16em] text-text-secondary/40">
                {brand.tagline}
              </p>
            </div>
          </div>
          <p className="text-[10px] text-text-secondary/50">
            Cali, Valle del Cauca ·{' '}
            <a className="text-primary/80 transition-colors hover:text-primary" href={`mailto:${brand.email}`}>
              {brand.email}
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
