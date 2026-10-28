import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RutaCero · Carpooling universitario en Cali",
  description: "La plataforma de movilidad compartida para estudiantes de Icesi, Javeriana y UAO. Segura, sostenible y justa.",
  keywords: ["carpooling", "movilidad", "universidad", "Cali", "Icesi", "Javeriana", "UAO", "transporte compartido"],
  authors: [{ name: "RutaCero" }],
  creator: "RutaCero",
  publisher: "RutaCero",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://rutacero.co",
    title: "RutaCero · Carpooling universitario en Cali",
    description: "La plataforma de movilidad compartida para estudiantes. Segura, sostenible y justa.",
    siteName: "RutaCero",
  },
  twitter: {
    card: "summary_large_image",
    title: "RutaCero · Carpooling universitario en Cali",
    description: "La plataforma de movilidad compartida para estudiantes. Segura, sostenible y justa.",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0F0F0F" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-neutral-900 dark:bg-neutral-950 dark:text-white">
        {children}
      </body>
    </html>
  );
}