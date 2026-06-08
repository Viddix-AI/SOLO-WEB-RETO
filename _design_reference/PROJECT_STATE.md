# RETO Portal — Estado del proyecto (contexto compacto)

Rol: Cowork = asesor estratégico; **Claude Code (local) ejecuta**. Yo doy prompts afinados
bloque a bloque y valido cada CHECKPOINT por DOM vía Chrome MCP (localhost:3100).
Repo local del usuario: `~/code/reto-portal` (Next.js 15 + TS + Tailwind v3 + pnpm).
Paquete de diseño en `RETO/WEB/_design_reference/` (tokens, reto-data.js, prototype-src/, DESIGN_REFERENCE.md).

## Arquitectura (decisiones tomadas)
- **3 regiones** US (en/USD) · LATAM (es/USD) · EU (es/EUR). Rutas /us /latam /eu (SSG).
- **Libro** "El Método RETO" ($29.99 / €29,99) → **Amazon Pay** on-site (Checkout v2), activado
  por región según haya credenciales. Amazon Pay solo opera `us`/`eu`/`jp` → **LATAM libro =
  "Próximamente"** siempre. Sin pago propio, sin DOB.
- **Cámara hiperbárica** ($64,900 / €69.900 / LATAM bajo consulta) → NO compra directa. Lead →
  formulario solicitud → **QuickBooks Online**: crea Customer + Invoice con link de pago. QBO online
  payment = **US-only**; EU/LATAM = cobro offline/concierge.
- **QBO es el sistema de registro** (leads/facturas/estado viven en QuickBooks). **Sin Supabase.**
- **Supabase APARCADO** (en repo, desactivado). **Sin logins** todavía (lobby/auth/admin diferidos).
- **Stripe ELIMINADO** por completo.

## Bloques (guía A–J)
- **A** Fundación, tokens, i18n en/es, regiones, layout. ✅ validado.
- **B** Web pública (home: hero, ciencia, prueba social NBA·LaLiga·UFC, teaser, clínicas, CTA). ✅ validado.
- **C** Marketplace (tienda, fichas cámara/libro, formulario solicitud, mock). ✅ validado.
  - Fix aplicado: SecureNote del formulario de solicitud ya NO menciona tarjeta ("concierge replies within 24h").
- **D (rehecho)** Checkout libro = Amazon Pay sandbox, gating por región. ✅ código/seguridad/gating
  validados por DOM. **Falta CHECKPOINT del usuario**: credenciales sandbox + ngrok + compra prueba.
- **E** Supabase persistencia → **OMITIDO** (QBO/Amazon hacen de DB).
- **F** QuickBooks (OAuth2 sandbox, lead→Invoice+link, webhook firma verificada, red de seguridad
  email). ✅ código/seguridad validados; form de cámara intacto. **Falta CHECKPOINT del usuario**:
  conectar Intuit sandbox + ngrok + crear factura.
- **G/H** Auth + lobby + provisión de cuentas → **DIFERIDOS** (sin logins por ahora).
- **I** Admin → pendiente (necesitaría su propia auth).
- **J** Pulido + deploy Vercel → pendiente.

## Flags / deuda conocida
- ⚠️ **Deploy bloqueante**: tokens QBO en fichero `.data/qbo-tokens.json` NO persisten en Vercel
  (FS efímero) y el refresh token rota → en producción se pierde la conexión QBO. Al desplegar hace
  falta un mini-almacén persistente (Vercel KV / Upstash / 1 fila Postgres) solo para el token.
- EU multidivisa: facturas /eu en EUR requieren multimoneda activada en la company sandbox; si no,
  el lead cae a respaldo email (no crashea).
- EU/LATAM cámara: sin pago online QBO (US-only) → cobro manual/concierge. Decisión consciente.

## Env vars en juego (.env.local, gitignored; nunca a git ni al chat)
- Amazon Pay: AMAZON_PAY_US_/EU_ MERCHANT_ID, STORE_ID, PUBLIC_KEY_ID, PRIVATE_KEY (.pem) + AMAZON_PAY_SANDBOX=true
- QBO: QBO_CLIENT_ID, QBO_CLIENT_SECRET, QBO_REDIRECT_URI, QBO_WEBHOOK_VERIFIER_TOKEN, QBO_ENVIRONMENT=sandbox
- Resend (respaldo lead, opcional): RESEND_API_KEY, OWNER_EMAIL, RESEND_FROM_EMAIL

## Próximas opciones
1. Probar D y F en sandbox (CHECKPOINTs del usuario) → desplegar a Vercel (con almacén de tokens).
2. Admin (Bloque I) — ver leads, generar/trackear facturas QBO, gestionar productos/precios.
3. Resolver el almacén de tokens QBO antes del deploy.

Pendientes del usuario (Parte 0): precio cámara LATAM (= bajo consulta), dominio (subdominio vs apex),
hex acento/fuente definitivos (ahora monocromo), logo oficial (ahora wordmark vectorial placeholder).
