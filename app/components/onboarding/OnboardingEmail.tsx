'use client';

import { useState } from 'react';
import { Mail, ShieldCheck } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { OnboardingStage } from './OnboardingStage';
import { cn } from '@/app/lib/design-system';

const INSTITUTIONAL_DOMAINS = [
  { domain: 'icesi.edu.co', name: 'Universidad Icesi' },
  { domain: 'u.icesi.edu.co', name: 'Universidad Icesi (u.icesi.edu.co)' },
  { domain: 'javerianacali.edu.co', name: 'Pontificia Universidad Javeriana Cali' },
  { domain: 'uao.edu.co', name: 'Universidad Autónoma de Occidente (UAO)' },
  { domain: 'correounivalle.edu.co', name: 'Universidad del Valle (Univalle)' },
  { domain: 'rutacero.co', name: 'Equipo RutaCero (evaluación)' },
];

export function OnboardingEmail({ onSubmit }: { onSubmit: (email: string) => void }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const normalizedEmail = email.trim().toLowerCase();
  const matchedDomain = INSTITUTIONAL_DOMAINS.find((domain) => normalizedEmail.endsWith('@' + domain.domain));
  const isValid = Boolean(normalizedEmail && matchedDomain);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    setError(null);

    if (!email.trim()) {
      setError('Ingresa tu correo institucional');
      return;
    }

    const normalized = email.trim().toLowerCase();
    const domain = INSTITUTIONAL_DOMAINS.find((item) => normalized.endsWith('@' + item.domain));

    if (!domain) {
      setError('Ingresa un correo institucional válido de Cali.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalized }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Error al enviar el código');

      if (data.devCode) sessionStorage.setItem('rc_last_demo_code', data.devCode);

      setSubmitting(false);
      onSubmit(normalized);
    } catch (err) {
      setSubmitting(false);
      setError(err instanceof Error ? err.message : 'Error enviando código. Intenta de nuevo.');
    }
  };

  return (
    <OnboardingStage
      step={3}
      eyebrow="Acceso institucional"
      title="Confirma tu"
      accent="comunidad."
      description="Solo correos de universidades aliadas de Cali. Así cada cupo pertenece a alguien verificable."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Correo institucional"
          type="email"
          placeholder="nombre.apellido@icesi.edu.co"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={error ?? undefined}
          icon={<Mail className="h-4 w-4" />}
          disabled={submitting}
          autoComplete="email"
          required
          className={cn('text-[13px]', isValid && 'border-success/40')}
        />

        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3">
          <div className="flex items-center justify-between">
            <p className="hud text-[7px]">Universidades admitidas</p>
            <ShieldCheck className={cn('h-3 w-3', isValid ? 'text-success' : 'text-text-secondary/40')} />
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {INSTITUTIONAL_DOMAINS.slice(0, 5).map((domain) => {
              const matched = normalizedEmail.endsWith('@' + domain.domain);
              return (
                <span
                  key={domain.domain}
                  className={cn(
                    'flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-[8.5px] transition-colors duration-300',
                    matched
                      ? 'border-success/25 bg-success/[0.07] text-success'
                      : 'border-white/[0.06] text-text-secondary/50',
                  )}
                >
                  <span className={cn('h-1 w-1 shrink-0 rounded-full', matched ? 'bg-success' : 'bg-white/20')} />
                  <span className="truncate">@{domain.domain}</span>
                </span>
              );
            })}
          </div>
        </div>

        <Button type="submit" variant="primary" fullWidth size="lg" loading={submitting} disabled={submitting || !isValid}>
          {submitting ? 'Enviando código…' : isValid ? 'Enviar código de 5 dígitos' : 'Ingresa tu correo'}
        </Button>

        <p className="text-center font-mono text-[7.5px] uppercase leading-relaxed tracking-[0.12em] text-text-secondary/35">
          Código seguro · expira en 5 min · valida tu cupo y PIN
        </p>
      </form>
    </OnboardingStage>
  );
}
