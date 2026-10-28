import LandingPage from './components/LandingPage';
import AppDashboard from './components/AppDashboard';

/**
 * Página pública de RutaCero (App Router · Server Component):
 * 1. LandingPage — narrativa premium (hero, propósito, pilares, tarifas, impacto).
 * 2. AppDashboard — demo funcional (mapa, formularios, membresías), montado
 *    siempre debajo para que el CTA "Ver Demo en Vivo" pueda hacer scroll
 *    suave hasta el id `app-dashboard`.
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-white">
      {/* 1. Landing Page Narrativa */}
      <LandingPage />

      {/* 2. Dashboard Funcional (Mapa, formularios, membresías) */}
      <div
        id="app-dashboard"
        className="scroll-mt-8 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950"
      >
        <AppDashboard />
      </div>
    </main>
  );
}