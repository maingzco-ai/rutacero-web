import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { LogoMark, Wordmark } from '../components/shell/Logo';

export function LegalFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh">
      <header className="fixed inset-x-0 top-0 z-[80] px-4 pt-4 sm:px-6 sm:pt-5">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
          <Link href="/" className="glass flex items-center gap-3 rounded-full py-1.5 pl-1.5 pr-4">
            <LogoMark size={30} />
            <Wordmark />
          </Link>
          <Link
            href="/"
            className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[10.5px] font-medium text-text-secondary transition-colors hover:text-text"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver a la app
          </Link>
        </div>
      </header>

      <div className="page-shell max-w-3xl pb-24 pt-28 sm:pt-32">
        <div className="mb-8 flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-accent">
            <ShieldCheck className="h-3.5 w-3.5" />
          </span>
          <div>
            <p className="hud text-[7.5px]">Documento legal</p>
            <p className="mt-0.5 font-mono text-[8px] text-text-secondary/45">RutaCero S.A.S. · Cali, Colombia</p>
          </div>
        </div>

        <div className="glass-strong relative overflow-hidden rounded-[30px] px-5 py-8 sm:px-9 sm:py-10">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
          />
          {children}
        </div>

        <p className="mt-6 text-center font-mono text-[7.5px] uppercase tracking-[0.18em] text-text-secondary/30">
          Ley 1581/2012 · Ley 1480/2011 · Cali, Valle del Cauca
        </p>
      </div>
    </div>
  );
}
