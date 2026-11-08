'use client';

const POLITICA_VERSION = '1.0';
const POLITICA_FECHA = '2026-01-15';

export function PoliticaPrivacidad() {
  return (
    <div>
      <header className="mb-8 border-b border-white/[0.08] pb-6">
        <p className="hud mb-3 text-[7.5px]">Privacidad · habeas data</p>
        <h1 className="display text-[1.9rem] leading-tight text-text sm:text-[2.4rem]">
          Privacidad y Tratamiento de Datos
        </h1>
        <p className="mt-3 font-mono text-[9px] text-text-secondary/60">
          Versión {POLITICA_VERSION} · Vigente desde {new Date(POLITICA_FECHA).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </header>

      <article className="legal-prose">
        <section>
          <h2>1. Responsable del Tratamiento</h2>
          <p>De conformidad con la Ley 1581/2012 y el Decreto 1377/2013, le informamos que el responsable del tratamiento de sus datos personales es:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Razón social:</strong> RutaCero S.A.S.</li>
            <li><strong>NIT:</strong> 900.XXX.XXX-X</li>
            <li><strong>Dirección:</strong> Cali, Valle del Cauca, Colombia</li>
            <li><strong>Correo Oficial de Privacidad:</strong> <a href="mailto:privacy@rutacero.co" className="text-primary underline">privacy@rutacero.co</a></li>
            <li><strong>Teléfono:</strong> +57 2 888 XXXX</li>
          </ul>
        </section>

        <section>
          <h2>2. Finalidades del Tratamiento</h2>
          <p>Sus datos personales serán tratados para las siguientes finalidades, todas necesarias y proporcionadas al servicio:</p>

          <h3 className="font-semibold mt-4">2.1 Finalidades Contractuales (Base legal: ejecución del contrato)</h3>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Registro, autenticación y gestión de cuenta (correo, WhatsApp, OTP).</li>
            <li>Publicación y búsqueda de rutas (origen, destino, preferencias).</li>
            <li>Gestión de reservas: generación de PIN, coordinación conductor-pasajero, chat interno.</li>
            <li>Procesamiento de pagos y billetera (saldo, movimientos, reembolsos).</li>
            <li>Verificación de documentos conductores (licencia, SOAT, técnico-mecánica).</li>
            <li>Notificaciones transaccionales: confirmaciones, recordatorios, alertas de seguridad, cambios de estado.</li>
          </ul>

          <h3 className="font-semibold mt-4">2.2 Finalidades de Seguridad y Prevención de Fraude (Interés legítimo)</h3>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Detección de cuentas duplicadas, suplantación, uso de bots.</li>
            <li>Monitoreo de patrones anómalos (cancelaciones masivas, no-shows, coordenadas falsas).</li>
            <li>Botón SOS y compartir ubicación en tiempo real con contactos de confianza (opt-in).</li>
            <li>Cumplimiento obligaciones legales: reporte a autoridades ante incidentes graves.</li>
          </ul>

          <h3 className="font-semibold mt-4">2.3 Finalidades de Mejora del Servicio (Interés legítimo / Consentimiento)</h3>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Analítica de uso anonimizada: flujos, tiempos, conversión, retención (Mixpanel/PostHog).</li>
            <li>Encuestas de satisfacción (NPS) y soporte proactivo.</li>
            <li>Optimización de matching de rutas y pricing dinámico.</li>
          </ul>

          <h3 className="font-semibold mt-4">2.4 Finalidades Comerciales (Consentimiento previo, libre, informado, específico - Opt-in)</h3>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Newsletter semanal con novedades, tips de seguridad, promociones.</li>
            <li>Campañas de referidos (créditos por invitar amigos).</li>
            <li>Ofertas de aliados (seguros, mantenimiento vehicular, estacionamientos).</li>
            <li><strong>Puede revocar este consentimiento en cualquier momento</strong> desde <code>Configuración / Notificaciones</code> o respondiendo &quot;STOP&quot; a cualquier WhatsApp/SMS promocional.</li>
          </ul>
        </section>

        <section>
          <h2>3. Categorías de Datos Tratados</h2>
          <table className="w-full text-sm mt-2 border-collapse">
            <thead>
              <tr className="bg-secondary dark:bg-muted/30">
                <th className="p-2 text-left border">Categoría</th>
                <th className="p-2 text-left border">Datos</th>
                <th className="p-2 text-left border">Fuente</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t"><td className="p-2 border">Identificación</td><td className="p-2 border">Nombres, apellidos, correo, WhatsApp, foto perfil</td><td className="p-2 border">Usuario (registro)</td></tr>
              <tr className="border-t"><td className="p-2 border">Credenciales</td><td className="p-2 border">Hash contraseña, tokens OTP, sesión</td><td className="p-2 border">Usuario / Sistema</td></tr>
              <tr className="border-t"><td className="p-2 border">Ubicación</td><td className="p-2 border">Origen/destino búsquedas, GPS en viaje (opt-in), puntos frecuentes</td><td className="p-2 border">Usuario / Dispositivo</td></tr>
              <tr className="border-t"><td className="p-2 border">Vehículo (conductores)</td><td className="p-2 border">Placa, marca, modelo, color, SOAT, técnico-mecánica, licencia</td><td className="p-2 border">Usuario (publicación)</td></tr>
              <tr className="border-t"><td className="p-2 border">Transaccionales</td><td className="p-2 border">Reservas, PINs, pagos, saldo, ledger, reembolsos</td><td className="p-2 border">Sistema</td></tr>
              <tr className="border-t"><td className="p-2 border">Comunicaciones</td><td className="p-2 border">Chat interno, reportes, tickets soporte</td><td className="p-2 border">Usuario</td></tr>
              <tr className="border-t"><td className="p-2 border">Técnicos</td><td className="p-2 border">IP, user-agent, device ID, logs errores, analytics anónimos</td><td className="p-2 border">Automática</td></tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2>4. Transferencia y Encargados del Tratamiento</h2>
          <p>RutaCero no <strong>vende</strong> ni alquila datos personales. Compartimos datos solo con:</p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li><strong>Encargados (Data Processors) bajo contrato con cláusulas tipo SCC:</strong>
              <ul className="list-circle list-inside mt-1 ml-4 space-y-1">
                <li>Hosting/CDN: Vercel (EE. UU.) — Cláusulas Contractuales Tipo + TIA</li>
                <li>Base de datos: Supabase / PostgreSQL (EE. UU./UE) — SCC</li>
                <li>Pagos: Stripe (EE. UU.) — PCI DSS Level 1, SCC</li>
                <li>Mapas/Ruteo: OSRM público / Valhalla self-hosted (sin datos personales)</li>
                <li>Analytics: PostHog / Mixpanel (EE. UU.) — datos anonimizados, IP masking</li>
                <li>Comunicaciones: Twilio (WhatsApp/SMS) / SendGrid (email) — SCC</li>
              </ul>
            </li>
            <li><strong>Autoridades competentes:</strong> Solo mediante orden judicial, fiscalía o requerimiento legal válido (Ley 1581 Art. 8).</li>
            <li><strong>Conductores ↔ Pasajeros:</strong> Solo datos mínimos necesarios para el viaje (nombre, PIN, punto de encuentro, vehículo/placa) y solo tras reserva confirmada.</li>
          </ul>
        </section>

        <section>
          <h2>5. Derechos del Titular (ARCO + Portabilidad)</h2>
          <p>Conforme Art. 8 Ley 1581 y Circular 002/2015 SIC, usted tiene derecho a:</p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li><strong>Acceso:</strong> Conocer qué datos tratamos, para qué, con quién se comparten.</li>
            <li><strong>Rectificación:</strong> Corregir datos inexactos, incompletos o desactualizados.</li>
            <li><strong>Cancelación / Supresión:</strong> Eliminar sus datos cuando no sean necesarios para la finalidad original, revoque consentimiento, o termine la relación contractual (sujeto a obligaciones legales de conservación).</li>
            <li><strong>Oposición:</strong> Oponerse al tratamiento para finalidades no contractuales (marketing, analytics).</li>
            <li><strong>Portabilidad:</strong> Recibir sus datos en formato estructurado, de uso común y lectura mecánica (JSON/CSV).</li>
            <li><strong>No ser sometido a decisiones automatizadas</strong> con efectos jurídicos sin revisión humana.</li>
          </ul>
          <p className="mt-3"><strong>Ejercicio de derechos:</strong> Escriba a <a href="mailto:privacy@rutacero.co" className="text-primary underline">privacy@rutacero.co</a> con asunto &quot;Derechos ARCO - [Su Derecho]&quot;. Incluya copia de documento de identidad. Respuesta en <strong>15 días hábiles</strong> (Art. 14 Ley 1581).</p>
        </section>

        <section>
          <h2>6. Período de Conservación</h2>
          <table className="w-full text-sm mt-2 border-collapse">
            <thead>
              <tr className="bg-secondary dark:bg-muted/30">
                <th className="p-2 text-left border">Categoría</th>
                <th className="p-2 text-left border">Período</th>
                <th className="p-2 text-left border">Base Legal</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t"><td className="p-2 border">Cuenta activa</td><td className="p-2 border">Mientras la cuenta exista + 2 años tras cierre</td><td className="p-2 border">Art. 25 Ley 1480 / Art. 12 Ley 1581</td></tr>
              <tr className="border-t"><td className="p-2 border">Transacciones / Ledger</td><td className="p-2 border">5 años</td><td className="p-2 border">C. de Comercio Art. 28 / Res. DIAN</td></tr>
              <tr className="border-t"><td className="p-2 border">Chat / Comunicaciones</td><td className="p-2 border">2 años tras último mensaje</td><td className="p-2 border">Interés legítimo seguridad</td></tr>
              <tr className="border-t"><td className="p-2 border">Logs técnicos / Analytics</td><td className="p-2 border">13 meses (anonimizados a los 30 días)</td><td className="p-2 border">Interés legítimo mejora</td></tr>
              <tr className="border-t"><td className="p-2 border">Documentos conductor</td><td className="p-2 border">Mientras esté activo + 3 años</td><td className="p-2 border">Ley 769/2002 Art. 23</td></tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2>7. Medidas de Seguridad</h2>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>Cifrado en tránsito: TLS 1.3 (HTTPS obligatorio, HSTS, CSP estricto).</li>
            <li>Cifrado en reposo: AES-256 (Supabase/PostgreSQL, backups).</li>
            <li>Autenticación: OTP 5 dígitos (expira 5 min, rate-limit 5/min), sesiones JWT HttpOnly Secure SameSite=Strict, rotación 24h.</li>
            <li>Acceso mínimo: Principio de menor privilegio, logs de acceso a datos sensibles, revisiones trimestrales.</li>
            <li>Plan de respuesta a incidentes: Notificación a SIC y titulares en 72h si hay riesgo para derechos (Art. 17 Decreto 1377).</li>
            <li>Pentest anual y bug bounty (HackerOne/Intigriti - próximamente).</li>
          </ul>
        </section>

        <section>
          <h2>8. Cookies y Tecnologías Similares</h2>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li><strong>Estrictamente necesarias:</strong> Sesión, autenticación, CSRF, preferencias de idioma/tema (no requieren consentimiento).</li>
            <li><strong>Analíticas (opt-in):</strong> PostHog/Mixpanel — IP anonimizada, no tracking cross-site.</li>
            <li><strong>Marketing (opt-in):</strong> Píxeles de conversión (Meta/Google) solo si acepta en banner.</li>
            <li>Puede gestionar preferencias en <code>Configuración / Privacidad / Cookies</code>.</li>
          </ul>
        </section>

        <section>
          <h2>9. Menores de Edad</h2>
          <p>La Plataforma es para mayores de 18 años. No recopilamos intencionalmente datos de menores. Si detectamos cuenta de menor, la eliminamos y borramos sus datos en 48h. Padres/tutores pueden contactar a privacy@rutacero.co.</p>
        </section>

        <section>
          <h2>10. Transferencias Internacionales</h2>
          <p>Algunos encargados están en EE. UU. (Vercel, Stripe, Twilio, PostHog). Las transferencias se amparan en <strong>Cláusulas Contractuales Tipo (SCC) aprobadas por la Comisión Europea</strong> + <strong>Transfer Impact Assessment (TIA)</strong> documentado. Países sin decisión de adecuación: evaluamos riesgos legales (ej. FISA 702, EO 12333) e implementamos medidas suplementarias (cifrado cliente-servidor, pseudonimización).</p>
        </section>

        <section>
          <h2>11. Autorización de Tratamiento (Habeas Data)</h2>
          <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20 dark:bg-primary/10 dark:border-primary/30">
            <p className="font-semibold">Al registrarse en RutaCero, usted declara:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
              <li>Haber sido informado de forma clara, previa y expresa sobre el tratamiento de sus datos.</li>
              <li>Conocer sus derechos ARCO y cómo ejercerlos (privacy@rutacero.co).</li>
              <li>Identificar al Responsable (RutaCero S.A.S.) y al Oficial de Privacidad.</li>
              <li>Autorizar <strong>libre, voluntaria, previa, expresa e informada</strong> el tratamiento para las finalidades contractuales, de seguridad y mejora (§2.1–2.3).</li>
              <li>Entender que las finalidades comerciales (§2.4) requieren <strong>opt-in separado y revocable</strong>.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2>12. Modificaciones</h2>
          <p>Esta Política se actualizará notificando con 15 días de antelación por correo y notificación in-app. Versiones anteriores en /legal/historial. Cambios sustanciales en finalidades o transferencias requieren nuevo consentimiento.</p>
        </section>

        <section>
          <h2>13. Contacto y Reclamos ante la SIC</h2>
          <address className="not-italic mt-2 space-y-1">
            <p><strong>Oficial de Privacidad:</strong> privacy@rutacero.co | +57 2 888 XXXX</p>
            <p><strong>RutaCero S.A.S.</strong> — Cali, Valle del Cauca, Colombia</p>
            <p>Si considera que sus derechos no fueron garantizados, puede elevar reclamo ante la <strong>Superintendencia de Industria y Comercio (SIC)</strong>: <a href="https://www.sic.gov.co" target="_blank" rel="noopener" className="text-primary underline">www.sic.gov.co</a> → &quot;Protección de Datos Personales&quot;.</p>
          </address>
        </section>
      </article>
    </div>
  );
}