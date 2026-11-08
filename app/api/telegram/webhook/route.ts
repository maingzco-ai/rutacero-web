import { NextRequest, NextResponse } from 'next/server';
import {
  setPendingLink,
  getLinkedUsers,
  deleteLinkedUser,
  generateCode,
  getApiUrl,
  hasBotConfigured,
} from '@/app/lib/telegram-store';

export async function POST(req: NextRequest) {
  try {
    // Validación opcional de token secreto configurado en el webhook de Telegram
    const secretHeader = req.headers.get('x-telegram-bot-api-secret-token');
    const configuredSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
    if (configuredSecret && secretHeader && secretHeader !== configuredSecret) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const update = await req.json();

    // Procesar mensaje entrante
    if (update.message) {
      const { message } = update;
      const chatId = message.chat?.id;
      const text = (message.text || '').trim();

      if (!chatId) {
        return NextResponse.json({ ok: true });
      }

      const linkedUsers = await getLinkedUsers();

      // 1. Comando /start UID → vincular cuenta desde la aplicación
      if (text.startsWith('/start')) {
        const parts = text.split(' ');
        const uid = parts[1]?.trim();

        if (uid && uid.length >= 8) {
          const code = generateCode();

          await setPendingLink(uid, {
            code,
            chatId,
            expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutos de vigencia
          });

          await sendTelegramMessage(
            chatId,
            `🔐 <b>RutaCero · Código de verificación</b>\n\n` +
            `Tu código es: <code>${code}</code>\n\n` +
            `⏱ Expira en <b>5 minutos</b>.\n` +
            `Ingrésalo en la aplicación para activar tus notificaciones.\n\n` +
            `— Equipo RutaCero Cali`
          );
        } else {
          await sendTelegramMessage(
            chatId,
            `👋 <b>¡Bienvenido al Bot Oficial de RutaCero!</b>\n\n` +
            `Para vincular tu cuenta:\n` +
            `1. Abre la app RutaCero en tu navegador.\n` +
            `2. Selecciona <b>"Continuar con Telegram"</b>.\n` +
            `3. Pulsa el enlace que te redirigirá a este chat con tu código personal.\n\n` +
            `Comandos disponibles:\n` +
            `• <b>/codigo</b> - Solicitar nuevo código OTP\n` +
            `• <b>/desvincular</b> - Desconectar tu cuenta\n` +
            `• <b>/ayuda</b> - Ver instrucciones\n\n` +
            `— RutaCero: Movilidad universitaria segura en Cali`
          );
        }
      }

      // 2. Comando /codigo para reenviar código de verificación
      else if (text === '/codigo' || text === '/code') {
        let foundUid: string | null = null;
        for (const [uid, storedChatId] of linkedUsers.entries()) {
          if (storedChatId === chatId) {
            foundUid = uid;
            break;
          }
        }

        const activeUid = foundUid || `session-${chatId}`;
        const code = generateCode();

        await setPendingLink(activeUid, {
          code,
          chatId,
          expiresAt: Date.now() + 5 * 60 * 1000,
        });

        await sendTelegramMessage(
          chatId,
          `🔐 <b>Nuevo código de verificación</b>\n\n` +
          `Tu código OTP: <code>${code}</code>\n\n` +
          `Expira en <b>5 minutos</b>.`
        );
      }

      // 3. Comando /desvincular
      else if (text === '/desvincular' || text === '/unlink') {
        let foundUid: string | null = null;
        for (const [uid, storedChatId] of linkedUsers.entries()) {
          if (storedChatId === chatId) {
            foundUid = uid;
            break;
          }
        }

        if (foundUid) {
          await deleteLinkedUser(foundUid);
          await sendTelegramMessage(chatId, `✅ Tu cuenta ha sido desvinculada correctamente de RutaCero.`);
        } else {
          await sendTelegramMessage(chatId, `ℹ️ No encontramos una cuenta vinculada a este usuario de Telegram.`);
        }
      }

      // 4. Comando /ayuda
      else if (text === '/ayuda' || text === '/help') {
        await sendTelegramMessage(
          chatId,
          `🤖 <b>RutaCero Bot - Asistente de Viajes</b>\n\n` +
          `<b>Comandos:</b>\n` +
          `• <b>/codigo</b> - Generar nuevo código OTP\n` +
          `• <b>/desvincular</b> - Desconectar tu cuenta\n` +
          `• <b>/ayuda</b> - Mostrar esta información\n\n` +
          `📱 <b>Notificaciones integradas:</b>\n` +
          `• Reserva confirmada + PIN de abordaje\n` +
          `• Asignación de conductor y placa del vehículo\n` +
          `• Recordatorio 10 minutos antes de la recogida\n` +
          `• Viaje completado y calificación justa\n\n` +
          `¿Preguntas o soporte? Escríbenos a <b>soporte@rutacero.co</b>`
        );
      }
    }

    // Procesar callback queries (botones interactivos en mensajes de Telegram)
    if (update.callback_query) {
      const { callback_query } = update;
      const callbackId = callback_query.id;

      if (hasBotConfigured() && callbackId) {
        try {
          const apiUrl = getApiUrl();
          await fetch(`${apiUrl}/answerCallbackQuery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ callback_query_id: callbackId }),
            signal: AbortSignal.timeout(5000),
          });
        } catch {
          /* ignore callback query response error */
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[Telegram Webhook Error]:', error);
    // Siempre retornar 200 para evitar reintentos infinitos de Telegram
    return NextResponse.json({ ok: false, error: 'Procesado con observaciones' }, { status: 200 });
  }
}

// GET para verificación de estado del webhook
export async function GET() {
  const configured = hasBotConfigured();
  return NextResponse.json({
    status: configured ? 'ok' : 'demo_mode',
    service: 'RutaCero Telegram Webhook',
    botConfigured: configured,
    timestamp: new Date().toISOString(),
  });
}

async function sendTelegramMessage(chatId: number, text: string): Promise<boolean> {
  if (!hasBotConfigured()) {
    console.log(`[RutaCero Telegram Simulado -> Chat ${chatId}]:\n${text}`);
    return true;
  }

  try {
    const apiUrl = getApiUrl();
    const res = await fetch(`${apiUrl}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok;
  } catch (err) {
    console.warn('[Telegram Webhook] Error al enviar mensaje:', err);
    return false;
  }
}
