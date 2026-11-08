import type { Metadata, Viewport } from 'next';
import { Sora, Instrument_Serif, Geist_Mono } from 'next/font/google';
import { AppStateProvider } from './lib/AppState';
import { ThemeProvider } from './hooks/useTheme';
import { DepthProvider } from './hooks/useDepth';
import { AtmosphereMount } from './components/fx/AtmosphereMount';
import { CursorLens } from './components/fx/CursorLens';
import { brand } from './lib/brand';
import './globals.css';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const instrument = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
  weight: '400',
  style: ['normal', 'italic'],
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://rutacero.co'),
  title: {
    default: `${brand.name} — ${brand.tagline}`,
    template: `%s · ${brand.name}`,
  },
  description:
    'RutaCero es movilidad compartida para Cali. Cupos verificados, tarifa justa y PIN de abordaje en el corredor universitario del sur de la ciudad.',
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
    title: `${brand.name} — ${brand.tagline}`,
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
    title: `${brand.name} — ${brand.tagline}`,
    description: brand.shortTagline,
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#04060c',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${sora.variable} ${instrument.variable} ${geistMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-text font-sans selection:bg-primary/30">
        <ThemeProvider>
          <DepthProvider>
            <AtmosphereMount />
            <div className="noise-layer" aria-hidden="true" />
            <div className="scanlines" aria-hidden="true" />
            <CursorLens />
            <AppStateProvider>
              <div className="relative z-10 flex min-h-dvh flex-col">{children}</div>
            </AppStateProvider>
          </DepthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
