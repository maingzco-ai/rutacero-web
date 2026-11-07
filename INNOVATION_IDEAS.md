# RutaCero — Ideas de Innovación Estratégica (Colombia 2026)

> **Contexto**: Cali/Valle, corredor universitario (ICESI, Javeriana, UAO, Univalle), estratos 2-4, cultura de "parche", desconfianza apps, efectivo rey, WhatsApp nativo.
> **Competencia**: Uber, DiDi, inDriver, Picap, Taxis Amigos, MetroCali, buses, informalidad.
> **Restricciones**: Regulación en borrador (Decreto 1079/2015, Acuerdos municipales), inseguridad, infraestructura vial, informalidad laboral.

---

## 1. DIFERENCIACIÓN DEFENSIBLE (Moats)

### 1.1 **Network Effect Localizado: "RutaCero Corredores"**
- **Concepto**: No compitas en toda la ciudad. Domina **corredores de alta densidad** (Sur: Univalle→ICESI→Javeriana→UAO; Norte: Chipichape→Centro).
- **Mecánica**: Matchmaking predictivo por corredor + hora. "Cada 5 min sale un carro desde Unicentro a ICESI".
- **Moat**: Densidad de oferta/demanda en corredor → tiempo de espera <3 min → switching cost alto.
- **KPI**: % viajes completados en corredores core > 80%; tiempo medio espera < 4 min.

### 1.2 **Data Moat: "Perfil de Confianza Comportamental"**
- **Inputs**: Puntualidad real (GPS), rating bilateral, cancelaciones, no-shows, verificación docs, referidos, antigüedad.
- **Output**: **Trust Score 0-100** visible en perfil. Conductor >80 = "Conductor Verificado ✓" (badge dorado).
- **Uso**: Matching prioritario, pricing preferencial, acceso a corredores premium, seguros mejores tasas.
- **Moat**: Historial no portable → switching cost altísimo.

### 1.3 **Brand Moat: "Seguridad Primero, No Solo Precio"**
- **Diferenciador vs inDriver/Uber**: Precio fijo justo (no subasta) + verificación documental obligatoria + botón SOS + compartir viaje en vivo + seguro RC contractual.
- **Narrativa**: "El carro de tu compañero de clase, verificado por la uni".

---

## 2. BEHAVIORAL DESIGN (Hook Model + Nudges)

### 2.1 **Onboarding 1-Tap: WhatsApp Native Login** 
- **Problema**: Email + OTP 5 dígitos = fricción alta, drop-off 40%.
- **Solución**: **WhatsApp Business API** → "Continuar con WhatsApp" → prefill nombre/foto/celular → OTP automático en chat → listo en 10 seg.
- **Validación**: A/B test vs email flow. Meta: CTR > 60%, completion > 85%.
- **Legal**: Consentimiento explícito para notificaciones transaccionales por WhatsApp (Ley 527/1999 Art. 15).

### 2.2 **Gamificación Conductor: "Rachas y Niveles"**
- **Mecánica**: 
  - **Racha diaria**: 5 viajes/día = +$5.000 COP bono semanal.
  - **Niveles**: Novato → RutaPass (50 viajes) → Embajador (200 viajes) → Leyenda (500).
  - **Perks por nivel**: Prioridad matching, comisión 0%, seguro gratis, sticker físico carro.
- **Psych**: Loss aversion (racha), status (niveles), social proof (sticker visible).
- **KPI**: Retención D30 conductor > 40%; viajes/conductor/semana > 15.

### 2.3 **Viral Loop Pasajero: "Crédito Compartido $5k c/u"**
- **Mecánica**: Pasajero invita amigo → ambos reciben $5.000 COP tras primer viaje completado del invitado.
- **Canal**: WhatsApp nativo (deep link `rutacero.co/invita/UID` abre chat pre-llenado).
- **Fraud guard**: Solo paga si invitado completa viaje + verifica OTP + no es mismo dispositivo/IP.
- **KPI**: K-factor > 0.3; CAC < $15.000 COP.

### 2.4 **Nudge Puntualidad: "Compromiso Mutuo"**
- **Pre-viaje**: Ambos confirman "Llego a tiempo" (botón único). Si uno no confirma 10 min antes → alerta al otro.
- **Post-viaje**: Rating obligatorio 1-tap (👍/👎) + opcional comentario. Promedio > 4.7 = badge.
- **Psych**: Compromiso público + reciprocidad.

---

## 3. UNIT ECONOMICS INNOVATION

### 3.1 **Pricing Dinámico por Corredor + Hora** (v2)
| Corredor | Hora Pico | Tarifa Base | Multiplicador |
|----------|-----------|-------------|---------------|
| Sur (Univalle→ICESI) | 6-8am / 5-7pm | $4.500 | 1.0x |
| Sur | Valle | $4.500 | 0.9x |
| Norte (Chipichape→Centro) | 6-9am | $5.000 | 1.1x |
| Cross-city | Cualquiera | $6.000 | 1.2x |

- **Regla**: Nunca > taxi oficial + 20% (Acuerdo 031/2022 Cali).
- **Transparencia**: Usuario ve desglose: "Base $4.500 + Pico $0 = $4.500".

### 3.2 **Suscripción "RutaPass" (B2C)**
- **Plan**: $45.000 COP/mes → 20 viajes/mes (cualquier corredor) + prioridad matching + cancelación gratis 1h antes.
- **Unit Econ**: LTV pasajero ↑ 3x; churn ↓ 50%; cash flow recurrente.
- **Break-even**: 12 viajes/mes ($3.750/viaje vs $4.500 spot).

### 3.3 **B2B: "RutaCero Empresas / Universidades"**
- **Universidades**: Convenio ICESI/Javeriana/UAO/Univalle → crédito semestral $50.000 COP/estudiante → facturación mensual a uni.
- **Empresas**: Parqueaderos corporativos → empleados reservan cupos fijos → facturación centralizada.
- **KPI**: % viajes B2B > 30% en 12 meses; ARPU B2B 4x B2C.

---

## 4. SUPPLY-SIDE INNOVATION (Conductores)

### 4.1 **Onboarding Conductor Express (48h)**
1. **Día 0**: Registro WhatsApp → sube fotos licencia/SOAT/técnico-mecánica → OCR auto-valida (AWS Textract/Google Vision).
2. **Día 1**: Verificación background check (RUNT, antecedentes) → video-call 5 min verificación identidad.
3. **Día 2**: Kit bienvenida (sticker, manual, seguro RC activado) → primera ruta guiada por "Embajador".
- **Meta**: Time-to-first-ride < 48h; aprobación > 80%.

### 4.2 **Flota Híbrida: Moto + Carro + Bici Cargo**
- **Moto**: Tramos cortos (<5km), 1 pasajero, $3.000 COP. Regulación: Decreto 1079/2015 Art. 2.2.3.2.3.
- **Bici Cargo**: Última milla campus, 2 pasajeros, $2.500 COP. Aliado: CicloRutas Cali.
- **Matching**: Algoritmo sugiere modo óptimo por distancia/tráfico/hora.

### 4.3 **Seguro RC Contractual Grupal (Negociación Colectiva)**
- **Problema**: Seguro individual $300-500k/año = barrera entrada.
- **Solución**: Póliza maestra RutaCero + SURA/SBS → $80k/año/conductor (volumen 500+).
- **Cobertura**: $500M COP por evento, $1.500M agregado. Incluye pasajeros.
- **Funding**: RutaCero subsidia 50% primer año; conductor paga $40k/año (deducido de ganancias semanales).

---

## 5. DEMAND-SIDE INNOVATION (Pasajeros)

### 5.1 **Ruta Programada "Mi Ruta Diaria"**
- **Concepto**: Pasajero define "Lunes-Viernes 7:00am Unicentro→ICESI" → sistema busca conductor recurrente → match fijo semanal.
- **Beneficio**: Conductor ingresos garantizados; pasajero mismo conductor, confianza, precio fijo.
- **Retención**: D30 > 60% para rutas programadas vs 25% spot.

### 5.2 **Modo "Acompañante" (Seguridad Nocturna)**
- **Feature**: Pasajero comparte viaje en vivo con 3 contactos de confianza (WhatsApp) + botón SOS → alerta a contactos + Policía (línea 123) + RutaCero Safety Team.
- **Trigger automático**: Si viaje > 15 min sin movimiento en zona roja (heatmap incidentes) → check-in automático.

### 5.3 **Pagos Flexibles: "Paga Después" (BNPL Ligero)**
- **Mecánica**: Pasajero sin saldo → "Pagar en 48h" (sin interés) → límite $50.000 COP → score de confianza > 60.
- **Cobro**: Intento automático billetera/Nequi/tarjeta a 48h → falla = suspensión + reporte Datacrédito (si > $20k).
- **Riesgo**: Default rate < 3% (validar con piloto 1k usuarios).

---

## 6. TECH MOATS

### 6.1 **Matching Predictivo: "Próximo Carro en 2 Min"**
- **Inputs**: Histórico demanda por corredor/hora, posición conductores en tiempo real, eventos (partidos, conciertos), clima.
- **Output**: Probabilidad match < 3 min → notifica conductor "Activa modo disponible en corredor Sur ahora".
- **Stack**: Valhalla (routing) + Redis (geo-index) + Kafka (eventos) + LightGBM (demand forecast).

### 6.2 **Fraud Detection: "Score de Confianza en Tiempo Real"**
- **Señales**: Múltiples cuentas mismo dispositivo/IP, patrones cancelación, GPS spoofing (velocidad > 120km/h en ciudad), pagos fallidos recurrentes.
- **Acción**: Shadow ban (matching degradado), revisión manual, bloqueo dispositivo.
- **KPI**: Fraud loss < 0.5% GMV.

### 6.3 **Infra Propia: OSRM/Valhalla Self-Hosted**
- **Problema**: OSRM público rate-limit 1 req/s, sin SLA, datos desactualizados.
- **Solución**: Valhalla en Railway/Render ($20/mes) + datos OpenStreetMap Colombia actualizados semanalmente.
- **Beneficio**: 100 req/s, routing multimodal (carro/moto/bici/transporte público), isochronas para heatmap demanda.

---

## 7. REGULATORY ARBITRAGE (Compliance as Feature)

### 7.1 **Registro Obligatorio MinTIC / Secretaría Movilidad Cali**
- **Acción**: Registro proactivo como "Plataforma de Intermediación de Transporte Compartido Privado" (Decreto 1079/2015 Art. 2.2.3.2.1).
- **Ventaja**: Primera en Cali con registro → credibilidad con autoridades → voz en mesa de regulación.

### 7.2 **White-Label para Municipios / Empresas**
- **Producto**: "RutaCero Campus" → uni/empresa opera su propia flota (buses, carros oficiales) con nuestra tech.
- **Ingresos**: SaaS $2M COP/mes + % transacciones.
- **Moat**: Lock-in institucional; datos de movilidad propiedad del cliente.

### 7.3 **Alianza Seguros Obligatorios (SOAT + RC)**
- **Partnership**: SURA / SBS / Allianz → venta embebida en app (conductor compra SOAT/RC con 1 click, precio preferencial).
- **Revenue**: Comisión 5-10% prima + data de siniestralidad para pricing dinámico.

---

## 8. EXPERIMENT DESIGN (Próximos 90 Días)

| Experimento | Hipótesis | Métrica Norte | Tamaño Muestra | Duración | Go/No-Go |
|-------------|-----------|---------------|----------------|----------|----------|
| **WhatsApp Login** | Completion rate > email+OTP | Onboarding completion % | 50/50 A/B | 2 sem | >75% completion |
| **Racha Conductor $5k/sem** | +30% retención D30 | D30 retention conductores | 100 conductores | 4 sem | >40% D30 |
| **Referido $5k c/u** | K-factor > 0.3 | Invitaciones → viajes completados | 500 pasajeros | 3 sem | >150 viajes ref |
| **Ruta Programada** | D30 > 60% vs 25% spot | Retención D30 programados | 50 rutas fijas | 6 sem | >60% D30 |
| **Valhalla Self-Hosted** | Latencia p95 < 200ms | API latency, match rate | 100% tráfico | 1 sem | p95 < 200ms |

---

## 9. PRIORIZACIÓN RICE (Top 10)

| # | Idea | Reach | Impact | Confidence | Effort | RICE Score |
|---|------|-------|--------|------------|--------|------------|
| 1 | **WhatsApp Native Login** | 10,000 | 3 | 0.85 | 2 | **12,750** |
| 2 | **Referidos Viral $5k c/u** | 15,000 | 2 | 0.80 | 2 | **12,000** |
| 3 | **Pagos Efectivo + Nequi/DaviPlata** | 12,000 | 3 | 0.90 | 3 | **10,800** |
| 4 | **Racha Conductor + Niveles** | 5,000 | 3 | 0.70 | 3 | **3,500** |
| 5 | **Ruta Programada (Suscripción)** | 3,000 | 3 | 0.60 | 5 | **1,080** |
| 6 | **Valhalla Self-Hosted** | 10,000 | 2 | 0.95 | 2 | **9,500** |
| 7 | **Seguro RC Grupal** | 2,000 | 3 | 0.60 | 5 | **720** |
| 8 | **Modo Acompañante/SOS** | 8,000 | 2 | 0.75 | 3 | **4,000** |
| 9 | **B2B Universidades/Empresas** | 1,000 | 3 | 0.50 | 8 | **188** |
| 10 | **Fraud Detection ML** | 10,000 | 1 | 0.70 | 5 | **1,400** |

---

## 10. PRÓXIMOS PASOS INMEDIATOS (Esta Semana)

1. **Tech**: Deploy Valhalla self-hosted (Railway) + migra `calculateRoute` → valhalla local.
2. **Legal**: Registro MinTIC/Secretaría Movilidad Cali + póliza RC grupal cotización.
3. **Product**: WhatsApp Business API setup (Meta Developer) + flow onboarding 1-tap.
4. **Growth**: Referral system backend + deep links WhatsApp.
5. **Ops**: Kit bienvenida conductor (stickers, manual, QR verificación) → impresión 500 uds.

---

> **Nota**: Este documento es vivo. Cada experimento actualiza confidence y effort. Revisar semanalmente en Growth Meeting.