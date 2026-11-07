import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Rate limit en memoria (para producción usar Upstash Redis)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(key: string, maxRequests = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

// Códigos temporales en memoria (producción: Redis con TTL 5 min)
const codeStore = new Map<string, { code: string; expiresAt: number }>();

function generateCode(): string {
  return Math.floor(10000 + Math.random() * 90000).toString(); // 5 dígitos
}

function storeCode(email: string, code: string): void {
  codeStore.set(email.toLowerCase(), {
    code,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutos
  });
}

function verifyCode(email: string, code: string): boolean {
  const record = codeStore.get(email.toLowerCase());
  if (!record) return false;
  if (Date.now() > record.expiresAt) {
    codeStore.delete(email.toLowerCase());
    return false;
  }
  const valid = record.code === code;
  if (valid) codeStore.delete(email.toLowerCase()); // Un solo uso
  return valid;
}

// Inicializar Resend solo si hay API key
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: NextRequest) {
  try {
    const { email, action } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    const emailLower = email.toLowerCase();
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const rateLimitKey = `${ip}:${emailLower}`;

    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { error: 'Demasiados intentos. Espera 1 minuto.' },
        { status: 429 }
      );
    }

    if (action === 'verify') {
      // Verificar código
      const { code } = await req.json();
      if (!code || code.length !== 5) {
        return NextResponse.json({ error: 'Código debe tener 5 dígitos' }, { status: 400 });
      }

      const valid = verifyCode(emailLower, code);
      return NextResponse.json({ valid });
    }

    // Enviar código (acción por defecto)
    const code = generateCode();
    storeCode(emailLower, code);

    // Si no hay Resend configurado, modo desarrollo: log en consola
    if (!resend) {
      console.log(`[DEV MODE] Código para ${email}: ${code}`);
      return NextResponse.json({
        ok: true,
        devCode: code, // Solo en desarrollo
        message: 'Código enviado (modo desarrollo - revisa consola del servidor)'
      });
    }

    // Enviar con Resend
    const { data, error } = await resend.emails.send({
      from: 'RutaCero <codigo@rutacero.co>',
      to: email,
      subject: 'Tu código de verificación RutaCero',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0B7CC0 0%, #22D3EE 100%); border-radius: 16px; padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0 0 8px; font-size: 24px;">RutaCero</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 14px;">Verificación de cuenta</p>
          </div>
          <div style="background: #f8fafc; border-radius: 16px; padding: 32px; margin-top: 16px; border: 1px solid #e2e8f0;">
            <p style="font-size: 16px; margin: 0 0 16px;">Tu código de verificación es:</p>
            <div style="background: #0B7CC0; color: white; font-size: 32px; font-weight: 700; letter-spacing: 8px; padding: 20px; border-radius: 12px; font-family: 'JetBrains Mono', monospace; margin: 16px 0;">
              ${code}
            </div>
            <p style="font-size: 14px; color: #64748b; margin: 16px 0 0;">
              Expira en <strong>5 minutos</strong>. No compartas este código con nadie.
            </p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
            <p style="font-size: 12px; color: #94a3b8; margin: 0;">
              Si no solicitaste este código, ignora este correo. RutaCero nunca te pedirá tu código por teléfono o WhatsApp.
            </p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Error enviando email' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, messageId: data?.id });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}