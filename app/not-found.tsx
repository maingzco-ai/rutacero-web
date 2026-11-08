import Link from 'next/link';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4">
      <div aria-hidden="true" className="grid-veil pointer-events-none absolute inset-0 opacity-30" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]"
        style={{ boxShadow: '0 0 140px rgba(79,109,245,0.18), inset 0 0 120px rgba(92,233,220,0.05)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 animate-pulse-soft rounded-full border border-white/[0.08]"
      />

      <div className="relative w-full max-w-lg text-center">
        <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-accent/80">Señal perdida · Cali 03°22′ N</p>
        <p className="display mt-6 text-[7rem] leading-none text-aurora sm:text-[9rem]">404</p>
        <h1 className="display mt-2 text-2xl text-text sm:text-3xl">
          Esa ruta no existe<span className="serif text-primary-light"> (todavía).</span>
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-[12.5px] leading-relaxed text-text-secondary">
          El viaje o la página se movió fuera del mapa. Vuelve al corredor y busca un cupo activo.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#ffffff,#b9c8ff_55%,#7c9cff)] px-5 py-3 text-[11.5px] font-semibold text-[#07101f] shadow-[0_18px_44px_-16px_rgba(124,156,255,0.8)] transition-transform duration-300 hover:scale-[1.02]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Volver al mapa
          </Link>
          <Link
            href="/buscar"
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-5 py-3 text-[11.5px] font-medium text-text-secondary transition-colors hover:border-white/25 hover:text-text"
          >
            <Compass className="h-4 w-4" />
            Explorar rutas
          </Link>
        </div>

        <p className="mt-8 font-mono text-[7.5px] uppercase tracking-[0.22em] text-text-secondary/30">
          RutaCero · movilidad compartida · Cali Sur
        </p>
      </div>
    </div>
  );
}
