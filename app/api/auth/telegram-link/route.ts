import { NextRequest, NextResponse } from 'next/server';
import { pendingLinks, linkedUsers, generateCode, getApiUrl } from '@/app/lib/telegram-store';

export async function GET(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get('uid');

  if (!uid) {
    return NextResponse.json({ error: 'UID requerido' }, { status: 400 });
  }

  // Verificar si ya está vinculado
  if (linkedUsers.has(uid)) {
    return NextResponse.json({
      linked: true,
      chatId: linkedUsers.get(uid)
    });
  }

  // Verificar si hay código pendiente (usuario abrió Telegram pero no envió /start)
  const pending = pendingLinks.get(uid);
  if (pending) {
    // Verificar expiración
    if (Date.now() > pending.expiresAt) {
      pendingLinks.delete(uid);
      return NextResponse.json({ linked: false, expired: true });
    }

    // Si ya tiene chatId, el usuario ya interactuó
    if (pending.chatId) {
      return NextResponse.json({
        linked: false,
        pending: true,
        message: 'Código enviado. Revisa Telegram.'
      });
    }
  }

  return NextResponse.json({ linked: false, pending: false });
}

// Endpoint para verificar código OTP (desde OnboardingVerify)
export async function POST(req: NextRequest) {
  try {
    const { uid, code, action } = await req.json();

    if (!uid) {
      return NextResponse.json({ error: 'UID requerido' }, { status: 400 });
    }

    // Acción: reenviar código
    if (action === 'resend') {
      const pending = pendingLinks.get(uid);

      if (!pending) {
        return NextResponse.json({ error: 'Sesión expirada. Vuelve a iniciar.' }, { status: 400 });
      }

      if (!pending.chatId) {
        return NextResponse.json({ error: 'Usuario no ha interactuado con el bot aún.' }, { status: 400 });
      }

      // Generar nuevo código
      const newCode = generateCode();
      pendingLinks.set(uid, {
        code: newCode,
        chatId: pending.chatId,
        expiresAt: Date.now() + 5 * 60 * 1000,
      });

      // Enviar por Telegram
      await fetch(`${getApiUrl()}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: pending.chatId,
          text: `🔐 <b>Nuevo código de verificación</b>\n\nTu código: <code>${newCode}</code>\n\nExpira en <b>5 minutos</b>.`,
          parse_mode: 'HTML',
        }),
      });

      return NextResponse.json({ ok: true, message: 'Código reenviado' });
    }

    // Acción: verificar código
    if (!code) {
      return NextResponse.json({ error: 'Código requerido' }, { status: 400 });
    }

    const pending = pendingLinks.get(uid);

    if (!pending) {
      return NextResponse.json({ valid: false, error: 'Sesión expirada. Solicita nuevo código.' });
    }

    if (Date.now() > pending.expiresAt) {
      pendingLinks.delete(uid);
      return NextResponse.json({ valid: false, error: 'Código expirado. Solicita uno nuevo.' });
    }

    if (pending.code === code) {
      // ¡Código correcto! Vincular permanentemente
      if (pending.chatId) {
        linkedUsers.set(uid, pending.chatId);
      }
      pendingLinks.delete(uid);

      return NextResponse.json({
        valid: true,
        message: 'Cuenta vinculada correctamente'
      });
    }

    return NextResponse.json({ valid: false, error: 'Código incorrecto' });
  } catch {
    return NextResponse.json({ valid: false, error: 'Error de servidor' }, { status: 500 });
  }
}