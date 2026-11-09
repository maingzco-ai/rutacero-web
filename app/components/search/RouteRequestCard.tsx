'use client';

import { motion } from 'framer-motion';
import { Car, Clock3, MapPin, User, AlertCircle, MessageCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { TiltCard } from '../fx/TiltCard';
import { Magnetic } from '../fx/Magnetic';
import { cn } from '@/app/lib/design-system';
import type { RouteRequest } from '@/app/lib/types';

export function RouteRequestCard({ request }: { request: RouteRequest }) {
  return (
    <TiltCard intensity={3} lift={5}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-[24px] border border-amber/20 bg-[linear-gradient(135deg,rgba(255,176,0,0.08),rgba(255,255,255,0.02)_55%,rgba(5,8,16,0.9))] p-4 hover:border-amber/40 transition-colors duration-300"
      >
        {/* Badge de solicitud */}
        <div className="absolute top-3 right-3">
          <span className="flex items-center gap-1 rounded-full border border-amber/30 bg-amber/10 px-2 py-0.5 font-mono text-[7px] uppercase tracking-[0.1em] text-amber">
            <span className="h-1 w-1 animate-pulse rounded-full bg-amber" />
            Solicitud
          </span>
        </div>

        {/* Header con origen/destino */}
        <div className="relative z-10 mb-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber/15 border border-amber/25 text-amber">
              <MapPin className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-[13px] text-text truncate">{request.destination}</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-text-secondary/70">
                <span className="flex h-1.5 w-1.5 rounded-full bg-amber/50" />
                desde {request.origin}
              </p>
            </div>
          </div>
        </div>

        {/* Info de salida y notas */}
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-3 text-[10.5px] text-text-secondary">
            <span className="flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5" />
              <span className="font-mono text-text">{request.departure}</span>
            </span>
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              <span>Busca conductor</span>
            </span>
          </div>

          {request.notes && (
            <div className="flex items-start gap-2 rounded-lg border border-amber/20 bg-amber/5 px-3 py-2">
              <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber/70" />
              <p className="text-[10px] text-text-secondary/80 min-w-0">{request.notes}</p>
            </div>
          )}

          {/* Tiempo de antelación */}
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
            <Car className="h-3.5 w-3.5 text-accent/70" />
            <div className="min-w-0">
              <p className="hud text-[7px] text-text-secondary/50">Para conductores</p>
              <p className="text-[11px] font-medium text-text">Esta persona necesita cupo en tu ruta</p>
            </div>
          </div>
        </div>

        {/* Acción: Contactar / Ofrecer cupo */}
        <div className="relative z-10 mt-4 pt-4 border-t border-white/[0.07]">
          <Magnetic strength={0.2}>
            <Button variant="primary" fullWidth size="sm" className="gap-2">
              <MessageCircle className="h-3.5 w-3.5" />
              <span>Ofrecer cupo / Contactar</span>
            </Button>
          </Magnetic>
        </div>
      </motion.div>
    </TiltCard>
  );
}