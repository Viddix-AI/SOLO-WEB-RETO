# RETO Health — Design Reference (extraído del prototipo aprobado)

Este paquete es la **fuente de verdad de diseño** para el portal. Se extrajo del
prototipo React empaquetado `RETO Health Storefront.html`. Úsalo en lugar de
re-parsear ese HTML de 2.9 MB.

Archivos:
- `design-tokens.css` — todas las CSS variables (`:root`) + clases base/utilidades del prototipo.
- `reto-data.js` — capa de datos original: regiones, price book, productos, diccionario i18n (en/es), specs de la cámara. Es la referencia de copy y precios; pórtalo a TS/estructuras de Next.

---

## 1. Tokens de diseño (resumen — el detalle está en design-tokens.css)

**Color**
- Fondo / escenario: `--bg #000000` (negro puro)
- Superficies: `--surface-1 #08080A`, `--surface-2 #0E0E11`, `--surface-3 #151518`, `--surface-inset #060607`
- Líneas (hairlines): blanco a 6–28% de opacidad (`--line`, `--line-soft`, `--line-strong`, `--line-hover`)
- Tinta (texto): `--ink #F4F4F2`, `--ink-2 #B6B6B4`, `--ink-3 #87878A`, `--ink-4 #5C5C5E`, `--ink-on-light #050506`
- Acento: `--accent #EDEEF0` (plata fría), `--accent-ink #050506`
- Gradiente iridiscente (del logo): `--irid: linear-gradient(100deg,#7FE3D2,#BFC6D6,#E9C9E4,#9FD8CF,#C7C3E0)`
- Estado: `--positive #8FE0B0`, `--warning #E8C98F`

**Tipografía**
- Sans: `"Helvetica Neue", Helvetica, "Inter var", Arial, sans-serif`
- Mono (labels/eyebrows/precios): `"IBM Plex Mono", ui-monospace, "SF Mono", Menlo, monospace`
- Escala fluida: `--fs-display clamp(44px,9vw,104px)` … `--fs-label 12px` (ver CSS)
- Tracking: display `-0.03em`, labels mono `0.22em`

**Espaciado / radios / sombras / easing**
- Escala `--s-1..--s-11` (4px → 180px)
- Radios `--r-xs 3px … --r-pill 999px`
- `--shadow-card`, `--shadow-pop`
- Movimiento: `--ease cubic-bezier(0.22,1,0.36,1)`, `--dur 0.55s`. Respeta `prefers-reduced-motion`.

Detalle visual: labels en mono mayúsculas (eyebrows), placeholders de imagen rayados
(`.img-ph`), inputs `.reto-input` (52px alto, superficie inset), animación EKG/heartbeat,
ticker horizontal de prueba social.

---

## 2. Regiones e i18n

Tres regiones, idioma y moneda por región:

| Región | id    | Idioma | Moneda | Símbolo | Label         |
|--------|-------|--------|--------|---------|---------------|
| US     | US    | en     | USD    | $       | United States |
| LATAM  | LATAM | es     | USD    | $       | Latinoamérica |
| EU     | EU    | es     | EUR    | €       | Europa        |

Orden: `["US","LATAM","EU"]`. Routing por región: `/us`, `/latam`, `/eu`.
Diccionario completo en/es en `reto-data.js` (objeto `T`). Claves namespaced:
`nav.*`, `brand.*`, `home.*`, `shop.*`, `p.*` (producto), `ch.*` (cámara), `bk.*` (libro),
`co.*` (checkout), `cf.*` (confirmación), `ft.*` (footer).

Marca: triada `Strength · Recovery · Clarity` / `Fuerza · Recuperación · Claridad`;
mantra `The future of health, today.`; ubicaciones `Miami · Madrid`.

---

## 3. Productos y price book

**CÁMARA HIPERBÁRICA** (`id: chamber`, producto **estrella**, `hero: true`, kind hardware)
- US: `$64,900` USD · EU: `€69.900` EUR · LATAM: **bajo consulta** (`onRequest: true`, sin precio)
- NO es compra directa → botón "Solicitar · Contactar" que abre formulario de solicitud → guarda LEAD.
- Specs (8, bilingües) en `reto-data.js` → `CHAMBER_SPECS`: presión hasta 2.0 ATA, O₂ hasta 95%,
  carcasa acero+vidrio, 1 persona, 230×95×120 cm, control táctil + app RETO, instalación white-glove
  incluida, garantía 2 años.

**EL MÉTODO RETO / THE RETO METHOD** (`id: book`, `hero: false`, kind book)
- US: `$29.99` · EU: `€29,99` · LATAM: `$29.99 USD`
- Compra directa on-site (Stripe en Bloque D). Tapa dura · 312 páginas · envío 3–5 días hábiles.

---

## 4. Pantallas del prototipo (mapa de rutas a portar)

El prototipo define estas pantallas (en `app.js`, objeto `SCREENS`):

| Screen        | Rol                                                        |
|---------------|------------------------------------------------------------|
| home          | Landing: hero, ciencia, prueba social (atletas NBA/LaLiga/UFC), teaser productos, clínicas Miami/Madrid, CTA final |
| shop          | Marketplace: grid, cámara como estrella, libro secundario, filtros All/Hardware/Protocol |
| chamber       | Ficha producto cámara: galería, benefits, specs, CTA "Solicitar" |
| book          | Ficha producto libro: about, formato, CTA "Comprar"        |
| request       | Formulario de solicitud de la cámara (→ lead)              |
| checkout      | Checkout del libro (contacto, billing/shipping, pago)      |
| confirmation  | Confirmación de pedido / de solicitud recibida            |
| ds            | Design System interno (no portar a producción)             |

Notas de UX del prototipo: chrome = Nav (logo + selector región) + Footer; selector de región
cambia idioma y moneda en vivo; estado persistido en localStorage (región, device, carrito).
El "ControlRail" y el "device frame" (mobile/desktop) son **andamiaje de presentación del prototipo**,
NO parte del producto final — no los portes.

---

## 5. Cómo lo usa Claude Code

1. Bloque A: copia `design-tokens.css` como CSS global (variables) y configura fuentes.
   Pon el logo en `/public`.
2. Bloque A: deriva el diccionario i18n y la config de regiones desde `reto-data.js`.
3. Bloques B–C: porta pantallas home/shop/chamber/book/request usando estos tokens y copy.
4. Mantén los textos exactos (en/es) del diccionario para fidelidad de marca.
