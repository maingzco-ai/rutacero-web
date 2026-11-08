import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Store global para desarrollo y persistencia en memoria
declare global {
  var __rc_rate_limit: Map<string, { count: number; resetAt: number }> | undefined;
  var __rc_code_store: Map<string, { code: string; expiresAt: number }> | undefined;
}

if (!globalThis.__rc_rate_limit) {
  globalThis.__rc_rate_limit = new Map<string, { count: number; resetAt: number }>();
}
if (!globalThis.__rc_code_store) {
  globalThis.__rc_code_store = new Map<string, { code: string; expiresAt: number }>();
}

const rateLimitMap = globalThis.__rc_rate_limit;
const codeStore = globalThis.__rc_code_store;

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

// Inicializar Resend solo si hay API key válida
const resendApiKey = process.env.RESEND_API_KEY;
const isResendConfigured = Boolean(
  resendApiKey && !resendApiKey.includes('xxxxxxxx') && resendApiKey.startsWith('re_')
);
const resend = isResendConfigured ? new Resend(resendApiKey) : null;

// Remitente: Resend requiere dominio verificado o onboarding@resend.dev en pruebas
const DEFAULT_FROM = process.env.EMAIL_FROM || (isResendConfigured ? 'RutaCero <onboarding@resend.dev>' : 'RutaCero <soporte@rutacero.co>');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, action, code: inputCode } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    const emailLower = email.toLowerCase().trim();
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

    // 1. VERIFICAR CÓDIGO
    if (action === 'verify') {
      const verifyLimitKey = `verify:${ip}:${emailLower}`;
      if (!checkRateLimit(verifyLimitKey, 10, 60_000)) {
        return NextResponse.json(
          { error: 'Demasiados intentos fallidos. Espera 1 minuto.' },
          { status: 429 }
        );
      }

      if (!inputCode || typeof inputCode !== 'string' || inputCode.length !== 5) {
        return NextResponse.json({ error: 'Código debe tener 5 dígitos' }, { status: 400 });
      }

      const valid = verifyCode(emailLower, inputCode.trim());
      return NextResponse.json({
        valid,
        error: valid ? undefined : 'Código incorrecto o expirado'
      });
    }

    // 2. ENVIAR O REENVIAR CÓDIGO
    const sendLimitKey = `send:${ip}:${emailLower}`;
    if (!checkRateLimit(sendLimitKey, 5, 60_000)) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes de código. Espera 1 minuto antes de reintentar.' },
        { status: 429 }
      );
    }

    const newCode = generateCode();
    storeCode(emailLower, newCode);

    // MODO DESARROLLO / DEMO (Sin Resend o en entorno local)
    if (!resend) {
      console.log(`[RutaCero Auth] Código OTP generado para ${emailLower}: ${newCode}`);
      return NextResponse.json({
        ok: true,
        devCode: newCode,
        message: 'Código generado en modo demostración/desarrollo.',
      });
    }

    // ENVIAR VÍA RESEND
    try {
      const emailHtml = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Código de verificación RutaCero</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #0F172A; max-width: 580px; margin: 0 auto; padding: 24px; background-color: #F8FAFC;">
          <div style="background: linear-gradient(135deg, #0B7CC0 0%, #085E9A 100%); border-radius: 16px; padding: 32px; text-align: center; color: white;">
            <div style="display: inline-block; background: rgba(255,255,255,0.15); border-radius: 9999px; padding: 6px 14px; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;">RUTACERO · CALI</div>
            <h1 style="color: white; margin: 0 0 6px; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">RutaCero</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 14px;">Movilidad Universitaria Cali</p>
          </div>
          <div style="background: #FFFFFF; border-radius: 16px; padding: 32px; margin-top: 16px; border: 1px solid #CBD5E1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
            <p style="font-size: 16px; margin: 0 0 16px; font-weight: 600; color: #0F172A;">Tu código de verificación de 5 dígitos es:</p>
            <div style="background: #F1F5F9; border: 2px dashed #0B7CC0; color: #0B7CC0; font-size: 34px; font-weight: 800; letter-spacing: 10px; padding: 20px; border-radius: 12px; font-family: 'JetBrains Mono', Courier, monospace; text-align: center; margin: 20px 0;">
              ${newCode}
            </div>
            <p style="font-size: 14px; color: #64748B; margin: 16px 0 0; text-align: center;">
              Expira en <strong>5 minutos</strong>. No compartas este código con nadie.
            </p>
            <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 24px 0;">
            <p style="font-size: 12px; color: #94A3B8; margin: 0; text-align: center;">
              Si no solicitaste este código, ignora este mensaje. RutaCero nunca te pedirá tu código por llamada o redes sociales.
            </p>
          </div>
        </body>
        </html>
      `;

      const { data, error } = await resend.emails.send({
        from: DEFAULT_FROM,
        to: emailLower,
        subject: `${newCode} es tu código de verificación RutaCero`,
        html: emailHtml,
      });

      if (error) {
        console.warn('[Resend Warning] Error de entrega vía Resend:', error);
        // Fallback para permitir continuar la prueba si el dominio no está verificado en Resend
        return NextResponse.json({
          ok: true,
          devCode: newCode,
          message: 'Código generado (aviso de servicio de correo, código disponible para prueba).',
        });
      }

      return NextResponse.json({ ok: true, messageId: data?.id });
    } catch (sendError) {
      console.warn('[Resend Exception]:', sendError);
      return NextResponse.json({
        ok: true,
        devCode: newCode,
        message: 'Código generado correctamente.',
      });
    }
  } catch (error) {
    console.error('[API Send-Code Error]:', error);
    return NextResponse.json({ error: 'Error interno en el servicio de autenticación' }, { status: 500 });
  }
}
