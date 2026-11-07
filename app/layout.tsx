import type { Metadata, Viewport } from 'next';
import { Inter, Geist_Mono } from 'next/font/google';
import { AppStateProvider } from './lib/AppState';
import { ThemeProvider } from './hooks/useTheme';
import { brand } from './lib/brand';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://rutacero.co'),
  title: {
    default: `${brand.name} [DEMO] · ${brand.tagline}`,
    template: `%s · ${brand.name}`,
  },
  description:
    'RutaCero es carpooling para Cali, Colombia. Comparte el camino hacia la universidad o el trabajo con cupos verificados, tarifa justa y PIN de abordaje. Movilidad compartida segura y confiable en el corredor sur de Cali.',
  keywords: [
    'carpooling',
    'Cali',
    'movilidad compartida',
    'RutaCero',
    'transporte universitario',
    'Cañasgordas',
    'cupos verificados',
    'tarifa justa',
  ],
  authors: [{ name: brand.name, url: 'https://rutacero.co' }],
  creator: brand.name,
  publisher: brand.name,
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: 'https://rutacero.co',
    title: `${brand.name} [DEMO] · ${brand.tagline}`,
    description: brand.shortTagline,
    siteName: brand.name,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${brand.name} · ${brand.tagline}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${brand.name} [DEMO] · ${brand.tagline}`,
    description: brand.shortTagline,
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0B7CC0' },
    { media: '(prefers-color-scheme: dark)', color: '#0F172A' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-canvas text-text font-sans dark:bg-background-dark dark:text-text-dark flex flex-col">
        {/* Elemento visual DEMO en la parte superior de la interfaz de usuario */}
        <aside
          role="region"
          aria-label="Aviso de versión demostrativa"
          className="sticky top-0 z-[100] flex w-full items-center justify-center gap-2 border-b border-primary-dark/20 bg-gradient-to-r from-primary via-primary-dark to-primary px-3 py-1.5 text-center text-xs font-bold uppercase tracking-widest text-white shadow-sm"
        >
          <span className="inline-flex h-2 w-2 rounded-full bg-accent animate-pulse" aria-hidden="true" />
          <span className="font-extrabold text-white tracking-widest">DEMO</span>
          <span className="hidden text-[11px] font-medium text-white/90 sm:inline">
            · Plataforma de Movilidad Compartida · Cali, Colombia
          </span>
        </aside>

        <ThemeProvider>
          <AppStateProvider>{children}</AppStateProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
