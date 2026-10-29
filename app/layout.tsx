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
  title: {
    default: `${brand.name} · ${brand.tagline}`,
    template: `%s · ${brand.name}`,
  },
  description:
    'Carpooling para Cali, Colombia. Comparte el camino hacia la universidad o el trabajo con cupos verificados, tarifa justa y PIN de abordaje.',
  keywords: ['carpooling', 'Cali', 'movilidad compartida', 'RutaCero', 'transporte universitario', 'Cañasgordas'],
  authors: [{ name: brand.name }],
  creator: brand.name,
  publisher: brand.name,
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: 'https://rutacero.co',
    title: `${brand.name} · ${brand.tagline}`,
    description: brand.shortTagline,
    siteName: brand.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${brand.name} · ${brand.tagline}`,
    description: brand.shortTagline,
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#0F0F0F' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#F6F7F8] font-sans text-neutral-900 dark:bg-neutral-950 dark:text-white">
        <ThemeProvider>
          <AppStateProvider>{children}</AppStateProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
