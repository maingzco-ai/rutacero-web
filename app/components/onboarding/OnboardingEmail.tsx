'use client';

import { useState } from 'react';
import { Mail, ShieldCheck } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

const INSTITUTIONAL_DOMAINS = [
  { domain: 'icesi.edu.co', name: 'Universidad Icesi' },
  { domain: 'u.icesi.edu.co', name: 'Universidad Icesi (u.icesi.edu.co)' },
  { domain: 'javerianacali.edu.co', name: 'Pontificia Universidad Javeriana Cali' },
  { domain: 'uao.edu.co', name: 'Universidad Autónoma de Occidente (UAO)' },
  { domain: 'correounivalle.edu.co', name: 'Universidad del Valle (Univalle)' },
  { domain: 'rutacero.co', name: 'RutaCero Equipo / Evaluador [DEMO]' },
];

export function OnboardingEmail({ onSubmit }: { onSubmit: (email: string) => void }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const normalizedEmail = email.trim().toLowerCase();
  const matchedDomain = INSTITUTIONAL_DOMAINS.find((d) => normalizedEmail.endsWith('@' + d.domain));
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
    const domain = INSTITUTIONAL_DOMAINS.find((d) => normalized.endsWith('@' + d.domain));

    if (!domain) {
      setError(
        'Ingresa un correo institucional válido de Cali (@icesi.edu.co, @javerianacali.edu.co, @uao.edu.co, @correounivalle.edu.co).',
      );
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

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar código de verificación');
      }

      // Si el servidor nos entrega devCode en modo demo, guardarlo temporalmente para facilitar la prueba
      if (data.devCode) {
        sessionStorage.setItem('rc_last_demo_code', data.devCode);
      }

      setSubmitting(false);
      onSubmit(normalized);
    } catch (err) {
      setSubmitting(false);
      setError(err instanceof Error ? err.message : 'Error enviando código. Intenta de nuevo.');
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-8 text-center">
      <Card elevated className="mx-auto max-w-md">
        <div className="p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto mb-6">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-text mb-2">Confirma tu perfil</h2>
          <p className="text-sm text-text-secondary mb-8">
            Usa tu correo institucional universitario de Cali
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Correo institucional"
              type="email"
              placeholder="nombre.apellido@icesi.edu.co"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error ?? undefined}
              icon={<Mail className="h-4 w-4 text-text-secondary" />}
              disabled={submitting}
              autoComplete="email"
              required
            />

            <div className="space-y-1 text-left text-xs text-text-secondary bg-secondary/50 dark:bg-muted/20 p-3 rounded-xl border border-border dark:border-border-dark">
              <p className="font-semibold text-text mb-1 text-[11px] uppercase tracking-wider">Universidades admitidas:</p>
              {INSTITUTIONAL_DOMAINS.map((d) => (
                <div key={d.domain} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span className="truncate">@{d.domain} · {d.name}</span>
                </div>
              ))}
            </div>

            {error && (
              <p className="text-xs text-error animate-slide-up" role="alert">{error}</p>
            )}

            {!error && isValid && !submitting && (
              <p className="text-xs text-primary font-medium animate-slide-up">
                ✓ Dominio institucional admitido · listo para enviar código
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={submitting}
              disabled={submitting || !isValid}
            >
              {submitting
                ? 'Enviando código…'
                : isValid
                  ? 'Enviar código de verificación'
                  : 'Ingresa correo institucional'}
            </Button>
          </form>

          <p className="text-xs text-text-secondary mt-4">
            Recibirás un código seguro de 5 dígitos para validar tu cupo y PIN de abordaje.
          </p>
        </div>
      </Card>
    </div>
  );
}
