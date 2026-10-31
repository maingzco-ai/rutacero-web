import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold text-primary">404</p>
      <h1 className="mt-2 text-2xl font-semibold">No encontramos esa ruta</h1>
      <p className="mt-2 max-w-sm text-sm text-neutral-500">El viaje o la página no existe. Vuelve al mapa para buscar un cupo en Cali.</p>
      <Link href="/" className="mt-6 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white">
        Ir al inicio
      </Link>
    </div>
  );
}
