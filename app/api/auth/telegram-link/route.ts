import { NextRequest, NextResponse } from 'next/server';
import {
  getPendingLinks,
  setPendingLink,
  getLinkedUsers,
  setLinkedUser,
  deletePendingLink,
  generateCode,
  getApiUrl,
  hasBotConfigured,
} from '@/app/lib/telegram-store';

export async function GET(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get('uid');

  if (!uid) {
    return NextResponse.json({ error: 'UID requerido' }, { status: 400 });
  }

  // Verificar si ya está vinculado
  const linkedUsers = await getLinkedUsers();
  if (linkedUsers.has(uid)) {
    return NextResponse.json({
      linked: true,
      chatId: linkedUsers.get(uid),
    });
  }

  // Verificar si hay código pendiente
  const pendingLinks = await getPendingLinks();
  const pending = pendingLinks.get(uid);
  if (pending) {
    // Verificar expiración
    if (Date.now() > pending.expiresAt) {
      await deletePendingLink(uid);
      return NextResponse.json({ linked: false, expired: true });
    }

    // Si ya tiene chatId, el usuario ya interactuó con el bot
    if (pending.chatId) {
      return NextResponse.json({
        linked: false,
        pending: true,
        chatId: pending.chatId,
        message: 'Código enviado. Revisa Telegram.',
      });
    }

    return NextResponse.json({
      linked: false,
      pending: true,
      message: 'Sesión activa en espera de interacción.',
    });
  }

  return NextResponse.json({ linked: false, pending: false });
}

// Endpoint para verificar código OTP o reenviar
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { uid, code, action } = body;

    if (!uid) {
      return NextResponse.json({ error: 'UID requerido' }, { status: 400 });
    }

    // ACCIÓN: REENVIAR CÓDIGO
    if (action === 'resend') {
      const pendingLinks = await getPendingLinks();
      let pending = pendingLinks.get(uid);

      if (!pending) {
        // En modo demostración/dev, si expiró la sesión, crear una nueva de conveniencia
        const demoCode = generateCode();
        pending = {
          code: demoCode,
          chatId: 999999,
          expiresAt: Date.now() + 5 * 60 * 1000,
        };
        await setPendingLink(uid, pending);
      }

      const newCode = generateCode();
      const targetChatId = pending.chatId || 999999;

      await setPendingLink(uid, {
        code: newCode,
        chatId: targetChatId,
        expiresAt: Date.now() + 5 * 60 * 1000,
      });

      // Si el bot de Telegram está configurado y hay chatId real, enviar mensaje
      if (hasBotConfigured() && pending.chatId) {
        try {
          const apiUrl = getApiUrl();
          await fetch(`${apiUrl}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: pending.chatId,
              text: `🔐 <b>RutaCero [DEMO] - Nuevo código</b>\n\nTu código de verificación es: <code>${newCode}</code>\n\nExpira en <b>5 minutos</b>.`,
              parse_mode: 'HTML',
            }),
            signal: AbortSignal.timeout(6000),
          });
        } catch (fetchErr) {
          console.warn('[Telegram Link API] Error enviando mensaje a Telegram:', fetchErr);
        }
      } else {
        console.log(`[RutaCero Telegram Link] Nuevo código generado para UID ${uid}: ${newCode}`);
      }

      return NextResponse.json({ ok: true, devCode: newCode, message: 'Código reenviado' });
    }

    // ACCIÓN: VERIFICAR CÓDIGO
    if (!code) {
      return NextResponse.json({ error: 'Código requerido' }, { status: 400 });
    }

    const pendingLinks = await getPendingLinks();
    const pending = pendingLinks.get(uid);

    if (!pending) {
      return NextResponse.json({ valid: false, error: 'Sesión no encontrada o expirada. Solicita un nuevo código.' });
    }

    if (Date.now() > pending.expiresAt) {
      await deletePendingLink(uid);
      return NextResponse.json({ valid: false, error: 'Código expirado. Solicita uno nuevo.' });
    }

    if (pending.code === code.trim()) {
      // Código correcto: vincular permanentemente
      const resolvedChatId = pending.chatId || 999999;
      await setLinkedUser(uid, resolvedChatId);
      await deletePendingLink(uid);

      // Notificar al usuario en Telegram si está conectado
      if (hasBotConfigured() && pending.chatId) {
        try {
          const apiUrl = getApiUrl();
          await fetch(`${apiUrl}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: pending.chatId,
              text: `✅ <b>¡Cuenta de RutaCero vinculada con éxito!</b>\n\nRecibirás las notificaciones de tus rutas, PINs de abordaje y alertas de tus viajes aquí.`,
              parse_mode: 'HTML',
            }),
            signal: AbortSignal.timeout(5000),
          });
        } catch {
          /* ignore non-critical notification error */
        }
      }

      return NextResponse.json({
        valid: true,
        chatId: resolvedChatId,
        message: 'Cuenta vinculada correctamente',
      });
    }

    return NextResponse.json({ valid: false, error: 'Código incorrecto. Verifica e intenta de nuevo.' });
  } catch (error) {
    console.error('[Telegram Link Error]:', error);
    return NextResponse.json({ valid: false, error: 'Error procesando solicitud' }, { status: 500 });
  }
}
