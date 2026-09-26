import LandingPage from './components/LandingPage';
import AppDashboard from './components/AppDashboard';

/**
 * Página pública de RutaCero (App Router · Server Component):
 * 1. LandingPage — narrativa beige (hero, propósito, pilares, tarifas, impacto).
 * 2. AppDashboard — demo funcional (mapa, formularios, membresías), montado
 *    siempre debajo para que el CTA "Ver Demo en Vivo" pueda hacer scroll
 *    suave hasta el id `app-dashboard`.
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      {/* 1. Landing Page Narrativa (Hero beige, propósito, pilares, etc.) */}
      <LandingPage />

      {/* 2. Dashboard Funcional (Mapa, formularios, membresías) */}
      <div
        id="app-dashboard"
        className="scroll-mt-8 border-t border-stone-200 bg-white"
      >
        <AppDashboard />
      </div>
    </main>
  );
}
