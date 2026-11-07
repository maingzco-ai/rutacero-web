'use client';

import { useState } from 'react';
import { cn } from '@/app/lib/design-system';

const TERMINOS_VERSION = '1.0';
const TERMINOS_FECHA = '2026-01-15';

export function TerminosCondiciones() {
  const [aceptado, setAceptado] = useState(false);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-text">Términos y Condiciones de Uso</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Versión {TERMINOS_VERSION} · Vigente desde {new Date(TERMINOS_FECHA).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </header>

      <article className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <section>
          <h2>1. Identificación del Responsable</h2>
          <p>RutaCero (en adelante, "la Plataforma") es un servicio de intermediación tecnológica para carpooling (viajes compartidos) operado por:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Denominación social:</strong> RutaCero S.A.S.</li>
            <li><strong>NIT:</strong> 900.XXX.XXX-X</li>
            <li><strong>Domicilio:</strong> Cali, Valle del Cauca, Colombia</li>
            <li><strong>Correo de notificaciones:</strong> legal@rutacero.co</li>
            <li><strong>Oficial de Privacidad:</strong> privacy@rutacero.co</li>
          </ul>
        </section>

        <section>
          <h2>2. Objeto y Alcance</h2>
          <p>Estos Términos regulan el acceso y uso de la Plataforma (aplicación web y móvil) que conecta conductores con cupos disponibles y pasajeros que buscan traslados en el corredor universitario de Cali y zonas aledañas. Al registrarse o utilizar la Plataforma, el Usuario acepta íntegramente estos Términos y la <a href="/legal/politica-privacidad" className="text-primary underline">Política de Privacidad</a>.</p>
        </section>

        <section>
          <h2>3. Definiciones</h2>
          <dl className="space-y-3 mt-2">
            <dt className="font-semibold">Usuario</dt>
            <dd>Persona natural mayor de 18 años que se registra y usa la Plataforma.</dd>
            <dt className="font-semibold">Conductor</dt>
            <dd>Usuario que publica una ruta y ofrece cupos en su vehículo particular.</dd>
            <dt className="font-semibold">Pasajero</dt>
            <dd>Usuario que reserva un cupo en una ruta publicada.</dd>
            <dt className="font-semibold">Ruta</dt>
            <dd>Tramo definido por origen, destino, hora de salida, vehículo y cupos ofertados.</dd>
            <dt className="font-semibold">Reserva</dt>
            <dd>Acuerdo vinculante entre Conductor y Pasajero mediado por la Plataforma.</dd>
            <dt className="font-semibold">PIN</dt>
            <dd>Código único de 4 dígitos (formato RC-XXXX) generado al confirmar la reserva.</dd>
          </dl>
        </section>

        <section>
          <h2>4. Requisitos de Registro</h2>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>Ser mayor de 18 años y tener capacidad legal para contratar.</li>
            <li>Correo institucional válido de universidad aliada (@icesi.edu.co, @javerianacali.edu.co, @uao.edu.co, @correounivalle.edu.co) o verificación de identidad alternativa.</li>
            <li>Número de WhatsApp colombiano (+57 3XX XXX XXXX) verificado mediante OTP.</li>
            <li>Conductores: licencia de conducción vigente (categoría B1 mínimo), SOAT y revisión técnico-mecánica al día del vehículo declarado.</li>
            <li>Un solo perfil por persona; está prohibido crear cuentas duplicadas o ceder la cuenta a terceros.</li>
          </ul>
        </section>

        <section>
          <h2>5. Funcionamiento del Servicio</h2>
          <h3 className="font-semibold mt-4">5.1 Publicación de rutas (Conductor)</h3>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>El Conductor define origen, destino, hora, vehículo, placa y cupos (1-8).</li>
            <li>La tarifa por pasajero se calcula automáticamente: <code>min($5.000, max($4.500, $15.000 / cupos))</code>.</li>
            <li>La ruta queda visible en búsquedas y puede ser reservada instantáneamente.</li>
            <li>El Conductor puede cancelar la ruta hasta 30 min antes de la salida; cancelaciones tardías generan penalidad (ver §8).</li>
          </ul>

          <h3 className="font-semibold mt-4">5.2 Reserva de cupos (Pasajero)</h3>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>El Pasajero selecciona ruta, punto de recogida y preferencia (ej. "ventana", "silencio").</li>
            <li>Al confirmar, se genera PIN y se descuenta el valor del saldo/billetera.</li>
            <li>El PIN debe mostrarse al Conductor al abordar; sin PIN no hay obligación de transportar.</li>
            <li>Una reserva activa por viaje por usuario; no se permite doble reserva.</li>
          </ul>

          <h3 className="font-semibold mt-4">5.3 Comunicación y coordinación</h3>
          <p>La Plataforma provee chat interno para coordinar detalles (punto exacto, demoras). Está prohibido compartir datos de contacto personales (teléfono, WhatsApp) antes de la reserva confirmada por seguridad.</p>
        </section>

        <section>
          <h2>6. Pagos y Tarifas</h2>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li><strong>Tarifa justa:</strong> Se divide el costo estimado del viaje entre todos los ocupantes (conductor incluido). La Plataforma no cobra comisión en la versión MVP.</li>
            <li><strong>Métodos de pago:</strong> Efectivo al conductor (validado con PIN), Nequi, DaviPlata, tarjeta débito/crédito (Stripe Connect - próximamente).</li>
            <li><strong>Reembolsos:</strong> Si el Conductor no se presenta o cancela <code>30 min</code>, reembolso automático + $2.000 COP compensación. Si el Pasajero no aborda, no hay reembolso salvo fuerza mayor (ver §10).</li>
            <li><strong>Saldo en billetera:</strong> Los abonos y cargos se reflejan en tiempo real; no expira.</li>
          </ul>
        </section>

        <section>
          <h2>7. Obligaciones de las Partes</h2>
          <h3 className="font-semibold mt-4">7.1 Conductores</h3>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Conducir con prudencia, respetar normas de tránsito (Ley 769/2002) y límites de velocidad.</li>
            <li>Vehículo en condiciones mecánicas seguras, limpio, con SOAT y técnico-mecánica vigentes.</li>
            <li>No exceder la capacidad de pasajeros declarada; uso obligatorio de cinturón de seguridad.</li>
            <li>Recoger y dejar en los puntos acordados; esperas máx. 5 min sin cargo extra.</li>
            <li>No consumir alcohol, sustancias psicoactivas ni fumar/vapear durante el servicio.</li>
          </ul>

          <h3 className="font-semibold mt-4">7.2 Pasajeros</h3>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Llegar puntual al punto de recogida; notificar demoras por chat.</li>
            <li>Trato respetuoso al conductor y demás pasajeros; cero tolerancia a acoso, discriminación o violencia.</li>
            <li>Cuidar el vehículo; daños intencionales serán cobrados al responsable.</li>
            <li>Usar cinturón de seguridad; no distraer al conductor.</li>
          </ul>

          <h3 className="font-semibold mt-4">7.3 RutaCero</h3>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Mantener la Plataforma operativa 99.5% uptime mensual (excluye mantenimiento programado).</li>
            <li>Verificar documentos de conductores (licencia, SOAT, técnico-mecánica) antes de activar perfil.</li>
            <li>Proteger datos personales conforme Ley 1581/2012 (ver Política de Privacidad).</li>
            <li>Mecanismos de reporte: botón SOS en viaje, chat soporte 24/7, correo safety@rutacero.co.</li>
          </ul>
        </section>

        <section>
          <h2>8. Penalizaciones y Suspensión</h2>
          <table className="w-full text-sm mt-2 border-collapse">
            <thead>
              <tr className="bg-secondary dark:bg-muted/30">
                <th className="p-2 text-left border">Falta</th>
                <th className="p-2 text-left border">Sanción</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t"><td className="p-2 border">No-show conductor (sin aviso)</td><td className="p-2 border">Suspensión 7 días + reembolso + $5.000 COP a cada pasajero</td></tr>
              <tr className="border-t"><td className="p-2 border">Cancelación <code>30 min</code> (conductor)</td><td className="p-2 border">$3.000 COP penalidad + reembolso</td></tr>
              <tr className="border-t"><td className="p-2 border">No-show pasajero</td><td className="p-2 border">Sin reembolso; 3 faltas = suspensión 30 días</td></tr>
              <tr className="border-t"><td className="p-2 border">Conducta insegura / acoso</td><td className="p-2 border">Suspensión inmediata indefinida + reporte autoridades</td></tr>
              <tr className="border-t"><td className="p-2 border">Documentos vencidos (conductor)</td><td className="p-2 border">Perfil desactivado hasta regularizar</td></tr>
            </tbody>
          </table>
          <p className="mt-3 text-sm">RutaCero se reserva el derecho de suspender o eliminar cuentas que violen estos Términos, la ley colombiana o pongan en riesgo la comunidad.</p>
        </section>

        <section>
          <h2>9. Responsabilidad y Seguros</h2>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>RutaCero es <strong>intermediario tecnológico</strong> (Ley 1480/2011 Art. 25); no es transportador ni empleador de conductores.</li>
            <li>El Conductor es responsable civil por daños a pasajeros y terceros (Art. 2354 C.C.). Debe mantener SOAT vigente y se recomienda póliza RC Contractual.</li>
            <li>RutaCero no responde por: retrasos por tráfico, condiciones climáticas, fallas mecánicas, actos de terceros, fuerza mayor.</li>
            <li>Límite de responsabilidad de RutaCero: hasta el valor de la reserva en disputa.</li>
          </ul>
        </section>

        <section>
          <h2>10. Fuerza Mayor</h2>
          <p>Ninguna parte responde por incumplimientos causados por eventos imprevisibles e irresistibles: desastres naturales, disturbios, decisiones gubernamentales, pandemias, cortes de energía/internet prolongados. La parte afectada notificará a la otra en 48h.</p>
        </section>

        <section>
          <h2>11. Propiedad Intelectual</h2>
          <p>La Plataforma, marca RutaCero, logo, código, diseños y contenidos son propiedad exclusiva de RutaCero S.A.S. Está prohibida su reproducción, ingeniería inversa o uso comercial sin autorización escrita.</p>
        </section>

        <section>
          <h2>12. Datos Personales y Comunicaciones (Ley 1581/2012, Ley 527/1999)</h2>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>Al registrarse, el Usuario <strong>autoriza expresamente</strong> el tratamiento de sus datos para: prestar el servicio, seguridad, prevención de fraude, mejorar la experiencia, enviar comunicaciones transaccionales (reservas, pagos, PIN, alertas de seguridad).</li>
            <li><strong>Comunicaciones comerciales/promocionales:</strong> Requieren consentimiento previo, libre, informado y específico (opt-in). El Usuario puede revocarlo en cualquier momento desde <code>Configuración / Notificaciones</code> o respondiendo "STOP" a cualquier WhatsApp/SMS.</li>
            <li>Derechos ARCO (Acceso, Rectificación, Cancelación, Oposición): escribir a privacy@rutacero.co. Respuesta en 15 días hábiles (Ley 1581 Art. 14).</li>
            <li>Oficial de Privacidad: privacy@rutacero.co | Tel: +57 2 888 XXXX.</li>
            <li>Datos se conservan mientras la cuenta esté activa y 2 años tras cierre (Ley 1480 Art. 25).</li>
          </ul>
        </section>

        <section>
          <h2>13. Modificaciones</h2>
          <p>RutaCero puede actualizar estos Términos notificando con 15 días de antelación por correo y notificación in-app. El uso continuado tras la vigencia implica aceptación. Versiones anteriores archivadas en /legal/historial.</p>
        </section>

        <section>
          <h2>14. Ley Aplicable y Jurisdicción</h2>
          <p>Estos Términos se rigen por la ley de la República de Colombia. Controversias se someterán a los jueces de la República, con domicilio en Cali, Valle del Cauca, sin perjuicio de mecanismos alternativos de solución de conflictos (Ley 640/2001).</p>
        </section>

        <section>
          <h2>15. Contacto</h2>
          <address className="not-italic mt-2 space-y-1">
            <p><strong>RutaCero S.A.S.</strong></p>
            <p>Cali, Valle del Cauca, Colombia</p>
            <p>Soporte: soporte@rutacero.co</p>
            <p>Seguridad: safety@rutacero.co</p>
            <p>Privacidad: privacy@rutacero.co</p>
            <p>Notificaciones judiciales: legal@rutacero.co</p>
          </address>
        </section>
      </article>

      <div className="mt-8 pt-6 border-t border-border">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={aceptado}
            onChange={(e) => setAceptado(e.target.checked)}
            className={cn('mt-1 h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/50')}
            required
          />
          <span className="text-sm text-text">
            He leído, entiendo y acepto los <strong>Términos y Condiciones</strong> y la <a href="/legal/politica-privacidad" className="text-primary underline">Política de Privacidad</a> de RutaCero.
          </span>
        </label>
        <p className="mt-3 text-xs text-text-secondary">
          Al aceptar, autorizas el tratamiento de tus datos personales conforme a la Ley 1581/2012 y recibes comunicaciones transaccionales necesarias para el servicio. Las comunicaciones promocionales requieren opt-in separado en Configuración.
        </p>
      </div>
    </div>
  );
}