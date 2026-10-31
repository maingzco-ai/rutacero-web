'use client';

import { useEffect, useState } from 'react';
import { Mail, ShieldCheck } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { validation } from '@/app/lib/design-system';

const INSTITUTIONAL_DOMAINS = [
  { domain: 'icesi.edu.co', name: 'Universidad Icesi' },
  { domain: 'u.icesi.edu.co', name: 'Universidad Icesi (u.icesi.edu.co)' },
  { domain: 'javerianacali.edu.co', name: 'Pontificia Universidad Javeriana Cali' },
  { domain: 'uao.edu.co', name: 'Universidad Autónoma de Occidente (UAO)' },
];

export function OnboardingEmail({ onConfirm }: { onConfirm: (email: string) => void }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setError(null);
    if (!email.trim()) {
      setIsValid(false);
      return;
    }
    const normalized = email.trim().toLowerCase();
    const domain = INSTITUTIONAL_DOMAINS.find((d) => normalized.endsWith('@' + d.domain));
    setIsValid(!!domain);
  }, [email]);

  // Auto-avance cuando el correo es válido y el usuario deja de escribir
  useEffect(() => {
    if (!isValid || submitting) return;
    const timer = setTimeout(() => {
      const normalized = email.trim().toLowerCase();
      onConfirm(normalized);
    }, 1500);
    return () => clearTimeout(timer);
  }, [email, isValid, submitting, onConfirm]);

  const handleSubmit = (event: React.FormEvent) => {
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
        'Solo se permiten correos institucionales de Cali (@icesi.edu.co, @u.icesi.edu.co, @javerianacali.edu.co, @uao.edu.co). No se aceptan Gmail ni otros correos personales.',
      );
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onConfirm(normalized);
    }, 600);
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
              placeholder="tu nombre @icesi.edu.co"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error ?? undefined}
              icon={<Mail className="h-4 w-4 text-text-secondary" />}
              disabled={submitting}
              autoComplete="email"
              required
            />

            <div className="space-y-1 text-xs text-text-secondary">
              {INSTITUTIONAL_DOMAINS.map((d) => (
                <div key={d.domain} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>@{d.domain} · {d.name}</span>
                </div>
              ))}
            </div>

            {error && (
              <p className="text-xs text-error animate-slide-up">{error}</p>
            )}

            {!error && isValid && (
              <p className="text-xs text-primary font-medium animate-slide-up">
                Correo válido · validando…
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={submitting}
              disabled={submitting || !isValid}
            >
              {isValid ? 'Validar correo' : 'Correo inválido'}
            </Button>
          </form>

          <p className="text-xs text-text-secondary mt-4">
            Solo correos institucionales. No se aceptan @gmail.com ni correos personales.
          </p>
        </div>
      </Card>
    </div>
  );
}
