'use client';

import dynamic from 'next/dynamic';

const Atmosphere = dynamic(
  () => import('./Atmosphere').then((module) => module.Atmosphere),
  { ssr: false },
);

export function AtmosphereMount() {
  return (
    <div className="atmosphere-canvas" aria-hidden="true">
      <Atmosphere />
    </div>
  );
}
